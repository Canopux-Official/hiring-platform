import { useState, useEffect, useCallback } from "react";
import {
  Container,
  Grid,
  Card,
  Typography,
  Stack,
  Box,
  Chip,
  Button,
  Avatar,
  TextField,
  IconButton,
  Divider,
  Tab,
  Tabs,
  CircularProgress,
  Alert,
  Snackbar,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import LinkIcon from "@mui/icons-material/Link";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import StarIcon from "@mui/icons-material/Star";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import HistoryIcon from "@mui/icons-material/History";

import { useAuth } from "../lib/auth";
import {
  getMyProfile,
  updateMyProfile,
  updateUserInfo,
  getMyApplications,
  getRecommendedJobs,
  withdrawApplication,
  IJobSeekerProfile,
  IApplication,
  IRecommendedJob,
  IExperience,
  IEducation,
  ApplicationStatus,
} from "../api/seeker";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtSalary(n?: number) {
  if (!n) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
    notation: "compact",
  }).format(n);
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d === 0) return "Today";
  if (d === 1) return "Yesterday";
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", { month: "short", year: "numeric" });
}

function fmtDate(iso: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", { month: "short", year: "numeric" });
}

const STATUS_META: Record<
  ApplicationStatus,
  { label: string; color: "default" | "warning" | "info" | "error" | "success"; icon: JSX.Element }
> = {
  pending: { label: "Pending", color: "default", icon: <HourglassEmptyIcon sx={{ fontSize: 14 }} /> },
  reviewed: { label: "Reviewed", color: "info", icon: <CheckCircleIcon sx={{ fontSize: 14 }} /> },
  shortlisted: { label: "Shortlisted", color: "warning", icon: <StarIcon sx={{ fontSize: 14 }} /> },
  rejected: { label: "Rejected", color: "error", icon: <CancelIcon sx={{ fontSize: 14 }} /> },
  hired: { label: "Hired 🎉", color: "success", icon: <CheckCircleIcon sx={{ fontSize: 14 }} /> },
};

// Ensure arrays are never undefined even if backend omits them
function normalizeProfile(p: IJobSeekerProfile): IJobSeekerProfile {
  return {
    ...p,
    skills: p.skills ?? [],
    experience: p.experience ?? [],
    education: p.education ?? [],
    preferredLocations: p.preferredLocations ?? [],
    statusHistory: (p as any).statusHistory ?? [],
  };
}

