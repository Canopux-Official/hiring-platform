import { Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import SiteNav from "./components/SiteNav";
import SiteFooter from "./components/SiteFooter";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import Talent from "./pages/Talent";
import SignIn from "./pages/SignIn";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import SeekerDashboard from "./pages/SeekerDashboard";
import { useAuth } from "./lib/auth";

function RequireRole({ role, children }: { role: "recruiter" | "job_seeker"; children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/signin" replace />;
  if (user.role !== role) return <Navigate to={user.role === "recruiter" ? "/dashboard" : "/seeker"} replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "background.default" }}>
      <SiteNav />
      <Box component="main" sx={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/talent" element={<Talent />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/dashboard" element={<RequireRole role="recruiter"><RecruiterDashboard /></RequireRole>} />
          <Route path="/seeker" element={<RequireRole role="job_seeker"><SeekerDashboard /></RequireRole>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
      <SiteFooter />
    </Box>
  );
}
