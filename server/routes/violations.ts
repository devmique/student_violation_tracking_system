import express, { Response } from "express";
import Violation, { IViolation } from "../models/Violation";
import Student from "../models/Student";
import { authMiddleware, requireAdmin, AuthRequest } from "../middleware/auth";

const router = express.Router();

//  Add new violation
router.post("/", authMiddleware, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { studentId, description, severity, dateCommitted, notes, createdBy } = req.body;

    if (!studentId || !description || !severity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const student = await Student.findOne({ studentId });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
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

//  Get all violations (shared pool)
router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const violations: IViolation[] = await Violation.find({});
    res.json(violations);
  } catch (err: any) {
    res.status(500).json({ message: "Server error" });
  }
});

//  Update a violation
router.put("/:id", authMiddleware, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const updated = await Violation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Violation not found" });

    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ message: "Server error" });
  }
});

//  Delete a violation
router.delete("/:id", authMiddleware, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const violation = await Violation.findByIdAndDelete(req.params.id);
    if (!violation) return res.status(404).json({ message: "Violation not found" });

    res.json({ success: true, message: "Violation deleted" });
  } catch (err: any) {
    res.status(500).json({ message: "Server error" });
  }
});

//  Get violation stats (shared pool)
router.get("/stats", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const violations: IViolation[] = await Violation.find({});
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
      resolved: violations.filter((v) => v.resolved).length,
      unresolved: violations.filter((v) => !v.resolved).length,
    });
  } catch (err: any) {
    res.status(500).json({ message: "Server error" });
  }
});

//  Get violation counts per month for the last 6 months (shared pool)
router.get("/trend", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const violations: IViolation[] = await Violation.find({});
    const now = new Date();

    const trend = Array.from({ length: 6 }, (_, i) => {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - (5 - i) + 1, 1);
      const count = violations.filter(
        (v) => v.dateCommitted >= monthStart && v.dateCommitted < monthEnd
      ).length;
      return { month: monthStart.toLocaleString("default", { month: "short", year: "numeric" }), count };
    });

    res.json(trend);
  } catch (err: any) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
