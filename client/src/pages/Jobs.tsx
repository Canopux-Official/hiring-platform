import { useState, useMemo } from "react";
import {
  Container, Typography, Box, TextField, InputAdornment, Stack, Chip, Card,
  CardContent, Grid, Button, MenuItem, Select, FormControl, InputLabel, Avatar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { alpha } from "@mui/material/styles";
import { useJobs, formatSalary, timeAgo } from "../lib/jobs-store";

const categories = ["All", "Engineering", "Design", "Hospitality", "Logistics", "Creative"];

export default function Jobs() {
  const { jobs } = useJobs();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [mode, setMode] = useState("All");

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      const matchQ = !q || (j.title + j.company + j.location + j.skills.join(" ")).toLowerCase().includes(q.toLowerCase());
      const matchCat = cat === "All" || j.category === cat;
      const matchMode = mode === "All" || j.workMode === mode;
      return matchQ && matchCat && matchMode;
    });
  }, [jobs, q, cat, mode]);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
      <Typography variant="h2" sx={{ fontSize: { xs: 32, md: 48 }, mb: 1 }}>Find your next role</Typography>
      <Typography color="text.secondary" sx={{ mb: 5 }}>{jobs.length} curated openings across the globe.</Typography>

      <Card sx={{ p: 3, mb: 4 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            fullWidth placeholder="Search role, company, skill…"
            value={q} onChange={(e) => setQ(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
          />
          <FormControl sx={{ minWidth: 160 }}>
            <InputLabel>Category</InputLabel>
            <Select value={cat} label="Category" onChange={(e) => setCat(e.target.value)}>
              {categories.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 160 }}>
            <InputLabel>Mode</InputLabel>
            <Select value={mode} label="Mode" onChange={(e) => setMode(e.target.value)}>
              {["All", "Remote", "Hybrid", "On-site"].map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
            </Select>
          </FormControl>
        </Stack>
      </Card>

      <Grid container spacing={2}>
        {filtered.map((j) => (
          <Grid item xs={12} key={j.id}>
            <Card sx={{ p: 3, transition: "border-color 0.3s", "&:hover": { borderColor: alpha("#34d39e", 0.4) } }}>
              <CardContent sx={{ p: 0 }}>
                <Stack direction={{ xs: "column", md: "row" }} spacing={3} alignItems={{ md: "center" }}>
                  <Avatar sx={{ width: 56, height: 56, bgcolor: alpha("#34d39e", 0.12), color: "primary.main", fontWeight: 800, fontSize: 22 }}>
                    {j.logo}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                      <Typography variant="h6">{j.title}</Typography>
                      {j.isUserPosted && <Chip size="small" label="NEW" color="primary" />}
                    </Stack>
                    <Stack direction="row" spacing={2} alignItems="center" color="text.secondary" sx={{ mb: 1 }}>
                      <Typography variant="body2">{j.company}</Typography>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <LocationOnIcon sx={{ fontSize: 14 }} />
                        <Typography variant="body2">{j.location}</Typography>
                      </Stack>
                      <Typography variant="body2">· {timeAgo(j.postedAt)}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      <Chip size="small" label={j.employmentType} variant="outlined" />
                      <Chip size="small" label={j.workMode} variant="outlined" />
                      {j.skills.slice(0, 3).map((s) => (
                        <Chip key={s} size="small" label={s} sx={{ bgcolor: alpha("#34d39e", 0.08), color: "primary.main" }} />
                      ))}
                    </Stack>
                  </Box>
                  <Box sx={{ textAlign: { xs: "left", md: "right" } }}>
                    <Typography variant="body2" color="text.secondary">Salary</Typography>
                    <Typography variant="h6" sx={{ color: "primary.main", mb: 1 }}>{formatSalary(j)}</Typography>
                    <Button variant="contained" size="small">Apply</Button>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {filtered.length === 0 && (
          <Grid item xs={12}>
            <Card sx={{ p: 6, textAlign: "center" }}>
              <Typography color="text.secondary">No jobs match your filters.</Typography>
            </Card>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}
