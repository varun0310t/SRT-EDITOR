import mongoose from "mongoose";

const Userschema = new mongoose.Schema({
    Name: String,
    Username: String,
    Email: String,
    IsVerified: Boolean,

})

const User = mongoose.model("User") || mongoose.model("User", Userschema);

export default User;
