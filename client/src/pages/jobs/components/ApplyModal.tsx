// import { useState } from "react";
// import {
//   Modal,
//   Fade,
//   Backdrop,
//   Box,
//   Stack,
//   Typography,
//   IconButton,
//   Divider,
//   TextField,
//   Button,
//   CircularProgress,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";

// import { Job } from "../types";
// import { applyToJob } from "../services/job";

// // ─── Props ────────────────────────────────────────────────────────────────────

// interface ApplyModalProps {
//   job: Job;
//   onClose: () => void;
//   onSuccess: (msg: string) => void;
//   onError: (msg: string) => void;
// }

// // ─── Component ────────────────────────────────────────────────────────────────

// export default function ApplyModal({
//   job,
//   onClose,
//   onSuccess,
//   onError,
// }: ApplyModalProps) {
//   const [coverLetter, setCoverLetter] = useState("");
//   const [resumeUrl, setResumeUrl] = useState("");
//   const [loading, setLoading] = useState(false);

//   const overLimit = coverLetter.length > 3000;

//   async function handleSubmit() {
//     setLoading(true);
//     try {
//       await applyToJob(job._id, {
//         coverLetter: coverLetter.trim() || undefined,
//         resumeUrl: resumeUrl.trim() || undefined,
//       });
//       onSuccess(`Applied to ${job.title} at ${job.company}!`);
//       onClose();
//     } catch (e: unknown) {
//       const msg =
//         (e as { response?: { data?: { message?: string } } })?.response?.data
//           ?.message ?? "Failed to submit application. Please try again.";
//       onError(msg);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <Modal open onClose={onClose} closeAfterTransition BackdropComponent={Backdrop}>
//       <Fade in>
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             width: { xs: "90%", sm: 500 },
//             bgcolor: "background.paper",
//             borderRadius: 4,
//             boxShadow: 24,
//             p: 4,
//             outline: "none",
//             maxHeight: "90vh",
//             overflowY: "auto",
//           }}
//         >
//           {/* Header */}
//           <Stack
//             direction="row"
//             justifyContent="space-between"
//             alignItems="flex-start"
//             mb={2}
//           >
//             <Box>
//               <Typography
//                 variant="overline"
//                 color="primary.main"
//                 sx={{ fontWeight: 800 }}
//               >
//                 Applying for
//               </Typography>
//               <Typography variant="h5" fontWeight={700}>
//                 {job.title}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 {job.company} · {job.location}
//               </Typography>
//             </Box>
//             <IconButton onClick={onClose} size="small">
//               <CloseIcon />
//             </IconButton>
//           </Stack>

//           <Divider sx={{ my: 2 }} />

//           {/* Form */}
//           <Stack spacing={3}>
//             <Box>
//               <Typography
//                 variant="caption"
//                 fontWeight={700}
//                 color="text.secondary"
//                 sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
//               >
//                 Cover Letter (optional)
//               </Typography>
//               <TextField
//                 multiline
//                 rows={5}
//                 fullWidth
//                 margin="dense"
//                 placeholder="Why are you a great fit for this role?"
//                 value={coverLetter}
//                 onChange={(e) => setCoverLetter(e.target.value)}
//                 error={overLimit}
//                 helperText={
//                   overLimit
//                     ? "Character limit exceeded"
//                     : `${coverLetter.length}/3000`
//                 }
//               />
//             </Box>

//             {/* <Box>
//               <Typography
//                 variant="caption"
//                 fontWeight={700}
//                 color="text.secondary"
//                 sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
//               >
//                 Resume URL (optional)
//               </Typography>
//               <TextField
//                 fullWidth
//                 margin="dense"
//                 placeholder="https://drive.google.com/your-resume"
//                 value={resumeUrl}
//                 onChange={(e) => setResumeUrl(e.target.value)}
//               />
//             </Box> */}

