// EditJobModal.tsx
// Drop-in replacement for your existing EditJobModal component.
// Uncomment the MenuItem in your jobs table/list to re-enable the Edit option.

// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   MenuItem as MuiMenuItem,
//   Grid,
//   Typography,
//   Divider,
//   Chip,
//   Box,
//   InputAdornment,
//   IconButton,
//   Stack,
// } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import CloseIcon from "@mui/icons-material/Close";
// import { useEffect, useState } from "react";
// import { useToast } from "../../../hooks/useToast"; // adjust path as needed
// import { updateJob, IJob } from "../services/recruiter"; // adjust path as needed

// import { getErrorMessage } from "../../../utils/errorUtils";

// // ─── Types ────────────────────────────────────────────────────────────────────

// type JobType = "full_time" | "part_time" | "contract" | "internship" | "remote";
// type ExperienceLevel = "entry" | "mid" | "senior" | "lead" | "executive";
// type JobStatus = "open" | "closed" | "paused"; // adjust to your JobStatus enum values

// interface EditJobModalProps {
//   job: IJob | null;
//   onClose: () => void;
//   onSaved: (updated: IJob) => void;
// }

// // ─── Constants ────────────────────────────────────────────────────────────────

// const JOB_TYPES: { value: JobType; label: string }[] = [
//   { value: "full_time", label: "Full Time" },
//   { value: "part_time", label: "Part Time" },
//   { value: "contract", label: "Contract" },
//   { value: "internship", label: "Internship" },
//   { value: "remote", label: "Remote" },
// ];

// const EXPERIENCE_LEVELS: { value: ExperienceLevel; label: string }[] = [
//   { value: "entry", label: "Entry Level" },
//   { value: "mid", label: "Mid Level" },
//   { value: "senior", label: "Senior" },
//   { value: "lead", label: "Lead" },
//   { value: "executive", label: "Executive" },
// ];

// const JOB_STATUSES: { value: JobStatus; label: string }[] = [
//   { value: "open", label: "Open" },
//   { value: "closed", label: "Closed" },
//   { value: "paused", label: "Paused" },
// ];

// // ─── Section Header ───────────────────────────────────────────────────────────

// function SectionHeader({ label }: { label: string }) {
//   return (
//     <Box sx={{ mb: 2, mt: 1 }}>
//       <Typography
//         variant="overline"
//         sx={{ color: "text.secondary", letterSpacing: 1.2, fontWeight: 600 }}
//       >
//         {label}
//       </Typography>
//       <Divider sx={{ mt: 0.5 }} />
//     </Box>
//   );
// }

// // ─── Tag Input ────────────────────────────────────────────────────────────────
// // Reusable chip-based input for skills / requirements / responsibilities

// function TagInput({
//   label,
//   placeholder,
//   values,
//   onChange,
// }: {
//   label: string;
//   placeholder: string;
//   values: string[];
//   onChange: (next: string[]) => void;
// }) {
//   const [input, setInput] = useState("");

//   function add() {
//     const trimmed = input.trim();
//     if (trimmed && !values.includes(trimmed)) {
//       onChange([...values, trimmed]);
//     }
//     setInput("");
//   }

//   function remove(item: string) {
//     onChange(values.filter((v) => v !== item));
//   }

//   return (
//     <Box>
//       <TextField
//         label={label}
//         placeholder={placeholder}
//         value={input}
//         size="small"
//         fullWidth
//         onChange={(e) => setInput(e.target.value)}
//         onKeyDown={(e) => {
//           if (e.key === "Enter") {
//             e.preventDefault();
//             add();
//           }
//         }}
//         InputProps={{
//           endAdornment: (
//             <InputAdornment position="end">
//               <IconButton size="small" onClick={add} disabled={!input.trim()}>
//                 <AddIcon fontSize="small" />
//               </IconButton>
//             </InputAdornment>
//           ),
//         }}
//         helperText="Press Enter or click + to add"
//       />
//       {values.length > 0 && (
//         <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mt: 1 }}>
//           {values.map((v) => (
//             <Chip
//               key={v}
//               label={v}
//               size="small"
//               onDelete={() => remove(v)}
//               sx={{ maxWidth: 200 }}
//             />
//           ))}
//         </Box>
//       )}
//     </Box>
//   );
// }

// // ─── Main Modal ───────────────────────────────────────────────────────────────

// export function EditJobModal({ job, onClose, onSaved }: EditJobModalProps) {
//   const toast = useToast();

