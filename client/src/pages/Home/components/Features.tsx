 

// import { Box, Container, Typography, Grid } from "@mui/material";
// import { motion } from "framer-motion";
// import { alpha } from "@mui/material/styles";
// import BoltIcon from "@mui/icons-material/Bolt";
// import VerifiedIcon from "@mui/icons-material/Verified";
// import PublicIcon from "@mui/icons-material/Public";
// import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
// import TrendingUpIcon from "@mui/icons-material/TrendingUp";
// import HandshakeIcon from "@mui/icons-material/Handshake";

// // ── Design tokens ─────────────────────────────────────────────────────────────
// const GREEN       = "#059669";
// const GREEN_DARK  = "#047857";
// const GREEN_LIGHT = "#d1fae5";
// const BLUE        = "#2563eb";
// const BLUE_DARK   = "#1d4ed8";
// const BLUE_LIGHT  = "#dbeafe";
// const TEAL        = "#0891b2"; // Cyan-600 — additional variety
// const TEAL_LIGHT  = "#cffafe";

// const features = [
//   {
//     icon: <AutoAwesomeIcon fontSize="inherit" />,
//     title: "AI Match Engine",
//     desc: "Semantic ranking across skills, culture, location and ambition — refreshed live.",
//     color: GREEN, bg: GREEN_LIGHT,
//   },
//   {
//     icon: <VerifiedIcon fontSize="inherit" />,
//     title: "Human Verified",
//     desc: "Every employer and senior profile is checked by our trust team before going live.",
//     color: BLUE, bg: BLUE_LIGHT,
//   },
//   {
//     icon: <PublicIcon fontSize="inherit" />,
//     title: "Truly Global",
//     desc: "From Berlin engineering to Dubai hospitality — one talent pool, every timezone.",
//     color: TEAL, bg: TEAL_LIGHT,
//   },
//   {
//     icon: <BoltIcon fontSize="inherit" />,
//     title: "Same-day Pipelines",
//     desc: "Post a role in the morning, shortlist by afternoon. Automation handles the rest.",
//     color: GREEN_DARK, bg: GREEN_LIGHT,
//   },
//   {
//     icon: <TrendingUpIcon fontSize="inherit" />,
//     title: "Insights that Decide",
//     desc: "Real benchmarks on salary, time-to-hire and offer acceptance.",
//     color: BLUE_DARK, bg: BLUE_LIGHT,
//   },
//   {
//     icon: <HandshakeIcon fontSize="inherit" />,
//     title: "Every Collar Welcome",
//     desc: "Executives, engineers, helpers, drivers, freelancers — one cohesive platform.",
//     color: TEAL, bg: TEAL_LIGHT,
//   },
// ];

// export function Features() {
//   return (
//     <Box sx={{ bgcolor: "#f8fafc", py: { xs: 10, md: 16 } }}>
//       <Container maxWidth="lg">
//         {/* Header */}
//         <Box sx={{ textAlign: "center", mb: { xs: 7, md: 10 } }}>
//           <motion.div
//             initial={{ opacity: 0, y: 18 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.5 }}
//           >
//             <Typography sx={{
//               fontSize: 12, fontWeight: 700, letterSpacing: "0.2em",
//               textTransform: "uppercase", color: GREEN, mb: 2,
//             }}>
//               What's Inside
//             </Typography>
//             <Typography variant="h2" sx={{
//               fontSize: { xs: 30, md: 48 }, fontWeight: 800,
//               color: "#0f172a", letterSpacing: "-0.025em", lineHeight: 1.15, mb: 2,
//             }}>
//               One platform.{" "}
//               <Box component="span" sx={{
//                 background: `linear-gradient(135deg, ${GREEN} 0%, ${BLUE} 100%)`,
//                 WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
//               }}>
//                 Every hire.
//               </Box>
//             </Typography>
//             <Typography sx={{ color: "#64748b", maxWidth: 540, mx: "auto", fontSize: 17, lineHeight: 1.7 }}>
//               RagasHire brings every kind of work — from boardroom to warehouse floor — into one
//               cohesive, intelligent hiring experience.
//             </Typography>
//           </motion.div>
//         </Box>

