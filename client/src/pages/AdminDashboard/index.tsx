// import React, { useState, useEffect, useCallback } from "react";
// import {
//   Container, Grid, Card, Typography, Stack, Button, Box, Tab, Tabs, Badge
// } from "@mui/material";
// import { alpha } from "@mui/material/styles";
// import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
// import WorkIcon from "@mui/icons-material/Work";
// import TrendingUpIcon from "@mui/icons-material/TrendingUp";
// import AssignmentIcon from "@mui/icons-material/Assignment";
// import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
// import RefreshIcon from "@mui/icons-material/Refresh";
// import { useAuth } from "../../pages/signin/lib/auth";
// import { fetchAdminDashboard, IAdminDashboardStats } from "./services/admin-api";
// import { useToast } from "../../hooks/useToast";
// import { StatCard, PipelineCard, UserRoleCard } from "./components/DashboardCards";
// import { StatCardSkeleton } from "./components/Skeletons";
// import { UsersTab } from "./components/UsersTab";
// import { ApplicationsTab } from "./components/ApplicationsTab";

// import { getErrorMessage } from "../../utils/errorUtils";

// export default function AdminDashboard() {
//   const { user } = useAuth();
//   const toast = useToast();
//   const [stats, setStats] = useState<IAdminDashboardStats | null>(null);
//   const [statsLoading, setStatsLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState(0);

//   const loadStats = useCallback(async () => {
//     setStatsLoading(true);
//     try {
//       const s = await fetchAdminDashboard();
//       setStats(s);
//     } catch (err) {
//       setStats(null);
//       toast.error(getErrorMessage(err, "Failed to load dashboard stats."));
//     } finally {
//       setStatsLoading(false);
//     }
//   }, [toast]);

//   useEffect(() => {
//     loadStats();
//   }, [loadStats]);

//   const statCards = [
//     {
//       label: "Total Users",
//       value: stats?.totalUsers ?? "â€“",
//       icon: <PeopleAltIcon />,
//       color: "#60a5fa",
//       sub: stats
//         ? `${stats.usersByRole.recruiter} recruiters Â· ${stats.usersByRole.job_seeker} seekers`
//         : undefined,
//     },
//     {
//       label: "Total Jobs",
//       value: stats?.totalJobs ?? "â€“",
//       icon: <WorkIcon />,
//       color: "#10b981",
//       sub: stats
//         ? `${stats.jobsByStatus.open} open Â· ${stats.jobsByStatus.draft} draft`
//         : undefined,
//     },
//     {
//       label: "Applications",
//       value: stats?.totalApplications ?? "â€“",
//       icon: <AssignmentIcon />,
//       color: "#a78bfa",
//       sub: stats
//         ? `${stats.applicationsByStatus.shortlisted} shortlisted`
//         : undefined,
//     },
//     {
//       label: "Hired",
//       value: stats?.applicationsByStatus.hired ?? "â€“",
//       icon: <TrendingUpIcon />,
//       color: "#f472b6",
//       sub: stats && stats.totalApplications > 0
//         ? `${Math.round(
//             (stats.applicationsByStatus.hired / stats.totalApplications) * 100
//           )}% conversion`
//         : stats
//         ? "0% conversion"
//         : undefined,
//     },
//   ];

//   return (
//     <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
//       {/* Header */}
//       <Stack
//         direction={{ xs: "column", sm: "row" }}
//         justifyContent="space-between"
//         alignItems={{ sm: "center" }}
//         spacing={2}
//         sx={{ mb: 4 }}
//       >
//         <Box>
//           <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.25 }}>
//             <AdminPanelSettingsIcon sx={{ color: "#f472b6", fontSize: 18 }} />
//             <Typography variant="overline" sx={{ color: "#f472b6", lineHeight: 1 }}>
//               Admin Control Panel
//             </Typography>
//           </Stack>
//           <Typography variant="h3" sx={{ fontSize: { xs: 26, md: 34 } }}>
//             Welcome, {user?.name?.split(" ")[0]}
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             Full platform oversight â€” users, jobs, and applications
//           </Typography>
//         </Box>
//         <Button
//           variant="outlined"
//           size="small"
//           startIcon={<RefreshIcon />}
//           onClick={loadStats}
//           disabled={statsLoading}
//         >
//           Refresh stats
//         </Button>
//       </Stack>

