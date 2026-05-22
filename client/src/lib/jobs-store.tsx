import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";

export type EmploymentType = "Full-time" | "Part-time" | "Contract" | "Internship" | "Freelance" | "Remote";
export type Urgency = "Standard" | "High" | "Urgent";
export type WorkMode = "Remote" | "Hybrid" | "On-site";

export interface ScreeningQuestion { id: string; text: string; required: boolean; }

export interface Job {
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

const STORAGE_KEY = "RagasHire.jobs.v1";

const seedJobs: Job[] = [
  {
    id: "seed-1", title: "Senior Product Design Lead", company: "FlowState AI", logo: "F",
    category: "Design", employmentType: "Full-time", workMode: "Remote",
    location: "San Francisco / Remote", currency: "USD", salaryMin: 160000, salaryMax: 210000,
    experience: "6+ years", skills: ["Figma", "Design Systems", "Prototyping", "AI/UX"],
    description: "Lead design across multi-agent AI workflows. Equity included.",
    responsibilities: "Drive end-to-end design for flagship products.",
    requirements: "6+ years senior design experience at fast-growth startups.",
    benefits: "Equity, remote-first, $4k home office stipend.",
    openings: 1, deadline: "2026-06-30", urgency: "High", screening: [],
    postedAt: Date.now() - 4 * 3600 * 1000, match: 96, status: "published",
  },
  {
    id: "seed-2", title: "Staff Rust Engineer", company: "Helix Systems", logo: "H",
    category: "Engineering", employmentType: "Full-time", workMode: "Hybrid",
    location: "Berlin, Germany", currency: "EUR", salaryMin: 110000, salaryMax: 145000,
    experience: "7+ years", skills: ["Rust", "Tokio", "Distributed Systems", "PostgreSQL"],
    description: "Distributed databases. Work with the founding team.",
    responsibilities: "Own core storage engine. Mentor 4 senior engineers.",
    requirements: "Deep Rust + async expertise. Database internals background.",
    benefits: "Equity, relocation, 30 days PTO.",
    openings: 2, deadline: "2026-07-15", urgency: "Urgent", screening: [],
    postedAt: Date.now() - 3600 * 1000, match: 93, status: "published",
  },
  {
    id: "seed-3", title: "Concierge Director", company: "Atlantis The Royal", logo: "A",
    category: "Hospitality", employmentType: "Full-time", workMode: "On-site",
    location: "Dubai, UAE", currency: "AED", salaryMin: 240000, salaryMax: 300000,
    experience: "10+ years", skills: ["Luxury Hospitality", "Team Leadership", "VIP Relations"],
    description: "Run a 60-person concierge team at one of the world's top resorts.",
    responsibilities: "Set service standards. Manage VIP guest experiences.",
    requirements: "Luxury hospitality background. Multilingual preferred.",
    benefits: "Tax-free salary, housing, annual flights.",
    openings: 1, deadline: "2026-05-31", urgency: "Standard", screening: [],
    postedAt: Date.now() - 2 * 86400 * 1000, match: 81, status: "published",
  },
  {
    id: "seed-4", title: "Delivery Fleet Lead", company: "RapidMile", logo: "R",
    category: "Logistics", employmentType: "Full-time", workMode: "On-site",
    location: "Mumbai, India", currency: "INR", salaryMin: 600000, salaryMax: 950000,
    experience: "4+ years", skills: ["Fleet Management", "Last-mile", "Operations"],
    description: "Run a 200-rider last-mile fleet across western Mumbai.",
    responsibilities: "Daily ops, rider performance, route optimisation.",
    requirements: "Strong logistics background. Hindi + English fluent.",
    benefits: "Health cover, fuel allowance, performance bonus.",
    openings: 3, deadline: "2026-04-20", urgency: "High", screening: [],
    postedAt: Date.now() - 6 * 3600 * 1000, match: 78, status: "published",
  },
  {
    id: "seed-5", title: "Brand Creative Director", company: "Northwave Studio", logo: "N",
    category: "Creative", employmentType: "Contract", workMode: "Hybrid",
    location: "London, UK", currency: "GBP", salaryMin: 85000, salaryMax: 120000,
    experience: "8+ years", skills: ["Brand Strategy", "Art Direction", "Campaign"],
    description: "Lead brand work for fintech and consumer launches.",
    responsibilities: "Direct cross-functional creative teams across launches.",
    requirements: "Strong portfolio. Multi-market brand experience.",
    benefits: "Hybrid, day-rate, profit share.",
    openings: 1, deadline: "2026-05-12", urgency: "Standard", screening: [],
    postedAt: Date.now() - 18 * 3600 * 1000, match: 88, status: "published",
  },
];

interface JobsCtx {
  jobs: Job[];
  addJob: (j: Job) => void;
  updateJob: (id: string, patch: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  duplicateJob: (id: string) => void;
}

const Ctx = createContext<JobsCtx | null>(null);

export function JobsProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>(seedJobs);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Job[];
        if (Array.isArray(parsed) && parsed.length) setJobs(parsed);
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs)); } catch {}
  }, [jobs, hydrated]);

  const addJob = useCallback((j: Job) => setJobs((p) => [j, ...p]), []);
  const updateJob = useCallback((id: string, patch: Partial<Job>) =>
    setJobs((p) => p.map((j) => (j.id === id ? { ...j, ...patch } : j))), []);
  const deleteJob = useCallback((id: string) =>
    setJobs((p) => p.filter((j) => j.id !== id)), []);
  const duplicateJob = useCallback((id: string) =>
    setJobs((p) => {
      const s = p.find((j) => j.id === id);
      if (!s) return p;
      const c: Job = { ...s, id: `job-${Date.now()}`, title: `${s.title} (Copy)`, postedAt: Date.now(), isUserPosted: true };
      return [c, ...p];
    }), []);

  const value = useMemo(() => ({ jobs, addJob, updateJob, deleteJob, duplicateJob }), [jobs, addJob, updateJob, deleteJob, duplicateJob]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useJobs() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useJobs must be used inside JobsProvider");
  return c;
}

export function formatSalary(j: Pick<Job, "currency" | "salaryMin" | "salaryMax">) {
  const sym: Record<string, string> = { USD: "$", EUR: "€", GBP: "£", INR: "₹", AED: "AED ", CAD: "CA$", JPY: "¥", AUD: "A$", SGD: "S$" };
  const s = sym[j.currency] ?? `${j.currency} `;
  const fmt = (n: number) => (n >= 1000 ? `${Math.round(n / 1000)}k` : `${n}`);
  return `${s}${fmt(j.salaryMin)} – ${s}${fmt(j.salaryMax)}`;
}

export function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}
