// import {
//   Card,
//   Stack,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   InputAdornment,
//   Button,
//   Chip,
//   Box,
//   Collapse,
//   IconButton,
//   Typography,
// } from "@mui/material";
// import SearchIcon from "@mui/icons-material/Search";
// import FilterListIcon from "@mui/icons-material/FilterList";
// import CloseIcon from "@mui/icons-material/Close";
// import { useState } from "react";

// import { JOB_TYPES, EXP_LEVELS } from "../services/job-helpers";
// import { JobFilters, JobType, ExperienceLevel } from "../types";

// // ─── Constants ────────────────────────────────────────────────────────────────

// const CATEGORIES = [
//   "Engineering",
//   "Design",
//   "Creative",
//   "Hospitality",
//   "Logistics",
//   "Executive",
//   "Other",
// ];

// const STATUSES = [
//   { value: "open",   label: "Open"   },
//   { value: "draft",  label: "Draft"  },
//   { value: "closed", label: "Closed" },
// ];

// const CURRENCIES = ["INR", "USD", "EUR", "GBP", "AED", "CAD", "AUD", "SGD"];

// // ─── Props ────────────────────────────────────────────────────────────────────

// interface JobFiltersBarProps {
//   filters: JobFilters;
//   onChange: (partial: Partial<JobFilters>) => void;
// }

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// function countActiveFilters(filters: JobFilters): number {
//   let n = 0;
//   if (filters.search)          n++;
//   if (filters.type)            n++;
//   if (filters.experienceLevel) n++;
//   if (filters.category)        n++;
//   if (filters.status)          n++;
//   if (filters.skills)          n++;
//   if (filters.location)        n++;
//   if (filters.deadlineBefore)  n++;
//   return n;
// }

// // ─── Component ────────────────────────────────────────────────────────────────

// export default function JobFiltersBar({ filters, onChange }: JobFiltersBarProps) {
//   const [expanded, setExpanded] = useState(false);
//   const [skillInput, setSkillInput] = useState("");

//   const activeCount = countActiveFilters(filters);

//   function clearAll() {
//     onChange({
//       search: "",
//       type: "",
//       experienceLevel: "",
//       category: "",
//       status: "",
//       skills: "",
//       location: "",
//       deadlineBefore: "",
//       page: 1,
//     });
//     setSkillInput("");
//   }

//   function addSkill() {
//     const s = skillInput.trim().toLowerCase();
//     if (!s) return;
//     const existing = filters.skills ? filters.skills.split(",").map((x) => x.trim()).filter(Boolean) : [];
//     if (!existing.includes(s)) {
//       onChange({ skills: [...existing, s].join(","), page: 1 });
//     }
//     setSkillInput("");
//   }

//   function removeSkill(skill: string) {
//     const remaining = (filters.skills ?? "")
//       .split(",")
//       .map((s) => s.trim())
//       .filter((s) => s && s !== skill)
//       .join(",");
//     onChange({ skills: remaining, page: 1 });
//   }

//   const skillChips = filters.skills
//     ? filters.skills.split(",").map((s) => s.trim()).filter(Boolean)
//     : [];

//   return (
//     <Card sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>

//       {/* ── Row 1: Search + Type + Experience + toggle ── */}
//       <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center">

//         {/* Search */}
//         <TextField
//           fullWidth
//           placeholder="Search role, company, skill…"
//           value={filters.search ?? ""}
//           onChange={(e) => onChange({ search: e.target.value, page: 1 })}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <SearchIcon color="action" />
//               </InputAdornment>
//             ),
//           }}
//         />

