import mongoose, { Schema, Document } from 'mongoose';
// Ensure you use the same KeyDoc type from Lucia

interface KeyDoc extends Document {
	_id: string;  
	user_id: string;
	hashed_password?: string;  

}

const KeySchema = new Schema({
	_id: { type: String, required: true },
	user_id: {
		type: String,
		required: true,
	},
	hashed_password: {
		type: String,  // Ensure no `null` type here
		required: false,  // Make this field optional
	},
	// other fields
});

const Key =mongoose.models.Key ||mongoose.model<KeyDoc>('Key', KeySchema);
export default Key;
