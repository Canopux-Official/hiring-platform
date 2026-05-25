// import { useEffect, useState } from "react";
// import {
//   Modal,
//   Fade,
//   Backdrop,
//   Box,
//   Stack,
//   Typography,
//   Avatar,
//   IconButton,
//   Chip,
//   Divider,
//   Button,
//   CircularProgress,
//   Alert,
// } from "@mui/material";
// import { alpha } from "@mui/material/styles";
// import CloseIcon from "@mui/icons-material/Close";
// import BusinessIcon from "@mui/icons-material/Business";
// import LocationOnIcon from "@mui/icons-material/LocationOn";
// import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
// import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";


// import {
//   JOB_TYPE_LABELS,
//   EXP_LABELS,
//   formatSalary,
//   getInitials,
//   stringToColor,
// } from "../services/job-helpers";
// import { Job } from "../types";
// import { fetchJob, fetchMyApplicationForJob } from "../services/job";
// import ApplyModal from "./ApplyModal";

// // ─── Props ────────────────────────────────────────────────────────────────────

// interface JobDetailModalProps {
//   jobId: string;
//   onClose: () => void;
//   onApplySuccess: (msg: string) => void;
//   onApplyError: (msg: string) => void;
//   onLoadError: (msg: string) => void;
// }

// // ─── Component ────────────────────────────────────────────────────────────────

// export default function JobDetailModal({
//   jobId,
//   onClose,
//   onApplySuccess,
//   onApplyError,
//   onLoadError,
// }: JobDetailModalProps) {
//   const [job, setJob] = useState<Job | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [alreadyApplied, setAlreadyApplied] = useState(false);
//   const [justApplied, setJustApplied] = useState(false);
//   const [showApply, setShowApply] = useState(false);

//   useEffect(() => {
//     setLoading(true);
//     Promise.all([fetchJob(jobId), fetchMyApplicationForJob(jobId)])
//       .then(([j, app]) => {
//         setJob(j);
//         setAlreadyApplied(!!app);
//       })
//       .catch(() => {
//         onLoadError("Could not load job details.");
//         onClose();
//       })
//       .finally(() => setLoading(false));
//   }, [jobId]);

//   const applied = alreadyApplied || justApplied;

//   const content = loading ? (
//     <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}>
//       <CircularProgress />
//     </Box>
//   ) : job ? (
//     <Stack spacing={3}>
//       {/* Header */}
//       <Stack direction="row" spacing={2} alignItems="flex-start">
//         <Avatar
//           sx={{
//             width: 64,
//             height: 64,
//             bgcolor: stringToColor(job.company),
//             fontSize: 24,
//           }}
//         >
//           {getInitials(job.company)}
//         </Avatar>
//         <Box sx={{ flex: 1 }}>
//           <Typography variant="h5" fontWeight={700}>
//             {job.title}
//           </Typography>
//           <Stack direction="row" alignItems="center" spacing={1} color="text.secondary">
//             <BusinessIcon sx={{ fontSize: 16 }} />
//             <Typography variant="body2">{job.company}</Typography>
//             <span>·</span>
//             <LocationOnIcon sx={{ fontSize: 16 }} />
//             <Typography variant="body2">{job.location}</Typography>
//           </Stack>
//         </Box>
//         <IconButton onClick={onClose}>
//           <CloseIcon />
//         </IconButton>
//       </Stack>

//       {/* Meta chips */}
//       <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
//         <Chip size="small" label={JOB_TYPE_LABELS[job.type]} variant="outlined" color="primary" />
//         <Chip size="small" label={EXP_LABELS[job.experienceLevel]} variant="outlined" />
//         <Chip size="small" label={`${job.openings} Openings`} />
//         <Chip size="small" icon={<AttachMoneyIcon />} label={formatSalary(job)} />
//       </Stack>

//       <Divider />

//       {/* Description */}
//       <Box>
//         <Typography
//           variant="subtitle2"
//           color="primary.main"
//           gutterBottom
//           sx={{ textTransform: "uppercase", letterSpacing: 1 }}
//         >
//           About the Role
//         </Typography>
//         <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-wrap" }}>
//           {job.description}
//         </Typography>
//       </Box>

//       {/* Requirements */}
//       {job.requirements.length > 0 && (
//         <Box>
//           <Typography
//             variant="subtitle2"
//             color="primary.main"
//             gutterBottom
//             sx={{ textTransform: "uppercase", letterSpacing: 1 }}
//           >
//             Requirements
//           </Typography>
//           <Box component="ul" sx={{ pl: 2.5, m: 0, color: "text.secondary" }}>
//             {job.requirements.map((r, i) => (
//               <Typography component="li" variant="body2" key={i} sx={{ mb: 0.5 }}>
//                 {r}
//               </Typography>
//             ))}
//           </Box>
//         </Box>
//       )}

