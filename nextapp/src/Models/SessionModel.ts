import mongoose from "mongoose";

//make type interface for this schema 
//make a model for this schema


const SessionSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: true
        },
        user_id: {
            type: String,
            required: true
        },
        active_expires: {
            type: Number,
            required: true
        },
        idle_expires: {
            type: Number,
            required: true
        }
    } as const,
    { _id: false }
)

const Session = mongoose.models.Session || mongoose.model("Session", SessionSchema);

export default Session; 