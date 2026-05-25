import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Stepper,
  Step,
  StepLabel,
  Box,
  Typography,
  MenuItem,
  Chip,
  IconButton,
  Grid,
  Card,
  LinearProgress,
  Divider,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { alpha } from "@mui/material/styles";
import { createJob, CreateJobPayload } from "../../RecruiterDashboard/services/recruiter";  // h ere i have to  change  
 
import { useToast } from "../../../hooks/useToast";
import { JobType, ExperienceLevel, NewJobFormState, EmploymentType, WorkMode, Urgency } from "../types";

// â”€â”€â”€ Constants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const STEPS = ["Basics", "Details", "Requirements", "Review"];

const EMPLOYMENT_TYPE_MAP: Record<string, JobType> = {
  "Full-time":  "full_time",
  "Part-time":  "part_time",
  "Contract":   "contract",
  "Internship": "internship",
  "Freelance":  "full_time",
  "Remote":     "remote",
};

const EMPTY_FORM: NewJobFormState = {
  title: "",
  company: "",
  category: "Engineering",
  employmentType: "Full-time",
  workMode: "Remote",
  location: "",
  currency: "INR",
  salaryMin: 500000,
  salaryMax: 1200000,
  experience: "3+ years",
  skills: [],
  description: "",
  responsibilities: "",
  requirements: "",
  benefits: "",
  openings: 1,
  deadline: "",
  urgency: "Standard",
};

// â”€â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function inferExperienceLevel(exp: string): ExperienceLevel {
  const s = exp.toLowerCase();
  if (s.includes("lead") || s.includes("staff") || s.includes("principal"))
    return "lead";
  if (
    s.includes("executive") ||
    s.includes("vp") ||
    s.includes("director") ||
    s.includes("c-level")
  )
    return "executive";
  if (
    s.includes("senior") ||
    s.includes("sr") ||
    s.includes("5+") ||
    s.includes("7+") ||
    s.includes("8+") ||
    s.includes("10+")
  )
    return "senior";
  if (
    s.includes("junior") ||
    s.includes("jr") ||
    s.includes("entry") ||
    s.includes("0") ||
    s.includes("1 year") ||
    s.includes("fresher")
  )
    return "entry";
  return "mid";
}

function toLines(val: string): string[] {
  return val
    .split("\n")
    .map((l) => l.replace(/^[â€¢\-\*]\s*/, "").trim())
    .filter(Boolean);
}