//       {/* Skills */}
//       {job.skills.length > 0 && (
//         <Box>
//           <Typography
//             variant="subtitle2"
//             color="primary.main"
//             gutterBottom
//             sx={{ textTransform: "uppercase", letterSpacing: 1 }}
//           >
//             Skills
//           </Typography>
//           <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
//             {job.skills.map((s) => (
//               <Chip
//                 key={s}
//                 label={s}
//                 size="small"
//                 sx={{
//                   bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
//                 }}
//               />
//             ))}
//           </Stack>
//         </Box>
//       )}

//       {/* CTA */}
//       <Divider />
//       <Box textAlign="right">
//         {applied ? (
//           <Alert
//             severity="success"
//             icon={<CheckCircleOutlineIcon />}
//             sx={{ display: "inline-flex" }}
//           >
//             Application submitted
//           </Alert>
//         ) : job.status !== "open" ? (
//           <Button disabled variant="outlined">
//             Applications Closed
//           </Button>
//         ) : (
//           <Button variant="contained" size="large" onClick={() => setShowApply(true)}>
//             Apply Now
//           </Button>
//         )}
//       </Box>
//     </Stack>
//   ) : null;

//   return (
//     <>
//       <Modal open onClose={onClose} closeAfterTransition BackdropComponent={Backdrop}>
//         <Fade in>
//           <Box
//             sx={{
//               position: "absolute",
//               top: "50%",
//               left: "50%",
//               transform: "translate(-50%, -50%)",
//               width: { xs: "95%", sm: 600 },
//               bgcolor: "background.paper",
//               borderRadius: 4,
//               boxShadow: 24,
//               p: { xs: 2, sm: 4 },
//               maxHeight: "90vh",
//               overflowY: "auto",
//               outline: "none",
//             }}
//           >
//             {content}
//           </Box>
//         </Fade>
//       </Modal>

//       {showApply && job && (
//         <ApplyModal
//           job={job}
//           onClose={() => setShowApply(false)}
//           onSuccess={(msg) => {
//             setJustApplied(true);
//             setShowApply(false);
//             onApplySuccess(msg);
//           }}
//           onError={onApplyError}
//         />
//       )}
//     </>
//   );
// }


