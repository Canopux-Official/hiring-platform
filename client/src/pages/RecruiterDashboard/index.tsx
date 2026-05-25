// import React, { useState, useEffect, useCallback } from "react";
// import {
//   Container, Grid, Card, Typography, Stack, Button, Box, Chip, IconButton,
//   Avatar, LinearProgress, Menu, MenuItem, Divider, CircularProgress, Pagination, Tooltip,
//   Dialog, DialogTitle, DialogContent, DialogActions, Alert, Skeleton,
// } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import EditIcon from "@mui/icons-material/Edit";
// import TrendingUpIcon from "@mui/icons-material/TrendingUp";
// import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
// import WorkIcon from "@mui/icons-material/Work";
// import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
// import { alpha } from "@mui/material/styles";
// import { useAuth } from "../../pages/signin/lib/auth";
// import { useToast } from "../../hooks/useToast";
// import NewJobModal from "./components/NewJobModal";

// import {
//   fetchMyJobs,
//   fetchRecruiterStats,
//   deleteJob as apiDeleteJob,
//   IJob,
//   IRecruiterStats,
//   Paginated,
// } from "./services/recruiter";
// import { formatSalary, timeAgo, JOB_TYPE_LABELS } from "./utils/constants";
// import { StatCardSkeleton, JobRowSkeleton } from "./components/Skeletons";
// import { ProfileDrawer } from "./components/ProfileDrawer";
// import { ApplicationDetailDrawer } from "./components/ApplicationDetailDrawer";
// import { ApplicationsModal } from "./components/ApplicationsModal";

// import { getErrorMessage } from "../../utils/errorUtils";
// import { EditJobModal } from "./components/EditJobModal";

// export default function RecruiterDashboard() {
//   const { user } = useAuth();
//   const toast = useToast();

//   const [stats, setStats] = useState<IRecruiterStats | null>(null);
//   const [statsLoading, setStatsLoading] = useState(true);

//   const [jobsData, setJobsData] = useState<Paginated<IJob> | null>(null);
//   const [jobsLoading, setJobsLoading] = useState(true);
//   const [jobsPage, setJobsPage] = useState(1);
//   const [jobsError, setJobsError] = useState<string | null>(null);

//   const [newJobOpen, setNewJobOpen] = useState(false);
//   const [editingJob, setEditingJob] = useState<IJob | null>(null);
//   const [selectedJob, setSelectedJob] = useState<IJob | null>(null);
//   const [profileUserId, setProfileUserId] = useState<string | null>(null);
//   const [anchor, setAnchor] = useState<{ el: HTMLElement; job: IJob } | null>(null);
//   const [deleteConfirm, setDeleteConfirm] = useState<IJob | null>(null);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [detailAppId, setDetailAppId] = useState<string | null>(null);

//   const loadStats = useCallback(async () => {
//     setStatsLoading(true);
//     try {
//       const s = await fetchRecruiterStats();
//       setStats(s);
//     } catch (err) {
//       setStats(null);
//       toast.error(getErrorMessage(err, "Failed to load dashboard stats."));
//     } finally {
//       setStatsLoading(false);
//     }
//   }, [toast]);

//   const loadJobs = useCallback(async (p: number) => {
//     setJobsLoading(true);
//     setJobsError(null);
//     try {
//       const res = await fetchMyJobs({ page: p, limit: 8 });
//       setJobsData(res);
//       setJobsPage(p);
//     } catch (err) {
//       setJobsError(getErrorMessage(err, "Failed to load jobs. Please try again."));
//     } finally {
//       setJobsLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     loadStats();
//     loadJobs(1);
//   }, [loadStats, loadJobs]);

//   function handleJobCreated() {
//     setNewJobOpen(false);
//     toast.success("Job posted successfully!");
//     loadJobs(1);
//     loadStats();
//   }

//   function handleJobUpdated(updated: IJob) {
//     setEditingJob(null);
//     setJobsData((prev) =>
//       prev ? { ...prev, items: prev.items.map((j) => (j._id === updated._id ? updated : j)) } : prev
//     );
//     loadStats();
//   }

