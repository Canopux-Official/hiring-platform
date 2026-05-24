// src/lib/seeker-helpers.ts
import React from "react";
import { ApplicationStatus, IJobSeekerProfile } from "../types";

// Import icons as values
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import StarIcon from "@mui/icons-material/Star";
import CancelIcon from "@mui/icons-material/Cancel";

export function fmtSalary(n?: number): string {
  if (!n) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
    notation: "compact",
  }).format(n);
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d === 0) return "Today";
  if (d === 1) return "Yesterday";
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", { month: "short", year: "numeric" });
}

export function fmtDate(iso?: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", { month: "short", year: "numeric" });
}

// Fixed STATUS_META: Removed 'as const' to prevent TypeScript from narrowing
// literal object types past what the Record interface accepts.
export const STATUS_META: Record<
  ApplicationStatus,
  { label: string; color: "default" | "warning" | "info" | "error" | "success"; icon: React.ReactElement }
//                                                                                      ^^^^^^^^^^^^^^
> = {
  pending: {
    label: "Pending",
    color: "default",
    icon: React.createElement(HourglassEmptyIcon, { sx: { fontSize: 14 } }),
  },
  reviewed: {
    label: "Reviewed",
    color: "info",
    icon: React.createElement(CheckCircleIcon, { sx: { fontSize: 14 } }),
  },
  shortlisted: {
    label: "Shortlisted",
    color: "warning",
    icon: React.createElement(StarIcon, { sx: { fontSize: 14 } }),
  },
  rejected: {
    label: "Rejected",
    color: "error",
    icon: React.createElement(CancelIcon, { sx: { fontSize: 14 } }),
  },
  hired: {
    label: "Hired 🎉",
    color: "success",
    icon: React.createElement(CheckCircleIcon, { sx: { fontSize: 14 } }),
  },
};

export function normalizeProfile(p: IJobSeekerProfile): IJobSeekerProfile {
  return {
    ...p,
    skills: p.skills || [],
    experience: p.experience || [],
    education: p.education || [],
    preferredLocations: p.preferredLocations || [],
    statusHistory: p.statusHistory || [],
  };
}

export function profileCompletion(profile: IJobSeekerProfile | null): number {
  if (!profile) return 0;

  const fields: boolean[] = [
    !!profile.headline,
    !!profile.bio,
    !!profile.resumeUrl,
    (profile.skills || []).length > 0,
    (profile.experience || []).length > 0,
    (profile.education || []).length > 0,
    !!profile.expectedSalary,
    (profile.preferredLocations || []).length > 0,
    !!profile.linkedIn || !!profile.github || !!profile.portfolio,
  ];

  return Math.round((fields.filter(Boolean).length / fields.length) * 100);
}