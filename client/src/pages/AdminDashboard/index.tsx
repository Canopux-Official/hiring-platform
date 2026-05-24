import React, { useState, useEffect, useCallback } from "react";
import {
  Container, Grid, Card, Typography, Stack, Button, Box, Tab, Tabs, Badge
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import WorkIcon from "@mui/icons-material/Work";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useAuth } from "../../pages/signin/lib/auth";
import { fetchAdminDashboard, IAdminDashboardStats } from "./services/admin-api";
import { useToast } from "../../hooks/useToast";
import { StatCard, PipelineCard, UserRoleCard } from "./components/DashboardCards";
import { StatCardSkeleton } from "./components/Skeletons";
import { UsersTab } from "./components/UsersTab";
import { ApplicationsTab } from "./components/ApplicationsTab";

import { getErrorMessage } from "../../utils/errorUtils";

export default function AdminDashboard() {
  const { user } = useAuth();
  const toast = useToast();
  const [stats, setStats] = useState<IAdminDashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const s = await fetchAdminDashboard();
      setStats(s);
    } catch (err) {
      setStats(null);
      toast.error(getErrorMessage(err, "Failed to load dashboard stats."));
    } finally {
      setStatsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const statCards = [
    {
      label: "Total Users",
      value: stats?.totalUsers ?? "–",
      icon: <PeopleAltIcon />,
      color: "#60a5fa",
      sub: stats
        ? `${stats.usersByRole.recruiter} recruiters · ${stats.usersByRole.job_seeker} seekers`
        : undefined,
    },
    {
      label: "Total Jobs",
      value: stats?.totalJobs ?? "–",
      icon: <WorkIcon />,
      color: "#34d399",
      sub: stats
        ? `${stats.jobsByStatus.open} open · ${stats.jobsByStatus.draft} draft`
        : undefined,
    },
    {
      label: "Applications",
      value: stats?.totalApplications ?? "–",
      icon: <AssignmentIcon />,
      color: "#a78bfa",
      sub: stats
        ? `${stats.applicationsByStatus.shortlisted} shortlisted`
        : undefined,
    },
    {
      label: "Hired",
      value: stats?.applicationsByStatus.hired ?? "–",
      icon: <TrendingUpIcon />,
      color: "#f472b6",
      sub: stats && stats.totalApplications > 0
        ? `${Math.round(
            (stats.applicationsByStatus.hired / stats.totalApplications) * 100
          )}% conversion`
        : stats
        ? "0% conversion"
        : undefined,
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ sm: "center" }}
        spacing={2}
        sx={{ mb: 4 }}
      >
        <Box>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.25 }}>
            <AdminPanelSettingsIcon sx={{ color: "#f472b6", fontSize: 18 }} />
            <Typography variant="overline" sx={{ color: "#f472b6", lineHeight: 1 }}>
              Admin Control Panel
            </Typography>
          </Stack>
          <Typography variant="h3" sx={{ fontSize: { xs: 26, md: 34 } }}>
            Welcome, {user?.name?.split(" ")[0]}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Full platform oversight — users, jobs, and applications
          </Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          startIcon={<RefreshIcon />}
          onClick={loadStats}
          disabled={statsLoading}
        >
          Refresh stats
        </Button>
      </Stack>

      {/* Stat cards */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {statsLoading
          ? [0, 1, 2, 3].map((i) => (
              <Grid item xs={6} md={3} key={i}>
                <StatCardSkeleton />
              </Grid>
            ))
          : statCards.map((s) => (
              <Grid item xs={6} md={3} key={s.label}>
                <StatCard
                  label={s.label}
                  value={s.value}
                  icon={s.icon}
                  color={s.color}
                  sub={s.sub}
                />
              </Grid>
            ))}
      </Grid>

      {/* Charts row */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid item xs={12} md={7}>
          <PipelineCard stats={stats} loading={statsLoading} />
        </Grid>
        <Grid item xs={12} md={5}>
          <UserRoleCard stats={stats} loading={statsLoading} />
        </Grid>
      </Grid>

      {/* Tabs: Users | Applications */}
      <Card sx={{ p: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          sx={{ mb: 3, borderBottom: `1px solid ${alpha("#ffffff", 0.08)}` }}
        >
          <Tab
            label={
              <Stack direction="row" spacing={1} alignItems="center">
                <PeopleAltIcon sx={{ fontSize: 16 }} />
                <span>Users</span>
                {stats && (
                  <Badge
                    badgeContent={stats.totalUsers}
                    max={9999}
                    color="primary"
                    sx={{ "& .MuiBadge-badge": { fontSize: "0.65rem", height: 16, minWidth: 16 } }}
                  />
                )}
              </Stack>
            }
          />
          <Tab
            label={
              <Stack direction="row" spacing={1} alignItems="center">
                <AssignmentIcon sx={{ fontSize: 16 }} />
                <span>Applications</span>
                {stats && (
                  <Badge
                    badgeContent={stats.totalApplications}
                    max={9999}
                    color="primary"
                    sx={{ "& .MuiBadge-badge": { fontSize: "0.65rem", height: 16, minWidth: 16 } }}
                  />
                )}
              </Stack>
            }
          />
        </Tabs>

        {activeTab === 0 && <UsersTab onStatsRefresh={loadStats} />}
        {activeTab === 1 && <ApplicationsTab />}
      </Card>
    </Container>
  );
}
