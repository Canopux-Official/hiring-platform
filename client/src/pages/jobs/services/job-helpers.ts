import { Job, JobType, ExperienceLevel } from "../types";

// ─── Label Maps ───────────────────────────────────────────────────────────────

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  full_time:  "Full-time",
  part_time:  "Part-time",
  contract:   "Contract",
  internship: "Internship",
  remote:     "Remote",
};

export const EXP_LABELS: Record<ExperienceLevel, string> = {
  entry:     "Entry",
  mid:       "Mid",
  senior:    "Senior",
  lead:      "Lead",
  executive: "Executive",
};

// ─── Select Options ───────────────────────────────────────────────────────────

export const JOB_TYPES: Array<{ value: JobType | ""; label: string }> = [
  { value: "full_time",  label: "Full-time" },
  { value: "part_time",  label: "Part-time" },
  { value: "contract",   label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "remote",     label: "Remote" },
];

export const EXP_LEVELS: Array<{ value: ExperienceLevel | ""; label: string }> = [
  { value: "entry",     label: "Entry" },
  { value: "mid",       label: "Mid" },
  { value: "senior",    label: "Senior" },
  { value: "lead",      label: "Lead" },
  { value: "executive", label: "Executive" },
];

// ─── Formatters ───────────────────────────────────────────────────────────────

export function formatSalary(job: Job): string {
  const s = job.salaryRange;
  if (!s || (!s.min && !s.max)) return "Not disclosed";
  const sym = s.currency === "INR" ? "₹" : `${s.currency} `;
  const fmt = (n: number) =>
    n >= 100000
      ? `${(n / 100000).toFixed(1)}L`
      : n >= 1000
      ? `${(n / 1000).toFixed(0)}K`
      : `${n}`;
  if (s.min && s.max) return `${sym}${fmt(s.min)} – ${sym}${fmt(s.max)}`;
  if (s.max)          return `Up to ${sym}${fmt(s.max)}`;
  return `${sym}${fmt(s.min!)}+`;
}

export function timeAgoFromString(d: string): string {
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
  if (days === 0)  return "Today";
  if (days === 1)  return "Yesterday";
  if (days < 7)   return `${days}d ago`;
  if (days < 30)  return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

// ─── Avatar Helpers ───────────────────────────────────────────────────────────

export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function stringToColor(string: string): string {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}