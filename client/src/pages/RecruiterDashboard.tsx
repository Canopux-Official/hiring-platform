import { useState } from "react";
import {
  Container, Grid, Card, Typography, Stack, Button, Box, Chip, IconButton,
  Avatar, LinearProgress, Menu, MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import WorkIcon from "@mui/icons-material/Work";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { alpha } from "@mui/material/styles";
import { useJobs, formatSalary, timeAgo } from "../lib/jobs-store";
import { useAuth } from "../lib/auth";
import NewJobModal from "../components/NewJobModal";

export default function RecruiterDashboard() {
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<{ el: HTMLElement; id: string } | null>(null);
  const { jobs, deleteJob, duplicateJob } = useJobs();
  const { user } = useAuth();

  const stats = [
    { label: "Active jobs", value: jobs.length, icon: <WorkIcon />, delta: "+12%" },
    { label: "Candidates", value: "1,284", icon: <PeopleAltIcon />, delta: "+34%" },
    { label: "Interviews", value: "47", icon: <TrendingUpIcon />, delta: "+8%" },
    { label: "Profile views", value: "12.4k", icon: <VisibilityIcon />, delta: "+22%" },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={2} sx={{ mb: 4 }}>
        <Box>
          <Typography variant="overline" color="primary.main">Recruiter workspace</Typography>
          <Typography variant="h3" sx={{ fontSize: { xs: 28, md: 36 } }}>Welcome back, {user?.name.split(" ")[0]}</Typography>
        </Box>
        <Button variant="contained" size="large" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
          New Job
        </Button>
      </Stack>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((s) => (
          <Grid item xs={6} md={3} key={s.label}>
            <Card sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: alpha("#34d39e", 0.12), color: "primary.main" }}>{s.icon}</Box>
                <Chip size="small" label={s.delta} sx={{ bgcolor: alpha("#34d39e", 0.12), color: "primary.main", fontWeight: 600 }} />
              </Stack>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>{s.value}</Typography>
              <Typography variant="body2" color="text.secondary">{s.label}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
              <Typography variant="h6">Active Jobs</Typography>
              <Typography variant="body2" color="text.secondary">{jobs.length} total</Typography>
            </Stack>
            <Stack spacing={2}>
              {jobs.slice(0, 6).map((j) => (
                <Box key={j.id} sx={{
                  p: 2, borderRadius: 2, border: `1px solid ${alpha("#ffffff", 0.06)}`,
                  display: "flex", alignItems: "center", gap: 2,
                  "&:hover": { borderColor: alpha("#34d39e", 0.4) },
                }}>
                  <Avatar sx={{ bgcolor: alpha("#34d39e", 0.12), color: "primary.main", fontWeight: 700 }}>{j.logo}</Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>{j.title}</Typography>
                      {j.isUserPosted && <Chip size="small" label="NEW" color="primary" />}
                    </Stack>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {j.company} · {j.location} · {timeAgo(j.postedAt)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: { xs: "none", md: "block" }, textAlign: "right" }}>
                    <Typography variant="body2" sx={{ color: "primary.main", fontWeight: 600 }}>{formatSalary(j)}</Typography>
                    <Typography variant="caption" color="text.secondary">{j.workMode}</Typography>
                  </Box>
                  <IconButton onClick={(e) => setAnchor({ el: e.currentTarget, id: j.id })}><MoreVertIcon /></IconButton>
                </Box>
              ))}
            </Stack>
            <Menu anchorEl={anchor?.el} open={!!anchor} onClose={() => setAnchor(null)}>
              <MenuItem onClick={() => { if (anchor) duplicateJob(anchor.id); setAnchor(null); }}>Duplicate</MenuItem>
              <MenuItem onClick={() => { if (anchor) deleteJob(anchor.id); setAnchor(null); }} sx={{ color: "error.main" }}>Delete</MenuItem>
            </Menu>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Pipeline health</Typography>
            {[
              { label: "Applications", value: 82, color: "primary.main" },
              { label: "Screened", value: 64, color: "secondary.main" },
              { label: "Interviewed", value: 38, color: "warning.main" },
              { label: "Offers", value: 12, color: "success.main" },
            ].map((p) => (
              <Box key={p.label} sx={{ mb: 2 }}>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                  <Typography variant="body2">{p.label}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{p.value}%</Typography>
                </Stack>
                <LinearProgress variant="determinate" value={p.value} sx={{ height: 6, borderRadius: 3 }} />
              </Box>
            ))}
          </Card>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Recent activity</Typography>
            <Stack spacing={1.5}>
              {[
                "Maya Sundaram applied to Sr. Designer",
                "Diego Marín accepted interview slot",
                "Aisha Karim shortlisted by AI match",
                "Job 'Brand Director' got 12 new applicants",
              ].map((a, i) => (
                <Typography key={i} variant="body2" color="text.secondary">· {a}</Typography>
              ))}
            </Stack>
          </Card>
        </Grid>
      </Grid>

      <NewJobModal open={open} onClose={() => setOpen(false)} />
    </Container>
  );
}
