import { Request } from "express";
import { Types } from "mongoose";

// ─── Roles ───────────────────────────────────────────────────────────────────
export enum Role {
  ADMIN = "admin",
  RECRUITER = "recruiter",
  JOB_SEEKER = "job_seeker",
}

// ─── Job Status ───────────────────────────────────────────────────────────────
export enum JobStatus {
  OPEN = "open",
  CLOSED = "closed",
  DRAFT = "draft",
}

// ─── Application Status ───────────────────────────────────────────────────────
export enum ApplicationStatus {
  PENDING = "pending",
  REVIEWED = "reviewed",
  SHORTLISTED = "shortlisted",
  REJECTED = "rejected",
  HIRED = "hired",
}

// ─── Authenticated Request ────────────────────────────────────────────────────
export interface AuthenticatedRequest extends Request {
  user?: {
    _id: Types.ObjectId;
    email: string;
    role: Role;
    name: string;
  };
}

// ─── JWT Payload ──────────────────────────────────────────────────────────────
export interface JwtPayload {
  id: string;
  role: Role;
  email: string;
}

// ─── API Response ─────────────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown;
}

// ─── Pagination ───────────────────────────────────────────────────────────────
export interface PaginationQuery {
  page?: string;
  limit?: string;
  sort?: string;
  order?: "asc" | "desc";
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export enum RecruiterApprovalStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}