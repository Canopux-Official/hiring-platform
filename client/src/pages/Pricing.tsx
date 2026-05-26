import React from "react";
import {
  Box,
  Container,
  Typography,
  Chip,
  Grid,
  Stack,
  Divider,
  Button,
  Avatar,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";

import { Link } from "react-router-dom";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import PersonSearchOutlinedIcon from "@mui/icons-material/PersonSearchOutlined";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";

const GREEN = "#059669";
const GREEN_DARK = "#047857";
const GREEN_LIGHT = "#d1fae5";
const GOLD = "#d97706";
const GOLD_LIGHT = "#fef3c7";
const SILVER = "#475569";
const SILVER_LIGHT = "#f1f5f9";
const BLUE = "#2563eb";
const BLUE_LIGHT = "#dbeafe";

interface PlanFeature {
  text: string;
  highlighted?: boolean;
}

interface PricingPlan {
  id: string;
  badge: string;
  badgeColor: string;
  badgeBg: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  price: number;
  priceNote: string;
  accentColor: string;
  accentBg: string;
  borderColor: string;
  shadowColor: string;
  buttonVariant: "contained" | "outlined";
  buttonBg?: string;
  buttonHoverBg?: string;
  popular?: boolean;
  features: PlanFeature[];
  tag?: string;
}

const plans: PricingPlan[] = [
  {
    id: "jobseeker",
    badge: "JOB SEEKER",
    badgeColor: BLUE,
    badgeBg: BLUE_LIGHT,
    icon: <PersonSearchOutlinedIcon sx={{ fontSize: 28, color: BLUE }} />,
    title: "Job Seeker",
    subtitle: "For professionals seeking their next global career opportunity",
    price: 49,
    priceNote: "one-time registration",
    accentColor: BLUE,
    accentBg: BLUE_LIGHT,
    borderColor: alpha(BLUE, 0.3),
    shadowColor: alpha(BLUE, 0.12),
    buttonVariant: "contained",
    buttonBg: BLUE,
    buttonHoverBg: "#1d4ed8",
    features: [
      { text: "Profile creation & resume submission" },
      { text: "Access to global job listings" },
      { text: "Direct recruiter introductions" },
      { text: "Industry-specific job matching" },
      { text: "Campus & fresher opportunities" },
      { text: "Career guidance & resume tips" },
      { text: "Interview preparation support" },
      { text: "Priority profile review by recruiters" },
    ],
  },
  {
    id: "silver",
    badge: "RECRUITER — SILVER",
    badgeColor: SILVER,
    badgeBg: SILVER_LIGHT,
    icon: <BusinessCenterOutlinedIcon sx={{ fontSize: 28, color: SILVER }} />,
    title: "Silver Plan",
    subtitle: "For growing companies with regular hiring needs",
    price: 99,
    priceNote: "per month",
    accentColor: SILVER,
    accentBg: SILVER_LIGHT,
    borderColor: alpha(SILVER, 0.3),
    shadowColor: alpha(SILVER, 0.1),
    buttonVariant: "outlined",
    features: [
      { text: "Access to pre-screened candidate pool" },
      { text: "Domestic & international talent search" },
      { text: "LinkedIn sourcing support" },
      { text: "Candidate shortlisting & screening" },
      { text: "Email & phone coordination support" },
      { text: "Monthly hiring reports & analytics" },
      { text: "Dedicated account support" },
    ],
  },
  {
    id: "gold",
    badge: "RECRUITER — GOLD",
    badgeColor: GOLD,
    badgeBg: GOLD_LIGHT,
    icon: <EmojiEventsOutlinedIcon sx={{ fontSize: 28, color: GOLD }} />,
    title: "Gold Plan",
    subtitle: "For enterprises with high-volume and executive hiring demands",
    price: 199,
    priceNote: "per month",
    accentColor: GOLD,
    accentBg: GOLD_LIGHT,
    borderColor: alpha(GOLD, 0.4),
    shadowColor: alpha(GOLD, 0.14),
    buttonVariant: "contained",
    buttonBg: GOLD,
    buttonHoverBg: "#b45309",
    popular: true,
    tag: "MOST POPULAR",
    features: [
      { text: "Priority access to top-tier candidates", highlighted: true },
      { text: "Executive & senior leadership search" },
      { text: "Bulk & volume hiring campaigns" },
      { text: "Campus recruitment drives" },
      { text: "MNC & multinational hiring support" },
      { text: "Dedicated talent acquisition manager" },
      { text: "Custom workforce planning consultancy" },
      { text: "Weekly performance & placement reports" },
      { text: "24/7 priority support & SLA guarantee" },
    ],
  },
];

function PricingCard({ plan, index }: { plan: PricingPlan; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.1 + index * 0.1 }}
      style={{ height: "100%" }}
    >
      <Box
        sx={{
          position: "relative",
          bgcolor: "#ffffff",
          border: `1px solid ${plan.popular ? plan.borderColor : "#e2e8f0"}`,
          borderRadius: 4,
          p: { xs: 3.5, md: 5 },
          boxShadow: plan.popular
            ? `0 8px 32px ${plan.shadowColor}`
            : "0 4px 20px rgba(15,23,42,0.06)",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "all 0.3s ease",
          "&:hover": {
            borderColor: plan.accentColor,
            boxShadow: `0 15px 40px ${plan.shadowColor}`,
            transform: "translateY(-4px)",
          },
        }}
      >
        {/* Popular badge */}
        {plan.popular && (
          <Box
            sx={{
              position: "absolute",
              top: -14,
              left: "50%",
              transform: "translateX(-50%)",
              bgcolor: GOLD,
              color: "#fff",
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.1em",
              px: 2.5,
              py: 0.75,
              borderRadius: 99,
              whiteSpace: "nowrap",
              boxShadow: `0 4px 12px ${alpha(GOLD, 0.4)}`,
              display: "flex",
              alignItems: "center",
              gap: 0.6,
            }}
          >
            <BoltOutlinedIcon sx={{ fontSize: 13 }} />
            {plan.tag}
          </Box>
        )}

        {/* Header */}
        <Stack direction="row" spacing={2} alignItems="center" mb={3}>
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 3,
              bgcolor: plan.accentBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `1px solid ${alpha(plan.accentColor, 0.25)}`,
              flexShrink: 0,
            }}
          >
            {plan.icon}
          </Box>
          <Box>
            <Chip
              label={plan.badge}
              size="small"
              sx={{
                bgcolor: plan.accentBg,
                color: plan.accentColor,
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: "0.06em",
                border: `1px solid ${alpha(plan.accentColor, 0.3)}`,
                mb: 0.5,
              }}
            />
            <Typography sx={{ fontWeight: 800, fontSize: 19, color: "#0f172a", lineHeight: 1.2 }}>
              {plan.title}
            </Typography>
          </Box>
        </Stack>

        <Typography sx={{ color: "#64748b", fontSize: 14, lineHeight: 1.65, mb: 3.5 }}>
          {plan.subtitle}
        </Typography>

        {/* Price */}
        <Box
          sx={{
            bgcolor: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: 3,
            p: 2.5,
            mb: 3.5,
            textAlign: "center",
          }}
        >
          <Stack direction="row" alignItems="baseline" justifyContent="center" spacing={0.5}>
            <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#64748b" }}>₹</Typography>
            <Typography
              sx={{
                fontSize: 52,
                fontWeight: 900,
                color: plan.accentColor,
                lineHeight: 1,
                letterSpacing: "-0.03em",
              }}
            >
              {plan.price}
            </Typography>
          </Stack>
          <Typography sx={{ fontSize: 13, color: "#94a3b8", mt: 0.75 }}>{plan.priceNote}</Typography>
        </Box>

        {/* CTA Button */}
        <Button
          fullWidth
          component={Link}
          to="/signin"
          variant={plan.buttonVariant}
          sx={{
            mb: 3.5,
            py: 1.5,
            fontWeight: 700,
            fontSize: 15,
            borderRadius: 2.5,
            textTransform: "none",
            textDecoration: "none",
            ...(plan.buttonVariant === "contained"
              ? {
                  bgcolor: plan.buttonBg,
                  color: "#fff",
                  boxShadow: `0 4px 14px ${alpha(plan.accentColor, 0.35)}`,
                  "&:hover": {
                    bgcolor: plan.buttonHoverBg,
                    boxShadow: `0 6px 20px ${alpha(plan.accentColor, 0.45)}`,
                  },
                }
              : {
                  color: plan.accentColor,
                  borderColor: plan.accentColor,
                  "&:hover": {
                    bgcolor: plan.accentBg,
                    borderColor: plan.accentColor,
                  },
                }),
          }}
        >
          Get Started
        </Button>

        <Divider sx={{ mb: 3 }} />

        {/* Features */}
        <Typography
          sx={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", mb: 2, letterSpacing: "0.08em" }}
        >
          WHAT'S INCLUDED
        </Typography>
        <Stack spacing={1.5} sx={{ flex: 1 }}>
          {plan.features.map((f, i) => (
            <Stack key={i} direction="row" spacing={1.5} alignItems="flex-start">
              {f.highlighted ? (
                <StarBorderRoundedIcon
                  sx={{ color: plan.accentColor, fontSize: 17, mt: "3px", flexShrink: 0 }}
                />
              ) : (
                <CheckCircleOutlineIcon
                  sx={{ color: plan.accentColor, fontSize: 17, mt: "3px", flexShrink: 0 }}
                />
              )}
              <Typography
                sx={{
                  fontSize: 14,
                  color: f.highlighted ? "#0f172a" : "#334155",
                  fontWeight: f.highlighted ? 600 : 400,
                  lineHeight: 1.6,
                }}
              >
                {f.text}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Box>
    </motion.div>
  );
}

export default function PricingPage() {
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
        maxWidth="lg"
        sx={{ position: "relative", zIndex: 1, pt: { xs: 10, md: 14 }, pb: { xs: 10, md: 16 } }}
      >
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box textAlign="center" mb={{ xs: 8, md: 10 }}>
            <Chip
              icon={<WorkOutlineIcon sx={{ fontSize: 15, color: GREEN }} />}
              label="PRICING"
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
              Simple, transparent{" "}
              <Box
                component="span"
                sx={{
                  background: `linear-gradient(135deg, ${GREEN} 0%, #2563eb 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                pricing.
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
              Whether you're looking for your next opportunity or building a world-class team — we
              have a plan designed for you.
            </Typography>
          </Box>
        </motion.div>

        {/* Activation Steps Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
        >
          <Box
            sx={{
              bgcolor: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: 4,
              p: { xs: 3, md: 4 },
              mb: { xs: 6, md: 8 },
              boxShadow: "0 2px 12px rgba(15,23,42,0.05)",
            }}
          >
            <Typography
              sx={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", mb: 3, letterSpacing: "0.08em", textAlign: "center" }}
            >
              HOW IT WORKS — ACCOUNT ACTIVATION
            </Typography>
            <Grid container spacing={2} alignItems="stretch">
              {[
                {
                  step: "01",
                  color: BLUE,
                  bg: BLUE_LIGHT,
                  title: "Create Your Account",
                  desc: "Sign up and complete your profile or company details on the platform.",
                },
                {
                  step: "02",
                  color: GREEN,
                  bg: GREEN_LIGHT,
                  title: "Contact Admin",
                  desc: "After registration, reach out to our admin via the contact details below to confirm your plan.",
                },
                {
                  step: "03",
                  color: GOLD,
                  bg: GOLD_LIGHT,
                  title: "Complete Payment",
                  desc: "Make the payment for your selected plan as instructed by the admin.",
                },
                {
                  step: "04",
                  color: "#7c3aed",
                  bg: "#ede9fe",
                  title: "Account Activated",
                  desc: "Once payment is confirmed, your account will be fully activated within 24 hours.",
                },
              ].map((s, i) => (
                <Grid item xs={12} sm={6} md={3} key={s.step}>
                  <Box
                    sx={{
                      bgcolor: "#ffffff",
                      border: `1px solid ${alpha(s.color, 0.2)}`,
                      borderRadius: 3,
                      p: 2.5,
                      height: "100%",
                      position: "relative",
                      transition: "all 0.25s ease",
                      "&:hover": {
                        borderColor: s.color,
                        boxShadow: `0 6px 20px ${alpha(s.color, 0.1)}`,
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 2,
                        bgcolor: s.bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 1.5,
                        border: `1px solid ${alpha(s.color, 0.25)}`,
                      }}
                    >
                      <Typography sx={{ fontWeight: 800, fontSize: 13, color: s.color }}>
                        {s.step}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontWeight: 700, fontSize: 14, color: "#0f172a", mb: 0.75 }}>
                      {s.title}
                    </Typography>
                    <Typography sx={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>
                      {s.desc}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </motion.div>

        {/* Section label: Job Seeker */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
            <PersonSearchOutlinedIcon sx={{ color: BLUE, fontSize: 20 }} />
            <Typography sx={{ fontWeight: 700, fontSize: 14, color: "#0f172a", letterSpacing: "0.02em" }}>
              For Job Seekers
            </Typography>
            <Box sx={{ flex: 1, height: 1, bgcolor: "#e2e8f0" }} />
          </Stack>
        </motion.div>

        {/* Job Seeker card — narrower, centered */}
        <Grid container justifyContent="center" mb={6}>
          <Grid item xs={12} sm={8} md={5}>
            <PricingCard plan={plans[0]} index={0} />
          </Grid>
        </Grid>

        {/* Section label: Recruiters */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
            <BusinessCenterOutlinedIcon sx={{ color: GREEN, fontSize: 20 }} />
            <Typography sx={{ fontWeight: 700, fontSize: 14, color: "#0f172a", letterSpacing: "0.02em" }}>
              For Recruiters & Employers
            </Typography>
            <Box sx={{ flex: 1, height: 1, bgcolor: "#e2e8f0" }} />
          </Stack>
        </motion.div>

        {/* Silver + Gold cards */}
        <Grid container spacing={3} mb={8}>
          {plans.slice(1).map((plan, i) => (
            <Grid item xs={12} md={6} key={plan.id}>
              <PricingCard plan={plan} index={i + 1} />
            </Grid>
          ))}
        </Grid>

        {/* Admin Contact & Activation Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Box
            sx={{
              bgcolor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: 4,
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(15,23,42,0.06)",
            }}
          >
            {/* Top green accent bar */}
            <Box sx={{ height: 4, background: `linear-gradient(90deg, ${GREEN} 0%, #2563eb 100%)` }} />

            <Box sx={{ p: { xs: 3.5, md: 5 } }}>
              <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
                {/* Left: message */}
                <Grid item xs={12} md={7}>
                  <Typography
                    sx={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", mb: 1.5, letterSpacing: "0.08em" }}
                  >
                    NEED HELP? CONTACT ADMIN
                  </Typography>
                  <Typography sx={{ fontSize: { xs: 22, md: 28 }, fontWeight: 800, color: "#0f172a", mb: 1.5, lineHeight: 1.25 }}>
                    Ready to get started?{" "}
                    <Box component="span" sx={{ background: `linear-gradient(135deg, ${GREEN} 0%, #2563eb 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                      Contact us first.
                    </Box>
                  </Typography>
                  <Typography sx={{ color: "#64748b", fontSize: 15, lineHeight: 1.75, mb: 0 }}>
                    After creating your account, please contact the admin to confirm your chosen plan
                    and complete the payment. Your account will be activated promptly once payment is
                    verified — usually within 24 hours.
                  </Typography>
                </Grid>

                {/* Right: contact box */}
                <Grid item xs={12} md={5}>
                  <Stack spacing={2}>
                    {/* Phone */}
                    <Box
                      sx={{
                        p: 2.5,
                        borderRadius: 3,
                        border: `1px solid ${alpha(GREEN, 0.3)}`,
                        bgcolor: "#f8fafc",
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
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
                          flexShrink: 0,
                          border: `1px solid ${alpha(GREEN, 0.25)}`,
                        }}
                      >
                        {/* phone icon via text fallback */}
                        <Typography sx={{ fontSize: 18 }}>📞</Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em", mb: 0.25 }}>
                          ADMIN CONTACT
                        </Typography>
                        <Typography sx={{ fontWeight: 700, fontSize: 16, color: "#0f172a" }}>
                          +91 6299209560
                        </Typography>
                        <Typography sx={{ fontSize: 12, color: "#64748b" }}>
                          Call or WhatsApp
                        </Typography>
                      </Box>
                    </Box>

                    {/* Note */}
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2.5,
                        bgcolor: GOLD_LIGHT,
                        border: `1px solid ${alpha(GOLD, 0.3)}`,
                        display: "flex",
                        gap: 1.5,
                        alignItems: "flex-start",
                      }}
                    >
                      <Typography sx={{ fontSize: 16, flexShrink: 0, mt: "1px" }}>⚡</Typography>
                      <Typography sx={{ fontSize: 13, color: "#92400e", lineHeight: 1.6 }}>
                        <strong>Quick activation:</strong> Share your registered email and chosen plan
                        when you contact us — this speeds up your verification.
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}