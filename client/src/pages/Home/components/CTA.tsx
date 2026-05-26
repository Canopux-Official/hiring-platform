import React from "react";
import { Box, Container, Typography, Button, Stack } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import { alpha } from "@mui/material/styles";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const perks = ["No credit card required", "Free forever for job seekers", "Cancel anytime"];

// ── Hiring-relevant images shown as floating cards behind the CTA ─────────────
const bgPhotos = [
  {
    src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=480&q=80&auto=format&fit=crop",
    alt: "Team meeting",
    sx: { width: { xs: 0, md: 220 }, height: 150, top: "12%", left: "-6%", transform: "rotate(-5deg)" },
  },
  {
    src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=480&q=80&auto=format&fit=crop",
    alt: "Professional interview",
    sx: { width: { xs: 0, md: 190 }, height: 230, top: "-8%", left: "6%", transform: "rotate(3deg)" },
  },
  {
    src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=480&q=80&auto=format&fit=crop",
    alt: "Office collaboration",
    sx: { width: { xs: 0, md: 210 }, height: 145, bottom: "10%", left: "-4%", transform: "rotate(4deg)" },
  },
  {
    src: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=480&q=80&auto=format&fit=crop",
    alt: "Hiring discussion",
    sx: { width: { xs: 0, md: 215 }, height: 155, top: "10%", right: "-5%", transform: "rotate(5deg)" },
  },
  {
    src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=480&q=80&auto=format&fit=crop",
    alt: "Diverse global team",
    sx: { width: { xs: 0, md: 195 }, height: 225, top: "-6%", right: "6%", transform: "rotate(-3deg)" },
  },
  {
    src: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=480&q=80&auto=format&fit=crop",
    alt: "Modern workplace",
    sx: { width: { xs: 0, md: 205 }, height: 140, bottom: "8%", right: "-3%", transform: "rotate(-4.5deg)" },
  },
];

export function CTA() {
  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #222123 0%, #15231e 50%, #0a0b09 100%)",
        py: { xs: 10, md: 14 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── Background photo collage ──────────────────────────────────────────── */}
      {bgPhotos.map((photo, i) => (
        <Box
          key={i}
          sx={{
            position: "absolute",
            ...photo.sx,
            borderRadius: 3,
            overflow: "hidden",
            opacity: 0.28,
            pointerEvents: "none",
            display: { xs: "none", md: "block" },
            boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
            border: "2px solid rgba(255,255,255,0.15)",
          }}
        >
          <Box
            component="img"
            src={photo.src}
            alt={photo.alt}
            sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </Box>
      ))}

      {/* ── Dot overlay ───────────────────────────────────────────────────────── */}
      <Box sx={{
        position: "absolute", inset: 0, zIndex: 1,
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)",
        backgroundSize: "24px 24px", pointerEvents: "none",
      }} />

      {/* ── Glow orbs ─────────────────────────────────────────────────────────── */}
      <Box sx={{
        position: "absolute", width: 500, height: 500, borderRadius: "50%",
        top: "-30%", right: "-8%", zIndex: 1,
        background: "radial-gradient(circle, rgba(255,255,255,0.09) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <Box sx={{
        position: "absolute", width: 380, height: 380, borderRadius: "50%",
        bottom: "-20%", left: "-5%", zIndex: 1,
        background: "radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* ── Main content ──────────────────────────────────────────────────────── */}
      <Container maxWidth="md" sx={{ position: "relative", zIndex: 2, textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Eyebrow label */}
          <Box
            sx={{
              display: "inline-block",
              mb: 3,
              px: 2.5, py: 0.75,
              borderRadius: 999,
              bgcolor: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.22)",
              backdropFilter: "blur(8px)",
            }}
          >
            <Typography sx={{ color: "#ffffff", fontSize: 12.5, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}>
              Get Started Today
            </Typography>
          </Box>

          {/* Headline */}
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: 34, md: 58 },
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              mb: 2.5,
              textShadow: "0 2px 20px rgba(0,0,0,0.25)",
            }}
          >
            Ready to hire smarter?
          </Typography>

          {/* Subtext */}
          <Typography
            sx={{
              color: alpha("#ffffff", 0.85),
              mb: 5,
              maxWidth: 480,
              mx: "auto",
              fontSize: { xs: 16, md: 18 },
              lineHeight: 1.75,
            }}
          >
            Join thousands of companies hiring across every category, every continent —
            with AI that actually works.
          </Typography>

          {/* CTA buttons */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
            sx={{ mb: 5 }}
          >
            <Button
              variant="contained"
              size="large"
              component={RouterLink}
              to="/signin"
              endIcon={<ArrowForwardIcon />}
              sx={{
                py: 1.9, px: 5.5, fontSize: 16.5, fontWeight: 700,
                bgcolor: "#ffffff", color: "white", borderRadius: 2.5,
                boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
                "&:hover": {
                  bgcolor: "#ede9fe",
                  boxShadow: "0 10px 36px rgba(0,0,0,0.28)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.2s ease",
              }}
            >
              Start Hiring Today
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={RouterLink}
              to="/jobs"
              sx={{
                py: 1.9, px: 5.5, fontSize: 16.5, fontWeight: 600,
                color: "#ffffff",
                borderColor: alpha("#ffffff", 0.5),
                borderRadius: 2.5,
                backdropFilter: "blur(6px)",
                bgcolor: "rgba(255,255,255,0.06)",
                "&:hover": {
                  borderColor: "#ffffff",
                  bgcolor: alpha("#ffffff", 0.14),
                },
                transition: "all 0.2s ease",
              }}
            >
              Browse Jobs
            </Button>
          </Stack>

          {/* Perks row */}
          
        </motion.div>
      </Container>
    </Box>
  );
}