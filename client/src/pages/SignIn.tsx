// pages/SignIn.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Card,
  Typography,
  Stack,
  TextField,
  Button,
  IconButton,
  Alert,
  InputAdornment,
  Grid,
  Divider,
  CircularProgress,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { motion, AnimatePresence } from "framer-motion";
import { alpha } from "@mui/material/styles";
import { useAuth, demoCredentials, type Role } from "../lib/auth";

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = "role" | "signIn" | "register";

interface FormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}

const emptyForm = (): FormState => ({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
});

// ─── Role → route mapping ─────────────────────────────────────────────────────

function roleHome(role: Role): string {
  if (role === "admin") return "/admin";
  if (role === "recruiter") return "/dashboard";
  return "/seeker";
}

// ─── Password strength ────────────────────────────────────────────────────────

function validatePassword(pwd: string): string | null {
  if (pwd.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(pwd)) return "Must contain an uppercase letter.";
  if (!/[0-9]/.test(pwd)) return "Must contain a number.";
  return null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SignIn() {
  const [step, setStep] = useState<Step>("role");
  const [role, setRole] = useState<Role>("recruiter");
  const [form, setForm] = useState<FormState>(emptyForm());
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { signIn, register } = useAuth();
  const nav = useNavigate();

  // ── helpers ────────────────────────────────────────────────────────────────

  const field =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
      setErr("");
    };

  const goToRole = () => {
    setStep("role");
    setForm(emptyForm());
    setErr("");
  };

  const pickRole = (r: Role, nextStep: Step) => {
    setRole(r);
    setStep(nextStep);
    setErr("");
  };

  // Autofill uses the actual role — including admin
  const autofill = () => {
    const c = demoCredentials[role];
    setForm((prev) => ({ ...prev, email: c.email, password: c.password }));
  };

  // ── sign-in submit ─────────────────────────────────────────────────────────

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setSubmitting(true);
    try {
      const result = await signIn(form.email, form.password, role);
      if (!result.ok) {
        setErr(result.error ?? "Sign in failed.");
        return;
      }
      // Navigate based on the role the user selected (which the backend confirmed)
      nav(roleHome(role), { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  // ── register submit ────────────────────────────────────────────────────────

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");

    if (form.name.trim().length < 2) {
      setErr("Name must be at least 2 characters.");
      return;
    }
    const pwdErr = validatePassword(form.password);
    if (pwdErr) { setErr(pwdErr); return; }
    if (form.password !== form.confirmPassword) {
      setErr("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role,
        phone: form.phone.trim() || undefined,
      });
      if (!result.ok) { setErr(result.error ?? "Registration failed."); return; }
      nav(roleHome(role), { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 100px)",
        display: "grid",
        placeItems: "center",
        px: 2,
        py: 6,
        background: `
          radial-gradient(circle at 30% 20%, ${alpha("#34d39e", 0.15)}, transparent 50%),
          radial-gradient(circle at 70% 70%, ${alpha("#7c9cff", 0.1)}, transparent 50%)
        `,
      }}
    >
      <Container maxWidth="md">
        <AnimatePresence mode="wait">
          {/* ── Step 1: role picker ─────────────────────────────────────── */}
          {step === "role" && (
            <motion.div
              key="role"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Box sx={{ textAlign: "center", mb: 5 }}>
                <Typography variant="h2" sx={{ fontSize: { xs: 32, md: 48 }, mb: 1 }}>
                  Welcome to HireSphere
                </Typography>
                <Typography color="text.secondary">
                  Choose how you'd like to use the platform
                </Typography>
              </Box>

              <Grid container spacing={3}>
                {(
                  [
                    {
                      value: "recruiter" as Role,
                      title: "Recruiter / Hirer",
                      desc: "Post jobs, find verified talent, manage pipelines.",
                      icon: <BusinessIcon sx={{ fontSize: 40 }} />,
                      showRegister: true,
                    },
                    {
                      value: "job_seeker" as Role,
                      title: "Job Seeker",
                      desc: "Get matched, apply faster, track every conversation.",
                      icon: <PersonIcon sx={{ fontSize: 40 }} />,
                      showRegister: true,
                    },
                    {
                      value: "admin" as Role,
                      title: "Administrator",
                      desc: "Manage platform users, jobs, and all applications.",
                      icon: <AdminPanelSettingsIcon sx={{ fontSize: 40 }} />,
                      showRegister: false, // admins are seeded — no self-registration
                    },
                  ] as const
                ).map((opt) => (
                  <Grid item xs={12} md={opt.value === "admin" ? 12 : 6} key={opt.value}>
                    <Card
                      sx={{
                        p: 4,
                        cursor: "pointer",
                        height: "100%",
                        transition: "all 0.3s",
                        // Subtle pink tint for admin to make it visually distinct
                        ...(opt.value === "admin" && {
                          borderColor: alpha("#f472b6", 0.2),
                          maxWidth: { md: 400 },
                          mx: "auto",
                        }),
                        "&:hover": {
                          transform: "translateY(-6px)",
                          borderColor: alpha(
                            opt.value === "admin" ? "#f472b6" : "#34d39e",
                            0.5
                          ),
                          boxShadow: `0 0 60px -10px ${alpha(
                            opt.value === "admin" ? "#f472b6" : "#34d39e",
                            0.4
                          )}`,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 72,
                          height: 72,
                          borderRadius: 3,
                          mb: 3,
                          bgcolor: alpha(
                            opt.value === "admin" ? "#f472b6" : "#34d39e",
                            0.12
                          ),
                          color:
                            opt.value === "admin" ? "#f472b6" : "primary.main",
                          display: "grid",
                          placeItems: "center",
                        }}
                      >
                        {opt.icon}
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
                          onClick={() => pickRole(opt.value, "signIn")}
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
                            onClick={() => pickRole(opt.value, "register")}
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
          )}

          {/* ── Step 2a: sign-in form ───────────────────────────────────── */}
          {step === "signIn" && (
            <motion.div
              key="signIn"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card sx={{ p: { xs: 4, md: 6 }, maxWidth: 480, mx: "auto" }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                  <IconButton size="small" onClick={goToRole}>
                    <ArrowBackIcon />
                  </IconButton>
                  <Typography variant="overline" color="text.secondary">
                    {role === "recruiter"
                      ? "Recruiter sign in"
                      : role === "admin"
                      ? "Admin sign in"
                      : "Job seeker sign in"}
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

                <form onSubmit={handleSignIn}>
                  <Stack spacing={2}>
                    <TextField
                      label="Email"
                      type="email"
                      value={form.email}
                      onChange={field("email")}
                      required
                      fullWidth
                      autoComplete="email"
                    />
                    <TextField
                      label="Password"
                      type={showPwd ? "text" : "password"}
                      value={form.password}
                      onChange={field("password")}
                      required
                      fullWidth
                      autoComplete="current-password"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPwd((v) => !v)}
                              edge="end"
                            >
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
                      startIcon={
                        submitting ? (
                          <CircularProgress size={16} color="inherit" />
                        ) : undefined
                      }
                      sx={
                        role === "admin"
                          ? { bgcolor: "#f472b6", "&:hover": { bgcolor: "#ec4899" } }
                          : {}
                      }
                    >
                      {submitting ? "Signing in…" : "Sign In"}
                    </Button>

                    <Button
                      onClick={autofill}
                      variant="outlined"
                      size="small"
                      fullWidth
                      disabled={submitting}
                    >
                      Autofill demo credentials
                    </Button>

                    {/* Only show register link for non-admin roles */}
                    {role !== "admin" && (
                      <>
                        <Divider>
                          <Typography variant="caption" color="text.secondary">
                            or
                          </Typography>
                        </Divider>
                        <Button
                          variant="text"
                          size="small"
                          fullWidth
                          onClick={() => {
                            setForm(emptyForm());
                            setErr("");
                            setStep("register");
                          }}
                        >
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
                    bgcolor: alpha(
                      role === "admin" ? "#f472b6" : "#34d39e",
                      0.06
                    ),
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mb: 0.5 }}
                  >
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
          )}

          {/* ── Step 2b: register form ──────────────────────────────────── */}
          {step === "register" && (
            <motion.div
              key="register"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card sx={{ p: { xs: 4, md: 6 }, maxWidth: 520, mx: "auto" }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                  <IconButton size="small" onClick={goToRole}>
                    <ArrowBackIcon />
                  </IconButton>
                  <Typography variant="overline" color="text.secondary">
                    {role === "recruiter"
                      ? "Recruiter registration"
                      : "Job seeker registration"}
                  </Typography>
                </Stack>

                <Typography variant="h4" sx={{ mb: 0.5 }}>
                  Create your account
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  Join HireSphere as a{" "}
                  {role === "recruiter" ? "recruiter" : "job seeker"}.
                </Typography>

                <form onSubmit={handleRegister}>
                  <Stack spacing={2}>
                    <TextField
                      label="Full name"
                      value={form.name}
                      onChange={field("name")}
                      required
                      fullWidth
                      autoComplete="name"
                      inputProps={{ minLength: 2, maxLength: 50 }}
                    />
                    <TextField
                      label="Email"
                      type="email"
                      value={form.email}
                      onChange={field("email")}
                      required
                      fullWidth
                      autoComplete="email"
                    />
                    <TextField
                      label="Phone (optional)"
                      type="tel"
                      value={form.phone}
                      onChange={field("phone")}
                      fullWidth
                      autoComplete="tel"
                    />
                    <TextField
                      label="Password"
                      type={showPwd ? "text" : "password"}
                      value={form.password}
                      onChange={field("password")}
                      required
                      fullWidth
                      autoComplete="new-password"
                      helperText="Min 8 chars, one uppercase letter, one number"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPwd((v) => !v)}
                              edge="end"
                            >
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
                      onChange={field("confirmPassword")}
                      required
                      fullWidth
                      autoComplete="new-password"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowConfirm((v) => !v)}
                              edge="end"
                            >
                              {showConfirm ? (
                                <VisibilityOffIcon />
                              ) : (
                                <VisibilityIcon />
                              )}
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
                      startIcon={
                        submitting ? (
                          <CircularProgress size={16} color="inherit" />
                        ) : undefined
                      }
                    >
                      {submitting ? "Creating account…" : "Create Account"}
                    </Button>

                    <Divider>
                      <Typography variant="caption" color="text.secondary">
                        or
                      </Typography>
                    </Divider>

                    <Button
                      variant="text"
                      size="small"
                      fullWidth
                      onClick={() => {
                        setForm(emptyForm());
                        setErr("");
                        setStep("signIn");
                      }}
                    >
                      Already have an account? Sign in
                    </Button>
                  </Stack>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </Box>
  );
}