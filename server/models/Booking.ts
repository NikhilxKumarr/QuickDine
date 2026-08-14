import {Document,model,Schema,Types } from 'mongoose'
import { IUser, UserSchema } from './User.js';
import crypto from 'crypto';

export interface IBooking extends Document {
    user: Types.ObjectId;
    restaurant: Types.ObjectId;
    date: Date;
    time: string;
    guests: number;
    occasion?: string;
    specialRequests?: string;
    status: 'Confirmed' | 'Cancelled' | 'Completed';
    bookingId: string;
    createdAt: Date;
    updatedAt: Date;
}

export const BookingSchema = new Schema<IBooking>(
    {
        user: { type: Types.ObjectId, ref: 'User', required: true },
        restaurant: { type: Types.ObjectId, ref: 'Restaurant', required: true },
        date: { type: Date, required: true },
        time: { type: String, required: true },
        guests: { type: Number, required: true },
        occasion: { type: String , trim: true},
        specialRequests: { type: String , trim: true},
        status: { type: String, enum: ['Confirmed', 'Cancelled', 'Completed'], default: 'Confirmed' },
        bookingId: { type: String,  unique: true },
    },
    { timestamps: true }
);


BookingSchema.pre("save",function() {
    if(!this.bookingId){
        this.bookingId = `GR-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
    }
});

export const Booking = model<IBooking>('User', BookingSchema);