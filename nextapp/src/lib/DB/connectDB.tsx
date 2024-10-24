import mongoose from 'mongoose';
import { lucia } from 'lucia';
import { mongoose as mongooseAdapter } from "@lucia-auth/adapter-mongoose"
import User from '@/Models/UserModel';
import Session from '@/Models/SessionModel';
import Key from '@/Models/keysModel';
import { Env } from 'lucia'
import { UserDoc } from '@/types/ModelTypes';
connectDB();
export const auth = lucia({
  adapter: mongooseAdapter({
    User: User,
    Key: Key as mongoose.Model<any>,
    Session: Session

  }),
  getUserAttributes: (databaseUser: UserDoc) => {
    return {
      Username: databaseUser.Username,
      Name: databaseUser.Name,
      Email: databaseUser.Email,
      IsVerified: databaseUser.IsVerified,
    };
  },
  secret: process.env.SECRET as string,
  env: process.env.NODE_ENV as Env,
})
const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

export default async function connectDB() {
  if (mongoose.connections[0].readyState) return;

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}