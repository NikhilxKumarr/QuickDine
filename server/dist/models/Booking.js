import { model, Schema, Types } from 'mongoose';
import crypto from 'crypto';
export const BookingSchema = new Schema({
    user: { type: Types.ObjectId, ref: 'User', required: true },
    restaurant: { type: Types.ObjectId, ref: 'Restaurant', required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    guests: { type: Number, required: true },
    occasion: { type: String, trim: true },
    specialRequests: { type: String, trim: true },
    status: { type: String, enum: ['Confirmed', 'Cancelled', 'Completed'], default: 'Confirmed' },
    bookingId: { type: String, unique: true },
}, { timestamps: true });
BookingSchema.pre("save", function () {
    if (!this.bookingId) {
        this.bookingId = `GR-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
    }
});
export const Booking = model('User', BookingSchema);
