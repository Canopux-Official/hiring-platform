import { useState, useEffect, useCallback } from "react";
import {
  Drawer, Box, Stack, Typography, IconButton, Avatar, Chip, Divider,
  Table, TableHead, TableRow, TableCell, TableBody, TableContainer,
  Paper, Pagination, Tooltip, CircularProgress, Alert, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  FormControl, InputLabel, Select, MenuItem,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import WorkIcon from "@mui/icons-material/Work";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import {
  fetchRecruiterJobs,
  adminUpdateJob,
  adminDeleteJob,
  IUser,
  IJob,
  RecruiterJobsResult,
} from "../services/admin-api";
import { fmtDate, timeAgo } from "../utils/constants";
import { TableRowSkeleton } from "./Skeletons";
import { useToast } from "../../../hooks/useToast";
import { getErrorMessage } from "../../../utils/errorUtils";

// â”€â”€â”€ Job Status colour map â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const JOB_STATUS_COLOR: Record<string, "success" | "warning" | "default"> = {
  open: "success",
  draft: "warning",
  closed: "default",
};

// â”€â”€â”€ Edit Job Dialog â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface EditJobDialogProps {
  job: IJob | null;
  recruiterId: string;
  onClose: () => void;
  onSaved: (updated: IJob) => void;
}

