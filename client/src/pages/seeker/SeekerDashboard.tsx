// src/pages/seeker/SeekerDashboard.tsx
import { useState, useEffect, useCallback } from "react";
import {
  Container,
  Grid,
  Card,
  Typography,
  Stack,
  Box,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Snackbar,
  LinearProgress,
  Avatar,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import WorkIcon from "@mui/icons-material/Work";
import StarIcon from "@mui/icons-material/Star";
import { useAuth } from "../signin/lib/auth";

import { getMyProfile, updateMyProfile, getMyApplications, getRecommendedJobs, withdrawApplication } from "./services/seeker";
import RecommendedTab from "./components/RecommendedTab";
import ApplicationsTab from "./components/ApplicationsTab";
import { normalizeProfile, profileCompletion } from "./lib/seeker";
import ProfileTab from "./components/ProfileTab";


export default function SeekerDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState(0);

  const [profile, setProfile] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [recommended, setRecommended] = useState<any[]>([]);

  const [loading, setLoading] = useState({ profile: true, apps: true, jobs: true });
  const [saving, setSaving] = useState(false);

  const [toast, setToast] = useState<{ 
    open: boolean; 
    message: string; 
    severity: "success" | "error" 
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const showToast = (message: string, severity: "success" | "error" = "success") => {
    setToast({ open: true, message, severity });
  };

  const closeToast = () => setToast((t) => ({ ...t, open: false }));

  // Load Data
  useEffect(() => {
    Promise.all([
      getMyProfile()
        .then((p) => setProfile(normalizeProfile(p as any)))
        .catch((err) => showToast(err.message || "Failed to load profile", "error"))
        .finally(() => setLoading((l) => ({ ...l, profile: false }))),

      getMyApplications()
        .then((apps) => setApplications(apps as any))
        .catch((err) => showToast(err.message || "Failed to load applications", "error"))
        .finally(() => setLoading((l) => ({ ...l, apps: false }))),

      getRecommendedJobs()
        .then((jobs) => setRecommended(jobs as any))
        .catch(() => {}) // Silent fail for recommendations
        .finally(() => setLoading((l) => ({ ...l, jobs: false }))),
    ]);
  }, []);

  const handleSaveProfile = useCallback(async (patch: any) => {
    setSaving(true);
    try {
      const updated = await updateMyProfile(patch);
      setProfile(normalizeProfile(updated as any));
      showToast("Profile updated successfully!");
    } catch (err: any) {
      showToast(err.message || "Failed to save profile. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  }, []);

  const handleWithdraw = useCallback(async (id: string) => {
    try {
      await withdrawApplication(id);
      setApplications((prev) => prev.filter((a) => a._id !== id));
      showToast("Application withdrawn successfully");
    } catch (err: any) {
      showToast(err.message || "Failed to withdraw application", "error");
    }
  }, []);

  const completion = profileCompletion(profile);
  const pending = applications.filter((a) => a.status === "pending").length;
  const shortlisted = applications.filter((a) => a.status === "shortlisted").length;
  const hired = applications.filter((a) => a.status === "hired").length;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      {/* Header */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="overline" color="primary.main">Talent Workspace</Typography>
        <Typography variant="h3" sx={{ fontWeight: 800, fontSize: { xs: 28, md: 36 } }}>
          Hi {user?.name?.split(" ")[0]}!
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Sidebar */}
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 3, mb: 3, textAlign: "center" }}>
            <Avatar
              sx={{ width: 80, height: 80, mx: "auto", mb: 2, background: "linear-gradient(135deg, #7c3aed, #a78bfa)", color: "#fff", fontSize: 32 }}
            >
              {user?.name?.[0]}
            </Avatar>
            <Typography variant="h6" fontWeight={700}>{user?.name}</Typography>
            {profile?.headline && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {profile.headline}
              </Typography>
            )}

            <Box sx={{ mt: 3, display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 80, height: 80, borderRadius: "50%",
                  border: "4px solid #ede9fe",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: `conic-gradient(#7c3aed ${completion * 3.6}deg, #ede9fe 0deg)`,
                  boxShadow: "0 0 0 4px #fff",
                }}
              >
                <Box sx={{ width: 64, height: 64, borderRadius: "50%", bgcolor: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "#7c3aed", fontSize: 18 }}>{completion}%</Typography>
                </Box>
              </Box>
            </Box>
            <Typography variant="caption" color="text.secondary">Profile Completion</Typography>
          </Card>

          {/* Stats */}
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Applications</Typography>
            {loading.apps ? (
              <LinearProgress />
            ) : (
              <Stack spacing={1.5}>
                {[
                  { label: "Total", value: applications.length },
                  { label: "Pending", value: pending },
                  { label: "Shortlisted", value: shortlisted },
                  { label: "Hired", value: hired },
                ].map((s) => (
                  <Stack key={s.label} direction="row" justifyContent="space-between">
                    <Typography variant="body2">{s.label}</Typography>
                    <Typography variant="body2" fontWeight={700}>{s.value}</Typography>
                  </Stack>
                ))}
              </Stack>
            )}
          </Card>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={9}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)}>
              <Tab label="Edit Profile" icon={<EditIcon />} iconPosition="start" />
              <Tab label={`Applications (${applications.length})`} icon={<WorkIcon />} iconPosition="start" />
              <Tab label={`Recommended (${recommended.length})`} icon={<StarIcon />} iconPosition="start" />
            </Tabs>
          </Box>

          {tab === 0 && (
            loading.profile ? <CircularProgress /> : profile ? (
              <ProfileTab profile={profile} saving={saving} onSave={handleSaveProfile} />
            ) : (
              <Alert severity="error">Failed to load profile</Alert>
            )
          )}

          {tab === 1 && (
            <ApplicationsTab 
              applications={applications} 
              loading={loading.apps} 
              onWithdraw={handleWithdraw} 
            />
          )}

          {tab === 2 && (
            <RecommendedTab jobs={recommended} loading={loading.jobs} />
          )}
        </Grid>
      </Grid>

      {/* Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={closeToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={closeToast} severity={toast.severity} variant="filled">
          {toast.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}