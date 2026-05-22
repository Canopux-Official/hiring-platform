// api/adminApi.ts
// All admin-facing API calls.
// Requires ADMIN role. Uses axios with credentials (cookie-based sessions).

import axios from "axios";

const BASE = `/api`;

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserRole = "JOB_SEEKER" | "RECRUITER" | "ADMIN" | "job_seeker" | "recruiter" | "admin";
export type ApplicationStatus =
  | "pending"
  | "reviewed"
  | "shortlisted"
  | "rejected"
  | "hired";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type JobType =
  | "full_time"
  | "part_time"
  | "contract"
  | "internship"
  | "remote";

export type ExperienceLevel =
  | "entry"
  | "mid"
  | "senior"
  | "lead"
  | "executive";

export type JobStatus = "open" | "draft" | "closed";

export interface ISalaryRange {
  min: number;
  max: number;
  currency: string;
}

export interface IJob {
  _id: string;
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
  postedBy: string | IUser;
  applicationDeadline?: string;
  applicationsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface IApplication {
  _id: string;
  job: string | IJob;
  applicant: string | IUser;
  recruiter: string | IUser;
  coverLetter?: string;
  resumeUrl?: string;
  status: ApplicationStatus;
  recruiterNotes?: string;
  statusHistory: {
    status: ApplicationStatus;
    changedAt: string;
    changedBy: string;
    note?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

// ─── Pagination wrapper ───────────────────────────────────────────────────────

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Dashboard stats ──────────────────────────────────────────────────────────

// Exact shape returned by GET /admin/dashboard:
// {
//   totals: { users, jobs, applications },
//   usersByRole: [{ _id: "admin"|"recruiter"|"job_seeker", count }],
//   applicationsByStatus: [{ _id: "pending"|"reviewed"|..., count }],
//   jobsByStatus: [{ _id: "open"|"draft"|"closed", count }],
//   recentJobs: IJob[],
//   recentApplications: IApplication[],
// }

interface RoleCount {
  _id: string;
  count: number;
}

interface StatusCount {
  _id: string;
  count: number;
}

interface DashboardRaw {
  totals: {
    users: number;
    jobs: number;
    applications: number;
  };
  usersByRole: RoleCount[];
  applicationsByStatus: StatusCount[];
  jobsByStatus: StatusCount[];
  recentJobs: IJob[];
  recentApplications: IApplication[];
}

// Normalised shape the dashboard component works with
export interface IAdminDashboardStats {
  totalUsers: number;
  totalJobs: number;
  totalApplications: number;
  usersByRole: {
    admin: number;
    recruiter: number;
    job_seeker: number;
  };
  applicationsByStatus: {
    pending: number;
    reviewed: number;
    shortlisted: number;
    rejected: number;
    hired: number;
  };
  jobsByStatus: {
    open: number;
    draft: number;
    closed: number;
  };
  recentJobs: IJob[];
  recentApplications: IApplication[];
}

function arrayToMap(arr: { _id: string; count: number }[]): Record<string, number> {
  return arr.reduce<Record<string, number>>((acc, { _id, count }) => {
    acc[_id] = count;
    return acc;
  }, {});
}

export async function fetchAdminDashboard(): Promise<IAdminDashboardStats> {
  const { data } = await axios.get(`${BASE}/admin/dashboard`, {
    withCredentials: true,
  });

  const raw: DashboardRaw = data.data ?? data;
  const roleMap = arrayToMap(raw.usersByRole ?? []);
  const appMap  = arrayToMap(raw.applicationsByStatus ?? []);
  const jobMap  = arrayToMap(raw.jobsByStatus ?? []);

  return {
    totalUsers:        raw.totals?.users        ?? 0,
    totalJobs:         raw.totals?.jobs         ?? 0,
    totalApplications: raw.totals?.applications ?? 0,
    usersByRole: {
      admin:      roleMap["admin"]      ?? 0,
      recruiter:  roleMap["recruiter"]  ?? 0,
      job_seeker: roleMap["job_seeker"] ?? 0,
    },
    applicationsByStatus: {
      pending:     appMap["pending"]     ?? 0,
      reviewed:    appMap["reviewed"]    ?? 0,
      shortlisted: appMap["shortlisted"] ?? 0,
      rejected:    appMap["rejected"]    ?? 0,
      hired:       appMap["hired"]       ?? 0,
    },
    jobsByStatus: {
      open:   jobMap["open"]   ?? 0,
      draft:  jobMap["draft"]  ?? 0,
      closed: jobMap["closed"] ?? 0,
    },
    recentJobs:         raw.recentJobs         ?? [],
    recentApplications: raw.recentApplications ?? [],
  };
}

// ─── Users ────────────────────────────────────────────────────────────────────

export interface FetchUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}

export async function fetchAllUsers(
  params: FetchUsersParams = {}
): Promise<Paginated<IUser>> {
  const { page = 1, limit = 15, search, role } = params;
  const query: Record<string, string | number> = { page, limit };
  if (search) query.search = search;
  if (role)   query.role   = role;

  const { data } = await axios.get(`${BASE}/admin/users`, {
    params: query,
    withCredentials: true,
  });

  const raw = data.data ?? data;
  if (raw && typeof raw === "object" && "items" in raw) {
    return raw as Paginated<IUser>;
  }
  const items: IUser[] = Array.isArray(raw) ? raw : [];
  return { items, total: items.length, page: 1, limit: items.length, totalPages: 1 };
}

export async function toggleUserStatus(userId: string): Promise<IUser> {
  const { data } = await axios.patch(
    `${BASE}/admin/users/${userId}/toggle-status`,
    {},
    { withCredentials: true }
  );
  return data.data ?? data;
}

export async function deleteUser(userId: string): Promise<void> {
  await axios.delete(`${BASE}/admin/users/${userId}`, {
    withCredentials: true,
  });
}

// ─── Applications ─────────────────────────────────────────────────────────────

export interface FetchAdminApplicationsParams {
  page?: number;
  limit?: number;
  status?: ApplicationStatus | "";
}

export async function fetchAllApplications(
  params: FetchAdminApplicationsParams = {}
): Promise<Paginated<IApplication>> {
  const { page = 1, limit = 15, status } = params;
  const query: Record<string, string | number> = { page, limit };
  if (status) query.status = status;

  const { data } = await axios.get(`${BASE}/admin/applications`, {
    params: query,
    withCredentials: true,
  });

  const raw = data.data ?? data;
  if (raw && typeof raw === "object" && "items" in raw) {
    return raw as Paginated<IApplication>;
  }
  const items: IApplication[] = Array.isArray(raw) ? raw : [];
  return { items, total: items.length, page: 1, limit: items.length, totalPages: 1 };
}