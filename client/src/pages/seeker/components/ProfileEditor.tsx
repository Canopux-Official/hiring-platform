// src/components/seeker/ProfileEditors.tsx
import { useState } from "react";
import { Stack, TextField, Button, Chip, Box } from "@mui/material";
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

  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !skills.includes(trimmed)) {
      onChange([...skills, trimmed]);
    }
    setInput("");
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
      <Stack direction="row" spacing={1}>
        <TextField
          size="small"
          placeholder="Add a skill…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          sx={{ flex: 1 }}
        />
        <Button variant="outlined" size="small" onClick={add} startIcon={<AddIcon />}>
          Add
        </Button>
      </Stack>
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

  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !locations.includes(trimmed)) {
      onChange([...locations, trimmed]);
    }
    setInput("");
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
      <Stack direction="row" spacing={1}>
        <TextField
          size="small"
          placeholder="Add a location…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          sx={{ flex: 1 }}
        />
        <Button variant="outlined" size="small" onClick={add} startIcon={<AddIcon />}>
          Add
        </Button>
      </Stack>
    </Box>
  );
}