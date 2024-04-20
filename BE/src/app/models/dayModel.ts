import mongoose, { Document, Schema } from "mongoose";

export interface IDay extends Document {
    day: string;
    availableAt:string;
    availableUntil:string;
    coach: Schema.Types.ObjectId;
}

const daySchema: Schema = new Schema({
    day: { type: String, required: true },
    availableAt: { type: String, required: true },
    availableUntil: { type: String, required: true },
    coach: { type: Schema.Types.ObjectId, ref: 'Coach' }
}, { timestamps: true })

export default mongoose.model<IDay>("Day", daySchema)