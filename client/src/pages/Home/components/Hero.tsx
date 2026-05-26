

import { Box, Container, Typography, Button, Stack, Chip, Grid } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import { alpha } from "@mui/material/styles";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import LanguageIcon from "@mui/icons-material/Language";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import bgimg from "../../../assets/bgimg.jpg";

// ── Design tokens ─────────────────────────────────────────────────────────────
const GREEN       = "#059669"; // Emerald-600 — primary
const GREEN_DARK  = "#047857"; // Emerald-700
const GREEN_LIGHT = "#d1fae5"; // Emerald-100
const BLUE        = "#2563eb"; // Blue-600 — accent
const BLUE_DARK   = "#1d4ed8"; // Blue-700
const BLUE_LIGHT  = "#dbeafe"; // Blue-100

const stats = [
  { value: "140+", label: "Countries",            icon: <LanguageIcon />,         color: BLUE,  bg: BLUE_LIGHT  },
  { value: "2.4M", label: "Verified Candidates",  icon: <PeopleOutlineIcon />,    color: GREEN, bg: GREEN_LIGHT },
  { value: "18k",  label: "Active Employers",     icon: <WorkOutlineIcon />,      color: BLUE,  bg: BLUE_LIGHT  },
  { value: "97%",  label: "Match Accuracy",       icon: <VerifiedOutlinedIcon />, color: GREEN, bg: GREEN_LIGHT },
];

export function Hero() {
  return (
    <Box sx={{ bgcolor: "#ffffff", position: "relative", overflow: "hidden" }}>

      {/* ── Single background image strip ───────────────────────────────────── */}
      <Box sx={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: { xs: 300, md: 460 },
        zIndex: 0,
        overflow: "hidden",
      }}>
        <Box
          component="img"
          src={bgimg}
          alt=""
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 30%",
            display: "block",
          }}
        />
        {/* Gradient fade — visible at top, fades to white at bottom */}
        <Box sx={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.50) 55%, rgba(255,255,255,1) 100%)",
        }} />
      </Box>

      {/* ── Dot grid overlay ─────────────────────────────────────────────────── */}
      <Box sx={{
        position: "absolute", inset: 0, zIndex: 1,
        backgroundImage: `radial-gradient(circle, ${alpha(GREEN, 0.18)} 1px, transparent 1px)`,
        backgroundSize: "28px 28px",
        opacity: 0.22,
        pointerEvents: "none",
      }} />

      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 2,
          textAlign: "center", 
          pt: { xs: 10, md: 16 },
          pb: { xs: 6, md: 10 },
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >

          {/* Headline */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: 40, sm: 56, md: 76 },
              lineHeight: 1.06,
              mb: 3,
              color: "#0f172a",
              fontWeight: 800,
              letterSpacing: "-0.03em",
            }}
          >
            The future of{" "}
            <Box
              component="span"
              sx={{
                background: `linear-gradient(135deg, ${GREEN} 0%, ${BLUE} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              global hiring
            </Box>
          </Typography>

          {/* Subhead */}
          <Typography
            sx={{
              maxWidth: 600,
              mx: "auto",
              mb: 6,
              fontWeight: 400,
              lineHeight: 1.75,
              fontSize: { xs: 16, md: 18.5 },
              color: "#00050b",
            }}
          >
            Connect with exceptional talent across 140+ countries. From executive strategy in Berlin
            to construction logistics in Dubai — matched by AI, verified by humans.
          </Typography>

          {/* CTAs */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
            sx={{ mb: 3 }}
          >
            <Button
              variant="contained"
              size="large"
              component={RouterLink}
              to="/signin"
              endIcon={<ArrowForwardIcon />}
              sx={{
                py: 1.75, px: 5, fontSize: 16, fontWeight: 700,
                background: `linear-gradient(135deg, ${GREEN} 0%, ${GREEN_DARK} 100%)`,
                boxShadow: `0 4px 22px ${alpha(GREEN, 0.38)}`,
                borderRadius: 2.5, color: "#ffffff",
                "&:hover": {
                  background: `linear-gradient(135deg, ${GREEN_DARK} 0%, #065f46 100%)`,
                  boxShadow: `0 8px 32px ${alpha(GREEN, 0.48)}`,
                  transform: "translateY(-1px)",
                },
                transition: "all 0.2s ease",
              }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={RouterLink}
              to="/jobs"
              sx={{
                py: 1.75, px: 5, fontSize: 16, fontWeight: 600,
                color: BLUE, borderColor: alpha(BLUE, 0.4), borderRadius: 2.5, bgcolor: "#ffffff",
                "&:hover": { borderColor: BLUE, bgcolor: BLUE_LIGHT, color: BLUE_DARK },
                transition: "all 0.2s ease",
              }}
            >
              Browse Jobs
            </Button>
          </Stack> 
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.22 }}
        >
          <Grid container spacing={2.5} sx={{ mt: { xs: 8, md: 12 } }}>
            {stats.map((s) => (
              <Grid item xs={6} md={3} key={s.label}>
                <Box
                  sx={{
                    py: 3.5, px: 2, borderRadius: 3, textAlign: "center",
                    bgcolor: "#ffffff", border: "1px solid #e2e8f0",
                    boxShadow: "0 2px 10px rgba(15,23,42,0.05)",
                    transition: "all 0.25s ease",
                    "&:hover": {
                      borderColor: alpha(s.color, 0.45),
                      boxShadow: `0 8px 28px ${alpha(s.color, 0.12)}`,
                      transform: "translateY(-3px)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 44, height: 44, borderRadius: 2,
                      bgcolor: s.bg, color: s.color,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      mx: "auto", mb: 1.5, "& svg": { fontSize: 22 },
                    }}
                  >
                    {s.icon}
                  </Box>
                  <Typography
                    sx={{
                      fontSize: { xs: 26, md: 34 }, fontWeight: 800,
                      color: "#0f172a", lineHeight: 1.1, letterSpacing: "-0.02em",
                    }}
                  >
                    {s.value}
                  </Typography>
                  <Typography sx={{ color: "#94a3b8", fontSize: 13, mt: 0.5, fontWeight: 500 }}>
                    {s.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      <Box
        sx={{
          height: 1,
          background: "linear-gradient(90deg, transparent, #e2e8f0 20%, #e2e8f0 80%, transparent)",
          mt: 2,
        }}
      />
    </Box>
  );
}