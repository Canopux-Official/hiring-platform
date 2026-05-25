import React from "react";
import {
  Box,
  Container,
  Typography,
  Chip,
  Grid,
  Avatar,
  Stack,
  Divider,
  Tooltip,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";

// Icons
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";

const foundersData = {
  founders: [
    {
      name: "Alexandra Mercer",
      title: "Founder",
      initials: "AM",
      accentColor: "#059669",
      accentBg: "#d1fae5",
      bio: "Serial entrepreneur with 15+ years shaping the future of sustainable technology. Alexandra has led cross-functional teams across three continents and been recognised by Forbes 30 Under 30. She believes technology should empower people, not replace them.",
      tags: ["Product Vision", "Venture Capital", "AI/ML", "Strategy"],
      highlights: [
        "Forbes 30 Under 30 — Technology (2019)",
        "Led Series B raise of $28M from Sequoia & a16z",
        "Previously VP Product at Stripe",
      ],
      contact: {
        email: "ragasworld1@gmail.com",
        phone: "+91 6299209560"
      },
      socials: [
        { platform: "linkedin", url: "https://linkedin.com/in/alexandramer" },
        { platform: "twitter", url: "https://twitter.com/alexandramer" },
      ],
    },
  ],
};

// ── Design Tokens ─────────────────────────────────────────────────────
const GREEN = "#059669";
const GREEN_DARK = "#047857";
const GREEN_LIGHT = "#d1fae5";
const BLUE = "#2563eb";
const BLUE_LIGHT = "#dbeafe";

// FounderCard Component
function FounderCard({ founder, delay }: { founder: any; delay: number }) {
  const [copied, setCopied] = React.useState<string | null>(null);

  const copy = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopied(key);
    setTimeout(() => setCopied(null), 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      <Box
        sx={{
          bgcolor: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: 4,
          p: { xs: 4, md: 6 },
          boxShadow: "0 4px 20px rgba(15,23,42,0.06)",
          maxWidth: 680,
          mx: "auto",
          transition: "all 0.3s ease",
          "&:hover": {
            borderColor: alpha(founder.accentColor, 0.5),
            boxShadow: `0 15px 40px ${alpha(founder.accentColor, 0.15)}`,
            transform: "translateY(-6px)",
          },
        }}
      >
        <Stack direction="row" spacing={3} alignItems="flex-start" mb={4}>
          <Avatar
            sx={{
              width: 88,
              height: 88,
              bgcolor: founder.accentBg,
              color: founder.accentColor,
              fontWeight: 800,
              fontSize: "1.8rem",
              border: `4px solid ${alpha(founder.accentColor, 0.25)}`,
            }}
          >
            {founder.initials}
          </Avatar>

          <Box flex={1}>
            <Typography sx={{ fontWeight: 800, fontSize: 24, color: "#0f172a" }}>
              {founder.name}
            </Typography>
            <Typography sx={{ color: founder.accentColor, fontWeight: 600, fontSize: 15 }}>
              {founder.title}
            </Typography>
          </Box>
        </Stack>

        <Typography sx={{ color: "#475569", lineHeight: 1.75, mb: 4, fontSize: 16.5 }}>
          {founder.bio}
        </Typography>

        <Stack direction="row" flexWrap="wrap" gap={1} mb={4}>
          {founder.tags.map((t: string) => (
            <Chip
              key={t}
              label={t}
              size="small"
              sx={{
                bgcolor: founder.accentBg,
                color: founder.accentColor,
                fontWeight: 600,
                fontSize: 13,
              }}
            />
          ))}
        </Stack>

        <Box mb={4}>
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", mb: 2 }}>
            KEY HIGHLIGHTS
          </Typography>
          <Stack spacing={1.5}>
            {founder.highlights.map((h: string, i: number) => (
              <Stack key={i} direction="row" spacing={1.5} alignItems="flex-start">
                <StarBorderRoundedIcon sx={{ color: founder.accentColor, fontSize: 18, mt: "3px" }} />
                <Typography sx={{ fontSize: 15, color: "#1e2937" }}>{h}</Typography>
              </Stack>
            ))}
          </Stack>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", mb: 2 }}>
          CONTACT
        </Typography>

        <Stack spacing={2.5}>
          {/* Email */}
          <Tooltip title={copied === "email" ? "Copied!" : "Copy Email"} placement="top">
            <Stack
              direction="row"
              spacing={2.5}
              alignItems="center"
              onClick={() => copy(founder.contact.email, "email")}
              sx={{
                p: 2.5,
                borderRadius: 3,
                border: `1px solid ${alpha(GREEN, 0.3)}`,
                cursor: "pointer",
                bgcolor: "#fff",
                color: "#1e2937", // Darker text for visibility
                "&:hover": {
                  bgcolor: GREEN_LIGHT,
                  borderColor: GREEN,
                },
              }}
            >
              <EmailOutlinedIcon sx={{ color: GREEN, fontSize: 24 }} />
              <Typography sx={{ fontSize: 15.5, fontWeight: 500 }}>
                {founder.contact.email}
              </Typography>
            </Stack>
          </Tooltip>

          {/* Phone */}
          <Tooltip title={copied === "phone" ? "Copied!" : "Copy Phone"} placement="top">
            <Stack
              direction="row"
              spacing={2.5}
              alignItems="center"
              onClick={() => copy(founder.contact.phone, "phone")}
              sx={{
                p: 2.5,
                borderRadius: 3,
                border: `1px solid ${alpha(BLUE, 0.3)}`,
                cursor: "pointer",
                bgcolor: "#fff",
                color: "#1e2937", // Darker text for visibility
                "&:hover": {
                  bgcolor: BLUE_LIGHT,
                  borderColor: BLUE,
                },
              }}
            >
              <PhoneOutlinedIcon sx={{ color: BLUE, fontSize: 24 }} />
              <Typography sx={{ fontSize: 15.5, fontWeight: 500 }}>
                {founder.contact.phone}
              </Typography>
            </Stack>
          </Tooltip>
        </Stack>
      </Box>
    </motion.div>
  );
}

// ── Main About Page ─────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <Box sx={{ bgcolor: "#ffffff", position: "relative", overflow: "hidden" }}>
      {/* Background Glow */}
      <Box
        sx={{
          position: "absolute",
          width: 1000,
          height: 600,
          borderRadius: "50%",
          top: "-25%",
          left: "50%",
          transform: "translateX(-50%)",
          background: `radial-gradient(ellipse, ${alpha(GREEN, 0.07)} 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, pt: { xs: 12, md: 16 }, pb: { xs: 10, md: 16 } }}>
        {/* Hero Section */}
        <Box textAlign="center" mb={{ xs: 10, md: 14 }}>
          <Chip
            icon={<AutoAwesomeIcon sx={{ fontSize: 15, color: GREEN }} />}
            label="OUR STORY"
            sx={{
              mb: 3,
              px: 2,
              py: 1,
              fontSize: 13,
              fontWeight: 700,
              bgcolor: GREEN_LIGHT,
              color: GREEN,
              border: `1px solid ${alpha(GREEN, 0.3)}`,
            }}
          />

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: 42, md: 62 },
              lineHeight: 1.1,
              fontWeight: 800,
              color: "#0f172a",
              letterSpacing: "-0.035em",
              mb: 3,
            }}
          >
            Built by founders who<br />
            <Box
              component="span"
              sx={{
                background: `linear-gradient(135deg, ${GREEN} 0%, #2563eb 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              believe in better.
            </Box>
          </Typography>

          <Typography
            sx={{
              maxWidth: 680,
              mx: "auto",
              fontSize: { xs: 17, md: 19 },
              color: "#475569",
              lineHeight: 1.75,
            }}
          >
            We create technology that removes barriers and amplifies human potential.
          </Typography>
        </Box>

        {/* Founders Section */}
        <Box mb={8}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: 32, md: 42 },
              fontWeight: 800,
              textAlign: "center",
              color: "#0f172a",
              mb: 1.5,
            }}
          >
            Meet the Founder
          </Typography>
          <Typography sx={{ textAlign: "center", color: "#64748b", maxWidth: 500, mx: "auto" }}>
            Visionary leader building technology with purpose.
          </Typography>
        </Box>

        {/* Centered Single Founder */}
        <Grid container justifyContent="center">
          <Grid item xs={12} md={8} lg={7}>
            {foundersData.founders.map((founder: any, i: number) => (
              <FounderCard key={i} founder={founder} delay={0.1} />
            ))}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}