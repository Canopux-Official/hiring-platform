import React from "react";
import { Box, Container, Typography, Grid } from "@mui/material";
import { motion } from "framer-motion";
import { alpha } from "@mui/material/styles";
import BoltIcon from "@mui/icons-material/Bolt";
import VerifiedIcon from "@mui/icons-material/Verified";
import PublicIcon from "@mui/icons-material/Public";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import HandshakeIcon from "@mui/icons-material/Handshake";

const features = [
  { icon: <AutoAwesomeIcon fontSize="inherit" />, title: "AI Match Engine",       desc: "Semantic ranking across skills, culture, location and ambition — refreshed live.",         color: "#7c3aed", bg: "#ede9fe" },
  { icon: <VerifiedIcon fontSize="inherit" />,    title: "Human Verified",        desc: "Every employer and senior profile is checked by our trust team before going live.",         color: "#0ea5e9", bg: "#e0f2fe" },
  { icon: <PublicIcon fontSize="inherit" />,      title: "Truly Global",          desc: "From Berlin engineering to Dubai hospitality — one talent pool, every timezone.",          color: "#8b5cf6", bg: "#ede9fe" },
  { icon: <BoltIcon fontSize="inherit" />,        title: "Same-day Pipelines",    desc: "Post a role in the morning, shortlist by afternoon. Automation handles the rest.",         color: "#f59e0b", bg: "#fef3c7" },
  { icon: <TrendingUpIcon fontSize="inherit" />,  title: "Insights that Decide",  desc: "Real benchmarks on salary, time-to-hire and offer acceptance.",                           color: "#10b981", bg: "#d1fae5" },
  { icon: <HandshakeIcon fontSize="inherit" />,   title: "Every Collar Welcome",  desc: "Executives, engineers, helpers, drivers, freelancers — one cohesive platform.",           color: "#ef4444", bg: "#fee2e2" },
];

export function Features() {
  return (
    <Box sx={{ bgcolor: "#f9fafb", py: { xs: 10, md: 16 } }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: { xs: 7, md: 10 } }}>
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#7c3aed", mb: 2 }}>
              What's Inside
            </Typography>
            <Typography variant="h2" sx={{ fontSize: { xs: 30, md: 48 }, fontWeight: 800, color: "#111827", letterSpacing: "-0.025em", lineHeight: 1.15, mb: 2 }}>
              One platform.{" "}
              <Box component="span" sx={{ background: "linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Every hire.
              </Box>
            </Typography>
            <Typography sx={{ color: "#6b7280", maxWidth: 540, mx: "auto", fontSize: 17, lineHeight: 1.7 }}>
              RagasHire brings every kind of work — from boardroom to warehouse floor — into one cohesive, intelligent hiring experience.
            </Typography>
          </motion.div>
        </Box>

        {/* Cards */}
        <Grid container spacing={3}>
          {features.map((f, i) => (
            <Grid item xs={12} sm={6} md={4} key={f.title}>
              <motion.div initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.42, delay: i * 0.07 }} style={{ height: "100%" }}>
                <Box sx={{
                  p: 3.5, height: "100%", borderRadius: 3,
                  bgcolor: "#ffffff", border: "1px solid #e5e7eb",
                  boxShadow: "0 1px 4px rgba(17,24,39,0.05)",
                  transition: "all 0.22s ease",
                  "&:hover": { borderColor: alpha(f.color, 0.4), boxShadow: `0 8px 28px ${alpha(f.color, 0.1)}`, transform: "translateY(-4px)" },
                }}>
                  <Box sx={{ width: 48, height: 48, borderRadius: 2, mb: 2.5, fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: f.bg, color: f.color }}>
                    {f.icon}
                  </Box>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 700, color: "#111827", fontSize: 16 }}>
                    {f.title}
                  </Typography>
                  <Typography sx={{ color: "#6b7280", fontSize: 14.5, lineHeight: 1.7 }}>
                    {f.desc}
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
