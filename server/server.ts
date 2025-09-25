import express, { Application, Request, Response} from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"
import cors from "cors";
import Authentication from "./routes/auth";
import Students from "./routes/students";
import Violations from "./routes/violations";
import Profile from "./routes/profile";
dotenv.config();
import path from "path";
const app:Application = express();
app.use(cors())
app.use(express.json());
mongoose
.connect(process.env.MONGO_URI as string)
.then(()=>console.log("MongoDB connected"))
.catch((err) =>console.error("MongoDB connection error:", err));

//authentication route
app.use("/api/auth", Authentication);


// ✅ Serve uploads folder as static
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
// profile route
app.use("/api/profile", Profile);

//students route
app.use("/api/students", Students)


//violations route
app.use("/api/violations", Violations)




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));