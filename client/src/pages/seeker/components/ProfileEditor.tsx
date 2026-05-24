// // src/components/seeker/ProfileEditors.tsx
// import { useState } from "react";
// import { Stack, TextField, Button, Chip, Box } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import LocationOnIcon from "@mui/icons-material/LocationOn";

// export function SkillEditor({
//   skills,
//   onChange,
// }: {
//   skills: string[];
//   onChange: (skills: string[]) => void;
// }) {
//   const [input, setInput] = useState("");

//   const add = () => {
//     const trimmed = input.trim();
//     if (trimmed && !skills.includes(trimmed)) {
//       onChange([...skills, trimmed]);
//     }
//     setInput("");
//   };

//   return (
//     <Box>
//       <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 1.5 }}>
//         {skills.map((s) => (
//           <Chip
//             key={s}
//             label={s}
//             size="small"
//             onDelete={() => onChange(skills.filter((x) => x !== s))}
//           />
//         ))}
//       </Stack>
//       <Stack direction="row" spacing={1}>
//         <TextField
//           size="small"
//           placeholder="Add a skill…"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
//           sx={{ flex: 1 }}
//         />
//         <Button variant="outlined" size="small" onClick={add} startIcon={<AddIcon />}>
//           Add
//         </Button>
//       </Stack>
//     </Box>
//   );
// }

// export function LocationEditor({
//   locations,
//   onChange,
// }: {
//   locations: string[];
//   onChange: (locations: string[]) => void;
// }) {
//   const [input, setInput] = useState("");

//   const add = () => {
//     const trimmed = input.trim();
//     if (trimmed && !locations.includes(trimmed)) {
//       onChange([...locations, trimmed]);
//     }
//     setInput("");
//   };

//   return (
//     <Box>
//       <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 1.5 }}>
//         {locations.map((l) => (
//           <Chip
//             key={l}
//             label={l}
//             size="small"
//             icon={<LocationOnIcon sx={{ fontSize: 14 }} />}
//             onDelete={() => onChange(locations.filter((x) => x !== l))}
//           />
//         ))}
//       </Stack>
//       <Stack direction="row" spacing={1}>
//         <TextField
//           size="small"
//           placeholder="Add a location…"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
//           sx={{ flex: 1 }}
//         />
//         <Button variant="outlined" size="small" onClick={add} startIcon={<AddIcon />}>
//           Add
//         </Button>
//       </Stack>
//     </Box>
//   );
// }


// src/components/seeker/ProfileEditors.tsx
import { useState } from "react";
import { Stack, TextField, Button, Chip, Box, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import LocationOnIcon from "@mui/icons-material/LocationOn";

export function SkillEditor({
  skills,
  onChange,
}: {
  skills: string[];
  onChange: (skills: string[]) => void;
}) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const add = () => {
    const trimmed = input.trim();
    if (!trimmed) {
      setError("Skill cannot be empty.");
      return;
    }
    if (trimmed.length < 2) {
      setError("Skill must be at least 2 characters.");
      return;
    }
    if (trimmed.length > 50) {
      setError("Skill cannot exceed 50 characters.");
      return;
    }
    if (skills.map((s) => s.toLowerCase()).includes(trimmed.toLowerCase())) {
      setError(`"${trimmed}" is already added.`);
      return;
    }
    onChange([...skills, trimmed]);
    setInput("");
    setError("");
  };

  return (
    <Box>
      <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 1.5 }}>
        {skills.map((s) => (
          <Chip
            key={s}
            label={s}
            size="small"
            onDelete={() => onChange(skills.filter((x) => x !== s))}
          />
        ))}
      </Stack>
      <Stack direction="row" spacing={1} alignItems="flex-start">
        <TextField
          size="small"
          placeholder="Add a skill…"
          value={input}
          onChange={(e) => { setInput(e.target.value); if (error) setError(""); }}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          error={!!error}
          helperText={error}
          sx={{ flex: 1 }}
        />
        <Button variant="outlined" size="small" onClick={add} startIcon={<AddIcon />} sx={{ mt: 0.25 }}>
          Add
        </Button>
      </Stack>
      {skills.length === 0 && (
        <Typography variant="caption" color="error" sx={{ mt: 0.5, display: "block" }}>
          At least one skill is required.
        </Typography>
      )}
    </Box>
  );
}

export function LocationEditor({
  locations,
  onChange,
}: {
  locations: string[];
  onChange: (locations: string[]) => void;
}) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const add = () => {
    const trimmed = input.trim();
    if (!trimmed) {
      setError("Location cannot be empty.");
      return;
    }
    if (trimmed.length < 2) {
      setError("Location must be at least 2 characters.");
      return;
    }
    if (trimmed.length > 100) {
      setError("Location cannot exceed 100 characters.");
      return;
    }
    if (locations.map((l) => l.toLowerCase()).includes(trimmed.toLowerCase())) {
      setError(`"${trimmed}" is already added.`);
      return;
    }
    onChange([...locations, trimmed]);
    setInput("");
    setError("");
  };

  return (
    <Box>
      <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 1.5 }}>
        {locations.map((l) => (
          <Chip
            key={l}
            label={l}
            size="small"
            icon={<LocationOnIcon sx={{ fontSize: 14 }} />}
            onDelete={() => onChange(locations.filter((x) => x !== l))}
          />
        ))}
      </Stack>
      <Stack direction="row" spacing={1} alignItems="flex-start">
        <TextField
          size="small"
          placeholder="Add a location…"
          value={input}
          onChange={(e) => { setInput(e.target.value); if (error) setError(""); }}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          error={!!error}
          helperText={error}
          sx={{ flex: 1 }}
        />
        <Button variant="outlined" size="small" onClick={add} startIcon={<AddIcon />} sx={{ mt: 0.25 }}>
          Add
        </Button>
      </Stack>
    </Box>
  );
}