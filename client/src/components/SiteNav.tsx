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
import logo from '../assets/logo.jpeg'
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";

// ── Design Tokens (Same as Hero) ─────────────────────────────────────
const GREEN = "#059669";
const GREEN_DARK = "#047857";
const BLUE = "#2563eb";
const BLUE_DARK = "#1d4ed8";

const SIDEBAR = "#0f172a";           // Dark slate (matches premium feel)
const SIDEBAR_ACTIVE = GREEN;        // Now uses your primary green
const SIDEBAR_HOVER = alpha(GREEN, 0.15);

const navLinks = [
  { to: "/jobs", label: "Find Jobs", icon: <WorkOutlineIcon sx={{ fontSize: 20 }} /> },
  { to: "/about", label: "About", icon: <PeopleOutlineIcon sx={{ fontSize: 20 }} /> },
  { to: "/pricing", label: "Pricing", icon: <SellOutlinedIcon sx={{ fontSize: 20 }} /> }
];

export default function SiteNav() {
  const { user, signOut } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawer, setDrawer] = useState(false);

  const getDashboardRoute = () => {
    if (user?.role === "admin") return "/admin";
    if (user?.role === "recruiter") return "/dashboard";
    return "/seeker";
  };

  const getRoleLabel = () => {
    if (user?.role === "admin") return "Admin";
    if (user?.role === "recruiter") return "Recruiter";
    return "Job Seeker";
  };

  const isActive = (path: string) => loc.pathname === path;

  // ── Shared Sidebar Content ──────────────────────────────────────
  const SidebarContent = ({ onClose }: { onClose?: () => void }) => (
    <Box
      sx={{
        width: 260,
        height: "100%",
        bgcolor: SIDEBAR,
        display: "flex",
        flexDirection: "column",
        py: 3,
      }}
    >
      {/* Logo */}
      <Box sx={{ px: 3, mb: 5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box
          component={RouterLink}
          to="/"
          onClick={onClose}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            textDecoration: "none"
          }}
        >
          {/* Custom Logo Image */}
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: `0 4px 18px ${alpha(GREEN, 0.4)}`,
              flexShrink: 0,
            }}
          >
            <img
              src={logo}
              alt="Rozgaari"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </Box>

          {/* Optional: Keep brand name next to logo */}
          <Typography sx={{
            fontWeight: 800,
            fontSize: 19,
            color: "#ffffff",
            letterSpacing: "-0.025em"
          }}>
            Rozgaari
          </Typography>
        </Box>

        {onClose && (
          <IconButton onClick={onClose} sx={{ color: alpha("#ffffff", 0.5), p: 0.5 }}>
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        )}
      </Box>

      {/* Main Menu Label */}
      <Typography sx={{
        px: 3, mb: 1.5, fontSize: 11, fontWeight: 700,
        letterSpacing: "0.12em", textTransform: "uppercase",
        color: alpha("#94a3b8", 0.7)
      }}>
        MAIN MENU
      </Typography>

      {/* Navigation Links */}
      <List sx={{ px: 2, flex: 1 }}>
        {navLinks.map((l) => {
          const active = isActive(l.to);
          return (
            <ListItemButton
              key={l.to}
              component={RouterLink}
              to={l.to}
              onClick={onClose}
              sx={{
                borderRadius: 2.5,
                mb: 0.5,
                px: 2.5,
                py: 1.4,
                bgcolor: active ? SIDEBAR_ACTIVE : "transparent",
                gap: 2,
                "&:hover": {
                  bgcolor: active ? SIDEBAR_ACTIVE : SIDEBAR_HOVER
                },
                transition: "all 0.2s ease",
              }}
            >
              <Box sx={{
                color: active ? "#ffffff" : alpha("#ffffff", 0.6),
                display: "flex"
              }}>
                {l.icon}
              </Box>
              <ListItemText
                primary={l.label}
                slotProps={{
                  primary: {
                    sx: {
                      fontSize: 15,
                      fontWeight: active ? 600 : 500,
                      color: active ? "#ffffff" : alpha("#e2e8f0", 0.85),
                    },
                  },
                }}
              />
            </ListItemButton>
          );
        })}

        {/* Dashboard for logged-in users */}
        {user && (
          <>
            <Divider sx={{ my: 2.5, borderColor: alpha("#ffffff", 0.08) }} />
            <Typography sx={{
              px: 3, mb: 1.5, fontSize: 11, fontWeight: 700,
              letterSpacing: "0.12em", textTransform: "uppercase",
              color: alpha("#94a3b8", 0.7)
            }}>
              MY ACCOUNT
            </Typography>
            <ListItemButton
              component={RouterLink}
              to={getDashboardRoute()}
              onClick={onClose}
              sx={{
                borderRadius: 2.5,
                mb: 0.5,
                px: 2.5,
                py: 1.4,
                gap: 2,
                bgcolor: isActive(getDashboardRoute()) ? SIDEBAR_ACTIVE : "transparent",
                "&:hover": { bgcolor: SIDEBAR_HOVER },
                transition: "all 0.2s ease",
              }}
            >
              <Box sx={{
                color: isActive(getDashboardRoute()) ? "#ffffff" : alpha("#ffffff", 0.6),
                display: "flex"
              }}>
                <DashboardOutlinedIcon sx={{ fontSize: 20 }} />
              </Box>
              <ListItemText
                primary="Dashboard"
                slotProps={{
                  primary: {
                    sx: {
                      fontSize: 15,
                      fontWeight: 500,
                      color: isActive(getDashboardRoute()) ? "#ffffff" : alpha("#e2e8f0", 0.85),
                    },
                  },
                }}
              />
            </ListItemButton>
          </>
        )}
      </List>

      {/* Bottom User Section */}
      <Box sx={{ px: 2, mt: "auto" }}>
        <Divider sx={{ mb: 3, borderColor: alpha("#ffffff", 0.08) }} />

        {user ? (
          <Box
            sx={{
              px: 2.5,
              py: 2,
              borderRadius: 3,
              bgcolor: alpha("#ffffff", 0.06),
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Avatar
              sx={{
                width: 38,
                height: 38,
                background: `linear-gradient(135deg, ${GREEN}, ${BLUE})`,
                color: "#fff",
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              {user.avatar}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{
                fontSize: 14,
                fontWeight: 600,
                color: "#ffffff",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}>
                {user.name}
              </Typography>
              <Typography sx={{
                fontSize: 12.5,
                color: alpha("#94a3b8", 0.8),
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}>
                {user.email}
              </Typography>
            </Box>
            <Tooltip title="Sign out">
              <IconButton
                onClick={() => { onClose?.(); signOut(); nav("/"); }}
                sx={{ color: alpha("#ffffff", 0.4), "&:hover": { color: "#f87171" } }}
              >
                <LogoutOutlinedIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </Box>
        ) : (
          <Stack spacing={1.5} sx={{ px: 1 }}>
            <Button
              fullWidth
              component={RouterLink}
              to="/signin"
              onClick={onClose}
              sx={{
                color: alpha("#e2e8f0", 0.8),
                borderRadius: 2.5,
                py: 1.4,
                fontSize: 14.5,
                border: `1px solid ${alpha("#ffffff", 0.15)}`,
                "&:hover": {
                  bgcolor: alpha("#ffffff", 0.08),
                  color: "#ffffff"
                },
              }}
            >
              Sign In
            </Button>

          </Stack>
        )}
      </Box>
    </Box>
  );

  // Desktop: Fixed Sidebar
  if (!isMobile) {
    return (
      <Box component="nav" sx={{
        width: 260,
        flexShrink: 0,
        position: "sticky",
        top: 0,
        height: "100vh",
        borderRight: `1px solid ${alpha("#ffffff", 0.08)}`
      }}>
        <SidebarContent />
      </Box>
    );
  }

  // Mobile: Top Bar + Drawer
  return (
    <>
      <Box
        component="nav"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1200,
          bgcolor: SIDEBAR,
          display: "flex",
          alignItems: "center",
          px: 3,
          height: 64,
          borderBottom: `1px solid ${alpha("#ffffff", 0.08)}`,
        }}
      >
        <Box
          component={RouterLink}
          to="/"
          sx={{ display: "flex", alignItems: "center", gap: 1.5, textDecoration: "none", flex: 1 }}
        >
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: "10px",
              display: "grid",
              placeItems: "center",
            }}
          >
            <img
              src={logo}
              alt="Rozgaari"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </Box>
          <Typography sx={{ fontWeight: 800, fontSize: 17, color: "#ffffff" }}>
            Rozgaari
          </Typography>
        </Box>

        <IconButton
          onClick={() => setDrawer(true)}
          sx={{
            color: alpha("#ffffff", 0.75),
            border: `1px solid ${alpha("#ffffff", 0.15)}`,
            borderRadius: 2,
            p: 1,
          }}
        >
          <MenuIcon sx={{ fontSize: 24 }} />
        </IconButton>
      </Box>

      <Drawer
        anchor="left"
        open={drawer}
        onClose={() => setDrawer(false)}
        slotProps={{ paper: { sx: { width: 260, bgcolor: SIDEBAR, border: "none" } } }}
      >
        <SidebarContent onClose={() => setDrawer(false)} />
      </Drawer>
    </>
  );
}