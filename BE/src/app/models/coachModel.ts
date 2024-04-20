import mongoose, { Document, Schema } from "mongoose";

export interface ICoach extends Document {
    name: string;
    timezone:string;
    days: Schema.Types.ObjectId[];
}

const coachSchema: Schema = new Schema({
    name: { type: String, required: true },
    timezone: { type: String, required: true },
    days: [{ type: Schema.Types.ObjectId, ref: 'Day' }]
}, { timestamps: true })

export default mongoose.model<ICoach>("Coach", coachSchema)