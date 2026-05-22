import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User";
import JobSeekerProfile from "../models/JobSeekerProfile"; // <-- Import the profile model
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
      
      // Secondary check: If the user exists but somehow misses a profile, we handle it
      if (userData.role === Role.JOB_SEEKER) {
        const profileExists = await JobSeekerProfile.findOne({ user: existing._id });
        if (!profileExists) {
          await JobSeekerProfile.create({ user: existing._id });
          console.log(`🆕 Created missing profile for existing Job Seeker: ${userData.email}`);
        }
      }
      continue;
    }

    // 1. Create the base User
    const newUser = await User.create(userData);
    console.log(`✅ Created [${userData.role}] → ${userData.email}`);

    // 2. Conditionally create the empty profile if the role is JOB_SEEKER
    if (userData.role === Role.JOB_SEEKER) {
      await JobSeekerProfile.create({
        user: newUser._id, // Links the profile to the newly created user
        skills: [],
        experience: [],
        education: []
      });
      console.log(`👤 Profile linked for Job Seeker: ${userData.email}`);
    }
  }

  console.log("\n🎉 Seeding complete.");
  await mongoose.disconnect();
}

seedUsers().catch((err) => {
  console.error("❌ Seeding failed:", err);
  mongoose.disconnect();
});