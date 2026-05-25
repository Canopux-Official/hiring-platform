import { createTheme, alpha } from "@mui/material/styles";

// ── Palette ────────────────────────────────────────────────────────────────────
const violet      = "#7c3aed"; // Violet-600  — primary CTA / active states
const violetDark  = "#6d28d9"; // Violet-700  — hover
const violetLight = "#ede9fe"; // Violet-100  — icon tint, chip bg
const surface     = "#ffffff";
const bg          = "#f5f3ff"; // Very faint violet tint — main page background
const sidebarBg   = "#111827"; // Near-black sidebar
const textPrimary = "#111827"; // Gray-900
const textSecondary = "#6b7280"; // Gray-500
const border      = "#e5e7eb"; // Gray-200

export const theme = createTheme({
  palette: {
    mode: "light",
    primary:    { main: violet, dark: violetDark, light: violetLight, contrastText: "#ffffff" },
    secondary:  { main: "#8b5cf6" },
    background: { default: "#f9fafb", paper: surface },
    text:       { primary: textPrimary, secondary: textSecondary },
    divider:    border,
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: "'Inter', system-ui, sans-serif",
    h1: { fontWeight: 800, letterSpacing: "-0.03em" },
    h2: { fontWeight: 700, letterSpacing: "-0.025em" },
    h3: { fontWeight: 700, letterSpacing: "-0.015em" },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600, letterSpacing: "0" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          paddingInline: 20,
          boxShadow: "none",
        },
        containedPrimary: {
          background: violet,
          "&:hover": {
            background: violetDark,
            boxShadow: `0 4px 14px ${alpha(violet, 0.35)}`,
          },
        },
        outlined: {
          borderColor: border,
          color: textPrimary,
          "&:hover": {
            backgroundColor: violetLight,
            borderColor: alpha(violet, 0.4),
            color: violet,
          },
        },
      },
    },
    MuiPaper:  { styleOverrides: { root: { backgroundImage: "none" } } },
    MuiCard: {
      styleOverrides: {
        root: {
          background: surface,
          border: `1px solid ${border}`,
          boxShadow: "0 1px 4px rgba(17,24,39,0.06), 0 4px 12px rgba(17,24,39,0.04)",
          borderRadius: 12,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 6, fontWeight: 600 },
        outlined: { borderColor: border },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: surface,
          "& .MuiOutlinedInput-notchedOutline": { borderColor: border },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: alpha(violet, 0.5) },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: violet },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderBottom: `1px solid ${border}`, padding: "12px 16px" },
        head: { fontWeight: 600, color: textSecondary, backgroundColor: "#f9fafb" },
      },
    },
  },
});

// Sidebar color export for reuse
export const SIDEBAR_BG = sidebarBg;

export const panelStyle = {
  backgroundColor: surface,
  border: `1px solid ${border}`,
  borderRadius: 12,
  boxShadow: "0 1px 4px rgba(17,24,39,0.06)",
};

export const highlightGlow = `0 0 0 3px ${alpha(violet, 0.2)}`;