//   // Basic info
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [location, setLocation] = useState("");
//   const [type, setType] = useState<JobType>("full_time");
//   const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>("mid");
//   const [status, setStatus] = useState<JobStatus>("open");
//   const [openings, setOpenings] = useState<string>("");
//   const [applicationDeadline, setApplicationDeadline] = useState("");

//   // Salary
//   const [salaryMin, setSalaryMin] = useState<string>("");
//   const [salaryMax, setSalaryMax] = useState<string>("");
//   const [currency, setCurrency] = useState("INR");

//   // Array fields
//   const [skills, setSkills] = useState<string[]>([]);
//   const [requirements, setRequirements] = useState<string[]>([]);
//   const [responsibilities, setResponsibilities] = useState<string[]>([]);

//   const [saving, setSaving] = useState(false);

//   // ── Seed state from job ───────────────────────────────────────────────────
//   useEffect(() => {
//     if (!job) return;
//     setTitle(job.title ?? "");
//     setDescription(job.description ?? "");
//     setLocation(job.location ?? "");
//     setType((job.type as JobType) ?? "full_time");
//     setExperienceLevel((job.experienceLevel as ExperienceLevel) ?? "mid");
//     setStatus((job.status as JobStatus) ?? "open");
//     setOpenings(job.openings != null ? String(job.openings) : "");
//     setApplicationDeadline(
//       job.applicationDeadline
//         ? new Date(job.applicationDeadline).toISOString().slice(0, 16)
//         : ""
//     );
//     setSalaryMin(job.salaryRange?.min != null ? String(job.salaryRange.min) : "");
//     setSalaryMax(job.salaryRange?.max != null ? String(job.salaryRange.max) : "");
//     setCurrency(job.salaryRange?.currency ?? "INR");
//     setSkills(job.skills ?? []);
//     setRequirements(job.requirements ?? []);
//     setResponsibilities(job.responsibilities ?? []);
//   }, [job]);

//   // ── Validation ────────────────────────────────────────────────────────────
//   function validate(): string | null {
//     if (!title.trim() || title.trim().length < 3) return "Title must be at least 3 characters.";
//     if (!description.trim() || description.trim().length < 50)
//       return "Description must be at least 50 characters.";
//     if (skills.length === 0) return "At least one skill is required.";
//     if (!location.trim() || location.trim().length < 2) return "Location is required.";
//     if (salaryMin && salaryMax && Number(salaryMin) > Number(salaryMax))
//       return "Salary minimum cannot exceed maximum.";
//     return null;
//   }

//   // ── Save ──────────────────────────────────────────────────────────────────
//   async function handleSave() {
//     const err = validate();
//     if (err) { toast.error(err); return; }
//     if (!job) return;

//     const payload: Record<string, unknown> = {
//       title: title.trim(),
//       description: description.trim(),
//       location: location.trim(),
//       type,
//       experienceLevel,
//       status,
//       skills,
//       requirements: requirements.length ? requirements : undefined,
//       responsibilities: responsibilities.length ? responsibilities : undefined,
//       openings: openings ? parseInt(openings, 10) : undefined,
//       applicationDeadline: applicationDeadline
//         ? new Date(applicationDeadline).toISOString()
//         : undefined,
//     };

//     if (salaryMin || salaryMax) {
//       payload.salaryRange = {
//         min: salaryMin ? Number(salaryMin) : undefined,
//         max: salaryMax ? Number(salaryMax) : undefined,
//         currency,
//       };
//     }

//     setSaving(true);
//     try {
//       const updated = await updateJob(job._id, payload as any);
//       toast.success(`"${updated.title}" updated`);
//       onSaved(updated);
//     } catch (err) {
//       toast.error(getErrorMessage(err, "Failed to update job. Please try again."));
//     } finally {
//       setSaving(false);
//     }
//   }

//   // ── Render ────────────────────────────────────────────────────────────────
//   return (
//     <Dialog
//       open={!!job}
//       onClose={onClose}
//       fullWidth
//       maxWidth="md"
//       scroll="paper"
//       PaperProps={{
//         sx: {
//           borderRadius: 2,
//           // Taller dialog so content doesn't feel cramped
//           "& .MuiDialogContent-root": { py: 2 },
//         },
//       }}
//     >
//       {/* ── Header ── */}
//       <DialogTitle
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           pb: 1,
//           borderBottom: "1px solid",
//           borderColor: "divider",
//         }}
//       >
//         <Box>
//           <Typography variant="h6" fontWeight={700}>
//             Edit Job Posting
//           </Typography>
//           <Typography variant="caption" color="text.secondary">
//             {job?.company} &mdash; changes are visible to applicants immediately
//           </Typography>
//         </Box>
//         <IconButton size="small" onClick={onClose}>
//           <CloseIcon fontSize="small" />
//         </IconButton>
//       </DialogTitle>

