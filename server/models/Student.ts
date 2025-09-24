import mongoose, { Document, Schema, Types } from "mongoose";

export interface IStudent extends Document {
    _id: Types.ObjectId;
    studentId: string;
    firstName: string;
    middlename?: string;
    lastName: string;
    course: string;
    program: string;
    year: number;
    email: string;
    createdAt: Date;
    updatedAt: Date; 
      user: mongoose.Schema.Types.ObjectId; 
      profilePic?: string;
}

const StudentSchema: Schema = new Schema<IStudent>({
    studentId: { type: String, required: true, unique: true},
    firstName: { type: String, required: true },
    middlename: { type: String},
    lastName: { type: String, required: true },
    course: { type: String, required: true },
    program: { type: String, required: true },
    year: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    profilePic: { type: String, default: '' },
}, { timestamps: true
})

export default mongoose.model<IStudent>("Student", StudentSchema)