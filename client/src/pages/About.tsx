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

const founderData = {
  name: "Ragas S",
  title: "Founder",
  subtitle: "Global Talent Acquisition Leader · International Recruitment Specialist · Campus & Corporate Hiring Expert",
  initials: "RS",
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
    { platform: "linkedin", url: "https://www.linkedin.com/in/rohan-singh-5919a83b5" },
  ],
};

// Side images
const sideImages = [
  { src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&q=85&auto=format&fit=crop", alt: "Professional interview", h: 190 },
  { src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=500&q=85&auto=format&fit=crop", alt: "Team meeting", h: 155 },
  { src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=500&q=85&auto=format&fit=crop", alt: "Office collaboration", h: 175 },
];

const GREEN = "#059669";
const GREEN_DARK = "#047857";
const GREEN_LIGHT = "#d1fae5";
const BLUE = "#2563eb";
const BLUE_LIGHT = "#dbeafe";

function StatCard({ num, label }: { num: string; label: string }) {
  return (
    <Box
      sx={{
        bgcolor: "#f8fafc",
        borderRadius: 3,
        p: 2.5,
        textAlign: "center",
        border: "1px solid #e2e8f0",
        transition: "all 0.2s",
        "&:hover": {
          borderColor: alpha(GREEN, 0.4),
          bgcolor: GREEN_LIGHT,
        },
      }}
    >
      <Typography sx={{ fontSize: 26, fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>
        {num}
      </Typography>
      <Typography sx={{ fontSize: 13, color: "#64748b", mt: 0.5 }}>
        {label}
      </Typography>
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
      {/* Background texture */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: `radial-gradient(circle, ${alpha(GREEN, 0.1)} 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
          opacity: 0.28,
        }}
      />

      {/* Hero Section */}
      <Box sx={{ position: "relative", mb: 0 }}>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: { xs: 260, md: 380 },
            overflow: "hidden",
            zIndex: 0,
          }}
        >
          <Box
            component="img"
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=85&auto=format&fit=crop"
            alt="Modern office"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 40%",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.55) 60%, rgba(255,255,255,1) 100%)",
            }}
          />
        </Box>

        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1, pt: { xs: 10, md: 14 }, pb: { xs: 5, md: 6 } }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <Box textAlign="center">
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
                    background: `linear-gradient(135deg, ${GREEN} 0%, ${BLUE} 100%)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Driven by people.
                </Box>
              </Typography>
              <Typography
                sx={{
                  maxWidth: 560,
                  mx: "auto",
                  fontSize: { xs: 16, md: 18 },
                  color: "#475569",
                  lineHeight: 1.75,
                }}
              >
                18+ years of connecting skilled professionals with global career opportunities — and helping organisations build strong, successful teams worldwide.
              </Typography>
            </Box>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1, pb: { xs: 10, md: 16 } }}>
        {/* Side Images */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.08 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
              gap: 2,
              mb: 5,
            }}
          >
            {sideImages.map((img, i) => (
              <Box
                key={i}
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  height: img.h,
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 18px rgba(15,23,42,0.07)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: `0 12px 32px ${alpha(GREEN, 0.14)}`,
                  },
                  "&:hover img": { transform: "scale(1.05)" },
                }}
              >
                <Box
                  component="img"
                  src={img.src}
                  alt={img.alt}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.45s ease",
                  }}
                />
              </Box>
            ))}
          </Box>
        </motion.div>

        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
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
                borderColor: alpha(GREEN, 0.45),
                boxShadow: `0 16px 40px ${alpha(GREEN, 0.11)}`,
              },
            }}
          >
            {/* Avatar + Info */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems={{ xs: "center", sm: "flex-start" }} mb={4}>
              <Box sx={{ position: "relative", flexShrink: 0 }}>
                <Avatar
                  sx={{
                    width: 96,
                    height: 96,
                    bgcolor: GREEN_LIGHT,
                    color: GREEN,
                    fontWeight: 800,
                    fontSize: "2rem",
                    border: `4px solid ${alpha(GREEN, 0.2)}`,
                    boxShadow: `0 0 0 6px ${alpha(GREEN, 0.07)}`,
                  }}
                >
                  {founder.initials}
                </Avatar>
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 2,
                    right: 2,
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    bgcolor: GREEN,
                    border: "2px solid #fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CheckCircleOutlineIcon sx={{ fontSize: 14, color: "#fff" }} />
                </Box>
              </Box>

              <Box textAlign={{ xs: "center", sm: "left" }}>
                <Typography sx={{ fontWeight: 800, fontSize: 26, color: "#0f172a" }}>
                  {founder.name}
                </Typography>
                <Typography sx={{ color: GREEN, fontWeight: 600, fontSize: 15, mb: 0.5 }}>
                  {founder.title}
                </Typography>
                <Typography sx={{ color: "#64748b", fontSize: 14, lineHeight: 1.55 }}>
                  {founder.subtitle}
                </Typography>
              </Box>
            </Stack>

            {/* Bio */}
            <Typography sx={{ color: "#475569", lineHeight: 1.85, mb: 4, fontSize: 16 }}>
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
                  sx={{
                    bgcolor: GREEN_LIGHT,
                    color: GREEN_DARK,
                    fontWeight: 600,
                    fontSize: 13,
                  }}
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
                  <Typography sx={{ fontSize: 15, color: "#1e293b", lineHeight: 1.65 }}>
                    {h}
                  </Typography>
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
                      display: "flex",
                      alignItems: "center",
                      gap: 1.2,
                      transition: "all 0.18s",
                      "&:hover": {
                        bgcolor: GREEN_LIGHT,
                        borderColor: alpha(GREEN, 0.35),
                        color: GREEN_DARK,
                      },
                    }}
                  >
                    <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: GREEN, flexShrink: 0 }} />
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
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ py: 0.5 }}>
                    <CheckCircleOutlineIcon sx={{ color: GREEN, fontSize: 18, flexShrink: 0 }} />
                    <Typography sx={{ fontSize: 14, color: "#1e293b" }}>{w}</Typography>
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </Box>
        </motion.div>

        {/* Contact Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.22 }}>
          <Box
            sx={{
              bgcolor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: 4,
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(15,23,42,0.06)",
            }}
          >
            <Box sx={{ height: 130, position: "relative", overflow: "hidden" }}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&q=85&auto=format&fit=crop"
                alt="Professional networking"
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center 45%",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(135deg, ${alpha(GREEN_DARK, 0.75)}, ${alpha(BLUE, 0.55)})`,
                  display: "flex",
                  alignItems: "center",
                  px: { xs: 3.5, md: 5 },
                }}
              >
                <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: { xs: 18, md: 22 }, letterSpacing: "-0.02em" }}>
                  Let's Connect
                </Typography>
              </Box>
            </Box>

            <Box sx={{ p: { xs: 3.5, md: 5 } }}>
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
                      transition: "all 0.18s",
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        bgcolor: GREEN_LIGHT,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <EmailOutlinedIcon sx={{ color: GREEN, fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, letterSpacing: "0.06em", mb: 0.25 }}>
                        EMAIL
                      </Typography>
                      <Typography sx={{ fontSize: 15, fontWeight: 500, color: "#1e293b" }}>
                        {founder.contact.email}
                      </Typography>
                    </Box>
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
                      "&:hover": { bgcolor: BLUE_LIGHT, borderColor: BLUE },
                      transition: "all 0.18s",
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        bgcolor: BLUE_LIGHT,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <PhoneOutlinedIcon sx={{ color: BLUE, fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, letterSpacing: "0.06em", mb: 0.25 }}>
                        PHONE
                      </Typography>
                      <Typography sx={{ fontSize: 15, fontWeight: 500, color: "#1e293b" }}>
                        {founder.contact.phone}
                      </Typography>
                    </Box>
                  </Stack>
                </Tooltip>
              </Stack>

              {/* LinkedIn Button */}
              <Box
                component="a"
                href={founder.socials[0].url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1.2,
                  px: 3,
                  py: 1.4,
                  bgcolor: "#0a66c2",
                  borderRadius: 2.5,
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#ffffff",
                  textDecoration: "none",
                  boxShadow: "0 4px 14px rgba(10,102,194,0.3)",
                  "&:hover": {
                    bgcolor: "#0958a8",
                    transform: "translateY(-1px)",
                    boxShadow: "0 6px 20px rgba(10,102,194,0.4)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                <LinkedInIcon sx={{ fontSize: 20 }} />
                Connect on LinkedIn
              </Box>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}