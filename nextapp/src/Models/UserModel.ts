import mongoose from "mongoose";
import { lucia } from "lucia";
import { UserDoc } from "../types/ModelTypes";

const Userschema = new mongoose.Schema({
    _id: { type: String, required: true },
    Name: String,
    Username: String,
    Email: String,
    IsVerified: Boolean,

}, { _id: false });

const User = mongoose.models.User || mongoose.model("User", Userschema);

export default User;
