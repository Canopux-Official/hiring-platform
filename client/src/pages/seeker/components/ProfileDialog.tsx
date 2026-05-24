// src/components/seeker/ProfileDialogs.tsx
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { IExperience, IEducation } from "../types";

const emptyExp = (): IExperience => ({
  title: "",
  company: "",
  location: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  description: "",
});

export function ExperienceDialog({
  open,
  initial,
  onSave,
  onClose,
}: {
  open: boolean;
  initial: IExperience | null;
  onSave: (exp: IExperience) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<IExperience>(initial ?? emptyExp());
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setForm(initial ?? emptyExp());
    setErrors({});
  }, [initial]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.title.trim()) newErrors.title = "Job title is required";
    if (!form.company.trim()) newErrors.company = "Company name is required";
    if (!form.startDate) newErrors.startDate = "Start date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onSave(form);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initial ? "Edit Experience" : "Add Experience"}
        <IconButton onClick={onClose} sx={{ position: "absolute", right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField
            label="Job Title"
            fullWidth
            required
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            error={!!errors.title}
            helperText={errors.title}
          />
          <TextField
            label="Company"
            fullWidth
            required
            value={form.company}
            onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
            error={!!errors.company}
            helperText={errors.company}
          />
          <TextField
            label="Location"
            fullWidth
            value={form.location || ""}
            onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
          />

          <Stack direction="row" spacing={2}>
            <TextField
              label="Start Date"
              type="month"
              fullWidth
              required
              value={form.startDate?.slice(0, 7) || ""}
              onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
              error={!!errors.startDate}
              helperText={errors.startDate}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Date"
              type="month"
              fullWidth
              value={form.endDate?.slice(0, 7) || ""}
              onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
              disabled={form.isCurrent}
              InputLabelProps={{ shrink: true }}
            />
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            <input
              type="checkbox"
              checked={form.isCurrent}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  isCurrent: e.target.checked,
                  endDate: e.target.checked ? "" : f.endDate,
                }))
              }
            />
            <Typography variant="body2">I currently work here</Typography>
          </Stack>

          <TextField
            label="Description"
            multiline
            rows={3}
            fullWidth
            value={form.description || ""}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Education Dialog with validation
const emptyEdu = (): IEducation => ({
  degree: "",
  institution: "",
  fieldOfStudy: "",
  startYear: new Date().getFullYear(),
  endYear: undefined,
  grade: "",
});

export function EducationDialog({
  open,
  initial,
  onSave,
  onClose,
}: {
  open: boolean;
  initial: IEducation | null;
  onSave: (edu: IEducation) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<IEducation>(initial ?? emptyEdu());
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setForm(initial ?? emptyEdu());
    setErrors({});
  }, [initial]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.degree.trim()) newErrors.degree = "Degree is required";
    if (!form.institution.trim()) newErrors.institution = "Institution is required";
    if (!form.fieldOfStudy.trim()) newErrors.fieldOfStudy = "Field of study is required";
    if (form.startYear < 1950 || form.startYear > new Date().getFullYear() + 5) {
      newErrors.startYear = "Invalid start year";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) onSave(form);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initial ? "Edit Education" : "Add Education"}
        <IconButton onClick={onClose} sx={{ position: "absolute", right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField
            label="Degree"
            fullWidth
            required
            value={form.degree}
            onChange={(e) => setForm((f) => ({ ...f, degree: e.target.value }))}
            error={!!errors.degree}
            helperText={errors.degree}
          />
          <TextField
            label="Institution"
            fullWidth
            required
            value={form.institution}
            onChange={(e) => setForm((f) => ({ ...f, institution: e.target.value }))}
            error={!!errors.institution}
            helperText={errors.institution}
          />
          <TextField
            label="Field of Study"
            fullWidth
            required
            value={form.fieldOfStudy}
            onChange={(e) => setForm((f) => ({ ...f, fieldOfStudy: e.target.value }))}
            error={!!errors.fieldOfStudy}
            helperText={errors.fieldOfStudy}
          />

          <Stack direction="row" spacing={2}>
            <TextField
              label="Start Year"
              type="number"
              fullWidth
              value={form.startYear}
              onChange={(e) => setForm((f) => ({ ...f, startYear: +e.target.value }))}
              error={!!errors.startYear}
              helperText={errors.startYear}
            />
            <TextField
              label="End Year"
              type="number"
              fullWidth
              value={form.endYear ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, endYear: e.target.value ? +e.target.value : undefined }))}
            />
          </Stack>

          <TextField
            label="Grade / CGPA (Optional)"
            fullWidth
            value={form.grade ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, grade: e.target.value }))}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}