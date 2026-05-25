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

// ── Design Tokens ─────────────────────────────────────────────────────
const GREEN = "#059669";
const GREEN_DARK = "#047857";
const GREEN_LIGHT = "#d1fae5";

interface RecommendedTabProps {
  jobs: IRecommendedJob[];
  loading: boolean;
}

export default function RecommendedTab({ jobs, loading }: RecommendedTabProps) {
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress size={48} sx={{ color: GREEN }} />
      </Box>
    );
  }

  if (jobs.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 10 }}>
        <StarIcon sx={{ fontSize: 68, color: "#94a3b8", mb: 3 }} />
        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
          No recommendations yet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420, mx: "auto" }}>
          Complete your profile with skills, preferred locations, and experience to get personalized job matches.
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      {jobs.map((job) => (
        <Card 
          key={job._id} 
          sx={{ 
            p: 4, 
            borderRadius: 3.5,
            border: "1px solid #e2e8f0",
            transition: "all 0.25s ease",
            "&:hover": {
              borderColor: alpha(GREEN, 0.4),
              boxShadow: "0 12px 32px rgba(5, 150, 105, 0.12)",
              transform: "translateY(-4px)",
            }
          }}
        >
          <Stack direction={{ xs: "column", sm: "row" }} spacing={4} alignItems={{ sm: "center" }}>
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1.5 }}>
                <Typography variant="h6" fontWeight={700} color="#0f172a">
                  {job.title}
                </Typography>
                {job.matchScore !== undefined && (
                  <Chip
                    label={`${job.matchScore}% Match`}
                    size="small"
                    sx={{
                      bgcolor: GREEN_LIGHT,
                      color: GREEN,
                      fontWeight: 700,
                      fontSize: 13.5,
                    }}
                  />
                )}
              </Stack>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 0.5 }}>
                {job.company} • {job.location}
              </Typography>

              {(job.salaryMin || job.salaryMax) && (
                <Typography variant="body2" color={GREEN} fontWeight={600}>
                  {fmtSalary(job.salaryMin)} – {fmtSalary(job.salaryMax)}
                </Typography>
              )}

              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                Posted {timeAgo(job.postedAt)}
              </Typography>

              {job.skills && job.skills.length > 0 && (
                <Stack direction="row" flexWrap="wrap" gap={0.8} sx={{ mt: 2.5 }}>
                  {job.skills.slice(0, 6).map((skill) => (
                    <Chip 
                      key={skill} 
                      label={skill} 
                      size="small" 
                      sx={{ 
                        bgcolor: alpha(GREEN, 0.08), 
                        color: GREEN,
                        fontWeight: 500 
                      }} 
                    />
                  ))}
                </Stack>
              )}
            </Box>

            <Button 
              variant="contained" 
              size="large" 
              sx={{
                px: 6,
                py: 1.6,
                fontSize: 16,
                fontWeight: 700,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${GREEN} 0%, ${GREEN_DARK} 100%)`,
                boxShadow: `0 6px 20px ${alpha(GREEN, 0.35)}`,
                "&:hover": {
                  background: `linear-gradient(135deg, ${GREEN_DARK}, #065f46)`,
                },
              }}
            >
              Apply Now
            </Button>
          </Stack>
        </Card>
      ))}
    </Stack>
  );
}