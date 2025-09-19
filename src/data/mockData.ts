import { Student, Violation, ViolationSeverity, StudentWithViolations } from '@/types/student';

// Mock students data
export const mockStudents: Student[] = [
  {
    id: "1",
    studentId: "2024-001",
    firstName: "John",
    lastName: "Doe",
    course: "Information Technology",
    year: 3,
    program: "BSIT",
    email: "john.doe@student.edu",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-09-01"),
  },
  {
    id: "2",
    studentId: "2024-002",
    firstName: "Maria",
    lastName: "Santos",
    course: "Information Technology", 
    year: 2,
    program: "BTVTED IT",
    email: "maria.santos@student.edu",
    createdAt: new Date("2024-01-16"),
    updatedAt: new Date("2024-08-28"),
  },
  {
    id: "3",
    studentId: "2024-003",
    firstName: "Carlos",
    lastName: "Rivera",
    course: "Computer Science",
    year: 4,
    program: "BSCS",
    email: "carlos.rivera@student.edu",
    createdAt: new Date("2024-01-17"),
    updatedAt: new Date("2024-09-05"),
  },
  {
    id: "4",
    studentId: "2024-004",
    firstName: "Ana",
    lastName: "Garcia",
    course: "Information Technology",
    year: 1,
    program: "Diploma IT",
    email: "ana.garcia@student.edu",
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-08-30"),
  },
  {
    id: "5",
    studentId: "2024-005",
    firstName: "Miguel",
    lastName: "Lopez",
    course: "Business Administration",
    year: 3,
    program: "BSBA",
    email: "miguel.lopez@student.edu",
    createdAt: new Date("2024-01-19"),
    updatedAt: new Date("2024-09-02"),
  },
];

// Mock violations data
export const mockViolations: Violation[] = [
  {
    id: "v1",
    studentId: "1",
    description: "Late submission of project without prior notice",
    severity: "Minor" as ViolationSeverity,
    dateCommitted: new Date("2024-08-15"),
    createdAt: new Date("2024-08-15"),
    createdBy: "Vice Dean Johnson",
    notes: "Student acknowledged the violation and promised improvement",
  },
  {
    id: "v2", 
    studentId: "1",
    description: "Disruptive behavior during lecture",
    severity: "Major" as ViolationSeverity,
    dateCommitted: new Date("2024-08-28"),
    createdAt: new Date("2024-08-28"),
    createdBy: "Vice Dean Johnson",
    notes: "Second offense - student counseling recommended",
  },
  {
    id: "v3",
    studentId: "2",
    description: "Plagiarism in assignment submission",
    severity: "Severe" as ViolationSeverity,
    dateCommitted: new Date("2024-08-20"),
    createdAt: new Date("2024-08-20"),
    createdBy: "Vice Dean Johnson",
    notes: "Academic integrity violation - formal hearing scheduled",
  },
  {
    id: "v4",
    studentId: "3",
    description: "Unauthorized absence from mandatory seminar",
    severity: "Minor" as ViolationSeverity,
    dateCommitted: new Date("2024-09-01"),
    createdAt: new Date("2024-09-01"),
    createdBy: "Vice Dean Johnson",
  },
  {
    id: "v5",
    studentId: "4",
    description: "Inappropriate use of laboratory equipment",
    severity: "Major" as ViolationSeverity,
    dateCommitted: new Date("2024-08-25"),
    createdAt: new Date("2024-08-25"),
    createdBy: "Vice Dean Johnson",
    notes: "Equipment damaged - replacement required",
  },
  {
    id: "v6",
    studentId: "5",
    description: "Dress code violation",
    severity: "Minor" as ViolationSeverity,
    dateCommitted: new Date("2024-09-05"),
    createdAt: new Date("2024-09-05"),
    createdBy: "Vice Dean Johnson",
  },
];

// Helper function to combine students with their violations
export const getStudentsWithViolations = (): StudentWithViolations[] => {
  return mockStudents.map(student => {
    const violations = mockViolations.filter(v => v.studentId === student.id);
    const violationCount = violations.length;
    const lastViolation = violations.length > 0 
      ? violations.reduce((latest, current) => 
          current.dateCommitted > latest.dateCommitted ? current : latest
        ).dateCommitted
      : undefined;
    
    return {
      ...student,
      violations,
      violationCount,
      lastViolation,
    };
  });
};

// Helper function to get violation statistics
export const getViolationStats = () => {
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisWeekStart = new Date(now);
  thisWeekStart.setDate(now.getDate() - now.getDay());

  const stats = {
    total: mockViolations.length,
    minor: mockViolations.filter(v => v.severity === "Minor").length,
    major: mockViolations.filter(v => v.severity === "Major").length,
    severe: mockViolations.filter(v => v.severity === "Severe").length,
    thisMonth: mockViolations.filter(v => v.dateCommitted >= thisMonthStart).length,
    thisWeek: mockViolations.filter(v => v.dateCommitted >= thisWeekStart).length,
  };

  return stats;
};