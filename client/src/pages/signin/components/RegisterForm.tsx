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

        <Typography variant="h4" sx={{ mb: 0.5 }}>
          Create your account
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Join RagasHire as a {role === "recruiter" ? "recruiter" : "job seeker"}.
        </Typography>

        <form onSubmit={onSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Full name"
              value={form.name}
              onChange={onField("name")}
              required
              fullWidth
              autoComplete="name"
              inputProps={{ minLength: 2, maxLength: 50 }}
            />
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
              label="Phone (optional)"
              type="tel"
              value={form.phone}
              onChange={onField("phone")}
              fullWidth
              autoComplete="tel"
            />
            <TextField
              label="Password"
              type={showPwd ? "text" : "password"}
              value={form.password}
              onChange={onField("password")}
              required
              fullWidth
              autoComplete="new-password"
              helperText="Min 8 chars, one uppercase letter, one number"
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
            <TextField
              label="Confirm password"
              type={showConfirm ? "text" : "password"}
              value={form.confirmPassword}
              onChange={onField("confirmPassword")}
              required
              fullWidth
              autoComplete="new-password"
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