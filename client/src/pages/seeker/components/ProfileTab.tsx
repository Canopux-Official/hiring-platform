 

// // src/components/seeker/ProfileTab.tsx
// import { useState, useEffect } from "react";
// import {
//   Box, Card, Typography, Stack, TextField, Button, IconButton,
// } from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
// import AddIcon from "@mui/icons-material/Add";
// import DeleteIcon from "@mui/icons-material/Delete";
// import SaveIcon from "@mui/icons-material/Save";
// import { IJobSeekerProfile, IExperience, IEducation } from "../types";
// import { LocationEditor, SkillEditor } from "./ProfileEditor";
// import { EducationDialog, ExperienceDialog } from "./ProfileDialog";


// interface ProfileTabProps {
//   profile: IJobSeekerProfile;
//   saving: boolean;
//   onSave: (patch: Partial<IJobSeekerProfile>) => void;
// }

// // ─── Validators ───────────────────────────────────────────────────────────────

// function validateProfile(form: Partial<IJobSeekerProfile>): Record<string, string> {
//   const e: Record<string, string> = {};

//   if (!form.headline?.trim())
//     e.headline = "Headline is required.";
//   else if (form.headline.trim().length < 5)
//     e.headline = "Headline must be at least 5 characters.";
//   else if (form.headline.trim().length > 150)
//     e.headline = "Headline cannot exceed 150 characters.";

//   if (form.resumeUrl && form.resumeUrl.trim()) {
//     try { new URL(form.resumeUrl.trim()); }
//     catch { e.resumeUrl = "Please enter a valid URL (e.g. https://…)."; }
//   }

//   if (!form.bio?.trim())
//     e.bio = "Bio is required.";
//   else if (form.bio.trim().length < 20)
//     e.bio = "Bio must be at least 20 characters.";
//   else if (form.bio.trim().length > 2000)
//     e.bio = "Bio cannot exceed 2000 characters.";

//   if (form.currentSalary !== undefined && form.currentSalary !== null) {
//     if (form.currentSalary < 0)
//       e.currentSalary = "Salary cannot be negative.";
//     else if (form.currentSalary > 100_000_000)
//       e.currentSalary = "Please enter a realistic salary value.";
//   }

//   if (form.expectedSalary !== undefined && form.expectedSalary !== null) {
//     if (form.expectedSalary < 0)
//       e.expectedSalary = "Salary cannot be negative.";
//     else if (form.expectedSalary > 100_000_000)
//       e.expectedSalary = "Please enter a realistic salary value.";
//   }

//   if (form.noticePeriod !== undefined && form.noticePeriod !== null) {
//     if (form.noticePeriod < 0)
//       e.noticePeriod = "Notice period cannot be negative.";
//     else if (form.noticePeriod > 365)
//       e.noticePeriod = "Notice period cannot exceed 365 days.";
//   }

//   if (form.linkedIn && form.linkedIn.trim()) {
//     if (!form.linkedIn.trim().includes("linkedin.com"))
//       e.linkedIn = "Please enter a valid LinkedIn URL.";
//   }

//   if (form.github && form.github.trim()) {
//     try { new URL(form.github.trim()); }
//     catch { e.github = "Please enter a valid GitHub URL (e.g. https://github.com/…)."; }
//   }

//   if (form.portfolio && form.portfolio.trim()) {
//     try { new URL(form.portfolio.trim()); }
//     catch { e.portfolio = "Please enter a valid URL (e.g. https://…)."; }
//   }

//   return e;
// }

// // ─── Component ────────────────────────────────────────────────────────────────

// export default function ProfileTab({ profile, saving, onSave }: ProfileTabProps) {
//   const [form, setForm] = useState<Partial<IJobSeekerProfile>>(profile);
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [expDialog, setExpDialog] = useState<{ open: boolean; idx: number | null }>({ open: false, idx: null });
//   const [eduDialog, setEduDialog] = useState<{ open: boolean; idx: number | null }>({ open: false, idx: null });

//   useEffect(() => { setForm(profile); }, [profile]);

//   const updateField = (key: keyof IJobSeekerProfile, value: unknown) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//     // clear error on change
//     setErrors((prev) => { const next = { ...prev }; delete next[key]; return next; });
//   };

//   const saveExperience = (exp: IExperience) => {
//     const experiences = [...(form.experience || [])];
//     if (expDialog.idx !== null) experiences[expDialog.idx] = exp;
//     else experiences.push(exp);
//     updateField("experience", experiences);
//     setExpDialog({ open: false, idx: null });
//   };

