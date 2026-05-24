// // src/components/seeker/ProfileDialogs.tsx
// import { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Stack,
//   IconButton,
//   Typography,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import { IExperience, IEducation } from "../types";

// const emptyExp = (): IExperience => ({
//   title: "",
//   company: "",
//   location: "",
//   startDate: "",
//   endDate: "",
//   isCurrent: false,
//   description: "",
// });

// export function ExperienceDialog({
//   open,
//   initial,
//   onSave,
//   onClose,
// }: {
//   open: boolean;
//   initial: IExperience | null;
//   onSave: (exp: IExperience) => void;
//   onClose: () => void;
// }) {
//   const [form, setForm] = useState<IExperience>(initial ?? emptyExp());
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   useEffect(() => {
//     setForm(initial ?? emptyExp());
//     setErrors({});
//   }, [initial]);

//   const validate = (): boolean => {
//     const newErrors: Record<string, string> = {};
//     if (!form.title.trim()) newErrors.title = "Job title is required";
//     if (!form.company.trim()) newErrors.company = "Company name is required";
//     if (!form.startDate) newErrors.startDate = "Start date is required";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSave = () => {
//     if (validate()) {
//       onSave(form);
//     }
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
//       <DialogTitle>
//         {initial ? "Edit Experience" : "Add Experience"}
//         <IconButton onClick={onClose} sx={{ position: "absolute", right: 8, top: 8 }}>
//           <CloseIcon />
//         </IconButton>
//       </DialogTitle>
//       <DialogContent>
//         <Stack spacing={2} sx={{ pt: 1 }}>
//           <TextField
//             label="Job Title"
//             fullWidth
//             required
//             value={form.title}
//             onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
//             error={!!errors.title}
//             helperText={errors.title}
//           />
//           <TextField
//             label="Company"
//             fullWidth
//             required
//             value={form.company}
//             onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
//             error={!!errors.company}
//             helperText={errors.company}
//           />
//           <TextField
//             label="Location"
//             fullWidth
//             value={form.location || ""}
//             onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
//           />

//           <Stack direction="row" spacing={2}>
//             <TextField
//               label="Start Date"
//               type="month"
//               fullWidth
//               required
//               value={form.startDate?.slice(0, 7) || ""}
//               onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
//               error={!!errors.startDate}
//               helperText={errors.startDate}
//               InputLabelProps={{ shrink: true }}
//             />
//             <TextField
//               label="End Date"
//               type="month"
//               fullWidth
//               value={form.endDate?.slice(0, 7) || ""}
//               onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
//               disabled={form.isCurrent}
//               InputLabelProps={{ shrink: true }}
//             />
//           </Stack>

//           <Stack direction="row" alignItems="center" spacing={1}>
//             <input
//               type="checkbox"
//               checked={form.isCurrent}
//               onChange={(e) =>
//                 setForm((f) => ({
//                   ...f,
//                   isCurrent: e.target.checked,
//                   endDate: e.target.checked ? "" : f.endDate,
//                 }))
//               }
//             />
//             <Typography variant="body2">I currently work here</Typography>
//           </Stack>

//           <TextField
//             label="Description"
//             multiline
//             rows={3}
//             fullWidth
//             value={form.description || ""}
//             onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
//           />
//         </Stack>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Cancel</Button>
//         <Button variant="contained" onClick={handleSave}>
//           Save
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

// // Education Dialog with validation
// const emptyEdu = (): IEducation => ({
//   degree: "",
//   institution: "",
//   fieldOfStudy: "",
//   startYear: new Date().getFullYear(),
//   endYear: undefined,
//   grade: "",
// });

// export function EducationDialog({
//   open,
//   initial,
//   onSave,
//   onClose,
// }: {
//   open: boolean;
//   initial: IEducation | null;
//   onSave: (edu: IEducation) => void;
//   onClose: () => void;
// }) {
//   const [form, setForm] = useState<IEducation>(initial ?? emptyEdu());
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   useEffect(() => {
//     setForm(initial ?? emptyEdu());
//     setErrors({});
//   }, [initial]);

//   const validate = (): boolean => {
//     const newErrors: Record<string, string> = {};
//     if (!form.degree.trim()) newErrors.degree = "Degree is required";
//     if (!form.institution.trim()) newErrors.institution = "Institution is required";
//     if (!form.fieldOfStudy.trim()) newErrors.fieldOfStudy = "Field of study is required";
//     if (form.startYear < 1950 || form.startYear > new Date().getFullYear() + 5) {
//       newErrors.startYear = "Invalid start year";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSave = () => {
//     if (validate()) onSave(form);
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
//       <DialogTitle>
//         {initial ? "Edit Education" : "Add Education"}
//         <IconButton onClick={onClose} sx={{ position: "absolute", right: 8, top: 8 }}>
//           <CloseIcon />
//         </IconButton>
//       </DialogTitle>
//       <DialogContent>
//         <Stack spacing={2} sx={{ pt: 1 }}>
//           <TextField
//             label="Degree"
//             fullWidth
//             required
//             value={form.degree}
//             onChange={(e) => setForm((f) => ({ ...f, degree: e.target.value }))}
//             error={!!errors.degree}
//             helperText={errors.degree}
//           />
//           <TextField
//             label="Institution"
//             fullWidth
//             required
//             value={form.institution}
//             onChange={(e) => setForm((f) => ({ ...f, institution: e.target.value }))}
//             error={!!errors.institution}
//             helperText={errors.institution}
//           />
//           <TextField
//             label="Field of Study"
//             fullWidth
//             required
//             value={form.fieldOfStudy}
//             onChange={(e) => setForm((f) => ({ ...f, fieldOfStudy: e.target.value }))}
//             error={!!errors.fieldOfStudy}
//             helperText={errors.fieldOfStudy}
//           />

//           <Stack direction="row" spacing={2}>
//             <TextField
//               label="Start Year"
//               type="number"
//               fullWidth
//               value={form.startYear}
//               onChange={(e) => setForm((f) => ({ ...f, startYear: +e.target.value }))}
//               error={!!errors.startYear}
//               helperText={errors.startYear}
//             />
//             <TextField
//               label="End Year"
//               type="number"
//               fullWidth
//               value={form.endYear ?? ""}
//               onChange={(e) => setForm((f) => ({ ...f, endYear: e.target.value ? +e.target.value : undefined }))}
//             />
//           </Stack>

//           <TextField
//             label="Grade / CGPA (Optional)"
//             fullWidth
//             value={form.grade ?? ""}
//             onChange={(e) => setForm((f) => ({ ...f, grade: e.target.value }))}
//           />
//         </Stack>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Cancel</Button>
//         <Button variant="contained" onClick={handleSave}>
//           Save
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }



// src/components/seeker/ProfileDialogs.tsx
import { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Stack, IconButton, Typography, Checkbox, FormControlLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { IExperience, IEducation } from "../types";

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
  }, [initial, open]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};

    if (!form.title.trim())
      e.title = "Job title is required.";
    else if (form.title.trim().length < 2)
      e.title = "Job title must be at least 2 characters.";
    else if (form.title.trim().length > 100)
      e.title = "Job title cannot exceed 100 characters.";

    if (!form.company.trim())
      e.company = "Company name is required.";
    else if (form.company.trim().length < 2)
      e.company = "Company name must be at least 2 characters.";
    else if (form.company.trim().length > 100)
      e.company = "Company name cannot exceed 100 characters.";

    if (form.location && form.location.trim().length > 100)
      e.location = "Location cannot exceed 100 characters.";

    if (!form.startDate)
      e.startDate = "Start date is required.";

    if (!form.isCurrent) {
      if (!form.endDate)
        e.endDate = "End date is required unless currently working here.";
      else if (form.startDate && form.endDate && form.endDate < form.startDate)
        e.endDate = "End date cannot be before start date.";
    }

    if (form.description && form.description.trim().length > 1000)
      e.description = "Description cannot exceed 1000 characters.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const f = (key: keyof IExperience, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const clearError = (key: string) =>
    setErrors((prev) => { const next = { ...prev }; delete next[key]; return next; });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pr: 6 }}>
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
            onChange={(e) => { f("title", e.target.value); clearError("title"); }}
            error={!!errors.title}
            helperText={errors.title}
          />

          <TextField
            label="Company"
            fullWidth
            required
            value={form.company}
            onChange={(e) => { f("company", e.target.value); clearError("company"); }}
            error={!!errors.company}
            helperText={errors.company}
          />

          <TextField
            label="Location"
            fullWidth
            placeholder="e.g. Bangalore, Remote"
            value={form.location || ""}
            onChange={(e) => { f("location", e.target.value); clearError("location"); }}
            error={!!errors.location}
            helperText={errors.location || "Optional"}
          />

          <Stack direction="row" spacing={2}>
            <TextField
              label="Start Date"
              type="month"
              fullWidth
              required
              value={form.startDate?.slice(0, 7) || ""}
              onChange={(e) => { f("startDate", e.target.value); clearError("startDate"); }}
              error={!!errors.startDate}
              helperText={errors.startDate}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Date"
              type="month"
              fullWidth
              value={form.endDate?.slice(0, 7) || ""}
              onChange={(e) => { f("endDate", e.target.value); clearError("endDate"); }}
              disabled={form.isCurrent}
              error={!!errors.endDate}
              helperText={errors.endDate || (form.isCurrent ? "Not required" : undefined)}
              InputLabelProps={{ shrink: true }}
            />
          </Stack>

          <FormControlLabel
            control={
              <Checkbox
                checked={form.isCurrent}
                onChange={(e) => {
                  f("isCurrent", e.target.checked);
                  if (e.target.checked) {
                    f("endDate", "");
                    clearError("endDate");
                  }
                }}
              />
            }
            label={<Typography variant="body2">I currently work here</Typography>}
          />

          <TextField
            label="Description"
            multiline
            rows={3}
            fullWidth
            placeholder="Describe your role and key achievements…"
            value={form.description || ""}
            onChange={(e) => { f("description", e.target.value); clearError("description"); }}
            error={!!errors.description}
            helperText={
              errors.description ||
              `${(form.description || "").length}/1000 characters`
            }
          />

        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={() => { if (validate()) onSave(form); }}>
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

