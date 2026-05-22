// pages/AdminDashboard.tsx

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Container, Grid, Card, Typography, Stack, Button, Box, Chip, IconButton,
  Avatar, LinearProgress, Divider, Select, MenuItem, FormControl,
  CircularProgress, Pagination, Tooltip, Dialog, DialogTitle,
  DialogContent, DialogActions, Alert, Skeleton, TextField,
  InputAdornment, Tab, Tabs, Badge, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import PersonIcon from "@mui/icons-material/Person";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import WorkIcon from "@mui/icons-material/Work";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import FilterListIcon from "@mui/icons-material/FilterList";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BlockIcon from "@mui/icons-material/Block";
import { useAuth } from "../lib/auth";
import { useToast } from "../hooks/useToast";
import {
  fetchAdminDashboard,
  fetchAllUsers,
  fetchAllApplications,
  toggleUserStatus,
  deleteUser as apiDeleteUser,
  IUser,
  IJob,
  IApplication,
  IAdminDashboardStats,
  Paginated,
  UserRole,
  ApplicationStatus,
} from "../api/admin-api";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d === 0) return "Today";
  if (d === 1) return "Yesterday";
  if (d < 30) return `${d}d ago`;
  if (d < 365) return `${Math.floor(d / 30)}mo ago`;
  return `${Math.floor(d / 365)}y ago`;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const ROLE_COLORS: Record<string, string> = {
  job_seeker: "#60a5fa",
  recruiter:  "#34d399",
  admin:      "#f472b6",
  // uppercase fallbacks (in case backend ever changes)
  JOB_SEEKER: "#60a5fa",
  RECRUITER:  "#34d399",
  ADMIN:      "#f472b6",
};

const ROLE_ICONS: Record<string, React.ReactNode> = {
  job_seeker: <PersonIcon sx={{ fontSize: 14 }} />,
  recruiter:  <BusinessCenterIcon sx={{ fontSize: 14 }} />,
  admin:      <AdminPanelSettingsIcon sx={{ fontSize: 14 }} />,
  JOB_SEEKER: <PersonIcon sx={{ fontSize: 14 }} />,
  RECRUITER:  <BusinessCenterIcon sx={{ fontSize: 14 }} />,
  ADMIN:      <AdminPanelSettingsIcon sx={{ fontSize: 14 }} />,
};

const APP_STATUS_COLOR: Record<
  ApplicationStatus,
  "default" | "warning" | "info" | "error" | "success"
> = {
  pending: "default",
  reviewed: "warning",
  shortlisted: "info",
  rejected: "error",
  hired: "success",
};

// ─── Skeletons ────────────────────────────────────────────────────────────────

function StatCardSkeleton() {
  return (
    <Card sx={{ p: 3, height: "100%" }}>
      <Skeleton variant="rounded" width={40} height={40} sx={{ mb: 1.5 }} />
      <Skeleton variant="text" width="45%" height={44} />
      <Skeleton variant="text" width="65%" />
    </Card>
  );
}

