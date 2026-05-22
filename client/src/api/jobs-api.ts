import axios from "axios";

// ─── Axios instance ──────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
});

// ─── Types ───────────────────────────────────────────────────────────────────
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

export type JobStatus = "open" | "closed" | "draft";

export interface SalaryRange {
  min?: number;
  max?: number;
  currency: string;
}

export interface Job {
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
  salaryRange?: SalaryRange;
  openings: number;
  status: JobStatus;
  postedBy: string;
  applicationDeadline?: string;
  applicationsCount: number;
  createdAt: string;
  updatedAt: string;
}

// What the frontend works with internally
export interface PaginatedJobs {
  jobs: Job[];
  total: number;
  page: number;
  totalPages: number;
}

// Actual shape the backend returns:
// { success: true, message: "Jobs fetched", data: { items: [...], total, page, totalPages, limit } }
interface PaginatedJobsRaw {
  success: boolean;
  message: string;
  data: {
    items: Job[];
    total: number;
    page: number;
    totalPages: number;
    limit: number;
  };
}

export interface JobFilters {
  search?: string;
  type?: JobType | "";
  experienceLevel?: ExperienceLevel | "";
  page?: number;
  limit?: number;
}

export interface ApplyPayload {
  coverLetter?: string;
  resumeUrl?: string;
}

export interface Application {
  _id: string;
  job: Job;
  applicant: string;
  recruiter: string;
  coverLetter?: string;
  resumeUrl?: string;
  status: "pending" | "reviewed" | "shortlisted" | "rejected" | "hired";
  createdAt: string;
}

// ─── API calls ────────────────────────────────────────────────────────────────

/** GET /jobs — paginated list with optional filters */
export async function fetchJobs(filters: JobFilters = {}): Promise<PaginatedJobs> {
  const params: Record<string, string | number> = {};
  if (filters.search)          params.search          = filters.search;
  if (filters.type)            params.type            = filters.type;
  if (filters.experienceLevel) params.experienceLevel = filters.experienceLevel;
  if (filters.page)            params.page            = filters.page;
  if (filters.limit)           params.limit           = filters.limit;

  const { data } = await api.get<PaginatedJobsRaw>("/jobs", { params });

  // Normalise to the flat shape the rest of the frontend expects
  return {
    jobs:       data.data.items  ?? [],
    total:      data.data.total  ?? 0,
    page:       data.data.page   ?? 1,
    totalPages: data.data.totalPages ?? 1,
  };
}

/** GET /jobs/:id — full job detail */
export async function fetchJob(id: string): Promise<Job> {
  const { data } = await api.get<{ success: boolean; data: Job }>(`/jobs/${id}`);
  // unwrap envelope if present, fall back to raw data
  return (data as { success?: boolean; data?: Job }).data ?? (data as unknown as Job);
}

/** POST /jobs/:jobId/apply — submit application (requires JOB_SEEKER auth) */
export async function applyToJob(jobId: string, payload: ApplyPayload): Promise<Application> {
  const { data } = await api.post<{ success: boolean; data: Application }>(
    `/jobs/${jobId}/apply`,
    payload,
  );
  return (data as { success?: boolean; data?: Application }).data ?? (data as unknown as Application);
}

/**
 * NEW API — GET /jobs/:jobId/my-application
 * Check if the authenticated user already applied to this job.
 *
 * Backend route hint:
 *   router.get("/:jobId/my-application", protect, async (req, res) => {
 *     const app = await Application.findOne({ job: req.params.jobId, applicant: req.user._id });
 *     if (!app) return res.status(404).json({ success: false, message: "Not applied" });
 *     res.json({ success: true, data: app });
 *   });
 */
export async function fetchMyApplicationForJob(jobId: string): Promise<Application | null> {
  try {
    const { data } = await api.get<{ success: boolean; data: Application }>(
      `/jobs/${jobId}/my-application`,
    );
    return data.data ?? null;
  } catch {
    // 404 = not applied yet, anything else also treated as "not applied" gracefully
    return null;
  }
}