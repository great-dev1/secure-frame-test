import mongoose, { Document, Schema } from "mongoose";

export interface ISlot extends Document {
    availableAt: string;
    availableUntil: string;
    booked: boolean;
    day: Schema.Types.ObjectId;
}

const slotSchema: Schema = new Schema({
    availableAt: { type: String, required: true },
    availableUntil: { type: String, required: true },
    booked: { type: Boolean, default: false },
    day: { type: Schema.Types.ObjectId, ref: 'Day' }
}, { timestamps: true })

export default mongoose.model<ISlot>("Slot", slotSchema)