//   async function handleDelete() {
//     if (!deleteConfirm) return;
//     setDeleteLoading(true);
//     try {
//       await apiDeleteJob(deleteConfirm._id);
//       toast.success(`"${deleteConfirm.title}" deleted`);
//       setDeleteConfirm(null);
//       const targetPage = jobsData?.items.length === 1 && jobsPage > 1 ? jobsPage - 1 : jobsPage;
//       loadJobs(targetPage);
//       loadStats();
//     } catch (err) {
//       toast.error(getErrorMessage(err, "Failed to delete job. Please try again."));
//     } finally {
//       setDeleteLoading(false);
//     }
//   }

//   const pipeline = stats?.pipeline;
//   const totalApps = stats?.totalApplications ?? 0;
//   const pct = (n: number) => (totalApps > 0 ? Math.round((n / totalApps) * 100) : 0);

//   const pipelineRows = pipeline
//     ? [
//       { label: "Applications", value: totalApps, pct: 100 },
//       { label: "Reviewed", value: pipeline.reviewed + pipeline.shortlisted + pipeline.hired, pct: pct(pipeline.reviewed + pipeline.shortlisted + pipeline.hired) },
//       { label: "Shortlisted", value: pipeline.shortlisted + pipeline.hired, pct: pct(pipeline.shortlisted + pipeline.hired) },
//       { label: "Hired", value: pipeline.hired, pct: pct(pipeline.hired) },
//     ]
//     : null;

//   const statCards = [
//     { label: "Active jobs", value: stats ? String(stats.totalJobs) : "–", icon: <WorkIcon /> },
//     { label: "Total applications", value: stats ? String(stats.totalApplications) : "–", icon: <PeopleAltIcon /> },
//     { label: "Shortlisted", value: stats ? String(stats.pipeline.shortlisted) : "–", icon: <CheckCircleOutlineIcon /> },
//     { label: "Hired", value: stats ? String(stats.pipeline.hired) : "–", icon: <TrendingUpIcon /> },
//   ];

//   return (
//     <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
//       <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={2} sx={{ mb: 4 }}>
//         <Box>
//           <Typography variant="overline" color="primary.main">Recruiter workspace</Typography>
//           <Typography variant="h3" sx={{ fontSize: { xs: 28, md: 36 } }}>
//             Welcome back, {user?.name?.split(" ")[0]}
//           </Typography>
//         </Box>
//         <Button variant="contained" size="large" startIcon={<AddIcon />} onClick={() => setNewJobOpen(true)}>
//           New Job
//         </Button>
//       </Stack>

//       <Grid container spacing={3} sx={{ mb: 4 }}>
//         {statsLoading
//           ? [0, 1, 2, 3].map((i) => <Grid item xs={6} md={3} key={i}><StatCardSkeleton /></Grid>)
//           : statCards.map((s) => (
//             <Grid item xs={6} md={3} key={s.label}>
//               <Card sx={{ p: 3 }}>
//                 <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: "#ede9fe", color: "primary.main", width: "fit-content", mb: 1.5 }}>
//                   {s.icon}
//                 </Box>
//                 <Typography variant="h4" sx={{ fontWeight: 800 }}>{s.value}</Typography>
//                 <Typography variant="body2" color="text.secondary">{s.label}</Typography>
//               </Card>
//             </Grid>
//           ))}
//       </Grid>

//       <Grid container spacing={3}>
//         <Grid item xs={12} md={8}>
//           <Card sx={{ p: 3 }}>
//             <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
//               <Typography variant="h6">Your Jobs</Typography>
//               {jobsData && <Typography variant="body2" color="text.secondary">{jobsData.total} total</Typography>}
//             </Stack>

//             {jobsError && <Alert severity="error" sx={{ mb: 2 }}>{jobsError}</Alert>}