//         {/* Cards */}
//         <Grid container spacing={3}>
//           {features.map((f, i) => (
//             <Grid item xs={12} sm={6} md={4} key={f.title}>
//               <motion.div
//                 initial={{ opacity: 0, y: 22 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 0.42, delay: i * 0.07 }}
//                 style={{ height: "100%" }}
//               >
//                 <Box sx={{
//                   p: 3.5, height: "100%", borderRadius: 3,
//                   bgcolor: "#ffffff", border: "1px solid #e2e8f0",
//                   boxShadow: "0 1px 4px rgba(15,23,42,0.05)",
//                   transition: "all 0.22s ease",
//                   "&:hover": {
//                     borderColor: alpha(f.color, 0.45),
//                     boxShadow: `0 8px 28px ${alpha(f.color, 0.12)}`,
//                     transform: "translateY(-4px)",
//                   },
//                 }}>
//                   <Box sx={{
//                     width: 48, height: 48, borderRadius: 2, mb: 2.5, fontSize: 24,
//                     display: "flex", alignItems: "center", justifyContent: "center",
//                     bgcolor: f.bg, color: f.color,
//                   }}>
//                     {f.icon}
//                   </Box>
//                   <Typography variant="h6" sx={{ mb: 1, fontWeight: 700, color: "#0f172a", fontSize: 16 }}>
//                     {f.title}
//                   </Typography>
//                   <Typography sx={{ color: "#64748b", fontSize: 14.5, lineHeight: 1.7 }}>
//                     {f.desc}
//                   </Typography>
//                 </Box>
//               </motion.div>
//             </Grid>
//           ))}
//         </Grid>
//       </Container>
//     </Box>
//   );
// }

import { Box, Container, Typography, Grid } from "@mui/material";
import { motion } from "framer-motion";
import { alpha } from "@mui/material/styles";
import BoltIcon from "@mui/icons-material/Bolt";
import VerifiedIcon from "@mui/icons-material/Verified";
import PublicIcon from "@mui/icons-material/Public";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import HandshakeIcon from "@mui/icons-material/Handshake";

// ── Design tokens ─────────────────────────────────────────────────────────────
const GREEN       = "#059669";
const GREEN_DARK  = "#047857";
const GREEN_LIGHT = "#d1fae5";
const BLUE        = "#2563eb";
const BLUE_DARK   = "#1d4ed8";
const BLUE_LIGHT  = "#dbeafe";
const TEAL        = "#0891b2";
const TEAL_LIGHT  = "#cffafe";

// ── Feature data with matching Unsplash images ─────────────────────────────────
const features = [
  {
    icon: <AutoAwesomeIcon fontSize="inherit" />,
    title: "AI Match Engine",
    desc: "Semantic ranking across skills, culture, location and ambition — refreshed live.",
    color: GREEN, bg: GREEN_LIGHT,
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80&auto=format&fit=crop",
    imageAlt: "AI interface visualization",
  },
  {
    icon: <VerifiedIcon fontSize="inherit" />,
    title: "Human Verified",
    desc: "Every employer and senior profile is checked by our trust team before going live.",
    color: BLUE, bg: BLUE_LIGHT,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80&auto=format&fit=crop",
    imageAlt: "Professional interview",
  },
  {
    icon: <PublicIcon fontSize="inherit" />,
    title: "Truly Global",
    desc: "From Berlin engineering to Dubai hospitality — one talent pool, every timezone.",
    color: TEAL, bg: TEAL_LIGHT,
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80&auto=format&fit=crop",
    imageAlt: "Diverse global team",
  },
  {
    icon: <BoltIcon fontSize="inherit" />,
    title: "Same-day Pipelines",
    desc: "Post a role in the morning, shortlist by afternoon. Automation handles the rest.",
    color: GREEN_DARK, bg: GREEN_LIGHT,
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&q=80&auto=format&fit=crop",
    imageAlt: "Fast-paced office work",
  },
  {
    icon: <TrendingUpIcon fontSize="inherit" />,
    title: "Insights that Decide",
    desc: "Real benchmarks on salary, time-to-hire and offer acceptance.",
    color: BLUE_DARK, bg: BLUE_LIGHT,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80&auto=format&fit=crop",
    imageAlt: "Analytics dashboard",
  },
  {
    icon: <HandshakeIcon fontSize="inherit" />,
    title: "Every Collar Welcome",
    desc: "Executives, engineers, helpers, drivers, freelancers — one cohesive platform.",
    color: TEAL, bg: TEAL_LIGHT,
    image: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=600&q=80&auto=format&fit=crop",
    imageAlt: "Diverse workforce collaboration",
  },
];

