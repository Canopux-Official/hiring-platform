// import { useCallback, useEffect, useRef, useState } from "react";
// import {
//   Container,
//   Typography,
//   Box,
//   Grid,
//   Button,
//   Card,
//   Stack,
//   Chip,
//   CircularProgress,
//   Alert,
//   Snackbar,
// } from "@mui/material";
// import { Job, JobFilters } from "./types";
// import JobCard from "./components/JobCard";
// import JobDetailModal from "./components/JobDetailModal";
// import { fetchJobs } from "./services/job";
// import JobFiltersBar from "./components/JobFilterBar";



// // ─── Component ────────────────────────────────────────────────────────────────

// export default function Jobs() {
//   const [filters, setFilters] = useState<JobFilters>({ page: 1, limit: 10 });
//   const [jobs, setJobs] = useState<Job[]>([]);
//   const [total, setTotal] = useState(0);
//   const [totalPages, setTotalPages] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
//   const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

//   // Toast
//   const [toast, setToast] = useState<{
//     msg: string;
//     type: "success" | "error" | "info";
//   } | null>(null);

//   const showToast = useCallback(
//     (msg: string, type: "success" | "error" | "info" = "info") => {
//       setToast({ msg, type });
//     },
//     []
//   );

//   const loadJobs = useCallback(
//     async (f: JobFilters) => {
//       setLoading(true);
//       try {
//         const res = await fetchJobs(f);
//         setJobs(res.jobs);
//         setTotal(res.total);
//         setTotalPages(res.totalPages);
//       } catch {
//         showToast("Failed to load jobs.", "error");
//       } finally {
//         setLoading(false);
//       }
//     },
//     [showToast]
//   );

//   // Debounced fetch on filter change
//   useEffect(() => {
//     if (debounceRef.current) clearTimeout(debounceRef.current);
//     debounceRef.current = setTimeout(() => loadJobs(filters), 300);
//     return () => {
//       if (debounceRef.current) clearTimeout(debounceRef.current);
//     };
//   }, [filters, loadJobs]);

//   function updateFilters(partial: Partial<JobFilters>) {
//     setFilters((prev) => ({ ...prev, ...partial }));
//   }

//   return (
//     <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
//       {/* Hero */}
//       <Typography
//         sx={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#7c3aed", mb: 1 }}
//       >
//         Global Opportunities
//       </Typography>
//       <Typography
//         variant="h2"
//         sx={{ fontSize: { xs: 32, md: 48 }, mb: 1, fontWeight: 800, color: "text.primary", letterSpacing: "-0.025em" }}
//       >
//         Find your next role
//       </Typography>
//       <Typography color="text.secondary" sx={{ mb: 5, fontSize: 16.5 }}>
//         {loading
//           ? "Loading opportunities..."
//           : `${total} curated openings across the globe.`}
//       </Typography>

//       {/* Filters */}
//       <JobFiltersBar filters={filters} onChange={updateFilters} />

//       {/* Content */}
//       {loading ? (
//         <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
//           <CircularProgress />
//         </Box>
//       ) : jobs.length === 0 ? (
//         <Card sx={{ p: 6, textAlign: "center", borderRadius: 3 }}>
//           <Typography color="text.secondary">
//             No jobs match your filters.
//           </Typography>
//           <Button
//             sx={{ mt: 2 }}
//             variant="outlined"
//             onClick={() => setFilters({ page: 1, limit: 10 })}
//           >
//             Clear Filters
//           </Button>
//         </Card>
//       ) : (
//         <Grid container spacing={2}>
//           {jobs.map((job) => (
//             <Grid item xs={12} key={job._id}>
//               <JobCard job={job} onClick={() => setSelectedJobId(job._id)} />
//             </Grid>
//           ))}
//         </Grid>
//       )}

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <Stack direction="row" justifyContent="center" sx={{ mt: 5 }}>
//           <Stack direction="row" spacing={1}>
//             <Button
//               variant="outlined"
//               disabled={(filters.page ?? 1) <= 1}
//               onClick={() =>
//                 updateFilters({ page: (filters.page ?? 1) - 1 })
//               }
//             >
//               Prev
//             </Button>
//             <Chip
//               label={`Page ${filters.page} of ${totalPages}`}
//               sx={{ alignSelf: "center" }}
//             />
//             <Button
//               variant="outlined"
//               disabled={(filters.page ?? 1) >= totalPages}
//               onClick={() =>
//                 updateFilters({ page: (filters.page ?? 1) + 1 })
//               }
//             >
//               Next
//             </Button>
//           </Stack>
//         </Stack>
//       )}

