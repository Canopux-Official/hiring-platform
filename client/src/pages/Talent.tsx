import { Container, Typography, Grid, Card, CardContent, Avatar, Stack, Chip, Box, Button } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { alpha } from "@mui/material/styles";

const talent = [
  { name: "Maya Sundaram", role: "Staff Product Designer", location: "Bangalore, IN", skills: ["Figma", "Design Systems", "AI/UX"], match: 96, rate: "$140/hr", avatar: "MS" },
  { name: "Diego Marín", role: "Senior Rust Engineer", location: "Lisbon, PT", skills: ["Rust", "Tokio", "Postgres"], match: 94, rate: "€95/hr", avatar: "DM" },
  { name: "Aisha Karim", role: "Brand Director", location: "Dubai, UAE", skills: ["Brand Strategy", "Art Direction"], match: 92, rate: "AED 800/hr", avatar: "AK" },
  { name: "Jonas Weber", role: "Logistics Operations Lead", location: "Hamburg, DE", skills: ["Fleet Ops", "Last-mile"], match: 89, rate: "€78k/yr", avatar: "JW" },
  { name: "Priya Iyer", role: "Hospitality Manager", location: "Mumbai, IN", skills: ["Luxury Service", "Team Lead"], match: 87, rate: "₹18L/yr", avatar: "PI" },
  { name: "Tom O'Connor", role: "Backend Engineer", location: "Dublin, IE", skills: ["Go", "Kubernetes", "AWS"], match: 91, rate: "€85/hr", avatar: "TO" },
];

export default function Talent() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
      <Typography variant="h2" sx={{ fontSize: { xs: 32, md: 48 }, mb: 1 }}>Explore world-class talent</Typography>
      <Typography color="text.secondary" sx={{ mb: 5 }}>Verified profiles, scored by our AI match engine.</Typography>

      <Grid container spacing={3}>
        {talent.map((t) => (
          <Grid item xs={12} sm={6} md={4} key={t.name}>
            <Card sx={{ p: 3, height: "100%", transition: "transform 0.3s", "&:hover": { transform: "translateY(-4px)" } }}>
              <CardContent sx={{ p: 0 }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <Avatar sx={{ width: 56, height: 56, background: "linear-gradient(135deg, #7c3aed, #a78bfa)", color: "#fff", fontWeight: 700 }}>{t.avatar}</Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6">{t.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{t.role}</Typography>
                  </Box>
                  <Box sx={{ textAlign: "center", px: 1.5, py: 0.5, bgcolor: "#ede9fe", borderRadius: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={0.3}>
                      <StarIcon sx={{ fontSize: 14, color: "#7c3aed" }} />
                      <Typography variant="caption" sx={{ color: "#7c3aed", fontWeight: 700 }}>{t.match}%</Typography>
                    </Stack>
                  </Box>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{t.location} · {t.rate}</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
                  {t.skills.map((s) => <Chip key={s} size="small" label={s} variant="outlined" />)}
                </Stack>
                <Button fullWidth variant="contained">Connect</Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
