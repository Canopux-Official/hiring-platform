import React, { useState, useEffect } from "react";
import { Drawer, Stack, Typography, IconButton, Divider, Box, Skeleton, Alert, Avatar, Chip, Tooltip, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ArticleIcon from "@mui/icons-material/Article";
import HistoryIcon from "@mui/icons-material/History";
import { alpha } from "@mui/material/styles";
import { fetchApplicationById, IApplication, IJobSeekerProfile } from "../services/recruiter";
import { timeAgo } from "../utils/constants";

interface ApplicationDetailDrawerProps {
  applicationId: string | null;
  onClose: () => void;
  onViewProfile: (userId: string) => void;
}

import { getErrorMessage } from "../../../utils/errorUtils";

export function ApplicationDetailDrawer({ applicationId, onClose, onViewProfile }: ApplicationDetailDrawerProps) {
  const [app, setApp] = useState<IApplication | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!applicationId) return;
    setLoading(true);
    setApp(null);
    setError(null);
    fetchApplicationById(applicationId)
      .then(setApp)
      .catch((err) => setError(getErrorMessage(err, "Could not load application details.")))
      .finally(() => setLoading(false));
  }, [applicationId]);

  // applicant is a User object, profile is separate
  const applicant = app && typeof app.applicant === "object" ? app.applicant : null;
  const profile = app?.applicantProfile ?? null;
  const userId = applicant?._id ?? (typeof app?.applicant === "string" ? app.applicant : null);
  const name = applicant?.name ?? "Applicant";   

  const STATUS_COLOR: Record<string, "default" | "warning" | "info" | "error" | "success"> = {
    pending: "default",
    reviewed: "warning",
    shortlisted: "info",
    rejected: "error",
    hired: "success",
  };

  return (
    <Drawer
      anchor="right"
      open={!!applicationId}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: "100%", sm: 520 }, bgcolor: "background.paper" } }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 3, py: 2, borderBottom: `1px solid ${alpha("#ffffff", 0.07)}` }}>
        <Typography variant="h6">Application Details</Typography>
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </Stack>

      <Box sx={{ overflowY: "auto", flex: 1, px: 3, py: 2.5 }}>
        {loading && (
          <Stack spacing={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Skeleton variant="circular" width={48} height={48} />
              <Box sx={{ flex: 1 }}><Skeleton variant="text" width="55%" /><Skeleton variant="text" width="35%" /></Box>
            </Stack>
            <Skeleton variant="rounded" height={80} />
            <Skeleton variant="rounded" height={120} />
          </Stack>
        )}

        {error && <Alert severity="error">{error}</Alert>}

        {app && (
          <Stack spacing={3}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ width: 48, height: 48, bgcolor: alpha("#7c3aed", 0.2), color: "primary.main", fontWeight: 700, fontSize: 18 }}>
                {name[0]}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>{name}</Typography>
                {profile?.headline && (
                  <Typography variant="caption" color="text.secondary" noWrap>{profile.headline}</Typography>
                )}
                <Typography variant="caption" color="text.disabled" display="block">
                  Applied {timeAgo(app.createdAt)}
                </Typography>
              </Box>
              <Stack direction="row" spacing={0.5}>
                <Chip
                  size="small"
                  label={app.status}
                  color={STATUS_COLOR[app.status] ?? "default"}
                  sx={{ textTransform: "capitalize", fontWeight: 600 }}
                />
                {userId && (
                  <Tooltip title="View full profile">
                    <IconButton size="small" onClick={() => { onViewProfile(userId); onClose(); }}>
                      <PersonIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Stack>
            </Stack>

            <Divider />

            {app.resumeUrl && (
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
                  Resume
                </Typography>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<OpenInNewIcon />}
                  href={app.resumeUrl}
                  target="_blank"
                  sx={{ mt: 0.75, justifyContent: "flex-start" }}
                >
                  View Resume
                </Button>
              </Box>
            )}

            {app.coverLetter && (
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75 }}>
                  <ArticleIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
                    Cover Letter
                  </Typography>
                </Stack>
                <Box sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${alpha("#ffffff", 0.08)}`, bgcolor: alpha("#ffffff", 0.02) }}>
                  <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}>
                    {app.coverLetter}
                  </Typography>
                </Box>
              </Box>
            )}

            {app.recruiterNotes && (
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
                  Recruiter Notes
                </Typography>
                <Box sx={{ p: 2, mt: 0.75, borderRadius: 1.5, border: `1px solid ${alpha("#7c3aed", 0.15)}`, bgcolor: alpha("#7c3aed", 0.04) }}>
                  <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>{app.recruiterNotes}</Typography>
                </Box>
              </Box>
            )}

            {app.statusHistory && app.statusHistory.length > 0 && (
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                  <HistoryIcon sx={{ fontSize: 15, color: "text.secondary" }} />
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
                    Status History
                  </Typography>
                </Stack>

                <Stack spacing={0}>
                  {[...app.statusHistory].reverse().map((h, i, arr) => (
                    <Box key={i} sx={{ display: "flex", gap: 1.5, position: "relative" }}>
                      {i < arr.length - 1 && (
                        <Box sx={{
                          position: "absolute", left: 6, top: 20, bottom: 0, width: "1px", bgcolor: alpha("#ffffff", 0.1),
                        }} />
                      )}
                      <Box sx={{
                        width: 13, height: 13, borderRadius: "50%", flexShrink: 0, mt: "4px",
                        bgcolor: i === 0 ? "primary.main" : alpha("#ffffff", 0.12),
                        border: `2px solid ${i === 0 ? "primary.main" : alpha("#ffffff", 0.2)}`, zIndex: 1,
                      }} />
                      <Box sx={{ pb: 2.5, flex: 1 }}>
                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                          <Chip
                            size="small"
                            label={h.status}
                            color={STATUS_COLOR[h.status] ?? "default"}
                            sx={{ textTransform: "capitalize", height: 22, fontSize: "0.7rem", fontWeight: 600, "& .MuiChip-label": { px: 1 } }}
                          />
                          <Typography variant="caption" color="text.disabled" sx={{ fontSize: "0.7rem" }}>
                            {new Date(h.changedAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
                          </Typography>
                        </Stack>
                        {h.note && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5, fontSize: "0.72rem" }}>
                            {h.note}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}
          </Stack>
        )}
      </Box>
    </Drawer>
  );
}

