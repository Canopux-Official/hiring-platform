import { Box, Container, Typography, Stack, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { alpha } from "@mui/material/styles";
import HubOutlinedIcon from "@mui/icons-material/HubOutlined";

export default function SiteFooter() {
  return (
    <Box component="footer" sx={{ bgcolor: "#111827", pt: { xs: 8, md: 12 }, pb: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={{ xs: 6, md: 8 }} sx={{ mb: { xs: 6, md: 10 } }}>

          {/* Brand */}
          <Box sx={{ maxWidth: 360 }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
              <Box sx={{ width: 36, height: 36, borderRadius: "10px", background: "linear-gradient(135deg, #7c3aed, #a78bfa)", display: "grid", placeItems: "center", boxShadow: "0 0 16px rgba(124,58,237,0.4)" }}>
                <HubOutlinedIcon sx={{ color: "#ffffff", fontSize: 20 }} />
              </Box>
              <Typography sx={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.025em", color: "#f9fafb" }}>
                RagasHire
              </Typography>
            </Stack>
            <Typography sx={{ color: alpha("#9ca3af", 0.8), fontSize: 14.5, lineHeight: 1.75 }}>
              The AI-powered global hiring platform. From executive search to skilled trades — verified, ranked and matched in real time.
            </Typography>
          </Box>

          {/* Links */}
          <Stack direction="row" spacing={{ xs: 6, md: 10 }}>
            <Stack spacing={2}>
              <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: alpha("#9ca3af", 0.4) }}>
                Platform
              </Typography>
              {[{ label: "Find Jobs", to: "/jobs" }, { label: "Talent", to: "/talent" }, { label: "Recruiters", to: "/dashboard" }].map((l) => (
                <Link key={l.label} component={RouterLink} to={l.to} underline="hover" sx={{ color: alpha("#e5e7eb", 0.6), fontSize: 14.5, "&:hover": { color: "#a78bfa" }, transition: "color 0.18s" }}>
                  {l.label}
                </Link>
              ))}
            </Stack>
            <Stack spacing={2}>
              <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: alpha("#9ca3af", 0.4) }}>
                Company
              </Typography>
              {["About", "Press", "Contact"].map((l) => (
                <Link key={l} href="#" underline="hover" sx={{ color: alpha("#e5e7eb", 0.6), fontSize: 14.5, "&:hover": { color: "#a78bfa" }, transition: "color 0.18s" }}>
                  {l}
                </Link>
              ))}
            </Stack>
          </Stack>
        </Stack>

        {/* Bottom bar */}
        <Box sx={{ pt: 4, borderTop: `1px solid ${alpha("#ffffff", 0.08)}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
          <Typography sx={{ color: alpha("#9ca3af", 0.45), fontSize: 13 }}>
            © {new Date().getFullYear()} RagasHire. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={3}>
            {["Privacy", "Terms", "Cookies"].map((l) => (
              <Link key={l} href="#" underline="hover" sx={{ color: alpha("#9ca3af", 0.45), fontSize: 13, "&:hover": { color: "#a78bfa" }, transition: "color 0.18s" }}>
                {l}
              </Link>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