//       {/* ── Body ── */}
//       <DialogContent dividers>
//         <Grid container spacing={2.5}>

//           {/* ── Overview ── */}
//           <Grid item xs={12}>
//             <SectionHeader label="Overview" />
//           </Grid>

//           <Grid item xs={12} sm={8}>
//             <TextField
//               label="Job Title"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               fullWidth
//               size="small"
//               required
//               inputProps={{ maxLength: 100 }}
//             />
//           </Grid>

//           <Grid item xs={12} sm={4}>
//             <TextField
//               select
//               label="Status"
//               value={status}
//               onChange={(e) => setStatus(e.target.value as JobStatus)}
//               fullWidth
//               size="small"
//             >
//               {JOB_STATUSES.map((s) => (
//                 <MuiMenuItem key={s.value} value={s.value}>
//                   {s.label}
//                 </MuiMenuItem>
//               ))}
//             </TextField>
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <TextField
//               select
//               label="Job Type"
//               value={type}
//               onChange={(e) => setType(e.target.value as JobType)}
//               fullWidth
//               size="small"
//             >
//               {JOB_TYPES.map((t) => (
//                 <MuiMenuItem key={t.value} value={t.value}>
//                   {t.label}
//                 </MuiMenuItem>
//               ))}
//             </TextField>
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <TextField
//               select
//               label="Experience Level"
//               value={experienceLevel}
//               onChange={(e) => setExperienceLevel(e.target.value as ExperienceLevel)}
//               fullWidth
//               size="small"
//             >
//               {EXPERIENCE_LEVELS.map((l) => (
//                 <MuiMenuItem key={l.value} value={l.value}>
//                   {l.label}
//                 </MuiMenuItem>
//               ))}
//             </TextField>
//           </Grid>

//           <Grid item xs={12} sm={8}>
//             <TextField
//               label="Location"
//               value={location}
//               onChange={(e) => setLocation(e.target.value)}
//               fullWidth
//               size="small"
//               required
//             />
//           </Grid>

//           <Grid item xs={12} sm={4}>
//             <TextField
//               label="Openings"
//               type="number"
//               value={openings}
//               onChange={(e) => setOpenings(e.target.value)}
//               fullWidth
//               size="small"
//               inputProps={{ min: 1 }}
//             />
//           </Grid>

//           <Grid item xs={12}>
//             <TextField
//               label="Application Deadline"
//               type="datetime-local"
//               value={applicationDeadline}
//               onChange={(e) => setApplicationDeadline(e.target.value)}
//               fullWidth
//               size="small"
//               InputLabelProps={{ shrink: true }}
//             />
//           </Grid>

//           {/* ── Description ── */}
//           <Grid item xs={12}>
//             <SectionHeader label="Description" />
//           </Grid>

//           <Grid item xs={12}>
//             <TextField
//               label="Job Description"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               fullWidth
//               multiline
//               minRows={5}
//               maxRows={12}
//               required
//               helperText={`${description.length} / 10,000 chars (min 50)`}
//               inputProps={{ maxLength: 10000 }}
//             />
//           </Grid>

//           {/* ── Skills & Criteria ── */}
//           <Grid item xs={12}>
//             <SectionHeader label="Skills & Criteria" />
//           </Grid>

//           <Grid item xs={12}>
//             <TagInput
//               label="Required Skills *"
//               placeholder="e.g. React"
//               values={skills}
//               onChange={setSkills}
//             />
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <TagInput
//               label="Requirements"
//               placeholder="e.g. 3+ years experience"
//               values={requirements}
//               onChange={setRequirements}
//             />
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <TagInput
//               label="Responsibilities"
//               placeholder="e.g. Lead frontend team"
//               values={responsibilities}
//               onChange={setResponsibilities}
//             />
//           </Grid>

//           {/* ── Compensation ── */}
//           <Grid item xs={12}>
//             <SectionHeader label="Compensation" />
//           </Grid>

