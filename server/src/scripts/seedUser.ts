import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User";
import { Role } from "../types";

dotenv.config();

const SEED_USERS = [
  {
    name: "Admin",
    email: "admin@platform.com",
    password: "Admin@1234",
    role: Role.ADMIN,
  },
  {
    name: "Demo Recruiter",
    email: "recruiter@RagasHire.com",
    password: "Recruit@123",
    role: Role.RECRUITER,
  },
  {
    name: "Demo Job Seeker",
    email: "jobseeker@RagasHire.com",
    password: "seeker@123",
    role: Role.JOB_SEEKER,
  },
];

async function seedUsers() {
  await mongoose.connect(process.env.MONGO_URI!);

  for (const userData of SEED_USERS) {
    const existing = await User.findOne({ email: userData.email });

    if (existing) {
      console.log(`⏭️  Skipping "${userData.email}" — already exists.`);
      continue;
    }

    await User.create(userData);
    console.log(`✅ Created [${userData.role}] → ${userData.email}`);
  }

  console.log("\n🎉 Seeding complete.");
  await mongoose.disconnect();
}

seedUsers().catch((err) => {
  console.error("❌ Seeding failed:", err);
  mongoose.disconnect();
});