//       {/* Stat cards */}
//       <Grid container spacing={2.5} sx={{ mb: 4 }}>
//         {statsLoading
//           ? [0, 1, 2, 3].map((i) => (
//               <Grid item xs={6} md={3} key={i}>
//                 <StatCardSkeleton />
//               </Grid>
//             ))
//           : statCards.map((s) => (
//               <Grid item xs={6} md={3} key={s.label}>
//                 <StatCard
//                   label={s.label}
//                   value={s.value}
//                   icon={s.icon}
//                   color={s.color}
//                   sub={s.sub}
//                 />
//               </Grid>
//             ))}
//       </Grid>

//       {/* Charts row */}
//       <Grid container spacing={2.5} sx={{ mb: 4 }}>
//         <Grid item xs={12} md={7}>
//           <PipelineCard stats={stats} loading={statsLoading} />
//         </Grid>
//         <Grid item xs={12} md={5}>
//           <UserRoleCard stats={stats} loading={statsLoading} />
//         </Grid>
//       </Grid>

//       {/* Tabs: Users | Applications */}
//       <Card sx={{ p: 3 }}>
//         <Tabs
//           value={activeTab}
//           onChange={(_, v) => setActiveTab(v)}
//           sx={{ mb: 3, borderBottom: `1px solid ${alpha("#ffffff", 0.08)}` }}
//         >
//           <Tab
//             label={
//               <Stack direction="row" spacing={1} alignItems="center">
//                 <PeopleAltIcon sx={{ fontSize: 16 }} />
//                 <span>Users</span>
//                 {stats && (
//                   <Badge
//                     badgeContent={stats.totalUsers}
//                     max={9999}
//                     color="primary"
//                     sx={{ "& .MuiBadge-badge": { fontSize: "0.65rem", height: 16, minWidth: 16 } }}
//                   />
//                 )}
//               </Stack>
//             }
//           />
//           <Tab
//             label={
//               <Stack direction="row" spacing={1} alignItems="center">
//                 <AssignmentIcon sx={{ fontSize: 16 }} />
//                 <span>Applications</span>
//                 {stats && (
//                   <Badge
//                     badgeContent={stats.totalApplications}
//                     max={9999}
//                     color="primary"
//                     sx={{ "& .MuiBadge-badge": { fontSize: "0.65rem", height: 16, minWidth: 16 } }}
//                   />
//                 )}
//               </Stack>
//             }
//           />
//         </Tabs>

//         {activeTab === 0 && <UsersTab onStatsRefresh={loadStats} />}
//         {activeTab === 1 && <ApplicationsTab />}
//       </Card>
//     </Container>
//   );
// }



import { useState, useEffect, useCallback } from "react";
import {
  Container, Grid, Card, Typography, Stack, Button, Box, Tab, Tabs,
  Badge, Avatar, Chip, CircularProgress, Alert,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import WorkIcon from "@mui/icons-material/Work";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import RefreshIcon from "@mui/icons-material/Refresh";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useAuth } from "../../pages/signin/lib/auth";
import {
  fetchAdminDashboard, IAdminDashboardStats,
  fetchPendingRecruiters, reviewRecruiter, IUser, // âœ… new imports
} from "./services/admin-api";
import { useToast } from "../../hooks/useToast";
import { StatCard, PipelineCard, UserRoleCard } from "./components/DashboardCards";
import { StatCardSkeleton } from "./components/Skeletons";
import { UsersTab } from "./components/UsersTab";
import { ApplicationsTab } from "./components/ApplicationsTab";
import { getErrorMessage } from "../../utils/errorUtils";
import { timeAgo } from "../RecruiterDashboard/utils/constants";

