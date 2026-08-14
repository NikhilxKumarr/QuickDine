import { RestaurantModel } from '../models/Restaurants.js';
import jwt from "jsonwebtoken";
import { UserModel } from "../models/User.js";
import { Booking } from '../models/Booking.js';
//Get all restaurants with search and filter 
//Get /api/restaurents 
export const getRestaurants = async (req, res) => {
    try {
        const { search, priceRange, rating, location, sort } = req.query;
        const queryObj = { status: 'approved' };
        if (search) {
            queryObj.$or = [
                { name: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } },
            ];
        }
        if (priceRange) {
            const prices = Array.isArray(priceRange) ? priceRange : [priceRange];
            queryObj.priceRange = { $in: prices };
        }
        if (rating) {
            queryObj.rating = { $gte: parseFloat(rating) };
        }
        if (location) {
            queryObj.location = { $regex: location, $options: 'i' };
        }
        let sortOption = { createdAt: -1 }; // Default sort by createdAt in descending order
        if (sort === 'rating') {
            sortOption.rating = -1; // Sort by rating in descending order
        }
        else if (sort === 'price') {
            sortOption.priceRange = 1; // Sort by price in ascending order
        }
        const restaurants = await RestaurantModel.find(queryObj).sort(sortOption);
        res.status(200).json(restaurants);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
//Get featured and exclusive restaurants
//Get /api/restaurants/featured
export const getFeaturedRestaurants = async (req, res) => {
    try {
        const featured = await RestaurantModel.find({
            status: 'approved',
            $or: [{ featured: true }, { exclusive: true }],
        }).limit(6);
        res.status(200).json(featured);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
//Get  restaurant by slug 
//Get /api/restaurants/:slug
export const getRestaurantBySlug = async (req, res) => {
    try {
        const restaurant = await RestaurantModel.findOne({ slug: req.params.slug });
        if (!restaurant) {
            res.status(404).json({ message: 'Restaurant not found' });
            return;
        }
        //if not approved verify authentication (owner or admin)
        if (restaurant.status !== 'approved') {
            let isAuthorized = false;
            if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
                try {
                    const token = req.headers.authorization.split(" ")[1];
                    const decoded = jwt.verify(token, process.env.JWT_SECRET);
                    const user = await UserModel.findById(decoded.id);
                    if (user && (user.role === 'admin' || user.id === restaurant.owner.toString())) {
                        isAuthorized = true;
                    }
                }
                catch (error) {
                    //Ignore token verify error 
                }
            }
            if (!isAuthorized) {
                res.status(403).json({ message: 'Not authorized to view this restaurant' });
                return;
            }
        }
        res.status(200).json(restaurant);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
//Get  dynamic seat availability for slots 
//Get /api/restaurants/:id/availability
export const getRestaurantAvailability = async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) {
            res.status(400).json({ message: 'Please provide a date' });
            return;
        }
        const restaurant = await RestaurantModel.findById(req.params.id);
        if (!restaurant) {
            res.status(404).json({ message: 'Restaurant not found' });
            return;
        }
        const bookingDate = new Date(date);
        //Get all active bookings for the restaurant on the given date
        const bookings = await Booking.find({
            restaurant: restaurant._id,
            date: bookingDate,
            status: 'Confirmed',
        });
        //Map slots to available seats
        const availability = restaurant.availableSlots.map(slot => {
            const bookedSeats = bookings
                .filter((b) => b.time === slot)
                .reduce((total, b) => total + b.guests, 0);
            const totalSeats = restaurant.totalSeats || 20;
            const availableSeats = Math.max(totalSeats - bookedSeats, 0);
            return {
                time: slot,
                availableSeats,
                isAvailable: availableSeats > 0,
            };
        });
        res.status(200).json(availability);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
