import express, { Response } from "express";
import User from "../models/User";
import { authMiddleware, requireAdmin, AuthRequest } from "../middleware/auth";

const router = express.Router();

// GET /api/users → List all users (admin only)
router.get("/", authMiddleware, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.find().select("username email role");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/users/:id/role → Change a user's role (admin only)
router.put("/:id/role", authMiddleware, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.body;
    if (!["admin", "general"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    if (req.params.id === req.user?.id) {
      return res.status(400).json({ message: "Cannot change your own role" });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("username email role");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
