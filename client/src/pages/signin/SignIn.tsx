// // components/SignIn/index.tsx
// // Orchestrates RolePicker â†’ SignInForm / RegisterForm
// // Drop-in replacement for the old pages/SignIn.tsx

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Box, Container } from "@mui/material";
// import { AnimatePresence } from "framer-motion";
// import { alpha } from "@mui/material/styles";

// import { useAuth } from "./lib/auth";
// import { AuthStep, FormState, Role } from "./types/auth.types";
// import { emptyForm, roleHome, validatePassword } from "./utils/auth.utils";
// import RolePicker from "./components/RolePicker";
// import SignInForm from "./components/SigninForm";
// import RegisterForm from "./components/RegisterForm";


// export default function SignIn() {
//   const [step, setStep] = useState<AuthStep>("role");
//   const [role, setRole] = useState<Role>("recruiter");
//   const [form, setForm] = useState<FormState>(emptyForm());
//   const [err, setErr] = useState("");
//   const [submitting, setSubmitting] = useState(false);

//   const { signIn, register, user, loading } = useAuth();
//   const nav = useNavigate();

//   useEffect(() => {
//     if (!loading && user) nav(roleHome(user.role), { replace: true });
//   }, [loading, user, nav]);

//   if (loading) return null;

//   // â”€â”€ Field handler â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

//   const onField =
//     (key: keyof FormState) =>
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       setForm((prev) => ({ ...prev, [key]: e.target.value }));
//       setErr("");
//     };

//   // â”€â”€ Navigation helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

//   const goToRole = () => {
//     setStep("role");
//     setForm(emptyForm());
//     setErr("");
//   };

//   const pickRole = (r: Role, nextStep: AuthStep) => {
//     setRole(r);
//     setStep(nextStep);
//     setErr("");
//   };

//   const goRegister = () => {
//     setForm(emptyForm());
//     setErr("");
//     setStep("register");
//   };

//   const goSignIn = () => {
//     setForm(emptyForm());
//     setErr("");
//     setStep("signIn");
//   };

//   // const autofill = () => {
//   //   const c = demoCredentials[role];
//   //   setForm((prev) => ({ ...prev, email: c.email, password: c.password }));
//   // };

//   // â”€â”€ Submit handlers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

//   const handleSignIn = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setErr("");
//     setSubmitting(true);
//     try {
//       const result = await signIn(form.email, form.password, role);
//       if (!result.ok) { setErr(result.error ?? "Sign in failed."); return; }
//       nav(roleHome(role), { replace: true });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleRegister = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setErr("");

//     if (form.name.trim().length < 2) { setErr("Name must be at least 2 characters."); return; }
//     const pwdErr = validatePassword(form.password);
//     if (pwdErr) { setErr(pwdErr); return; }
//     if (form.password !== form.confirmPassword) { setErr("Passwords do not match."); return; }

//     setSubmitting(true);
//     try {
//       const result = await register({
//         name: form.name.trim(),
//         email: form.email.trim(),
//         password: form.password,
//         role,
//         phone: form.phone.trim() || undefined,
//       });
//       if (!result.ok) { setErr(result.error ?? "Registration failed."); return; }
//       nav(roleHome(role), { replace: true });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // â”€â”€ Render â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

//   return (
//     <Box
//       sx={{
//         minHeight: "calc(100vh - 100px)",
//         display: "grid",
//         placeItems: "center",
//         px: 2,
//         py: 6,
//         background: `
//           radial-gradient(circle at 30% 20%, ${alpha("#7c3aed", 0.15)}, transparent 50%),
//           radial-gradient(circle at 70% 70%, ${alpha("#7c9cff", 0.1)}, transparent 50%)
//         `,
//       }}
//     >
//       <Container maxWidth="md">
//         <AnimatePresence mode="wait">
//           {step === "role" && <RolePicker onPick={pickRole} />}

//           {step === "signIn" && (
//             <SignInForm
//               role={role}
//               form={form}
//               err={err}
//               submitting={submitting}
//               onBack={goToRole}
//               onField={onField}
//               onSubmit={handleSignIn}
//               onGoRegister={goRegister}
//             />
//           )}