// â”€â”€â”€ Props â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface NewJobModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// â”€â”€â”€ Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function NewJobModal({ open, onClose, onSuccess }: NewJobModalProps) {
  const toast = useToast();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<NewJobFormState>(EMPTY_FORM);
  const [skillInput, setSkillInput] = useState("");
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const update = <K extends keyof NewJobFormState>(
    k: K,
    v: NewJobFormState[K]
  ) => setForm((f) => ({ ...f, [k]: v }));

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !form.skills.includes(s)) update("skills", [...form.skills, s]);
    setSkillInput("");
  };

  // AI assist (local mock)
  const aiGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      update(
        "description",
        `We're hiring a ${form.title || "passionate professional"} to join ${
          form.company || "our team"
        }. You'll work on high-impact projects, ship great work, and collaborate with a world-class team.`
      );
      update(
        "responsibilities",
        "â€¢ Lead end-to-end execution\nâ€¢ Partner with cross-functional teams\nâ€¢ Mentor and grow the team\nâ€¢ Drive measurable outcomes"
      );
      update(
        "requirements",
        `â€¢ ${form.experience} of relevant experience\nâ€¢ Strong communication\nâ€¢ Track record of shipping\nâ€¢ Comfortable in fast-paced environments`
      );
      update(
        "benefits",
        "â€¢ Competitive salary and equity\nâ€¢ Flexible remote work\nâ€¢ Learning budget\nâ€¢ Premium health cover"
      );
      setGenerating(false);
    }, 900);
  };

  function handleClose() {
    if (submitting) return;
    setForm(EMPTY_FORM);
    setStep(0);
    setSkillInput("");
    onClose();
  }

  async function submit() {
    setSubmitting(true);
    try {
      const payload: CreateJobPayload = {
        title:            form.title,
        company:          form.company,
        category:         form.category,
        location:         form.location,
        description:      form.description,
        responsibilities: toLines(form.responsibilities),
        requirements:     toLines(form.requirements),
        skills:           form.skills,
        type:             EMPLOYMENT_TYPE_MAP[form.employmentType] ?? "full_time",
        experienceLevel:  inferExperienceLevel(form.experience),
        openings:         form.openings,
        status:           "open",
        salaryRange: {
          min:      form.salaryMin,
          max:      form.salaryMax,
          currency: form.currency,
        },
        ...(form.deadline
          ? { applicationDeadline: new Date(form.deadline).toISOString() }
          : {}),
      };

      await createJob(payload);

      setForm(EMPTY_FORM);
      setStep(0);
      setSkillInput("");
      onSuccess();
    } catch {
      toast.error("Failed to post job. Please check your details and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const progress = Math.round(((step + 1) / STEPS.length) * 100);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{ sx: { bgcolor: "background.paper", borderRadius: 3 } }}
    >
      {/* Title */}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pr: 1,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Post a new job
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Step {step + 1} of {STEPS.length}
          </Typography>
        </Box>
        <IconButton onClick={handleClose} disabled={submitting}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <LinearProgress variant="determinate" value={progress} sx={{ height: 3 }} />

      <DialogContent>
        <Stepper activeStep={step} sx={{ mb: 4 }}>
          {STEPS.map((s) => (
            <Step key={s}>
              <StepLabel>{s}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>

            {/* â”€â”€ Step 0: Basics â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            {step === 0 && (
              <Stack spacing={2}>
                <TextField
                  label="Job title"
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Company"
                  value={form.company}
                  onChange={(e) => update("company", e.target.value)}
                  fullWidth
                />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      select
                      label="Category"
                      value={form.category}
                      onChange={(e) => update("category", e.target.value)}
                      fullWidth
                    >
                      {[
                        "Engineering", "Design", "Creative", "Hospitality",
                        "Logistics", "Executive", "Other",
                      ].map((c) => (
                        <MenuItem key={c} value={c}>{c}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      select
                      label="Type"
                      value={form.employmentType}
                      onChange={(e) =>
                        update("employmentType", e.target.value as EmploymentType)
                      }
                      fullWidth
                    >
                      {["Full-time", "Part-time", "Contract", "Internship", "Freelance", "Remote"].map(
                        (c) => <MenuItem key={c} value={c}>{c}</MenuItem>
                      )}
                    </TextField>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      select
                      label="Work mode"
                      value={form.workMode}
                      onChange={(e) =>
                        update("workMode", e.target.value as WorkMode)
                      }
                      fullWidth
                    >
                      {["Remote", "Hybrid", "On-site"].map((c) => (
                        <MenuItem key={c} value={c}>{c}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Location"
                      value={form.location}
                      onChange={(e) => update("location", e.target.value)}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Stack>
            )}

            {/* â”€â”€ Step 1: Details â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            {step === 1 && (
              <Stack spacing={2}>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <TextField
                      select
                      label="Currency"
                      value={form.currency}
                      onChange={(e) => update("currency", e.target.value)}
                      fullWidth
                    >
                      {["USD", "EUR", "GBP", "INR", "AED", "CAD", "AUD", "SGD"].map(
                        (c) => <MenuItem key={c} value={c}>{c}</MenuItem>
                      )}
                    </TextField>
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      type="number"
                      label="Min salary"
                      value={form.salaryMin}
                      onChange={(e) => update("salaryMin", +e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      type="number"
                      label="Max salary"
                      value={form.salaryMax}
                      onChange={(e) => update("salaryMax", +e.target.value)}
                      fullWidth
                    />
                  </Grid>
                </Grid>
                <TextField
                  label="Experience"
                  value={form.experience}
                  onChange={(e) => update("experience", e.target.value)}
                  fullWidth
                />
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    Description ({form.description.length} chars)
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<AutoAwesomeIcon />}
                    onClick={aiGenerate}
                    disabled={generating}
                  >
                    {generating ? "Generatingâ€¦" : "AI Assist"}
                  </Button>
                </Stack>
                <TextField
                  label="Description"
                  multiline
                  rows={4}
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  fullWidth
                  error={
                    form.description.length > 0 && form.description.length < 50
                  }
                  helperText={
                    form.description.length > 0 && form.description.length < 50
                      ? `${50 - form.description.length} more characters required`
                      : undefined
                  }
                />
                <TextField
                  label="Responsibilities"
                  multiline
                  rows={3}
                  value={form.responsibilities}
                  onChange={(e) => update("responsibilities", e.target.value)}
                  fullWidth
                />
              </Stack>
            )}

            {/* â”€â”€ Step 2: Requirements â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            {step === 2 && (
              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Skills
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <TextField
                      size="small"
                      placeholder="Add a skillâ€¦"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                      fullWidth
                    />
                    <IconButton onClick={addSkill} color="primary">
                      <AddIcon />
                    </IconButton>
                  </Stack>
                  {form.skills.length === 0 && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ mt: 0.5, display: "block" }}
                    >
                      At least one skill is required
                    </Typography>
                  )}
                  <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                    useFlexGap
                    sx={{ mt: 1 }}
                  >
                    {form.skills.map((s) => (
                      <Chip
                        key={s}
                        label={s}
                        onDelete={() =>
                          update(
                            "skills",
                            form.skills.filter((x) => x !== s)
                          )
                        }
                      />
                    ))}
                  </Stack>
                </Box>
                <TextField
                  label="Requirements"
                  multiline
                  rows={4}
                  value={form.requirements}
                  onChange={(e) => update("requirements", e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Benefits"
                  multiline
                  rows={3}
                  value={form.benefits}
                  onChange={(e) => update("benefits", e.target.value)}
                  fullWidth
                />
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <TextField
                      type="number"
                      label="Openings"
                      value={form.openings}
                      onChange={(e) => update("openings", +e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      type="date"
                      label="Deadline"
                      InputLabelProps={{ shrink: true }}
                      value={form.deadline}
                      onChange={(e) => update("deadline", e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      select
                      label="Urgency"
                      value={form.urgency}
                      onChange={(e) =>
                        update("urgency", e.target.value as Urgency)
                      }
                      fullWidth
                    >
                      {["Standard", "High", "Urgent"].map((u) => (
                        <MenuItem key={u} value={u}>{u}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
              </Stack>
            )}

            {/* â”€â”€ Step 3: Review â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            {step === 3 && (
              <Stack spacing={1}>
                <Typography variant="h6">
                  {form.title || "Untitled role"}
                </Typography>
                <Typography color="text.secondary">
                  {form.company} Â· {form.location} Â· {form.workMode}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                  {form.description}
                </Typography>
                <Typography variant="subtitle2" sx={{ mt: 2 }}>
                  Responsibilities
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                  {form.responsibilities}
                </Typography>
                <Typography variant="subtitle2" sx={{ mt: 2 }}>
                  Requirements
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                  {form.requirements}
                </Typography>
              </Stack>
            )}
          </Grid>

          {/* â”€â”€ Live preview â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <Grid item xs={12} md={5}>
            <Card sx={{ p: 3, position: "sticky", top: 0 }}>
              <Typography variant="overline" color="primary.main">
                Live preview
              </Typography>
              <Typography variant="h6" sx={{ mt: 1 }}>
                {form.title || "Job title"}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {form.company || "Company"} Â· {form.location || "Location"}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 2 }}>
                <Chip size="small" label={form.category} variant="outlined" color="primary" />
                <Chip size="small" label={form.employmentType} variant="outlined" />
                <Chip size="small" label={form.workMode} variant="outlined" />
                <Chip
                  size="small"
                  label={form.urgency}
                  sx={{ bgcolor: alpha("#7c3aed", 0.12), color: "primary.main" }}
                />
              </Stack>
              <Typography variant="h6" sx={{ color: "primary.main", mt: 2 }}>
                {form.currency} {form.salaryMin / 1000}k â€“ {form.salaryMax / 1000}k
              </Typography>
              {form.skills.length > 0 && (
                <Stack
                  direction="row"
                  spacing={1}
                  flexWrap="wrap"
                  useFlexGap
                  sx={{ mt: 2 }}
                >
                  {form.skills.slice(0, 6).map((s) => (
                    <Chip key={s} size="small" label={s} />
                  ))}
                </Stack>
              )}
            </Card>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} disabled={submitting}>
          Cancel
        </Button>
        <Box sx={{ flex: 1 }} />
        {step > 0 && (
          <Button onClick={() => setStep(step - 1)} disabled={submitting}>
            Back
          </Button>
        )}
        {step < STEPS.length - 1 ? (
          <Button
            variant="contained"
            onClick={() => setStep(step + 1)}
            disabled={
              (step === 0 &&
                (!form.title || !form.company || !form.location)) ||
              (step === 1 && form.description.length < 50) ||
              (step === 2 && form.skills.length === 0)
            }
          >
            Continue
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={submit}
            disabled={submitting}
            startIcon={
              submitting ? (
                <CircularProgress size={16} color="inherit" />
              ) : null
            }
          >
            {submitting ? "Publishingâ€¦" : "Publish job"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
