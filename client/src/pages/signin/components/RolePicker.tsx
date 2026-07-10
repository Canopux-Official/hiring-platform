

import {
  Box,
  Typography,
  Button,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { motion } from "framer-motion";
import { alpha } from "@mui/material/styles";
import { AuthStep, Role, RoleOption } from "../types/auth.types";
import SplitLayout from "./SplitLayout";

const GREEN = "#059669";
const GREEN_DARK = "#047857";
const GREEN_LIGHT = "#d1fae5";
const BLUE = "#2563eb";
const BLUE_LIGHT = "#dbeafe";

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
  recruiter: <BusinessIcon sx={{ fontSize: 36 }} />,
  job_seeker: <PersonIcon sx={{ fontSize: 36 }} />,
  admin: <AdminPanelSettingsIcon sx={{ fontSize: 36 }} />,
};

function accentColor(role: Role) {
  return role === "admin" ? BLUE : GREEN;
}
function accentLight(role: Role) {
  return role === "admin" ? BLUE_LIGHT : GREEN_LIGHT;
}
function accentDark(role: Role) {
  return role === "admin" ? "#1d4ed8" : GREEN_DARK;
}

export default function RolePicker({ onPick }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <motion.div
      key="role"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <SplitLayout
        imageSrc="https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=900"
        imageAlt="Team collaborating in a modern office"
        headline="The right talent, at the right time."
        subline="Connecting ambitious professionals with the companies building the future."
        accentColor={GREEN}
        badges={[
          { icon: "✓", label: "Verified employers" },
          { icon: "⚡", label: "Fast matching" },
          { icon: "🌍", label: "Remote-friendly" },
        ]}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            color: "#0f172a",
            letterSpacing: "-0.02em",
            mb: 0.5,
            // ✅ Slightly smaller heading on mobile
            fontSize: { xs: "1.2rem", sm: "1.5rem" },
          }}
        >
          Welcome to Rozgaari
        </Typography>
        <Typography
          color="text.secondary"
          sx={{ fontSize: { xs: 13, sm: 14 }, mb: 3 }}
        >
          Choose how you'd like to use the platform
        </Typography>

        <Stack spacing={2}>
          {ROLE_OPTIONS.map((opt) => (
            <Box
              key={opt.value}
              sx={{
                border: `1px solid ${alpha(accentColor(opt.value), 0.18)}`,
                borderRadius: 2.5,
                p: { xs: 1.5, sm: 2 },
                display: "flex",
                // ✅ Stack vertically on mobile, row on sm+
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-start", sm: "center" },
                gap: { xs: 1.5, sm: 2 },
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: alpha(accentColor(opt.value), 0.5),
                  boxShadow: `0 4px 20px ${alpha(accentColor(opt.value), 0.12)}`,
                  transform: "translateY(-2px)",
                },
              }}
            >
              {/* Top row on mobile: icon + label side by side */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                {/* Icon */}
                <Box
                  sx={{
                    width: { xs: 44, sm: 52 },
                    height: { xs: 44, sm: 52 },
                    borderRadius: 2,
                    bgcolor: accentLight(opt.value),
                    color: accentColor(opt.value),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {ROLE_ICONS[opt.value]}
                </Box>

                {/* Label */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    fontWeight={700}
                    fontSize={{ xs: 13, sm: 14 }}
                    color="#0f172a"
                  >
                    {opt.title}
                  </Typography>
                  <Typography
                    fontSize={{ xs: 11, sm: 12 }}
                    color="text.secondary"
                    lineHeight={1.5}
                  >
                    {opt.desc}
                  </Typography>
                </Box>
              </Box>

              {/* Buttons — full width row on mobile */}
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  // ✅ Full width on mobile so buttons fill the card
                  width: { xs: "100%", sm: "auto" },
                  flexShrink: 0,
                }}
              >
                <Button
                  variant="contained"
                  size="small"
                  fullWidth={isMobile}
                  onClick={() => onPick(opt.value, "signIn")}
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: 13, sm: 12 },
                    px: { xs: 1.5, sm: 2 },
                    py: 0.8,
                    background: `linear-gradient(135deg, ${accentColor(opt.value)} 0%, ${accentDark(opt.value)} 100%)`,
                    boxShadow: `0 2px 10px ${alpha(accentColor(opt.value), 0.3)}`,
                    "&:hover": {
                      background: `linear-gradient(135deg, ${accentDark(opt.value)}, ${opt.value === "admin" ? "#1e40af" : "#065f46"})`,
                    },
                    whiteSpace: "nowrap",
                    textTransform: "none",
                  }}
                >
                  Sign in
                </Button>

                {opt.showRegister && (
                  <Button
                    variant="outlined"
                    size="small"
                    fullWidth={isMobile}
                    onClick={() => onPick(opt.value, "register")}
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: 13, sm: 12 },
                      px: { xs: 1.5, sm: 2 },
                      py: 0.8,
                      borderColor: alpha(GREEN, 0.35),
                      color: GREEN,
                      textTransform: "none",
                      whiteSpace: "nowrap",
                      "&:hover": { borderColor: GREEN, bgcolor: GREEN_LIGHT },
                    }}
                  >
                    Register
                  </Button>
                )}
              </Stack>
            </Box>
          ))}
        </Stack>
      </SplitLayout>
    </motion.div>
  );
}