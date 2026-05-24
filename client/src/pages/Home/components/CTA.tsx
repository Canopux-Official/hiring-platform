import React from "react";
import { Box, Container, Typography, Button, Card } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { alpha } from "@mui/material/styles";

export function CTA() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
      <Card sx={{
        p: { xs: 5, md: 8 }, textAlign: "center",
        background: `linear-gradient(135deg, ${alpha("#34d39e", 0.15)}, ${alpha("#7c9cff", 0.1)})`,
        border: `1px solid ${alpha("#34d39e", 0.3)}`,
      }}>
        <Typography variant="h2" sx={{ fontSize: { xs: 32, md: 44 }, mb: 2 }}>Ready to hire smarter?</Typography>
        <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: "auto" }}>
          Join thousands of companies hiring across every category, every continent.
        </Typography>
        <Button variant="contained" size="large" component={RouterLink} to="/signin" sx={{ py: 1.5, px: 5 }}>
          Start hiring today
        </Button>
      </Card>
    </Container>
  );
}
