import { Box, Container, Typography, Stack, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { alpha } from "@mui/material/styles";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import logo from '../assets/logo.png';
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";

// Design Tokens
const GREEN = "#059669";
const GREEN_DARK = "#047857";
const BLUE = "#2563eb";

export default function SiteFooter() {
  return (
    <Box component="footer" sx={{
      bgcolor: "#010e11",
      pt: { xs: 8, md: 12 },
      pb: { xs: 6, md: 8 },
      color: "#f1f5f9"
    }}>
      <Container maxWidth="lg">
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={{ xs: 6, md: 10 }} sx={{ mb: { xs: 8, md: 10 } }}>

          {/* Brand Section */}
          <Box sx={{ maxWidth: 380 }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
              <Box
                sx={{
                  width: 46,
                  height: 46,
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: `0 0 20px ${alpha(GREEN, 0.5)}`,
                  flexShrink: 0,
                }}
              >
                <img
                  src={logo}
                  alt="PerfectHire"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>

              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: 20,
                  letterSpacing: "-0.025em",
                  color: "#ffffff"
                }}
              >
                PerfectHire
              </Typography>
            </Stack>

            <Typography sx={{
              color: alpha("#e2e8f0", 0.75),
              fontSize: 15.5,
              lineHeight: 1.8,
              maxWidth: 340,
              mb: 4
            }}>
              The AI-powered global hiring platform. Connecting exceptional talent across 140+ countries —
              matched intelligently, verified by humans.
            </Typography>

            {/* Contact Info in Brand Section */}
            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <LocationOnOutlinedIcon sx={{ color: GREEN, fontSize: 20 }} />
                <Typography sx={{ color: alpha("#e2e8f0", 0.75), fontSize: 15 }}>
                  Elder House, E-11, Off New Link Rd, Veera Desai Industrial Estate, Andheri West, Mumbai, Maharashtra 400053
                </Typography>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={1.5}>
                <PhoneOutlinedIcon sx={{ color: GREEN, fontSize: 20 }} />
                <Typography sx={{ color: alpha("#e2e8f0", 0.75), fontSize: 15 }}>
                  +91 6299209560
                </Typography>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={1.5}>
                <EmailOutlinedIcon sx={{ color: GREEN, fontSize: 20 }} />
                <Typography sx={{ color: alpha("#e2e8f0", 0.75), fontSize: 15 }}>
                  hrragasworld@gmail.com
                </Typography>
              </Stack>
            </Stack>
          </Box>

          {/* Links */}
          <Stack direction="row" spacing={{ xs: 8, md: 12 }}>

            <Stack spacing={2.5}>
              <Typography sx={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: alpha("#94a3b8", 0.7)
              }}>
                Platform
              </Typography>
              {[
                { label: "Find Jobs", to: "/jobs" },
                { label: "Talent Marketplace", to: "/talent" },
                { label: "For Recruiters", to: "/dashboard" }
              ].map((l) => (
                <Link
                  key={l.label}
                  component={RouterLink}
                  to={l.to}
                  underline="hover"
                  sx={{
                    color: alpha("#e2e8f0", 0.75),
                    fontSize: 15,
                    "&:hover": { color: GREEN },
                    transition: "color 0.2s ease"
                  }}
                >
                  {l.label}
                </Link>
              ))}
            </Stack>

            <Stack spacing={2.5}>
              <Typography sx={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: alpha("#94a3b8", 0.7)
              }}>
                Company
              </Typography>
              {["About Us", "Blog", "Careers", "Contact"].map((l) => (
                <Link
                  key={l}
                  href="#"
                  underline="hover"
                  sx={{
                    color: alpha("#e2e8f0", 0.75),
                    fontSize: 15,
                    "&:hover": { color: GREEN },
                    transition: "color 0.2s ease"
                  }}
                >
                  {l}
                </Link>
              ))}
            </Stack>
          </Stack>
        </Stack>

        {/* Bottom Bar */}
        <Box sx={{
          pt: 5,
          borderTop: `1px solid ${alpha("#ffffff", 0.08)}`,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 3
        }}>
          <Typography sx={{ color: alpha("#94a3b8", 0.6), fontSize: 13.5 }}>
            © {new Date().getFullYear()} PerfectHire. All rights reserved.
          </Typography>

          <Stack direction="row" spacing={4}>
            {["Privacy Policy", "Terms of Service", "Cookies"].map((l) => (
              <Link
                key={l}
                href="#"
                underline="hover"
                sx={{
                  color: alpha("#94a3b8", 0.6),
                  fontSize: 13.5,
                  "&:hover": { color: "#e2e8f0" },
                  transition: "color 0.2s ease"
                }}
              >
                {l}
              </Link>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}