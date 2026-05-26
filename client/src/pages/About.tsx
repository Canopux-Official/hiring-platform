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

import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";

const founderData = {
  name: "Ragas S",
  title: "Founder",
  subtitle: "Global Talent Acquisition Leader · International Recruitment Specialist · Campus & Corporate Hiring Expert",
  initials: "RS",
  accentColor: "#059669",
  accentBg: "#d1fae5",
  bio: "Highly experienced HR & Talent Acquisition Professional with 18+ years of expertise in international and domestic hiring across multiple industries and global markets. Specialised in large-scale recruitment operations, strategic workforce planning, campus hiring, executive search, and multinational recruitment partnerships. Successfully managed hiring projects for MNCs, corporate organisations, startups, and international clients — delivering high-quality talent acquisition solutions with strong industry knowledge and professional recruitment strategies.",
  tags: [
    "International Recruitment",
    "Campus Hiring",
    "Executive Search",
    "Bulk & Volume Hiring",
    "Workforce Planning",
    "End-to-End Recruitment",
    "LinkedIn Sourcing",
    "Remote Hiring",
    "Recruitment Consulting",
    "MNC Partnerships",
    "Talent Strategy",
    "HR Operations",
  ],
  stats: [
    { num: "18+", label: "Years experience" },
    { num: "1000s", label: "Placements globally" },
    { num: "8+", label: "Industries served" },
    { num: "Global", label: "Reach & network" },
  ],
  highlights: [
    "Successfully handled thousands of candidate placements across global markets",
    "Extensive international hiring experience across multiple countries and multinational companies",
    "Led campus placement drives for freshers, graduate hiring programmes, and university recruitment",
    "Expert in IT, Engineering, Finance, HR, Aviation, Healthcare, and Operations sector hiring",
    "Built long-term professional relationships with clients, colleges, and recruitment partners worldwide",
  ],
  industries: [
    "Information Technology (IT)",
    "Engineering & Manufacturing",
    "Finance & Banking",
    "Human Resources (HR)",
    "Aviation & Hospitality",
    "Healthcare & Pharma",
    "BPO & Customer Support",
    "Sales, Marketing & Operations",
  ],
  whyConnect: [
    "18+ Years of Recruitment Excellence",
    "Strong International Hiring Experience",
    "Trusted MNC & Corporate Recruitment Partner",
    "Large Professional Talent Network",
    "Fast & Quality Hiring Solutions",
    "Skilled in High-Volume & Executive Hiring",
    "Professional Candidate Screening & Coordination",
    "Dedicated Support for Employers & Candidates",
  ],
  contact: {
    email: "ragasworld1@gmail.com",
    phone: "+91 6299209560",
  },
  socials: [
    { platform: "linkedin", url: "https://www.linkedin.com/in/rohan-singh-5919a83b5?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" }
  ],
};

const GREEN = "#059669";
const GREEN_DARK = "#047857";
const GREEN_LIGHT = "#d1fae5";

function StatCard({ num, label }: { num: string; label: string }) {
  return (
    <Box
      sx={{
        bgcolor: "#f8fafc",
        borderRadius: 3,
        p: 2.5,
        textAlign: "center",
        border: "1px solid #e2e8f0",
      }}
    >
      <Typography sx={{ fontSize: 24, fontWeight: 800, color: "#0f172a" }}>{num}</Typography>
      <Typography sx={{ fontSize: 13, color: "#64748b", mt: 0.5 }}>{label}</Typography>
    </Box>
  );
}

