import { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack,
  Stepper, Step, StepLabel, Box, Typography, MenuItem, Chip, IconButton, Grid,
  Card, LinearProgress, Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { alpha } from "@mui/material/styles";
import { useJobs, Job, EmploymentType, WorkMode, Urgency } from "../lib/jobs-store";

const steps = ["Basics", "Details", "Requirements", "Review"];

interface Props { open: boolean; onClose: () => void; }

const empty = {
  title: "", company: "", logo: "?", category: "Engineering",
  employmentType: "Full-time" as EmploymentType, workMode: "Remote" as WorkMode,
  location: "", currency: "USD", salaryMin: 80000, salaryMax: 140000,
  experience: "3+ years", skills: [] as string[],
  description: "", responsibilities: "", requirements: "", benefits: "",
  openings: 1, deadline: "", urgency: "Standard" as Urgency,
};

export default function NewJobModal({ open, onClose }: Props) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(empty);
  const [skillInput, setSkillInput] = useState("");
  const [generating, setGenerating] = useState(false);
  const { addJob } = useJobs();

  const update = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !form.skills.includes(s)) update("skills", [...form.skills, s]);
    setSkillInput("");
  };

  const aiGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      update("description", `We're hiring a ${form.title || "passionate professional"} to join ${form.company || "our team"}. You'll work on high-impact projects, ship great work, and collaborate with a world-class team.`);
      update("responsibilities", "• Lead end-to-end execution\n• Partner with cross-functional teams\n• Mentor and grow the team\n• Drive measurable outcomes");
      update("requirements", `• ${form.experience} of relevant experience\n• Strong communication\n• Track record of shipping\n• Comfortable in fast-paced environments`);
      update("benefits", "• Competitive salary and equity\n• Flexible remote work\n• Learning budget\n• Premium health cover");
      setGenerating(false);
    }, 900);
  };

  const submit = () => {
    const job: Job = {
      ...form,
      id: `job-${Date.now()}`,
      logo: form.company ? form.company[0].toUpperCase() : "?",
      screening: [],
      postedAt: Date.now(),
      match: 85,
      status: "published",
      isUserPosted: true,
    };
    addJob(job);
    onClose();
    setForm(empty);
    setStep(0);
  };

  const progress = Math.round(((step + 1) / steps.length) * 100);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth PaperProps={{ sx: { bgcolor: "background.paper", borderRadius: 3 } }}>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pr: 1 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Post a new job</Typography>
          <Typography variant="body2" color="text.secondary">Step {step + 1} of {steps.length}</Typography>
        </Box>
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </DialogTitle>
      <LinearProgress variant="determinate" value={progress} sx={{ height: 3 }} />

      <DialogContent>
        <Stepper activeStep={step} sx={{ mb: 4 }}>
          {steps.map((s) => <Step key={s}><StepLabel>{s}</StepLabel></Step>)}
        </Stepper>

        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            {step === 0 && (
              <Stack spacing={2}>
                <TextField label="Job title" value={form.title} onChange={(e) => update("title", e.target.value)} fullWidth />
                <TextField label="Company" value={form.company} onChange={(e) => update("company", e.target.value)} fullWidth />
                <Grid container spacing={2}>
                  <Grid item xs={6}><TextField select label="Category" value={form.category} onChange={(e) => update("category", e.target.value)} fullWidth>
                    {["Engineering", "Design", "Creative", "Hospitality", "Logistics", "Executive", "Other"].map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                  </TextField></Grid>
                  <Grid item xs={6}><TextField select label="Type" value={form.employmentType} onChange={(e) => update("employmentType", e.target.value as EmploymentType)} fullWidth>
                    {["Full-time", "Part-time", "Contract", "Internship", "Freelance", "Remote"].map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                  </TextField></Grid>
                  <Grid item xs={6}><TextField select label="Work mode" value={form.workMode} onChange={(e) => update("workMode", e.target.value as WorkMode)} fullWidth>
                    {["Remote", "Hybrid", "On-site"].map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                  </TextField></Grid>
                  <Grid item xs={6}><TextField label="Location" value={form.location} onChange={(e) => update("location", e.target.value)} fullWidth /></Grid>
                </Grid>
              </Stack>
            )}

            {step === 1 && (
              <Stack spacing={2}>
                <Grid container spacing={2}>
                  <Grid item xs={4}><TextField select label="Currency" value={form.currency} onChange={(e) => update("currency", e.target.value)} fullWidth>
                    {["USD", "EUR", "GBP", "INR", "AED", "CAD", "AUD", "SGD"].map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                  </TextField></Grid>
                  <Grid item xs={4}><TextField type="number" label="Min salary" value={form.salaryMin} onChange={(e) => update("salaryMin", +e.target.value)} fullWidth /></Grid>
                  <Grid item xs={4}><TextField type="number" label="Max salary" value={form.salaryMax} onChange={(e) => update("salaryMax", +e.target.value)} fullWidth /></Grid>
                </Grid>
                <TextField label="Experience" value={form.experience} onChange={(e) => update("experience", e.target.value)} fullWidth />
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">Description ({form.description.length} chars)</Typography>
                  <Button size="small" startIcon={<AutoAwesomeIcon />} onClick={aiGenerate} disabled={generating}>
                    {generating ? "Generating…" : "AI Assist"}
                  </Button>
                </Stack>
                <TextField label="Description" multiline rows={4} value={form.description} onChange={(e) => update("description", e.target.value)} fullWidth />
                <TextField label="Responsibilities" multiline rows={3} value={form.responsibilities} onChange={(e) => update("responsibilities", e.target.value)} fullWidth />
              </Stack>
            )}

            {step === 2 && (
              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>Skills</Typography>
                  <Stack direction="row" spacing={1}>
                    <TextField size="small" placeholder="Add a skill…" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }} fullWidth />
                    <IconButton onClick={addSkill} color="primary"><AddIcon /></IconButton>
                  </Stack>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
                    {form.skills.map((s) => (
                      <Chip key={s} label={s} onDelete={() => update("skills", form.skills.filter((x) => x !== s))} />
                    ))}
                  </Stack>
                </Box>
                <TextField label="Requirements" multiline rows={4} value={form.requirements} onChange={(e) => update("requirements", e.target.value)} fullWidth />
                <TextField label="Benefits" multiline rows={3} value={form.benefits} onChange={(e) => update("benefits", e.target.value)} fullWidth />
                <Grid container spacing={2}>
                  <Grid item xs={4}><TextField type="number" label="Openings" value={form.openings} onChange={(e) => update("openings", +e.target.value)} fullWidth /></Grid>
                  <Grid item xs={4}><TextField type="date" label="Deadline" InputLabelProps={{ shrink: true }} value={form.deadline} onChange={(e) => update("deadline", e.target.value)} fullWidth /></Grid>
                  <Grid item xs={4}><TextField select label="Urgency" value={form.urgency} onChange={(e) => update("urgency", e.target.value as Urgency)} fullWidth>
                    {["Standard", "High", "Urgent"].map((u) => <MenuItem key={u} value={u}>{u}</MenuItem>)}
                  </TextField></Grid>
                </Grid>
              </Stack>
            )}

            {step === 3 && (
              <Stack spacing={1}>
                <Typography variant="h6">{form.title || "Untitled role"}</Typography>
                <Typography color="text.secondary">{form.company} · {form.location} · {form.workMode}</Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>{form.description}</Typography>
                <Typography variant="subtitle2" sx={{ mt: 2 }}>Responsibilities</Typography>
                <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>{form.responsibilities}</Typography>
                <Typography variant="subtitle2" sx={{ mt: 2 }}>Requirements</Typography>
                <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>{form.requirements}</Typography>
              </Stack>
            )}
          </Grid>

          {/* Live preview */}
          <Grid item xs={12} md={5}>
            <Card sx={{ p: 3, position: "sticky", top: 0 }}>
              <Typography variant="overline" color="primary.main">Live preview</Typography>
              <Typography variant="h6" sx={{ mt: 1 }}>{form.title || "Job title"}</Typography>
              <Typography color="text.secondary" variant="body2">{form.company || "Company"} · {form.location || "Location"}</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 2 }}>
                <Chip size="small" label={form.employmentType} variant="outlined" />
                <Chip size="small" label={form.workMode} variant="outlined" />
                <Chip size="small" label={form.urgency} sx={{ bgcolor: alpha("#34d39e", 0.12), color: "primary.main" }} />
              </Stack>
              <Typography variant="h6" sx={{ color: "primary.main", mt: 2 }}>
                {form.currency} {form.salaryMin / 1000}k – {form.salaryMax / 1000}k
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
        <Button onClick={onClose}>Cancel</Button>
        <Box sx={{ flex: 1 }} />
        {step > 0 && <Button onClick={() => setStep(step - 1)}>Back</Button>}
        {step < steps.length - 1 ? (
          <Button variant="contained" onClick={() => setStep(step + 1)} disabled={step === 0 && (!form.title || !form.company)}>
            Continue
          </Button>
        ) : (
          <Button variant="contained" onClick={submit}>Publish job</Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