function profileCompletion(profile: IJobSeekerProfile | null): number {
  if (!profile) return 0;
  const fields: boolean[] = [
    !!profile.headline,
    !!profile.bio,
    !!profile.resumeUrl,
    (profile.skills ?? []).length > 0,
    (profile.experience ?? []).length > 0,
    (profile.education ?? []).length > 0,
    !!profile.expectedSalary,
    (profile.preferredLocations ?? []).length > 0,
    !!profile.linkedIn || !!profile.github || !!profile.portfolio,
  ];
  return Math.round((fields.filter(Boolean).length / fields.length) * 100);
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function RingProgress({ value, size = 110 }: { value: number; size?: number }) {
  const r = (size - 16) / 2;
  const c = 2 * Math.PI * r;
  return (
    <Box sx={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke={alpha("#ffffff", 0.08)} strokeWidth={8} fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          stroke="#34d39e" strokeWidth={8} fill="none"
          strokeDasharray={c} strokeDashoffset={c - (c * value) / 100}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <Box sx={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
        <Typography variant="h6" sx={{ color: "primary.main", fontWeight: 800 }}>{value}%</Typography>
      </Box>
    </Box>
  );
}

function SkillEditor({
  skills,
  onChange,
}: {
  skills: string[];
  onChange: (s: string[]) => void;
}) {
  const [input, setInput] = useState("");
  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !skills.includes(trimmed)) onChange([...skills, trimmed]);
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

function LocationEditor({
  locations,
  onChange,
}: {
  locations: string[];
  onChange: (l: string[]) => void;
}) {
  const [input, setInput] = useState("");
  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !locations.includes(trimmed)) onChange([...locations, trimmed]);
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

// ─── Experience Dialog ────────────────────────────────────────────────────────

const emptyExp = (): IExperience => ({
  title: "",
  company: "",
  location: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  description: "",
});

function ExperienceDialog({
  open,
  initial,
  onSave,
  onClose,
}: {
  open: boolean;
  initial: IExperience | null;
  onSave: (e: IExperience) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<IExperience>(initial ?? emptyExp());
  useEffect(() => setForm(initial ?? emptyExp()), [initial]);
  const set = (k: keyof IExperience) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initial ? "Edit experience" : "Add experience"}
        <IconButton onClick={onClose} sx={{ position: "absolute", right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField label="Job title" value={form.title} onChange={set("title")} fullWidth required />
          <TextField label="Company" value={form.company} onChange={set("company")} fullWidth required />
          <TextField label="Location" value={form.location ?? ""} onChange={set("location")} fullWidth />
          <Stack direction="row" spacing={2}>
            <TextField
              label="Start date"
              type="month"
              value={form.startDate ? form.startDate.slice(0, 7) : ""}
              onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End date"
              type="month"
              value={form.endDate ? form.endDate.slice(0, 7) : ""}
              onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value, isCurrent: !e.target.value }))}
              fullWidth
              disabled={form.isCurrent}
              InputLabelProps={{ shrink: true }}
            />
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <input
              type="checkbox"
              id="isCurrent"
              checked={form.isCurrent}
              onChange={(e) => setForm((f) => ({ ...f, isCurrent: e.target.checked, endDate: e.target.checked ? "" : f.endDate }))}
            />
            <label htmlFor="isCurrent">
              <Typography variant="body2">I currently work here</Typography>
            </label>
          </Stack>
          <TextField
            label="Description"
            value={form.description ?? ""}
            onChange={set("description")}
            multiline
            rows={3}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={() => onSave(form)}
          disabled={!form.title || !form.company || !form.startDate}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Education Dialog ─────────────────────────────────────────────────────────

const emptyEdu = (): IEducation => ({
  degree: "",
  institution: "",
  fieldOfStudy: "",
  startYear: new Date().getFullYear(),
  endYear: undefined,
  grade: "",
});

function EducationDialog({
  open,
  initial,
  onSave,
  onClose,
}: {
  open: boolean;
  initial: IEducation | null;
  onSave: (e: IEducation) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<IEducation>(initial ?? emptyEdu());
  useEffect(() => setForm(initial ?? emptyEdu()), [initial]);
  const set = (k: keyof IEducation) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initial ? "Edit education" : "Add education"}
        <IconButton onClick={onClose} sx={{ position: "absolute", right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField label="Degree" value={form.degree} onChange={set("degree")} fullWidth required />
          <TextField label="Institution" value={form.institution} onChange={set("institution")} fullWidth required />
          <TextField label="Field of study" value={form.fieldOfStudy} onChange={set("fieldOfStudy")} fullWidth required />
          <Stack direction="row" spacing={2}>
            <TextField
              label="Start year"
              type="number"
              value={form.startYear}
              onChange={(e) => setForm((f) => ({ ...f, startYear: +e.target.value }))}
              fullWidth
              inputProps={{ min: 1970, max: new Date().getFullYear() + 5 }}
            />
            <TextField
              label="End year"
              type="number"
              value={form.endYear ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, endYear: e.target.value ? +e.target.value : undefined }))}
              fullWidth
              inputProps={{ min: 1970, max: new Date().getFullYear() + 5 }}
            />
          </Stack>
          <TextField label="Grade / CGPA (optional)" value={form.grade ?? ""} onChange={set("grade")} fullWidth />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={() => onSave(form)}
          disabled={!form.degree || !form.institution || !form.fieldOfStudy}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Sections ─────────────────────────────────────────────────────────────────

function ProfileTab({
  profile,
  saving,
  onSave,
}: {
  profile: IJobSeekerProfile;
  saving: boolean;
  onSave: (patch: Partial<IJobSeekerProfile>) => void;
}) {
  const [form, setForm] = useState<Partial<IJobSeekerProfile>>(profile);
  const [expDialog, setExpDialog] = useState<{ open: boolean; idx: number | null }>({ open: false, idx: null });
  const [eduDialog, setEduDialog] = useState<{ open: boolean; idx: number | null }>({ open: false, idx: null });

  useEffect(() => setForm(profile), [profile]);

  const set = (k: keyof IJobSeekerProfile, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const saveExp = (exp: IExperience) => {
    const list = [...(form.experience ?? [])];
    if (expDialog.idx !== null) list[expDialog.idx] = exp;
    else list.push(exp);
    set("experience", list);
    setExpDialog({ open: false, idx: null });
  };

  const saveEdu = (edu: IEducation) => {
    const list = [...(form.education ?? [])];
    if (eduDialog.idx !== null) list[eduDialog.idx] = edu;
    else list.push(edu);
    set("education", list);
    setEduDialog({ open: false, idx: null });
  };

  return (
    <Box>
      {/* Basic Info */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Basic info</Typography>
        <Stack spacing={2.5}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Headline"
              fullWidth
              placeholder="e.g. Senior Full Stack Engineer at Startup"
              value={form.headline ?? ""}
              onChange={(e) => set("headline", e.target.value)}
            />
            <TextField
              label="Resume URL"
              fullWidth
              placeholder="https://drive.google.com/…"
              value={form.resumeUrl ?? ""}
              onChange={(e) => set("resumeUrl", e.target.value)}
              InputProps={{ endAdornment: form.resumeUrl ? <a href={form.resumeUrl} target="_blank" rel="noreferrer"><OpenInNewIcon sx={{ fontSize: 18, color: "text.secondary" }} /></a> : null }}
            />
          </Stack>
          <TextField
            label="Bio"
            fullWidth
            multiline
            rows={3}
            placeholder="Write a short professional summary…"
            value={form.bio ?? ""}
            onChange={(e) => set("bio", e.target.value)}
          />
        </Stack>
      </Card>

      {/* Salary & Notice */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Compensation & availability</Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Current salary (₹/year)"
            type="number"
            fullWidth
            value={form.currentSalary ?? ""}
            onChange={(e) => set("currentSalary", e.target.value ? +e.target.value : undefined)}
          />
          <TextField
            label="Expected salary (₹/year)"
            type="number"
            fullWidth
            value={form.expectedSalary ?? ""}
            onChange={(e) => set("expectedSalary", e.target.value ? +e.target.value : undefined)}
          />
          <TextField
            label="Notice period (days)"
            type="number"
            fullWidth
            value={form.noticePeriod ?? ""}
            onChange={(e) => set("noticePeriod", e.target.value ? +e.target.value : undefined)}
          />
        </Stack>
      </Card>

      {/* Skills */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Skills</Typography>
        <SkillEditor
          skills={form.skills ?? []}
          onChange={(s) => set("skills", s)}
        />
      </Card>

      {/* Preferred locations */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Preferred locations</Typography>
        <LocationEditor
          locations={form.preferredLocations ?? []}
          onChange={(l) => set("preferredLocations", l)}
        />
      </Card>

      {/* Experience */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Experience</Typography>
          <Button size="small" startIcon={<AddIcon />} onClick={() => setExpDialog({ open: true, idx: null })}>
            Add
          </Button>
        </Stack>
        <Stack spacing={2}>
          {(form.experience ?? []).map((exp, i) => (
            <Box key={i} sx={{ p: 2, borderRadius: 2, border: `1px solid ${alpha("#ffffff", 0.08)}` }}>
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography variant="body1" fontWeight={600}>{exp.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {exp.company}{exp.location ? ` · ${exp.location}` : ""}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {fmtDate(exp.startDate)} – {exp.isCurrent ? "Present" : fmtDate(exp.endDate ?? "")}
                  </Typography>
                  {exp.description && (
                    <Typography variant="body2" sx={{ mt: 0.5, color: "text.secondary" }}>
                      {exp.description}
                    </Typography>
                  )}
                </Box>
                <Stack direction="row" spacing={0.5}>
                  <IconButton size="small" onClick={() => setExpDialog({ open: true, idx: i })}>
                    <EditIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => set("experience", (form.experience ?? []).filter((_, j) => j !== i))}>
                    <DeleteIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Stack>
              </Stack>
            </Box>
          ))}
          {(form.experience ?? []).length === 0 && (
            <Typography variant="body2" color="text.secondary">No experience added yet.</Typography>
          )}
        </Stack>
      </Card>

      {/* Education */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Education</Typography>
          <Button size="small" startIcon={<AddIcon />} onClick={() => setEduDialog({ open: true, idx: null })}>
            Add
          </Button>
        </Stack>
        <Stack spacing={2}>
          {(form.education ?? []).map((edu, i) => (
            <Box key={i} sx={{ p: 2, borderRadius: 2, border: `1px solid ${alpha("#ffffff", 0.08)}` }}>
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography variant="body1" fontWeight={600}>{edu.degree} in {edu.fieldOfStudy}</Typography>
                  <Typography variant="body2" color="text.secondary">{edu.institution}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {edu.startYear} – {edu.endYear ?? "Present"}
                    {edu.grade ? ` · ${edu.grade}` : ""}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={0.5}>
                  <IconButton size="small" onClick={() => setEduDialog({ open: true, idx: i })}>
                    <EditIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => set("education", (form.education ?? []).filter((_, j) => j !== i))}>
                    <DeleteIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Stack>
              </Stack>
            </Box>
          ))}
          {(form.education ?? []).length === 0 && (
            <Typography variant="body2" color="text.secondary">No education added yet.</Typography>
          )}
        </Stack>
      </Card>

      {/* Links */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Links</Typography>
        <Stack spacing={2}>
          <TextField
            label="LinkedIn"
            fullWidth
            placeholder="https://linkedin.com/in/…"
            value={form.linkedIn ?? ""}
            onChange={(e) => set("linkedIn", e.target.value)}
            InputProps={{ startAdornment: <LinkIcon sx={{ mr: 1, fontSize: 18, color: "text.secondary" }} /> }}
          />
          <TextField
            label="GitHub"
            fullWidth
            placeholder="https://github.com/…"
            value={form.github ?? ""}
            onChange={(e) => set("github", e.target.value)}
            InputProps={{ startAdornment: <LinkIcon sx={{ mr: 1, fontSize: 18, color: "text.secondary" }} /> }}
          />
          <TextField
            label="Portfolio / website"
            fullWidth
            placeholder="https://yoursite.com"
            value={form.portfolio ?? ""}
            onChange={(e) => set("portfolio", e.target.value)}
            InputProps={{ startAdornment: <LinkIcon sx={{ mr: 1, fontSize: 18, color: "text.secondary" }} /> }}
          />
        </Stack>
      </Card>

      <Button
        variant="contained"
        size="large"
        startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
        disabled={saving}
        onClick={() => onSave(form)}
        sx={{ mb: 4 }}
      >
        {saving ? "Saving…" : "Save profile"}
      </Button>

      {/* Dialogs */}
      <ExperienceDialog
        open={expDialog.open}
        initial={expDialog.idx !== null ? (form.experience ?? [])[expDialog.idx] : null}
        onSave={saveExp}
        onClose={() => setExpDialog({ open: false, idx: null })}
      />
      <EducationDialog
        open={eduDialog.open}
        initial={eduDialog.idx !== null ? (form.education ?? [])[eduDialog.idx] : null}
        onSave={saveEdu}
        onClose={() => setEduDialog({ open: false, idx: null })}
      />
    </Box>
  );
}

function ApplicationsTab({
  applications,
  loading,
  onWithdraw,
}: {
  applications: IApplication[];
  loading: boolean;
  onWithdraw: (id: string) => void;
}) {
  const [withdrawing, setWithdrawing] = useState<string | null>(null);

  const handleWithdraw = async (id: string) => {
    setWithdrawing(id);
    await onWithdraw(id);
    setWithdrawing(null);
  };

  if (loading) return <CircularProgress />;

  if (applications.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 6 }}>
        <WorkIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
        <Typography variant="h6" color="text.secondary">No applications yet</Typography>
        <Typography variant="body2" color="text.secondary">Start applying to jobs to track them here.</Typography>
      </Box>
    );
  }

  const STATUS_COLOR: Record<string, "default" | "warning" | "info" | "error" | "success"> = {
    pending: "default",
    reviewed: "warning",
    shortlisted: "info",
    rejected: "error",
    hired: "success",
  };

  return (
    <Stack spacing={2}>
      {applications.map((app) => {
        const meta = STATUS_META[app.status];
        return (
          <Card key={app._id} sx={{ p: 3 }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "flex-start" }}>
              <Box sx={{ flex: 1 }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.5 }}>
                  <Typography variant="body1" fontWeight={700}>{app.job.title}</Typography>
                  <Chip
                    label={meta.label}
                    color={meta.color}
                    size="small"
                    icon={meta.icon}
                  />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {app.job.company} · {app.job.location}
                  {(app.job.salaryMin || app.job.salaryMax) && (
                    <> · {fmtSalary(app.job.salaryMin)}–{fmtSalary(app.job.salaryMax)}</>
                  )}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Applied {timeAgo(app.createdAt)}
                </Typography>

                {/* Status history mini-timeline */}
                {app.statusHistory.length > 1 && (
                  <Box sx={{ mt: 2 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                      <HistoryIcon sx={{ fontSize: 15, color: "text.secondary" }} />
                      <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
                        Timeline
                      </Typography>
                    </Stack>

                    <Stack spacing={0}>
                      {app.statusHistory.map((h, i, arr) => (
                        <Box key={i} sx={{ display: "flex", gap: 1.5, position: "relative" }}>

                          {i < arr.length - 1 && (
                            <Box sx={{
                              position: "absolute",
                              left: 6, top: 20, bottom: 0,
                              width: "1px",
                              bgcolor: alpha("#ffffff", 0.1),
                            }} />
                          )}

                          <Box sx={{
                            width: 13, height: 13,
                            borderRadius: "50%",
                            flexShrink: 0,
                            mt: "4px",
                            bgcolor: i === arr.length - 1 ? "primary.main" : alpha("#ffffff", 0.12),
                            border: `2px solid ${i === arr.length - 1 ? "primary.main" : alpha("#ffffff", 0.2)}`,
                            zIndex: 1,
                          }} />

                          <Box sx={{ pb: 2.5, flex: 1 }}>
                            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                              <Chip
                                size="small"
                                label={STATUS_META[h.status]?.label ?? h.status}
                                color={STATUS_COLOR[h.status] ?? "default"}
                                sx={{
                                  textTransform: "capitalize",
                                  height: 22,
                                  fontSize: "0.7rem",
                                  fontWeight: 600,
                                  "& .MuiChip-label": { px: 1 },
                                }}
                              />
                              <Typography variant="caption" color="text.disabled" sx={{ fontSize: "0.7rem" }}>
                                {timeAgo(h.changedAt)}
                              </Typography>
                            </Stack>
                            {h.note && (
                              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5, fontSize: "0.72rem" }}>
                                {h.note}
                              </Typography>
                            )}
                          </Box>

                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}

                {app.recruiterNotes && (
                  <Box sx={{ mt: 1.5, p: 1.5, borderRadius: 1, bgcolor: alpha("#34d39e", 0.06), borderLeft: "3px solid", borderColor: "primary.main" }}>
                    <Typography variant="caption" color="text.secondary">Recruiter note:</Typography>
                    <Typography variant="body2">{app.recruiterNotes}</Typography>
                  </Box>
                )}
              </Box>

              <Stack spacing={1} alignItems={{ xs: "flex-start", sm: "flex-end" }}>
                {app.resumeUrl && (
                  <Button
                    size="small"
                    variant="outlined"
                    endIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
                    href={app.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View resume
                  </Button>
                )}
                {app.status === "pending" && (
                  <Tooltip title="Withdraw this application">
                    <Button
                      size="small"
                      color="error"
                      variant="outlined"
                      startIcon={withdrawing === app._id ? <CircularProgress size={14} color="inherit" /> : <CancelIcon sx={{ fontSize: 14 }} />}
                      disabled={withdrawing === app._id}
                      onClick={() => handleWithdraw(app._id)}
                    >
                      Withdraw
                    </Button>
                  </Tooltip>
                )}
              </Stack>
            </Stack>
          </Card>
        );
      })}
    </Stack>
  );
}

function RecommendedTab({ jobs, loading }: { jobs: IRecommendedJob[]; loading: boolean }) {
  if (loading) return <CircularProgress />;
  if (jobs.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 6 }}>
        <StarIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
        <Typography variant="h6" color="text.secondary">No recommendations yet</Typography>
        <Typography variant="body2" color="text.secondary">
          Complete your profile — skills, preferred locations, and expected salary — to get matched jobs.
        </Typography>
      </Box>
    );
  }
  return (
    <Stack spacing={2}>
      {jobs.map((job) => (
        <Card key={job._id} sx={{ p: 3 }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }}>
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                <Typography variant="body1" fontWeight={700}>{job.title}</Typography>
                {job.matchScore !== undefined && (
                  <Chip label={`${job.matchScore}% match`} size="small" sx={{ bgcolor: alpha("#34d39e", 0.12), color: "primary.main", fontWeight: 700 }} />
                )}
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {job.company} · {job.location}
                {(job.salaryMin || job.salaryMax) && <> · {fmtSalary(job.salaryMin)}–{fmtSalary(job.salaryMax)}</>}
              </Typography>
              <Typography variant="caption" color="text.secondary">Posted {timeAgo(job.postedAt)}</Typography>
              {job.skills?.length > 0 && (
                <Stack direction="row" flexWrap="wrap" gap={0.5} sx={{ mt: 1 }}>
                  {job.skills.slice(0, 6).map((s) => (
                    <Chip key={s} label={s} size="small" variant="outlined" sx={{ fontSize: 11 }} />
                  ))}
                </Stack>
              )}
            </Box>
            <Button variant="contained" size="small" sx={{ whiteSpace: "nowrap" }}>
              Apply now
            </Button>
          </Stack>
        </Card>
      ))}
    </Stack>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function SeekerDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState(0);

  const [profile, setProfile] = useState<IJobSeekerProfile | null>(null);
  const [applications, setApplications] = useState<IApplication[]>([]);
  const [recommended, setRecommended] = useState<IRecommendedJob[]>([]);

  const [profileLoading, setProfileLoading] = useState(true);
  const [appsLoading, setAppsLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });
  const showToast = (message: string, severity: "success" | "error" = "success") =>
    setToast({ open: true, message, severity });
  const closeToast = () => setToast((t) => ({ ...t, open: false }));

  useEffect(() => {
    getMyProfile()
      .then((p) => setProfile(normalizeProfile(p)))
      .catch(console.error)
      .finally(() => setProfileLoading(false));

    getMyApplications()
      .then(setApplications)
      .catch(console.error)
      .finally(() => setAppsLoading(false));

    getRecommendedJobs()
      .then(setRecommended)
      .catch(console.error)
      .finally(() => setJobsLoading(false));
  }, []);

  const handleSaveProfile = useCallback(async (patch: Partial<IJobSeekerProfile>) => {
    setSaving(true);
    try {
      const updated = await updateMyProfile(patch);
      setProfile(normalizeProfile(updated));
      showToast("Profile updated successfully!");
    } catch (e) {
      showToast("Failed to save profile. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  }, []);

  const handleWithdraw = useCallback(async (id: string) => {
    try {
      await withdrawApplication(id);
      setApplications((prev) => prev.filter((a) => a._id !== id));
    } catch {
      showToast("Failed to withdraw application. Please try again.", "error");
    }
  }, []);

  const completion = profileCompletion(profile);
  const pending = applications.filter((a) => a.status === "pending").length;
  const shortlisted = applications.filter((a) => a.status === "shortlisted").length;
  const hired = applications.filter((a) => a.status === "hired").length;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="overline" color="primary.main">Talent workspace</Typography>
        <Typography variant="h3" sx={{ fontSize: { xs: 26, md: 34 }, fontWeight: 800 }}>
          Hi {user?.name.split(" ")[0]}{recommended.length > 0 ? `, ${recommended.length} jobs match your profile` : ""}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Sidebar */}
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 3, mb: 3, textAlign: "center" }}>
            <Avatar sx={{ width: 72, height: 72, mx: "auto", mb: 2, bgcolor: "primary.main", color: "primary.contrastText", fontWeight: 800, fontSize: 26 }}>
              {user?.avatar ?? user?.name?.[0]}
            </Avatar>
            <Typography variant="h6" fontWeight={700}>{user?.name}</Typography>
            {profile?.headline && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{profile.headline}</Typography>
            )}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <RingProgress value={completion} />
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
              Profile completion
            </Typography>
            {completion < 100 && (
              <Button variant="outlined" size="small" fullWidth sx={{ mt: 2 }} onClick={() => setTab(0)}>
                Improve profile
              </Button>
            )}
          </Card>

          {/* Stats */}
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>Applications</Typography>
            {appsLoading ? <LinearProgress /> : (
              <Stack spacing={1.5}>
                {[
                  { label: "Total", value: applications.length, color: "text.primary" },
                  { label: "Pending", value: pending, color: "text.secondary" },
                  { label: "Shortlisted", value: shortlisted, color: "warning.main" },
                  { label: "Hired", value: hired, color: "success.main" },
                ].map((s) => (
                  <Stack key={s.label} direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">{s.label}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: s.color }}>{s.value}</Typography>
                  </Stack>
                ))}
              </Stack>
            )}
          </Card>

          {/* Quick links */}
          {profile && (
            <Card sx={{ p: 3 }}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>Links</Typography>
              <Stack spacing={1}>
                {[
                  { label: "LinkedIn", url: profile.linkedIn },
                  { label: "GitHub", url: profile.github },
                  { label: "Portfolio", url: profile.portfolio },
                  { label: "Resume", url: profile.resumeUrl },
                ]
                  .filter((l) => l.url)
                  .map((l) => (
                    <Button
                      key={l.label}
                      component="a" // Explicitly tells MUI to expect anchor attributes like target
                      size="small"
                      variant="outlined"
                      endIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
                      href={l.url as string} // Explicitly narrow the type down for TypeScript
                      target="_blank"
                      rel="noreferrer"
                      sx={{ justifyContent: "flex-start" }}
                    >
                      {l.label}
                    </Button>
                  ))}

                {!profile.linkedIn && !profile.github && !profile.portfolio && !profile.resumeUrl && (
                  <Typography variant="caption" color="text.secondary">No links added yet.</Typography>
                )}
              </Stack>
            </Card>
          )}
        </Grid>

        {/* Main content */}
        <Grid item xs={12} md={9}>

          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)}>
              <Tab label="Edit profile" icon={<EditIcon sx={{ fontSize: 16 }} />} iconPosition="start" />
              <Tab
                label={`Applications${applications.length ? ` (${applications.length})` : ""}`}
                icon={<WorkIcon sx={{ fontSize: 16 }} />}
                iconPosition="start"
              />
              <Tab
                label={`Recommended${recommended.length ? ` (${recommended.length})` : ""}`}
                icon={<StarIcon sx={{ fontSize: 16 }} />}
                iconPosition="start"
              />
            </Tabs>
          </Box>

          {tab === 0 && (
            profileLoading ? <CircularProgress /> : profile ? (
              <ProfileTab profile={profile} saving={saving} onSave={handleSaveProfile} />
            ) : (
              <Alert severity="error">Failed to load profile.</Alert>
            )
          )}
          {tab === 1 && (
            <ApplicationsTab applications={applications} loading={appsLoading} onWithdraw={handleWithdraw} />
          )}
          {tab === 2 && (
            <RecommendedTab jobs={recommended} loading={jobsLoading} />
          )}
        </Grid>
      </Grid>
      {/* Toast notifications */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
        onClose={closeToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={closeToast}
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}