export function Features() {
  return (
    <Box sx={{ bgcolor: "#f8fafc", py: { xs: 10, md: 16 } }}>
      <Container maxWidth="lg">

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <Box sx={{ textAlign: "center", mb: { xs: 7, md: 10 } }}>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Typography sx={{
              fontSize: 12, fontWeight: 700, letterSpacing: "0.2em",
              textTransform: "uppercase", color: GREEN, mb: 2,
            }}>
              What's Inside
            </Typography>
            <Typography variant="h2" sx={{
              fontSize: { xs: 30, md: 48 }, fontWeight: 800,
              color: "#0f172a", letterSpacing: "-0.025em", lineHeight: 1.15, mb: 2,
            }}>
              One platform.{" "}
              <Box component="span" sx={{
                background: `linear-gradient(135deg, ${GREEN} 0%, ${BLUE} 100%)`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
                Every hire.
              </Box>
            </Typography>
            <Typography sx={{ color: "#64748b", maxWidth: 540, mx: "auto", fontSize: 17, lineHeight: 1.7 }}>
              RagasHire brings every kind of work — from boardroom to warehouse floor — into one
              cohesive, intelligent hiring experience.
            </Typography>
          </motion.div>
        </Box>

        {/* ── Feature Cards with Images ───────────────────────────────────────── */}
        <Grid container spacing={3}>
          {features.map((f, i) => (
            <Grid item xs={12} sm={6} md={4} key={f.title}>
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.42, delay: i * 0.07 }}
                style={{ height: "100%" }}
              >
                <Box
                  sx={{
                    height: "100%",
                    borderRadius: 3,
                    bgcolor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 1px 4px rgba(15,23,42,0.05)",
                    overflow: "hidden",
                    transition: "all 0.22s ease",
                    "&:hover": {
                      borderColor: alpha(f.color, 0.45),
                      boxShadow: `0 8px 28px ${alpha(f.color, 0.14)}`,
                      transform: "translateY(-4px)",
                    },
                    "&:hover .feature-image": {
                      transform: "scale(1.04)",
                    },
                  }}
                >
                  {/* Image area */}
                  <Box sx={{
                    position: "relative",
                    height: 170,
                    overflow: "hidden",
                    bgcolor: "#f1f5f9",
                  }}>
                    <Box
                      className="feature-image"
                      component="img"
                      src={f.image}
                      alt={f.imageAlt}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                        display: "block",
                        transition: "transform 0.45s ease",
                      }}
                    />
                    {/* Subtle color tint at bottom of image */}
                    <Box sx={{
                      position: "absolute", inset: 0,
                      background: `linear-gradient(to bottom, transparent 40%, ${alpha(f.color, 0.18)} 100%)`,
                    }} />
                    {/* Icon badge over image */}
                    <Box sx={{
                      position: "absolute",
                      bottom: -20,
                      left: 24,
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      bgcolor: "#ffffff",
                      border: `2px solid ${alpha(f.color, 0.2)}`,
                      boxShadow: `0 4px 14px ${alpha(f.color, 0.22)}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 22,
                      color: f.color,
                      zIndex: 1,
                    }}>
                      {f.icon}
                    </Box>
                  </Box>

                  {/* Text content */}
                  <Box sx={{ pt: 4.5, pb: 3, px: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{ mb: 1, fontWeight: 700, color: "#0f172a", fontSize: 16 }}
                    >
                      {f.title}
                    </Typography>
                    <Typography sx={{ color: "#64748b", fontSize: 14.5, lineHeight: 1.7 }}>
                      {f.desc}
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* ── Bottom image strip — wide hiring scene ──────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <Box sx={{
            mt: { xs: 8, md: 12 },
            borderRadius: 4,
            overflow: "hidden",
            position: "relative",
            height: { xs: 200, md: 320 },
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 24px rgba(15,23,42,0.08)",
          }}>
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1600&q=85&auto=format&fit=crop"
              alt="Team collaboration in a modern office"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center 35%",
                display: "block",
              }}
            />
            {/* Overlay with text */}
            <Box sx={{
              position: "absolute", inset: 0,
              background: `linear-gradient(135deg, ${alpha("#0f172a", 0.72)} 0%, ${alpha(GREEN_DARK, 0.55)} 100%)`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              px: 3,
            }}>
              <Typography sx={{
                color: "#ffffff",
                fontSize: { xs: 22, md: 36 },
                fontWeight: 800,
                letterSpacing: "-0.025em",
                lineHeight: 1.2,
                mb: 1.5,
              }}>
                Hiring that works for everyone.
              </Typography>
              <Typography sx={{
                color: "rgba(255,255,255,0.75)",
                fontSize: { xs: 14, md: 17 },
                maxWidth: 520,
                lineHeight: 1.65,
              }}>
                Whether you're scaling a startup or staffing a global enterprise,
                RagasHire adapts to your pace.
              </Typography>
            </Box>
          </Box>
        </motion.div>

      </Container>
    </Box>
  );
}