//             <Stack spacing={1}>
//               {jobsLoading
//                 ? [1, 2, 3, 4].map((i) => <JobRowSkeleton key={i} />)
//                 : (jobsData?.items ?? []).map((job) => (
//                   <Box
//                     key={job._id}
//                     sx={{
//                       p: 2, borderRadius: 2,
//                       border: "1px solid #e5e7eb",
//                       display: "flex", alignItems: "center", gap: 2,
//                       "&:hover": { borderColor: alpha("#7c3aed", 0.4), bgcolor: "#faf5ff" },
//                       transition: "all .15s",
//                     }}
//                   >
//                     <Avatar sx={{ background: "linear-gradient(135deg, #7c3aed, #a78bfa)", color: "#fff", fontWeight: 700 }}>
//                       {job.title[0]}
//                     </Avatar>

//                     <Box sx={{ flex: 1, minWidth: 0 }}>
//                       <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
//                         <Typography variant="body1" sx={{ fontWeight: 600 }}>{job.title}</Typography>
//                         <Chip
//                           size="small"
//                           label={job.status}
//                           sx={{
//                             textTransform: "capitalize",
//                             bgcolor: job.status === "open" ? "#d1fae5" : job.status === "draft" ? "#fef3c7" : "#f3f4f6",
//                             color: job.status === "open" ? "#059669" : job.status === "draft" ? "#d97706" : "#6b7280",
//                             fontWeight: 600,
//                             border: "none",
//                           }}
//                         />
//                       </Stack>
//                       <Typography variant="body2" color="text.secondary" noWrap>
//                         {job.company} · {job.location} · {timeAgo(job.createdAt)}
//                       </Typography>
//                     </Box>

//                     <Box sx={{ display: { xs: "none", md: "block" }, textAlign: "right", minWidth: 100 }}>
//                       <Typography variant="body2" sx={{ color: "primary.main", fontWeight: 600 }}>{formatSalary(job)}</Typography>
//                       <Typography variant="caption" color="text.secondary">{JOB_TYPE_LABELS[job.type] ?? job.type}</Typography>
//                     </Box>

//                     <Tooltip title="View applications">
//                       <Box
//                         onClick={() => setSelectedJob(job)}
//                         sx={{
//                           display: { xs: "none", sm: "flex" }, flexDirection: "column",
//                           alignItems: "center", cursor: "pointer", minWidth: 50,
//                           "&:hover": { color: "primary.main" },
//                         }}
//                       >
//                         <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1 }}>{job.applicationsCount}</Typography>
//                         <Typography variant="caption" color="text.secondary">apps</Typography>
//                       </Box>
//                     </Tooltip>

//                     <IconButton size="small" onClick={(e) => setAnchor({ el: e.currentTarget, job })}>
//                       <MoreVertIcon />
//                     </IconButton>
//                   </Box>
//                 ))}
//             </Stack>

//             {!jobsLoading && (jobsData?.items.length ?? 0) === 0 && !jobsError && (
//               <Stack alignItems="center" py={4} spacing={1}>
//                 <WorkIcon sx={{ fontSize: 40, color: "text.disabled" }} />
//                 <Typography color="text.secondary">No jobs posted yet</Typography>
//                 <Button startIcon={<AddIcon />} onClick={() => setNewJobOpen(true)}>Post your first job</Button>
//               </Stack>
//             )}

//             {jobsData && jobsData.totalPages > 1 && (
//               <Stack alignItems="center" sx={{ mt: 2 }}>
//                 <Pagination count={jobsData.totalPages} page={jobsPage} onChange={(_, p) => loadJobs(p)} color="primary" />
//               </Stack>
//             )}
//           </Card>
//         </Grid>

