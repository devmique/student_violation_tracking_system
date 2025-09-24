import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email:string;
    password: string;
    profilePic?: string;
}

const UserSchema: Schema = new Schema<IUser>({
username: { type: String, required: true, unique: true },
email: { type: String, required: true, unique: true },
password: { type: String, required: true },
profilePic: { type: String, default: ''}
}, {
timestamps: true,
})

export default mongoose.model<IUser>('User', UserSchema);