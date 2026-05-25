// // src/components/seeker/ApplicationsTab.tsx
// import { useState } from "react";
// import {
//   Box,
//   Card,
//   Typography,
//   Stack,
//   Chip,
//   Button,
//   CircularProgress,
//   Tooltip,
// } from "@mui/material";
// import OpenInNewIcon from "@mui/icons-material/OpenInNew";
// import CancelIcon from "@mui/icons-material/Cancel";
// import HistoryIcon from "@mui/icons-material/History";
// import WorkIcon from "@mui/icons-material/Work";
// import { alpha } from "@mui/material/styles";
// import { IApplication, ApplicationStatus } from "../types";
// import { STATUS_META, timeAgo, fmtSalary } from "../lib/seeker";

// interface ApplicationsTabProps {
//   applications: IApplication[];
//   loading: boolean;
//   onWithdraw: (id: string) => void;
// }

// export default function ApplicationsTab({
//   applications,
//   loading,
//   onWithdraw,
// }: ApplicationsTabProps) {
//   const [withdrawing, setWithdrawing] = useState<string | null>(null);

//   const handleWithdraw = async (id: string) => {
//     setWithdrawing(id);
//     await onWithdraw(id);
//     setWithdrawing(null);
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (applications.length === 0) {
//     return (
//       <Box sx={{ textAlign: "center", py: 8 }}>
//         <WorkIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
//         <Typography variant="h6" color="text.secondary">No applications yet</Typography>
//         <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//           Start applying to jobs to track them here.
//         </Typography>
//       </Box>
//     );
//   }

//   return (
//     <Stack spacing={3}>
//       {applications.map((app) => {
//         const meta = STATUS_META[app.status];

//         return (
//           <Card key={app._id} sx={{ p: 3 }}>
//             <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems={{ sm: "flex-start" }}>
//               <Box sx={{ flex: 1 }}>
//                 <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
//                   <Typography variant="h6" fontWeight={700}>
//                     {app.job.title}
//                   </Typography>
//                   <Chip
//                     label={meta.label}
//                     color={meta.color}
//                     size="small"
//                     icon={meta.icon}
//                   />
//                 </Stack>

//                 <Typography variant="body2" color="text.secondary">
//                   {app.job.company} â€¢ {app.job.location}
//                   {(app.job.salaryMin || app.job.salaryMax) && (
//                     <> â€¢ {fmtSalary(app.job.salaryMin)}â€“{fmtSalary(app.job.salaryMax)}</>
//                   )}
//                 </Typography>

//                 <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
//                   Applied {timeAgo(app.createdAt)}
//                 </Typography>

//                 {/* Status History */}
//                 {app.statusHistory && app.statusHistory.length > 1 && (
//                   <Box sx={{ mt: 3 }}>
//                     <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
//                       <HistoryIcon sx={{ fontSize: 16, color: "text.secondary" }} />
//                       <Typography variant="caption" sx={{ textTransform: "uppercase", letterSpacing: 1, color: "text.secondary" }}>
//                         Application Timeline
//                       </Typography>
//                     </Stack>

//                     <Stack spacing={2}>
//                       {app.statusHistory.map((history, i) => (
//                         <Box key={i} sx={{ display: "flex", gap: 2 }}>
//                           <Box
//                             sx={{
//                               width: 12,
//                               height: 12,
//                               borderRadius: "50%",
//                               bgcolor: i === app.statusHistory.length - 1 ? "primary.main" : alpha("#fff", 0.2),
//                               mt: "4px",
//                               flexShrink: 0,
//                             }}
//                           />
//                           <Box>
//                             <Chip
//                               size="small"
//                               label={STATUS_META[history.status]?.label || history.status}
//                               color={STATUS_META[history.status]?.color || "default"}
//                             />
//                             <Typography variant="caption" color="text.secondary" sx={{ ml: 1.5 }}>
//                               {timeAgo(history.changedAt)}
//                             </Typography>
//                             {history.note && (
//                               <Typography variant="body2" sx={{ mt: 0.5, fontSize: "0.875rem" }}>
//                                 {history.note}
//                               </Typography>
//                             )}
//                           </Box>
//                         </Box>
//                       ))}
//                     </Stack>
//                   </Box>
//                 )}

//                 {app.recruiterNotes && (
//                   <Box sx={{ mt: 2, p: 2, bgcolor: alpha("#7c3aed", 0.08), borderLeft: "4px solid", borderColor: "primary.main", borderRadius: 1 }}>
//                     <Typography variant="caption" color="text.secondary">Recruiter Note:</Typography>
//                     <Typography variant="body2">{app.recruiterNotes}</Typography>
//                   </Box>
//                 )}
//               </Box>

//               <Stack spacing={1} alignItems={{ xs: "flex-start", sm: "flex-end" }}>
//                 {app.resumeUrl && (
//                   <Button
//                     variant="outlined"
//                     size="small"
//                     endIcon={<OpenInNewIcon />}
//                     href={app.resumeUrl}
//                     target="_blank"
//                     rel="noreferrer"
//                   >
//                     View Resume
//                   </Button>
//                 )}

//                 {app.status === "pending" && (
//                   <Tooltip title="Withdraw Application">
//                     <Button
//                       variant="outlined"
//                       color="error"
//                       size="small"
//                       startIcon={withdrawing === app._id ? <CircularProgress size={16} /> : <CancelIcon />}
//                       disabled={withdrawing === app._id}
//                       onClick={() => handleWithdraw(app._id)}
//                     >
//                       Withdraw
//                     </Button>
//                   </Tooltip>
//                 )}
//               </Stack>
//             </Stack>
//           </Card>
//         );
//       })}
//     </Stack>
//   );
// }


// src/components/seeker/ApplicationsTab.tsx
import { useState } from "react";
import {
  Box,
  Card,
  Typography,
  Stack,
  Chip,
  Button,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CancelIcon from "@mui/icons-material/Cancel";
import HistoryIcon from "@mui/icons-material/History";
import WorkIcon from "@mui/icons-material/Work";
import { alpha } from "@mui/material/styles";

import { IApplication, ApplicationStatus } from "../types";
import { STATUS_META, timeAgo, fmtSalary } from "../lib/seeker";

// ── Design Tokens (Consistent with Hero & other components) ─────────────
const GREEN = "#059669";
const GREEN_LIGHT = "#d1fae5";

interface ApplicationsTabProps {
  applications: IApplication[];
  loading: boolean;
  onWithdraw: (id: string) => void;
}

export default function ApplicationsTab({
  applications,
  loading,
  onWithdraw,
}: ApplicationsTabProps) {
  const [withdrawing, setWithdrawing] = useState<string | null>(null);

  const handleWithdraw = async (id: string) => {
    setWithdrawing(id);
    await onWithdraw(id);
    setWithdrawing(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress size={48} sx={{ color: GREEN }} />
      </Box>
    );
  }

  if (applications.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 10 }}>
        <WorkIcon sx={{ fontSize: 68, color: "#94a3b8", mb: 3 }} />
        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
          No applications yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Start applying to jobs to track them here.
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      {applications.map((app) => {
        const meta = STATUS_META[app.status];

        return (
          <Card 
            key={app._id} 
            sx={{ 
              p: 4, 
              borderRadius: 3.5,
              border: "1px solid #e2e8f0",
              transition: "all 0.2s ease",
              "&:hover": {
                boxShadow: "0 10px 30px rgba(5, 150, 105, 0.1)",
                borderColor: alpha(GREEN, 0.3),
              }
            }}
          >
            <Stack direction={{ xs: "column", sm: "row" }} spacing={4} alignItems={{ sm: "flex-start" }}>
              <Box sx={{ flex: 1 }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1.5 }}>
                  <Typography variant="h6" fontWeight={700} color="#0f172a">
                    {app.job.title}
                  </Typography>
                  <Chip
                    label={meta.label}
                    color={meta.color}
                    size="small"
                    icon={meta.icon}
                    sx={{
                      fontWeight: 600,
                      ...(meta.color === "success" && { bgcolor: GREEN_LIGHT, color: GREEN }),
                    }}
                  />
                </Stack>

                <Typography variant="body1" color="text.secondary" sx={{ mb: 0.5 }}>
                  {app.job.company} • {app.job.location}
                </Typography>

                {(app.job.salaryMin || app.job.salaryMax) && (
                  <Typography variant="body2" color={GREEN} fontWeight={600}>
                    {fmtSalary(app.job.salaryMin)} – {fmtSalary(app.job.salaryMax)}
                  </Typography>
                )}

                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                  Applied {timeAgo(app.createdAt)}
                </Typography>

                {/* Status History */}
                {app.statusHistory && app.statusHistory.length > 1 && (
                  <Box sx={{ mt: 4 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                      <HistoryIcon sx={{ fontSize: 18, color: "#64748b" }} />
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          textTransform: "uppercase", 
                          letterSpacing: 1.2, 
                          fontWeight: 600,
                          color: "#64748b" 
                        }}
                      >
                        Application Timeline
                      </Typography>
                    </Stack>

                    <Stack spacing={2.5}>
                      {app.statusHistory.map((history, i) => (
                        <Box key={i} sx={{ display: "flex", gap: 2.5 }}>
                          <Box
                            sx={{
                              width: 14,
                              height: 14,
                              borderRadius: "50%",
                              bgcolor: i === app.statusHistory.length - 1 ? GREEN : alpha("#cbd5e1", 0.6),
                              mt: "3px",
                              flexShrink: 0,
                            }}
                          />
                          <Box>
                            <Chip
                              size="small"
                              label={STATUS_META[history.status]?.label || history.status}
                              color={STATUS_META[history.status]?.color || "default"}
                              sx={{
                                ...(STATUS_META[history.status]?.color === "success" && {
                                  bgcolor: GREEN_LIGHT,
                                  color: GREEN,
                                }),
                              }}
                            />
                            <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                              {timeAgo(history.changedAt)}
                            </Typography>
                            {history.note && (
                              <Typography variant="body2" sx={{ mt: 0.5, color: "#475569" }}>
                                {history.note}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}

                {app.recruiterNotes && (
                  <Box 
                    sx={{ 
                      mt: 3, 
                      p: 3, 
                      bgcolor: GREEN_LIGHT, 
                      borderLeft: `4px solid ${GREEN}`, 
                      borderRadius: 2 
                    }}
                  >
                    <Typography variant="caption" color={GREEN} fontWeight={600}>
                      Recruiter Note:
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {app.recruiterNotes}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Stack spacing={1.5} alignItems={{ xs: "flex-start", sm: "flex-end" }}>
                {app.resumeUrl && (
                  <Button
                    variant="outlined"
                    size="small"
                    endIcon={<OpenInNewIcon />}
                    href={app.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    sx={{ borderColor: GREEN, color: GREEN }}
                  >
                    View Resume
                  </Button>
                )}

                {app.status === "pending" && (
                  <Tooltip title="Withdraw Application">
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={withdrawing === app._id ? <CircularProgress size={16} /> : <CancelIcon />}
                      disabled={withdrawing === app._id}
                      onClick={() => handleWithdraw(app._id)}
                    >
                      Withdraw
                    </Button>
                  </Tooltip>
                )}
              </Stack>
            </Stack>
          </Card>
        );
      })}
    </Stack>
  );
}