//   const saveEducation = (edu: IEducation) => {
//     const educations = [...(form.education || [])];
//     if (eduDialog.idx !== null) educations[eduDialog.idx] = edu;
//     else educations.push(edu);
//     updateField("education", educations);
//     setEduDialog({ open: false, idx: null });
//   };

//   const deleteExperience = (index: number) =>
//     updateField("experience", (form.experience || []).filter((_, i) => i !== index));

//   const deleteEducation = (index: number) =>
//     updateField("education", (form.education || []).filter((_, i) => i !== index));

//   const handleSave = () => {
//     const validationErrors = validateProfile(form);
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       // scroll to first error
//       const firstKey = Object.keys(validationErrors)[0];
//       document.getElementById(`field-${firstKey}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
//       return;
//     }
//     onSave(form);
//   };

//   return (
//     <Box>

//       {/* ── Basic Information ─────────────────────────────────────── */}
//       <Card sx={{ p: 3, mb: 3 }}>
//         <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Basic Information</Typography>
//         <Stack spacing={2.5}>
//           <TextField
//             id="field-headline"
//             label="Headline"
//             fullWidth
//             required
//             placeholder="e.g. Senior Full Stack Developer"
//             value={form.headline || ""}
//             onChange={(e) => updateField("headline", e.target.value)}
//             error={!!errors.headline}
//             helperText={errors.headline || `${(form.headline || "").length}/150`}
//           />
//           <TextField
//             id="field-resumeUrl"
//             label="Resume URL"
//             fullWidth
//             placeholder="https://drive.google.com/…"
//             value={form.resumeUrl || ""}
//             onChange={(e) => updateField("resumeUrl", e.target.value)}
//             error={!!errors.resumeUrl}
//             helperText={errors.resumeUrl || "Optional — link to your resume"}
//           />
//           <TextField
//             id="field-bio"
//             label="Bio / Professional Summary"
//             fullWidth
//             required
//             multiline
//             rows={4}
//             placeholder="Tell us about yourself…"
//             value={form.bio || ""}
//             onChange={(e) => updateField("bio", e.target.value)}
//             error={!!errors.bio}
//             helperText={errors.bio || `${(form.bio || "").length}/2000`}
//           />
//         </Stack>
//       </Card>

//       {/* ── Compensation & Availability ───────────────────────────── */}
//       <Card sx={{ p: 3, mb: 3 }}>
//         <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Compensation & Availability</Typography>
//         <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//           <TextField
//             id="field-currentSalary"
//             label="Current Salary (₹ per year)"
//             type="number"
//             fullWidth
//             value={form.currentSalary ?? ""}
//             onChange={(e) => updateField("currentSalary", e.target.value ? Number(e.target.value) : undefined)}
//             error={!!errors.currentSalary}
//             helperText={errors.currentSalary || "Optional"}
//             inputProps={{ min: 0 }}
//           />
//           <TextField
//             id="field-expectedSalary"
//             label="Expected Salary (₹ per year)"
//             type="number"
//             fullWidth
//             value={form.expectedSalary ?? ""}
//             onChange={(e) => updateField("expectedSalary", e.target.value ? Number(e.target.value) : undefined)}
//             error={!!errors.expectedSalary}
//             helperText={errors.expectedSalary || "Optional"}
//             inputProps={{ min: 0 }}
//           />
//           <TextField
//             id="field-noticePeriod"
//             label="Notice Period (days)"
//             type="number"
//             fullWidth
//             value={form.noticePeriod ?? ""}
//             onChange={(e) => updateField("noticePeriod", e.target.value ? Number(e.target.value) : undefined)}
//             error={!!errors.noticePeriod}
//             helperText={errors.noticePeriod || "Optional"}
//             inputProps={{ min: 0, max: 365 }}
//           />
//         </Stack>
//       </Card>

//       {/* ── Skills ───────────────────────────────────────────────── */}
//       <Card sx={{ p: 3, mb: 3 }} id="field-skills">
//         <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Skills</Typography>
//         <SkillEditor
//           skills={form.skills || []}
//           onChange={(skills) => updateField("skills", skills)}
//         />
//       </Card>

//       {/* ── Preferred Locations ──────────────────────────────────── */}
//       <Card sx={{ p: 3, mb: 3 }}>
//         <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Preferred Locations</Typography>
//         <LocationEditor
//           locations={form.preferredLocations || []}
//           onChange={(locs) => updateField("preferredLocations", locs)}
//         />
//       </Card>

