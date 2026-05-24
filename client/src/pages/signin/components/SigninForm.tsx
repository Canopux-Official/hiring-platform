// components/SignIn/SignInForm.tsx

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
import { alpha } from "@mui/material/styles";
import { useState } from "react";
import { FormState, Role } from "../types/auth.types";
import { demoCredentials } from "../lib/auth";

interface Props {
  role: Role;
  form: FormState;
  err: string;
  submitting: boolean;
  onBack: () => void;
  onField: (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onGoRegister: () => void;
  onAutofill: () => void;
}

const ROLE_LABEL: Record<Role, string> = {
  recruiter: "Recruiter sign in",
  admin: "Admin sign in",
  job_seeker: "Job seeker sign in",
};

export default function SignInForm({
  role,
  form,
  err,
  submitting,
  onBack,
  onField,
  onSubmit,
  onGoRegister,
  onAutofill,
}: Props) {
  const [showPwd, setShowPwd] = useState(false);
  const accent = role === "admin" ? "#f472b6" : "#34d39e";

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

        <Typography variant="h4" sx={{ mb: 0.5 }}>
          Welcome back
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          {role === "admin"
            ? "Sign in with your admin credentials."
            : "Use the demo credentials or click autofill."}
        </Typography>

        <form onSubmit={onSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={onField("email")}
              required
              fullWidth
              autoComplete="email"
            />
            <TextField
              label="Password"
              type={showPwd ? "text" : "password"}
              value={form.password}
              onChange={onField("password")}
              required
              fullWidth
              autoComplete="current-password"
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
              sx={role === "admin" ? { bgcolor: accent, "&:hover": { bgcolor: "#ec4899" } } : {}}
            >
              {submitting ? "Signing in…" : "Sign In"}
            </Button>

            <Button
              onClick={onAutofill}
              variant="outlined"
              size="small"
              fullWidth
              disabled={submitting}
            >
              Autofill demo credentials
            </Button>

            {role !== "admin" && (
              <>
                <Divider>
                  <Typography variant="caption" color="text.secondary">or</Typography>
                </Divider>
                <Button variant="text" size="small" fullWidth onClick={onGoRegister}>
                  Don't have an account? Register
                </Button>
              </>
            )}
          </Stack>
        </form>

        <Box
          sx={{
            mt: 3,
            p: 2,
            bgcolor: alpha(accent, 0.06),
            borderRadius: 2,
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
            Demo account
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
            {demoCredentials[role].email}
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
            {demoCredentials[role].password}
          </Typography>
        </Box>
      </Card>
    </motion.div>
  );
}