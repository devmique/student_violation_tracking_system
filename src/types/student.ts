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
}

export interface Violation {
  _id: string;
  studentId: string;
  description: string;
  severity: ViolationSeverity;
  dateCommitted: Date;
  createdAt: Date;
  createdBy: string; // Vice Dean or staff member
  notes?: string;
}

export type Course = 
  | "Information Technology"
  | "Computer Science"
  | "Engineering"
  | "Education"
  | "Business Administration";

export type Program = 
  | "BSIT"
  | "BTVTED IT"
  | "Diploma IT"
  | "BSCS"
  | "BEED"
  | "BSBA";

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