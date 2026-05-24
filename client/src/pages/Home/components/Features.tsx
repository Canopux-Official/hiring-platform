import React from "react";
import { Box, Container, Typography, Card, Grid } from "@mui/material";
import { motion } from "framer-motion";
import { alpha } from "@mui/material/styles";
import BoltIcon from "@mui/icons-material/Bolt";
import VerifiedIcon from "@mui/icons-material/Verified";
import PublicIcon from "@mui/icons-material/Public";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import HandshakeIcon from "@mui/icons-material/Handshake";

const features = [
  { icon: <AutoAwesomeIcon />, title: "AI Match Engine", desc: "Semantic ranking across skills, culture, location and ambition — refreshed live." },
  { icon: <VerifiedIcon />, title: "Human Verified", desc: "Every employer and senior profile is checked by our trust team." },
  { icon: <PublicIcon />, title: "Truly Global", desc: "From Berlin engineering to Dubai hospitality and Mumbai logistics." },
  { icon: <BoltIcon />, title: "Same-day Pipelines", desc: "Post a role in the morning, shortlist by afternoon." },
  { icon: <TrendingUpIcon />, title: "Insights that decide", desc: "Real benchmarks on salary, time-to-hire and offer acceptance." },
  { icon: <HandshakeIcon />, title: "Built for every collar", desc: "Executives, engineers, helpers, drivers, freelancers — one platform." },
];

export function Features() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
      <Box sx={{ textAlign: "center", mb: 8 }}>
        <Typography variant="overline" color="primary.main" sx={{ letterSpacing: "0.2em" }}>What's inside</Typography>
        <Typography variant="h2" sx={{ fontSize: { xs: 32, md: 48 }, mt: 1, mb: 2 }}>One platform. Every hire.</Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
          RagasHire brings every kind of work — from boardroom to warehouse floor — into one cohesive, intelligent hiring experience.
        </Typography>
      </Box>
      <Grid container spacing={3}>
        {features.map((f, i) => (
          <Grid item xs={12} sm={6} md={4} key={f.title}>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.05 }}>
              <Card sx={{ p: 3, height: "100%", transition: "transform 0.3s, border-color 0.3s",
                "&:hover": { transform: "translateY(-4px)", borderColor: alpha("#34d39e", 0.4) } }}>
                <Box sx={{
                  width: 48, height: 48, borderRadius: 2, mb: 2,
                  bgcolor: alpha("#34d39e", 0.12), color: "primary.main",
                  display: "grid", placeItems: "center",
                }}>{f.icon}</Box>
                <Typography variant="h6" sx={{ mb: 1 }}>{f.title}</Typography>
                <Typography variant="body2" color="text.secondary">{f.desc}</Typography>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