import { useEffect, useState } from "react";
import {
  Modal,
  Fade,
  Backdrop,
  Box,
  Stack,
  Typography,
  Avatar,
  IconButton,
  Chip,
  Divider,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import {
  JOB_TYPE_LABELS,
  EXP_LABELS,
  formatSalary,
  getInitials,
  stringToColor,
} from "../services/job-helpers";
import { Job } from "../types";
import { fetchJob, fetchMyApplicationForJob } from "../services/job";
import ApplyModal from "./ApplyModal";

// ── Design Tokens (Consistent with Hero & other components) ─────────────
const GREEN = "#059669";
const GREEN_DARK = "#047857";
const GREEN_LIGHT = "#d1fae5";
const BLUE = "#2563eb";

interface JobDetailModalProps {
  jobId: string;
  onClose: () => void;
  onApplySuccess: (msg: string) => void;
  onApplyError: (msg: string) => void;
  onLoadError: (msg: string) => void;
}

export default function JobDetailModal({
  jobId,
  onClose,
  onApplySuccess,
  onApplyError,
  onLoadError,
}: JobDetailModalProps) {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [justApplied, setJustApplied] = useState(false);
  const [showApply, setShowApply] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchJob(jobId), fetchMyApplicationForJob(jobId)])
      .then(([j, app]) => {
        setJob(j);
        setAlreadyApplied(!!app);
      })
      .catch(() => {
        onLoadError("Could not load job details.");
        onClose();
      })
      .finally(() => setLoading(false));
  }, [jobId]);

  const applied = alreadyApplied || justApplied;

  const content = loading ? (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 320 }}>
      <CircularProgress size={48} sx={{ color: GREEN }} />
    </Box>
  ) : job ? (
    <Stack spacing={4}>
      {/* Header */}
      <Stack direction="row" spacing={3} alignItems="flex-start">
        <Avatar
          sx={{
            width: 72,
            height: 72,
            bgcolor: stringToColor(job.company),
            fontSize: 26,
            fontWeight: 700,
            boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
          }}
        >
          {getInitials(job.company)}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" fontWeight={800} color="#0f172a">
            {job.title}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1.5} color="text.secondary" sx={{ mt: 0.5 }}>
            <BusinessIcon sx={{ fontSize: 18 }} />
            <Typography variant="body1">{job.company}</Typography>
            <span>·</span>
            <LocationOnIcon sx={{ fontSize: 18 }} />
            <Typography variant="body1">{job.location}</Typography>
          </Stack>
        </Box>
        <IconButton 
          onClick={onClose} 
          sx={{ color: "#64748b", "&:hover": { color: "#0f172a" } }}
        >
          <CloseIcon />
        </IconButton>
      </Stack>

      {/* Meta Chips */}
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Chip 
          size="small" 
          label={JOB_TYPE_LABELS[job.type]} 
          sx={{ bgcolor: GREEN_LIGHT, color: GREEN, fontWeight: 500 }}
        />
        <Chip 
          size="small" 
          label={EXP_LABELS[job.experienceLevel]} 
          variant="outlined" 
          sx={{ borderColor: alpha(GREEN, 0.4), color: GREEN }}
        />
        <Chip 
          size="small" 
          label={`${job.openings} Openings`} 
          sx={{ bgcolor: "#f1f5f9", color: "#475569" }}
        />
        <Chip 
          size="small" 
          icon={<AttachMoneyIcon sx={{ color: GREEN }} />} 
          label={formatSalary(job)} 
          sx={{ bgcolor: GREEN_LIGHT, color: GREEN, fontWeight: 600 }}
        />
      </Stack>

      <Divider sx={{ borderColor: "#e2e8f0" }} />

      {/* Description */}
      <Box>
        <Typography
          variant="subtitle2"
          sx={{ 
            color: GREEN, 
            fontWeight: 700, 
            textTransform: "uppercase", 
            letterSpacing: 1.2, 
            mb: 1.5 
          }}
        >
          About the Role
        </Typography>
        <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#334155" }}>
          {job.description}
        </Typography>
      </Box>

      {/* Requirements */}
      {job.requirements.length > 0 && (
        <Box>
          <Typography
            variant="subtitle2"
            sx={{ 
              color: GREEN, 
              fontWeight: 700, 
              textTransform: "uppercase", 
              letterSpacing: 1.2, 
              mb: 1.5 
            }}
          >
            Requirements
          </Typography>
          <Box component="ul" sx={{ pl: 3, m: 0, color: "#475569" }}>
            {job.requirements.map((r, i) => (
              <Typography component="li" variant="body1" key={i} sx={{ mb: 1, lineHeight: 1.7 }}>
                {r}
              </Typography>
            ))}
          </Box>
        </Box>
      )}

      {/* Skills */}
      {job.skills.length > 0 && (
        <Box>
          <Typography
            variant="subtitle2"
            sx={{ 
              color: GREEN, 
              fontWeight: 700, 
              textTransform: "uppercase", 
              letterSpacing: 1.2, 
              mb: 1.5 
            }}
          >
            Required Skills
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {job.skills.map((s) => (
              <Chip
                key={s}
                label={s}
                size="small"
                sx={{
                  bgcolor: alpha(GREEN, 0.1),
                  color: GREEN,
                  fontWeight: 500,
                }}
              />
            ))}
          </Stack>
        </Box>
      )}

      {/* CTA */}
      <Divider sx={{ borderColor: "#e2e8f0" }} />
      <Box textAlign="right">
        {applied ? (
          <Alert
            severity="success"
            icon={<CheckCircleOutlineIcon sx={{ color: GREEN }} />}
            sx={{ display: "inline-flex", bgcolor: GREEN_LIGHT }}
          >
            Application Submitted Successfully
          </Alert>
        ) : job.status !== "open" ? (
          <Button disabled variant="outlined" size="large">
            Applications Closed
          </Button>
        ) : (
          <Button
            variant="contained"
            size="large"
            onClick={() => setShowApply(true)}
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
        )}
      </Box>
    </Stack>
  ) : null;

  return (
    <>
      <Modal open onClose={onClose} closeAfterTransition BackdropComponent={Backdrop}>
        <Fade in>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "95%", sm: 640 },
              bgcolor: "background.paper",
              borderRadius: 4,
              boxShadow: "0 25px 70px -15px rgba(15, 23, 42, 0.18)",
              p: { xs: 3, sm: 5 },
              maxHeight: "92vh",
              overflowY: "auto",
              outline: "none",
            }}
          >
            {content}
          </Box>
        </Fade>
      </Modal>

      {showApply && job && (
        <ApplyModal
          job={job}
          onClose={() => setShowApply(false)}
          onSuccess={(msg) => {
            setJustApplied(true);
            setShowApply(false);
            onApplySuccess(msg);
          }}
          onError={onApplyError}
        />
      )}
    </>
  );
}