export default function AboutPage() {
  const [copied, setCopied] = React.useState<string | null>(null);
  const founder = founderData;

  const copy = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopied(key);
    setTimeout(() => setCopied(null), 1800);
  };

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

      <Container
        maxWidth="md"
        sx={{ position: "relative", zIndex: 1, pt: { xs: 10, md: 14 }, pb: { xs: 10, md: 16 } }}
      >
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Box textAlign="center" mb={{ xs: 8, md: 10 }}>
            <Chip
              icon={<WorkOutlineIcon sx={{ fontSize: 15, color: GREEN }} />}
              label="ABOUT"
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
                fontSize: { xs: 36, md: 56 },
                fontWeight: 800,
                color: "#0f172a",
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                mb: 2.5,
              }}
            >
              Built on experience.{" "}
              <Box
                component="span"
                sx={{
                  background: `linear-gradient(135deg, ${GREEN} 0%, #2563eb 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Driven by people.
              </Box>
            </Typography>
            <Typography
              sx={{
                maxWidth: 580,
                mx: "auto",
                fontSize: { xs: 16, md: 18 },
                color: "#475569",
                lineHeight: 1.75,
              }}
            >
              18+ years of connecting skilled professionals with global career opportunities — and helping
              organisations build strong, successful teams worldwide.
            </Typography>
          </Box>
        </motion.div>

        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <Box
            sx={{
              bgcolor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: 4,
              p: { xs: 3.5, md: 6 },
              boxShadow: "0 4px 20px rgba(15,23,42,0.06)",
              mb: 3,
              transition: "all 0.3s ease",
              "&:hover": {
                borderColor: alpha(GREEN, 0.5),
                boxShadow: `0 15px 40px ${alpha(GREEN, 0.12)}`,
                transform: "translateY(-4px)",
              },
            }}
          >
            {/* Name + Avatar */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems={{ xs: "center", sm: "flex-start" }} mb={4}>
              <Avatar
                sx={{
                  width: 90,
                  height: 90,
                  bgcolor: GREEN_LIGHT,
                  color: GREEN,
                  fontWeight: 800,
                  fontSize: "1.8rem",
                  border: `4px solid ${alpha(GREEN, 0.25)}`,
                }}
              >
                {founder.initials}
              </Avatar>
              <Box textAlign={{ xs: "center", sm: "left" }}>
                <Typography sx={{ fontWeight: 800, fontSize: 26, color: "#0f172a" }}>{founder.name}</Typography>
                <Typography sx={{ color: GREEN, fontWeight: 600, fontSize: 15, mb: 0.5 }}>{founder.title}</Typography>
                <Typography sx={{ color: "#64748b", fontSize: 14, lineHeight: 1.55 }}>{founder.subtitle}</Typography>
              </Box>
            </Stack>

            {/* Bio */}
            <Typography sx={{ color: "#475569", lineHeight: 1.8, mb: 4, fontSize: 16 }}>
              {founder.bio}
            </Typography>

            {/* Tags */}
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", mb: 1.5, letterSpacing: "0.08em" }}>
              CORE EXPERTISE
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1} mb={4}>
              {founder.tags.map((t) => (
                <Chip
                  key={t}
                  label={t}
                  size="small"
                  sx={{ bgcolor: GREEN_LIGHT, color: GREEN, fontWeight: 600, fontSize: 13 }}
                />
              ))}
            </Stack>

            <Divider sx={{ my: 4 }} />

            {/* Stats */}
            <Grid container spacing={1.5} mb={4}>
              {founder.stats.map((s) => (
                <Grid item xs={6} sm={3} key={s.label}>
                  <StatCard num={s.num} label={s.label} />
                </Grid>
              ))}
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* Highlights */}
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", mb: 2, letterSpacing: "0.08em" }}>
              KEY HIGHLIGHTS
            </Typography>
            <Stack spacing={1.5} mb={4}>
              {founder.highlights.map((h, i) => (
                <Stack key={i} direction="row" spacing={1.5} alignItems="flex-start">
                  <StarBorderRoundedIcon sx={{ color: GREEN, fontSize: 18, mt: "3px", flexShrink: 0 }} />
                  <Typography sx={{ fontSize: 15, color: "#1e293b", lineHeight: 1.65 }}>{h}</Typography>
                </Stack>
              ))}
            </Stack>

            <Divider sx={{ my: 4 }} />

            {/* Industries */}
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", mb: 2, letterSpacing: "0.08em" }}>
              INDUSTRIES SERVED
            </Typography>
            <Grid container spacing={1} mb={4}>
              {founder.industries.map((ind) => (
                <Grid item xs={12} sm={6} key={ind}>
                  <Box
                    sx={{
                      bgcolor: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: 2,
                      px: 2,
                      py: 1.25,
                      fontSize: 14,
                      color: "#334155",
                    }}
                  >
                    {ind}
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* Why Connect */}
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", mb: 2, letterSpacing: "0.08em" }}>
              WHY COMPANIES PREFER TO CONNECT
            </Typography>
            <Grid container spacing={1}>
              {founder.whyConnect.map((w) => (
                <Grid item xs={12} sm={6} key={w}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <CheckCircleOutlineIcon sx={{ color: GREEN, fontSize: 18, flexShrink: 0 }} />
                    <Typography sx={{ fontSize: 14, color: "#1e293b" }}>{w}</Typography>
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </Box>
        </motion.div>

        {/* Contact Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <Box
            sx={{
              bgcolor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: 4,
              p: { xs: 3.5, md: 5 },
              boxShadow: "0 4px 20px rgba(15,23,42,0.06)",
            }}
          >
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", mb: 2.5, letterSpacing: "0.08em" }}>
              CONTACT
            </Typography>

            <Stack spacing={2} mb={3}>
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
                    "&:hover": { bgcolor: GREEN_LIGHT, borderColor: GREEN },
                  }}
                >
                  <EmailOutlinedIcon sx={{ color: GREEN, fontSize: 22 }} />
                  <Typography sx={{ fontSize: 15.5, fontWeight: 500, color: "#1e293b" }}>
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
                    border: `1px solid ${alpha("#2563eb", 0.3)}`,
                    cursor: "pointer",
                    "&:hover": { bgcolor: "#dbeafe", borderColor: "#2563eb" },
                  }}
                >
                  <PhoneOutlinedIcon sx={{ color: "#2563eb", fontSize: 22 }} />
                  <Typography sx={{ fontSize: 15.5, fontWeight: 500, color: "#1e293b" }}>
                    {founder.contact.phone}
                  </Typography>
                </Stack>
              </Tooltip>
            </Stack>

            {/* Socials */}
            <Stack direction="row" spacing={1.5}>
              <Box
                component="a"
                href={founder.socials[0].url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  px: 2.5,
                  py: 1.25,
                  border: "1px solid #e2e8f0",
                  borderRadius: 2,
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#475569",
                  textDecoration: "none",
                  "&:hover": { bgcolor: "#f1f5f9", color: "#0f172a" },
                }}
              >
                <LinkedInIcon sx={{ fontSize: 18 }} />
                LinkedIn
              </Box>
              {/* <Box
                component="a"
                href={founder.socials[1].url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  px: 2.5,
                  py: 1.25,
                  border: "1px solid #e2e8f0",
                  borderRadius: 2,
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#475569",
                  textDecoration: "none",
                  "&:hover": { bgcolor: "#f1f5f9", color: "#0f172a" },
                }}
              >
                <TwitterIcon sx={{ fontSize: 18 }} />
                Twitter / X
              </Box> */}
            </Stack>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}