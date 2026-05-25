// import {
//   Card,
//   CardContent,
//   Stack,
//   Avatar,
//   Box,
//   Typography,
//   Chip,
//   Button,
// } from "@mui/material";
// import { alpha, useTheme } from "@mui/material/styles";
// import LocationOnIcon from "@mui/icons-material/LocationOn";

// import {
//   JOB_TYPE_LABELS,
//   EXP_LABELS,
//   formatSalary,
//   getInitials,
//   stringToColor,
//   timeAgoFromString,
// } from "../services/job-helpers";
// import { Job } from "../types";

// // ─── Props ────────────────────────────────────────────────────────────────────

// interface JobCardProps {
//   job: Job;
//   onClick: () => void;
// }

// // ─── Component ────────────────────────────────────────────────────────────────

// export default function JobCard({ job, onClick }: JobCardProps) {
//   const theme = useTheme();

//   return (
//     <Card
//       sx={{
//         p: 3,
//         borderRadius: 3,
//         cursor: "pointer",
//         transition: "all 0.2s",
//         border: "1px solid transparent",
//         "&:hover": {
//           borderColor: alpha(theme.palette.primary.main, 0.4),
//           boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
//         },
//       }}
//       onClick={onClick}
//     >
//       <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
//         <Stack
//           direction={{ xs: "column", md: "row" }}
//           spacing={3}
//           alignItems={{ md: "center" }}
//         >
//           {/* Company avatar */}
//           <Avatar
//             sx={{
//               width: 56,
//               height: 56,
//               bgcolor: stringToColor(job.company),
//               color: "#fff",
//               fontWeight: 800,
//               fontSize: 22,
//             }}
//           >
//             {getInitials(job.company)}
//           </Avatar>

//           {/* Main info */}
//           <Box sx={{ flex: 1, minWidth: 0 }}>
//             <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
//               <Typography variant="h6" fontWeight={700} noWrap>
//                 {job.title}
//               </Typography>
//               {job.status !== "open" && (
//                 <Chip size="small" label="Closed" color="default" />
//               )}
//             </Stack>

//             <Stack
//               direction="row"
//               spacing={2}
//               alignItems="center"
//               color="text.secondary"
//               sx={{ mb: 1 }}
//             >
//               <Typography variant="body2">{job.company}</Typography>
//               <Stack direction="row" alignItems="center" spacing={0.5}>
//                 <LocationOnIcon sx={{ fontSize: 14 }} />
//                 <Typography variant="body2">{job.location}</Typography>
//               </Stack>
//               <Typography variant="body2">
//                 · {timeAgoFromString(job.createdAt)}
//               </Typography>
//             </Stack>

//             <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
//               {job.category && <Chip size="small" label={job.category} color="primary" variant="outlined" />}
//               <Chip size="small" label={JOB_TYPE_LABELS[job.type]} variant="outlined" />
//               <Chip size="small" label={EXP_LABELS[job.experienceLevel]} variant="outlined" />
//               {job.skills.slice(0, 3).map((s) => (
//                 <Chip
//                   key={s}
//                   size="small"
//                   label={s}
//                   sx={{
//                     bgcolor: alpha(theme.palette.primary.main, 0.08),
//                     color: "primary.main",
//                     border: "none",
//                   }}
//                 />
//               ))}
//               {job.skills.length > 3 && (
//                 <Chip size="small" label={`+${job.skills.length - 3}`} />
//               )}
//             </Stack>
//           </Box>

//           {/* Salary + CTA */}
//           <Box sx={{ textAlign: { xs: "left", md: "right" }, minWidth: 140 }}>
//             <Typography variant="caption" color="text.secondary">
//               Salary
//             </Typography>
//             <Typography
//               variant="h6"
//               sx={{ color: "primary.main", fontWeight: 700 }}
//             >
//               {formatSalary(job)}
//             </Typography>
//             <Button
//               variant="contained"
//               size="small"
//               sx={{ mt: 1 }}
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onClick();
//               }}
//             >
//               View & Apply
//             </Button>
//           </Box>
//         </Stack>
//       </CardContent>
//     </Card>
//   );
// }


