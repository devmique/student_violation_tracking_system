import express, { Request, Response } from "express";
import path from "path";
import multer from "multer";
import Student, { IStudent } from "../models/Student";
import Violation, { IViolation } from "../models/Violation";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = express.Router();

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });


// PATCH: Update profile picture
router.patch(
  "/:id/profile-pic",
  authMiddleware,
  upload.single("profilePic"),
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const student = await Student.findByIdAndUpdate(
        req.params.id,
        { profilePic: `/uploads/${req.file.filename}` },
        { new: true }
      );

      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      res.json(student);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update profile picture" });
    }
  }
);

// DELETE: Remove student profile picture
router.delete(
  "/:id/profile-pic",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const student = await Student.findByIdAndUpdate(
        req.params.id,
        { $unset: { profilePic: 1 } }, 
        { new: true }
      );

      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      res.json(student);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to delete profile picture" });
    }
  }
);


// POST /api/students  → Create student linked to logged-in user
router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { studentId, firstName, middlename, lastName, email, course, program, year, profilePic } = req.body;

    const newStudent = new Student({
      studentId,
      firstName,
      middlename,
      lastName,
      email,
      course,
      program,
      year,
      user: req.user.id,
      profilePic 
    });

    await newStudent.save();

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      student: newStudent,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/students → Get students for logged-in user with violations
router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // ✅ Only fetch students belonging to this user
    const students: IStudent[] = await Student.find({ user: req.user.id });
    const violations: IViolation[] = await Violation.find();

    const studentsWithViolations = students.map((student) => {
      const studentViolations = violations.filter(
        (violation) => violation.studentId.toString() === student.studentId.toString()
      );

      const totalViolations = studentViolations.length;

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
