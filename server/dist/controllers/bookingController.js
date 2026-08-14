import { Booking } from "../models/Booking.js";
import { RestaurantModel } from "../models/Restaurants.js";
// ======================================================
// Create a new booking
// POST /api/bookings
// @access Private
// ======================================================
export const createBooking = async (req, res) => {
    try {
        const { restaurant, bookingDate, timeSlot, guests, specialRequest, } = req.body;
        // User comes from auth middleware
        const user = req.user?.id;
        if (!user) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }
        // Check restaurant exists
        const restaurantExists = await RestaurantModel.findById(restaurant);
        if (!restaurantExists) {
            res.status(404).json({
                success: false,
                message: "Restaurant not found",
            });
            return;
        }
        // Check duplicate booking
        const existingBooking = await Booking.findOne({
            user,
            restaurant,
            bookingDate: new Date(bookingDate),
            timeSlot,
            status: {
                $in: ["pending", "confirmed"],
            },
        });
        if (existingBooking) {
            res.status(400).json({
                success: false,
                message: "You already have a booking for this time slot.",
            });
            return;
        }
        const booking = await Booking.create({
            user,
            restaurant,
            bookingDate,
            timeSlot,
            guests,
            specialRequest,
            status: "pending",
        });
        await booking.populate("restaurant", "name image location");
        res.status(201).json({
            success: true,
            message: "Booking created successfully.",
            booking,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
export const getMyBooking = async (req, res) => {
    try {
        const user = req.user?.id;
        if (!user) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }
        const bookings = await Booking.find({ user })
            .populate("restaurant", "name image location slug")
            .sort({ bookingDate: 1 });
        res.status(200).json({
            success: true,
            bookings,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
export const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user.id;
        const booking = await Booking.findById(id);
        if (!booking) {
            res.status(404).json({
                success: false,
                message: "Booking not found",
            });
            return;
        }
        // Sirf apni booking cancel kar sake
        if (booking.user.toString() !== user) {
            res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }
        // Already cancelled
        if (booking.status === "cancelled") {
            res.status(400).json({
                success: false,
                message: "Booking already cancelled",
            });
            return;
        }
        booking.status = "cancelled";
        await booking.save();
        res.status(200).json({
            success: true,
            message: "Booking cancelled successfully",
            booking,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