//         <Grid item xs={12} md={4}>
//           <Card sx={{ p: 3, mb: 3 }}>
//             <Typography variant="h6" sx={{ mb: 2 }}>Pipeline health</Typography>
//             {statsLoading
//               ? [1, 2, 3, 4].map((i) => (
//                 <Box key={i} sx={{ mb: 2 }}>
//                   <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
//                     <Skeleton variant="text" width="40%" /><Skeleton variant="text" width="20%" />
//                   </Stack>
//                   <Skeleton variant="rounded" height={6} />
//                 </Box>
//               ))
//               : pipelineRows
//                 ? pipelineRows.map((p) => (
//                   <Box key={p.label} sx={{ mb: 2 }}>
//                     <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
//                       <Typography variant="body2">{p.label}</Typography>
//                       <Typography variant="body2" sx={{ fontWeight: 600 }}>
//                         {p.value}{" "}
//                         <Typography component="span" variant="caption" color="text.secondary">({p.pct}%)</Typography>
//                       </Typography>
//                     </Stack>
//                     <LinearProgress variant="determinate" value={p.pct} sx={{ height: 6, borderRadius: 3 }} />
//                   </Box>
//                 ))
//                 : <Typography variant="body2" color="text.secondary">Pipeline data unavailable.</Typography>}
//           </Card>

//           <Card sx={{ p: 3 }}>
//             <Typography variant="h6" sx={{ mb: 2 }}>Quick actions</Typography>
//             <Stack spacing={1}>
//               <Button fullWidth variant="outlined" startIcon={<AddIcon />} onClick={() => setNewJobOpen(true)}>
//                 Post a new job
//               </Button>
//               {(jobsData?.items.slice(0, 3) ?? []).map((job) => (
//                 <Button
//                   key={job._id}
//                   fullWidth
//                   variant="text"
//                   startIcon={<PeopleAltIcon />}
//                   onClick={() => setSelectedJob(job)}
//                   sx={{ justifyContent: "flex-start" }}
//                 >
//                   <Typography variant="body2" noWrap sx={{ flex: 1 }}>
//                     {job.applicationsCount} apps · {job.title}
//                   </Typography>
//                 </Button>
//               ))}
//             </Stack>
//           </Card>
//         </Grid>
//       </Grid>

//       <Menu anchorEl={anchor?.el} open={!!anchor} onClose={() => setAnchor(null)}>
//         <MenuItem onClick={() => { if (anchor) setSelectedJob(anchor.job); setAnchor(null); }}>
//           View applications
//         </MenuItem>
//         <MenuItem onClick={() => { if (anchor) { setEditingJob(anchor.job); setAnchor(null); } }}>
//           <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
//         </MenuItem>
//         <Divider />
//         <MenuItem
//           onClick={() => { if (anchor) setDeleteConfirm(anchor.job); setAnchor(null); }}
//           sx={{ color: "error.main" }}
//         >
//           Delete
//         </MenuItem>
//       </Menu>

//       <Dialog open={!!deleteConfirm} onClose={() => !deleteLoading && setDeleteConfirm(null)}>
//         <DialogTitle>Delete job?</DialogTitle>
//         <DialogContent>
//           <Typography>
//             Are you sure you want to delete <strong>{deleteConfirm?.title}</strong>? This cannot be undone.
//           </Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setDeleteConfirm(null)} disabled={deleteLoading}>Cancel</Button>
//           <Button
//             color="error"
//             variant="contained"
//             disabled={deleteLoading}
//             onClick={handleDelete}
//             startIcon={deleteLoading ? <CircularProgress size={16} /> : null}
//           >
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <NewJobModal
//         open={newJobOpen}
//         onClose={() => setNewJobOpen(false)}
//         onSuccess={handleJobCreated}
//       />

//       <EditJobModal
//         job={editingJob}
//         onClose={() => setEditingJob(null)}
//         onSaved={handleJobUpdated}
//       />

//       <ApplicationsModal
//         job={selectedJob}
//         onClose={() => setSelectedJob(null)}
//         onViewProfile={(id) => { setSelectedJob(null); setProfileUserId(id); }}
//         onViewApplication={(id) => {setSelectedJob(null); setDetailAppId(id)}}
//       />

//       <ApplicationDetailDrawer
//         applicationId={detailAppId}
//         onClose={() => setDetailAppId(null)}
//         onViewProfile={(id) => {
//           setDetailAppId(null);
//           setSelectedJob(null);
//           setProfileUserId(id);
//         }}
//       />

