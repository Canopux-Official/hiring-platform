import {
  Card,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { JOB_TYPES, EXP_LEVELS } from "../services/job-helpers";
import { JobFilters, JobType, ExperienceLevel } from "../types";

// ─── Props ────────────────────────────────────────────────────────────────────

interface JobFiltersBarProps {
  filters: JobFilters;
  onChange: (partial: Partial<JobFilters>) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function JobFiltersBar({ filters, onChange }: JobFiltersBarProps) {
  return (
    <Card sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        {/* Search */}
        <TextField
          fullWidth
          placeholder="Search role, company, skill…"
          value={filters.search ?? ""}
          onChange={(e) => onChange({ search: e.target.value, page: 1 })}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />

        {/* Job type */}
        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel id="job-type-label" shrink>
            Type
          </InputLabel>
          <Select
            labelId="job-type-label"
            value={filters.type ?? ""}
            label="Type"
            onChange={(e) =>
              onChange({ type: e.target.value as JobType | "", page: 1 })
            }
            displayEmpty
          >
            <MenuItem value="">All types</MenuItem>
            {JOB_TYPES.map((t) => (
              <MenuItem key={t.value} value={t.value}>
                {t.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Experience level */}
        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel id="experience-label" shrink>
            Experience
          </InputLabel>
          <Select
            labelId="experience-label"
            value={filters.experienceLevel ?? ""}
            label="Experience"
            onChange={(e) =>
              onChange({
                experienceLevel: e.target.value as ExperienceLevel | "",
                page: 1,
              })
            }
            displayEmpty
          >
            <MenuItem value="">All levels</MenuItem>
            {EXP_LEVELS.map((l) => (
              <MenuItem key={l.value} value={l.value}>
                {l.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </Card>
  );
}