//             <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
//               <Button onClick={onClose} disabled={loading}>
//                 Cancel
//               </Button>
//               <Button
//                 variant="contained"
//                 onClick={handleSubmit}
//                 disabled={loading || overLimit}
//                 startIcon={
//                   loading ? (
//                     <CircularProgress size={16} color="inherit" />
//                   ) : undefined
//                 }
//               >
//                 {loading ? "Submitting..." : "Submit Application"}
//               </Button>
//             </Stack>
//           </Stack>
//         </Box>
//       </Fade>
//     </Modal>
//   );
// }

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
import { alpha } from "@mui/material/styles";

import { Job } from "../types";
import { applyToJob } from "../services/job";

// ── Design Tokens (Consistent with Hero & other components) ─────────────
const GREEN = "#059669";
const GREEN_DARK = "#047857";

interface ApplyModalProps {
  job: Job;
  onClose: () => void;
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

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
      onSuccess(`Successfully applied to ${job.title} at ${job.company}!`);
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
            width: { xs: "92%", sm: 520 },
            bgcolor: "background.paper",
            borderRadius: 4,
            boxShadow: "0 25px 60px -15px rgba(15, 23, 42, 0.15)",
            p: 5,
            outline: "none",
            maxHeight: "92vh",
            overflowY: "auto",
          }}
        >
          {/* Header */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            sx={{ mb: 3 }}
          >
            <Box>
              <Typography
                variant="overline"
                sx={{ 
                  fontWeight: 700, 
                  letterSpacing: "0.08em", 
                  color: GREEN,
                  mb: 0.5,
                  display: "block"
                }}
              >
                APPLYING FOR
              </Typography>
              <Typography variant="h5" fontWeight={800} color="#0f172a">
                {job.title}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {job.company} • {job.location}
              </Typography>
            </Box>
            <IconButton 
              onClick={onClose} 
              size="small"
              sx={{ color: "#64748b", "&:hover": { color: "#0f172a" } }}
            >
              <CloseIcon />
            </IconButton>
          </Stack>

          <Divider sx={{ my: 3, borderColor: "#e2e8f0" }} />

          {/* Form */}
          <Stack spacing={3.5}>
            <Box>
              <Typography
                variant="caption"
                fontWeight={700}
                color="text.secondary"
                sx={{ textTransform: "uppercase", letterSpacing: 0.5, mb: 1, display: "block" }}
              >
                Cover Letter (Optional)
              </Typography>
              <TextField
                multiline
                rows={6}
                fullWidth
                placeholder="Why are you a great fit for this role? Tell us about your relevant experience..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                error={overLimit}
                helperText={
                  overLimit
                    ? "Character limit exceeded (3000)"
                    : `${coverLetter.length}/3000 characters`
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2.5,
                  },
                }}
              />
            </Box>

            {/* Resume URL (optional) */}
            {/* Uncomment if needed */}
            {/* 
            <Box>
              <Typography
                variant="caption"
                fontWeight={700}
                color="text.secondary"
                sx={{ textTransform: "uppercase", letterSpacing: 0.5, mb: 1, display: "block" }}
              >
                Resume / CV URL (Optional)
              </Typography>
              <TextField
                fullWidth
                placeholder="https://drive.google.com/your-resume.pdf"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
              />
            </Box>
            */}

            <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ pt: 2 }}>
              <Button 
                onClick={onClose} 
                disabled={loading}
                sx={{ 
                  px: 4, 
                  color: "#64748b",
                  "&:hover": { background: "#f1f5f9" }
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading || overLimit}
                startIcon={
                  loading ? <CircularProgress size={18} color="inherit" /> : undefined
                }
                sx={{
                  px: 5,
                  py: 1.4,
                  fontSize: 16,
                  fontWeight: 700,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${GREEN} 0%, ${GREEN_DARK} 100%)`,
                  boxShadow: `0 6px 20px ${alpha(GREEN, 0.35)}`,
                  "&:hover": {
                    background: `linear-gradient(135deg, ${GREEN_DARK}, #065f46)`,
                    boxShadow: `0 8px 25px ${alpha(GREEN, 0.45)}`,
                  },
                }}
              >
                {loading ? "Submitting Application..." : "Submit Application"}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Fade>
    </Modal>
  );
}