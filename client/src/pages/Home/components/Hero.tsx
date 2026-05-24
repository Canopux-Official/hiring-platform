import React from "react";
import { Box, Container, Typography, Button, Stack, Chip, Card, Grid } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import { alpha } from "@mui/material/styles";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

const stats = [
  { value: "140+", label: "Countries" },
  { value: "2.4M", label: "Verified candidates" },
  { value: "18k", label: "Active employers" },
  { value: "97%", label: "Match accuracy" },
];

export function Hero() {
  return (
    <Box sx={{ position: "relative", overflow: "hidden", pt: { xs: 8, md: 14 }, pb: { xs: 10, md: 16 } }}>
      <Box sx={{
        position: "absolute", inset: 0, zIndex: 0,
        background: `radial-gradient(circle at 20% 10%, ${alpha("#34d39e", 0.18)}, transparent 50%),
                     radial-gradient(circle at 80% 60%, ${alpha("#7c9cff", 0.12)}, transparent 50%)`,
      }} />
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Chip
            icon={<AutoAwesomeIcon sx={{ fontSize: 16 }} />}
            label="AI-powered global hiring"
            sx={{ mb: 3, bgcolor: alpha("#34d39e", 0.12), color: "primary.main", border: `1px solid ${alpha("#34d39e", 0.3)}` }}
          />
          <Typography variant="h1" sx={{ fontSize: { xs: 44, md: 76 }, lineHeight: 1.05, mb: 3 }}>
            The future of <br />
            <Box component="span" sx={{
              background: "linear-gradient(135deg, #34d39e, #7c9cff)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              global hiring
            </Box>
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 720, mx: "auto", mb: 5, fontWeight: 400, lineHeight: 1.6 }}>
            Connect with exceptional talent across 140+ countries. From executive strategy in Berlin to construction logistics in Dubai — matched by AI, verified by humans.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
            <Button variant="contained" size="large" component={RouterLink} to="/signin" sx={{ py: 1.5, px: 4, fontSize: 16 }}>
              Get Started Free
            </Button>
            <Button variant="outlined" size="large" component={RouterLink} to="/jobs" sx={{ py: 1.5, px: 4, fontSize: 16, borderColor: alpha("#ffffff", 0.2) }}>
              Browse Jobs
            </Button>
          </Stack>
        </motion.div>

        {/* Stats */}
        <Grid container spacing={3} sx={{ mt: 8 }}>
          {stats.map((s) => (
            <Grid item xs={6} md={3} key={s.label}>
              <Card sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="h3" sx={{ color: "primary.main", fontWeight: 800 }}>{s.value}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{s.label}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