//           <Grid item xs={12} sm={4}>
//             <TextField
//               label="Currency"
//               value={currency}
//               onChange={(e) => setCurrency(e.target.value)}
//               fullWidth
//               size="small"
//               inputProps={{ maxLength: 5 }}
//             />
//           </Grid>

//           <Grid item xs={12} sm={4}>
//             <TextField
//               label="Min Salary"
//               type="number"
//               value={salaryMin}
//               onChange={(e) => setSalaryMin(e.target.value)}
//               fullWidth
//               size="small"
//               inputProps={{ min: 0 }}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">{currency}</InputAdornment>
//                 ),
//               }}
//             />
//           </Grid>

//           <Grid item xs={12} sm={4}>
//             <TextField
//               label="Max Salary"
//               type="number"
//               value={salaryMax}
//               onChange={(e) => setSalaryMax(e.target.value)}
//               fullWidth
//               size="small"
//               inputProps={{ min: 0 }}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">{currency}</InputAdornment>
//                 ),
//               }}
//             />
//           </Grid>

//         </Grid>
//       </DialogContent>

//       {/* ── Footer ── */}
//       <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid", borderColor: "divider" }}>
//         <Stack direction="row" spacing={1.5} sx={{ ml: "auto" }}>
//           <Button variant="outlined" color="inherit" onClick={onClose} disabled={saving}>
//             Cancel
//           </Button>
//           <Button variant="contained" onClick={handleSave} disabled={saving}>
//             {saving ? "Saving…" : "Save Changes"}
//           </Button>
//         </Stack>
//       </DialogActions>
//     </Dialog>
//   );
// }


import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  MenuItem as MuiMenuItem, Grid, Typography, Divider, Chip, Box,
  InputAdornment, IconButton, Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import { useToast } from "../../../hooks/useToast";
import { updateJob, IJob } from "../services/recruiter";
import { getErrorMessage } from "../../../utils/errorUtils";

// ─── Types ────────────────────────────────────────────────────────────────────

type JobType = "full_time" | "part_time" | "contract" | "internship" | "remote";
type ExperienceLevel = "entry" | "mid" | "senior" | "lead" | "executive";
type JobStatus = "open" | "closed" | "draft";
type JobCategory = "engineering" | "design" | "creative" | "hospitality" | "logistics" | "executive" | "other";

interface EditJobModalProps {
  job: IJob | null;
  onClose: () => void;
  onSaved: (updated: IJob) => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const JOB_TYPES: { value: JobType; label: string }[] = [
  { value: "full_time", label: "Full Time" },
  { value: "part_time", label: "Part Time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "remote", label: "Remote" },
];

const EXPERIENCE_LEVELS: { value: ExperienceLevel; label: string }[] = [
  { value: "entry", label: "Entry Level" },
  { value: "mid", label: "Mid Level" },
  { value: "senior", label: "Senior" },
  { value: "lead", label: "Lead" },
  { value: "executive", label: "Executive" },
];

const JOB_STATUSES: { value: JobStatus; label: string }[] = [
  { value: "open", label: "Open" },
  { value: "closed", label: "Closed" },
  { value: "draft", label: "Draft" },
];

const CATEGORIES: { value: JobCategory; label: string }[] = [
  { value: "engineering", label: "Engineering" },
  { value: "design", label: "Design" },
  { value: "creative", label: "Creative" },
  { value: "hospitality", label: "Hospitality" },
  { value: "logistics", label: "Logistics" },
  { value: "executive", label: "Executive" },
  { value: "other", label: "Other" },
];

const CURRENCIES = ["USD", "EUR", "GBP", "INR", "AED", "CAD", "AUD", "SGD"];

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({ label }: { label: string }) {
  return (
    <Box sx={{ mb: 2, mt: 1 }}>
      <Typography variant="overline" sx={{ color: "text.secondary", letterSpacing: 1.2, fontWeight: 600 }}>
        {label}
      </Typography>
      <Divider sx={{ mt: 0.5 }} />
    </Box>
  );
}

// ─── Tag Input ────────────────────────────────────────────────────────────────

function TagInput({
  label, placeholder, values, onChange, error, helperText,
}: {
  label: string; placeholder: string; values: string[];
  onChange: (next: string[]) => void; error?: boolean; helperText?: string;
}) {
  const [input, setInput] = useState("");
  const [inputError, setInputError] = useState("");

  function add() {
    const t = input.trim();
    if (!t) { setInputError("Please enter a value"); return; }
    if (t.length < 2) { setInputError("Must be at least 2 characters"); return; }
    if (t.length > 50) { setInputError("Must be under 50 characters"); return; }
    if (values.includes(t)) { setInputError("Already added"); return; }
    if (values.length >= 20) { setInputError("Maximum 20 items allowed"); return; }
    setInputError("");
    onChange([...values, t]);
    setInput("");
  }

  return (
    <Box>
      <TextField
        label={label} placeholder={placeholder} value={input} size="small" fullWidth
        error={!!inputError || error}
        helperText={inputError || helperText || "Press Enter or click + to add"}
        onChange={(e) => { setInput(e.target.value); setInputError(""); }}
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton size="small" onClick={add} disabled={!input.trim()}>
                <AddIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {values.length > 0 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mt: 1 }}>
          {values.map((v) => (
            <Chip key={v} label={v} size="small" onDelete={() => onChange(values.filter((x) => x !== v))} />
          ))}
        </Box>
      )}
      {values.length > 0 && (
        <Typography variant="caption" color="text.secondary">{values.length} / 20</Typography>
      )}
    </Box>
  );
}