//         {/* Job type */}
//         <FormControl sx={{ minWidth: 160 }}>
//           <InputLabel id="job-type-label" shrink>Type</InputLabel>
//           <Select
//             labelId="job-type-label"
//             value={filters.type ?? ""}
//             label="Type"
//             onChange={(e) => onChange({ type: e.target.value as JobType | "", page: 1 })}
//             displayEmpty
//           >
//             <MenuItem value="">All types</MenuItem>
//             {JOB_TYPES.map((t) => (
//               <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         {/* Experience level */}
//         <FormControl sx={{ minWidth: 160 }}>
//           <InputLabel id="experience-label" shrink>Experience</InputLabel>
//           <Select
//             labelId="experience-label"
//             value={filters.experienceLevel ?? ""}
//             label="Experience"
//             onChange={(e) => onChange({ experienceLevel: e.target.value as ExperienceLevel | "", page: 1 })}
//             displayEmpty
//           >
//             <MenuItem value="">All levels</MenuItem>
//             {EXP_LEVELS.map((l) => (
//               <MenuItem key={l.value} value={l.value}>{l.label}</MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         {/* More filters toggle */}
//         <Button
//           variant={expanded ? "contained" : "outlined"}
//           startIcon={<FilterListIcon />}
//           onClick={() => setExpanded((x) => !x)}
//           sx={{ whiteSpace: "nowrap", minWidth: 140 }}
//         >
//           Filters {activeCount > 0 && `(${activeCount})`}
//         </Button>

//         {/* Clear all — only when filters active */}
//         {activeCount > 0 && (
//           <Button
//             color="error"
//             size="small"
//             onClick={clearAll}
//             sx={{ whiteSpace: "nowrap" }}
//           >
//             Clear all
//           </Button>
//         )}
//       </Stack>

//       {/* ── Row 2: Advanced filters (collapsible) ── */}
//       <Collapse in={expanded}>
//         <Stack spacing={2} sx={{ mt: 2 }}>

//           {/* Category + Status + Location */}
//           <Stack direction={{ xs: "column", md: "row" }} spacing={2}>

//             <FormControl fullWidth>
//               <InputLabel id="category-label" shrink>Category</InputLabel>
//               <Select
//                 labelId="category-label"
//                 value={filters.category ?? ""}
//                 label="Category"
//                 onChange={(e) => onChange({ category: e.target.value, page: 1 })}
//                 displayEmpty
//               >
//                 <MenuItem value="">All categories</MenuItem>
//                 {CATEGORIES.map((c) => (
//                   <MenuItem key={c} value={c}>{c}</MenuItem>
//                 ))}
//               </Select>
//             </FormControl>

//             <FormControl fullWidth>
//               <InputLabel id="status-label" shrink>Status</InputLabel>
//               <Select
//                 labelId="status-label"
//                 value={filters.status ?? ""}
//                 label="Status"
//                 onChange={(e) => onChange({ status: e.target.value, page: 1 })}
//                 displayEmpty
//               >
//                 <MenuItem value="">All statuses</MenuItem>
//                 {STATUSES.map((s) => (
//                   <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
//                 ))}
//               </Select>
//             </FormControl>

//             <TextField
//               fullWidth
//               label="Location"
//               placeholder="e.g. Remote, Bangalore…"
//               value={filters.location ?? ""}
//               onChange={(e) => onChange({ location: e.target.value, page: 1 })}
//               InputLabelProps={{ shrink: true }}
//             />

//             <TextField
//               fullWidth
//               type="date"
//               label="Apply before"
//               value={filters.deadlineBefore ?? ""}
//               onChange={(e) => onChange({ deadlineBefore: e.target.value, page: 1 })}
//               InputLabelProps={{ shrink: true }}
//             />
//           </Stack>

//           {/* Skills */}
//           <Box>
//             <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
//               Filter by skills
//             </Typography>
//             <Stack direction="row" spacing={1}>
//               <TextField
//                 size="small"
//                 placeholder="e.g. React, Node.js…"
//                 value={skillInput}
//                 onChange={(e) => setSkillInput(e.target.value)}
//                 onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
//                 fullWidth
//               />
//               <Button variant="outlined" onClick={addSkill} sx={{ whiteSpace: "nowrap" }}>
//                 Add skill
//               </Button>
//             </Stack>

