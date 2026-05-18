import mongoose, { Document, Schema, Model, Types } from "mongoose";
import { ApplicationStatus } from "../types";

export interface IApplication extends Document {
  job: Types.ObjectId;
  applicant: Types.ObjectId; // job seeker
  recruiter: Types.ObjectId;
  coverLetter?: string;
  resumeUrl?: string; // snapshot at time of apply
  status: ApplicationStatus;
  recruiterNotes?: string;
  statusHistory: {
    status: ApplicationStatus;
    changedAt: Date;
    changedBy: Types.ObjectId;
    note?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>(
  {
    job: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicant: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recruiter: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    coverLetter: {
      type: String,
      maxlength: [3000, "Cover letter cannot exceed 3000 characters"],
    },
    resumeUrl: String,
    status: {
      type: String,
      enum: Object.values(ApplicationStatus),
      default: ApplicationStatus.PENDING,
    },
    recruiterNotes: {
      type: String,
      maxlength: 2000,
      select: false, // hidden from job seekers
    },
    statusHistory: [
      {
        status: { type: String, enum: Object.values(ApplicationStatus) },
        changedAt: { type: Date, default: Date.now },
        changedBy: { type: Schema.Types.ObjectId, ref: "User" },
        note: String,
      },
    ],
  },
  { timestamps: true }
);

// ─── Compound Unique Index: one application per job per user ──────────────────
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });
applicationSchema.index({ applicant: 1, createdAt: -1 });
applicationSchema.index({ recruiter: 1, status: 1 });
applicationSchema.index({ job: 1, status: 1 });

const Application: Model<IApplication> = mongoose.model<IApplication>(
  "Application",
  applicationSchema
);
export default Application;