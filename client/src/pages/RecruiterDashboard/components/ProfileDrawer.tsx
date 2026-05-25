import React, { useState, useEffect } from "react";
import { Drawer, Stack, Typography, IconButton, Divider, Box, Skeleton, Alert, Avatar, Button, Chip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import LanguageIcon from "@mui/icons-material/Language";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { alpha } from "@mui/material/styles";
import { fetchJobSeekerProfile, IJobSeekerProfile } from "../services/recruiter";

interface ProfileDrawerProps {
  userId: string | null;
  onClose: () => void;
}

import { getErrorMessage } from "../../../utils/errorUtils";

export function ProfileDrawer({ userId, onClose }: ProfileDrawerProps) {
  const [profile, setProfile] = useState<IJobSeekerProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setProfile(null);
    setError(null);
    fetchJobSeekerProfile(userId)
      .then(setProfile)
      .catch((err) => setError(getErrorMessage(err, "Could not load profile.")))
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <Drawer
      anchor="right"
      open={!!userId}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: "100%", sm: 480 }, p: 3, bgcolor: "background.paper" } }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">Applicant Profile</Typography>
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </Stack>
      <Divider sx={{ mb: 3 }} />

      {loading && (
        <Stack spacing={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Skeleton variant="circular" width={56} height={56} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" />
            </Box>
          </Stack>
          {[1, 2, 3].map((i) => <Skeleton key={i} variant="rounded" height={60} />)}
        </Stack>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {profile && (
        <Stack spacing={3}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ width: 56, height: 56, fontSize: 22, bgcolor: alpha("#7c3aed", 0.2), color: "primary.main" }}>
              {profile.user?.name?.[0] ?? "?"}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>{profile.user?.name}</Typography>
              <Typography variant="body2" color="text.secondary">{profile.headline ?? profile.user?.email}</Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1} flexWrap="wrap">
            {profile.linkedIn && (
              <IconButton size="small" component="a" href={profile.linkedIn} target="_blank"><LinkedInIcon fontSize="small" /></IconButton>
            )}
            {profile.github && (
              <IconButton size="small" component="a" href={profile.github} target="_blank"><GitHubIcon fontSize="small" /></IconButton>
            )}
            {profile.portfolio && (
              <IconButton size="small" component="a" href={profile.portfolio} target="_blank"><LanguageIcon fontSize="small" /></IconButton>
            )}
            {profile.resumeUrl && (
              <Button size="small" variant="outlined" startIcon={<OpenInNewIcon />} href={profile.resumeUrl} target="_blank">
                Resume
              </Button>
            )}
          </Stack>

          {profile.bio && (
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>About</Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>{profile.bio}</Typography>
            </Box>
          )}

          {profile.skills.length > 0 && (
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>Skills</Typography>
              <Stack direction="row" flexWrap="wrap" gap={0.5} sx={{ mt: 0.75 }}>
                {profile.skills.map((s) => (
                  <Chip key={s} label={s} size="small" sx={{ bgcolor: alpha("#7c3aed", 0.1), color: "primary.main" }} />
                ))}
              </Stack>
            </Box>
          )}

          {profile.experience.length > 0 && (
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>Experience</Typography>
              <Stack spacing={1.5} sx={{ mt: 0.75 }}>
                {profile.experience.map((exp, i) => (
                  <Box key={exp._id ?? i} sx={{ p: 1.5, borderRadius: 1.5, border: `1px solid ${alpha("#ffffff", 0.07)}` }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{exp.title}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {exp.company}{exp.location ? ` Â· ${exp.location}` : ""}
                    </Typography>
                    <Typography variant="caption" color="text.disabled" display="block">
                      {new Date(exp.startDate).getFullYear()} â€“ {exp.isCurrent ? "Present" : exp.endDate ? new Date(exp.endDate).getFullYear() : ""}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {profile.education.length > 0 && (
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>Education</Typography>
              <Stack spacing={1.5} sx={{ mt: 0.75 }}>
                {profile.education.map((edu, i) => (
                  <Box key={edu._id ?? i} sx={{ p: 1.5, borderRadius: 1.5, border: `1px solid ${alpha("#ffffff", 0.07)}` }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{edu.degree} in {edu.fieldOfStudy}</Typography>
                    <Typography variant="caption" color="text.secondary">{edu.institution}</Typography>
                    <Typography variant="caption" color="text.disabled" display="block">
                      {edu.startYear} â€“ {edu.endYear ?? "Present"}{edu.grade ? ` Â· ${edu.grade}` : ""}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {(profile.expectedSalary || profile.noticePeriod !== undefined) && (
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>Preferences</Typography>
              <Stack direction="row" spacing={2} sx={{ mt: 0.75 }}>
                {profile.expectedSalary && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">Expected salary</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{profile.expectedSalary.toLocaleString()}</Typography>
                  </Box>
                )}
                {profile.noticePeriod !== undefined && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">Notice period</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{profile.noticePeriod} days</Typography>
                  </Box>
                )}
              </Stack>
            </Box>
          )}
        </Stack>
      )}
    </Drawer>
  );
}

