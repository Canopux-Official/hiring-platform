import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar, Toolbar, Box, Button, IconButton, Avatar, Menu, MenuItem, Chip,
  Stack, Typography, useMediaQuery, useTheme, Drawer, List, ListItemButton, ListItemText,
} from "@mui/material";
import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import HubOutlinedIcon from "@mui/icons-material/HubOutlined";
import { useAuth } from "../lib/auth";
import { alpha } from "@mui/material/styles";

const links = [
  { to: "/jobs", label: "Find Jobs" },
  { to: "/talent", label: "Talent" },
];

export default function SiteNav() {
  const { user, signOut } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const [drawer, setDrawer] = useState(false);

  const getDashboardRoute = () => {
    if (user?.role === "admin") return "/admin";
    if (user?.role === "recruiter") return "/dashboard";
    return "/seeker";
  };

  // Helper function to return the user's role display string
  const getRoleLabel = () => {
    if (user?.role === "admin") return "Admin";
    if (user?.role === "recruiter") return "Recruiter";
    return "Job Seeker";
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: alpha("#0c1014", 0.7),
        backdropFilter: "blur(18px)",
        borderBottom: `1px solid ${alpha("#ffffff", 0.06)}`,
      }}
    >
      <Toolbar sx={{ maxWidth: 1280, mx: "auto", width: "100%", px: { xs: 2, md: 4 } }}>
        <Box component={RouterLink} to="/" sx={{ display: "flex", alignItems: "center", gap: 1.2, textDecoration: "none", color: "text.primary" }}>
          <Box sx={{
            width: 36, height: 36, borderRadius: 2,
            background: "linear-gradient(135deg, #34d39e, #0fae7c)",
            display: "grid", placeItems: "center",
            boxShadow: `0 0 24px ${alpha("#34d39e", 0.5)}`,
          }}>
            <HubOutlinedIcon sx={{ color: "#06140f", fontSize: 22 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: "-0.02em" }}>HireSphere</Typography>
        </Box>

        {!isMobile && (
          <Stack direction="row" spacing={1} sx={{ ml: 5, flex: 1 }}>
            {links.map((l) => (
              <Button
                key={l.to}
                component={RouterLink}
                to={l.to}
                sx={{
                  color: loc.pathname === l.to ? "primary.main" : "text.secondary",
                  fontWeight: 500,
                  "&:hover": { color: "primary.main", bgcolor: "transparent" },
                }}
              >
                {l.label}
              </Button>
            ))}
          </Stack>
        )}

        <Box sx={{ flex: isMobile ? 1 : 0 }} />

        {user ? (
          <>
            <Chip
              label={getRoleLabel()}
              size="small"
              sx={{ mr: 1.5, bgcolor: alpha("#34d39e", 0.12), color: "primary.main", fontWeight: 600, display: { xs: "none", sm: "inline-flex" } }}
            />
            <IconButton onClick={(e) => setAnchor(e.currentTarget)} sx={{ p: 0 }}>
              <Avatar sx={{ width: 36, height: 36, bgcolor: "primary.main", color: "primary.contrastText", fontWeight: 700, fontSize: 14 }}>
                {user.avatar}
              </Avatar>
            </IconButton>
            <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)}>
              <MenuItem disabled>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{user.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                </Box>
              </MenuItem>
              <MenuItem onClick={() => { setAnchor(null); nav(getDashboardRoute()); }}>
                Dashboard
              </MenuItem>
              <MenuItem onClick={() => { setAnchor(null); signOut(); nav("/"); }}>Sign out</MenuItem>
            </Menu>
          </>
        ) : (
          <Stack direction="row" spacing={1}>
            {!isMobile && (
              <Button component={RouterLink} to="/signin" sx={{ color: "text.secondary" }}>
                Sign In
              </Button>
            )}
            <Button variant="contained" component={RouterLink} to="/signin">
              Get Started
            </Button>
          </Stack>
        )}

        {isMobile && (
          <IconButton onClick={() => setDrawer(true)} sx={{ ml: 1 }}>
            <MenuIcon />
          </IconButton>
        )}

        <Drawer anchor="right" open={drawer} onClose={() => setDrawer(false)}>
          <Box sx={{ width: 260, pt: 2 }}>
            <List>
              {links.map((l) => (
                <ListItemButton key={l.to} component={RouterLink} to={l.to} onClick={() => setDrawer(false)}>
                  <ListItemText primary={l.label} />
                </ListItemButton>
              ))}
              {!user && (
                <ListItemButton component={RouterLink} to="/signin" onClick={() => setDrawer(false)}>
                  <ListItemText primary="Sign In" />
                </ListItemButton>
              )}
            </List>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}
