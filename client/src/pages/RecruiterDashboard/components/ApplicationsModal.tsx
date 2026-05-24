import React, { useState, useEffect, useCallback } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Stack, Box, Typography, IconButton, Divider, Alert, Skeleton, Avatar, FormControl, Select, MenuItem, Tooltip, CircularProgress, Pagination } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import PersonIcon from "@mui/icons-material/Person";
import ArticleIcon from "@mui/icons-material/Article";
import { alpha } from "@mui/material/styles";
import { fetchApplicationsForJob, updateApplicationStatus, IJob, IApplication, Paginated, ApplicationStatus, IJobSeekerProfile } from "../services/recruiter";
import { timeAgo } from "../utils/constants";
import { useToast } from "../../../hooks/useToast";

interface ApplicationsModalProps {
  job: IJob | null;
  onClose: () => void;
  onViewProfile: (userId: string) => void;
  onViewApplication: (appId: string) => void;
}

import { getErrorMessage } from "../../../utils/errorUtils";

export function ApplicationsModal({ job, onClose, onViewProfile, onViewApplication }: ApplicationsModalProps) {
  const toast = useToast();
  const [data, setData] = useState<Paginated<IApplication> | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback((p: number) => {
    if (!job) return;
    setLoading(true);
    setError(null);
    fetchApplicationsForJob(job._id, { page: p, limit: 10 })
      .then((res) => { setData(res); setPage(p); })
      .catch((err) => setError(getErrorMessage(err, "Failed to load applications.")))
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
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update application status"));
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
                  <IconButton size="small" onClick={() => onViewApplication(app._id)}>
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
    </Dialog>
  );
}
