// ─── Job API Types ────────────────────────────────────────────────────────────

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

export interface PaginatedJobs {
  jobs: Job[];
  total: number;
  page: number;
  totalPages: number;
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

// ─── Context / Local Job Types ────────────────────────────────────────────────

export type EmploymentType =
  | "Full-time"
  | "Part-time"
  | "Contract"
  | "Internship"
  | "Freelance"
  | "Remote";

export type Urgency = "Standard" | "High" | "Urgent";

export type WorkMode = "Remote" | "Hybrid" | "On-site";

export interface ScreeningQuestion {
  id: string;
  text: string;
  required: boolean;
}

export interface LocalJob {
  id: string;
  title: string;
  company: string;
  logo: string;
  category: string;
  employmentType: EmploymentType;
  workMode: WorkMode;
  location: string;
  currency: string;
  salaryMin: number;
  salaryMax: number;
  experience: string;
  skills: string[];
  description: string;
  responsibilities: string;
  requirements: string;
  benefits: string;
  openings: number;
  deadline: string;
  urgency: Urgency;
  screening: ScreeningQuestion[];
  postedAt: number;
  match: number;
  status: "published" | "draft";
  isUserPosted?: boolean;
}

// ─── NewJobModal form shape ───────────────────────────────────────────────────

export interface NewJobFormState {
  title: string;
  company: string;
  category: string;
  employmentType: EmploymentType;
  workMode: WorkMode;
  location: string;
  currency: string;
  salaryMin: number;
  salaryMax: number;
  experience: string;
  skills: string[];
  description: string;
  responsibilities: string;
  requirements: string;
  benefits: string;
  openings: number;
  deadline: string;
  urgency: Urgency;
}