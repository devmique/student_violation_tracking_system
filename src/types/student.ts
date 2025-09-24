export interface Student {
  _id: string;
  studentId: string;
  firstName: string;
  middlename?: string;
  lastName: string;
  course: Course;
  year: number;
  program: Program;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
  profilePic?: string;
}

export interface Violation {
  _id: string;
  studentId: string;
  description: string;
  severity: ViolationSeverity;
  dateCommitted: Date;
  createdAt: Date;
  createdBy: string;
  notes?: string;
}

export type Course = 
  | "Information Technology"
  | "Automotive Aftersales"
  | "Electro Mechanic Technology"
  | "Mechanical Technology";


export type Program = 
  | "BS"
  | "BTVTED"
  | "Diploma";

export type ViolationSeverity = "Minor" | "Major" ;

export interface ViolationStats {
  total: number;
  minor: number;
  major: number;
  thisMonth: number;
  thisWeek: number;
}

export interface ViolationData{
  description: string;
  severity: ViolationSeverity;
  dateCommitted: Date;
  notes?: string;
}
export interface StudentWithViolations extends Student {
  violations: Violation[];
  violationCount: number;
  lastViolation?: Date;
}

export interface StudentData {
  firstName: string;
  lastName: string;
  studentId: string;
  course: string;
  program: string;
  year: string; 
  email?: string;
}
