import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import express, { Request, Response } from "express";
const router = express.Router();
import Violation, { IViolation } from "../models/Violation";


//Get violations status 
router.get( "/stats", async  (req:Request, res:Response) => {
try{ 
    const violations :IViolation[] = await Violation.find();
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisWeekStart = new Date( now);
    thisWeekStart.setDate(now.getDate() - now.getDay());

    res.json( {
        total:violations.length,
        minor: violations.filter(v => v.severity === "Minor").length,
        major: violations.filter(v => v.severity === "Major").length,
        thisMonth:violations.filter(v => v.dateCommitted >=thisMonthStart).length,
        thisWeek: violations.filter(v => v.dateCommitted >= thisWeekStart).length,
    })
} catch(err:any) {
    res.status(500).json({message: "Server error" })
}
})

export default router;