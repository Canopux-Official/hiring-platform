import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User";
import { Role } from "../types";

dotenv.config();

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI!);

  const existing = await User.findOne({ email: "admin@platform.com" });
  if (existing) {
    console.log("Admin already exists, skipping.");
    await mongoose.disconnect();
    return;
  }

  await User.create({
    name: "Admin",
    email: "admin@platform.com",
    password: "Admin@1234",   // pre-save hook hashes this automatically
    role: Role.ADMIN,
  });

  console.log("✅ Admin created successfully");
  await mongoose.disconnect();
}

createAdmin().catch((err) => {
  console.error("❌ Failed to create admin:", err);
  mongoose.disconnect();
});