function EditJobDialog({ job, recruiterId, onClose, onSaved }: EditJobDialogProps) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    status: "open" as IJob["status"],
    location: "",
    type: "full_time" as IJob["type"],
    experienceLevel: "mid" as IJob["experienceLevel"],
    openings: 1,
  });

  useEffect(() => {
    if (job) {
      setForm({
        title: job.title,
        status: job.status,
        location: job.location,
        type: job.type,
        experienceLevel: job.experienceLevel,
        openings: job.openings,
      });
    }
  }, [job]);

  async function handleSave() {
    if (!job) return;
    setLoading(true);
    try {
      const updated = await adminUpdateJob(recruiterId, job._id, form);
      toast.success("Job updated successfully.");
      onSaved(updated);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update job."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={!!job} onClose={() => !loading && onClose()} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Edit Job Posting</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <TextField
            label="Job Title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            fullWidth
            size="small"
          />
          <TextField
            label="Location"
            value={form.location}
            onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            fullWidth
            size="small"
          />
          <Stack direction="row" spacing={2}>
            <FormControl size="small" fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as IJob["status"] }))}
              >
                <MenuItem value="open">Open</MenuItem>
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="closed">Closed</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                label="Type"
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as IJob["type"] }))}
              >
                {["full_time", "part_time", "contract", "internship", "remote"].map((t) => (
                  <MenuItem key={t} value={t}>{t.replace("_", " ")}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          <Stack direction="row" spacing={2}>
            <FormControl size="small" fullWidth>
              <InputLabel>Experience Level</InputLabel>
              <Select
                label="Experience Level"
                value={form.experienceLevel}
                onChange={(e) =>
                  setForm((f) => ({ ...f, experienceLevel: e.target.value as IJob["experienceLevel"] }))
                }
              >
                {["entry", "mid", "senior", "lead", "executive"].map((l) => (
                  <MenuItem key={l} value={l} sx={{ textTransform: "capitalize" }}>{l}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Openings"
              type="number"
              size="small"
              fullWidth
              value={form.openings}
              onChange={(e) => setForm((f) => ({ ...f, openings: parseInt(e.target.value) || 1 }))}
              inputProps={{ min: 1 }}
            />
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={14} color="inherit" /> : undefined}
        >
          {loading ? "Savingâ€¦" : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// â”€â”€â”€ Delete Job Dialog â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface DeleteJobDialogProps {
  job: IJob | null;
  recruiterId: string;
  onClose: () => void;
  onDeleted: (jobId: string) => void;
}

function DeleteJobDialog({ job, recruiterId, onClose, onDeleted }: DeleteJobDialogProps) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!job) return;
    setLoading(true);
    try {
      await adminDeleteJob(recruiterId, job._id);
      toast.success("Job and its applications deleted.");
      onDeleted(job._id);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete job."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={!!job} onClose={() => !loading && onClose()}>
      <DialogTitle>Delete job posting?</DialogTitle>
      <DialogContent>
        <Typography>
          Permanently delete <strong>{job?.title}</strong> at{" "}
          <strong>{job?.company}</strong>? This will also remove all associated
          applications and cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button
          color="error"
          variant="contained"
          disabled={loading}
          onClick={handleDelete}
          startIcon={
            loading
              ? <CircularProgress size={14} color="inherit" />
              : <DeleteOutlineIcon fontSize="small" />
          }
        >
          {loading ? "Deletingâ€¦" : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// â”€â”€â”€ Main Drawer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface RecruiterDetailDrawerProps {
  recruiter: IUser | null;
  onClose: () => void;
}

export function RecruiterDetailDrawer({ recruiter, onClose }: RecruiterDetailDrawerProps) {
  const [result, setResult] = useState<RecruiterJobsResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [editTarget, setEditTarget] = useState<IJob | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IJob | null>(null);

  const load = useCallback(
    (p: number) => {
      if (!recruiter) return;
      setLoading(true);
      setError(null);
      fetchRecruiterJobs(recruiter._id, { page: p, limit: 10 })
        .then((res) => { setResult(res); setPage(p); })
        .catch((err) => setError(getErrorMessage(err, "Failed to load jobs.")))
        .finally(() => setLoading(false));
    },
    [recruiter]
  );

  useEffect(() => {
    if (recruiter) { setPage(1); load(1); }
    else { setResult(null); }
  }, [recruiter, load]);

  function handleJobSaved(updated: IJob) {
    setResult((prev) =>
      prev
        ? { ...prev, items: prev.items.map((j) => (j._id === updated._id ? updated : j)) }
        : prev
    );
    setEditTarget(null);
  }

  function handleJobDeleted(jobId: string) {
    setResult((prev) =>
      prev
        ? {
            ...prev,
            items: prev.items.filter((j) => j._id !== jobId),
            total: prev.total - 1,
          }
        : prev
    );
    setDeleteTarget(null);
  }

  const open = !!recruiter;

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: { xs: "100vw", sm: 600, md: 700 },
            bgcolor: "background.default",
            backgroundImage: "none",
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 3,
            borderBottom: `1px solid ${alpha("#ffffff", 0.07)}`,
            bgcolor: alpha("#10b981", 0.04),
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                fontWeight: 700,
                fontSize: 18,
                bgcolor: alpha("#10b981", 0.2),
                color: "#10b981",
              }}
            >
              {recruiter?.name?.[0]?.toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <BusinessCenterIcon sx={{ fontSize: 14, color: "#10b981" }} />
                <Typography variant="overline" sx={{ color: "#10b981", lineHeight: 1, fontSize: "0.65rem" }}>
                  Recruiter
                </Typography>
              </Stack>
              <Typography variant="h6" sx={{ fontWeight: 700 }} noWrap>
                {recruiter?.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {recruiter?.email}
              </Typography>
            </Box>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Stack>

          {result && (
            <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
              <Chip
                size="small"
                icon={<WorkIcon sx={{ fontSize: "14px !important" }} />}
                label={`${result.total} job${result.total !== 1 ? "s" : ""} posted`}
                sx={{ bgcolor: alpha("#10b981", 0.12), color: "#10b981", fontWeight: 600 }}
              />
              {recruiter?.createdAt && (
                <Chip
                  size="small"
                  label={`Joined ${timeAgo(recruiter.createdAt)}`}
                  sx={{ bgcolor: alpha("#ffffff", 0.05), color: "text.secondary" }}
                />
              )}
            </Stack>
          )}
        </Box>

        {/* Body */}
        <Box sx={{ p: 3, flex: 1, overflow: "auto" }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: "text.secondary", textTransform: "uppercase", letterSpacing: 0.6, fontSize: "0.7rem" }}>
            Job Postings
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <TableContainer
            component={Paper}
            elevation={0}
            sx={{ border: `1px solid ${alpha("#ffffff", 0.07)}`, borderRadius: 2 }}
          >
            <Table size="small">
              <TableHead>
                <TableRow sx={{ "& th": { fontWeight: 700, color: "text.secondary", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: 0.5 } }}>
                  <TableCell>Title</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>Posted</TableCell>
                  <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>Apps</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={5} />)
                  : (result?.items ?? []).map((job) => (
                      <TableRow
                        key={job._id}
                        sx={{ "&:hover": { bgcolor: alpha("#ffffff", 0.025) } }}
                      >
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                            {job.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" noWrap>
                            {job.location} Â· {job.type.replace("_", " ")}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={job.status}
                            color={JOB_STATUS_COLOR[job.status] ?? "default"}
                            sx={{ fontWeight: 600, fontSize: "0.68rem", height: 20, textTransform: "capitalize", "& .MuiChip-label": { px: 0.8 } }}
                          />
                        </TableCell>
                        <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                          <Typography variant="caption" color="text.secondary">
                            {fmtDate(job.createdAt)}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            {job.applicationsCount}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                            <Tooltip title="Edit job">
                              <IconButton size="small" onClick={() => setEditTarget(job)} sx={{ color: "primary.main" }}>
                                <EditIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete job">
                              <IconButton size="small" onClick={() => setDeleteTarget(job)} sx={{ color: "error.main" }}>
                                <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>

          {!loading && (result?.items.length ?? 0) === 0 && !error && (
            <Stack alignItems="center" py={5} spacing={1}>
              <WorkIcon sx={{ fontSize: 40, color: "text.disabled" }} />
              <Typography color="text.secondary" variant="body2">
                No jobs posted yet
              </Typography>
            </Stack>
          )}

          {result && result.totalPages > 1 && (
            <Stack alignItems="center" sx={{ mt: 2 }}>
              <Pagination
                count={result.totalPages}
                page={page}
                onChange={(_, p) => load(p)}
                color="primary"
                size="small"
              />
            </Stack>
          )}
        </Box>
      </Drawer>

      {/* Edit dialog â€” rendered outside Drawer so it isn't clipped */}
      <EditJobDialog
        job={editTarget}
        recruiterId={recruiter?._id ?? ""}
        onClose={() => setEditTarget(null)}
        onSaved={handleJobSaved}
      />

      <DeleteJobDialog
        job={deleteTarget}
        recruiterId={recruiter?._id ?? ""}
        onClose={() => setDeleteTarget(null)}
        onDeleted={handleJobDeleted}
      />
    </>
  );
}
