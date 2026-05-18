import mongoose, { Document, Schema, Model, Types } from "mongoose";

export interface IExperience {
  title: string;
  company: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  description?: string;
}

export interface IEducation {
  degree: string;
  institution: string;
  fieldOfStudy: string;
  startYear: number;
  endYear?: number;
  grade?: string;
}

export interface IJobSeekerProfile extends Document {
  user: Types.ObjectId;
  headline?: string;
  bio?: string;
  resumeUrl?: string;
  skills: string[];
  experience: IExperience[];
  education: IEducation[];
  expectedSalary?: number;
  currentSalary?: number;
  noticePeriod?: number; // in days
  preferredLocations: string[];
  linkedIn?: string;
  github?: string;
  portfolio?: string;
  createdAt: Date;
  updatedAt: Date;
}

const experienceSchema = new Schema<IExperience>({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: String,
  startDate: { type: Date, required: true },
  endDate: Date,
  isCurrent: { type: Boolean, default: false },
  description: String,
});

const educationSchema = new Schema<IEducation>({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  fieldOfStudy: { type: String, required: true },
  startYear: { type: Number, required: true },
  endYear: Number,
  grade: String,
});

const jobSeekerProfileSchema = new Schema<IJobSeekerProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    headline: { type: String, maxlength: 120 },
    bio: { type: String, maxlength: 2000 },
    resumeUrl: String,
    skills: [{ type: String, trim: true, lowercase: true }],
    experience: [experienceSchema],
    education: [educationSchema],
    expectedSalary: Number,
    currentSalary: Number,
    noticePeriod: Number,
    preferredLocations: [String],
    linkedIn: String,
    github: String,
    portfolio: String,
  },
  { timestamps: true }
);

jobSeekerProfileSchema.index({ skills: 1 });

const JobSeekerProfile: Model<IJobSeekerProfile> =
  mongoose.model<IJobSeekerProfile>("JobSeekerProfile", jobSeekerProfileSchema);
export default JobSeekerProfile;