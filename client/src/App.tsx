import { Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import SiteNav from "./components/SiteNav";
import SiteFooter from "./components/SiteFooter";
import Home from "./pages/Home"; 
import RecruiterDashboard from "./pages/RecruiterDashboard";

import AdminDashboard from "./pages/AdminDashboard";

import { useAuth } from "./pages/signin/lib/auth"; // to  be changed
import type { Role } from "./pages/signin/lib/auth"; // to be changed
import SignIn from "./pages/signin/SignIn";
import SeekerDashboard from "./pages/seeker/SeekerDashboard";
import Jobs from "./pages/jobs/Jobs";
import AboutPage from "./pages/About";
import PricingPage from "./pages/Pricing";

// ─── Role-based redirect helper ────────────────────────────────────────────────

function roleHome(role: Role): string {
  if (role === "admin") return "/admin";
  if (role === "recruiter") return "/dashboard";
  return "/seeker";
}

// ─── Generic role guard ─────────────────────────────────────────────────────────
function RequireRole({ role, children }: { role: Role | Role[]; children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/signin" replace />;
  const allowed = Array.isArray(role) ? role : [role];
  if (!allowed.includes(user.role)) return <Navigate to={roleHome(user.role)} replace />;
  return <>{children}</>;
}

// ─── App ────────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    // Sidebar + content side-by-side on desktop; stacked on mobile
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: { xs: "column", md: "row" }, bgcolor: "background.default" }}>
      <SiteNav />
      {/* Main area grows to fill remaining space */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Box component="main" sx={{ flex: 1 }}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/pricing" element={<PricingPage />} />

            {/* Protected — Recruiter */}
            <Route
              path="/dashboard"
              element={
                <RequireRole role="recruiter">
                  <RecruiterDashboard />
                </RequireRole>
              }
            />

            {/* Protected — Job Seeker */}
            <Route
              path="/seeker"
              element={
                <RequireRole role="job_seeker">
                  <SeekerDashboard />
                </RequireRole>
              }
            />

            {/* Protected — Admin */}
            <Route
              path="/admin"
              element={
                <RequireRole role="admin">
                  <AdminDashboard />
                </RequireRole>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
        <SiteFooter />
      </Box>
    </Box>
  );
}