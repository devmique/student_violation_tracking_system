import express, { Request, Response } from "express";
import multer from "multer";
import User from "../models/User";

const router = express.Router();

// configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // folder to save images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Upload / Update profile picture
router.post("/upload/:id", upload.single("profilePic"), async (req: Request, res: Response) => {
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
router.delete("/delete/:id", async (req: Request, res: Response) => {
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

export default router;
