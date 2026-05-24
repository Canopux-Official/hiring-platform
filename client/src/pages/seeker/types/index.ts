// src/types/seeker.ts
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
  statusHistory?: Array<{
    status: "active" | "inactive";
    changedAt: string;
  }>;
}

export type ApplicationStatus = "pending" | "reviewed" | "shortlisted" | "rejected" | "hired";

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
  statusHistory: Array<{
    status: ApplicationStatus;
    changedAt: string;
    changedBy: string;
    note?: string;
  }>;
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

export interface IUserInfo {
  name: string;
  email: string;
}

export interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data: T;
}
 
export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}