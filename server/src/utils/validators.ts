import { z } from "zod";
import { Role, ApplicationStatus, JobStatus } from "../types";
import { flexDate } from "./helpers";

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const registerSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[0-9]/, "Must contain a number"),
  role: z.nativeEnum(Role).optional(),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

// ─── Job ──────────────────────────────────────────────────────────────────────
export const createJobSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(50).max(10000),
  requirements: z.array(z.string()).optional(),
  responsibilities: z.array(z.string()).optional(),
  skills: z.array(z.string()).min(1, "At least one skill required"),
  company: z.string().min(2).max(100),
  location: z.string().min(2),
  type: z.enum(["full_time", "part_time", "contract", "internship", "remote"]),
  experienceLevel: z.enum(["entry", "mid", "senior", "lead", "executive"]),
  salaryRange: z
    .object({
      min: z.number().positive(),
      max: z.number().positive(),
      currency: z.string().default("INR"),
    })
    .optional(),
  openings: z.number().int().positive().optional(),
  applicationDeadline: z.string().datetime().optional(),
});

export const updateJobSchema = createJobSchema.partial().extend({
  status: z.nativeEnum(JobStatus).optional(),
});

// ─── Application ──────────────────────────────────────────────────────────────
export const applyJobSchema = z.object({
  coverLetter: z.string().max(3000).optional(),
});

export const updateApplicationStatusSchema = z.object({
  status: z.nativeEnum(ApplicationStatus),
  note: z.string().max(500).optional(),
});

// ─── Profile ──────────────────────────────────────────────────────────────────
export const updateProfileSchema = z.object({
  headline: z.string().max(120).optional(),
  bio: z.string().max(2000).optional(),
  skills: z.array(z.string()).optional(),
  expectedSalary: z.number().positive().optional(),
  currentSalary: z.number().positive().optional(),
  noticePeriod: z.number().int().nonnegative().optional(),
  preferredLocations: z.array(z.string()).optional(),
  linkedIn: z.string().url().optional().or(z.literal("")),
  github: z.string().url().optional().or(z.literal("")),
  portfolio: z.string().url().optional().or(z.literal("")),
  experience: z
    .array(
      z.object({
        title: z.string(),
        company: z.string(),
        location: z.string().optional(),
        startDate: flexDate,
        endDate: flexDate.optional(),
        isCurrent: z.boolean().default(false),
        description: z.string().optional(),
      })
    )
    .optional(),
  education: z
    .array(
      z.object({
        degree: z.string(),
        institution: z.string(),
        fieldOfStudy: z.string(),
        startYear: z.number().int(),
        endYear: z.number().int().optional(),
        grade: z.string().optional(),
      })
    )
    .optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
export type ApplyJobInput = z.infer<typeof applyJobSchema>;
export type UpdateApplicationStatusInput = z.infer<typeof updateApplicationStatusSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;