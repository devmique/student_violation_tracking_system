import Student, {IStudent} from "../models/Student";
import bcrypt from "bcryptjs";
import express, { Request, Response } from "express";
const router = express.Router();
import Violation, { IViolation } from "../models/Violation";
import {authMiddleware} from "../middleware/auth";

// POST /api/students
router.post("/api/students", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, studentId, course, program, year } = req.body;

    const newStudent = new Student({ firstName, lastName, studentId, course, program, year });
    await newStudent.save();

    res.status(201).json(newStudent);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Failed to add student" });
  }
});


//Get students with violation 
router.get("/",authMiddleware, async (req: Request, res: Response) => {
    try {
      const students: IStudent[] = await Student.find();
      const violations: IViolation[] = await Violation.find();
  
      const studentsWithViolations = students.map((student) => {
   
        // Find violations for this student
        const studentViolations = violations.filter(
          (violation) => violation.studentId.toString() === student._id.toString()
        );
  
        // Count violations
        const totalViolations = studentViolations.length;
  
        // Get the last violation date (if any)
        const lastViolation =
          studentViolations.length > 0
            ? studentViolations.reduce((latest, current) =>
                current.dateCommitted > latest.dateCommitted ? current : latest
              ).dateCommitted
            : null;
  
        return {
          ...student.toObject(),
          violations: studentViolations,
          totalViolations,
          lastViolation,
        };
      });
  
      res.json(studentsWithViolations);
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });
export default router;