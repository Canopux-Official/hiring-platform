import React from "react";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import { ApplicationStatus } from "../services/admin-api";

export function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d === 0) return "Today";
  if (d === 1) return "Yesterday";
  if (d < 30) return `${d}d ago`;
  if (d < 365) return `${Math.floor(d / 30)}mo ago`;
  return `${Math.floor(d / 365)}y ago`;
}

export function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export const ROLE_COLORS: Record<string, string> = {
  job_seeker: "#0ea5e9",   // Sky blue
  recruiter:  "#7c3aed",   // Violet primary
  admin:      "#f472b6",   // Pink — admin-specific accent
  JOB_SEEKER: "#0ea5e9",
  RECRUITER:  "#7c3aed",
  ADMIN:      "#f472b6",
};

export const ROLE_ICONS: Record<string, React.ReactNode> = {
  job_seeker: <PersonIcon sx={{ fontSize: 14 }} />,
  recruiter:  <BusinessCenterIcon sx={{ fontSize: 14 }} />,
  admin:      <AdminPanelSettingsIcon sx={{ fontSize: 14 }} />,
  JOB_SEEKER: <PersonIcon sx={{ fontSize: 14 }} />,
  RECRUITER:  <BusinessCenterIcon sx={{ fontSize: 14 }} />,
  ADMIN:      <AdminPanelSettingsIcon sx={{ fontSize: 14 }} />,
};

export const APP_STATUS_COLOR: Record<
  ApplicationStatus,
  "default" | "warning" | "info" | "error" | "success"
> = {
  pending: "default",
  reviewed: "warning",
  shortlisted: "info",
  rejected: "error",
  hired: "success",
};
