 


// import {
//   Box,
//   Card,
//   Typography,
//   Stack,
//   TextField,
//   Button,
//   IconButton,
//   Alert,
//   InputAdornment,
//   Divider,
//   CircularProgress,
// } from "@mui/material";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { motion } from "framer-motion";
// import { useState } from "react";
// import { FormState, Role } from "../types/auth.types";
// import { alpha } from "@mui/material/styles";

// // ── Design Tokens (Consistent with Hero) ─────────────────────────────
// const GREEN = "#059669";
// const GREEN_DARK = "#047857";
// const BLUE = "#2563eb";
// const BLUE_DARK = "#1d4ed8";

// interface Props {
//   role: Role;
//   form: FormState;
//   err: string;
//   submitting: boolean;
//   onBack: () => void;
//   onField: (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => void;
//   onSubmit: (e: React.FormEvent) => void;
//   onGoRegister: () => void;
// }

// const ROLE_LABEL: Record<Role, string> = {
//   recruiter: "Recruiter sign in",
//   admin: "Admin sign in",
//   job_seeker: "Job seeker sign in",
// };

// // Free email providers — recruiters should not use these
// const FREE_EMAIL_DOMAINS = [
//   "gmail.com", "yahoo.com", "hotmail.com", "outlook.com",
//   "live.com", "icloud.com", "aol.com", "protonmail.com",
//   "mail.com", "yandex.com", "zoho.com",
// ];

// function validateSignIn(form: FormState, role: Role): Record<string, string> {
//   const e: Record<string, string> = {};

//   if (!form.email.trim()) {
//     e.email = "Email is required.";
//   } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
//     e.email = "Please enter a valid email address.";
//   } else if (role === "recruiter") {
//     const domain = form.email.trim().split("@")[1]?.toLowerCase();
//     if (FREE_EMAIL_DOMAINS.includes(domain)) {
//       e.email = "Recruiters must sign in with a company email address.";
//     }
//   }

//   if (!form.password) {
//     e.password = "Password is required.";
//   } else if (form.password.length < 8) {
//     e.password = "Password must be at least 8 characters.";
//   }

//   return e;
// }

// export default function SignInForm({
//   role,
//   form,
//   err,
//   submitting,
//   onBack,
//   onField,
//   onSubmit,
//   onGoRegister,
// }: Props) {
//   const [showPwd, setShowPwd] = useState(false);
//   const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

//   const isAdmin = role === "admin";
//   const accentColor = isAdmin ? BLUE : GREEN;
//   const accentDark = isAdmin ? BLUE_DARK : GREEN_DARK;

//   const clearError = (key: string) =>
//     setFieldErrors((prev) => { const next = { ...prev }; delete next[key]; return next; });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     const errors = validateSignIn(form, role);
//     if (Object.keys(errors).length > 0) {
//       setFieldErrors(errors);
//       return;
//     }
//     setFieldErrors({});
//     onSubmit(e);
//   };

//   return (
//     <motion.div
//       key="signIn"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//     >
//       <Card sx={{ p: { xs: 4, md: 6 }, maxWidth: 480, mx: "auto" }}>
//         <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
//           <IconButton size="small" onClick={onBack}>
//             <ArrowBackIcon />
//           </IconButton>
//           <Typography variant="overline" color="text.secondary">
//             {ROLE_LABEL[role]}
//           </Typography>
//         </Stack>

//         <Typography 
//           variant="h4" 
//           sx={{ mb: 0.5, fontWeight: 700, color: "#0f172a" }}
//         >
//           Welcome back
//         </Typography>
//         <Typography color="text.secondary" sx={{ mb: 4 }}>
//           {role === "recruiter"
//             ? "Sign in with your company email."
//             : role === "admin"
//             ? "Sign in with your admin credentials."
//             : "Sign in to find your next opportunity."}
//         </Typography>

//         <form onSubmit={handleSubmit} noValidate>
//           <Stack spacing={2.5}>
//             <TextField
//               label="Email"
//               type="email"
//               value={form.email}
//               onChange={(e) => { onField("email")(e as any); clearError("email"); }}
//               required
//               fullWidth
//               autoComplete="email"
//               error={!!fieldErrors.email}
//               helperText={
//                 fieldErrors.email ||
//                 (role === "recruiter" ? "Use your company email address." : undefined)
//               }
//             />
//             <TextField
//               label="Password"
//               type={showPwd ? "text" : "password"}
//               value={form.password}
//               onChange={(e) => { onField("password")(e as any); clearError("password"); }}
//               required
//               fullWidth
//               autoComplete="current-password"
//               error={!!fieldErrors.password}
//               helperText={fieldErrors.password}
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton onClick={() => setShowPwd((v) => !v)} edge="end">
//                       {showPwd ? <VisibilityOffIcon /> : <VisibilityIcon />}
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//             />