//       <ProfileDrawer userId={profileUserId} onClose={() => setProfileUserId(null)} />
//     </Container>
//   );
// }


// src/pages/recruiter/RecruiterDashboard.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  Container, Grid, Card, Typography, Stack, Button, Box, Chip, IconButton,
  Avatar, LinearProgress, Menu, MenuItem, Divider, CircularProgress, Pagination, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions, Alert, Skeleton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import WorkIcon from "@mui/icons-material/Work";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { alpha } from "@mui/material/styles";
import { useAuth } from "../../pages/signin/lib/auth";
import { useToast } from "../../hooks/useToast";
import NewJobModal from "./components/NewJobModal";

import {
  fetchMyJobs,
  fetchRecruiterStats,
  deleteJob as apiDeleteJob,
  IJob,
  IRecruiterStats,
  Paginated,
} from "./services/recruiter";
import { formatSalary, timeAgo, JOB_TYPE_LABELS } from "./utils/constants";
import { StatCardSkeleton, JobRowSkeleton } from "./components/Skeletons";
import { ProfileDrawer } from "./components/ProfileDrawer";
import { ApplicationDetailDrawer } from "./components/ApplicationDetailDrawer";
import { ApplicationsModal } from "./components/ApplicationsModal";

import { getErrorMessage } from "../../utils/errorUtils";
import { EditJobModal } from "./components/EditJobModal";

