import { model, Schema, Document } from 'mongoose';

export interface UserDoc extends Document {
    _id: string;
    userId: string; 
    Name: string;
    Email: string;
    Username: string;
    IsVerified: Boolean,
}

export interface KeyDoc extends Document {
    _id: string;
    user_id: string;
    hashed_password?: string;

}
export interface SessionDoc extends Document {
    _id: string;
    user_id: string;
    active_expires: number;
    idle_expires: number;
}