//       {/* ── Experience ───────────────────────────────────────────── */}
//       <Card sx={{ p: 3, mb: 3 }}>
//         <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
//           <Typography variant="h6" sx={{ fontWeight: 700 }}>Experience</Typography>
//           <Button startIcon={<AddIcon />} onClick={() => setExpDialog({ open: true, idx: null })}>
//             Add Experience
//           </Button>
//         </Stack>
//         <Stack spacing={2}>
//           {(form.experience || []).map((exp, idx) => (
//             <Box key={idx} sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
//               <Stack direction="row" justifyContent="space-between">
//                 <Box>
//                   <Typography fontWeight={600}>{exp.title}</Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     {exp.company}{exp.location && ` · ${exp.location}`}
//                   </Typography>
//                   <Typography variant="caption" color="text.secondary">
//                     {exp.startDate} — {exp.isCurrent ? "Present" : exp.endDate}
//                   </Typography>
//                 </Box>
//                 <Stack direction="row" spacing={1}>
//                   <IconButton onClick={() => setExpDialog({ open: true, idx })}><EditIcon /></IconButton>
//                   <IconButton color="error" onClick={() => deleteExperience(idx)}><DeleteIcon /></IconButton>
//                 </Stack>
//               </Stack>
//             </Box>
//           ))}
//           {(form.experience || []).length === 0 && (
//             <Typography color="text.secondary" variant="body2">No experience added yet.</Typography>
//           )}
//         </Stack>
//       </Card>

//       {/* ── Education ────────────────────────────────────────────── */}
//       <Card sx={{ p: 3, mb: 3 }}>
//         <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
//           <Typography variant="h6" sx={{ fontWeight: 700 }}>Education</Typography>
//           <Button startIcon={<AddIcon />} onClick={() => setEduDialog({ open: true, idx: null })}>
//             Add Education
//           </Button>
//         </Stack>
//         <Stack spacing={2}>
//           {(form.education || []).map((edu, idx) => (
//             <Box key={idx} sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
//               <Stack direction="row" justifyContent="space-between">
//                 <Box>
//                   <Typography fontWeight={600}>{edu.degree} in {edu.fieldOfStudy}</Typography>
//                   <Typography variant="body2" color="text.secondary">{edu.institution}</Typography>
//                   <Typography variant="caption" color="text.secondary">
//                     {edu.startYear} — {edu.endYear || "Present"}
//                   </Typography>
//                 </Box>
//                 <Stack direction="row" spacing={1}>
//                   <IconButton onClick={() => setEduDialog({ open: true, idx })}><EditIcon /></IconButton>
//                   <IconButton color="error" onClick={() => deleteEducation(idx)}><DeleteIcon /></IconButton>
//                 </Stack>
//               </Stack>
//             </Box>
//           ))}
//           {(form.education || []).length === 0 && (
//             <Typography color="text.secondary" variant="body2">No education added yet.</Typography>
//           )}
//         </Stack>
//       </Card>

//       {/* ── Links ────────────────────────────────────────────────── */}
//       <Card sx={{ p: 3, mb: 4 }}>
//         <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Links</Typography>
//         <Stack spacing={2}>
//           <TextField
//             id="field-linkedIn"
//             label="LinkedIn URL"
//             fullWidth
//             placeholder="https://linkedin.com/in/your-profile"
//             value={form.linkedIn || ""}
//             onChange={(e) => updateField("linkedIn", e.target.value)}
//             error={!!errors.linkedIn}
//             helperText={errors.linkedIn || "Optional"}
//           />
//           <TextField
//             id="field-github"
//             label="GitHub URL"
//             fullWidth
//             placeholder="https://github.com/your-username"
//             value={form.github || ""}
//             onChange={(e) => updateField("github", e.target.value)}
//             error={!!errors.github}
//             helperText={errors.github || "Optional"}
//           />
//           <TextField
//             id="field-portfolio"
//             label="Portfolio / Website"
//             fullWidth
//             placeholder="https://yourwebsite.com"
//             value={form.portfolio || ""}
//             onChange={(e) => updateField("portfolio", e.target.value)}
//             error={!!errors.portfolio}
//             helperText={errors.portfolio || "Optional"}
//           />
//         </Stack>
//       </Card>

//       <Button
//         variant="contained"
//         size="large"
//         fullWidth
//         startIcon={saving ? null : <SaveIcon />}
//         disabled={saving}
//         onClick={handleSave}
//       >
//         {saving ? "Saving Profile…" : "Save Profile"}
//       </Button>