// ─── Validation ───────────────────────────────────────────────────────────────

interface FormErrors {
  title?: string; company?: string; location?: string;
  description?: string; skills?: string; openings?: string;
  salaryMin?: string; salaryMax?: string; applicationDeadline?: string;
}

function validate(f: {
  title: string; company: string; location: string; description: string;
  skills: string[]; openings: string; salaryMin: string; salaryMax: string;
  applicationDeadline: string;
}): FormErrors {
  const e: FormErrors = {};

  if (!f.title.trim()) e.title = "Job title is required";
  else if (f.title.trim().length < 3) e.title = "Must be at least 3 characters";
  else if (f.title.trim().length > 100) e.title = "Must be under 100 characters";

  if (!f.company.trim()) e.company = "Company is required";
  else if (f.company.trim().length < 2) e.company = "Must be at least 2 characters";

  if (!f.location.trim()) e.location = "Location is required";
  else if (f.location.trim().length < 2) e.location = "Must be at least 2 characters";

  if (!f.description.trim())
    e.description = "Description is required";
  else if (f.description.trim().length < 50)
    e.description = `At least 50 characters required (${50 - f.description.trim().length} more needed)`;
  else if (f.description.trim().length > 10000)
    e.description = "Must be under 10,000 characters";

  if (f.skills.length === 0) e.skills = "At least one skill is required";

  if (f.openings) {
    const n = parseInt(f.openings, 10);
    if (isNaN(n) || n < 1) e.openings = "At least 1 opening required";
    else if (n > 999) e.openings = "Cannot exceed 999";
  }

  if (f.salaryMin && Number(f.salaryMin) < 0) e.salaryMin = "Cannot be negative";
  if (f.salaryMax && Number(f.salaryMax) < 0) e.salaryMax = "Cannot be negative";
  if (f.salaryMin && f.salaryMax && Number(f.salaryMin) >= Number(f.salaryMax))
    e.salaryMin = "Min must be less than max";

  if (f.applicationDeadline) {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const d = new Date(f.applicationDeadline);
    if (isNaN(d.getTime())) e.applicationDeadline = "Invalid date";
    else if (d < today) e.applicationDeadline = "Cannot be in the past";
  }

  return e;
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

export function EditJobModal({ job, onClose, onSaved }: EditJobModalProps) {
  const toast = useToast();

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [category, setCategory] = useState<JobCategory>("engineering");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState<JobType>("full_time");
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>("mid");
  const [status, setStatus] = useState<JobStatus>("open");
  const [openings, setOpenings] = useState("");
  const [applicationDeadline, setDeadline] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [skills, setSkills] = useState<string[]>([]);
  const [requirements, setRequirements] = useState<string[]>([]);
  const [responsibilities, setResponsibilities] = useState<string[]>([]);

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormErrors, boolean>>>({});

  // ── Seed from job ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!job) return;
    setTitle(job.title ?? "");
    setCompany(job.company ?? "");
    setCategory((job as any).category ?? "engineering");
    setDescription(job.description ?? "");
    setLocation(job.location ?? "");
    setCategory(job.category ?? "");
    setType((job.type as JobType) ?? "full_time");
    setExperienceLevel((job.experienceLevel as ExperienceLevel) ?? "mid");
    setStatus((job.status as JobStatus) ?? "open");
    setOpenings(job.openings != null ? String(job.openings) : "");
    setDeadline(
      job.applicationDeadline
        ? new Date(job.applicationDeadline).toISOString().slice(0, 16)
        : ""
    );
    setSalaryMin(job.salaryRange?.min != null ? String(job.salaryRange.min) : "");
    setSalaryMax(job.salaryRange?.max != null ? String(job.salaryRange.max) : "");
    setCurrency(job.salaryRange?.currency ?? "INR");
    setSkills(job.skills ?? []);
    setRequirements(job.requirements ?? []);
    setResponsibilities(job.responsibilities ?? []);
    setErrors({});
    setTouched({});
  }, [job]);

  const getFields = () => ({ title, company, location, description, skills, openings, salaryMin, salaryMax, applicationDeadline });

  const touch = (k: keyof FormErrors) => {
    setTouched((prev) => ({ ...prev, [k]: true }));
    const e = validate(getFields());
    setErrors((prev) => ({ ...prev, [k]: e[k] }));
  };

  const fieldError = (k: keyof FormErrors) => touched[k] ? errors[k] : undefined;

  // ── Save ──────────────────────────────────────────────────────────────────
  async function handleSave() {
    const allTouched = Object.fromEntries(
      (Object.keys({ title: "", company: "", location: "", description: "", skills: "", openings: "", salaryMin: "", salaryMax: "", applicationDeadline: "" }) as (keyof FormErrors)[])
        .map((k) => [k, true])
    ) as typeof touched;
    setTouched(allTouched);

    const e = validate(getFields());
    setErrors(e);
    if (Object.keys(e).length > 0) {
      toast.error("Please fix the errors before saving.");
      return;
    }
    if (!job) return;

    const payload: Record<string, unknown> = {
      title: title.trim(),
      company: company.trim(),
      category,
      description: description.trim(),
      location: location.trim(),
      type,
      experienceLevel,
      status,
      skills,
      requirements: requirements.length ? requirements : undefined,
      responsibilities: responsibilities.length ? responsibilities : undefined,
      openings: openings ? parseInt(openings, 10) : undefined,
      applicationDeadline: applicationDeadline
        ? new Date(applicationDeadline).toISOString()
        : undefined,
    };

    if (salaryMin || salaryMax) {
      payload.salaryRange = {
        min: salaryMin ? Number(salaryMin) : undefined,
        max: salaryMax ? Number(salaryMax) : undefined,
        currency,
      };
    }

    setSaving(true);
    try {
      const updated = await updateJob(job._id, payload as any);
      toast.success(`"${updated.title}" updated`);
      onSaved(updated);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update job. Please try again."));
    } finally {
      setSaving(false);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Dialog open={!!job} onClose={onClose} fullWidth maxWidth="md" scroll="paper"
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1, borderBottom: "1px solid", borderColor: "divider" }}>
        <Box>
          <Typography variant="h6" fontWeight={700}>Edit Job Posting</Typography>
          <Typography variant="caption" color="text.secondary">
            {job?.company} — changes are visible to applicants immediately
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose}><CloseIcon fontSize="small" /></IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2.5}>

          {/* ── Overview ── */}
          <Grid item xs={12}><SectionHeader label="Overview" /></Grid>

          <Grid item xs={12} sm={8}>
            <TextField label="Job Title" value={title} fullWidth size="small" required
              inputProps={{ maxLength: 100 }}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => touch("title")}
              error={!!fieldError("title")} helperText={fieldError("title")}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField select label="Status" value={status} fullWidth size="small"
              onChange={(e) => setStatus(e.target.value as JobStatus)}
            >
              {JOB_STATUSES.map((s) => <MuiMenuItem key={s.value} value={s.value}>{s.label}</MuiMenuItem>)}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField label="Company" value={company} fullWidth size="small" required
              onChange={(e) => setCompany(e.target.value)}
              onBlur={() => touch("company")}
              error={!!fieldError("company")} helperText={fieldError("company")}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField select label="Category" value={category} fullWidth size="small"
              onChange={(e) => setCategory(e.target.value as JobCategory)}
            >
              {CATEGORIES.map((c) => <MuiMenuItem key={c.value} value={c.value}>{c.label}</MuiMenuItem>)}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField select label="Job Type" value={type} fullWidth size="small"
              onChange={(e) => setType(e.target.value as JobType)}
            >
              {JOB_TYPES.map((t) => <MuiMenuItem key={t.value} value={t.value}>{t.label}</MuiMenuItem>)}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField select label="Experience Level" value={experienceLevel} fullWidth size="small"
              onChange={(e) => setExperienceLevel(e.target.value as ExperienceLevel)}
            >
              {EXPERIENCE_LEVELS.map((l) => <MuiMenuItem key={l.value} value={l.value}>{l.label}</MuiMenuItem>)}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              fullWidth
              size="small"
            >
              {["Engineering", "Design", "Creative", "Hospitality", "Logistics", "Executive", "Other"].map((c) => (
                <MuiMenuItem key={c} value={c}>{c}</MuiMenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={8}>
            <TextField label="Location" value={location} fullWidth size="small" required
              onChange={(e) => setLocation(e.target.value)}
              onBlur={() => touch("location")}
              error={!!fieldError("location")} helperText={fieldError("location")}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField label="Openings" type="number" value={openings} fullWidth size="small"
              inputProps={{ min: 1, max: 999 }}
              onChange={(e) => setOpenings(e.target.value)}
              onBlur={() => touch("openings")}
              error={!!fieldError("openings")} helperText={fieldError("openings")}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField label="Application Deadline" type="datetime-local" value={applicationDeadline}
              fullWidth size="small" InputLabelProps={{ shrink: true }}
              inputProps={{ min: new Date().toISOString().slice(0, 16) }}
              onChange={(e) => setDeadline(e.target.value)}
              onBlur={() => touch("applicationDeadline")}
              error={!!fieldError("applicationDeadline")}
              helperText={fieldError("applicationDeadline") ?? "Optional"}
            />
          </Grid>

          {/* ── Description ── */}
          <Grid item xs={12}><SectionHeader label="Description" /></Grid>

          <Grid item xs={12}>
            <TextField label="Job Description" value={description} fullWidth multiline
              minRows={5} maxRows={12} required inputProps={{ maxLength: 10000 }}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => touch("description")}
              error={!!fieldError("description")}
              helperText={fieldError("description") ?? `${description.length} / 10,000 chars (min 50)`}
            />
          </Grid>

          {/* ── Skills & Criteria ── */}
          <Grid item xs={12}><SectionHeader label="Skills & Criteria" /></Grid>

          <Grid item xs={12}>
            <TagInput
              label="Required Skills *" placeholder="e.g. React"
              values={skills}
              onChange={(v) => { setSkills(v); setTouched((p) => ({ ...p, skills: true })); }}
              error={!!touched.skills && skills.length === 0}
              helperText={touched.skills && skills.length === 0 ? "At least one skill is required" : undefined}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TagInput label="Requirements" placeholder="e.g. 3+ years experience"
              values={requirements} onChange={setRequirements}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TagInput label="Responsibilities" placeholder="e.g. Lead frontend team"
              values={responsibilities} onChange={setResponsibilities}
            />
          </Grid>

          {/* ── Compensation ── */}
          <Grid item xs={12}><SectionHeader label="Compensation" /></Grid>

          <Grid item xs={12} sm={4}>
            <TextField select label="Currency" value={currency} fullWidth size="small"
              onChange={(e) => setCurrency(e.target.value)}
            >
              {CURRENCIES.map((c) => <MuiMenuItem key={c} value={c}>{c}</MuiMenuItem>)}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField label="Min Salary" type="number" value={salaryMin} fullWidth size="small"
              inputProps={{ min: 0 }}
              InputProps={{ startAdornment: <InputAdornment position="start">{currency}</InputAdornment> }}
              onChange={(e) => setSalaryMin(e.target.value)}
              onBlur={() => touch("salaryMin")}
              error={!!fieldError("salaryMin")} helperText={fieldError("salaryMin")}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField label="Max Salary" type="number" value={salaryMax} fullWidth size="small"
              inputProps={{ min: 0 }}
              InputProps={{ startAdornment: <InputAdornment position="start">{currency}</InputAdornment> }}
              onChange={(e) => setSalaryMax(e.target.value)}
              onBlur={() => touch("salaryMax")}
              error={!!fieldError("salaryMax")} helperText={fieldError("salaryMax")}
            />
          </Grid>

        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid", borderColor: "divider" }}>
        <Stack direction="row" spacing={1.5} sx={{ ml: "auto" }}>
          <Button variant="outlined" color="inherit" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save Changes"}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}