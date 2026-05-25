import { useState, useEffect, useCallback } from "react";
import {
  Drawer, Box, Stack, Typography, IconButton, Avatar, Chip,
  Table, TableHead, TableRow, TableCell, TableBody, TableContainer,
  Paper, Pagination, Tooltip, CircularProgress, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PersonIcon from "@mui/icons-material/Person";
import FilterListIcon from "@mui/icons-material/FilterList";
import {
  fetchSeekerApplications,
  adminDeleteApplication,
  IUser,
  IApplication,
  IJob,
  ApplicationStatus,
  SeekerApplicationsResult,
} from "../services/admin-api";
import { timeAgo } from "../utils/constants";
import { TableRowSkeleton } from "./Skeletons";
import { useToast } from "../../../hooks/useToast";
import { getErrorMessage } from "../../../utils/errorUtils";
import { APP_STATUS_COLOR } from "../utils/constants";

// ─── Confirm Delete Dialog ────────────────────────────────────────────────────
interface DeleteAppDialogProps {
  application: IApplication | null;
  seekerId: string;
  onClose: () => void;
  onDeleted: (appId: string) => void;
}

function DeleteAppDialog({ application, seekerId, onClose, onDeleted }: DeleteAppDialogProps) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const job =
    application && typeof application.job === "object"
      ? (application.job as IJob)
      : null;

  async function handleDelete() {
    if (!application) return;
    setLoading(true);
    try {
      await adminDeleteApplication(seekerId, application._id);
      toast.success("Application deleted.");
      onDeleted(application._id);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete application."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={!!application} onClose={() => !loading && onClose()}>
      <DialogTitle>Delete application?</DialogTitle>
      <DialogContent>
        <Typography>
          Permanently delete this application for{" "}
          <strong>{job?.title ?? "this job"}</strong>
          {job?.company ? ` at ${job.company}` : ""}? This cannot be undone.
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
          {loading ? "Deleting…" : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Main Drawer ──────────────────────────────────────────────────────────────
interface SeekerDetailDrawerProps {
  seeker: IUser | null;
  onClose: () => void;
}

export function SeekerDetailDrawer({ seeker, onClose }: SeekerDetailDrawerProps) {
  const [result, setResult] = useState<SeekerApplicationsResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "">("");
  const [deleteTarget, setDeleteTarget] = useState<IApplication | null>(null);

  const load = useCallback(
    (p: number, status: ApplicationStatus | "") => {
      if (!seeker) return;
      setLoading(true);
      setError(null);
      fetchSeekerApplications(seeker._id, { page: p, limit: 10, status })
        .then((res) => { setResult(res); setPage(p); })
        .catch((err) => setError(getErrorMessage(err, "Failed to load applications.")))
        .finally(() => setLoading(false));
    },
    [seeker]
  );

  useEffect(() => {
    if (seeker) { setPage(1); setStatusFilter(""); load(1, ""); }
    else { setResult(null); }
  }, [seeker, load]);

  function handleAppDeleted(appId: string) {
    setResult((prev) =>
      prev
        ? {
            ...prev,
            items: prev.items.filter((a) => a._id !== appId),
            total: prev.total - 1,
          }
        : prev
    );
    setDeleteTarget(null);
  }

  const open = !!seeker;
  const statuses: ApplicationStatus[] = ["pending", "reviewed", "shortlisted", "hired", "rejected"];

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
            bgcolor: alpha("#60a5fa", 0.04),
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                fontWeight: 700,
                fontSize: 18,
                bgcolor: alpha("#60a5fa", 0.2),
                color: "#60a5fa",
              }}
            >
              {seeker?.name?.[0]?.toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <PersonIcon sx={{ fontSize: 14, color: "#60a5fa" }} />
                <Typography variant="overline" sx={{ color: "#60a5fa", lineHeight: 1, fontSize: "0.65rem" }}>
                  Job Seeker
                </Typography>
              </Stack>
              <Typography variant="h6" sx={{ fontWeight: 700 }} noWrap>
                {seeker?.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {seeker?.email}
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
                icon={<AssignmentIcon sx={{ fontSize: "14px !important" }} />}
                label={`${result.total} application${result.total !== 1 ? "s" : ""}`}
                sx={{ bgcolor: alpha("#60a5fa", 0.12), color: "#60a5fa", fontWeight: 600 }}
              />
              {seeker?.createdAt && (
                <Chip
                  size="small"
                  label={`Joined ${timeAgo(seeker.createdAt)}`}
                  sx={{ bgcolor: alpha("#ffffff", 0.05), color: "text.secondary" }}
                />
              )}
            </Stack>
          )}
        </Box>

        {/* Filter bar */}
        <Box sx={{ px: 3, pt: 2.5, pb: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <FilterListIcon sx={{ fontSize: 16, color: "text.secondary" }} />
            <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>
              Filter:
            </Typography>
            {(["", ...statuses] as (ApplicationStatus | "")[]).map((s) => (
              <Chip
                key={s || "all"}
                label={s || "All"}
                size="small"
                clickable
                onClick={() => { setStatusFilter(s); load(1, s); }}
                sx={{
                  textTransform: "capitalize",
                  fontWeight: statusFilter === s ? 700 : 400,
                  bgcolor: statusFilter === s ? alpha("#60a5fa", 0.15) : alpha("#ffffff", 0.05),
                  color: statusFilter === s ? "#60a5fa" : "text.secondary",
                  border: statusFilter === s ? `1px solid ${alpha("#60a5fa", 0.4)}` : "1px solid transparent",
                  transition: "all 0.15s",
                }}
              />
            ))}
          </Stack>
        </Box>

        {/* Body */}
        <Box sx={{ p: 3, pt: 1.5, flex: 1, overflow: "auto" }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: "text.secondary", textTransform: "uppercase", letterSpacing: 0.6, fontSize: "0.7rem" }}>
            Applied Jobs
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
                  <TableCell>Job</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>Applied</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={4} />)
                  : (result?.items ?? []).map((app) => {
                      const job =
                        typeof app.job === "object" ? (app.job as IJob) : null;
                      const recruiter =
                        typeof app.recruiter === "object"
                          ? (app.recruiter as IUser)
                          : null;

                      return (
                        <TableRow
                          key={app._id}
                          sx={{ "&:hover": { bgcolor: alpha("#ffffff", 0.025) } }}
                        >
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                              {job?.title ?? "—"}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" noWrap>
                              {job?.company ?? ""}
                              {recruiter ? ` · via ${recruiter.name}` : ""}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              label={app.status}
                              color={APP_STATUS_COLOR[app.status] ?? "default"}
                              sx={{
                                textTransform: "capitalize",
                                fontWeight: 600,
                                fontSize: "0.68rem",
                                height: 20,
                                "& .MuiChip-label": { px: 0.8 },
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                            <Typography variant="caption" color="text.secondary">
                              {timeAgo(app.createdAt)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="Delete application">
                              <IconButton
                                size="small"
                                onClick={() => setDeleteTarget(app)}
                                sx={{ color: "error.main" }}
                              >
                                <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })}
              </TableBody>
            </Table>
          </TableContainer>

          {!loading && (result?.items.length ?? 0) === 0 && !error && (
            <Stack alignItems="center" py={5} spacing={1}>
              <AssignmentIcon sx={{ fontSize: 40, color: "text.disabled" }} />
              <Typography color="text.secondary" variant="body2">
                No applications found
              </Typography>
            </Stack>
          )}

          {result && result.totalPages > 1 && (
            <Stack alignItems="center" sx={{ mt: 2 }}>
              <Pagination
                count={result.totalPages}
                page={page}
                onChange={(_, p) => load(p, statusFilter)}
                color="primary"
                size="small"
              />
            </Stack>
          )}
        </Box>
      </Drawer>

      <DeleteAppDialog
        application={deleteTarget}
        seekerId={seeker?._id ?? ""}
        onClose={() => setDeleteTarget(null)}
        onDeleted={handleAppDeleted}
      />
    </>
  );
}