//             {err && <Alert severity="error">{err}</Alert>}

//             <Button
//               type="submit"
//               variant="contained"
//               size="large"
//               fullWidth
//               disabled={submitting}
//               startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : undefined}
//               sx={{
//                 py: 1.75,
//                 fontSize: 16,
//                 fontWeight: 700,
//                 background: `linear-gradient(135deg, ${accentColor} 0%, ${accentDark} 100%)`,
//                 boxShadow: `0 4px 20px ${alpha(accentColor, 0.35)}`,
//                 "&:hover": {
//                   background: `linear-gradient(135deg, ${accentDark}, ${isAdmin ? "#1e40af" : "#065f46"})`,
//                   boxShadow: `0 6px 24px ${alpha(accentColor, 0.45)}`,
//                 },
//               }}
//             >
//               {submitting ? "Signing in…" : "Sign In"}
//             </Button>

//             {role !== "admin" && (
//               <>
//                 <Divider>
//                   <Typography variant="caption" color="text.secondary">or</Typography>
//                 </Divider>
//                 <Button 
//                   variant="text" 
//                   size="small" 
//                   fullWidth 
//                   onClick={onGoRegister}
//                   sx={{ 
//                     color: BLUE, 
//                     "&:hover": { color: BLUE_DARK, background: "transparent" } 
//                   }}
//                 >
//                   Don't have an account? Register
//                 </Button>
//               </>
//             )}
//           </Stack>
//         </form>
//       </Card>
//     </motion.div>
//   );
// }

