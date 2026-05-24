import React from "react";
import { Card, Box, Typography, Stack, LinearProgress, Skeleton } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { IAdminDashboardStats } from "../services/admin-api";
import { ROLE_COLORS, ROLE_ICONS } from "../utils/constants";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  sub?: string;
}

export function StatCard({ label, value, icon, color, sub }: StatCardProps) {
  return (
    <Card
      sx={{
        p: 3,
        height: "100%",
        position: "relative",
        overflow: "hidden",
        "&::after": {
          content: '""',
          position: "absolute",
          top: -20,
          right: -20,
          width: 100,
          height: 100,
          borderRadius: "50%",
          bgcolor: alpha(color, 0.08),
          pointerEvents: "none",
        },
      }}
    >
      <Box
        sx={{
          p: 1,
          borderRadius: 1.5,
          bgcolor: alpha(color, 0.15),
          color,
          width: "fit-content",
          mb: 1.5,
        }}
      >
        {icon}
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
        {label}
      </Typography>
      {sub && (
        <Typography variant="caption" color="text.disabled">
          {sub}
        </Typography>
      )}
    </Card>
  );
}

export function PipelineCard({
  stats,
  loading,
}: {
  stats: IAdminDashboardStats | null;
  loading: boolean;
}) {
  const pipeline = stats?.applicationsByStatus;
  const total = stats?.totalApplications ?? 0;

  const rows = pipeline
    ? [
        { label: "Pending", value: pipeline.pending, color: "#94a3b8" },
        { label: "Reviewed", value: pipeline.reviewed, color: "#fbbf24" },
        { label: "Shortlisted", value: pipeline.shortlisted, color: "#60a5fa" },
        { label: "Hired", value: pipeline.hired, color: "#34d399" },
        { label: "Rejected", value: pipeline.rejected, color: "#f87171" },
      ]
    : [];

  return (
    <Card sx={{ p: 3, height: "100%" }}>
      <Typography variant="h6" sx={{ mb: 2.5 }}>
        Application Pipeline
      </Typography>
      {loading ? (
        <Stack spacing={2}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Box key={i}>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                <Skeleton variant="text" width="35%" />
                <Skeleton variant="text" width="15%" />
              </Stack>
              <Skeleton variant="rounded" height={6} />
            </Box>
          ))}
        </Stack>
      ) : (
        <Stack spacing={2}>
          {rows.map((r) => {
            const pct = total > 0 ? Math.round((r.value / total) * 100) : 0;
            return (
              <Box key={r.label}>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                  <Typography variant="body2">{r.label}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {r.value}{" "}
                    <Typography component="span" variant="caption" color="text.secondary">
                      ({pct}%)
                    </Typography>
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={pct}
                  sx={{
                    height: 7,
                    borderRadius: 3,
                    bgcolor: alpha(r.color, 0.15),
                    "& .MuiLinearProgress-bar": { bgcolor: r.color, borderRadius: 3 },
                  }}
                />
              </Box>
            );
          })}
        </Stack>
      )}
    </Card>
  );
}

export function UserRoleCard({
  stats,
  loading,
}: {
  stats: IAdminDashboardStats | null;
  loading: boolean;
}) {
  const roles = stats?.usersByRole;
  const total = stats?.totalUsers ?? 0;

  return (
    <Card sx={{ p: 3, height: "100%" }}>
      <Typography variant="h6" sx={{ mb: 2.5 }}>
        User Breakdown
      </Typography>
      {loading ? (
        <Stack spacing={2}>
          {[1, 2, 3].map((i) => (
            <Stack key={i} direction="row" spacing={2} alignItems="center">
              <Skeleton variant="circular" width={36} height={36} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="50%" />
                <Skeleton variant="rounded" height={5} sx={{ mt: 0.5 }} />
              </Box>
            </Stack>
          ))}
        </Stack>
      ) : roles ? (
        <Stack spacing={2}>
          {(
            [
              { role: "job_seeker", label: "Job Seekers", count: roles.job_seeker },
              { role: "recruiter",  label: "Recruiters",  count: roles.recruiter  },
              { role: "admin",      label: "Admins",      count: roles.admin      },
            ] as { role: string; label: string; count: number }[]
          ).map(({ role, label, count }) => {
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            const color = ROLE_COLORS[role] ?? "#94a3b8";
            return (
              <Box key={role}>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ color, display: "flex" }}>{ROLE_ICONS[role]}</Box>
                    <Typography variant="body2">{label}</Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {count}
                    <Typography component="span" variant="caption" color="text.secondary">
                      {" "}({pct}%)
                    </Typography>
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={pct}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: alpha(color, 0.12),
                    "& .MuiLinearProgress-bar": { bgcolor: color, borderRadius: 3 },
                  }}
                />
              </Box>
            );
          })}
        </Stack>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No data available.
        </Typography>
      )}
    </Card>
  );
}
