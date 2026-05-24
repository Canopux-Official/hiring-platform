// src/components/seeker/ProfileTab.tsx
import { useState, useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  Stack,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import { IJobSeekerProfile, IExperience, IEducation } from "../types";
import { EducationDialog, ExperienceDialog } from "./ProfileDialog";
import { LocationEditor, SkillEditor } from "./ProfileEditor";

interface ProfileTabProps {
  profile: IJobSeekerProfile;
  saving: boolean;
  onSave: (patch: Partial<IJobSeekerProfile>) => void;
}

export default function ProfileTab({ profile, saving, onSave }: ProfileTabProps) {
  const [form, setForm] = useState<Partial<IJobSeekerProfile>>(profile);
  const [expDialog, setExpDialog] = useState<{ open: boolean; idx: number | null }>({ open: false, idx: null });
  const [eduDialog, setEduDialog] = useState<{ open: boolean; idx: number | null }>({ open: false, idx: null });

  useEffect(() => {
    setForm(profile);
  }, [profile]);

  const updateField = (key: keyof IJobSeekerProfile, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const saveExperience = (exp: IExperience) => {
    const experiences = [...(form.experience || [])];
    if (expDialog.idx !== null) {
      experiences[expDialog.idx] = exp;
    } else {
      experiences.push(exp);
    }
    updateField("experience", experiences);
    setExpDialog({ open: false, idx: null });
  };

  const saveEducation = (edu: IEducation) => {
    const educations = [...(form.education || [])];
    if (eduDialog.idx !== null) {
      educations[eduDialog.idx] = edu;
    } else {
      educations.push(edu);
    }
    updateField("education", educations);
    setEduDialog({ open: false, idx: null });
  };

  const deleteExperience = (index: number) => {
    const experiences = (form.experience || []).filter((_, i) => i !== index);
    updateField("experience", experiences);
  };

  const deleteEducation = (index: number) => {
    const educations = (form.education || []).filter((_, i) => i !== index);
    updateField("education", educations);
  };

  return (
    <Box>
      {/* Basic Information */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Basic Information</Typography>
        <Stack spacing={2.5}>
          <TextField
            label="Headline"
            fullWidth
            placeholder="e.g. Senior Full Stack Developer"
            value={form.headline || ""}
            onChange={(e) => updateField("headline", e.target.value)}
          />
          <TextField
            label="Resume URL"
            fullWidth
            placeholder="https://drive.google.com/..."
            value={form.resumeUrl || ""}
            onChange={(e) => updateField("resumeUrl", e.target.value)}
          />
          <TextField
            label="Bio / Professional Summary"
            fullWidth
            multiline
            rows={4}
            placeholder="Tell us about yourself..."
            value={form.bio || ""}
            onChange={(e) => updateField("bio", e.target.value)}
          />
        </Stack>
      </Card>

      {/* Compensation & Availability */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Compensation & Availability</Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Current Salary (₹ per year)"
            type="number"
            fullWidth
            value={form.currentSalary || ""}
            onChange={(e) => updateField("currentSalary", e.target.value ? Number(e.target.value) : undefined)}
          />
          <TextField
            label="Expected Salary (₹ per year)"
            type="number"
            fullWidth
            value={form.expectedSalary || ""}
            onChange={(e) => updateField("expectedSalary", e.target.value ? Number(e.target.value) : undefined)}
          />
          <TextField
            label="Notice Period (days)"
            type="number"
            fullWidth
            value={form.noticePeriod || ""}
            onChange={(e) => updateField("noticePeriod", e.target.value ? Number(e.target.value) : undefined)}
          />
        </Stack>
      </Card>

      {/* Skills */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Skills</Typography>
        <SkillEditor skills={form.skills || []} onChange={(skills) => updateField("skills", skills)} />
      </Card>

      {/* Preferred Locations */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Preferred Locations</Typography>
        <LocationEditor locations={form.preferredLocations || []} onChange={(locs) => updateField("preferredLocations", locs)} />
      </Card>

      {/* Experience */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Experience</Typography>
          <Button startIcon={<AddIcon />} onClick={() => setExpDialog({ open: true, idx: null })}>
            Add Experience
          </Button>
        </Stack>

        <Stack spacing={2}>
          {(form.experience || []).map((exp, idx) => (
            <Box key={idx} sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 2 }}>
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography fontWeight={600}>{exp.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {exp.company} {exp.location && `· ${exp.location}`}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {exp.startDate} — {exp.isCurrent ? "Present" : exp.endDate}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <IconButton onClick={() => setExpDialog({ open: true, idx })}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => deleteExperience(idx)}>
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </Stack>
            </Box>
          ))}
          {(form.experience || []).length === 0 && (
            <Typography color="text.secondary">No experience added yet.</Typography>
          )}
        </Stack>
      </Card>

      {/* Education */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Education</Typography>
          <Button startIcon={<AddIcon />} onClick={() => setEduDialog({ open: true, idx: null })}>
            Add Education
          </Button>
        </Stack>

        <Stack spacing={2}>
          {(form.education || []).map((edu, idx) => (
            <Box key={idx} sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 2 }}>
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography fontWeight={600}>{edu.degree} in {edu.fieldOfStudy}</Typography>
                  <Typography variant="body2" color="text.secondary">{edu.institution}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {edu.startYear} — {edu.endYear || "Present"}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <IconButton onClick={() => setEduDialog({ open: true, idx })}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => deleteEducation(idx)}>
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </Stack>
            </Box>
          ))}
          {(form.education || []).length === 0 && (
            <Typography color="text.secondary">No education added yet.</Typography>
          )}
        </Stack>
      </Card>

      {/* Links */}
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Links</Typography>
        <Stack spacing={2}>
          <TextField label="LinkedIn URL" fullWidth value={form.linkedIn || ""} onChange={(e) => updateField("linkedIn", e.target.value)} />
          <TextField label="GitHub URL" fullWidth value={form.github || ""} onChange={(e) => updateField("github", e.target.value)} />
          <TextField label="Portfolio / Website" fullWidth value={form.portfolio || ""} onChange={(e) => updateField("portfolio", e.target.value)} />
        </Stack>
      </Card>

      <Button
        variant="contained"
        size="large"
        fullWidth
        startIcon={saving ? null : <SaveIcon />}
        disabled={saving}
        onClick={() => onSave(form)}
      >
        {saving ? "Saving Profile..." : "Save Profile"}
      </Button>

      {/* Dialogs */}
      <ExperienceDialog
        open={expDialog.open}
        initial={expDialog.idx !== null ? (form.experience || [])[expDialog.idx] : null}
        onSave={saveExperience}
        onClose={() => setExpDialog({ open: false, idx: null })}
      />

      <EducationDialog
        open={eduDialog.open}
        initial={eduDialog.idx !== null ? (form.education || [])[eduDialog.idx] : null}
        onSave={saveEducation}
        onClose={() => setEduDialog({ open: false, idx: null })}
      />
    </Box>
  );
}