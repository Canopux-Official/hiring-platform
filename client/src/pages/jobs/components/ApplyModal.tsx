import { useState } from "react";
import {
  Modal,
  Fade,
  Backdrop,
  Box,
  Stack,
  Typography,
  IconButton,
  Divider,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { Job } from "../types";
import { applyToJob } from "../services/job";

// ─── Props ────────────────────────────────────────────────────────────────────

interface ApplyModalProps {
  job: Job;
  onClose: () => void;
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ApplyModal({
  job,
  onClose,
  onSuccess,
  onError,
}: ApplyModalProps) {
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const overLimit = coverLetter.length > 3000;

  async function handleSubmit() {
    setLoading(true);
    try {
      await applyToJob(job._id, {
        coverLetter: coverLetter.trim() || undefined,
        resumeUrl: resumeUrl.trim() || undefined,
      });
      onSuccess(`Applied to ${job.title} at ${job.company}!`);
      onClose();
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to submit application. Please try again.";
      onError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open onClose={onClose} closeAfterTransition BackdropComponent={Backdrop}>
      <Fade in>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 500 },
            bgcolor: "background.paper",
            borderRadius: 4,
            boxShadow: 24,
            p: 4,
            outline: "none",
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          {/* Header */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            mb={2}
          >
            <Box>
              <Typography
                variant="overline"
                color="primary.main"
                sx={{ fontWeight: 800 }}
              >
                Applying for
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                {job.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {job.company} · {job.location}
              </Typography>
            </Box>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Stack>

          <Divider sx={{ my: 2 }} />

          {/* Form */}
          <Stack spacing={3}>
            <Box>
              <Typography
                variant="caption"
                fontWeight={700}
                color="text.secondary"
                sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
              >
                Cover Letter (optional)
              </Typography>
              <TextField
                multiline
                rows={5}
                fullWidth
                margin="dense"
                placeholder="Why are you a great fit for this role?"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                error={overLimit}
                helperText={
                  overLimit
                    ? "Character limit exceeded"
                    : `${coverLetter.length}/3000`
                }
              />
            </Box>

            <Box>
              <Typography
                variant="caption"
                fontWeight={700}
                color="text.secondary"
                sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
              >
                Resume URL (optional)
              </Typography>
              <TextField
                fullWidth
                margin="dense"
                placeholder="https://drive.google.com/your-resume"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
              />
            </Box>

            <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
              <Button onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading || overLimit}
                startIcon={
                  loading ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : undefined
                }
              >
                {loading ? "Submitting..." : "Submit Application"}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Fade>
    </Modal>
  );
}