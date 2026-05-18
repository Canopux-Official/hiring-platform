import mongoose, { Document, Schema, Model, Types } from "mongoose";
import { JobStatus } from "../types";

export type JobType = "full_time" | "part_time" | "contract" | "internship" | "remote";
export type ExperienceLevel = "entry" | "mid" | "senior" | "lead" | "executive";

export interface ISalaryRange {
  min: number;
  max: number;
  currency: string;
}

export interface IJob extends Document {
  title: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  skills: string[];
  company: string;
  location: string;
  type: JobType;
  experienceLevel: ExperienceLevel;
  salaryRange?: ISalaryRange;
  openings: number;
  status: JobStatus;
  postedBy: Types.ObjectId; // recruiter
  applicationDeadline?: Date;
  applicationsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
      maxlength: [10000, "Description cannot exceed 10000 characters"],
    },
    requirements: [{ type: String, trim: true }],
    responsibilities: [{ type: String, trim: true }],
    skills: [{ type: String, trim: true, lowercase: true }],
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["full_time", "part_time", "contract", "internship", "remote"],
      required: [true, "Job type is required"],
    },
    experienceLevel: {
      type: String,
      enum: ["entry", "mid", "senior", "lead", "executive"],
      required: [true, "Experience level is required"],
    },
    salaryRange: {
      min: Number,
      max: Number,
      currency: { type: String, default: "INR" },
    },
    openings: {
      type: Number,
      default: 1,
      min: [1, "At least 1 opening required"],
    },
    status: {
      type: String,
      enum: Object.values(JobStatus),
      default: JobStatus.OPEN,
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applicationDeadline: Date,
    applicationsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
jobSchema.index({ status: 1, createdAt: -1 });
jobSchema.index({ postedBy: 1 });
jobSchema.index({ skills: 1 });
jobSchema.index({ title: "text", description: "text", company: "text" });

const Job: Model<IJob> = mongoose.model<IJob>("Job", jobSchema);
export default Job;