//           {step === "register" && (
//             <RegisterForm
//               role={role}
//               form={form}
//               err={err}
//               submitting={submitting}
//               onBack={goToRole}
//               onField={onField}
//               onSubmit={handleRegister}
//               onGoSignIn={goSignIn}
//             />
//           )}
//         </AnimatePresence>
//       </Container>
//     </Box>
//   );
// }

// components/SignIn/index.tsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Container } from "@mui/material";
import { AnimatePresence } from "framer-motion";
import { alpha } from "@mui/material/styles";

import { useAuth } from "./lib/auth";
import { AuthStep, FormState, Role } from "./types/auth.types";
import { emptyForm, roleHome, validatePassword } from "./utils/auth.utils";
import RolePicker from "./components/RolePicker";
import SignInForm from "./components/SigninForm";
import RegisterForm from "./components/RegisterForm";

export default function SignIn() {
  const [step, setStep] = useState<AuthStep>("role");
  const [role, setRole] = useState<Role>("recruiter");
  const [form, setForm] = useState<FormState>(emptyForm());
  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { signIn, register, user, loading } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (!loading && user) nav(roleHome(user.role), { replace: true });
  }, [loading, user, nav]);

  if (loading) return null;

  const onField =
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

  const pickRole = (r: Role, nextStep: AuthStep) => {
    setRole(r);
    setStep(nextStep);
    setErr("");
  };

  const goRegister = () => {
    setForm(emptyForm());
    setErr("");
    setStep("register");
  };

  const goSignIn = () => {
    setForm(emptyForm());
    setErr("");
    setStep("signIn");
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setSubmitting(true);
    try {
      const result = await signIn(form.email, form.password, role);
      if (!result.ok) { setErr(result.error ?? "Sign in failed."); return; }
      nav(roleHome(role), { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent): Promise<{ pendingApproval?: boolean } | void> => {
    e.preventDefault();
    setErr("");

    if (form.name.trim().length < 2) { setErr("Name must be at least 2 characters."); return; }
    const pwdErr = validatePassword(form.password);
    if (pwdErr) { setErr(pwdErr); return; }
    if (form.password !== form.confirmPassword) { setErr("Passwords do not match."); return; }

    setSubmitting(true);
    try {
      const result = await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role,
        phone: form.phone.trim() || undefined,
      });

      if (!result.ok) {
        setErr(result.error ?? "Registration failed.");
        return;
      }

      // âœ… Recruiter pending approval â€” return flag to RegisterForm
      // RegisterForm will show the pending screen; do NOT navigate away
      if (result.pendingApproval) {
        return { pendingApproval: true };
      }

      // âœ… Normal flow (job seeker) â€” navigate to dashboard
      nav(roleHome(role), { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 100px)",
        display: "grid",
        placeItems: "center",
        px: 2,
        py: 6,
        background: `
          radial-gradient(circle at 30% 20%, ${alpha("#7c3aed", 0.08)}, transparent 50%),
          radial-gradient(circle at 70% 70%, ${alpha("#a78bfa", 0.06)}, transparent 50%)
        `,
        bgcolor: "#f9fafb",
      }}
    >
      <Container maxWidth="md">
        <AnimatePresence mode="wait">
          {step === "role" && <RolePicker onPick={pickRole} />}

          {step === "signIn" && (
            <SignInForm
              role={role}
              form={form}
              err={err}
              submitting={submitting}
              onBack={goToRole}
              onField={onField}
              onSubmit={handleSignIn}
              onGoRegister={goRegister}
            />
          )}

          {step === "register" && (
            <RegisterForm
              role={role}
              form={form}
              err={err}
              submitting={submitting}
              onBack={goToRole}
              onField={onField}
              onSubmit={handleRegister}  // âœ… now returns pendingApproval flag
              onGoSignIn={goSignIn}
            />
          )}
        </AnimatePresence>
      </Container>
    </Box>
  );
}
