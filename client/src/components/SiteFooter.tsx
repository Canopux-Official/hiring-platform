import { Box, Container, Typography, Stack, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { alpha } from "@mui/material/styles";

export default function SiteFooter() {
  return (
    <Box component="footer" sx={{ mt: 10, borderTop: `1px solid ${alpha("#ffffff", 0.06)}`, py: 6 }}>
      <Container maxWidth="lg">
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={4}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>RagasHire</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, maxWidth: 360 }}>
              The AI-powered global hiring platform. From executive search to skilled trades — verified, ranked and matched in real time.
            </Typography>
          </Box>
          <Stack direction="row" spacing={4}>
            <Stack spacing={1}>
              <Typography variant="overline" color="text.secondary">Platform</Typography>
              <Link component={RouterLink} to="/jobs" color="text.primary" underline="hover">Jobs</Link>
              <Link component={RouterLink} to="/talent" color="text.primary" underline="hover">Talent</Link>
              <Link component={RouterLink} to="/dashboard" color="text.primary" underline="hover">Recruiters</Link>
            </Stack>
            <Stack spacing={1}>
              <Typography variant="overline" color="text.secondary">Company</Typography>
              <Link href="#" color="text.primary" underline="hover">About</Link>
              <Link href="#" color="text.primary" underline="hover">Press</Link>
              <Link href="#" color="text.primary" underline="hover">Contact</Link>
            </Stack>
          </Stack>
        </Stack>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 5 }}>
          © {new Date().getFullYear()} RagasHire. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
