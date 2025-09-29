import express, { Response } from "express";
import Violation, { IViolation } from "../models/Violation";
import Student from "../models/Student";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = express.Router();

// ✅ Add new violation
router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { studentId, description, severity, dateCommitted, notes, createdBy } = req.body;

    if (!studentId || !description || !severity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ensure student belongs to this user
    const student = await Student.findOne({ studentId, user: req.user.id,});
    if (!student) {
      return res.status(404).json({ message: "Student not found or not yours" });
    }

    const violation = new Violation({
      studentId,
      description,
      severity,
      dateCommitted: dateCommitted || new Date(),
      notes,
      createdBy,
    });

    await violation.save();
    res.status(201).json(violation);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get all violations for logged-in user’s students
router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const students = await Student.find({ user: req.user.id });
    const studentIds = students.map((s) => s.studentId);

    const violations: IViolation[] = await Violation.find({ studentId: { $in: studentIds } });
    res.json(violations);
  } catch (err: any) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update a violation
router.put("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const violation = await Violation.findById(req.params.id);
    if (!violation) return res.status(404).json({ message: "Violation not found" });

    // check student ownership
    const student = await Student.findOne({ studentId: violation.studentId, user: req.user.id });
    if (!student) return res.status(403).json({ message: "Not authorized" });

    const updated = await Violation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Delete a violation
router.delete("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const violation = await Violation.findById(req.params.id);
    if (!violation) return res.status(404).json({ message: "Violation not found" });

    // check student ownership
    const student = await Student.findOne({ studentId: violation.studentId, user: req.user.id });
    if (!student) return res.status(403).json({ message: "Not authorized" });

    await Violation.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Violation deleted" });
  } catch (err: any) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get violation stats (only for this user’s students)
router.get("/stats", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const students = await Student.find({ user: req.user.id });
    const studentIds = students.map((s) => s.studentId);

    const violations: IViolation[] = await Violation.find({ studentId: { $in: studentIds } });
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisWeekStart = new Date(now);
    thisWeekStart.setDate(now.getDate() - now.getDay());

    res.json({
      total: violations.length,
      minor: violations.filter((v) => v.severity === "Minor").length,
      major: violations.filter((v) => v.severity === "Major").length,
      thisMonth: violations.filter((v) => v.dateCommitted >= thisMonthStart).length,
      thisWeek: violations.filter((v) => v.dateCommitted >= thisWeekStart).length,
    });
  } catch (err: any) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
