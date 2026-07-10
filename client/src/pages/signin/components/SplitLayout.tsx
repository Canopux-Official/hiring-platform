import { ReactNode } from "react";
import { Box } from "@mui/material";
import { alpha } from "@mui/material/styles";

const GREEN = "#059669";
const BLUE = "#2563eb";

interface Badge {
  icon: string;
  label: string;
}

interface SplitLayoutProps {
  imageSrc: string;
  imageAlt: string;
  headline: string;
  subline: string;
  accentColor?: string;
  badges?: Badge[];
  children: ReactNode;
}

export default function SplitLayout({
  imageSrc,
  imageAlt,
  headline,
  subline,
  accentColor = GREEN,
  badges = [],
  children,
}: SplitLayoutProps) {
  const isBlue = accentColor === BLUE;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        minHeight: { xs: "auto", md: 580 },
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: `0 8px 48px ${alpha(accentColor, 0.13)}`,
        border: `1px solid ${alpha(accentColor, 0.14)}`,
      }}
    >
      {/* ── Left: Photo + overlay ── */}
      <Box
        sx={{
          position: "relative",
          display: { xs: "none", md: "block" },
          minHeight: 520,
        }}
      >
        <Box
          component="img"
          src={imageSrc}
          alt={imageAlt}
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: isBlue
              ? `linear-gradient(160deg, ${alpha(BLUE, 0.80)} 0%, ${alpha("#1e40af", 0.72)} 100%)`
              : `linear-gradient(160deg, ${alpha(GREEN, 0.78)} 0%, ${alpha(BLUE, 0.65)} 100%)`,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            p: 4.5,
          }}
        >
          {badges.length > 0 && (
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2.5 }}>
              {badges.map((b) => (
                <Box
                  key={b.label}
                  sx={{
                    background: "rgba(255,255,255,0.18)",
                    backdropFilter: "blur(6px)",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 500,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    border: "0.5px solid rgba(255,255,255,0.25)",
                  }}
                >
                  <span style={{ fontSize: 13 }}>{b.icon}</span> {b.label}
                </Box>
              ))}
            </Box>
          )}
          <Box sx={{ fontSize: 52, color: "rgba(255,255,255,0.28)", lineHeight: 1, mb: 0.5 }}>"</Box>
          <Box
            component="h2"
            sx={{
              fontSize: 26,
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.35,
              m: 0,
              mb: 1.5,
              letterSpacing: "-0.02em",
            }}
          >
            {headline}
          </Box>
          <Box
            component="p"
            sx={{ fontSize: 14, color: "rgba(255,255,255,0.80)", lineHeight: 1.65, m: 0 }}
          >
            {subline}
          </Box>
        </Box>
      </Box>

      {/* ── Right: Form panel ── */}
      <Box
        sx={{
          bgcolor: "background.paper",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          px: { xs: 3, sm: 5 },
          py: 5,
          overflowY: "auto",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 4 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              bgcolor: accentColor,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 17,
            }}
          >
            💼
          </Box>
          <Box sx={{ fontSize: 16, fontWeight: 700, color: "text.primary", letterSpacing: "-0.01em" }}>
            PerfectHire
          </Box>
        </Box>

        {children}
      </Box>
    </Box>
  );
}