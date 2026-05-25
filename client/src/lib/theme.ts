import { createTheme, alpha } from "@mui/material/styles";

// ── Palette ────────────────────────────────────────────────────────────────────
// Primary: Teal-Green — professional, fresh, modern
const green       = "#059669"; // Emerald-600 — primary buttons, active states
const greenDark   = "#047857"; // Emerald-700 — hover
const greenDeep   = "#065f46"; // Emerald-800 — deep accent / sidebar
const greenLight  = "#d1fae5"; // Emerald-100 — chip bg, tints
const greenMid    = "#6ee7b7"; // Emerald-300 — progress track

// Secondary: Blue — complementary accent
const blue        = "#2563eb"; // Blue-600 — secondary buttons, links
const blueDark    = "#1d4ed8"; // Blue-700 — hover
const blueLight   = "#dbeafe"; // Blue-100 — chip bg, tints

// Neutrals
const surface       = "#ffffff";
const sidebarBg     = "#0d2137"; // Deep navy sidebar
const textPrimary   = "#0f172a"; // Slate-900
const textSecondary = "#64748b"; // Slate-500
const border        = "#e2e8f0"; // Slate-200

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: green,
      dark: greenDark,
      light: greenLight,
      contrastText: "#ffffff",
    },
    secondary: {
      main: blue,
      dark: blueDark,
      light: blueLight,
      contrastText: "#ffffff",
    },
    background: {
      default: "#ffffff", // Pure white page background
      paper: "#ffffff",
    },
    text: { primary: textPrimary, secondary: textSecondary },
    divider: border,
    info:    { main: blue, light: blueLight, dark: blueDark, contrastText: "#ffffff" },
    success: { main: green, light: greenLight, dark: greenDeep, contrastText: "#ffffff" },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: "'Inter', system-ui, sans-serif",
    h1: { fontWeight: 800, letterSpacing: "-0.03em", color: textPrimary },
    h2: { fontWeight: 700, letterSpacing: "-0.025em", color: textPrimary },
    h3: { fontWeight: 700, letterSpacing: "-0.015em", color: textPrimary },
    h4: { fontWeight: 600, color: textPrimary },
    h5: { fontWeight: 600, color: textPrimary },
    h6: { fontWeight: 600, color: textPrimary },
    button: { textTransform: "none", fontWeight: 600, letterSpacing: "0" },
  },
  components: {
    // ── Buttons ───────────────────────────────────────────────────────────────
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          paddingInline: 20,
          boxShadow: "none",
          transition: "all 0.18s ease",
        },
        // Green filled — primary action
        containedPrimary: {
          background: `linear-gradient(135deg, ${green} 0%, ${greenDark} 100%)`,
          color: "#ffffff",
          "&:hover": {
            background: `linear-gradient(135deg, ${greenDark} 0%, ${greenDeep} 100%)`,
            boxShadow: `0 4px 14px ${alpha(green, 0.4)}`,
          },
        },
        // Blue filled — secondary action
        containedSecondary: {
          background: `linear-gradient(135deg, ${blue} 0%, ${blueDark} 100%)`,
          color: "#ffffff",
          "&:hover": {
            background: `linear-gradient(135deg, ${blueDark} 0%, #1e40af 100%)`,
            boxShadow: `0 4px 14px ${alpha(blue, 0.4)}`,
          },
        },
        // Green outlined
        outlinedPrimary: {
          borderColor: green,
          color: green,
          "&:hover": {
            backgroundColor: greenLight,
            borderColor: greenDark,
            color: greenDark,
            boxShadow: `0 2px 8px ${alpha(green, 0.2)}`,
          },
        },
        // Blue outlined
        outlinedSecondary: {
          borderColor: blue,
          color: blue,
          "&:hover": {
            backgroundColor: blueLight,
            borderColor: blueDark,
            color: blueDark,
            boxShadow: `0 2px 8px ${alpha(blue, 0.2)}`,
          },
        },
        // Neutral outlined fallback
        outlined: {
          borderColor: border,
          color: textPrimary,
          "&:hover": {
            backgroundColor: "#f8fafc",
            borderColor: alpha(green, 0.4),
            color: green,
          },
        },
        // Green text button
        textPrimary: {
          color: green,
          "&:hover": { backgroundColor: greenLight, color: greenDark },
        },
        // Blue text button
        textSecondary: {
          color: blue,
          "&:hover": { backgroundColor: blueLight, color: blueDark },
        },
      },
    },

    // ── Cards & Paper ─────────────────────────────────────────────────────────
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: surface,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: surface,
          border: `1px solid ${border}`,
          boxShadow: "0 1px 3px rgba(15,23,42,0.06), 0 4px 12px rgba(15,23,42,0.04)",
          borderRadius: 12,
          "&:hover": {
            boxShadow: "0 4px 16px rgba(15,23,42,0.10)",
          },
          transition: "box-shadow 0.2s ease",
        },
      },
    },

    // ── Chips ─────────────────────────────────────────────────────────────────
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 6, fontWeight: 600 },
        colorPrimary: { backgroundColor: greenLight, color: greenDeep },
        colorSecondary: { backgroundColor: blueLight, color: blueDark },
        colorInfo: { backgroundColor: blueLight, color: blueDark },
        colorSuccess: { backgroundColor: greenLight, color: greenDeep },
        outlined: { borderColor: border },
        outlinedPrimary: { borderColor: green, color: green },
        outlinedSecondary: { borderColor: blue, color: blue },
      },
    },

    // ── Inputs ────────────────────────────────────────────────────────────────
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: surface,
          "& .MuiOutlinedInput-notchedOutline": { borderColor: border },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: alpha(green, 0.5),
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: green,
            borderWidth: 2,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          "&.Mui-focused": { color: green },
        },
      },
    },

    // ── Table ─────────────────────────────────────────────────────────────────
    MuiTableCell: {
      styleOverrides: {
        root: { borderBottom: `1px solid ${border}`, padding: "12px 16px" },
        head: {
          fontWeight: 600,
          color: textSecondary,
          backgroundColor: "#f8fafc",
        },
      },
    },

    // ── Toggle / Checkbox ─────────────────────────────────────────────────────
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          "&.Mui-checked": {
            color: green,
            "& + .MuiSwitch-track": { backgroundColor: green },
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: { "&.Mui-checked": { color: green } },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: { "&.Mui-checked": { color: green } },
      },
    },

    // ── Progress ──────────────────────────────────────────────────────────────
    MuiLinearProgress: {
      styleOverrides: {
        bar: { backgroundColor: green },
        root: { backgroundColor: greenMid, borderRadius: 999 },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: { color: green },
      },
    },

    // ── Tabs ──────────────────────────────────────────────────────────────────
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          "&.Mui-selected": { color: green },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: { backgroundColor: green, height: 3, borderRadius: 2 },
      },
    },

    // ── Links ─────────────────────────────────────────────────────────────────
    MuiLink: {
      styleOverrides: {
        root: {
          color: blue,
          "&:hover": { color: blueDark },
        },
      },
    },

    // ── Badges ────────────────────────────────────────────────────────────────
    MuiBadge: {
      styleOverrides: {
        badge: { backgroundColor: green, color: "#ffffff" },
      },
    },

    // ── Tooltip ───────────────────────────────────────────────────────────────
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: textPrimary,
          fontSize: "0.75rem",
          borderRadius: 6,
        },
      },
    },

    // ── AppBar ────────────────────────────────────────────────────────────────
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: surface,
          color: textPrimary,
          boxShadow: `0 1px 0 ${border}`,
          backgroundImage: "none",
        },
      },
    },
  },
});

// ── Export helpers ─────────────────────────────────────────────────────────────
export const SIDEBAR_BG = sidebarBg;

export const GREEN       = green;
export const GREEN_DARK  = greenDark;
export const GREEN_DEEP  = greenDeep;
export const GREEN_LIGHT = greenLight;
export const GREEN_MID   = greenMid;
export const BLUE        = blue;
export const BLUE_DARK   = blueDark;
export const BLUE_LIGHT  = blueLight;

export const panelStyle = {
  backgroundColor: surface,
  border: `1px solid ${border}`,
  borderRadius: 12,
  boxShadow: "0 1px 4px rgba(15,23,42,0.06)",
};

export const highlightGlow   = `0 0 0 3px ${alpha(green, 0.2)}`;
export const blueHighlightGlow = `0 0 0 3px ${alpha(blue, 0.2)}`;

export const greenBadgeStyle = {
  backgroundColor: greenLight,
  color: greenDeep,
  borderRadius: 6,
  fontWeight: 600,
  padding: "2px 8px",
};

export const blueBadgeStyle = {
  backgroundColor: blueLight,
  color: blueDark,
  borderRadius: 6,
  fontWeight: 600,
  padding: "2px 8px",
};