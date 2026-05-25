 

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

// // Free email providers â€” recruiters should not use these
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
//   const accent = role === "admin" ? "#f472b6" : "#7c3aed";

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

//         <Typography variant="h4" sx={{ mb: 0.5 }}>Welcome back</Typography>
//         <Typography color="text.secondary" sx={{ mb: 3 }}>
//           {role === "recruiter"
//             ? "Sign in with your company email."
//             : role === "admin"
//             ? "Sign in with your admin credentials."
//             : "Sign in to find your next opportunity."}
//         </Typography>

//         <form onSubmit={handleSubmit} noValidate>
//           <Stack spacing={2}>
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
//               sx={role === "admin" ? { bgcolor: accent, "&:hover": { bgcolor: "#ec4899" } } : {}}
//             >
//               {submitting ? "Signing inâ€¦" : "Sign In"}
//             </Button>

//             {role !== "admin" && (
//               <>
//                 <Divider>
//                   <Typography variant="caption" color="text.secondary">or</Typography>
//                 </Divider>
//                 <Button variant="text" size="small" fullWidth onClick={onGoRegister}>
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
  Card,
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

// ── Design Tokens (Consistent with Hero) ─────────────────────────────
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

// Free email providers — recruiters should not use these
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

export default function SignInForm({
  role,
  form,
  err,
  submitting,
  onBack,
  onField,
  onSubmit,
  onGoRegister,
}: Props) {
  const [showPwd, setShowPwd] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const isAdmin = role === "admin";
  const accentColor = isAdmin ? BLUE : GREEN;
  const accentDark = isAdmin ? BLUE_DARK : GREEN_DARK;

  const clearError = (key: string) =>
    setFieldErrors((prev) => { const next = { ...prev }; delete next[key]; return next; });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateSignIn(form, role);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
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
      <Card sx={{ p: { xs: 4, md: 6 }, maxWidth: 480, mx: "auto" }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
          <IconButton size="small" onClick={onBack}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="overline" color="text.secondary">
            {ROLE_LABEL[role]}
          </Typography>
        </Stack>

        <Typography 
          variant="h4" 
          sx={{ mb: 0.5, fontWeight: 700, color: "#0f172a" }}
        >
          Welcome back
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
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
              error={!!fieldErrors.email}
              helperText={
                fieldErrors.email ||
                (role === "recruiter" ? "Use your company email address." : undefined)
              }
            />
            <TextField
              label="Password"
              type={showPwd ? "text" : "password"}
              value={form.password}
              onChange={(e) => { onField("password")(e as any); clearError("password"); }}
              required
              fullWidth
              autoComplete="current-password"
              error={!!fieldErrors.password}
              helperText={fieldErrors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPwd((v) => !v)} edge="end">
                      {showPwd ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {err && <Alert severity="error">{err}</Alert>}

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : undefined}
              sx={{
                py: 1.75,
                fontSize: 16,
                fontWeight: 700,
                background: `linear-gradient(135deg, ${accentColor} 0%, ${accentDark} 100%)`,
                boxShadow: `0 4px 20px ${alpha(accentColor, 0.35)}`,
                "&:hover": {
                  background: `linear-gradient(135deg, ${accentDark}, ${isAdmin ? "#1e40af" : "#065f46"})`,
                  boxShadow: `0 6px 24px ${alpha(accentColor, 0.45)}`,
                },
              }}
            >
              {submitting ? "Signing in…" : "Sign In"}
            </Button>

            {role !== "admin" && (
              <>
                <Divider>
                  <Typography variant="caption" color="text.secondary">or</Typography>
                </Divider>
                <Button 
                  variant="text" 
                  size="small" 
                  fullWidth 
                  onClick={onGoRegister}
                  sx={{ 
                    color: BLUE, 
                    "&:hover": { color: BLUE_DARK, background: "transparent" } 
                  }}
                >
                  Don't have an account? Register
                </Button>
              </>
            )}
          </Stack>
        </form>
      </Card>
    </motion.div>
  );
}