export default function AdminDashboard() {
  const { user } = useAuth();
  const toast = useToast();

  const [stats, setStats] = useState<IAdminDashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  // âœ… Pending recruiters state
  const [pendingRecruiters, setPendingRecruiters] = useState<IUser[]>([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const s = await fetchAdminDashboard();
      setStats(s);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to load dashboard stats."));
    } finally {
      setStatsLoading(false);
    }
  }, [toast]);

  // âœ… Load pending recruiters
  const loadPendingRecruiters = useCallback(async () => {
    setPendingLoading(true);
    try {
      const res = await fetchPendingRecruiters();
      setPendingRecruiters(res.items);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to load pending recruiters."));
    } finally {
      setPendingLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadStats();
    loadPendingRecruiters();
  }, [loadStats, loadPendingRecruiters]);

  // âœ… Approve or reject a recruiter
  async function handleReview(userId: string, action: "approve" | "reject") {
    setReviewingId(userId);
    try {
      await reviewRecruiter(userId, action);
      toast.success(
        action === "approve"
          ? "Recruiter approved â€” they can now log in."
          : "Recruiter application rejected."
      );
      // Remove from pending list
      setPendingRecruiters((prev) => prev.filter((r) => r._id !== userId));
      loadStats(); // refresh totals
    } catch (err) {
      toast.error(getErrorMessage(err, `Failed to ${action} recruiter.`));
    } finally {
      setReviewingId(null);
    }
  }

  const statCards = [
    {
      label: "Total Users",
      value: stats?.totalUsers ?? "â€“",
      icon: <PeopleAltIcon />,
      color: "#60a5fa",
      sub: stats ? `${stats.usersByRole.recruiter} recruiters Â· ${stats.usersByRole.job_seeker} seekers` : undefined,
    },
    {
      label: "Total Jobs",
      value: stats?.totalJobs ?? "â€“",
      icon: <WorkIcon />,
      color: "#10b981",
      sub: stats ? `${stats.jobsByStatus.open} open Â· ${stats.jobsByStatus.draft} draft` : undefined,
    },
    {
      label: "Applications",
      value: stats?.totalApplications ?? "â€“",
      icon: <AssignmentIcon />,
      color: "#a78bfa",
      sub: stats ? `${stats.applicationsByStatus.shortlisted} shortlisted` : undefined,
    },
    {
      label: "Hired",
      value: stats?.applicationsByStatus.hired ?? "â€“",
      icon: <TrendingUpIcon />,
      color: "#f472b6",
      sub: stats && stats.totalApplications > 0
        ? `${Math.round((stats.applicationsByStatus.hired / stats.totalApplications) * 100)}% conversion`
        : stats ? "0% conversion" : undefined,
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      {/* Header */}
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between"
        alignItems={{ sm: "center" }} spacing={2} sx={{ mb: 4 }}>
        <Box>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.25 }}>
            <AdminPanelSettingsIcon sx={{ color: "#7c3aed", fontSize: 18 }} />
            <Typography variant="overline" sx={{ color: "#7c3aed", lineHeight: 1 }}>
              Admin Control Panel
            </Typography>
          </Stack>
          <Typography variant="h3" sx={{ fontSize: { xs: 26, md: 34 } }}>
            Welcome, {user?.name?.split(" ")[0]}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Full platform oversight â€” users, jobs, and applications
          </Typography>
        </Box>
        <Button variant="outlined" size="small" startIcon={<RefreshIcon />}
          onClick={() => { loadStats(); loadPendingRecruiters(); }} disabled={statsLoading}>
          Refresh stats
        </Button>
      </Stack>

      {/* Stat cards */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {statsLoading
          ? [0, 1, 2, 3].map((i) => <Grid item xs={6} md={3} key={i}><StatCardSkeleton /></Grid>)
          : statCards.map((s) => (
            <Grid item xs={6} md={3} key={s.label}>
              <StatCard label={s.label} value={s.value} icon={s.icon} color={s.color} sub={s.sub} />
            </Grid>
          ))}
      </Grid>

      {/* Charts row */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid item xs={12} md={7}><PipelineCard stats={stats} loading={statsLoading} /></Grid>
        <Grid item xs={12} md={5}><UserRoleCard stats={stats} loading={statsLoading} /></Grid>
      </Grid>

      {/* âœ… Pending Recruiters section â€” shown only when there are pending requests */}
      {(pendingLoading || pendingRecruiters.length > 0) && (
        <Card sx={{ p: 3, mb: 3, border: `1px solid ${alpha("#f59e0b", 0.3)}`, bgcolor: alpha("#f59e0b", 0.03) }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
            <HourglassTopIcon sx={{ color: "#f59e0b", fontSize: 20 }} />
            <Typography variant="h6">Pending Recruiter Approvals</Typography>
            {pendingRecruiters.length > 0 && (
              <Chip
                label={pendingRecruiters.length}
                size="small"
                sx={{ bgcolor: alpha("#f59e0b", 0.15), color: "#f59e0b", fontWeight: 700 }}
              />
            )}
          </Stack>

          {pendingLoading ? (
            <Stack alignItems="center" py={3}><CircularProgress size={24} /></Stack>
          ) : (
            <Stack spacing={1.5}>
              {pendingRecruiters.map((recruiter) => (
                <Box
                  key={recruiter._id}
                  sx={{
                    display: "flex", alignItems: "center", gap: 2,
                    p: 2, borderRadius: 2,
                    border: "1px solid #e5e7eb",
                    bgcolor: "#ffffff",
                    flexWrap: { xs: "wrap", sm: "nowrap" },
                  }}
                >
                  <Avatar sx={{ bgcolor: "#fef3c7", color: "#d97706", fontWeight: 700, flexShrink: 0 }}>
                    {recruiter.name[0].toUpperCase()}
                  </Avatar>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{recruiter.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{recruiter.email}</Typography>
                    {recruiter.phone && (
                      <Typography variant="caption" color="text.disabled" display="block">
                        {recruiter.phone}
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.disabled" display="block">
                      Registered {timeAgo(recruiter.createdAt)}
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={1} flexShrink={0}>
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      startIcon={
                        reviewingId === recruiter._id
                          ? <CircularProgress size={14} color="inherit" />
                          : <CheckCircleIcon fontSize="small" />
                      }
                      disabled={reviewingId === recruiter._id}
                      onClick={() => handleReview(recruiter._id, "approve")}
                      sx={{ minWidth: 100 }}
                    >
                      Approve
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={
                        reviewingId === recruiter._id
                          ? <CircularProgress size={14} color="inherit" />
                          : <CancelIcon fontSize="small" />
                      }
                      disabled={reviewingId === recruiter._id}
                      onClick={() => handleReview(recruiter._id, "reject")}
                      sx={{ minWidth: 90 }}
                    >
                      Reject
                    </Button>
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
        </Card>
      )}

      {/* Tabs: Users | Applications */}
      <Card sx={{ p: 3 }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}
          sx={{ mb: 3, borderBottom: "1px solid", borderColor: "divider" }}>
          <Tab label={
            <Stack direction="row" spacing={1} alignItems="center">
              <PeopleAltIcon sx={{ fontSize: 16 }} /><span>Users</span>
              {stats && <Badge badgeContent={stats.totalUsers} max={9999} color="primary"
                sx={{ "& .MuiBadge-badge": { fontSize: "0.65rem", height: 16, minWidth: 16 } }} />}
            </Stack>
          } />
          <Tab label={
            <Stack direction="row" spacing={1} alignItems="center">
              <AssignmentIcon sx={{ fontSize: 16 }} /><span>Applications</span>
              {stats && <Badge badgeContent={stats.totalApplications} max={9999} color="primary"
                sx={{ "& .MuiBadge-badge": { fontSize: "0.65rem", height: 16, minWidth: 16 } }} />}
            </Stack>
          } />
        </Tabs>

        {activeTab === 0 && <UsersTab onStatsRefresh={loadStats} />}
        {activeTab === 1 && <ApplicationsTab />}
      </Card>
    </Container>
  );
}
