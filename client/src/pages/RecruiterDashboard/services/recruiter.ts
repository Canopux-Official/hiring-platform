import axios from "axios";

axios.defaults.withCredentials = true;
const BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : `/api`;

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
 
export enum ApplicationStatus {
  PENDING = "pending",
  REVIEWED = "reviewed",
  SHORTLISTED = "shortlisted",
  REJECTED = "rejected",
  HIRED = "hired",
}
 
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
  postedBy: string;
  applicationDeadline?: string;
  applicationsCount: number;
  createdAt: string;
  updatedAt: string;
}
 
export interface IApplication {
  _id: string;
  job: string | IJob;
  applicant: string | {         //  applicant is a User, not IJobSeekerProfile
    _id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
  recruiter: string;
  coverLetter?: string;
  resumeUrl?: string;
  status: ApplicationStatus;
  recruiterNotes?: string;
  applicantProfile?: IJobSeekerProfile | null;  
  statusHistory: {
    status: ApplicationStatus;
    changedAt: string;
    changedBy: string;
    note?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}
 
export interface IExperience {
  _id?: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
}
 
export interface IEducation {
  _id?: string;
  degree: string;
  institution: string;
  fieldOfStudy: string;
  startYear: number;
  endYear?: number;
  grade?: string;
}
 
export interface IJobSeekerProfile {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
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
}
 
// ─── Pagination wrapper ───────────────────────────────────────────────────────
 
export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
 
// ─── NEW: Recruiter Stats (ask backend to add this endpoint) ──────────────────
// GET /jobs/recruiter/stats
// Returns aggregate numbers so the dashboard doesn't need N+1 calls.
// Expected response shape:
// {
//   totalJobs: number;
//   totalApplications: number;
//   pipeline: {
//     pending: number;
//     reviewed: number;
//     shortlisted: number;
//     rejected: number;
//     hired: number;
//   };
// }
 
export interface IRecruiterStats {
  totalJobs: number;
  totalApplications: number;
  pipeline: {
    pending: number;
    reviewed: number;
    shortlisted: number;
    rejected: number;
    hired: number;
  };
}
 
export async function fetchRecruiterStats(): Promise<IRecruiterStats> {
  const { data } = await axios.get(`${BASE}/jobs/recruiter/stats`);
  return data.data; // unwrap successResponse envelope
}
 
// ─── Jobs ─────────────────────────────────────────────────────────────────────
 
export interface FetchMyJobsParams {
  page?: number;
  limit?: number;
}
 
export async function fetchMyJobs(
  params: FetchMyJobsParams = {}
): Promise<Paginated<IJob>> {
  const { page = 1, limit = 10 } = params;
  const skip = (page - 1) * limit;
  const { data } = await axios.get(`${BASE}/jobs/recruiter/my-jobs`, {
    params: { skip, limit, page },
  });
  return data.data;
}
 
export interface CreateJobPayload {
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
  applicationDeadline?: string;
  status?: JobStatus;
  category?: string;
}
 
export async function createJob(payload: CreateJobPayload): Promise<IJob> {
  const { data } = await axios.post(`${BASE}/jobs`, payload);
  return data.data;
}
 
export async function updateJob(
  id: string,
  payload: Partial<CreateJobPayload>
): Promise<IJob> {
  const { data } = await axios.patch(`${BASE}/jobs/${id}`, payload);
  return data.data;
}
 
export async function deleteJob(id: string): Promise<void> {
  await axios.delete(`${BASE}/jobs/${id}`);
}
 
// ─── Applications ─────────────────────────────────────────────────────────────
 
export interface FetchApplicationsParams {
  page?: number;
  limit?: number;
}
 
export async function fetchApplicationsForJob(
  jobId: string,
  params: FetchApplicationsParams = {}
): Promise<Paginated<IApplication>> {
  const { page = 1, limit = 20 } = params;
  const skip = (page - 1) * limit;
  const { data } = await axios.get(`${BASE}/jobs/${jobId}/applications`, {
    params: { skip, limit, page },
  });
  return data.data;
}

//here also need to create GET	/applications/:id api
 
export interface UpdateApplicationStatusPayload {
  status: ApplicationStatus;
  note?: string;
}
 
export async function updateApplicationStatus(
  applicationId: string,
  payload: UpdateApplicationStatusPayload
): Promise<IApplication> {
  const { data } = await axios.patch(
    `${BASE}/applications/${applicationId}/status`,
    payload
  );
  return data.data;
}

// ─── Single Application ───────────────────────────────────────────────────────
 
export async function fetchApplicationById(
  applicationId: string
): Promise<IApplication> {
  const { data } = await axios.get(`${BASE}/applications/${applicationId}`);
  return data.data;
}
 
// ─── Job Seeker Profile ────────────────────────────────────────────────────────
 
export async function fetchJobSeekerProfile(
  userId: string
): Promise<IJobSeekerProfile> {
  const { data } = await axios.get(`${BASE}/profile/${userId}`);
  return data.data;
}