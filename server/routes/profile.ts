import express, { Request, Response } from "express";
import multer from "multer";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = express.Router();

// configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../uploads/"); // folder to save images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Upload / Update profile picture
router.post("/upload/:id", authMiddleware, upload.single("profilePic"), async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const imagePath = `/uploads/${req.file?.filename}`;


    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: imagePath },
      { new: true }
    );

    res.json({ success: true, user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Error uploading profile picture" });
  }
});

// Delete profile picture
router.delete("/delete/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $unset: { profilePic: "" } },
      { new: true }
    );

    res.json({ success: true, user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Error deleting profile picture" });
  }
});

// Get the logged-in user's own profile
router.get("/me", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select("username email profilePic role");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error loading profile" });
  }
});

// Update the logged-in user's own username / email
router.put("/me", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const username = (req.body.username || "").trim();
    const email = (req.body.email || "").trim();

    if (!username || !email) {
      return res.status(400).json({ message: "Username and email are required" });
    }

    const taken = await User.findOne({
      _id: { $ne: req.user?.id },
      $or: [{ username }, { email }],
    });
    if (taken) {
      return res.status(400).json({
        message: taken.username === username ? "Username already taken" : "Email already registered",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user?.id,
      { username, email },
      { new: true }
    ).select("username email profilePic role");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: "Error updating profile" });
  }
});

// Change the logged-in user's own password
router.put("/password", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(req.user?.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ success: true, message: "Password updated" });
  } catch (err) {
    res.status(500).json({ message: "Error changing password" });
  }
});

export default router;