const currentYear = new Date().getFullYear();

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
  }, [initial, open]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};

    if (!form.degree.trim())
      e.degree = "Degree is required.";
    else if (form.degree.trim().length > 100)
      e.degree = "Degree cannot exceed 100 characters.";

    if (!form.institution.trim())
      e.institution = "Institution is required.";
    else if (form.institution.trim().length > 150)
      e.institution = "Institution cannot exceed 150 characters.";

    if (!form.fieldOfStudy.trim())
      e.fieldOfStudy = "Field of study is required.";
    else if (form.fieldOfStudy.trim().length > 100)
      e.fieldOfStudy = "Field of study cannot exceed 100 characters.";

    if (!form.startYear)
      e.startYear = "Start year is required.";
    else if (form.startYear < 1950)
      e.startYear = "Start year cannot be before 1950.";
    else if (form.startYear > currentYear + 5)
      e.startYear = `Start year cannot exceed ${currentYear + 5}.`;

    if (form.endYear !== undefined && form.endYear !== null) {
      if (form.endYear < 1950)
        e.endYear = "End year cannot be before 1950.";
      else if (form.endYear > currentYear + 10)
        e.endYear = `End year cannot exceed ${currentYear + 10}.`;
      else if (form.endYear < form.startYear)
        e.endYear = "End year cannot be before start year.";
    }

    if (form.grade && form.grade.trim().length > 20)
      e.grade = "Grade cannot exceed 20 characters.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const f = (key: keyof IEducation, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const clearError = (key: string) =>
    setErrors((prev) => { const next = { ...prev }; delete next[key]; return next; });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pr: 6 }}>
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
            placeholder="e.g. B.Tech, MBA, B.Sc"
            value={form.degree}
            onChange={(e) => { f("degree", e.target.value); clearError("degree"); }}
            error={!!errors.degree}
            helperText={errors.degree}
          />

          <TextField
            label="Institution"
            fullWidth
            required
            placeholder="e.g. IIT Bombay, Delhi University"
            value={form.institution}
            onChange={(e) => { f("institution", e.target.value); clearError("institution"); }}
            error={!!errors.institution}
            helperText={errors.institution}
          />

          <TextField
            label="Field of Study"
            fullWidth
            required
            placeholder="e.g. Computer Science, Finance"
            value={form.fieldOfStudy}
            onChange={(e) => { f("fieldOfStudy", e.target.value); clearError("fieldOfStudy"); }}
            error={!!errors.fieldOfStudy}
            helperText={errors.fieldOfStudy}
          />

          <Stack direction="row" spacing={2}>
            <TextField
              label="Start Year"
              type="number"
              fullWidth
              required
              value={form.startYear}
              onChange={(e) => { f("startYear", +e.target.value); clearError("startYear"); }}
              error={!!errors.startYear}
              helperText={errors.startYear}
              inputProps={{ min: 1950, max: currentYear + 5 }}
            />
            <TextField
              label="End Year"
              type="number"
              fullWidth
              placeholder="Leave blank if ongoing"
              value={form.endYear ?? ""}
              onChange={(e) => {
                f("endYear", e.target.value ? +e.target.value : undefined);
                clearError("endYear");
              }}
              error={!!errors.endYear}
              helperText={errors.endYear || "Optional — leave blank if ongoing"}
              inputProps={{ min: 1950, max: currentYear + 10 }}
            />
          </Stack>

          <TextField
            label="Grade / CGPA"
            fullWidth
            placeholder="e.g. 8.5 CGPA, First Class"
            value={form.grade ?? ""}
            onChange={(e) => { f("grade", e.target.value); clearError("grade"); }}
            error={!!errors.grade}
            helperText={errors.grade || "Optional"}
          />

        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={() => { if (validate()) onSave(form); }}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}