function TableRowSkeleton({ cols }: { cols: number }) {
  return (
    <TableRow>
      {Array.from({ length: cols }).map((_, i) => (
        <TableCell key={i}>
          <Skeleton variant="text" width={i === 0 ? "80%" : "60%"} />
        </TableCell>
      ))}
    </TableRow>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  sub?: string;
}

function StatCard({ label, value, icon, color, sub }: StatCardProps) {
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

// ─── Pipeline bar chart ───────────────────────────────────────────────────────

function PipelineCard({
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

// ─── User distribution card ───────────────────────────────────────────────────

function UserRoleCard({
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

// ─── Delete user confirmation dialog ─────────────────────────────────────────

interface DeleteUserDialogProps {
  user: IUser | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  loading: boolean;
}

function DeleteUserDialog({ user, onClose, onConfirm, loading }: DeleteUserDialogProps) {
  return (
    <Dialog open={!!user} onClose={() => !loading && onClose()}>
      <DialogTitle>Delete user?</DialogTitle>
      <DialogContent>
        <Typography>
          Permanently delete{" "}
          <strong>{user?.name}</strong> ({user?.email})? This action cannot be
          undone and will remove all associated data.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          color="error"
          variant="contained"
          disabled={loading}
          onClick={onConfirm}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <DeleteOutlineIcon />}
        >
          {loading ? "Deleting…" : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Users Table ──────────────────────────────────────────────────────────────

interface UsersTabProps {
  onStatsRefresh: () => void;
}

function UsersTab({ onStatsRefresh }: UsersTabProps) {
  const toast = useToast();
  const [data, setData] = useState<Paginated<IUser> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "">("");
  const [error, setError] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IUser | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(
    (p: number, q: string, role: UserRole | "") => {
      setLoading(true);
      setError(null);
      fetchAllUsers({ page: p, limit: 12, search: q, role })
        .then((res) => {
          setData(res);
          setPage(p);
        })
        .catch(() => setError("Failed to load users."))
        .finally(() => setLoading(false));
    },
    []
  );

  useEffect(() => {
    load(1, search, roleFilter);
  }, [load]); // eslint-disable-line

  function handleSearch(q: string) {
    setSearch(q);
    if (searchRef.current) clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => load(1, q, roleFilter), 400);
  }

  function handleRoleFilter(role: UserRole | "") {
    setRoleFilter(role);
    load(1, search, role);
  }

  async function handleToggle(user: IUser) {
    setTogglingId(user._id);
    try {
      const updated = await toggleUserStatus(user._id);
      setData((prev) =>
        prev
          ? { ...prev, items: prev.items.map((u) => (u._id === user._id ? { ...u, ...updated } : u)) }
          : prev
      );
      toast.success(
        `${user.name} ${updated.isActive ? "activated" : "deactivated"}`
      );
      onStatsRefresh();
    } catch {
      toast.error("Failed to update user status.");
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await apiDeleteUser(deleteTarget._id);
      toast.success(`${deleteTarget.name} deleted.`);
      setDeleteTarget(null);
      const targetPage =
        data?.items.length === 1 && page > 1 ? page - 1 : page;
      load(targetPage, search, roleFilter);
      onStatsRefresh();
    } catch {
      toast.error("Failed to delete user.");
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <Box>
      {/* Filters */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        sx={{ mb: 2.5 }}
        alignItems={{ sm: "center" }}
      >
        <TextField
          placeholder="Search name or email…"
          size="small"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          sx={{ flex: 1, maxWidth: 340 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <Select
            value={roleFilter}
            displayEmpty
            onChange={(e) => handleRoleFilter(e.target.value as UserRole | "")}
            startAdornment={<FilterListIcon sx={{ fontSize: 16, mr: 0.5, color: "text.secondary" }} />}
          >
            <MenuItem value="">All roles</MenuItem>
            <MenuItem value="JOB_SEEKER">Job Seekers</MenuItem>
            <MenuItem value="RECRUITER">Recruiters</MenuItem>
            <MenuItem value="ADMIN">Admins</MenuItem>
          </Select>
        </FormControl>
        <Button
          size="small"
          startIcon={<RefreshIcon />}
          onClick={() => load(page, search, roleFilter)}
          variant="outlined"
        >
          Refresh
        </Button>
        {data && (
          <Typography variant="caption" color="text.secondary" sx={{ ml: "auto !important" }}>
            {data.total} users
          </Typography>
        )}
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ border: `1px solid ${alpha("#ffffff", 0.07)}`, borderRadius: 2 }}
      >
        <Table size="small">
          <TableHead>
            <TableRow sx={{ "& th": { fontWeight: 700, color: "text.secondary", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 0.6 } }}>
              <TableCell>User</TableCell>
              <TableCell>Role</TableCell>
              <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>Joined</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <TableRowSkeleton key={i} cols={5} />
                ))
              : (data?.items ?? []).map((user) => {
                  const roleColor = ROLE_COLORS[user.role] ?? "#94a3b8";
                  return (
                    <TableRow
                      key={user._id}
                      sx={{
                        "&:hover": { bgcolor: alpha("#ffffff", 0.025) },
                        opacity: user.isActive ? 1 : 0.55,
                      }}
                    >
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar
                            sx={{
                              width: 34,
                              height: 34,
                              fontSize: 13,
                              fontWeight: 700,
                              bgcolor: alpha(roleColor, 0.2),
                              color: roleColor,
                            }}
                          >
                            {user.name[0].toUpperCase()}
                          </Avatar>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                              {user.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" noWrap>
                              {user.email}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={user.role.replace("_", " ")}
                          icon={<>{ROLE_ICONS[user.role]}</>}
                          sx={{
                            bgcolor: alpha(roleColor, 0.12),
                            color: roleColor,
                            fontWeight: 600,
                            fontSize: "0.7rem",
                            "& .MuiChip-icon": { color: roleColor, ml: "6px" },
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                        <Typography variant="caption" color="text.secondary">
                          {fmtDate(user.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {user.isActive ? (
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <CheckCircleIcon sx={{ fontSize: 14, color: "#34d399" }} />
                            <Typography variant="caption" sx={{ color: "#34d399", fontWeight: 600 }}>
                              Active
                            </Typography>
                          </Stack>
                        ) : (
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <BlockIcon sx={{ fontSize: 14, color: "#f87171" }} />
                            <Typography variant="caption" sx={{ color: "#f87171", fontWeight: 600 }}>
                              Disabled
                            </Typography>
                          </Stack>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                          <Tooltip
                            title={user.isActive ? "Disable account" : "Enable account"}
                          >
                            <span>
                              <IconButton
                                size="small"
                                onClick={() => handleToggle(user)}
                                disabled={togglingId === user._id}
                                sx={{
                                  color: user.isActive ? "warning.main" : "success.main",
                                }}
                              >
                                {togglingId === user._id ? (
                                  <CircularProgress size={16} />
                                ) : user.isActive ? (
                                  <PersonOffIcon fontSize="small" />
                                ) : (
                                  <HowToRegIcon fontSize="small" />
                                )}
                              </IconButton>
                            </span>
                          </Tooltip>
                          <Tooltip title="Delete user">
                            <IconButton
                              size="small"
                              onClick={() => setDeleteTarget(user)}
                              sx={{ color: "error.main" }}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </TableContainer>

      {!loading && (data?.items.length ?? 0) === 0 && !error && (
        <Stack alignItems="center" py={5} spacing={1}>
          <PeopleAltIcon sx={{ fontSize: 40, color: "text.disabled" }} />
          <Typography color="text.secondary">No users found</Typography>
        </Stack>
      )}

      {data && data.totalPages > 1 && (
        <Stack alignItems="center" sx={{ mt: 2 }}>
          <Pagination
            count={data.totalPages}
            page={page}
            onChange={(_, p) => load(p, search, roleFilter)}
            color="primary"
          />
        </Stack>
      )}

      <DeleteUserDialog
        user={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </Box>
  );
}

// ─── Applications Table ───────────────────────────────────────────────────────

function ApplicationsTab() {
  const [data, setData] = useState<Paginated<IApplication> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "">("");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback((p: number, status: ApplicationStatus | "") => {
    setLoading(true);
    setError(null);
    fetchAllApplications({ page: p, limit: 12, status })
      .then((res) => {
        setData(res);
        setPage(p);
      })
      .catch(() => setError("Failed to load applications."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load(1, statusFilter);
  }, [load]); // eslint-disable-line

  function handleStatusFilter(s: ApplicationStatus | "") {
    setStatusFilter(s);
    load(1, s);
  }

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        sx={{ mb: 2.5 }}
        alignItems={{ sm: "center" }}
      >
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <Select
            value={statusFilter}
            displayEmpty
            onChange={(e) =>
              handleStatusFilter(e.target.value as ApplicationStatus | "")
            }
            startAdornment={
              <FilterListIcon sx={{ fontSize: 16, mr: 0.5, color: "text.secondary" }} />
            }
          >
            <MenuItem value="">All statuses</MenuItem>
            {(
              ["pending", "reviewed", "shortlisted", "hired", "rejected"] as ApplicationStatus[]
            ).map((s) => (
              <MenuItem key={s} value={s} sx={{ textTransform: "capitalize" }}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          size="small"
          startIcon={<RefreshIcon />}
          onClick={() => load(page, statusFilter)}
          variant="outlined"
        >
          Refresh
        </Button>
        {data && (
          <Typography variant="caption" color="text.secondary" sx={{ ml: "auto !important" }}>
            {data.total} applications
          </Typography>
        )}
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ border: `1px solid ${alpha("#ffffff", 0.07)}`, borderRadius: 2 }}
      >
        <Table size="small">
          <TableHead>
            <TableRow
              sx={{
                "& th": {
                  fontWeight: 700,
                  color: "text.secondary",
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: 0.6,
                },
              }}
            >
              <TableCell>Applicant</TableCell>
              <TableCell>Job</TableCell>
              <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                Company
              </TableCell>
              <TableCell>Status</TableCell>
              <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                Applied
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <TableRowSkeleton key={i} cols={5} />
                ))
              : (data?.items ?? []).map((app) => {
                  const applicant =
                    typeof app.applicant === "object"
                      ? (app.applicant as IUser)
                      : null;
                  const job =
                    typeof app.job === "object" ? (app.job as IJob) : null;
                  const name = applicant?.name ?? "Unknown";
                  const jobTitle = job?.title ?? "—";
                  const company = job?.company ?? "—";

                  return (
                    <TableRow
                      key={app._id}
                      sx={{ "&:hover": { bgcolor: alpha("#ffffff", 0.025) } }}
                    >
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar
                            sx={{
                              width: 30,
                              height: 30,
                              fontSize: 12,
                              fontWeight: 700,
                              bgcolor: alpha("#60a5fa", 0.2),
                              color: "#60a5fa",
                            }}
                          >
                            {name[0].toUpperCase()}
                          </Avatar>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                              {name}
                            </Typography>
                            {applicant?.email && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                noWrap
                              >
                                {applicant.email}
                              </Typography>
                            )}
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" noWrap sx={{ maxWidth: 180 }}>
                          {jobTitle}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                        <Typography variant="body2" color="text.secondary">
                          {company}
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
                            fontSize: "0.7rem",
                            height: 22,
                            "& .MuiChip-label": { px: 1 },
                          }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{ display: { xs: "none", sm: "table-cell" } }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          {timeAgo(app.createdAt)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </TableContainer>

      {!loading && (data?.items.length ?? 0) === 0 && !error && (
        <Stack alignItems="center" py={5} spacing={1}>
          <AssignmentIcon sx={{ fontSize: 40, color: "text.disabled" }} />
          <Typography color="text.secondary">No applications found</Typography>
        </Stack>
      )}

      {data && data.totalPages > 1 && (
        <Stack alignItems="center" sx={{ mt: 2 }}>
          <Pagination
            count={data.totalPages}
            page={page}
            onChange={(_, p) => load(p, statusFilter)}
            color="primary"
          />
        </Stack>
      )}
    </Box>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<IAdminDashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const s = await fetchAdminDashboard();
      setStats(s);
    } catch {
      setStats(null);
    } finally {
      setStatsLoading(false);
    }
  }, []);

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