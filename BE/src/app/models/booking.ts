import mongoose, { Document, Schema } from "mongoose";

export interface IBooking extends Document {
    email: string;
    coach: Schema.Types.ObjectId;
    day: Schema.Types.ObjectId;
    slot: Schema.Types.ObjectId;
}

const bookingSchema: Schema = new Schema({
    email: { type: String, required: true },
    coach: { type: Schema.Types.ObjectId, ref: 'Coach' },
    day: { type: Schema.Types.ObjectId, ref: 'Day' },
    slot: { type: Schema.Types.ObjectId, ref: 'Slot' }
}, { timestamps: true })

export default mongoose.model<IBooking>("Booking", bookingSchema)