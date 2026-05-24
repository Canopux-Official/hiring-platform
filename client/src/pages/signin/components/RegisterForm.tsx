// // components/SignIn/RegisterForm.tsx

// import {
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
//   onGoSignIn: () => void;
// }

// export default function RegisterForm({
//   role,
//   form,
//   err,
//   submitting,
//   onBack,
//   onField,
//   onSubmit,
//   onGoSignIn,
// }: Props) {
//   const [showPwd, setShowPwd] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);

//   return (
//     <motion.div
//       key="register"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//     >
//       <Card sx={{ p: { xs: 4, md: 6 }, maxWidth: 520, mx: "auto" }}>
//         <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
//           <IconButton size="small" onClick={onBack}>
//             <ArrowBackIcon />
//           </IconButton>
//           <Typography variant="overline" color="text.secondary">
//             {role === "recruiter" ? "Recruiter registration" : "Job seeker registration"}
//           </Typography>
//         </Stack>

//         <Typography variant="h4" sx={{ mb: 0.5 }}>
//           Create your account
//         </Typography>
//         <Typography color="text.secondary" sx={{ mb: 3 }}>
//           Join RagasHire as a {role === "recruiter" ? "recruiter" : "job seeker"}.
//         </Typography>

//         <form onSubmit={onSubmit}>
//           <Stack spacing={2}>
//             <TextField
//               label="Full name"
//               value={form.name}
//               onChange={onField("name")}
//               required
//               fullWidth
//               autoComplete="name"
//               inputProps={{ minLength: 2, maxLength: 50 }}
//             />
//             <TextField
//               label="Email"
//               type="email"
//               value={form.email}
//               onChange={onField("email")}
//               required
//               fullWidth
//               autoComplete="email"
//             />
//             <TextField
//               label="Phone (optional)"
//               type="tel"
//               value={form.phone}
//               onChange={onField("phone")}
//               fullWidth
//               autoComplete="tel"
//             />
//             <TextField
//               label="Password"
//               type={showPwd ? "text" : "password"}
//               value={form.password}
//               onChange={onField("password")}
//               required
//               fullWidth
//               autoComplete="new-password"
//               helperText="Min 8 chars, one uppercase letter, one number"
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
//             <TextField
//               label="Confirm password"
//               type={showConfirm ? "text" : "password"}
//               value={form.confirmPassword}
//               onChange={onField("confirmPassword")}
//               required
//               fullWidth
//               autoComplete="new-password"
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton onClick={() => setShowConfirm((v) => !v)} edge="end">
//                       {showConfirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
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
//             >
//               {submitting ? "Creating account…" : "Create Account"}
//             </Button>

//             <Divider>
//               <Typography variant="caption" color="text.secondary">or</Typography>
//             </Divider>

//             <Button variant="text" size="small" fullWidth onClick={onGoSignIn}>
//               Already have an account? Sign in
//             </Button>
//           </Stack>
//         </form>
//       </Card>
//     </motion.div>
//   );
// }


// components/SignIn/RegisterForm.tsx

