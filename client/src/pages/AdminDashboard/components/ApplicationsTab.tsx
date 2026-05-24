import React, { useState, useEffect, useCallback } from "react";
import {
  Box, Stack, FormControl, Select, MenuItem, Button, Typography, Alert,
  TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody,
  Avatar, Chip, Pagination
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import FilterListIcon from "@mui/icons-material/FilterList";
import RefreshIcon from "@mui/icons-material/Refresh";
import AssignmentIcon from "@mui/icons-material/Assignment";
import {
  fetchAllApplications,
  Paginated,
  IApplication,
  ApplicationStatus,
  IUser,
  IJob
} from "../services/admin-api";
import { timeAgo, APP_STATUS_COLOR } from "../utils/constants";
import { TableRowSkeleton } from "./Skeletons";

import { getErrorMessage } from "../../../utils/errorUtils";

export function ApplicationsTab() {
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
      .catch((err) => setError(getErrorMessage(err, "Failed to load applications.")))
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
