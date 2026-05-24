import React from "react";
import { Box, Container, Typography, Stack, Card, CardContent, Grid, Avatar } from "@mui/material";

const testimonials = [
  { name: "Lena Park", role: "Head of Talent, FlowState AI", quote: "We filled three staff engineering seats in 11 days. RagasHire's match scores were genuinely accurate.", avatar: "LP" },
  { name: "Rohan Mehta", role: "COO, RapidMile", quote: "Hiring 200 riders used to take a month. Now it's two weeks and the retention is up.", avatar: "RM" },
  { name: "Amélie Roux", role: "Founder, Northwave Studio", quote: "The creative pool is curated. Every shortlist felt hand-picked.", avatar: "AR" },
];

export function Testimonials() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography variant="overline" color="primary.main" sx={{ letterSpacing: "0.2em" }}>Trusted by teams</Typography>
        <Typography variant="h2" sx={{ fontSize: { xs: 32, md: 44 }, mt: 1 }}>Real stories. Real hires.</Typography>
      </Box>
      <Grid container spacing={3}>
        {testimonials.map((t) => (
          <Grid item xs={12} md={4} key={t.name}>
            <Card sx={{ p: 3, height: "100%" }}>
              <CardContent sx={{ p: 0 }}>
                <Typography sx={{ mb: 3, lineHeight: 1.7 }}>"{t.quote}"</Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: "primary.main", color: "primary.contrastText", fontWeight: 700 }}>{t.avatar}</Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{t.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{t.role}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
