import { IJob, JobStatus } from "../services/recruiter";

export function formatSalary(job: IJob) {
  if (!job.salaryRange) return "–";
  const { min, max, currency } = job.salaryRange;
  const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(0)}k` : String(n));
  return `${currency} ${fmt(min)}–${fmt(max)}`;
}

export function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d === 0) return "Today";
  if (d === 1) return "Yesterday";
  if (d < 30) return `${d}d ago`;
  return `${Math.floor(d / 30)}mo ago`;
}

export const JOB_TYPE_LABELS: Record<string, string> = {
  full_time: "Full-time", part_time: "Part-time", contract: "Contract",
  internship: "Internship", remote: "Remote",
};

export const JOB_STATUS_OPTIONS: { value: JobStatus; label: string }[] = [
  { value: "open", label: "Open" },
  { value: "draft", label: "Draft" },
  { value: "closed", label: "Closed" },
];