//       {/* ── Dialogs ──────────────────────────────────────────────── */} 
//       <ExperienceDialog
//         open={expDialog.open}
//         initial={expDialog.idx !== null ? (form.experience || [])[expDialog.idx] : null}
//         onSave={saveExperience}
//         onClose={() => setExpDialog({ open: false, idx: null })}
//       />
//       <EducationDialog
//         open={eduDialog.open}
//         initial={eduDialog.idx !== null ? (form.education || [])[eduDialog.idx] : null}
//         onSave={saveEducation}
//         onClose={() => setEduDialog({ open: false, idx: null })}
//       />
//     </Box>
//   );
// }

// src/components/seeker/ProfileTab.tsx
import { useState, useEffect } from "react";
import {
  Box, Card, Typography, Stack, TextField, Button, IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import { alpha } from "@mui/material/styles";

import { IJobSeekerProfile, IExperience, IEducation } from "../types";
import { LocationEditor, SkillEditor } from "./ProfileEditor";
import { EducationDialog, ExperienceDialog } from "./ProfileDialog";

// ── Design Tokens (Consistent with Hero & other components) ─────────────
const GREEN = "#059669";
const GREEN_DARK = "#047857";
const GREEN_LIGHT = "#d1fae5";

interface ProfileTabProps {
  profile: IJobSeekerProfile;
  saving: boolean;
  onSave: (patch: Partial<IJobSeekerProfile>) => void;
}

// ─── Validators ───────────────────────────────────────────────────────────────

function validateProfile(form: Partial<IJobSeekerProfile>): Record<string, string> {
  const e: Record<string, string> = {};

  if (!form.headline?.trim())
    e.headline = "Headline is required.";
  else if (form.headline.trim().length < 5)
    e.headline = "Headline must be at least 5 characters.";
  else if (form.headline.trim().length > 150)
    e.headline = "Headline cannot exceed 150 characters.";

  if (form.resumeUrl && form.resumeUrl.trim()) {
    try { new URL(form.resumeUrl.trim()); }
    catch { e.resumeUrl = "Please enter a valid URL (e.g. https://…)."; }
  }

  if (!form.bio?.trim())
    e.bio = "Bio is required.";
  else if (form.bio.trim().length < 20)
    e.bio = "Bio must be at least 20 characters.";
  else if (form.bio.trim().length > 2000)
    e.bio = "Bio cannot exceed 2000 characters.";

  if (form.currentSalary !== undefined && form.currentSalary !== null) {
    if (form.currentSalary < 0)
      e.currentSalary = "Salary cannot be negative.";
    else if (form.currentSalary > 100_000_000)
      e.currentSalary = "Please enter a realistic salary value.";
  }

  if (form.expectedSalary !== undefined && form.expectedSalary !== null) {
    if (form.expectedSalary < 0)
      e.expectedSalary = "Salary cannot be negative.";
    else if (form.expectedSalary > 100_000_000)
      e.expectedSalary = "Please enter a realistic salary value.";
  }

  if (form.noticePeriod !== undefined && form.noticePeriod !== null) {
    if (form.noticePeriod < 0)
      e.noticePeriod = "Notice period cannot be negative.";
    else if (form.noticePeriod > 365)
      e.noticePeriod = "Notice period cannot exceed 365 days.";
  }

  if (form.linkedIn && form.linkedIn.trim()) {
    if (!form.linkedIn.trim().includes("linkedin.com"))
      e.linkedIn = "Please enter a valid LinkedIn URL.";
  }

  if (form.github && form.github.trim()) {
    try { new URL(form.github.trim()); }
    catch { e.github = "Please enter a valid GitHub URL (e.g. https://github.com/…)."; }
  }

  if (form.portfolio && form.portfolio.trim()) {
    try { new URL(form.portfolio.trim()); }
    catch { e.portfolio = "Please enter a valid URL (e.g. https://…)."; }
  }

  return e;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProfileTab({ profile, saving, onSave }: ProfileTabProps) {
  const [form, setForm] = useState<Partial<IJobSeekerProfile>>(profile);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [expDialog, setExpDialog] = useState<{ open: boolean; idx: number | null }>({ open: false, idx: null });
  const [eduDialog, setEduDialog] = useState<{ open: boolean; idx: number | null }>({ open: false, idx: null });

  useEffect(() => { setForm(profile); }, [profile]);

  const updateField = (key: keyof IJobSeekerProfile, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => { const next = { ...prev }; delete next[key]; return next; });
  };

  const saveExperience = (exp: IExperience) => {
    const experiences = [...(form.experience || [])];
    if (expDialog.idx !== null) experiences[expDialog.idx] = exp;
    else experiences.push(exp);
    updateField("experience", experiences);
    setExpDialog({ open: false, idx: null });
  };

  const saveEducation = (edu: IEducation) => {
    const educations = [...(form.education || [])];
    if (eduDialog.idx !== null) educations[eduDialog.idx] = edu;
    else educations.push(edu);
    updateField("education", educations);
    setEduDialog({ open: false, idx: null });
  };

  const deleteExperience = (index: number) =>
    updateField("experience", (form.experience || []).filter((_, i) => i !== index));

  const deleteEducation = (index: number) =>
    updateField("education", (form.education || []).filter((_, i) => i !== index));

  const handleSave = () => {
    const validationErrors = validateProfile(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstKey = Object.keys(validationErrors)[0];
      document.getElementById(`field-${firstKey}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    onSave(form);
  };

  return (
    <Box>
      {/* Basic Information */}
      <Card sx={{ p: 4, mb: 3, borderRadius: 3.5 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: "#0f172a" }}>
          Basic Information
        </Typography>
        <Stack spacing={3}>
          <TextField
            id="field-headline"
            label="Professional Headline"
            fullWidth
            required
            placeholder="e.g. Senior Full Stack Developer | Ex-Google"
            value={form.headline || ""}
            onChange={(e) => updateField("headline", e.target.value)}
            error={!!errors.headline}
            helperText={errors.headline || `${(form.headline || "").length}/150`}
          />
          <TextField
            id="field-resumeUrl"
            label="Resume / CV URL"
            fullWidth
            placeholder="https://drive.google.com/..."
            value={form.resumeUrl || ""}
            onChange={(e) => updateField("resumeUrl", e.target.value)}
            error={!!errors.resumeUrl}
            helperText={errors.resumeUrl || "Optional — link to your resume"}
          />
          <TextField
            id="field-bio"
            label="Professional Bio"
            fullWidth
            required
            multiline
            rows={5}
            placeholder="Tell recruiters about your journey, strengths, and what you're passionate about..."
            value={form.bio || ""}
            onChange={(e) => updateField("bio", e.target.value)}
            error={!!errors.bio}
            helperText={errors.bio || `${(form.bio || "").length}/2000`}
          />
        </Stack>
      </Card>

      {/* Compensation & Availability */}
      <Card sx={{ p: 4, mb: 3, borderRadius: 3.5 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: "#0f172a" }}>
          Compensation & Availability
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
          <TextField
            id="field-currentSalary"
            label="Current Salary (₹ per year)"
            type="number"
            fullWidth
            value={form.currentSalary ?? ""}
            onChange={(e) => updateField("currentSalary", e.target.value ? Number(e.target.value) : undefined)}
            error={!!errors.currentSalary}
            helperText={errors.currentSalary || "Optional"}
            inputProps={{ min: 0 }}
          />
          <TextField
            id="field-expectedSalary"
            label="Expected Salary (₹ per year)"
            type="number"
            fullWidth
            value={form.expectedSalary ?? ""}
            onChange={(e) => updateField("expectedSalary", e.target.value ? Number(e.target.value) : undefined)}
            error={!!errors.expectedSalary}
            helperText={errors.expectedSalary || "Optional"}
            inputProps={{ min: 0 }}
          />
          <TextField
            id="field-noticePeriod"
            label="Notice Period (days)"
            type="number"
            fullWidth
            value={form.noticePeriod ?? ""}
            onChange={(e) => updateField("noticePeriod", e.target.value ? Number(e.target.value) : undefined)}
            error={!!errors.noticePeriod}
            helperText={errors.noticePeriod || "Optional"}
            inputProps={{ min: 0, max: 365 }}
          />
        </Stack>
      </Card>

      {/* Skills */}
      <Card sx={{ p: 4, mb: 3, borderRadius: 3.5 }} id="field-skills">
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: "#0f172a" }}>
          Skills
        </Typography>
        <SkillEditor
          skills={form.skills || []}
          onChange={(skills) => updateField("skills", skills)}
        />
      </Card>

      {/* Preferred Locations */}
      <Card sx={{ p: 4, mb: 3, borderRadius: 3.5 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: "#0f172a" }}>
          Preferred Locations
        </Typography>
        <LocationEditor
          locations={form.preferredLocations || []}
          onChange={(locs) => updateField("preferredLocations", locs)}
        />
      </Card>

      {/* Experience */}
      <Card sx={{ p: 4, mb: 3, borderRadius: 3.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a" }}>
            Experience
          </Typography>
          <Button 
            startIcon={<AddIcon />} 
            variant="outlined"
            onClick={() => setExpDialog({ open: true, idx: null })}
            sx={{ borderColor: GREEN, color: GREEN }}
          >
            Add Experience
          </Button>
        </Stack>

        <Stack spacing={2.5}>
          {(form.experience || []).map((exp, idx) => (
            <Box 
              key={idx} 
              sx={{ 
                p: 3, 
                border: "1px solid #e2e8f0", 
                borderRadius: 3,
                "&:hover": { borderColor: alpha(GREEN, 0.4) }
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography fontWeight={700}>{exp.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {exp.company}{exp.location && ` • ${exp.location}`}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {exp.startDate} — {exp.isCurrent ? "Present" : exp.endDate}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={0.5}>
                  <IconButton onClick={() => setExpDialog({ open: true, idx })}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => deleteExperience(idx)}><DeleteIcon /></IconButton>
                </Stack>
              </Stack>
            </Box>
          ))}
          {(form.experience || []).length === 0 && (
            <Typography color="text.secondary" variant="body2">
              No experience added yet.
            </Typography>
          )}
        </Stack>
      </Card>

      {/* Education */}
      <Card sx={{ p: 4, mb: 4, borderRadius: 3.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a" }}>
            Education
          </Typography>
          <Button 
            startIcon={<AddIcon />} 
            variant="outlined"
            onClick={() => setEduDialog({ open: true, idx: null })}
            sx={{ borderColor: GREEN, color: GREEN }}
          >
            Add Education
          </Button>
        </Stack>

        <Stack spacing={2.5}>
          {(form.education || []).map((edu, idx) => (
            <Box 
              key={idx} 
              sx={{ 
                p: 3, 
                border: "1px solid #e2e8f0", 
                borderRadius: 3,
                "&:hover": { borderColor: alpha(GREEN, 0.4) }
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography fontWeight={700}>{edu.degree} in {edu.fieldOfStudy}</Typography>
                  <Typography variant="body2" color="text.secondary">{edu.institution}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {edu.startYear} — {edu.endYear || "Present"}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={0.5}>
                  <IconButton onClick={() => setEduDialog({ open: true, idx })}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => deleteEducation(idx)}><DeleteIcon /></IconButton>
                </Stack>
              </Stack>
            </Box>
          ))}
          {(form.education || []).length === 0 && (
            <Typography color="text.secondary" variant="body2">
              No education added yet.
            </Typography>
          )}
        </Stack>
      </Card>

      {/* Links */}
      <Card sx={{ p: 4, mb: 4, borderRadius: 3.5 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: "#0f172a" }}>
          Links
        </Typography>
        <Stack spacing={3}>
          <TextField
            id="field-linkedIn"
            label="LinkedIn URL"
            fullWidth
            placeholder="https://linkedin.com/in/your-profile"
            value={form.linkedIn || ""}
            onChange={(e) => updateField("linkedIn", e.target.value)}
            error={!!errors.linkedIn}
            helperText={errors.linkedIn || "Optional"}
          />
          <TextField
            id="field-github"
            label="GitHub URL"
            fullWidth
            placeholder="https://github.com/your-username"
            value={form.github || ""}
            onChange={(e) => updateField("github", e.target.value)}
            error={!!errors.github}
            helperText={errors.github || "Optional"}
          />
          <TextField
            id="field-portfolio"
            label="Portfolio / Personal Website"
            fullWidth
            placeholder="https://yourportfolio.com"
            value={form.portfolio || ""}
            onChange={(e) => updateField("portfolio", e.target.value)}
            error={!!errors.portfolio}
            helperText={errors.portfolio || "Optional"}
          />
        </Stack>
      </Card>

      <Button
        variant="contained"
        size="large"
        fullWidth
        startIcon={saving ? null : <SaveIcon />}
        disabled={saving}
        onClick={handleSave}
        sx={{
          py: 1.8,
          fontSize: 16,
          fontWeight: 700,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${GREEN} 0%, ${GREEN_DARK} 100%)`,
          boxShadow: `0 6px 20px ${alpha(GREEN, 0.35)}`,
          "&:hover": {
            background: `linear-gradient(135deg, ${GREEN_DARK}, #065f46)`,
          },
        }}
      >
        {saving ? "Saving Profile..." : "Save Profile Changes"}
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