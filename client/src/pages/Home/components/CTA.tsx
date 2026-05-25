import React from "react";
import { Box, Container, Typography, Button, Stack } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import { alpha } from "@mui/material/styles";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const perks = ["No credit card required", "Free forever for job seekers", "Cancel anytime"];

export function CTA() {
  return (
    <Box sx={{ background: "linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #a78bfa 100%)", py: { xs: 10, md: 14 }, position: "relative", overflow: "hidden" }}>
      {/* Dot overlay */}
      <Box sx={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)", backgroundSize: "24px 24px", pointerEvents: "none" }} />
      {/* Glow orbs */}
      <Box sx={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", top: "-30%", right: "-8%", background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
      <Box sx={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", bottom: "-20%", left: "-5%", background: "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <motion.div initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <Typography variant="h2" sx={{ fontSize: { xs: 32, md: 54 }, fontWeight: 800, color: "#ffffff", letterSpacing: "-0.03em", lineHeight: 1.1, mb: 2.5 }}>
            Ready to hire smarter?
          </Typography>
          <Typography sx={{ color: alpha("#ffffff", 0.8), mb: 5, maxWidth: 500, mx: "auto", fontSize: 17.5, lineHeight: 1.7 }}>
            Join thousands of companies hiring across every category, every continent — with AI that actually works.
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center" sx={{ mb: 5 }}>
            <Button
              variant="contained" size="large" component={RouterLink} to="/signin" endIcon={<ArrowForwardIcon />}
              sx={{
                py: 1.9, px: 5.5, fontSize: 16.5, fontWeight: 700,
                bgcolor: "#ffffff", color: "#7c3aed", borderRadius: 2.5,
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                "&:hover": { bgcolor: "#ede9fe", boxShadow: "0 8px 32px rgba(0,0,0,0.2)", transform: "translateY(-1px)" },
                transition: "all 0.2s ease",
              }}
            >
              Start Hiring Today
            </Button>
            <Button
              variant="outlined" size="large" component={RouterLink} to="/jobs"
              sx={{
                py: 1.9, px: 5.5, fontSize: 16.5, fontWeight: 600,
                color: "#ffffff", borderColor: alpha("#ffffff", 0.4), borderRadius: 2.5,
                "&:hover": { borderColor: "#ffffff", bgcolor: alpha("#ffffff", 0.1) },
                transition: "all 0.2s ease",
              }}
            >
              Browse Jobs
            </Button>
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 1.5, sm: 4 }} justifyContent="center" alignItems="center">
            {perks.map((p) => (
              <Stack key={p} direction="row" spacing={1} alignItems="center">
                <CheckCircleOutlineIcon sx={{ fontSize: 16, color: alpha("#ffffff", 0.7) }} />
                <Typography sx={{ color: alpha("#ffffff", 0.8), fontSize: 13.5, fontWeight: 500 }}>{p}</Typography>
              </Stack>
            ))}
          </Stack>
        </motion.div>
      </Container>
    </Box>
  );
}
