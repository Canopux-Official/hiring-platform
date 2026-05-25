import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import {
  Box, Button, IconButton, Avatar, Menu, MenuItem, Chip,
  Stack, Typography, useMediaQuery, useTheme, Drawer, List,
  ListItemButton, ListItemText, Divider, Tooltip,
} from "@mui/material";
import { useState, useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import HubOutlinedIcon from "@mui/icons-material/HubOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import { useAuth } from "../pages/signin/lib/auth";
import { alpha } from "@mui/material/styles";

// ── Sidebar palette ─────────────────────────────────────────────
const SIDEBAR   = "#111827";
const SIDEBAR_ACTIVE = "#7c3aed";
const SIDEBAR_HOVER  = alpha("#7c3aed", 0.15);
const VIOLET    = "#7c3aed";

const navLinks = [
  { to: "/jobs",   label: "Find Jobs",  icon: <WorkOutlineIcon sx={{ fontSize: 20 }} /> },
  { to: "/talent", label: "Talent",     icon: <PeopleOutlineIcon sx={{ fontSize: 20 }} /> },
];

export default function SiteNav() {
  const { user, signOut } = useAuth();
  const nav  = useNavigate();
  const loc  = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const [drawer, setDrawer] = useState(false);

  const getDashboardRoute = () => {
    if (user?.role === "admin")     return "/admin";
    if (user?.role === "recruiter") return "/dashboard";
    return "/seeker";
  };

  const getRoleLabel = () => {
    if (user?.role === "admin")     return "Admin";
    if (user?.role === "recruiter") return "Recruiter";
    return "Job Seeker";
  };

  const isActive = (path: string) => loc.pathname === path;

  // ── Shared sidebar content ──────────────────────────────────────
  const SidebarContent = ({ onClose }: { onClose?: () => void }) => (
    <Box
      sx={{
        width: 240,
        height: "100%",
        bgcolor: SIDEBAR,
        display: "flex",
        flexDirection: "column",
        py: 3,
      }}
    >
      {/* Logo */}
      <Box sx={{ px: 3, mb: 4, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box
          component={RouterLink}
          to="/"
          onClick={onClose}
          sx={{ display: "flex", alignItems: "center", gap: 1.5, textDecoration: "none" }}
        >
          <Box
            sx={{
              width: 36, height: 36, borderRadius: "10px",
              background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
              display: "grid", placeItems: "center",
              boxShadow: `0 4px 14px ${alpha(VIOLET, 0.5)}`,
              flexShrink: 0,
            }}
          >
            <HubOutlinedIcon sx={{ color: "#ffffff", fontSize: 20 }} />
          </Box>
          <Typography sx={{ fontWeight: 800, fontSize: 17, color: "#ffffff", letterSpacing: "-0.02em" }}>
            RagasHire
          </Typography>
        </Box>
        {onClose && (
          <IconButton onClick={onClose} sx={{ color: alpha("#ffffff", 0.4), p: 0.5 }}>
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        )}
      </Box>

      {/* Nav section label */}
      <Typography sx={{ px: 3, mb: 1, fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: alpha("#ffffff", 0.3) }}>
        Main Menu
      </Typography>

      {/* Nav links */}
      <List sx={{ px: 1.5, flex: 1 }}>
        {navLinks.map((l) => {
          const active = isActive(l.to);
          return (
            <ListItemButton
              key={l.to}
              component={RouterLink}
              to={l.to}
              onClick={onClose}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                px: 2,
                py: 1.25,
                bgcolor: active ? SIDEBAR_ACTIVE : "transparent",
                gap: 1.5,
                "&:hover": { bgcolor: active ? SIDEBAR_ACTIVE : SIDEBAR_HOVER },
                transition: "background 0.15s",
              }}
            >
              <Box sx={{ color: active ? "#ffffff" : alpha("#ffffff", 0.5), display: "flex" }}>
                {l.icon}
              </Box>
              <ListItemText
                primary={l.label}
                slotProps={{
                  primary: {
                    sx: {
                      fontSize: 14.5,
                      fontWeight: active ? 600 : 500,
                      color: active ? "#ffffff" : alpha("#ffffff", 0.6),
                    },
                  },
                }}
              />
            </ListItemButton>
          );
        })}

        {/* Dashboard link if logged in */}
        {user && (
          <>
            <Divider sx={{ my: 2, borderColor: alpha("#ffffff", 0.08) }} />
            <Typography sx={{ px: 1.5, mb: 1, fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: alpha("#ffffff", 0.3) }}>
              My Account
            </Typography>
            <ListItemButton
              component={RouterLink}
              to={getDashboardRoute()}
              onClick={onClose}
              sx={{
                borderRadius: 2, mb: 0.5, px: 2, py: 1.25, gap: 1.5,
                bgcolor: isActive(getDashboardRoute()) ? SIDEBAR_ACTIVE : "transparent",
                "&:hover": { bgcolor: SIDEBAR_HOVER },
                transition: "background 0.15s",
              }}
            >
              <Box sx={{ color: isActive(getDashboardRoute()) ? "#ffffff" : alpha("#ffffff", 0.5), display: "flex" }}>
                <DashboardOutlinedIcon sx={{ fontSize: 20 }} />
              </Box>
              <ListItemText
                primary="Dashboard"
                slotProps={{
                  primary: {
                    sx: {
                      fontSize: 14.5, fontWeight: 500,
                      color: isActive(getDashboardRoute()) ? "#ffffff" : alpha("#ffffff", 0.6),
                    },
                  },
                }}
              />
            </ListItemButton>
          </>
        )}
      </List>

      {/* Bottom user section */}
      <Box sx={{ px: 1.5, mt: "auto" }}>
        <Divider sx={{ mb: 2, borderColor: alpha("#ffffff", 0.08) }} />
        {user ? (
          <Box
            sx={{
              px: 2, py: 1.5, borderRadius: 2,
              bgcolor: alpha("#ffffff", 0.05),
              display: "flex", alignItems: "center", gap: 1.5,
            }}
          >
            <Avatar
              sx={{
                width: 34, height: 34,
                background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
                color: "#fff", fontWeight: 700, fontSize: 13, flexShrink: 0,
              }}
            >
              {user.avatar}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#ffffff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user.name}
              </Typography>
              <Typography sx={{ fontSize: 11, color: alpha("#ffffff", 0.4), whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user.email}
              </Typography>
            </Box>
            <Tooltip title="Sign out">
              <IconButton
                onClick={() => { onClose?.(); signOut(); nav("/"); }}
                sx={{ color: alpha("#ffffff", 0.35), p: 0.5, "&:hover": { color: "#f87171" } }}
              >
                <LogoutOutlinedIcon sx={{ fontSize: 17 }} />
              </IconButton>
            </Tooltip>
          </Box>
        ) : (
          <Stack spacing={1.5} sx={{ px: 0.5 }}>
            <Button
              fullWidth component={RouterLink} to="/signin" onClick={onClose}
              sx={{
                color: alpha("#ffffff", 0.6), borderRadius: 2, py: 1.2, fontSize: 14,
                border: `1px solid ${alpha("#ffffff", 0.12)}`,
                "&:hover": { bgcolor: alpha("#ffffff", 0.06), color: "#ffffff" },
              }}
            >
              Sign In
            </Button>
            <Button
              fullWidth variant="contained" component={RouterLink} to="/signin" onClick={onClose}
              sx={{
                py: 1.2, fontSize: 14, fontWeight: 600, borderRadius: 2,
                background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
                color: "#ffffff",
                boxShadow: `0 4px 14px ${alpha(VIOLET, 0.4)}`,
                "&:hover": { background: "linear-gradient(135deg, #6d28d9, #8b5cf6)" },
              }}
            >
              Get Started
            </Button>
          </Stack>
        )}
      </Box>
    </Box>
  );

  // ── Desktop: fixed sidebar ──────────────────────────────────────
  if (!isMobile) {
    return (
      <Box component="nav" sx={{ width: 240, flexShrink: 0, position: "sticky", top: 0, height: "100vh" }}>
        <SidebarContent />
      </Box>
    );
  }

  // ── Mobile: top bar + drawer ────────────────────────────────────
  return (
    <>
      <Box
        component="nav"
        sx={{
          position: "sticky", top: 0, zIndex: 1200,
          bgcolor: SIDEBAR,
          display: "flex", alignItems: "center",
          px: 2, height: 60,
          borderBottom: `1px solid ${alpha("#ffffff", 0.08)}`,
        }}
      >
        <Box component={RouterLink} to="/" sx={{ display: "flex", alignItems: "center", gap: 1.5, textDecoration: "none", flex: 1 }}>
          <Box sx={{ width: 32, height: 32, borderRadius: "8px", background: "linear-gradient(135deg, #7c3aed, #a78bfa)", display: "grid", placeItems: "center" }}>
            <HubOutlinedIcon sx={{ color: "#ffffff", fontSize: 18 }} />
          </Box>
          <Typography sx={{ fontWeight: 800, fontSize: 16, color: "#ffffff" }}>RagasHire</Typography>
        </Box>
        <IconButton onClick={() => setDrawer(true)} sx={{ color: alpha("#ffffff", 0.7), border: `1px solid ${alpha("#ffffff", 0.12)}`, borderRadius: 1.5, p: 0.75 }}>
          <MenuIcon sx={{ fontSize: 22 }} />
        </IconButton>
      </Box>

      <Drawer anchor="left" open={drawer} onClose={() => setDrawer(false)}
        slotProps={{ paper: { sx: { width: 240, bgcolor: SIDEBAR, border: "none" } } }}
      >
        <SidebarContent onClose={() => setDrawer(false)} />
      </Drawer>
    </>
  );
}
