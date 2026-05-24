import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Box, Stack, TextField, InputAdornment, FormControl, Select, MenuItem, Button,
  Typography, Alert, TableContainer, Paper, Table, TableHead, TableRow, TableCell,
  TableBody, Avatar, Chip, Tooltip, IconButton, CircularProgress
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BlockIcon from "@mui/icons-material/Block";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { Pagination } from "@mui/material";
import { useToast } from "../../../hooks/useToast";
import {
  fetchAllUsers,
  toggleUserStatus,
  deleteUser as apiDeleteUser,
  IUser,
  Paginated,
  UserRole,
} from "../services/admin-api";
import { fmtDate, ROLE_COLORS, ROLE_ICONS } from "../utils/constants";
import { TableRowSkeleton } from "./Skeletons";
import { DeleteUserDialog } from "./DeleteUserDialog";

interface UsersTabProps {
  onStatsRefresh: () => void;
}

import { getErrorMessage } from "../../../utils/errorUtils";

export function UsersTab({ onStatsRefresh }: UsersTabProps) {
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
        .catch((err) => setError(getErrorMessage(err, "Failed to load users.")))
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
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update user status."));
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
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete user."));
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <Box>
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
            <MenuItem value="job_seeker">Job Seekers</MenuItem>
            <MenuItem value="recruiter">Recruiters</MenuItem>
            <MenuItem value="admin">Admins</MenuItem>
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