import {
  Box,
  Typography,
  Stack,
  TextField,
  Button,
  IconButton,
  Alert,
  InputAdornment,
  Divider,
  CircularProgress,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { motion } from "framer-motion";
import { useState } from "react";
import { FormState, Role } from "../types/auth.types";
import { alpha } from "@mui/material/styles";
import SplitLayout from "./SplitLayout";

const GREEN = "#059669";
const GREEN_DARK = "#047857";
const BLUE = "#2563eb";
const BLUE_DARK = "#1d4ed8";

interface Props {
  role: Role;
  form: FormState;
  err: string;
  submitting: boolean;
  onBack: () => void;
  onField: (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onGoRegister: () => void;
}

const ROLE_LABEL: Record<Role, string> = {
  recruiter: "Recruiter sign in",
  admin: "Admin sign in",
  job_seeker: "Job seeker sign in",
};

const FREE_EMAIL_DOMAINS = [
  "gmail.com", "yahoo.com", "hotmail.com", "outlook.com",
  "live.com", "icloud.com", "aol.com", "protonmail.com",
  "mail.com", "yandex.com", "zoho.com",
];

function validateSignIn(form: FormState, role: Role): Record<string, string> {
  const e: Record<string, string> = {};
  if (!form.email.trim()) {
    e.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    e.email = "Please enter a valid email address.";
  } else if (role === "recruiter") {
    const domain = form.email.trim().split("@")[1]?.toLowerCase();
    if (FREE_EMAIL_DOMAINS.includes(domain)) {
      e.email = "Recruiters must sign in with a company email address.";
    }
  }
  if (!form.password) {
    e.password = "Password is required.";
  } else if (form.password.length < 8) {
    e.password = "Password must be at least 8 characters.";
  }
  return e;
}

// Per-role image + copy config
const PANEL_CONFIG: Record<Role, {
  imageSrc: string; imageAlt: string; headline: string; subline: string;
  badges: { icon: string; label: string }[];
}> = {
  recruiter: {
    imageSrc: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=900",
    imageAlt: "Professional working at a laptop in a bright office",
    headline: "Welcome back — your pipeline awaits.",
    subline: "Access your candidates, open roles, and interviews all from one place.",
    badges: [{ icon: "🔒", label: "Secure login" }, { icon: "👥", label: "10k+ recruiters" }],
  },
  job_seeker: {
    imageSrc: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=900",
    imageAlt: "Person reviewing opportunities on a laptop",
    headline: "Your next opportunity is one login away.",
    subline: "Pick up where you left off — track applications, messages, and new matches.",
    badges: [{ icon: "🎯", label: "Smart matching" }, { icon: "📬", label: "Live alerts" }],
  },
  admin: {
    imageSrc: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=900",
    imageAlt: "Admin overview dashboard on a large screen",
    headline: "Platform control, fully in your hands.",
    subline: "Review accounts, manage jobs, and keep the platform running smoothly.",
    badges: [{ icon: "🛡️", label: "Admin access" }, { icon: "📊", label: "Full analytics" }],
  },
};

export default function SignInForm({
  role, form, err, submitting, onBack, onField, onSubmit, onGoRegister,
}: Props) {
  const [showPwd, setShowPwd] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const isAdmin = role === "admin";
  const accent = isAdmin ? BLUE : GREEN;
  const accentDark = isAdmin ? BLUE_DARK : GREEN_DARK;
  const panel = PANEL_CONFIG[role];

  const clearError = (key: string) =>
    setFieldErrors((prev) => { const next = { ...prev }; delete next[key]; return next; });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateSignIn(form, role);
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return; }
    setFieldErrors({});
    onSubmit(e);
  };

  return (
    <motion.div
      key="signIn"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <SplitLayout
        imageSrc={panel.imageSrc}
        imageAlt={panel.imageAlt}
        headline={panel.headline}
        subline={panel.subline}
        accentColor={accent}
        badges={panel.badges}
      >
        {/* Back + role label */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
          <IconButton size="small" onClick={onBack} sx={{ p: 0.5 }}>
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <Typography variant="overline" color="text.secondary" sx={{ lineHeight: 1 }}>
            {ROLE_LABEL[role]}
          </Typography>
        </Stack>

        <Typography
          variant="h5"
          sx={{ fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em", mb: 0.5 }}
        >
          Welcome back
        </Typography>
        <Typography color="text.secondary" sx={{ fontSize: 14, mb: 3 }}>
          {role === "recruiter"
            ? "Sign in with your company email."
            : role === "admin"
            ? "Sign in with your admin credentials."
            : "Sign in to find your next opportunity."}
        </Typography>

        <form onSubmit={handleSubmit} noValidate>
          <Stack spacing={2.5}>
            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => { onField("email")(e as any); clearError("email"); }}
              required
              fullWidth
              autoComplete="email"
              size="small"
              error={!!fieldErrors.email}
              helperText={
                fieldErrors.email ||
                (role === "recruiter" ? "Use your company email address." : undefined)
              }
              sx={fieldSx(accent)}
            />
            <TextField
              label="Password"
              type={showPwd ? "text" : "password"}
              value={form.password}
              onChange={(e) => { onField("password")(e as any); clearError("password"); }}
              required
              fullWidth
              autoComplete="current-password"
              size="small"
              error={!!fieldErrors.password}
              helperText={fieldErrors.password}
              sx={fieldSx(accent)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPwd((v) => !v)} edge="end" size="small">
                      {showPwd ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {err && <Alert severity="error" sx={{ borderRadius: 2, fontSize: 13 }}>{err}</Alert>}

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : undefined}
              sx={{
                py: 1.5,
                fontSize: 15,
                fontWeight: 700,
                textTransform: "none",
                borderRadius: 2,
                background: `linear-gradient(135deg, ${accent} 0%, ${accentDark} 100%)`,
                boxShadow: `0 4px 20px ${alpha(accent, 0.35)}`,
                "&:hover": {
                  background: `linear-gradient(135deg, ${accentDark}, ${isAdmin ? "#1e40af" : "#065f46"})`,
                  boxShadow: `0 6px 24px ${alpha(accent, 0.45)}`,
                },
              }}
            >
              {submitting ? "Signing in…" : "Sign in"}
            </Button>

            {role !== "admin" && (
              <>
                <Divider sx={{ fontSize: 12 }}>
                  <Typography variant="caption" color="text.secondary">or</Typography>
                </Divider>
                <Button
                  variant="text"
                  size="small"
                  fullWidth
                  onClick={onGoRegister}
                  sx={{
                    color: BLUE,
                    textTransform: "none",
                    fontSize: 13,
                    "&:hover": { color: BLUE_DARK, background: "transparent" },
                  }}
                >
                  Don't have an account? Register
                </Button>
              </>
            )}
          </Stack>
        </form>
      </SplitLayout>
    </motion.div>
  );
}

function fieldSx(accent: string) {
  return {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      fontSize: 14,
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: accent },
    },
    "& .MuiInputLabel-root.Mui-focused": { color: accent },
  };
}