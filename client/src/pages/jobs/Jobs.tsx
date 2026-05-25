import { useCallback, useEffect, useRef, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  Card,
  Stack,
  Chip,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { Job, JobFilters } from "./types";
import JobCard from "./components/JobCard";
import JobDetailModal from "./components/JobDetailModal";
import { fetchJobs } from "./services/job";
import JobFiltersBar from "./components/JobFilterBar";



// ─── Component ────────────────────────────────────────────────────────────────

export default function Jobs() {
  const [filters, setFilters] = useState<JobFilters>({ page: 1, limit: 10 });
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Toast
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const showToast = useCallback(
    (msg: string, type: "success" | "error" | "info" = "info") => {
      setToast({ msg, type });
    },
    []
  );

  const loadJobs = useCallback(
    async (f: JobFilters) => {
      setLoading(true);
      try {
        const res = await fetchJobs(f);
        setJobs(res.jobs);
        setTotal(res.total);
        setTotalPages(res.totalPages);
      } catch {
        showToast("Failed to load jobs.", "error");
      } finally {
        setLoading(false);
      }
    },
    [showToast]
  );

  // Debounced fetch on filter change
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => loadJobs(filters), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [filters, loadJobs]);

  function updateFilters(partial: Partial<JobFilters>) {
    setFilters((prev) => ({ ...prev, ...partial }));
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
      {/* Hero */}
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#7c3aed", mb: 1 }}
      >
        Global Opportunities
      </Typography>
      <Typography
        variant="h2"
        sx={{ fontSize: { xs: 32, md: 48 }, mb: 1, fontWeight: 800, color: "text.primary", letterSpacing: "-0.025em" }}
      >
        Find your next role
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 5, fontSize: 16.5 }}>
        {loading
          ? "Loading opportunities..."
          : `${total} curated openings across the globe.`}
      </Typography>

      {/* Filters */}
      <JobFiltersBar filters={filters} onChange={updateFilters} />

      {/* Content */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress />
        </Box>
      ) : jobs.length === 0 ? (
        <Card sx={{ p: 6, textAlign: "center", borderRadius: 3 }}>
          <Typography color="text.secondary">
            No jobs match your filters.
          </Typography>
          <Button
            sx={{ mt: 2 }}
            variant="outlined"
            onClick={() => setFilters({ page: 1, limit: 10 })}
          >
            Clear Filters
          </Button>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {jobs.map((job) => (
            <Grid item xs={12} key={job._id}>
              <JobCard job={job} onClick={() => setSelectedJobId(job._id)} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Stack direction="row" justifyContent="center" sx={{ mt: 5 }}>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              disabled={(filters.page ?? 1) <= 1}
              onClick={() =>
                updateFilters({ page: (filters.page ?? 1) - 1 })
              }
            >
              Prev
            </Button>
            <Chip
              label={`Page ${filters.page} of ${totalPages}`}
              sx={{ alignSelf: "center" }}
            />
            <Button
              variant="outlined"
              disabled={(filters.page ?? 1) >= totalPages}
              onClick={() =>
                updateFilters({ page: (filters.page ?? 1) + 1 })
              }
            >
              Next
            </Button>
          </Stack>
        </Stack>
      )}

      {/* Job detail modal */}
      {selectedJobId && (
        <JobDetailModal
          jobId={selectedJobId}
          onClose={() => setSelectedJobId(null)}
          onApplySuccess={(msg) => {
            showToast(msg, "success");
            loadJobs(filters);
          }}
          onApplyError={(msg) => showToast(msg, "error")}
          onLoadError={(msg) => showToast(msg, "error")}
        />
      )}

      {/* Toast */}
      <Snackbar
        open={!!toast}
        autoHideDuration={4000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={toast?.type}
          onClose={() => setToast(null)}
          variant="filled"
        >
          {toast?.msg}
        </Alert>
      </Snackbar>
    </Container>
  );
}