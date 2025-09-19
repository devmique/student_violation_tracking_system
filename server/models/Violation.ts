import mongoose, {Document, Schema} from "mongoose";

export type ViolationSeverity = "Minor" | "Major";

export interface IViolation extends Document {
    studentId: mongoose.Types.ObjectId;
    description: string;
    severity: ViolationSeverity;
    dateCommitted: Date;
 
    createdAt: Date;
    createdBy: string;
    notes?: string;
}

const ViolationSchema: Schema = new Schema<IViolation>({
    studentId:  { type: Schema.Types.ObjectId, ref: "Student", required: true},
    description: { type: String, required: true},
    severity: { type: String, enum: ["Minor", "Major"], required: true},
    dateCommitted: { type: Date, required: true},
    createdBy: { type: String, required: true},
    notes: {type:String},


    
}, { timestamps: true });

export default mongoose.model<IViolation>("Violation", ViolationSchema)