import {
  Card,
  CardContent,
  Stack,
  Avatar,
  Box,
  Typography,
  Chip,
  Button,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import {
  JOB_TYPE_LABELS,
  EXP_LABELS,
  formatSalary,
  getInitials,
  stringToColor,
  timeAgoFromString,
} from "../services/job-helpers";
import { Job } from "../types";

// ── Design Tokens (Consistent with Hero & other components) ─────────────
const GREEN = "#059669";
const GREEN_DARK = "#047857";
const GREEN_LIGHT = "#d1fae5";

interface JobCardProps {
  job: Job;
  onClick: () => void;
}

export default function JobCard({ job, onClick }: JobCardProps) {
  return (
    <Card
      sx={{
        p: 3.5,
        borderRadius: 3.5,
        cursor: "pointer",
        transition: "all 0.25s ease",
        border: "1px solid #e2e8f0",
        background: "#ffffff",
        "&:hover": {
          borderColor: alpha(GREEN, 0.4),
          boxShadow: "0 12px 32px rgba(5, 150, 105, 0.12)",
          transform: "translateY(-4px)",
        },
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          alignItems={{ md: "center" }}
        >
          {/* Company Avatar */}
          <Avatar
            sx={{
              width: 62,
              height: 62,
              bgcolor: stringToColor(job.company),
              color: "#fff",
              fontWeight: 800,
              fontSize: 23,
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            {getInitials(job.company)}
          </Avatar>

          {/* Main Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="h6" fontWeight={700} color="#0f172a" noWrap>
                {job.title}
              </Typography>
              {job.status !== "open" && (
                <Chip 
                  size="small" 
                  label="Closed" 
                  sx={{ bgcolor: "#fee2e2", color: "#ef4444" }} 
                />
              )}
            </Stack>

            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              color="text.secondary"
              sx={{ mb: 1.5 }}
            >
              <Typography variant="body2" fontWeight={500}>
                {job.company}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <LocationOnIcon sx={{ fontSize: 16, color: "#64748b" }} />
                <Typography variant="body2">{job.location}</Typography>
              </Stack>
              <Typography variant="body2" color="#94a3b8">
                · {timeAgoFromString(job.createdAt)}
              </Typography>
            </Stack>

            {/* Tags */}
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {job.category && (
                <Chip 
                  size="small" 
                  label={job.category} 
                  sx={{ 
                    bgcolor: GREEN_LIGHT, 
                    color: GREEN, 
                    fontWeight: 500 
                  }} 
                />
              )}
              <Chip 
                size="small" 
                label={JOB_TYPE_LABELS[job.type]} 
                variant="outlined" 
                sx={{ borderColor: alpha(GREEN, 0.3), color: GREEN }}
              />
              <Chip 
                size="small" 
                label={EXP_LABELS[job.experienceLevel]} 
                variant="outlined" 
                sx={{ borderColor: alpha(GREEN, 0.3), color: GREEN }}
              />
              {job.skills.slice(0, 3).map((s) => (
                <Chip
                  key={s}
                  size="small"
                  label={s}
                  sx={{
                    bgcolor: alpha(GREEN, 0.08),
                    color: GREEN,
                    fontWeight: 500,
                    border: "none",
                  }}
                />
              ))}
              {job.skills.length > 3 && (
                <Chip 
                  size="small" 
                  label={`+${job.skills.length - 3}`} 
                  sx={{ bgcolor: "#f1f5f9", color: "#64748b" }}
                />
              )}
            </Stack>
          </Box>

          {/* Salary & CTA */}
          <Box sx={{ 
            textAlign: { xs: "left", md: "right" }, 
            minWidth: { md: 160 },
            mt: { xs: 2, md: 0 }
          }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              SALARY
            </Typography>
            <Typography
              variant="h6"
              sx={{ 
                color: GREEN, 
                fontWeight: 800, 
                letterSpacing: "-0.02em",
                mb: 1.5
              }}
            >
              {formatSalary(job)}
            </Typography>

            <Button
              variant="contained"
              size="medium"
              fullWidth
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              sx={{
                py: 1.4,
                fontWeight: 700,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${GREEN} 0%, ${GREEN_DARK} 100%)`,
                boxShadow: `0 4px 16px ${alpha(GREEN, 0.3)}`,
                "&:hover": {
                  background: `linear-gradient(135deg, ${GREEN_DARK}, #065f46)`,
                  boxShadow: `0 6px 20px ${alpha(GREEN, 0.4)}`,
                },
              }}
            >
              View & Apply
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}