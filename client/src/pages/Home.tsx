import { Box, Container, Typography, Button, Stack, Chip, Card, CardContent, Grid, Avatar } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import { alpha } from "@mui/material/styles";
import BoltIcon from "@mui/icons-material/Bolt";
import VerifiedIcon from "@mui/icons-material/Verified";
import PublicIcon from "@mui/icons-material/Public";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import HandshakeIcon from "@mui/icons-material/Handshake";

const stats = [
  { value: "140+", label: "Countries" },
  { value: "2.4M", label: "Verified candidates" },
  { value: "18k", label: "Active employers" },
  { value: "97%", label: "Match accuracy" },
];

const features = [
  { icon: <AutoAwesomeIcon />, title: "AI Match Engine", desc: "Semantic ranking across skills, culture, location and ambition — refreshed live." },
  { icon: <VerifiedIcon />, title: "Human Verified", desc: "Every employer and senior profile is checked by our trust team." },
  { icon: <PublicIcon />, title: "Truly Global", desc: "From Berlin engineering to Dubai hospitality and Mumbai logistics." },
  { icon: <BoltIcon />, title: "Same-day Pipelines", desc: "Post a role in the morning, shortlist by afternoon." },
  { icon: <TrendingUpIcon />, title: "Insights that decide", desc: "Real benchmarks on salary, time-to-hire and offer acceptance." },
  { icon: <HandshakeIcon />, title: "Built for every collar", desc: "Executives, engineers, helpers, drivers, freelancers — one platform." },
];

const testimonials = [
  { name: "Lena Park", role: "Head of Talent, FlowState AI", quote: "We filled three staff engineering seats in 11 days. HireSphere's match scores were genuinely accurate.", avatar: "LP" },
  { name: "Rohan Mehta", role: "COO, RapidMile", quote: "Hiring 200 riders used to take a month. Now it's two weeks and the retention is up.", avatar: "RM" },
  { name: "Amélie Roux", role: "Founder, Northwave Studio", quote: "The creative pool is curated. Every shortlist felt hand-picked.", avatar: "AR" },
];

export default function Home() {
  return (
    <Box>
      {/* HERO */}
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

      {/* Features */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography variant="overline" color="primary.main" sx={{ letterSpacing: "0.2em" }}>What's inside</Typography>
          <Typography variant="h2" sx={{ fontSize: { xs: 32, md: 48 }, mt: 1, mb: 2 }}>One platform. Every hire.</Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
            HireSphere brings every kind of work — from boardroom to warehouse floor — into one cohesive, intelligent hiring experience.
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

      {/* Testimonials */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography variant="overline" color="primary.main" sx={{ letterSpacing: "0.2em" }}>Trusted by teams</Typography>
          <Typography variant="h2" sx={{ fontSize: { xs: 32, md: 44 }, mt: 1 }}>Real stories. Real hires.</Typography>
        </Box>
        <Grid container spacing={3}>
          {testimonials.map((t) => (
            <Grid item xs={12} md={4} key={t.name}>
              <Card sx={{ p: 3, height: "100%" }}>
                <CardContent sx={{ p: 0 }}>
                  <Typography sx={{ mb: 3, lineHeight: 1.7 }}>"{t.quote}"</Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: "primary.main", color: "primary.contrastText", fontWeight: 700 }}>{t.avatar}</Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{t.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{t.role}</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Card sx={{
          p: { xs: 5, md: 8 }, textAlign: "center",
          background: `linear-gradient(135deg, ${alpha("#34d39e", 0.15)}, ${alpha("#7c9cff", 0.1)})`,
          border: `1px solid ${alpha("#34d39e", 0.3)}`,
        }}>
          <Typography variant="h2" sx={{ fontSize: { xs: 32, md: 44 }, mb: 2 }}>Ready to hire smarter?</Typography>
          <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: "auto" }}>
            Join thousands of companies hiring across every category, every continent.
          </Typography>
          <Button variant="contained" size="large" component={RouterLink} to="/signin" sx={{ py: 1.5, px: 5 }}>
            Start hiring today
          </Button>
        </Card>
      </Container>
    </Box>
  );
}
