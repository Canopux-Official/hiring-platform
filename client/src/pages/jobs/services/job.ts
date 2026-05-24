import axios from "axios";
import {
  Job,
  PaginatedJobs,
  JobFilters,
  ApplyPayload,
  Application,
} from "../types";

// ─── Axios Instance ───────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
});

// ─── Internal raw response shape ─────────────────────────────────────────────

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

// ─── API Calls ────────────────────────────────────────────────────────────────

/** GET /jobs — paginated list with optional filters */
export async function fetchJobs(filters: JobFilters = {}): Promise<PaginatedJobs> {
  const params: Record<string, string | number> = {};
  if (filters.search) params.search = filters.search;
  if (filters.type) params.type = filters.type;
  if (filters.experienceLevel) params.experienceLevel = filters.experienceLevel;
  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;

  if (filters.category) params.category = filters.category;
  if (filters.status) params.status = filters.status;
  if (filters.location) params.location = filters.location;
  if (filters.skills) params.skills = filters.skills;
  if (filters.deadlineBefore) params.deadlineBefore = filters.deadlineBefore;

  const { data } = await api.get<PaginatedJobsRaw>("/jobs", { params });

  return {
    jobs: data.data.items ?? [],
    total: data.data.total ?? 0,
    page: data.data.page ?? 1,
    totalPages: data.data.totalPages ?? 1,
  };
}

/** GET /jobs/:id — full job detail */
export async function fetchJob(id: string): Promise<Job> {
  const { data } = await api.get<{ success: boolean; data: Job }>(`/jobs/${id}`);
  return (data as { success?: boolean; data?: Job }).data ?? (data as unknown as Job);
}

/** POST /jobs/:jobId/apply — submit application (requires JOB_SEEKER auth) */
export async function applyToJob(
  jobId: string,
  payload: ApplyPayload
): Promise<Application> {
  const { data } = await api.post<{ success: boolean; data: Application }>(
    `/jobs/${jobId}/apply`,
    payload,
  );
  return (
    (data as { success?: boolean; data?: Application }).data ??
    (data as unknown as Application)
  );
}

/**
 * GET /jobs/:jobId/my-application
 * Returns the authenticated user's application for this job, or null if not applied.
 */
export async function fetchMyApplicationForJob(
  jobId: string
): Promise<Application | null> {
  try {
    const { data } = await api.get<{ success: boolean; data: Application }>(
      `/jobs/${jobId}/my-application`,
    );
    return data.data ?? null;
  } catch {
    // 404 = not applied yet; treat all errors as "not applied"
    return null;
  }
}