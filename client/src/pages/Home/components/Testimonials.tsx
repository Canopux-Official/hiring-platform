
import { Box, Container, Typography, Stack, Grid, Avatar } from "@mui/material";
import { motion } from "framer-motion";
import { alpha } from "@mui/material/styles";

// ── Design tokens ─────────────────────────────────────────────────────────────
const GREEN       = "#059669";
const GREEN_LIGHT = "#d1fae5";
const BLUE        = "#2563eb";
const BLUE_LIGHT  = "#dbeafe";
const TEAL        = "#0891b2";
const TEAL_LIGHT  = "#cffafe";

const testimonials = [
  {
    name: "Lena Park",
    role: "Head of Talent, FlowState AI",
    quote: "We filled three staff engineering seats in 11 days. PerfectHire's match scores were genuinely accurate — better than any ATS we've used.",
    avatar: "LP", color: GREEN, bg: GREEN_LIGHT, stars: 5,
  },
  {
    name: "Rohan Mehta",
    role: "COO, RapidMile",
    quote: "Hiring 200 riders used to take a month. Now it's two weeks and the retention is up. The pipeline automation is a game-changer.",
    avatar: "RM", color: BLUE, bg: BLUE_LIGHT, stars: 5,
  },
  {
    name: "Amélie Roux",
    role: "Founder, Northwave Studio",
    quote: "The creative pool is curated. Every shortlist felt hand-picked. I've never had such high-quality candidates in my first round.",
    avatar: "AR", color: TEAL, bg: TEAL_LIGHT, stars: 5,
  },
];

export function Testimonials() {
  return (
    <Box sx={{ bgcolor: "#ffffff", py: { xs: 10, md: 16 } }}>
      <Container maxWidth="lg">
        {/* Header */}
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
              Trusted by Teams
            </Typography>
            <Typography variant="h2" sx={{
              fontSize: { xs: 30, md: 48 }, fontWeight: 800,
              color: "#0f172a", letterSpacing: "-0.025em", lineHeight: 1.15,
            }}>
              Real stories.{" "}
              <Box component="span" sx={{
                background: `linear-gradient(135deg, ${GREEN} 0%, ${BLUE} 100%)`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
                Real hires.
              </Box>
            </Typography>
          </motion.div>
        </Box>

        {/* Cards */}
        <Grid container spacing={3}>
          {testimonials.map((t, i) => (
            <Grid item xs={12} md={4} key={t.name}>
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.42, delay: i * 0.1 }}
                style={{ height: "100%" }}
              >
                <Box sx={{
                  p: 4, height: "100%", borderRadius: 3,
                  bgcolor: "#ffffff", border: "1px solid #e2e8f0",
                  boxShadow: "0 2px 10px rgba(15,23,42,0.05)",
                  display: "flex", flexDirection: "column", gap: 2.5,
                  transition: "all 0.22s ease",
                  "&:hover": {
                    borderColor: alpha(t.color, 0.4),
                    boxShadow: `0 10px 32px ${alpha(t.color, 0.12)}`,
                    transform: "translateY(-4px)",
                  },
                }}>
                  {/* Stars */}
                  <Stack direction="row" spacing={0.5}>
                    {Array.from({ length: t.stars }).map((_, idx) => (
                      <Box key={idx} sx={{ color: "#f59e0b", fontSize: 18, lineHeight: 1 }}>★</Box>
                    ))}
                  </Stack>

                  {/* Quote */}
                  <Typography sx={{
                    color: "#374151", lineHeight: 1.75,
                    fontSize: 15, flexGrow: 1, fontStyle: "italic",
                  }}>
                    "{t.quote}"
                  </Typography>

                  <Box sx={{ height: 1, bgcolor: "#f1f5f9" }} />

                  {/* Author */}
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{
                      width: 44, height: 44,
                      background: `linear-gradient(135deg, ${t.color}, ${alpha(t.color, 0.65)})`,
                      color: "#ffffff", fontWeight: 700, fontSize: 14, flexShrink: 0,
                    }}>
                      {t.avatar}
                    </Avatar>
                    <Box>
                      <Typography sx={{ fontWeight: 700, color: "#0f172a", fontSize: 14 }}>
                        {t.name}
                      </Typography>
                      <Typography sx={{ color: "#94a3b8", fontSize: 13 }}>
                        {t.role}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}