import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import express, { Request, Response } from "express";
const router = express.Router();

// Register
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
if (existingUser) {
  return res.status(400).json({ message: "Email already registered" });
}

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();

   
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        profilePic: newUser.profilePic || "",
      },
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


//Login
router.post("/login", async (req: Request, res:Response)=>{
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email})
        if(!user) return res.status(400).json({ message: "Invalid credentials"});
      

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({ message: "Invalid credentials"});

        const token = jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET as string,
            {expiresIn: "7d"}
        )
        res.json({token, user: {id: user._id, username: user.username, email: user.email,  profilePic: user.profilePic}});
    } catch (err: any){
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
})
export default router;