import {
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

interface Props {
  role: Role;
  form: FormState;
  err: string;
  submitting: boolean;
  onBack: () => void;
  onField: (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onGoSignIn: () => void;
}

// ─── Free email providers (recruiters must use company email) ─────────────────

const FREE_EMAIL_DOMAINS = [
  "gmail.com", "yahoo.com", "hotmail.com", "outlook.com",
  "live.com", "icloud.com", "aol.com", "protonmail.com",
  "mail.com", "yandex.com", "zoho.com",
];

// ─── Validation ───────────────────────────────────────────────────────────────

function validateRegister(form: FormState, role: Role): Record<string, string> {
  const e: Record<string, string> = {};

  // Name
  if (!form.name?.trim()) {
    e.name = "Full name is required.";
  } else if (form.name.trim().length < 2) {
    e.name = "Name must be at least 2 characters.";
  } else if (form.name.trim().length > 50) {
    e.name = "Name cannot exceed 50 characters.";
  } else if (!/^[a-zA-Z\s'-]+$/.test(form.name.trim())) {
    e.name = "Name can only contain letters, spaces, hyphens, and apostrophes.";
  }

  // Email
  if (!form.email.trim()) {
    e.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    e.email = "Please enter a valid email address.";
  } else if (role === "recruiter") {
    const domain = form.email.trim().split("@")[1]?.toLowerCase();
    if (FREE_EMAIL_DOMAINS.includes(domain)) {
      e.email = "Recruiters must register with a company email address (e.g. you@yourcompany.com).";
    }
  }

  // Phone (optional but must be valid if provided)
  if (form.phone?.trim()) {
    const digits = form.phone.replace(/[\s\-\(\)\+]/g, "");
    if (!/^\d+$/.test(digits)) {
      e.phone = "Phone number can only contain digits, spaces, +, -, and parentheses.";
    } else if (digits.length < 7) {
      e.phone = "Phone number is too short.";
    } else if (digits.length > 15) {
      e.phone = "Phone number cannot exceed 15 digits.";
    }
  }

  // Password
  if (!form.password) {
    e.password = "Password is required.";
  } else if (form.password.length < 8) {
    e.password = "Password must be at least 8 characters.";
  } else if (!/[A-Z]/.test(form.password)) {
    e.password = "Password must contain at least one uppercase letter.";
  } else if (!/[0-9]/.test(form.password)) {
    e.password = "Password must contain at least one number.";
  } else if (form.password.length > 72) {
    e.password = "Password cannot exceed 72 characters.";
  }

  // Confirm password
  if (!form.confirmPassword) {
    e.confirmPassword = "Please confirm your password.";
  } else if (form.password !== form.confirmPassword) {
    e.confirmPassword = "Passwords do not match.";
  }

  return e;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function RegisterForm({
  role,
  form,
  err,
  submitting,
  onBack,
  onField,
  onSubmit,
  onGoSignIn,
}: Props) {
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const clearError = (key: string) =>
    setFieldErrors((prev) => { const next = { ...prev }; delete next[key]; return next; });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateRegister(form, role);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    onSubmit(e);
  };

  const passwordStrength = (): { label: string; color: string } | null => {
    const p = form.password;
    if (!p) return null;
    const score =
      (p.length >= 8 ? 1 : 0) +
      (/[A-Z]/.test(p) ? 1 : 0) +
      (/[0-9]/.test(p) ? 1 : 0) +
      (/[^a-zA-Z0-9]/.test(p) ? 1 : 0) +
      (p.length >= 12 ? 1 : 0);
    if (score <= 2) return { label: "Weak", color: "#ef4444" };
    if (score === 3) return { label: "Fair", color: "#f59e0b" };
    if (score === 4) return { label: "Good", color: "#3b82f6" };
    return { label: "Strong", color: "#22c55e" };
  };

  const strength = passwordStrength();

  return (
    <motion.div
      key="register"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card sx={{ p: { xs: 4, md: 6 }, maxWidth: 520, mx: "auto" }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
          <IconButton size="small" onClick={onBack}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="overline" color="text.secondary">
            {role === "recruiter" ? "Recruiter registration" : "Job seeker registration"}
          </Typography>
        </Stack>

        <Typography variant="h4" sx={{ mb: 0.5 }}>Create your account</Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          {role === "recruiter"
            ? "Register with your company email to start hiring."
            : "Join and find your next opportunity."}
        </Typography>

        <form onSubmit={handleSubmit} noValidate>
          <Stack spacing={2}>

            {/* Name */}
            <TextField
              label="Full name"
              value={form.name}
              onChange={(e) => { onField("name")(e as any); clearError("name"); }}
              required
              fullWidth
              autoComplete="name"
              error={!!fieldErrors.name}
              helperText={fieldErrors.name}
            />

            {/* Email */}
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
                (role === "recruiter"
                  ? "Must be a company email — e.g. you@yourcompany.com"
                  : undefined)
              }
            />

            {/* Phone */}
            <TextField
              label="Phone (optional)"
              type="tel"
              value={form.phone}
              onChange={(e) => { onField("phone")(e as any); clearError("phone"); }}
              fullWidth
              autoComplete="tel"
              error={!!fieldErrors.phone}
              helperText={fieldErrors.phone || "e.g. +91 98765 43210"}
            />

            {/* Password */}
            <TextField
              label="Password"
              type={showPwd ? "text" : "password"}
              value={form.password}
              onChange={(e) => { onField("password")(e as any); clearError("password"); }}
              required
              fullWidth
              autoComplete="new-password"
              error={!!fieldErrors.password}
              helperText={
                fieldErrors.password
                  ? fieldErrors.password
                  : strength
                  ? `Strength: ${strength.label}`
                  : "Min 8 chars, one uppercase letter, one number"
              }
              FormHelperTextProps={
                strength && !fieldErrors.password
                  ? { style: { color: strength.color } }
                  : undefined
              }
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

            {/* Confirm password */}
            <TextField
              label="Confirm password"
              type={showConfirm ? "text" : "password"}
              value={form.confirmPassword}
              onChange={(e) => { onField("confirmPassword")(e as any); clearError("confirmPassword"); }}
              required
              fullWidth
              autoComplete="new-password"
              error={!!fieldErrors.confirmPassword}
              helperText={fieldErrors.confirmPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirm((v) => !v)} edge="end">
                      {showConfirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
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
            >
              {submitting ? "Creating account…" : "Create Account"}
            </Button>

            <Divider>
              <Typography variant="caption" color="text.secondary">or</Typography>
            </Divider>

            <Button variant="text" size="small" fullWidth onClick={onGoSignIn}>
              Already have an account? Sign in
            </Button>

          </Stack>
        </form>
      </Card>
    </motion.div>
  );
}