// pages/RecruiterDashboard.tsx

import { useState, useEffect, useCallback } from "react";
import {
  Container, Grid, Card, Typography, Stack, Button, Box, Chip, IconButton,
  Avatar, LinearProgress, Menu, MenuItem, Drawer, Divider, Select,
  FormControl, CircularProgress, Pagination, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions, Alert, Skeleton,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import WorkIcon from "@mui/icons-material/Work";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LanguageIcon from "@mui/icons-material/Language";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import ArticleIcon from "@mui/icons-material/Article";
import HistoryIcon from "@mui/icons-material/History";
import { alpha } from "@mui/material/styles";
import { useAuth } from "../lib/auth";
import { useToast } from "../hooks/useToast";
import NewJobModal from "../components/NewJobModal";
import {
  fetchMyJobs,
  fetchRecruiterStats,
  fetchApplicationsForJob,
  fetchJobSeekerProfile,
  updateApplicationStatus,
  fetchApplicationById,
  updateJob,
  deleteJob as apiDeleteJob,
  IJob,
  IApplication,
  IJobSeekerProfile,
  IRecruiterStats,
  ApplicationStatus,
  Paginated,
  JobStatus,
} from "../api/recruiter";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatSalary(job: IJob) {
  if (!job.salaryRange) return "–";
  const { min, max, currency } = job.salaryRange;
  const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(0)}k` : String(n));
  return `${currency} ${fmt(min)}–${fmt(max)}`;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d === 0) return "Today";
  if (d === 1) return "Yesterday";
  if (d < 30) return `${d}d ago`;
  return `${Math.floor(d / 30)}mo ago`;
}

const JOB_TYPE_LABELS: Record<string, string> = {
  full_time: "Full-time", part_time: "Part-time", contract: "Contract",
  internship: "Internship", remote: "Remote",
};

const JOB_STATUS_OPTIONS: { value: JobStatus; label: string }[] = [
  { value: "open",   label: "Open"   },
  { value: "draft",  label: "Draft"  },
  { value: "closed", label: "Closed" },
];

// ─── Skeletons ────────────────────────────────────────────────────────────────

function StatCardSkeleton() {
  return (
    <Card sx={{ p: 3 }}>
      <Skeleton variant="rounded" width={36} height={36} sx={{ mb: 1.5 }} />
      <Skeleton variant="text" width="50%" height={40} />
      <Skeleton variant="text" width="70%" />
    </Card>
  );
}

function JobRowSkeleton() {
  return (
    <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
      <Skeleton variant="circular" width={40} height={40} />
      <Box sx={{ flex: 1 }}>
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" />
      </Box>
      <Skeleton variant="rounded" width={60} height={24} />
    </Box>
  );
}

// ─── Slim Edit Modal ──────────────────────────────────────────────────────────
// Only updates status + title — quick edits from the dashboard context menu.
// Full re-posting is handled by NewJobModal (create flow).

interface EditJobModalProps {
  job: IJob | null;
  onClose: () => void;
  onSaved: (updated: IJob) => void;
}

function EditJobModal({ job, onClose, onSaved }: EditJobModalProps) {
  const toast = useToast();
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (job) { setTitle(job.title); }
  }, [job]);

  async function handleSave() {
    if (!job) return;
    setSaving(true);
    try {
      const updated = await updateJob(job._id, { title });
      toast.success(`"${updated.title}" updated`);
      onSaved(updated);
    } catch {
      toast.error("Failed to update job. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      open={!!job}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { bgcolor: "background.paper", backgroundImage: "none" } }}
    >
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Edit job</Typography>
          <IconButton onClick={onClose} disabled={saving}><CloseIcon /></IconButton>
        </Stack>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField
            label="Job title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={saving}
          />

        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={saving}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving || !title.trim()}
          startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {saving ? "Saving…" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Profile Drawer ───────────────────────────────────────────────────────────

interface ProfileDrawerProps {
  userId: string | null;
  onClose: () => void;
}

function ProfileDrawer({ userId, onClose }: ProfileDrawerProps) {
  const [profile, setProfile] = useState<IJobSeekerProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setProfile(null);
    setError(null);
    fetchJobSeekerProfile(userId)
      .then(setProfile)
      .catch(() => setError("Could not load profile."))
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <Drawer
      anchor="right"
      open={!!userId}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: "100%", sm: 480 }, p: 3, bgcolor: "background.paper" } }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">Applicant Profile</Typography>
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </Stack>
      <Divider sx={{ mb: 3 }} />

      {loading && (
        <Stack spacing={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Skeleton variant="circular" width={56} height={56} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" />
            </Box>
          </Stack>
          {[1, 2, 3].map((i) => <Skeleton key={i} variant="rounded" height={60} />)}
        </Stack>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {profile && (
        <Stack spacing={3}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ width: 56, height: 56, fontSize: 22, bgcolor: alpha("#34d39e", 0.2), color: "primary.main" }}>
              {profile.user?.name?.[0] ?? "?"}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>{profile.user?.name}</Typography>
              <Typography variant="body2" color="text.secondary">{profile.headline ?? profile.user?.email}</Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1} flexWrap="wrap">
            {profile.linkedIn && (
              <IconButton size="small" component="a" href={profile.linkedIn} target="_blank"><LinkedInIcon fontSize="small" /></IconButton>
            )}
            {profile.github && (
              <IconButton size="small" component="a" href={profile.github} target="_blank"><GitHubIcon fontSize="small" /></IconButton>
            )}
            {profile.portfolio && (
              <IconButton size="small" component="a" href={profile.portfolio} target="_blank"><LanguageIcon fontSize="small" /></IconButton>
            )}
            {profile.resumeUrl && (
              <Button size="small" variant="outlined" startIcon={<OpenInNewIcon />} href={profile.resumeUrl} target="_blank">
                Resume
              </Button>
            )}
          </Stack>

          {profile.bio && (
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>About</Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>{profile.bio}</Typography>
            </Box>
          )}

          {profile.skills.length > 0 && (
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>Skills</Typography>
              <Stack direction="row" flexWrap="wrap" gap={0.5} sx={{ mt: 0.75 }}>
                {profile.skills.map((s) => (
                  <Chip key={s} label={s} size="small" sx={{ bgcolor: alpha("#34d39e", 0.1), color: "primary.main" }} />
                ))}
              </Stack>
            </Box>
          )}

          {profile.experience.length > 0 && (
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>Experience</Typography>
              <Stack spacing={1.5} sx={{ mt: 0.75 }}>
                {profile.experience.map((exp, i) => (
                  <Box key={exp._id ?? i} sx={{ p: 1.5, borderRadius: 1.5, border: `1px solid ${alpha("#ffffff", 0.07)}` }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{exp.title}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {exp.company}{exp.location ? ` · ${exp.location}` : ""}
                    </Typography>
                    <Typography variant="caption" color="text.disabled" display="block">
                      {new Date(exp.startDate).getFullYear()} – {exp.isCurrent ? "Present" : exp.endDate ? new Date(exp.endDate).getFullYear() : ""}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {profile.education.length > 0 && (
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>Education</Typography>
              <Stack spacing={1.5} sx={{ mt: 0.75 }}>
                {profile.education.map((edu, i) => (
                  <Box key={edu._id ?? i} sx={{ p: 1.5, borderRadius: 1.5, border: `1px solid ${alpha("#ffffff", 0.07)}` }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{edu.degree} in {edu.fieldOfStudy}</Typography>
                    <Typography variant="caption" color="text.secondary">{edu.institution}</Typography>
                    <Typography variant="caption" color="text.disabled" display="block">
                      {edu.startYear} – {edu.endYear ?? "Present"}{edu.grade ? ` · ${edu.grade}` : ""}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {(profile.expectedSalary || profile.noticePeriod !== undefined) && (
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>Preferences</Typography>
              <Stack direction="row" spacing={2} sx={{ mt: 0.75 }}>
                {profile.expectedSalary && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">Expected salary</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{profile.expectedSalary.toLocaleString()}</Typography>
                  </Box>
                )}
                {profile.noticePeriod !== undefined && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">Notice period</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{profile.noticePeriod} days</Typography>
                  </Box>
                )}
              </Stack>
            </Box>
          )}
        </Stack>
      )}
    </Drawer>
  );
}


// ─── Application Detail Drawer ────────────────────────────────────────────────
// Opens for a single application — shows cover letter, resume, status history.

interface ApplicationDetailDrawerProps {
  applicationId: string | null;
  onClose: () => void;
  onViewProfile: (userId: string) => void;
}

function ApplicationDetailDrawer({ applicationId, onClose, onViewProfile }: ApplicationDetailDrawerProps) {
  const [app, setApp] = useState<IApplication | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!applicationId) return;
    setLoading(true);
    setApp(null);
    setError(null);
    fetchApplicationById(applicationId)
      .then(setApp)
      .catch(() => setError("Could not load application details."))
      .finally(() => setLoading(false));
  }, [applicationId]);

  const applicant = app && typeof app.applicant === "object"
    ? (app.applicant as IJobSeekerProfile)
    : null;
  const userId = applicant?._id ?? (typeof app?.applicant === "string" ? app.applicant : null);
  const name = applicant?.user?.name ?? "Applicant";

  const STATUS_COLOR: Record<string, "default" | "warning" | "info" | "error" | "success"> = {
    pending:     "default",
    reviewed:    "warning",
    shortlisted: "info",
    rejected:    "error",
    hired:       "success",
  };

  return (
    <Drawer
      anchor="right"
      open={!!applicationId}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: "100%", sm: 520 }, bgcolor: "background.paper" } }}
    >
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 3, py: 2, borderBottom: `1px solid ${alpha("#ffffff", 0.07)}` }}>
        <Typography variant="h6">Application Details</Typography>
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </Stack>

      <Box sx={{ overflowY: "auto", flex: 1, px: 3, py: 2.5 }}>
        {loading && (
          <Stack spacing={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Skeleton variant="circular" width={48} height={48} />
              <Box sx={{ flex: 1 }}><Skeleton variant="text" width="55%" /><Skeleton variant="text" width="35%" /></Box>
            </Stack>
            <Skeleton variant="rounded" height={80} />
            <Skeleton variant="rounded" height={120} />
          </Stack>
        )}

        {error && <Alert severity="error">{error}</Alert>}

        {app && (
          <Stack spacing={3}>

            {/* Applicant header */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ width: 48, height: 48, bgcolor: alpha("#34d39e", 0.2), color: "primary.main", fontWeight: 700, fontSize: 18 }}>
                {name[0]}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>{name}</Typography>
                {applicant?.headline && (
                  <Typography variant="caption" color="text.secondary" noWrap>{applicant.headline}</Typography>
                )}
                <Typography variant="caption" color="text.disabled" display="block">
                  Applied {timeAgo(app.createdAt)}
                </Typography>
              </Box>
              <Stack direction="row" spacing={0.5}>
                <Chip
                  size="small"
                  label={app.status}
                  color={STATUS_COLOR[app.status] ?? "default"}
                  sx={{ textTransform: "capitalize", fontWeight: 600 }}
                />
                {userId && (
                  <Tooltip title="View full profile">
                    <IconButton size="small" onClick={() => { onViewProfile(userId); onClose(); }}>
                      <PersonIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Stack>
            </Stack>

            <Divider />

            {/* Resume */}
            {app.resumeUrl && (
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
                  Resume
                </Typography>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<OpenInNewIcon />}
                  href={app.resumeUrl}
                  target="_blank"
                  sx={{ mt: 0.75, justifyContent: "flex-start" }}
                >
                  View Resume
                </Button>
              </Box>
            )}

            {/* Cover letter */}
            {app.coverLetter && (
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75 }}>
                  <ArticleIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
                    Cover Letter
                  </Typography>
                </Stack>
                <Box sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${alpha("#ffffff", 0.08)}`, bgcolor: alpha("#ffffff", 0.02) }}>
                  <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}>
                    {app.coverLetter}
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Recruiter notes */}
            {app.recruiterNotes && (
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
                  Recruiter Notes
                </Typography>
                <Box sx={{ p: 2, mt: 0.75, borderRadius: 1.5, border: `1px solid ${alpha("#34d39e", 0.15)}`, bgcolor: alpha("#34d39e", 0.04) }}>
                  <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>{app.recruiterNotes}</Typography>
                </Box>
              </Box>
            )}

            {/* Status history */}
            {app.statusHistory && app.statusHistory.length > 0 && (
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <HistoryIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
                    Status History
                  </Typography>
                </Stack>
                <Stack spacing={0}>
                  {[...app.statusHistory].reverse().map((h, i) => (
                    <Box
                      key={i}
                      sx={{
                        display: "flex", gap: 2, pb: 2,
                        position: "relative",
                        "&::before": i < app.statusHistory.length - 1 ? {
                          content: '""', position: "absolute",
                          left: 7, top: 20, bottom: 0, width: 1,
                          bgcolor: alpha("#ffffff", 0.08),
                        } : {},
                      }}
                    >
                      {/* Timeline dot */}
                      <Box sx={{
                        width: 16, height: 16, borderRadius: "50%", flexShrink: 0, mt: 0.25,
                        bgcolor: i === 0 ? "primary.main" : alpha("#ffffff", 0.15),
                        border: `2px solid ${i === 0 ? "primary.main" : alpha("#ffffff", 0.1)}`,
                      }} />
                      <Box>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Chip
                            size="small"
                            label={h.status}
                            color={STATUS_COLOR[h.status] ?? "default"}
                            sx={{ textTransform: "capitalize", height: 20, fontSize: 11 }}
                          />
                          <Typography variant="caption" color="text.disabled">
                            {new Date(h.changedAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
                          </Typography>
                        </Stack>
                        {h.note && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.25 }}>
                            {h.note}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}

          </Stack>
        )}
      </Box>
    </Drawer>
  );
}

// ─── Applications Modal ───────────────────────────────────────────────────────

interface ApplicationsModalProps {
  job: IJob | null;
  onClose: () => void;
  onViewProfile: (userId: string) => void;
}

function ApplicationsModal({ job, onClose, onViewProfile }: ApplicationsModalProps) {
  const toast = useToast();
  const [data, setData] = useState<Paginated<IApplication> | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [detailAppId, setDetailAppId] = useState<string | null>(null); // application detail drawer

  const load = useCallback((p: number) => {
    if (!job) return;
    setLoading(true);
    setError(null);
    fetchApplicationsForJob(job._id, { page: p, limit: 10 })
      .then((res) => { setData(res); setPage(p); })
      .catch(() => setError("Failed to load applications."))
      .finally(() => setLoading(false));
  }, [job]);

  useEffect(() => { if (job) load(1); }, [job, load]);

  async function handleStatusChange(app: IApplication, status: ApplicationStatus) {
    setUpdatingId(app._id);
    try {
      const updated = await updateApplicationStatus(app._id, { status });
      setData((prev) =>
        prev ? { ...prev, items: prev.items.map((a) => (a._id === app._id ? updated : a)) } : prev
      );
      toast.success(`Application marked as "${status}"`);
    } catch {
      toast.error("Failed to update application status");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <Dialog
      open={!!job}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { bgcolor: "background.paper", backgroundImage: "none" } }}
    >
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6">{job?.title}</Typography>
            <Typography variant="caption" color="text.secondary">{job?.company} · {job?.location}</Typography>
          </Box>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Stack>
      </DialogTitle>
      <Divider />

      <DialogContent sx={{ p: 0 }}>
        {error && <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>}

        {loading && (
          <Stack>
            {[1, 2, 3].map((i) => (
              <Box key={i} sx={{ px: 3, py: 2, borderBottom: `1px solid ${alpha("#ffffff", 0.06)}` }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Skeleton variant="circular" width={40} height={40} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="40%" />
                    <Skeleton variant="text" width="60%" />
                  </Box>
                  <Skeleton variant="rounded" width={120} height={32} />
                </Stack>
              </Box>
            ))}
          </Stack>
        )}

        {!loading && data?.items.length === 0 && (
          <Stack alignItems="center" py={6} spacing={1}>
            <HourglassEmptyIcon sx={{ fontSize: 40, color: "text.disabled" }} />
            <Typography color="text.secondary">No applications yet</Typography>
          </Stack>
        )}

        {!loading && (data?.items ?? []).map((app) => {
          const applicant = typeof app.applicant === "object" ? (app.applicant as IJobSeekerProfile) : null;
          const userId = applicant?._id ?? (typeof app.applicant === "string" ? app.applicant : null);
          const name = applicant?.user?.name ?? "Applicant";
          const headline = applicant?.headline ?? applicant?.user?.email ?? "";

          return (
            <Box
              key={app._id}
              sx={{
                px: 3, py: 2,
                borderBottom: `1px solid ${alpha("#ffffff", 0.05)}`,
                "&:hover": { bgcolor: alpha("#ffffff", 0.02) },
                transition: "background .15s",
              }}
            >
              <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ sm: "center" }} spacing={2}>
                <Avatar sx={{ bgcolor: alpha("#34d39e", 0.15), color: "primary.main", fontWeight: 700 }}>
                  {name[0]}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{name}</Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>{headline}</Typography>
                  <Typography variant="caption" color="text.disabled" display="block">
                    Applied {timeAgo(app.createdAt)}
                  </Typography>
                </Box>

                <FormControl size="small" sx={{ minWidth: 130 }}>
                  <Select
                    value={app.status}
                    disabled={updatingId === app._id}
                    onChange={(e) => handleStatusChange(app, e.target.value as ApplicationStatus)}
                    startAdornment={
                      updatingId === app._id ? <CircularProgress size={14} sx={{ mr: 1 }} /> : null
                    }
                  >
                    {Object.values(ApplicationStatus).map((s) => (
                      <MenuItem key={s} value={s} sx={{ textTransform: "capitalize" }}>{s}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {userId && (
                  <Tooltip title="View profile">
                    <IconButton size="small" onClick={() => onViewProfile(userId)}>
                      <PersonIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="View application">
                  <IconButton size="small" onClick={() => setDetailAppId(app._id)}>
                    <ArticleIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>

              {app.coverLetter && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mt: 1, pl: 7, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                >
                  "{app.coverLetter}"
                </Typography>
              )}
            </Box>
          );
        })}
      </DialogContent>

      {data && data.totalPages > 1 && (
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Pagination count={data.totalPages} page={page} onChange={(_, p) => load(p)} color="primary" />
        </DialogActions>
      )}

      {/* Application detail drawer — calls GET /applications/:id */}
      <ApplicationDetailDrawer
        applicationId={detailAppId}
        onClose={() => setDetailAppId(null)}
        onViewProfile={(id) => { setDetailAppId(null); onClose(); onViewProfile(id); }}
      />
    </Dialog>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const toast = useToast();

  // Stats
  const [stats, setStats] = useState<IRecruiterStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Jobs
  const [jobsData, setJobsData] = useState<Paginated<IJob> | null>(null);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsPage, setJobsPage] = useState(1);
  const [jobsError, setJobsError] = useState<string | null>(null);

  // Modals / drawers
  const [newJobOpen, setNewJobOpen] = useState(false);       // multi-step create modal
  const [editingJob, setEditingJob] = useState<IJob | null>(null); // slim edit modal
  const [selectedJob, setSelectedJob] = useState<IJob | null>(null); // applications modal
  const [profileUserId, setProfileUserId] = useState<string | null>(null);
  const [anchor, setAnchor] = useState<{ el: HTMLElement; job: IJob } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<IJob | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ── Loaders ──────────────────────────────────────────────────────────────────

  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const s = await fetchRecruiterStats();
      setStats(s);
    } catch {
      setStats(null);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const loadJobs = useCallback(async (p: number) => {
    setJobsLoading(true);
    setJobsError(null);
    try {
      const res = await fetchMyJobs({ page: p, limit: 8 });
      setJobsData(res);
      setJobsPage(p);
    } catch {
      setJobsError("Failed to load jobs. Please try again.");
    } finally {
      setJobsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
    loadJobs(1);
  }, [loadStats, loadJobs]);

  // ── Handlers ─────────────────────────────────────────────────────────────────

  // Called by NewJobModal after successful createJob() API call
  function handleJobCreated() {
    setNewJobOpen(false);
    toast.success("Job posted successfully!");
    loadJobs(1);
    loadStats();
  }

  // Called by EditJobModal after successful updateJob() API call
  function handleJobUpdated(updated: IJob) {
    setEditingJob(null);
    // Patch row in-place — no full reload needed
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
    } catch {
      toast.error("Failed to delete job. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  }

  // ── Derived pipeline data ─────────────────────────────────────────────────

  const pipeline = stats?.pipeline;
  const totalApps = stats?.totalApplications ?? 0;
  const pct = (n: number) => (totalApps > 0 ? Math.round((n / totalApps) * 100) : 0);

  const pipelineRows = pipeline
    ? [
        { label: "Applications", value: totalApps, pct: 100 },
        { label: "Reviewed",    value: pipeline.reviewed + pipeline.shortlisted + pipeline.hired, pct: pct(pipeline.reviewed + pipeline.shortlisted + pipeline.hired) },
        { label: "Shortlisted", value: pipeline.shortlisted + pipeline.hired,                     pct: pct(pipeline.shortlisted + pipeline.hired) },
        { label: "Hired",       value: pipeline.hired,                                            pct: pct(pipeline.hired) },
      ]
    : null;

  const statCards = [
    { label: "Active jobs",        value: stats ? String(stats.totalJobs)              : "–", icon: <WorkIcon /> },
    { label: "Total applications", value: stats ? String(stats.totalApplications)      : "–", icon: <PeopleAltIcon /> },
    { label: "Shortlisted",        value: stats ? String(stats.pipeline.shortlisted)   : "–", icon: <CheckCircleOutlineIcon /> },
    { label: "Hired",              value: stats ? String(stats.pipeline.hired)         : "–", icon: <TrendingUpIcon /> },
  ];

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>

      {/* Header */}
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

      {/* Stat cards */}
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

        {/* Jobs list */}
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

        {/* Right column */}
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

      {/* Context menu */}
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

      {/* Delete confirmation */}
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

      {/* Create — original multi-step UI, calls createJob() */}
      <NewJobModal
        open={newJobOpen}
        onClose={() => setNewJobOpen(false)}
        onSuccess={handleJobCreated}
      />

      {/* Edit — slim modal, calls updateJob() */}
      <EditJobModal
        job={editingJob}
        onClose={() => setEditingJob(null)}
        onSaved={handleJobUpdated}
      />

      {/* Applications modal — calls fetchApplicationsForJob + updateApplicationStatus */}
      <ApplicationsModal
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
        onViewProfile={(id) => { setSelectedJob(null); setProfileUserId(id); }}
      />

      {/* Profile drawer — calls fetchJobSeekerProfile */}
      <ProfileDrawer userId={profileUserId} onClose={() => setProfileUserId(null)} />
    </Container>
  );
}