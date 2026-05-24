import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User";
import JobSeekerProfile from "../models/JobSeekerProfile";
import Job from "../models/Job";
import Application from "../models/Application";
import { Role, JobStatus, ApplicationStatus } from "../types";

dotenv.config();

const SEED_USERS = [
  {
    name: "Platform Admin",
    email: "admin@platform.com",
    password: "Password123!",
    role: Role.ADMIN,
  },
  {
    name: "Acme Corp Recruiter",
    email: "recruiter1@acme.com",
    password: "Password123!",
    role: Role.RECRUITER,
  },
  {
    name: "TechFlow Recruiter",
    email: "recruiter2@techflow.io",
    password: "Password123!",
    role: Role.RECRUITER,
  },
  {
    name: "Alice Software",
    email: "alice@example.com",
    password: "Password123!",
    role: Role.JOB_SEEKER,
  },
  {
    name: "Bob Design",
    email: "bob@example.com",
    password: "Password123!",
    role: Role.JOB_SEEKER,
  },
  {
    name: "Charlie Product",
    email: "charlie@example.com",
    password: "Password123!",
    role: Role.JOB_SEEKER,
  },
];

async function seed() {
  try {
    console.log("⏳ Connecting to database...");
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/hiring-platform");
    console.log("✅ Database connected.");

    console.log("🧹 Wiping all existing data...");
    await Application.deleteMany({});
    await Job.deleteMany({});
    await JobSeekerProfile.deleteMany({});
    await User.deleteMany({});
    console.log("✅ Data wiped.");

    console.log("🌱 Seeding Users...");
    const createdUsers = [];
    for (const u of SEED_USERS) {
      const user = await User.create(u);
      createdUsers.push(user);

      if (user.role === Role.JOB_SEEKER) {
        await JobSeekerProfile.create({
          user: user._id,
          headline: `Headline for ${user.name}`,
          bio: `This is the bio for ${user.name}. Experienced professional looking for new opportunities.`,
          skills: ["React", "Node.js", "TypeScript", "Figma"],
          experience: [],
          education: [],
          expectedSalary: 120000,
          preferredLocations: ["Remote", "New York"],
        });
      }
    }
    console.log(`✅ ${createdUsers.length} Users and JobSeekerProfiles created.`);

    const recruiters = createdUsers.filter(u => u.role === Role.RECRUITER);
    const seekers = createdUsers.filter(u => u.role === Role.JOB_SEEKER);

    console.log("🌱 Seeding Jobs...");
    const jobsToCreate = [
      {
        title: "Senior Frontend Engineer",
        company: "Acme Corp",
        location: "Remote",
        type: "full_time",
        category: "Engineering",          // ← added
        experienceLevel: "senior",
        salaryRange: { min: 130000, max: 160000, currency: "USD" },
        description: "We are looking for a Senior Frontend Engineer to lead our core UI architecture using React and TypeScript.",
        requirements: ["5+ years React", "TypeScript", "Performance optimization"],
        responsibilities: ["Lead UI architecture", "Code reviews", "Mentor juniors"],
        skills: ["React", "TypeScript", "Vite"],
        status: JobStatus.OPEN,
        postedBy: recruiters[0]._id,
      },
      {
        title: "Product Designer",
        company: "Acme Corp",
        location: "New York, NY",
        type: "full_time",
        category: "Design",               // ← added
        experienceLevel: "mid",
        salaryRange: { min: 90000, max: 120000, currency: "USD" },
        description: "Looking for an awesome product designer.",
        requirements: ["Figma", "UI/UX", "User Research"],
        responsibilities: ["Design product flows", "Run user research", "Build design system"],
        skills: ["Figma", "Design Systems"],
        status: JobStatus.OPEN,
        postedBy: recruiters[0]._id,
      },
      {
        title: "Backend Node.js Developer",
        company: "TechFlow",
        location: "Remote",
        type: "contract",
        category: "Engineering",          // ← added
        experienceLevel: "mid",
        salaryRange: { min: 100000, max: 130000, currency: "USD" },
        description: "Contract role for a backend developer.",
        requirements: ["Node.js", "Express", "MongoDB"],
        responsibilities: ["Build REST APIs", "Design DB schemas", "Write tests"],
        skills: ["Node.js", "MongoDB", "AWS"],
        status: JobStatus.OPEN,
        postedBy: recruiters[1]._id,
      }
    ];

    const createdJobs = await Job.insertMany(jobsToCreate);
    console.log(`✅ ${createdJobs.length} Jobs created.`);

    console.log("🌱 Seeding Applications...");
    const applicationsToCreate = [
      {
        job: createdJobs[0]._id,
        applicant: seekers[0]._id,
        recruiter: recruiters[0]._id,
        status: ApplicationStatus.PENDING,
        coverLetter: "I'd love to join Acme Corp as a Frontend Engineer!",
        resumeUrl: "https://example.com/resume-alice.pdf"
      },
      {
        job: createdJobs[0]._id,
        applicant: seekers[1]._id,
        recruiter: recruiters[0]._id,
        status: ApplicationStatus.REVIEWED,
        coverLetter: "Here is my application for the Frontend role.",
      },
      {
        job: createdJobs[1]._id,
        applicant: seekers[1]._id,
        recruiter: recruiters[0]._id,
        status: ApplicationStatus.SHORTLISTED,
        coverLetter: "I am a designer applying to Acme Corp.",
      },
      {
        job: createdJobs[2]._id,
        applicant: seekers[2]._id,
        recruiter: recruiters[1]._id,
        status: ApplicationStatus.PENDING,
        coverLetter: "Applying for the Node.js backend contract.",
      }
    ];

    const createdApps = await Application.insertMany(applicationsToCreate);
    console.log(`✅ ${createdApps.length} Applications created.`);

    console.log("\n🎉 Database successfully wiped and seeded!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
