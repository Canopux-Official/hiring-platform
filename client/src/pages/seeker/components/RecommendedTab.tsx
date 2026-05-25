// src/components/seeker/RecommendedTab.tsx
import {
  Box,
  Card,
  Typography,
  Stack,
  Chip,
  Button,
  CircularProgress,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { alpha } from "@mui/material/styles";
import { IRecommendedJob } from "../types";
import { fmtSalary, timeAgo } from "../lib/seeker";

interface RecommendedTabProps {
  jobs: IRecommendedJob[];
  loading: boolean;
}

export default function RecommendedTab({ jobs, loading }: RecommendedTabProps) {
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (jobs.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <StarIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
        <Typography variant="h6" color="text.secondary">No recommendations yet</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Complete your profile (skills, locations, salary) to get better job matches.
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      {jobs.map((job) => (
        <Card key={job._id} sx={{ p: 3 }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems={{ sm: "center" }}>
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <Typography variant="h6" fontWeight={700}>
                  {job.title}
                </Typography>
                {job.matchScore !== undefined && (
                  <Chip
                    label={`${job.matchScore}% Match`}
                    size="small"
                    sx={{ bgcolor: alpha("#7c3aed", 0.15), color: "#7c3aed", fontWeight: 700 }}
                  />
                )}
              </Stack>

              <Typography variant="body2" color="text.secondary">
                {job.company} â€¢ {job.location}
                {(job.salaryMin || job.salaryMax) && (
                  <> â€¢ {fmtSalary(job.salaryMin)}â€“{fmtSalary(job.salaryMax)}</>
                )}
              </Typography>

              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                Posted {timeAgo(job.postedAt)}
              </Typography>

              {job.skills && job.skills.length > 0 && (
                <Stack direction="row" flexWrap="wrap" gap={0.5} sx={{ mt: 2 }}>
                  {job.skills.slice(0, 6).map((skill) => (
                    <Chip key={skill} label={skill} size="small" variant="outlined" />
                  ))}
                </Stack>
              )}
            </Box>

            <Button variant="contained" size="large" sx={{ whiteSpace: "nowrap", px: 4 }}>
              Apply Now
            </Button>
          </Stack>
        </Card>
      ))}
    </Stack>
  );
}
