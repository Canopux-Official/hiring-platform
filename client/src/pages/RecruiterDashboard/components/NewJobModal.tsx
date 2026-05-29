import { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack,
  Stepper, Step, StepLabel, Box, Typography, MenuItem, Chip, IconButton, Grid,
  Card, LinearProgress, Divider, CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { createJob, CreateJobPayload, JobType, ExperienceLevel } from "../services/recruiter";
import { useToast } from "../../../hooks/useToast";
import { getErrorMessage } from "../../../utils/errorUtils";


const steps = ["Basics", "Details", "Requirements", "Review"];

const EMPLOYMENT_TYPE_MAP: Record<string, JobType> = {
  "Full-time": "full_time",
  "Part-time": "part_time",
  "Contract": "contract",
  "Internship": "internship",
  "Remote": "remote",
};

const CATEGORIES = [
  "Engineering", "Design", "Creative",
  "Hospitality", "Logistics", "Executive", "Other",
];

const CURRENCIES = ["USD", "EUR", "GBP", "INR", "AED", "CAD", "AUD", "SGD"];

function inferExperienceLevel(exp: string): ExperienceLevel {
  const s = exp.toLowerCase();
  if (s.includes("lead") || s.includes("staff") || s.includes("principal")) return "lead";
  if (s.includes("executive") || s.includes("vp") || s.includes("director")) return "executive";
  if (s.includes("senior") || s.includes("sr") || s.includes("5+") || s.includes("7+")) return "senior";
  if (s.includes("junior") || s.includes("jr") || s.includes("entry") || s.includes("fresher")) return "entry";
  return "mid";
}

function toLines(val: string): string[] {
  return val.split("\n").map((l) => l.replace(/^[\u2022\-\*]\s*/, "").trim()).filter(Boolean);
}

type EmploymentType = "Full-time" | "Part-time" | "Contract" | "Internship" | "Remote";

const empty = {
  title: "",
  company: "",
  category: "Engineering",
  employmentType: "Full-time" as EmploymentType,
  location: "",
  currency: "INR",
  salaryMin: 0,
  salaryMax: 0,
  experience: "3+ years",
  skills: [] as string[],
  description: "",
  responsibilities: "",
  requirements: "",
  openings: 1,
  deadline: "",
};


type FormErrors = Partial<Record<keyof typeof empty, string>>;

function validateStep(step: number, form: typeof empty): FormErrors {
  const errors: FormErrors = {};

  if (step === 0) {
    if (!form.title.trim())
      errors.title = "Job title is required";
    else if (form.title.trim().length < 3)
      errors.title = "Job title must be at least 3 characters";
    else if (form.title.trim().length > 100)
      errors.title = "Job title must be under 100 characters";

    if (!form.company.trim())
      errors.company = "Company name is required";
    else if (form.company.trim().length < 2)
      errors.company = "Company name must be at least 2 characters";

    if (!form.location.trim())
      errors.location = "Location is required";
    else if (form.location.trim().length < 2)
      errors.location = "Location must be at least 2 characters";
  }

  if (step === 1) {
    if (!form.description.trim())
      errors.description = "Description is required";
    else if (form.description.trim().length < 50)
      errors.description = `At least 50 characters required (${50 - form.description.trim().length} more needed)`;
    else if (form.description.trim().length > 10000)
      errors.description = "Description must be under 10,000 characters";

    if (!form.responsibilities.trim())
      errors.responsibilities = "Responsibilities are required";
    else if (toLines(form.responsibilities).length < 2)
      errors.responsibilities = "Please add at least 2 responsibilities";

    if (!form.experience.trim())
      errors.experience = "Experience is required";

    if (form.salaryMin < 0)
      errors.salaryMin = "Cannot be negative";
    else if (form.salaryMin > 0 && form.salaryMax > 0 && form.salaryMin >= form.salaryMax)
      errors.salaryMin = "Min salary must be less than max";

    if (form.salaryMax < 0)
      errors.salaryMax = "Cannot be negative";
    else if (form.salaryMax > 0 && form.salaryMin > 0 && form.salaryMax <= form.salaryMin)
      errors.salaryMax = "Max salary must be greater than min";
  }

  if (step === 2) {
    if (form.skills.length === 0)
      errors.skills = "At least one skill is required";
    else if (form.skills.length > 20)
      errors.skills = "Maximum 20 skills allowed";

    if (!form.requirements.trim())
      errors.requirements = "Requirements are required";
    else if (toLines(form.requirements).length < 2)
      errors.requirements = "Please add at least 2 requirements";

    if (form.openings < 1)
      errors.openings = "At least 1 opening required";
    else if (form.openings > 999)
      errors.openings = "Cannot exceed 999 openings";

    if (form.deadline) {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const d = new Date(form.deadline);
      if (isNaN(d.getTime())) errors.deadline = "Invalid date";
      else if (d < today) errors.deadline = "Deadline cannot be in the past";
    }
  }

  return errors;
}


interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function NewJobModal({ open, onClose, onSuccess }: Props) {
  const toast = useToast();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState(empty);
  const [skillInput, setSkillInput] = useState("");
  const [skillInputError, setSkillInputError] = useState("");
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof typeof empty, boolean>>>({});

  const update = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => {
    setForm((f) => {
      const updated = { ...f, [k]: v };
      if (touched[k]) {
        const stepErrors = validateStep(step, updated);
        setErrors((prev) => ({ ...prev, [k]: stepErrors[k] }));
      }
      return updated;
    });
  };

  const touch = (k: keyof typeof form) => {
    setTouched((prev) => ({ ...prev, [k]: true }));
    const stepErrors = validateStep(step, form);
    setErrors((prev) => ({ ...prev, [k]: stepErrors[k] }));
  };

  const addSkill = () => {
    const s = skillInput.trim();
    if (!s) { setSkillInputError("Please enter a skill"); return; }
    if (s.length < 2) { setSkillInputError("Must be at least 2 characters"); return; }
    if (s.length > 50) { setSkillInputError("Must be under 50 characters"); return; }
    if (form.skills.includes(s)) { setSkillInputError("Already added"); return; }
    if (form.skills.length >= 20) { setSkillInputError("Maximum 20 skills allowed"); return; }
    setSkillInputError("");
    update("skills", [...form.skills, s]);
    setSkillInput("");
  };

  const aiGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      update("description", `We're hiring a ${form.title || "passionate professional"} to join ${form.company || "our team"}. You'll work on high-impact projects, ship great work, and collaborate with a world-class team.`);
      update("responsibilities", "- Lead end-to-end execution\n- Partner with cross-functional teams\n- Mentor and grow the team\n- Drive measurable outcomes");
      update("requirements", `- ${form.experience} of relevant experience\n- Strong communication\n- Track record of shipping\n- Comfortable in fast-paced environments`);
      setGenerating(false);
    }, 900);
  };

  function handleClose() {
    if (submitting) return;
    setForm(empty);
    setStep(0);
    setSkillInput("");
    setSkillInputError("");
    setErrors({});
    setTouched({});
    onClose();
  }

  function handleNext() {
    const stepErrors = validateStep(step, form);
    const allTouched = Object.keys(stepErrors).reduce(
      (acc, k) => ({ ...acc, [k]: true }), {} as typeof touched
    );
    setTouched((prev) => ({ ...prev, ...allTouched }));
    setErrors((prev) => ({ ...prev, ...stepErrors }));
    if (Object.keys(stepErrors).length > 0) return;
    setStep(step + 1);
  }

  async function submit() {
    const stepErrors = validateStep(2, form);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      toast.error("Please fix the errors before publishing.");
      return;
    }

    setSubmitting(true);
    try {
      const payload: CreateJobPayload = {
        title: form.title.trim(),
        company: form.company.trim(),
        location: form.location.trim(),
        description: form.description.trim(),
        responsibilities: toLines(form.responsibilities),
        requirements: toLines(form.requirements),
        skills: form.skills,
        type: EMPLOYMENT_TYPE_MAP[form.employmentType] ?? "full_time",
        experienceLevel: inferExperienceLevel(form.experience),
        category: form.category.toLowerCase(),
        openings: form.openings,
        status: "open",
        salaryRange: {
          min: form.salaryMin,
          max: form.salaryMax,
          currency: form.currency,
        },
        ...(form.deadline ? { applicationDeadline: new Date(form.deadline).toISOString() } : {}),
      };

      await createJob(payload);
      setForm(empty);
      setStep(0);
      setErrors({});
      setTouched({});
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to post job. Please try again."));
    } finally {
      setSubmitting(false);
    }
  }

  const progress = Math.round(((step + 1) / steps.length) * 100);
  const fieldError = (k: keyof typeof empty) => touched[k] ? errors[k] : undefined;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth
      PaperProps={{ sx: { bgcolor: "background.paper", borderRadius: 3 } }}
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pr: 1 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Post a new job</Typography>
          <Typography variant="body2" color="text.secondary">Step {step + 1} of {steps.length}</Typography>
        </Box>
        <IconButton onClick={handleClose} disabled={submitting}><CloseIcon /></IconButton>
      </DialogTitle>
      <LinearProgress variant="determinate" value={progress} sx={{ height: 3 }} />

      <DialogContent>
        <Stepper activeStep={step} sx={{ mb: 4 }}>
          {steps.map((s) => <Step key={s}><StepLabel>{s}</StepLabel></Step>)}
        </Stepper>

        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>

            {/* Step 0: Basics */}
            {step === 0 && (
              <Stack spacing={2}>
                <TextField
                  label="Job title" value={form.title} fullWidth
                  onChange={(e) => update("title", e.target.value)}
                  onBlur={() => touch("title")}
                  error={!!fieldError("title")}
                  helperText={fieldError("title")}
                />
                <TextField
                  label="Company" value={form.company} fullWidth
                  onChange={(e) => update("company", e.target.value)}
                  onBlur={() => touch("company")}
                  error={!!fieldError("company")}
                  helperText={fieldError("company")}
                />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField select label="Category" value={form.category}
                      onChange={(e) => update("category", e.target.value)} fullWidth
                    >
                      {CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField select label="Type" value={form.employmentType}
                      onChange={(e) => update("employmentType", e.target.value as EmploymentType)} fullWidth
                    >
                      {["Full-time", "Part-time", "Contract", "Internship", "Remote"].map((c) => (
                        <MenuItem key={c} value={c}>{c}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Location" value={form.location} fullWidth
                      onChange={(e) => update("location", e.target.value)}
                      onBlur={() => touch("location")}
                      error={!!fieldError("location")}
                      helperText={fieldError("location")}
                    />
                  </Grid>
                </Grid>
              </Stack>
            )}

            {/* Step 1: Details */}
            {step === 1 && (
              <Stack spacing={2}>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <TextField select label="Currency" value={form.currency}
                      onChange={(e) => update("currency", e.target.value)} fullWidth
                    >
                      {CURRENCIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      type="number" label="Min salary" value={form.salaryMin}
                      onChange={(e) => update("salaryMin", +e.target.value)}
                      onBlur={() => touch("salaryMin")}
                      error={!!fieldError("salaryMin")}
                      helperText={fieldError("salaryMin")}
                      inputProps={{ min: 0 }} fullWidth
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      type="number" label="Max salary" value={form.salaryMax}
                      onChange={(e) => update("salaryMax", +e.target.value)}
                      onBlur={() => touch("salaryMax")}
                      error={!!fieldError("salaryMax")}
                      helperText={fieldError("salaryMax")}
                      inputProps={{ min: 0 }} fullWidth
                    />
                  </Grid>
                </Grid>
                <TextField
                  label="Experience" value={form.experience} fullWidth
                  onChange={(e) => update("experience", e.target.value)}
                  onBlur={() => touch("experience")}
                  error={!!fieldError("experience")}
                  helperText={fieldError("experience") ?? "e.g. 3+ years, Senior, Fresher"}
                />
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    Description ({form.description.length} / 10,000 chars)
                  </Typography>
                  <Button size="small" startIcon={<AutoAwesomeIcon />} onClick={aiGenerate} disabled={generating}>
                    {generating ? "Generating..." : "AI Assist"}
                  </Button>
                </Stack>
                <TextField
                  label="Description" multiline rows={4} value={form.description} fullWidth
                  onChange={(e) => update("description", e.target.value)}
                  onBlur={() => touch("description")}
                  error={!!fieldError("description")}
                  helperText={fieldError("description")}
                />
                <TextField
                  label="Responsibilities" multiline rows={3} value={form.responsibilities} fullWidth
                  onChange={(e) => update("responsibilities", e.target.value)}
                  onBlur={() => touch("responsibilities")}
                  error={!!fieldError("responsibilities")}
                  helperText={fieldError("responsibilities") ?? "One per line, at least 2"}
                />
              </Stack>
            )}

            {/* Step 2: Requirements */}
            {step === 2 && (
              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Skills {form.skills.length > 0 && `(${form.skills.length}/20)`}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <TextField
                      size="small" placeholder="Add a skill..." value={skillInput} fullWidth
                      onChange={(e) => { setSkillInput(e.target.value); setSkillInputError(""); }}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                      error={!!skillInputError}
                      helperText={skillInputError}
                    />
                    <IconButton onClick={addSkill} color="primary"><AddIcon /></IconButton>
                  </Stack>
                  {form.skills.length === 0 && touched.skills && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, display: "block" }}>
                      At least one skill is required
                    </Typography>
                  )}
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
                    {form.skills.map((s) => (
                      <Chip key={s} label={s} onDelete={() => update("skills", form.skills.filter((x) => x !== s))} />
                    ))}
                  </Stack>
                </Box>
                <TextField
                  label="Requirements" multiline rows={4} value={form.requirements} fullWidth
                  onChange={(e) => update("requirements", e.target.value)}
                  onBlur={() => touch("requirements")}
                  error={!!fieldError("requirements")}
                  helperText={fieldError("requirements") ?? "One per line, at least 2"}
                />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      type="number" label="Openings" value={form.openings} fullWidth
                      onChange={(e) => update("openings", +e.target.value)}
                      onBlur={() => touch("openings")}
                      error={!!fieldError("openings")}
                      helperText={fieldError("openings")}
                      inputProps={{ min: 1, max: 999 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      type="date" label="Deadline" InputLabelProps={{ shrink: true }}
                      value={form.deadline} fullWidth
                      onChange={(e) => update("deadline", e.target.value)}
                      onBlur={() => touch("deadline")}
                      error={!!fieldError("deadline")}
                      helperText={fieldError("deadline") ?? "Optional"}
                      inputProps={{ min: new Date().toISOString().split("T")[0] }}
                    />
                  </Grid>
                </Grid>
              </Stack>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <Stack spacing={1}>
                <Typography variant="h6">{form.title || "Untitled role"}</Typography>
                <Typography color="text.secondary">
                  {form.company} &middot; {form.location} &middot; {form.category} &middot; {form.employmentType}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>{form.description}</Typography>
                <Typography variant="subtitle2" sx={{ mt: 2 }}>Responsibilities</Typography>
                <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>{form.responsibilities}</Typography>
                <Typography variant="subtitle2" sx={{ mt: 2 }}>Requirements</Typography>
                <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>{form.requirements}</Typography>
                <Typography variant="subtitle2" sx={{ mt: 2 }}>Skills</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {form.skills.map((s) => <Chip key={s} size="small" label={s} />)}
                </Stack>
              </Stack>
            )}
          </Grid>

          {/* Live preview */}
          <Grid item xs={12} md={5}>
            <Card sx={{ p: 3, position: "sticky", top: 0 }}>
              <Typography variant="overline" color="primary.main">Live preview</Typography>
              <Typography variant="h6" sx={{ mt: 1 }}>{form.title || "Job title"}</Typography>
              <Typography color="text.secondary" variant="body2">
                {form.company || "Company"} &middot; {form.location || "Location"}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 2 }}>
                <Chip size="small" label={form.category} variant="outlined" color="primary" />
                <Chip size="small" label={form.employmentType} variant="outlined" />
                <Chip size="small" label={form.experience} variant="outlined" />
              </Stack>
              <Typography variant="h6" sx={{ color: "primary.main", mt: 2 }}>
                {form.currency} {form.salaryMin / 1000}k &ndash; {form.salaryMax / 1000}k
              </Typography>
              {form.skills.length > 0 && (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 2 }}>
                  {form.skills.slice(0, 6).map((s) => <Chip key={s} size="small" label={s} />)}
                </Stack>
              )}
            </Card>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} disabled={submitting}>Cancel</Button>
        <Box sx={{ flex: 1 }} />
        {step > 0 && (
          <Button onClick={() => setStep(step - 1)} disabled={submitting}>Back</Button>
        )}
        {step < steps.length - 1 ? (
          <Button variant="contained" onClick={handleNext}>Continue</Button>
        ) : (
          <Button
            variant="contained" onClick={submit} disabled={submitting}
            startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {submitting ? "Publishing..." : "Publish job"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}