//             {skillChips.length > 0 && (
//               <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
//                 {skillChips.map((s) => (
//                   <Chip
//                     key={s}
//                     label={s}
//                     size="small"
//                     onDelete={() => removeSkill(s)}
//                     deleteIcon={<CloseIcon />}
//                   />
//                 ))}
//               </Stack>
//             )}
//           </Box>

//         </Stack>
//       </Collapse>
//     </Card>
//   );
// }

 import {
  Card,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Button,
  Chip,
  Box,
  Collapse,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { alpha } from "@mui/material/styles";

import { JOB_TYPES, EXP_LEVELS } from "../services/job-helpers";
import { JobFilters, JobType, ExperienceLevel } from "../types";

// ── Design Tokens (Consistent with Hero & other components) ─────────────
const GREEN = "#059669";
const GREEN_DARK = "#047857";
const GREEN_LIGHT = "#d1fae5";

const CATEGORIES = [
  "Engineering", "Design", "Creative", "Hospitality", 
  "Logistics", "Executive", "Other",
];

const STATUSES = [
  { value: "open",   label: "Open"   },
  { value: "draft",  label: "Draft"  },
  { value: "closed", label: "Closed" },
];

// ─── Props ────────────────────────────────────────────────────────────────

interface JobFiltersBarProps {
  filters: JobFilters;
  onChange: (partial: Partial<JobFilters>) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────

function countActiveFilters(filters: JobFilters): number {
  let n = 0;
  if (filters.search)          n++;
  if (filters.type)            n++;
  if (filters.experienceLevel) n++;
  if (filters.category)        n++;
  if (filters.status)          n++;
  if (filters.skills)          n++;
  if (filters.location)        n++;
  if (filters.deadlineBefore)  n++;
  return n;
}

// ─── Component ────────────────────────────────────────────────────────────

export default function JobFiltersBar({ filters, onChange }: JobFiltersBarProps) {
  const [expanded, setExpanded] = useState(false);
  const [skillInput, setSkillInput] = useState("");

  const activeCount = countActiveFilters(filters);

  function clearAll() {
    onChange({
      search: "",
      type: "",
      experienceLevel: "",
      category: "",
      status: "",
      skills: "",
      location: "",
      deadlineBefore: "",
      page: 1,
    });
    setSkillInput("");
  }

  function addSkill() {
    const s = skillInput.trim().toLowerCase();
    if (!s) return;
    const existing = filters.skills ? filters.skills.split(",").map((x) => x.trim()).filter(Boolean) : [];
    if (!existing.includes(s)) {
      onChange({ skills: [...existing, s].join(","), page: 1 });
    }
    setSkillInput("");
  }

  function removeSkill(skill: string) {
    const remaining = (filters.skills ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s && s !== skill)
      .join(",");
    onChange({ skills: remaining, page: 1 });
  }

  const skillChips = filters.skills
    ? filters.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <Card sx={{ 
      p: 3.5, 
      mb: 4, 
      borderRadius: 3.5, 
      boxShadow: "0 4px 20px rgba(15, 23, 42, 0.06)",
      border: "1px solid #e2e8f0"
    }}>

      {/* Row 1: Search + Quick Filters + Toggle */}
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center">

        {/* Search Bar */}
        <TextField
          fullWidth
          placeholder="Search role, company, or skill..."
          value={filters.search ?? ""}
          onChange={(e) => onChange({ search: e.target.value, page: 1 })}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#64748b" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": { borderRadius: 3 },
          }}
        />

        {/* Job Type */}
        <FormControl sx={{ minWidth: 165 }}>
          <InputLabel id="job-type-label" shrink>Type</InputLabel>
          <Select
            labelId="job-type-label"
            value={filters.type ?? ""}
            label="Type"
            onChange={(e) => onChange({ type: e.target.value as JobType | "", page: 1 })}
            displayEmpty
            sx={{ borderRadius: 3 }}
          >
            <MenuItem value="">All types</MenuItem>
            {JOB_TYPES.map((t) => (
              <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Experience Level */}
        <FormControl sx={{ minWidth: 165 }}>
          <InputLabel id="experience-label" shrink>Experience</InputLabel>
          <Select
            labelId="experience-label"
            value={filters.experienceLevel ?? ""}
            label="Experience"
            onChange={(e) => onChange({ experienceLevel: e.target.value as ExperienceLevel | "", page: 1 })}
            displayEmpty
            sx={{ borderRadius: 3 }}
          >
            <MenuItem value="">All levels</MenuItem>
            {EXP_LEVELS.map((l) => (
              <MenuItem key={l.value} value={l.value}>{l.label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Filters Toggle */}
        <Button
          variant={expanded ? "contained" : "outlined"}
          startIcon={<FilterListIcon />}
          onClick={() => setExpanded((x) => !x)}
          sx={{
            whiteSpace: "nowrap",
            minWidth: 145,
            py: 1.4,
            px: 3,
            ...(expanded && {
              background: `linear-gradient(135deg, ${GREEN} 0%, ${GREEN_DARK} 100%)`,
            }),
          }}
        >
          Filters {activeCount > 0 && `(${activeCount})`}
        </Button>

        {/* Clear All */}
        {activeCount > 0 && (
          <Button
            color="error"
            size="small"
            onClick={clearAll}
            sx={{ whiteSpace: "nowrap", px: 2 }}
          >
            Clear All
          </Button>
        )}
      </Stack>

      {/* Advanced Filters */}
      <Collapse in={expanded}>
        <Stack spacing={3} sx={{ mt: 3 }}>

          {/* Category, Status, Location, Deadline */}
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <FormControl fullWidth>
              <InputLabel id="category-label" shrink>Category</InputLabel>
              <Select
                labelId="category-label"
                value={filters.category ?? ""}
                label="Category"
                onChange={(e) => onChange({ category: e.target.value, page: 1 })}
                displayEmpty
                sx={{ borderRadius: 3 }}
              >
                <MenuItem value="">All categories</MenuItem>
                {CATEGORIES.map((c) => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="status-label" shrink>Status</InputLabel>
              <Select
                labelId="status-label"
                value={filters.status ?? ""}
                label="Status"
                onChange={(e) => onChange({ status: e.target.value, page: 1 })}
                displayEmpty
                sx={{ borderRadius: 3 }}
              >
                <MenuItem value="">All statuses</MenuItem>
                {STATUSES.map((s) => (
                  <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Location"
              placeholder="e.g. Remote, Bangalore, Dubai..."
              value={filters.location ?? ""}
              onChange={(e) => onChange({ location: e.target.value, page: 1 })}
              InputLabelProps={{ shrink: true }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            />

            <TextField
              fullWidth
              type="date"
              label="Apply before"
              value={filters.deadlineBefore ?? ""}
              onChange={(e) => onChange({ deadlineBefore: e.target.value, page: 1 })}
              InputLabelProps={{ shrink: true }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            />
          </Stack>

          {/* Skills Filter */}
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
              Filter by Skills
            </Typography>
            <Stack direction="row" spacing={1}>
              <TextField
                size="small"
                fullWidth
                placeholder="e.g. React, Python, Figma..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
              />
              <Button 
                variant="outlined" 
                onClick={addSkill}
                sx={{ 
                  px: 3, 
                  borderColor: GREEN, 
                  color: GREEN,
                  "&:hover": { borderColor: GREEN_DARK, bgcolor: GREEN_LIGHT }
                }}
              >
                Add
              </Button>
            </Stack>

            {skillChips.length > 0 && (
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 2 }}>
                {skillChips.map((s) => (
                  <Chip
                    key={s}
                    label={s}
                    size="small"
                    onDelete={() => removeSkill(s)}
                    deleteIcon={<CloseIcon />}
                    sx={{
                      bgcolor: GREEN_LIGHT,
                      color: GREEN,
                      fontWeight: 500,
                    }}
                  />
                ))}
              </Stack>
            )}
          </Box>
        </Stack>
      </Collapse>
    </Card>
  );
}