import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import User from "../models/User";

(async () => {
  await mongoose.connect(process.env.MONGO_URI as string);
  const result = await User.updateMany({ role: { $exists: false } }, { $set: { role: "admin" } });
  console.log(`Migrated ${result.modifiedCount} existing user(s) to admin role.`);
  await mongoose.disconnect();
})();
