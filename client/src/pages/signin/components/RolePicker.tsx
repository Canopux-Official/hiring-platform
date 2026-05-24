// components/SignIn/RolePicker.tsx

import {
  Box,
  Grid,
  Typography,
  Card,
  Button,
  Stack,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { motion } from "framer-motion";
import { alpha } from "@mui/material/styles";
import { AuthStep, Role, RoleOption } from "../types/auth.types";

interface Props {
  onPick: (role: Role, step: AuthStep) => void;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    value: "recruiter",
    title: "Recruiter / Hirer",
    desc: "Post jobs, find verified talent, manage pipelines.",
    showRegister: true,
  },
  {
    value: "job_seeker",
    title: "Job Seeker",
    desc: "Get matched, apply faster, track every conversation.",
    showRegister: true,
  },
  {
    value: "admin",
    title: "Administrator",
    desc: "Manage platform users, jobs, and all applications.",
    showRegister: false,
  },
];

const ROLE_ICONS: Record<Role, React.ReactNode> = {
  recruiter: <BusinessIcon sx={{ fontSize: 40 }} />,
  job_seeker: <PersonIcon sx={{ fontSize: 40 }} />,
  admin: <AdminPanelSettingsIcon sx={{ fontSize: 40 }} />,
};

function accentColor(role: Role): string {
  return role === "admin" ? "#f472b6" : "#34d39e";
}

export default function RolePicker({ onPick }: Props) {
  return (
    <motion.div
      key="role"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Box sx={{ textAlign: "center", mb: 5 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: 32, md: 48 }, mb: 1 }}>
          Welcome to RagasHire
        </Typography>
        <Typography color="text.secondary">
          Choose how you'd like to use the platform
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {ROLE_OPTIONS.map((opt) => (
          <Grid
            item
            xs={12}
            md={opt.value === "admin" ? 12 : 6}
            key={opt.value}
          >
            <Card
              sx={{
                p: 4,
                cursor: "pointer",
                height: "100%",
                transition: "all 0.3s",
                ...(opt.value === "admin" && {
                  borderColor: alpha("#f472b6", 0.2),
                  maxWidth: { md: 400 },
                  mx: "auto",
                }),
                "&:hover": {
                  transform: "translateY(-6px)",
                  borderColor: alpha(accentColor(opt.value), 0.5),
                  boxShadow: `0 0 60px -10px ${alpha(accentColor(opt.value), 0.4)}`,
                },
              }}
            >
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: 3,
                  mb: 3,
                  bgcolor: alpha(accentColor(opt.value), 0.12),
                  color:
                    opt.value === "admin" ? "#f472b6" : "primary.main",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                {ROLE_ICONS[opt.value]}
              </Box>
              <Typography variant="h5" sx={{ mb: 1 }}>
                {opt.title}
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                {opt.desc}
              </Typography>

              <Stack direction="row" spacing={1.5}>
                <Button
                  variant="contained"
                  size="small"
                  fullWidth
                  onClick={() => onPick(opt.value, "signIn")}
                  sx={
                    opt.value === "admin"
                      ? { bgcolor: "#f472b6", "&:hover": { bgcolor: "#ec4899" } }
                      : {}
                  }
                >
                  Sign In
                </Button>
                {opt.showRegister && (
                  <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    onClick={() => onPick(opt.value, "register")}
                  >
                    Register
                  </Button>
                )}
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>
    </motion.div>
  );
}