//       {/* Job detail modal */}
//       {selectedJobId && (
//         <JobDetailModal
//           jobId={selectedJobId}
//           onClose={() => setSelectedJobId(null)}
//           onApplySuccess={(msg) => {
//             showToast(msg, "success");
//             loadJobs(filters);
//           }}
//           onApplyError={(msg) => showToast(msg, "error")}
//           onLoadError={(msg) => showToast(msg, "error")}
//         />
//       )}

//       {/* Toast */}
//       <Snackbar
//         open={!!toast}
//         autoHideDuration={4000}
//         onClose={() => setToast(null)}
//         anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//       >
//         <Alert
//           severity={toast?.type}
//           onClose={() => setToast(null)}
//           variant="filled"
//         >
//           {toast?.msg}
//         </Alert>
//       </Snackbar>
//     </Container>
//   );
// }

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


// ── Design Tokens ─────────────────────────────────────────────────────
const GREEN = "#059669";
const GREEN_DARK = "#047857";

export default function Jobs() {
  const [filters, setFilters] = useState<JobFilters>({ page: 1, limit: 10 });
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

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
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
      {/* Hero Section */}
      <Box sx={{ mb: 6, textAlign: "center" }}>
        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: GREEN,
            mb: 1.5,
          }}
        >
          GLOBAL OPPORTUNITIES
        </Typography>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: 36, md: 52 },
            mb: 2,
            fontWeight: 800,
            color: "#0f172a",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
          }}
        >
          Find your next role
        </Typography>
        <Typography 
          color="text.secondary" 
          sx={{ fontSize: 17.5, maxWidth: 620, mx: "auto" }}
        >
          {loading
            ? "Discovering opportunities worldwide..."
            : `${total} curated opportunities across 140+ countries`}
        </Typography>
      </Box>

      {/* Filters */}
      <JobFiltersBar filters={filters} onChange={updateFilters} />

      {/* Loading State */}
      {loading && jobs.length === 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
          <CircularProgress size={48} sx={{ color: GREEN }} />
        </Box>
      )}

      {/* No Results */}
      {!loading && jobs.length === 0 && (
        <Card sx={{ p: 8, textAlign: "center", borderRadius: 4 }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            No jobs found matching your criteria
          </Typography>
          <Button
            variant="outlined"
            onClick={() => setFilters({ page: 1, limit: 10 })}
            sx={{
              px: 5,
              py: 1.2,
              borderColor: GREEN,
              color: GREEN,
              "&:hover": { borderColor: GREEN_DARK },
            }}
          >
            Clear All Filters
          </Button>
        </Card>
      )}

      {/* Jobs Grid */}
      {!loading && jobs.length > 0 && (
        <Grid container spacing={3}>
          {jobs.map((job) => (
            <Grid item xs={12} key={job._id}>
              <JobCard job={job} onClick={() => setSelectedJobId(job._id)} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Stack direction="row" justifyContent="center" sx={{ mt: 8 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              variant="outlined"
              disabled={(filters.page ?? 1) <= 1}
              onClick={() => updateFilters({ page: (filters.page ?? 1) - 1 })}
              sx={{ px: 4 }}
            >
              Previous
            </Button>

            <Chip
              label={`Page ${filters.page} of ${totalPages}`}
              sx={{
                color: GREEN,
                fontWeight: 600,
                px: 2,
              }}
            />

            <Button
              variant="outlined"
              disabled={(filters.page ?? 1) >= totalPages}
              onClick={() => updateFilters({ page: (filters.page ?? 1) + 1 })}
              sx={{ px: 4 }}
            >
              Next
            </Button>
          </Stack>
        </Stack>
      )}

      {/* Job Detail Modal */}
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

      {/* Toast Notification */}
      <Snackbar
        open={!!toast}
        autoHideDuration={4500}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={toast?.type}
          onClose={() => setToast(null)}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast?.msg}
        </Alert>
      </Snackbar>
    </Container>
  );
}