// ── Design Tokens (Consistent Green Theme) ─────────────────────────────
const GREEN = "#059669";
const GREEN_DARK = "#047857";
const GREEN_LIGHT = "#d1fae5";

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const toast = useToast();

  const [stats, setStats] = useState<IRecruiterStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [jobsData, setJobsData] = useState<Paginated<IJob> | null>(null);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsPage, setJobsPage] = useState(1);
  const [jobsError, setJobsError] = useState<string | null>(null);

  const [newJobOpen, setNewJobOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<IJob | null>(null);
  const [selectedJob, setSelectedJob] = useState<IJob | null>(null);
  const [profileUserId, setProfileUserId] = useState<string | null>(null);
  const [anchor, setAnchor] = useState<{ el: HTMLElement; job: IJob } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<IJob | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [detailAppId, setDetailAppId] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const s = await fetchRecruiterStats();
      setStats(s);
    } catch (err) {
      setStats(null);
      toast.error(getErrorMessage(err, "Failed to load dashboard stats."));
    } finally {
      setStatsLoading(false);
    }
  }, [toast]);

  const loadJobs = useCallback(async (p: number) => {
    setJobsLoading(true);
    setJobsError(null);
    try {
      const res = await fetchMyJobs({ page: p, limit: 8 });
      setJobsData(res);
      setJobsPage(p);
    } catch (err) {
      setJobsError(getErrorMessage(err, "Failed to load jobs. Please try again."));
    } finally {
      setJobsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
    loadJobs(1);
  }, [loadStats, loadJobs]);

  function handleJobCreated() {
    setNewJobOpen(false);
    toast.success("Job posted successfully!");
    loadJobs(1);
    loadStats();
  }

  function handleJobUpdated(updated: IJob) {
    setEditingJob(null);
    setJobsData((prev) =>
      prev ? { ...prev, items: prev.items.map((j) => (j._id === updated._id ? updated : j)) } : prev
    );
    loadStats();
  }

  async function handleDelete() {
    if (!deleteConfirm) return;
    setDeleteLoading(true);
    try {
      await apiDeleteJob(deleteConfirm._id);
      toast.success(`"${deleteConfirm.title}" deleted`);
      setDeleteConfirm(null);
      const targetPage = jobsData?.items.length === 1 && jobsPage > 1 ? jobsPage - 1 : jobsPage;
      loadJobs(targetPage);
      loadStats();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete job. Please try again."));
    } finally {
      setDeleteLoading(false);
    }
  }

  const pipeline = stats?.pipeline;
  const totalApps = stats?.totalApplications ?? 0;
  const pct = (n: number) => (totalApps > 0 ? Math.round((n / totalApps) * 100) : 0);

  const pipelineRows = pipeline
    ? [
      { label: "Applications", value: totalApps, pct: 100 },
      { label: "Reviewed", value: pipeline.reviewed + pipeline.shortlisted + pipeline.hired, pct: pct(pipeline.reviewed + pipeline.shortlisted + pipeline.hired) },
      { label: "Shortlisted", value: pipeline.shortlisted + pipeline.hired, pct: pct(pipeline.shortlisted + pipeline.hired) },
      { label: "Hired", value: pipeline.hired, pct: pct(pipeline.hired) },
    ]
    : null;

  const statCards = [
    { label: "Active jobs", value: stats ? String(stats.totalJobs) : "–", icon: <WorkIcon /> },
    { label: "Total applications", value: stats ? String(stats.totalApplications) : "–", icon: <PeopleAltIcon /> },
    { label: "Shortlisted", value: stats ? String(stats.pipeline.shortlisted) : "–", icon: <CheckCircleOutlineIcon /> },
    { label: "Hired", value: stats ? String(stats.pipeline.hired) : "–", icon: <TrendingUpIcon /> },
  ];

  // ── StatCard Component (Modern Design with Semi-Circles) ─────────────────────
  interface StatCardProps {
    label: string;
    value: string;
    icon: React.ReactNode;
    color?: string;
    sub?: string;
    sub2?: string;   // Optional second line of subtext
  }

  function StatCard({ label, value, icon, color = GREEN, sub, sub2 }: StatCardProps) {
    return (
      <Card
        sx={{
          p: { xs: 3, sm: 3.5 },
          height: "100%",
          borderRadius: 4,
          border: "1px solid #f1f5f9",
          position: "relative",
          overflow: "hidden",
          background: "#ffffff",
          boxShadow: "0 4px 20px rgba(15, 23, 42, 0.06)",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: "0 20px 40px rgba(15, 23, 42, 0.1)",
          },
        }}
      >
        {/* Decorative Semi-Circles / Bubbles */}
        <Box
          sx={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: alpha(color, 0.08),
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 30,
            right: -40,
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: alpha(color, 0.06),
            zIndex: 0,
          }}
        />

        {/* Icon */}
        <Box
          sx={{
            p: 1.5,
            borderRadius: 3,
            bgcolor: alpha(color, 0.1),
            color: color,
            width: "fit-content",
            mb: 3,
            position: "relative",
            zIndex: 1,
          }}
        >
          {icon}
        </Box>

        {/* Value */}
        <Typography
          sx={{
            fontSize: { xs: 34, sm: 40 },
            fontWeight: 800,
            color: "#0f172a",
            lineHeight: 1,
            mb: 0.5,
          }}
        >
          {value}
        </Typography>

        {/* Label */}
        <Typography
          variant="body1"
          sx={{ fontWeight: 600, color: "#334155", mb: 0.5 }}
        >
          {label}
        </Typography>

        {/* Sub Text */}
        {(sub || sub2) && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: 13.5, lineHeight: 1.5 }}
          >
            {sub}
            {sub && sub2 && " • "}
            {sub2}
          </Typography>
        )}
      </Card>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={2} sx={{ mb: 4 }}>
        <Box>
          <Typography variant="overline" sx={{ color: GREEN, fontWeight: 700 }}>
            RECRUITER WORKSPACE
          </Typography>
          <Typography variant="h3" sx={{ fontSize: { xs: 28, md: 36 } }}>
            Welcome back, {user?.name?.split(" ")[0]}
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={() => setNewJobOpen(true)}
          sx={{
            background: `linear-gradient(135deg, ${GREEN} 0%, ${GREEN_DARK} 100%)`,
            "&:hover": { background: `linear-gradient(135deg, ${GREEN_DARK}, #065f46)` }
          }}
        >
          New Job
        </Button>
      </Stack>

      {/* Modern Stats Section - Target Design */}
      {/* Stats Section with Semi-Circle Design */}
      <Grid container spacing={2.5} sx={{ mb: 5 }}>
        {statsLoading
          ? [0, 1, 2, 3].map((i) => (
            <Grid item xs={6} md={3} key={i}>
              <StatCardSkeleton />
            </Grid>
          ))
          : statCards.map((s, index) => {
            const isEven = index % 2 === 0;
            return (
              <Grid item xs={6} md={3} key={s.label}>
                <StatCard
                  label={s.label}
                  value={s.value}
                  icon={s.icon}
                  color={isEven ? GREEN : "#6366f1"} // Green & Indigo alternating
                />
              </Grid>
            );
          })}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight={700}>Your Jobs</Typography>
              {jobsData && <Typography variant="body2" color="text.secondary">{jobsData.total} total</Typography>}
            </Stack>

            {jobsError && <Alert severity="error" sx={{ mb: 2 }}>{jobsError}</Alert>}

            <Stack spacing={2}>
              {jobsLoading
                ? [1, 2, 3, 4].map((i) => <JobRowSkeleton key={i} />)
                : (jobsData?.items ?? []).map((job) => (
                  <Box
                    key={job._id}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      border: "1px solid #e2e8f0",
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                      "&:hover": {
                        borderColor: alpha(GREEN, 0.4),
                        bgcolor: GREEN_LIGHT
                      },
                      transition: "all .2s",
                    }}
                  >
                    <Avatar
                      sx={{
                        background: `linear-gradient(135deg, ${GREEN}, ${GREEN_DARK})`,
                        color: "#fff",
                        fontWeight: 700
                      }}
                    >
                      {job.title[0]}
                    </Avatar>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{job.title}</Typography>
                        <Chip
                          size="small"
                          label={job.status}
                          sx={{
                            textTransform: "capitalize",
                            bgcolor: job.status === "open" ? GREEN_LIGHT : job.status === "draft" ? "#fef3c7" : "#f3f4f6",
                            color: job.status === "open" ? GREEN : job.status === "draft" ? "#d97706" : "#6b7280",
                            fontWeight: 600,
                          }}
                        />
                      </Stack>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {job.company} · {job.location} · {timeAgo(job.createdAt)}
                      </Typography>
                    </Box>

                    <Box sx={{ display: { xs: "none", md: "block" }, textAlign: "right", minWidth: 110 }}>
                      <Typography variant="body2" sx={{ color: GREEN, fontWeight: 600 }}>{formatSalary(job)}</Typography>
                      <Typography variant="caption" color="text.secondary">{JOB_TYPE_LABELS[job.type] ?? job.type}</Typography>
                    </Box>

                    <Tooltip title="View applications">
                      <Box
                        onClick={() => setSelectedJob(job)}
                        sx={{
                          display: { xs: "none", sm: "flex" },
                          flexDirection: "column",
                          alignItems: "center",
                          cursor: "pointer",
                          minWidth: 50,
                          "&:hover": { color: GREEN },
                        }}
                      >
                        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1, color: GREEN }}>
                          {job.applicationsCount}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">apps</Typography>
                      </Box>
                    </Tooltip>

                    <IconButton size="small" onClick={(e) => setAnchor({ el: e.currentTarget, job })}>
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                ))}
            </Stack>

            {!jobsLoading && (jobsData?.items.length ?? 0) === 0 && !jobsError && (
              <Stack alignItems="center" py={4} spacing={1}>
                <WorkIcon sx={{ fontSize: 40, color: "text.disabled" }} />
                <Typography color="text.secondary">No jobs posted yet</Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => setNewJobOpen(true)}
                  variant="outlined"
                  sx={{ borderColor: GREEN, color: GREEN }}
                >
                  Post your first job
                </Button>
              </Stack>
            )}

            {jobsData && jobsData.totalPages > 1 && (
              <Stack alignItems="center" sx={{ mt: 3 }}>
                <Pagination
                  count={jobsData.totalPages}
                  page={jobsPage}
                  onChange={(_, p) => loadJobs(p)}
                  color="primary"
                />
              </Stack>
            )}
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>Pipeline Health</Typography>
            {statsLoading
              ? [1, 2, 3, 4].map((i) => (
                <Box key={i} sx={{ mb: 3 }}>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                    <Skeleton variant="text" width="40%" />
                    <Skeleton variant="text" width="20%" />
                  </Stack>
                  <Skeleton variant="rounded" height={8} />
                </Box>
              ))
              : pipelineRows
                ? pipelineRows.map((p) => (
                  <Box key={p.label} sx={{ mb: 3 }}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Typography variant="body2">{p.label}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {p.value} <Typography component="span" variant="caption" color="text.secondary">({p.pct}%)</Typography>
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={p.pct}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: "#e2e8f0",
                        "& .MuiLinearProgress-bar": { bgcolor: GREEN }
                      }}
                    />
                  </Box>
                ))
                : <Typography variant="body2" color="text.secondary">Pipeline data unavailable.</Typography>}
          </Card>

          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>Quick Actions</Typography>
            <Stack spacing={1.5}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setNewJobOpen(true)}
                sx={{
                  background: `linear-gradient(135deg, ${GREEN} 0%, ${GREEN_DARK} 100%)`,
                  "&:hover": { background: `linear-gradient(135deg, ${GREEN_DARK}, #065f46)` }
                }}
              >
                Post a New Job
              </Button>
              {(jobsData?.items.slice(0, 3) ?? []).map((job) => (
                <Button
                  key={job._id}
                  fullWidth
                  variant="outlined"
                  startIcon={<PeopleAltIcon />}
                  onClick={() => setSelectedJob(job)}
                  sx={{
                    justifyContent: "flex-start",
                    borderColor: GREEN,
                    color: GREEN
                  }}
                >
                  <Typography variant="body2" noWrap sx={{ flex: 1 }}>
                    {job.applicationsCount} apps • {job.title}
                  </Typography>
                </Button>
              ))}
            </Stack>
          </Card>
        </Grid>
      </Grid>

      {/* Rest of your code (Menu, Dialogs, Modals) remains unchanged */}
      <Menu anchorEl={anchor?.el} open={!!anchor} onClose={() => setAnchor(null)}>
        <MenuItem onClick={() => { if (anchor) setSelectedJob(anchor.job); setAnchor(null); }}>
          View applications
        </MenuItem>
        <MenuItem onClick={() => { if (anchor) { setEditingJob(anchor.job); setAnchor(null); } }}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => { if (anchor) setDeleteConfirm(anchor.job); setAnchor(null); }}
          sx={{ color: "error.main" }}
        >
          Delete
        </MenuItem>
      </Menu>

      <Dialog open={!!deleteConfirm} onClose={() => !deleteLoading && setDeleteConfirm(null)}>
        <DialogTitle>Delete job?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{deleteConfirm?.title}</strong>? This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)} disabled={deleteLoading}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            disabled={deleteLoading}
            onClick={handleDelete}
            startIcon={deleteLoading ? <CircularProgress size={16} /> : null}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <NewJobModal
        open={newJobOpen}
        onClose={() => setNewJobOpen(false)}
        onSuccess={handleJobCreated}
      />

      <EditJobModal
        job={editingJob}
        onClose={() => setEditingJob(null)}
        onSaved={handleJobUpdated}
      />

      <ApplicationsModal
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
        onViewProfile={(id) => { setSelectedJob(null); setProfileUserId(id); }}
        onViewApplication={(id) => { setSelectedJob(null); setDetailAppId(id) }}
      />

      <ApplicationDetailDrawer
        applicationId={detailAppId}
        onClose={() => setDetailAppId(null)}
        onViewProfile={(id) => {
          setDetailAppId(null);
          setSelectedJob(null);
          setProfileUserId(id);
        }}
      />

      <ProfileDrawer userId={profileUserId} onClose={() => setProfileUserId(null)} />
    </Container>
  );
}