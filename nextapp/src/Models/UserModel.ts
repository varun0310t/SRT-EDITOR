import mongoose from "mongoose";
import { lucia } from "lucia";
import { UserDoc } from "../types/ModelTypes";

const Userschema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    Name: String,
    Username: String,
    Email: String,
    IsVerified: Boolean,
    Projects: [
      {
        ProjectID: String,
        title: String,
        videoFile: String,
        videoFileurl: String,
        subtitleFile: String,
        subtitleFileurl: String,
        lastEdited: Date,
        thumbnailurl: String,
      },
    ],
  },
  { _id: false }
);

const User = mongoose.models.User || mongoose.model("User", Userschema);

export default User;
