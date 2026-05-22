// api/seekerApi.ts
// All seeker-facing API calls. Adjust BASE_URL / auth header to match your setup.

const BASE_URL = `/api`; 

function authHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
  };
}

// ─── Types ──────────────────────────────────────────────────────────────────

interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data: T;
}
 
interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
 
async function unwrap<T>(res: Response): Promise<T> {
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.message ?? `Request failed with status ${res.status}`);
  }
  // Handle both { data: T } and plain T responses
  return (json?.data !== undefined ? json.data : json) as T;
}
 
async function unwrapPaginated<T>(res: Response): Promise<T[]> {
  const data = await unwrap<PaginatedData<T> | T[]>(res);
  // If backend returns { items, total, ... } unwrap items; else treat as plain array
  if (data && !Array.isArray(data) && "items" in data) {
    return (data as PaginatedData<T>).items;
  }
  return data as T[];
}
 
// ─── Types ──────────────────────────────────────────────────────────────────
 
export interface IExperience {
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
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
 
export interface IJobSeekerProfile {
  _id: string;
  user: string;
  headline?: string;
  bio?: string;
  resumeUrl?: string;
  skills: string[];
  experience: IExperience[];
  education: IEducation[];
  expectedSalary?: number;
  currentSalary?: number;
  noticePeriod?: number;
  preferredLocations: string[];
  linkedIn?: string;
  github?: string;
  portfolio?: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: {
    status: "active" | "inactive";
    changedAt: string;
  }[]; //don't know what is this status history for.
}
 
export interface IUserInfo {
  name: string;
  email: string;
}
 
export type ApplicationStatus =
  | "pending"
  | "reviewed"
  | "shortlisted"
  | "rejected"
  | "hired";
 
export interface IApplication {
  _id: string;
  job: {
    _id: string;
    title: string;
    company: string;
    location: string;
    salaryMin?: number;
    salaryMax?: number;
    type?: string;
  };
  recruiter: string;
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
 
export interface IRecommendedJob {
  _id: string;
  title: string;
  company: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  type?: string;
  skills: string[];
  postedAt: string;
  matchScore?: number;
}
 
// ─── Profile ─────────────────────────────────────────────────────────────────
 
export async function getMyProfile(): Promise<IJobSeekerProfile> {
  const res = await fetch(`${BASE_URL}/profile/me`, { headers: authHeaders() });
  return unwrap<IJobSeekerProfile>(res);
}
 
export async function updateMyProfile(
  data: Partial<IJobSeekerProfile>
): Promise<IJobSeekerProfile> {
  const res = await fetch(`${BASE_URL}/profile/me`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return unwrap<IJobSeekerProfile>(res);
}
 
//what does this do? This UI needs to be created.
export async function updateUserInfo(data: Partial<IUserInfo>): Promise<IUserInfo> {
  const res = await fetch(`${BASE_URL}/profile/me/user-info`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return unwrap<IUserInfo>(res);
}
 
// ─── Applications (paginated) ─────────────────────────────────────────────────
 
export async function getMyApplications(): Promise<IApplication[]> {
  const res = await fetch(`${BASE_URL}/applications/my`, { headers: authHeaders() });
  return unwrapPaginated<IApplication>(res);
}
//need to create GET	/applications/:id api
 
export async function withdrawApplication(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/applications/${id}/withdraw`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json?.message ?? "Failed to withdraw application");
  }
}

 
// ─── Recommended Jobs ─────────────────────────────────────────────────────────
// GET /api/jobs/recommended — not yet implemented on backend.
// Returns [] gracefully if the endpoint doesn't exist yet (400/404).
 
export async function getRecommendedJobs(): Promise<IRecommendedJob[]> {
  try {
    const res = await fetch(`${BASE_URL}/jobs/recommended`, { headers: authHeaders() });
    if (!res.ok) return []; // endpoint not built yet — fail silently
    return unwrapPaginated<IRecommendedJob>(res);
  } catch {
    return [];
  }
}

