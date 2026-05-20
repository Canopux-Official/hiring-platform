// hooks/useToast.tsx
// Drop-in toast system built on MUI Snackbar + Alert.
//
// Usage:
//   1. Wrap your app (or just the recruiter section) with <ToastProvider>
//   2. Call const toast = useToast() in any child component
//   3. toast.success("Job created!") / toast.error("Something went wrong")

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { Snackbar, Alert, AlertColor, Slide, SlideProps } from "@mui/material";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ToastItem {
  id: number;
  message: string;
  severity: AlertColor;
}

interface ToastContextValue {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

let idCounter = 0;

function SlideUp(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const push = useCallback((message: string, severity: AlertColor) => {
    const id = ++idCounter;
    setToasts((prev) => [...prev, { id, message, severity }]);
  }, []);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value: ToastContextValue = {
    success: (msg) => push(msg, "success"),
    error: (msg) => push(msg, "error"),
    info: (msg) => push(msg, "info"),
    warning: (msg) => push(msg, "warning"),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Render at most one toast at a time — stacks naturally because
          each closes itself after autoHideDuration */}
      {toasts.map((t, index) => (
        <Snackbar
          key={t.id}
          open
          autoHideDuration={3500}
          onClose={() => remove(t.id)}
          // stack upward if multiple are queued
          sx={{ bottom: { xs: 16 + index * 64, sm: 24 + index * 64 } }}
          TransitionComponent={SlideUp}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => remove(t.id)}
            severity={t.severity}
            variant="filled"
            sx={{ minWidth: 280, boxShadow: 6 }}
          >
            {t.message}
          </Alert>
        </Snackbar>
      ))}
    </ToastContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used inside <ToastProvider>");
  }
  return ctx;
}