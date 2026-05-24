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
import { EditJobModal } from "./components/EditJobModal";
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

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={2} sx={{ mb: 4 }}>
        <Box>
          <Typography variant="overline" color="primary.main">Recruiter workspace</Typography>
          <Typography variant="h3" sx={{ fontSize: { xs: 28, md: 36 } }}>
            Welcome back, {user?.name?.split(" ")[0]}
          </Typography>
        </Box>
        <Button variant="contained" size="large" startIcon={<AddIcon />} onClick={() => setNewJobOpen(true)}>
          New Job
        </Button>
      </Stack>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsLoading
          ? [0, 1, 2, 3].map((i) => <Grid item xs={6} md={3} key={i}><StatCardSkeleton /></Grid>)
          : statCards.map((s) => (
            <Grid item xs={6} md={3} key={s.label}>
              <Card sx={{ p: 3 }}>
                <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: alpha("#34d39e", 0.12), color: "primary.main", width: "fit-content", mb: 1.5 }}>
                  {s.icon}
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>{s.value}</Typography>
                <Typography variant="body2" color="text.secondary">{s.label}</Typography>
              </Card>
            </Grid>
          ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
              <Typography variant="h6">Your Jobs</Typography>
              {jobsData && <Typography variant="body2" color="text.secondary">{jobsData.total} total</Typography>}
            </Stack>

            {jobsError && <Alert severity="error" sx={{ mb: 2 }}>{jobsError}</Alert>}

            <Stack spacing={1}>
              {jobsLoading
                ? [1, 2, 3, 4].map((i) => <JobRowSkeleton key={i} />)
                : (jobsData?.items ?? []).map((job) => (
                  <Box
                    key={job._id}
                    sx={{
                      p: 2, borderRadius: 2,
                      border: `1px solid ${alpha("#ffffff", 0.06)}`,
                      display: "flex", alignItems: "center", gap: 2,
                      "&:hover": { borderColor: alpha("#34d39e", 0.4) },
                      transition: "border-color .15s",
                    }}
                  >
                    <Avatar sx={{ bgcolor: alpha("#34d39e", 0.12), color: "primary.main", fontWeight: 700 }}>
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
                            bgcolor: job.status === "open" ? alpha("#34d39e", 0.15) : alpha("#ffffff", 0.08),
                            color: job.status === "open" ? "primary.main" : "text.secondary",
                            fontWeight: 600,
                          }}
                        />
                      </Stack>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {job.company} · {job.location} · {timeAgo(job.createdAt)}
                      </Typography>
                    </Box>

                    <Box sx={{ display: { xs: "none", md: "block" }, textAlign: "right", minWidth: 100 }}>
                      <Typography variant="body2" sx={{ color: "primary.main", fontWeight: 600 }}>{formatSalary(job)}</Typography>
                      <Typography variant="caption" color="text.secondary">{JOB_TYPE_LABELS[job.type] ?? job.type}</Typography>
                    </Box>

                    <Tooltip title="View applications">
                      <Box
                        onClick={() => setSelectedJob(job)}
                        sx={{
                          display: { xs: "none", sm: "flex" }, flexDirection: "column",
                          alignItems: "center", cursor: "pointer", minWidth: 50,
                          "&:hover": { color: "primary.main" },
                        }}
                      >
                        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1 }}>{job.applicationsCount}</Typography>
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
                <Button startIcon={<AddIcon />} onClick={() => setNewJobOpen(true)}>Post your first job</Button>
              </Stack>
            )}

            {jobsData && jobsData.totalPages > 1 && (
              <Stack alignItems="center" sx={{ mt: 2 }}>
                <Pagination count={jobsData.totalPages} page={jobsPage} onChange={(_, p) => loadJobs(p)} color="primary" />
              </Stack>
            )}
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Pipeline health</Typography>
            {statsLoading
              ? [1, 2, 3, 4].map((i) => (
                <Box key={i} sx={{ mb: 2 }}>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                    <Skeleton variant="text" width="40%" /><Skeleton variant="text" width="20%" />
                  </Stack>
                  <Skeleton variant="rounded" height={6} />
                </Box>
              ))
              : pipelineRows
                ? pipelineRows.map((p) => (
                  <Box key={p.label} sx={{ mb: 2 }}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                      <Typography variant="body2">{p.label}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {p.value}{" "}
                        <Typography component="span" variant="caption" color="text.secondary">({p.pct}%)</Typography>
                      </Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={p.pct} sx={{ height: 6, borderRadius: 3 }} />
                  </Box>
                ))
                : <Typography variant="body2" color="text.secondary">Pipeline data unavailable.</Typography>}
          </Card>

          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Quick actions</Typography>
            <Stack spacing={1}>
              <Button fullWidth variant="outlined" startIcon={<AddIcon />} onClick={() => setNewJobOpen(true)}>
                Post a new job
              </Button>
              {(jobsData?.items.slice(0, 3) ?? []).map((job) => (
                <Button
                  key={job._id}
                  fullWidth
                  variant="text"
                  startIcon={<PeopleAltIcon />}
                  onClick={() => setSelectedJob(job)}
                  sx={{ justifyContent: "flex-start" }}
                >
                  <Typography variant="body2" noWrap sx={{ flex: 1 }}>
                    {job.applicationsCount} apps · {job.title}
                  </Typography>
                </Button>
              ))}
            </Stack>
          </Card>
        </Grid>
      </Grid>

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
        onViewApplication={(id) => {setSelectedJob(null); setDetailAppId(id)}}
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
