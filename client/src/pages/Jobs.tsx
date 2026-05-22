// import { useState, useEffect, useCallback, useRef } from "react";
// import {
//   fetchJobs,
//   fetchJob,
//   applyToJob,
//   fetchMyApplicationForJob,
//   type Job,
//   type JobFilters,
//   type JobType,
//   type ExperienceLevel,
// } from "../api/jobs-api";

// // ─── Helpers ─────────────────────────────────────────────────────────────────

// const JOB_TYPE_LABELS: Record<JobType, string> = {
//   full_time: "Full-time",
//   part_time: "Part-time",
//   contract: "Contract",
//   internship: "Internship",
//   remote: "Remote",
// };

// const EXP_LABELS: Record<ExperienceLevel, string> = {
//   entry: "Entry",
//   mid: "Mid",
//   senior: "Senior",
//   lead: "Lead",
//   executive: "Executive",
// };

// const TYPE_COLORS: Record<JobType, string> = {
//   full_time: "#1d6fd4",
//   part_time: "#7c3aed",
//   contract: "#b45309",
//   internship: "#166534",
//   remote: "#0e7490",
// };

// const EXP_COLORS: Record<ExperienceLevel, string> = {
//   entry: "#166534",
//   mid: "#1d6fd4",
//   senior: "#b45309",
//   lead: "#9f1239",
//   executive: "#7c3aed",
// };

// function formatSalary(job: Job): string {
//   const s = job.salaryRange;
//   if (!s || (!s.min && !s.max)) return "Not disclosed";
//   const sym = s.currency === "INR" ? "₹" : s.currency + " ";
//   const fmt = (n: number) =>
//     n >= 100000 ? `${(n / 100000).toFixed(1)}L` : n >= 1000 ? `${(n / 1000).toFixed(0)}K` : `${n}`;
//   if (s.min && s.max) return `${sym}${fmt(s.min)} – ${sym}${fmt(s.max)}`;
//   if (s.max) return `Up to ${sym}${fmt(s.max)}`;
//   return `${sym}${fmt(s.min!)}+`;
// }

// function timeAgo(d: string): string {
//   const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
//   if (days === 0) return "Today";
//   if (days === 1) return "Yesterday";
//   if (days < 7) return `${days}d ago`;
//   if (days < 30) return `${Math.floor(days / 7)}w ago`;
//   return `${Math.floor(days / 30)}mo ago`;
// }

// function initials(name: string) {
//   return name.split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
// }

// function avatarColor(name: string) {
//   let h = 0;
//   for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
//   return `hsl(${Math.abs(h) % 360} 50% 28%)`;
// }

// // ─── Toast ───────────────────────────────────────────────────────────────────

// type ToastKind = "success" | "error" | "info";

// interface ToastItem {
//   id: number;
//   msg: string;
//   kind: ToastKind;
// }

// let toastId = 0;

// function ToastContainer({ toasts, remove }: { toasts: ToastItem[]; remove: (id: number) => void }) {
//   const icons: Record<ToastKind, string> = { success: "✓", error: "✕", info: "i" };
//   const bg: Record<ToastKind, string> = {
//     success: "#14532d",
//     error: "#7f1d1d",
//     info: "#1e3a5f",
//   };
//   return (
//     <div
//       style={{
//         position: "fixed",
//         bottom: 24,
//         right: 24,
//         display: "flex",
//         flexDirection: "column",
//         gap: 10,
//         zIndex: 9999,
//         pointerEvents: "none",
//       }}
//     >
//       {toasts.map((t) => (
//         <div
//           key={t.id}
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 12,
//             padding: "12px 18px",
//             borderRadius: 10,
//             background: bg[t.kind],
//             color: "#fff",
//             fontSize: 14,
//             fontWeight: 500,
//             boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
//             pointerEvents: "all",
//             animation: "toastIn 0.22s ease",
//             maxWidth: 360,
//             fontFamily: "var(--font-body)",
//           }}
//         >
//           <span
//             style={{
//               width: 22,
//               height: 22,
//               borderRadius: "50%",
//               background: "rgba(255,255,255,0.18)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               fontSize: 12,
//               fontWeight: 800,
//               flexShrink: 0,
//             }}
//           >
//             {icons[t.kind]}
//           </span>
//           <span style={{ flex: 1 }}>{t.msg}</span>
//           <button
//             onClick={() => remove(t.id)}
//             style={{
//               background: "none",
//               border: "none",
//               color: "rgba(255,255,255,0.6)",
//               cursor: "pointer",
//               fontSize: 16,
//               padding: 0,
//               lineHeight: 1,
//             }}
//           >
//             ×
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// }

// function useToast() {
//   const [toasts, setToasts] = useState<ToastItem[]>([]);

//   const show = useCallback((msg: string, kind: ToastKind = "info") => {
//     const id = ++toastId;
//     setToasts((prev) => [...prev, { id, msg, kind }]);
//     setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
//   }, []);

//   const remove = useCallback((id: number) => {
//     setToasts((prev) => prev.filter((t) => t.id !== id));
//   }, []);

//   return { toasts, show, remove };
// }

// // ─── Shared style atoms ───────────────────────────────────────────────────────

// const inputStyle: React.CSSProperties = {
//   width: "100%",
//   padding: "10px 14px",
//   borderRadius: 8,
//   border: "1px solid var(--border)",
//   background: "var(--input-bg)",
//   color: "var(--text-primary)",
//   fontSize: 14,
//   fontFamily: "var(--font-body)",
//   outline: "none",
//   boxSizing: "border-box",
//   transition: "border-color 0.15s",
// };

// const selectStyle: React.CSSProperties = {
//   ...inputStyle,
//   minWidth: 150,
//   cursor: "pointer",
//   width: "auto",
// };

// const primaryBtn: React.CSSProperties = {
//   padding: "10px 22px",
//   borderRadius: 8,
//   background: "var(--accent)",
//   color: "#fff",
//   border: "none",
//   fontSize: 14,
//   fontWeight: 700,
//   cursor: "pointer",
//   fontFamily: "var(--font-body)",
//   transition: "opacity 0.15s, transform 0.1s",
//   letterSpacing: "0.02em",
// };

// const secondaryBtn: React.CSSProperties = {
//   padding: "10px 22px",
//   borderRadius: 8,
//   background: "transparent",
//   color: "var(--text-secondary)",
//   border: "1px solid var(--border)",
//   fontSize: 14,
//   fontWeight: 500,
//   cursor: "pointer",
//   fontFamily: "var(--font-body)",
//   transition: "background 0.15s",
// };

// const overlayStyle: React.CSSProperties = {
//   position: "fixed",
//   inset: 0,
//   background: "rgba(0,0,0,0.65)",
//   backdropFilter: "blur(4px)",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   zIndex: 1000,
//   padding: 16,
// };

// const modalBox: React.CSSProperties = {
//   background: "var(--modal-bg)",
//   border: "1px solid var(--border)",
//   borderRadius: 16,
//   padding: 28,
//   width: "100%",
//   boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
// };

// const iconBtn: React.CSSProperties = {
//   background: "none",
//   border: "none",
//   color: "var(--text-muted)",
//   cursor: "pointer",
//   fontSize: 18,
//   lineHeight: 1,
//   padding: "4px 6px",
//   borderRadius: 6,
// };

// const labelStyle: React.CSSProperties = {
//   display: "block",
//   fontSize: 12,
//   fontWeight: 700,
//   letterSpacing: "0.06em",
//   textTransform: "uppercase",
//   color: "var(--text-secondary)",
//   marginBottom: 6,
// };

// const listStyle: React.CSSProperties = {
//   margin: 0,
//   paddingLeft: 20,
//   color: "var(--text-secondary)",
//   fontSize: 14,
//   lineHeight: 1.9,
// };

// // ─── Badges ───────────────────────────────────────────────────────────────────

// function TypeBadge({ type }: { type: JobType }) {
//   return (
//     <span
//       style={{
//         padding: "2px 8px",
//         borderRadius: 4,
//         background: TYPE_COLORS[type],
//         color: "#fff",
//         fontSize: 10,
//         fontWeight: 700,
//         letterSpacing: "0.07em",
//         textTransform: "uppercase",
//         flexShrink: 0,
//       }}
//     >
//       {JOB_TYPE_LABELS[type]}
//     </span>
//   );
// }

// function ExpBadge({ level }: { level: ExperienceLevel }) {
//   return (
//     <span
//       style={{
//         padding: "2px 8px",
//         borderRadius: 4,
//         background: EXP_COLORS[level],
//         color: "#fff",
//         fontSize: 10,
//         fontWeight: 700,
//         letterSpacing: "0.07em",
//         textTransform: "uppercase",
//         flexShrink: 0,
//       }}
//     >
//       {EXP_LABELS[level]}
//     </span>
//   );
// }

// function SkillPill({ label }: { label: string }) {
//   return (
//     <span
//       style={{
//         padding: "2px 10px",
//         borderRadius: 99,
//         background: "var(--skill-bg)",
//         color: "var(--skill-fg)",
//         fontSize: 11,
//         fontWeight: 500,
//         fontFamily: "var(--font-mono)",
//         border: "1px solid var(--skill-border)",
//         letterSpacing: "0.02em",
//       }}
//     >
//       {label}
//     </span>
//   );
// }

// function MetaChip({ children }: { children: React.ReactNode }) {
//   return (
//     <span
//       style={{
//         padding: "4px 12px",
//         borderRadius: 8,
//         background: "var(--chip-bg)",
//         color: "var(--text-secondary)",
//         fontSize: 13,
//         border: "1px solid var(--border)",
//       }}
//     >
//       {children}
//     </span>
//   );
// }

// function SectionTitle({ children }: { children: React.ReactNode }) {
//   return (
//     <h3
//       style={{
//         margin: "0 0 10px",
//         fontSize: 11,
//         fontWeight: 800,
//         letterSpacing: "0.1em",
//         textTransform: "uppercase",
//         color: "var(--accent)",
//         fontFamily: "var(--font-display)",
//       }}
//     >
//       {children}
//     </h3>
//   );
// }

// // ─── Spinner ──────────────────────────────────────────────────────────────────

// function Spinner({ size = 32 }: { size?: number }) {
//   return (
//     <div
//       style={{
//         width: size,
//         height: size,
//         borderRadius: "50%",
//         border: `3px solid var(--border)`,
//         borderTopColor: "var(--accent)",
//         animation: "spin 0.7s linear infinite",
//       }}
//     />
//   );
// }

// // ─── Apply Modal ──────────────────────────────────────────────────────────────

// interface ApplyModalProps {
//   job: Job;
//   onClose: () => void;
//   onSuccess: (msg: string) => void;
//   onError: (msg: string) => void;
// }

// function ApplyModal({ job, onClose, onSuccess, onError }: ApplyModalProps) {
//   const [coverLetter, setCoverLetter] = useState("");
//   const [resumeUrl, setResumeUrl] = useState("");
//   const [loading, setLoading] = useState(false);

//   async function handleSubmit() {
//     setLoading(true);
//     try {
//       await applyToJob(job._id, {
//         coverLetter: coverLetter.trim() || undefined,
//         resumeUrl: resumeUrl.trim() || undefined,
//       });
//       onSuccess(`Applied to ${job.title} at ${job.company}!`);
//       onClose();
//     } catch (e: unknown) {
//       const msg =
//         (e as { response?: { data?: { message?: string } } })?.response?.data?.message ??
//         "Failed to submit application. Please try again.";
//       onError(msg);
//     } finally {
//       setLoading(false);
//     }
//   }

//   const overLimit = coverLetter.length > 3000;

//   return (
//     <div style={overlayStyle} onClick={onClose}>
//       <div
//         style={{ ...modalBox, maxWidth: 560, display: "flex", flexDirection: "column", gap: 20 }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
//           <div>
//             <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)" }}>
//               Applying for
//             </p>
//             <h2 style={{ margin: 0, fontSize: 20, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
//               {job.title}
//             </h2>
//             <p style={{ margin: "4px 0 0", color: "var(--text-secondary)", fontSize: 13 }}>
//               {job.company} · {job.location}
//             </p>
//           </div>
//           <button onClick={onClose} style={iconBtn}>✕</button>
//         </div>

//         <div style={{ height: 1, background: "var(--border)" }} />

//         {/* Cover letter */}
//         <div>
//           <label style={labelStyle}>
//             Cover Letter{" "}
//             <span style={{ color: "var(--text-muted)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>
//               (optional)
//             </span>
//           </label>
//           <textarea
//             value={coverLetter}
//             onChange={(e) => setCoverLetter(e.target.value)}
//             placeholder="Why are you a great fit for this role?"
//             rows={6}
//             style={{
//               ...inputStyle,
//               resize: "vertical",
//               minHeight: 130,
//               lineHeight: 1.7,
//               borderColor: overLimit ? "#ef4444" : undefined,
//             }}
//           />
//           <p
//             style={{
//               textAlign: "right",
//               fontSize: 11,
//               color: overLimit ? "#ef4444" : "var(--text-muted)",
//               margin: "4px 0 0",
//             }}
//           >
//             {coverLetter.length} / 3000
//           </p>
//         </div>

//         {/* Resume URL */}
//         <div>
//           <label style={labelStyle}>
//             Resume URL{" "}
//             <span style={{ color: "var(--text-muted)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>
//               (optional)
//             </span>
//           </label>
//           <input
//             type="url"
//             value={resumeUrl}
//             onChange={(e) => setResumeUrl(e.target.value)}
//             placeholder="https://drive.google.com/your-resume"
//             style={inputStyle}
//           />
//         </div>

//         {/* Actions */}
//         <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 4 }}>
//           <button onClick={onClose} style={secondaryBtn} disabled={loading}>
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             style={{ ...primaryBtn, opacity: loading || overLimit ? 0.6 : 1, display: "flex", alignItems: "center", gap: 8 }}
//             disabled={loading || overLimit}
//           >
//             {loading ? (
//               <>
//                 <Spinner size={14} />
//                 Submitting…
//               </>
//             ) : (
//               "Submit Application"
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Job Detail Modal ─────────────────────────────────────────────────────────

// interface JobDetailModalProps {
//   jobId: string;
//   onClose: () => void;
//   onApplySuccess: (msg: string) => void;
//   onApplyError: (msg: string) => void;
//   onLoadError: (msg: string) => void;
// }

// function JobDetailModal({ jobId, onClose, onApplySuccess, onApplyError, onLoadError }: JobDetailModalProps) {
//   const [job, setJob] = useState<Job | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [alreadyApplied, setAlreadyApplied] = useState(false);
//   const [justApplied, setJustApplied] = useState(false);
//   const [showApply, setShowApply] = useState(false);

//   useEffect(() => {
//     setLoading(true);
//     Promise.all([fetchJob(jobId), fetchMyApplicationForJob(jobId)])
//       .then(([j, app]) => {
//         setJob(j);
//         setAlreadyApplied(!!app);
//       })
//       .catch(() => {
//         onLoadError("Could not load job details. Please try again.");
//         onClose();
//       })
//       .finally(() => setLoading(false));
//   }, [jobId]); // eslint-disable-line

//   if (loading || !job)
//     return (
//       <div style={overlayStyle} onClick={onClose}>
//         <div
//           style={{
//             ...modalBox,
//             maxWidth: 700,
//             minHeight: 300,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//           onClick={(e) => e.stopPropagation()}
//         >
//           <Spinner size={40} />
//         </div>
//       </div>
//     );

//   const deadline = job.applicationDeadline
//     ? new Date(job.applicationDeadline).toLocaleDateString("en-IN", {
//         day: "numeric",
//         month: "short",
//         year: "numeric",
//       })
//     : null;

//   const applied = alreadyApplied || justApplied;

//   return (
//     <>
//       <div style={overlayStyle} onClick={onClose}>
//         <div
//           style={{
//             ...modalBox,
//             maxWidth: 720,
//             maxHeight: "88vh",
//             overflowY: "auto",
//             display: "flex",
//             flexDirection: "column",
//             gap: 22,
//           }}
//           onClick={(e) => e.stopPropagation()}
//         >
//           {/* Top bar */}
//           <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
//             <div
//               style={{
//                 width: 52,
//                 height: 52,
//                 borderRadius: 12,
//                 background: avatarColor(job.company),
//                 color: "#fff",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 fontWeight: 800,
//                 fontSize: 16,
//                 fontFamily: "var(--font-display)",
//                 flexShrink: 0,
//               }}
//             >
//               {initials(job.company)}
//             </div>
//             <div style={{ flex: 1 }}>
//               <h2 style={{ margin: "0 0 4px", fontSize: 22, color: "var(--text-primary)", fontFamily: "var(--font-display)", fontWeight: 700 }}>
//                 {job.title}
//               </h2>
//               <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 14 }}>
//                 {job.company}
//                 <span style={{ margin: "0 8px", opacity: 0.4 }}>·</span>
//                 📍 {job.location}
//               </p>
//             </div>
//             <button onClick={onClose} style={iconBtn}>✕</button>
//           </div>

//           {/* Meta strip */}
//           <div
//             style={{
//               display: "flex",
//               flexWrap: "wrap",
//               gap: 8,
//               padding: "14px 0",
//               borderTop: "1px solid var(--border)",
//               borderBottom: "1px solid var(--border)",
//             }}
//           >
//             <TypeBadge type={job.type} />
//             <ExpBadge level={job.experienceLevel} />
//             <MetaChip>🏢 {job.openings} opening{job.openings !== 1 ? "s" : ""}</MetaChip>
//             <MetaChip>💰 {formatSalary(job)}</MetaChip>
//             <MetaChip>👥 {job.applicationsCount} applied</MetaChip>
//             {deadline && <MetaChip>📅 Deadline: {deadline}</MetaChip>}
//             <MetaChip>🕐 Posted {timeAgo(job.createdAt)}</MetaChip>
//           </div>

//           {/* Description */}
//           <section>
//             <SectionTitle>About the Role</SectionTitle>
//             <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.85, whiteSpace: "pre-wrap" }}>
//               {job.description}
//             </p>
//           </section>

//           {job.responsibilities.length > 0 && (
//             <section>
//               <SectionTitle>Responsibilities</SectionTitle>
//               <ul style={listStyle}>
//                 {job.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
//               </ul>
//             </section>
//           )}

//           {job.requirements.length > 0 && (
//             <section>
//               <SectionTitle>Requirements</SectionTitle>
//               <ul style={listStyle}>
//                 {job.requirements.map((r, i) => <li key={i}>{r}</li>)}
//               </ul>
//             </section>
//           )}

//           {job.skills.length > 0 && (
//             <section>
//               <SectionTitle>Skills</SectionTitle>
//               <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
//                 {job.skills.map((s) => <SkillPill key={s} label={s} />)}
//               </div>
//             </section>
//           )}

//           {/* CTA */}
//           <div style={{ paddingTop: 4 }}>
//             {applied ? (
//               <div
//                 style={{
//                   display: "inline-flex",
//                   alignItems: "center",
//                   gap: 8,
//                   padding: "10px 18px",
//                   borderRadius: 8,
//                   background: "#14532d",
//                   color: "#bbf7d0",
//                   fontSize: 14,
//                   fontWeight: 600,
//                 }}
//               >
//                 ✓ Application submitted
//               </div>
//             ) : job.status !== "open" ? (
//               <div
//                 style={{
//                   display: "inline-flex",
//                   alignItems: "center",
//                   gap: 8,
//                   padding: "10px 18px",
//                   borderRadius: 8,
//                   background: "var(--chip-bg)",
//                   color: "var(--text-muted)",
//                   fontSize: 14,
//                   fontWeight: 600,
//                   border: "1px solid var(--border)",
//                 }}
//               >
//                 Applications closed
//               </div>
//             ) : (
//               <button style={primaryBtn} onClick={() => setShowApply(true)}>
//                 Apply Now
//               </button>
//             )}
//           </div>
//         </div>
//       </div>

//       {showApply && (
//         <ApplyModal
//           job={job}
//           onClose={() => setShowApply(false)}
//           onSuccess={(msg) => {
//             setShowApply(false);
//             setJustApplied(true);
//             onApplySuccess(msg);
//           }}
//           onError={onApplyError}
//         />
//       )}
//     </>
//   );
// }

// // ─── Job Card ─────────────────────────────────────────────────────────────────

// function JobCard({ job, onClick }: { job: Job; onClick: () => void }) {
//   const [hovered, setHovered] = useState(false);
//   return (
//     <div
//       onClick={onClick}
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//       role="button"
//       tabIndex={0}
//       onKeyDown={(e) => e.key === "Enter" && onClick()}
//       style={{
//         background: hovered ? "var(--card-hover)" : "var(--card-bg)",
//         border: `1px solid ${hovered ? "var(--accent)" : "var(--border)"}`,
//         borderRadius: 14,
//         padding: "18px 22px",
//         cursor: "pointer",
//         transition: "all 0.16s ease",
//         transform: hovered ? "translateY(-2px)" : "none",
//         boxShadow: hovered ? "0 8px 28px var(--shadow)" : "none",
//       }}
//     >
//       <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
//         {/* Avatar */}
//         <div
//           style={{
//             width: 44,
//             height: 44,
//             borderRadius: 10,
//             background: avatarColor(job.company),
//             color: "#fff",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             fontWeight: 800,
//             fontSize: 14,
//             fontFamily: "var(--font-display)",
//             flexShrink: 0,
//           }}
//         >
//           {initials(job.company)}
//         </div>

//         {/* Main */}
//         <div style={{ flex: 1, minWidth: 0 }}>
//           <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", marginBottom: 5 }}>
//             <span
//               style={{
//                 fontWeight: 700,
//                 fontSize: 15,
//                 color: "var(--text-primary)",
//                 fontFamily: "var(--font-display)",
//               }}
//             >
//               {job.title}
//             </span>
//             <TypeBadge type={job.type} />
//             <ExpBadge level={job.experienceLevel} />
//           </div>

//           <p style={{ margin: "0 0 10px", color: "var(--text-secondary)", fontSize: 13 }}>
//             {job.company}
//             <span style={{ margin: "0 6px", opacity: 0.4 }}>·</span>
//             📍 {job.location}
//             <span style={{ margin: "0 6px", opacity: 0.4 }}>·</span>
//             {timeAgo(job.createdAt)}
//           </p>

//           <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
//             {job.skills.slice(0, 4).map((s) => <SkillPill key={s} label={s} />)}
//             {job.skills.length > 4 && (
//               <span style={{ fontSize: 12, color: "var(--text-muted)", alignSelf: "center" }}>
//                 +{job.skills.length - 4}
//               </span>
//             )}
//           </div>
//         </div>

//         {/* Right column */}
//         <div style={{ textAlign: "right", flexShrink: 0 }}>
//           <div style={{ fontWeight: 700, fontSize: 14, color: "var(--accent)", fontFamily: "var(--font-display)", marginBottom: 4 }}>
//             {formatSalary(job)}
//           </div>
//           <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{job.applicationsCount} applied</div>
//           {job.openings > 1 && (
//             <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{job.openings} openings</div>
//           )}
//           {job.status !== "open" && (
//             <div
//               style={{
//                 marginTop: 6,
//                 fontSize: 10,
//                 fontWeight: 700,
//                 letterSpacing: "0.06em",
//                 textTransform: "uppercase",
//                 color: "#ef4444",
//               }}
//             >
//               Closed
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Filter Bar ───────────────────────────────────────────────────────────────

// const JOB_TYPES: Array<{ value: JobType | ""; label: string }> = [
//   { value: "", label: "All types" },
//   { value: "full_time", label: "Full-time" },
//   { value: "part_time", label: "Part-time" },
//   { value: "contract", label: "Contract" },
//   { value: "internship", label: "Internship" },
//   { value: "remote", label: "Remote" },
// ];

// const EXP_LEVELS: Array<{ value: ExperienceLevel | ""; label: string }> = [
//   { value: "", label: "All levels" },
//   { value: "entry", label: "Entry" },
//   { value: "mid", label: "Mid" },
//   { value: "senior", label: "Senior" },
//   { value: "lead", label: "Lead" },
//   { value: "executive", label: "Executive" },
// ];

// function FilterBar({
//   filters,
//   onChange,
// }: {
//   filters: JobFilters;
//   onChange: (f: Partial<JobFilters>) => void;
// }) {
//   return (
//     <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
//       <div style={{ position: "relative", flex: "1 1 260px", minWidth: 200 }}>
//         <span
//           style={{
//             position: "absolute",
//             left: 12,
//             top: "50%",
//             transform: "translateY(-50%)",
//             color: "var(--text-muted)",
//             pointerEvents: "none",
//             fontSize: 15,
//           }}
//         >
//           🔍
//         </span>
//         <input
//           type="text"
//           placeholder="Search role, company, skill…"
//           value={filters.search ?? ""}
//           onChange={(e) => onChange({ search: e.target.value, page: 1 })}
//           style={{ ...inputStyle, paddingLeft: 38 }}
//         />
//       </div>
//       <select
//         value={filters.type ?? ""}
//         onChange={(e) => onChange({ type: e.target.value as JobType | "", page: 1 })}
//         style={selectStyle}
//       >
//         {JOB_TYPES.map((t) => (
//           <option key={t.value} value={t.value}>{t.label}</option>
//         ))}
//       </select>
//       <select
//         value={filters.experienceLevel ?? ""}
//         onChange={(e) => onChange({ experienceLevel: e.target.value as ExperienceLevel | "", page: 1 })}
//         style={selectStyle}
//       >
//         {EXP_LEVELS.map((l) => (
//           <option key={l.value} value={l.value}>{l.label}</option>
//         ))}
//       </select>
//     </div>
//   );
// }

// // ─── Pagination ───────────────────────────────────────────────────────────────

// function Pagination({
//   page,
//   totalPages,
//   onChange,
// }: {
//   page: number;
//   totalPages: number;
//   onChange: (p: number) => void;
// }) {
//   if (totalPages <= 1) return null;

//   // Show at most 7 page buttons, centred on current page
//   const delta = 2;
//   const range: number[] = [];
//   for (
//     let i = Math.max(1, page - delta);
//     i <= Math.min(totalPages, page + delta);
//     i++
//   ) {
//     range.push(i);
//   }

//   const btnStyle = (active: boolean, disabled = false): React.CSSProperties => ({
//     padding: "7px 13px",
//     borderRadius: 8,
//     border: active ? "1px solid var(--accent)" : "1px solid var(--border)",
//     background: active ? "var(--accent)" : "var(--card-bg)",
//     color: active ? "#fff" : disabled ? "var(--text-muted)" : "var(--text-secondary)",
//     fontSize: 13,
//     fontWeight: active ? 700 : 500,
//     cursor: disabled ? "not-allowed" : "pointer",
//     opacity: disabled ? 0.4 : 1,
//     fontFamily: "var(--font-body)",
//     transition: "all 0.12s",
//   });

//   return (
//     <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 36, flexWrap: "wrap" }}>
//       <button style={btnStyle(false, page <= 1)} disabled={page <= 1} onClick={() => onChange(page - 1)}>
//         ← Prev
//       </button>
//       {range[0] > 1 && (
//         <>
//           <button style={btnStyle(false)} onClick={() => onChange(1)}>1</button>
//           {range[0] > 2 && <span style={{ color: "var(--text-muted)", alignSelf: "center" }}>…</span>}
//         </>
//       )}
//       {range.map((p) => (
//         <button key={p} style={btnStyle(p === page)} onClick={() => onChange(p)}>{p}</button>
//       ))}
//       {range[range.length - 1] < totalPages && (
//         <>
//           {range[range.length - 1] < totalPages - 1 && (
//             <span style={{ color: "var(--text-muted)", alignSelf: "center" }}>…</span>
//           )}
//           <button style={btnStyle(false)} onClick={() => onChange(totalPages)}>{totalPages}</button>
//         </>
//       )}
//       <button style={btnStyle(false, page >= totalPages)} disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
//         Next →
//       </button>
//     </div>
//   );
// }

// // ─── Main page ────────────────────────────────────────────────────────────────

// const containerStyle: React.CSSProperties = {
//   maxWidth: 900,
//   margin: "0 auto",
//   padding: "0 20px",
// };

// const CSS = `
//   @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap');

//   :root {
//     --font-display: 'DM Serif Display', Georgia, serif;
//     --font-body:    'DM Sans', system-ui, sans-serif;
//     --font-mono:    'JetBrains Mono', monospace;

//     --page-bg:     #0d0f14;
//     --hero-bg:     #111318;
//     --card-bg:     #161920;
//     --card-hover:  #1b1f2a;
//     --modal-bg:    #161920;
//     --input-bg:    #1b1f2a;
//     --chip-bg:     #1b1f2a;

//     --border:       #262b38;
//     --divider:      #262b38;
//     --shadow:       rgba(0,0,0,0.4);

//     --text-primary:   #f0f2f7;
//     --text-secondary: #8b91a8;
//     --text-muted:     #555d73;

//     --accent:      #4f8ef7;
//     --accent-dim:  rgba(79,142,247,0.12);

//     --skill-bg:     rgba(79,142,247,0.1);
//     --skill-fg:     #7aaeff;
//     --skill-border: rgba(79,142,247,0.2);
//   }

//   * { box-sizing: border-box; }
//   body { margin: 0; background: var(--page-bg); }

//   @keyframes spin {
//     to { transform: rotate(360deg); }
//   }
//   @keyframes toastIn {
//     from { opacity: 0; transform: translateY(12px); }
//     to   { opacity: 1; transform: none; }
//   }

//   input:focus, textarea:focus, select:focus {
//     border-color: var(--accent) !important;
//     box-shadow: 0 0 0 3px rgba(79,142,247,0.15);
//   }

//   ::-webkit-scrollbar { width: 6px; }
//   ::-webkit-scrollbar-track { background: transparent; }
//   ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
// `;

// export default function Jobs() {
//   const [filters, setFilters] = useState<JobFilters>({ page: 1, limit: 10 });
//   const [jobs, setJobs] = useState<Job[]>([]);
//   const [total, setTotal] = useState(0);
//   const [totalPages, setTotalPages] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
//   const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
//   const { toasts, show: showToast, remove: removeToast } = useToast();

//   const loadJobs = useCallback(async (f: JobFilters) => {
//     setLoading(true);
//     try {
//       const res = await fetchJobs(f);
//       setJobs(res.jobs);
//       setTotal(res.total);
//       setTotalPages(res.totalPages);
//     } catch {
//       showToast("Failed to load jobs. Please check your connection.", "error");
//     } finally {
//       setLoading(false);
//     }
//   }, [showToast]);

//   useEffect(() => {
//     if (debounceRef.current) clearTimeout(debounceRef.current);
//     debounceRef.current = setTimeout(() => loadJobs(filters), 300);
//     return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
//   }, [filters, loadJobs]);

//   function updateFilters(partial: Partial<JobFilters>) {
//     setFilters((prev) => ({ ...prev, ...partial }));
//   }

//   return (
//     <>
//       <style>{CSS}</style>

//       <div style={{ minHeight: "100vh", background: "var(--page-bg)", fontFamily: "var(--font-body)" }}>

//         {/* Hero */}
//         <div style={{ background: "var(--hero-bg)", borderBottom: "1px solid var(--border)", padding: "52px 0 38px" }}>
//           <div style={containerStyle}>
//             <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--accent)" }}>
//               Open Positions
//             </p>
//             <h1
//               style={{
//                 margin: "0 0 8px",
//                 fontSize: "clamp(28px, 4.5vw, 42px)",
//                 fontFamily: "var(--font-display)",
//                 color: "var(--text-primary)",
//                 fontWeight: 400,
//                 lineHeight: 1.15,
//               }}
//             >
//               Find your next role
//             </h1>
//             <p style={{ margin: "0 0 30px", color: "var(--text-secondary)", fontSize: 15 }}>
//               {loading
//                 ? "Loading opportunities…"
//                 : total > 0
//                 ? `${total} curated opening${total !== 1 ? "s" : ""}`
//                 : "No jobs match your filters"}
//             </p>
//             <FilterBar filters={filters} onChange={updateFilters} />
//           </div>
//         </div>

//         {/* Content */}
//         <div style={{ ...containerStyle, paddingTop: 28, paddingBottom: 72 }}>
//           {loading ? (
//             <div style={{ display: "flex", justifyContent: "center", padding: 80 }}>
//               <Spinner size={36} />
//             </div>
//           ) : jobs.length === 0 ? (
//             <div style={{ textAlign: "center", padding: "80px 20px" }}>
//               <div style={{ fontSize: 44, marginBottom: 14 }}>🔍</div>
//               <h3 style={{ margin: "0 0 8px", color: "var(--text-primary)", fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 22 }}>
//                 No jobs found
//               </h3>
//               <p style={{ margin: "0 0 20px", color: "var(--text-muted)", fontSize: 14 }}>
//                 Try adjusting your filters or search term.
//               </p>
//               <button
//                 style={secondaryBtn}
//                 onClick={() => setFilters({ page: 1, limit: 10 })}
//               >
//                 Clear all filters
//               </button>
//             </div>
//           ) : (
//             <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//               {jobs.map((job) => (
//                 <JobCard key={job._id} job={job} onClick={() => setSelectedJobId(job._id)} />
//               ))}
//             </div>
//           )}

//           <Pagination
//             page={filters.page ?? 1}
//             totalPages={totalPages}
//             onChange={(p) => updateFilters({ page: p })}
//           />
//         </div>
//       </div>

//       {/* Detail modal */}
//       {selectedJobId && (
//         <JobDetailModal
//           jobId={selectedJobId}
//           onClose={() => setSelectedJobId(null)}
//           onApplySuccess={(msg) => { showToast(msg, "success"); setSelectedJobId(null); }}
//           onApplyError={(msg) => showToast(msg, "error")}
//           onLoadError={(msg) => showToast(msg, "error")}
//         />
//       )}

//       {/* Toasts */}
//       <ToastContainer toasts={toasts} remove={removeToast} />
//     </>
//   );
// }


import { useState, useEffect, useCallback, useRef } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Stack,
  Chip,
  Card,
  CardContent,
  Grid,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Avatar,
  CircularProgress,
  Modal,
  Fade,
  Backdrop,
  Alert,
  Snackbar,
  IconButton,
  Divider,
  Tooltip,
  useTheme,
  alpha,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CloseIcon from "@mui/icons-material/Close";
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import {
  fetchJobs,
  fetchJob,
  applyToJob,
  fetchMyApplicationForJob,
  type Job,
  type JobFilters,
  type JobType,
  type ExperienceLevel,
} from "../api/jobs-api";

// ─── Constants & Helpers ─────────────────────────────────────────────────────

const JOB_TYPE_LABELS: Record<JobType, string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  contract: "Contract",
  internship: "Internship",
  remote: "Remote",
};

const EXP_LABELS: Record<ExperienceLevel, string> = {
  entry: "Entry",
  mid: "Mid",
  senior: "Senior",
  lead: "Lead",
  executive: "Executive",
};

const JOB_TYPES: Array<{ value: JobType | ""; label: string }> = [
  { value: "full_time", label: "Full-time" },
  { value: "part_time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "remote", label: "Remote" },
];

const EXP_LEVELS: Array<{ value: ExperienceLevel | ""; label: string }> = [
  { value: "entry", label: "Entry" },
  { value: "mid", label: "Mid" },
  { value: "senior", label: "Senior" },
  { value: "lead", label: "Lead" },
  { value: "executive", label: "Executive" },
];

function formatSalary(job: Job): string {
  const s = job.salaryRange;
  if (!s || (!s.min && !s.max)) return "Not disclosed";
  const sym = s.currency === "INR" ? "₹" : s.currency + " ";
  const fmt = (n: number) =>
    n >= 100000 ? `${(n / 100000).toFixed(1)}L` : n >= 1000 ? `${(n / 1000).toFixed(0)}K` : `${n}`;
  if (s.min && s.max) return `${sym}${fmt(s.min)} – ${sym}${fmt(s.max)}`;
  if (s.max) return `Up to ${sym}${fmt(s.max)}`;
  return `${sym}${fmt(s.min!)}+`;
}

function timeAgo(d: string): string {
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function getInitials(name: string) {
  return name.split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
}

// Simple hash for avatar colors
function stringToColor(string: string) {
  let hash = 0;
  let i;
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

// ─── Apply Modal (MUI Version) ───────────────────────────────────────────────

interface ApplyModalProps {
  job: Job;
  onClose: () => void;
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

function ApplyModal({ job, onClose, onSuccess, onError }: ApplyModalProps) {
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    try {
      await applyToJob(job._id, {
        coverLetter: coverLetter.trim() || undefined,
        resumeUrl: resumeUrl.trim() || undefined,
      });
      onSuccess(`Applied to ${job.title} at ${job.company}!`);
      onClose();
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Failed to submit application. Please try again.";
      onError(msg);
    } finally {
      setLoading(false);
    }
  }

  const overLimit = coverLetter.length > 3000;

  return (
    <Modal open onClose={onClose} closeAfterTransition BackdropComponent={Backdrop}>
      <Fade in>
        <Box sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 500 },
          bgcolor: "background.paper",
          borderRadius: 4,
          boxShadow: 24,
          p: 4,
          outline: "none",
          maxHeight: "90vh",
          overflowY: "auto"
        }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box>
              <Typography variant="overline" color="primary.main" sx={{ fontWeight: 800 }}>
                Applying for
              </Typography>
              <Typography variant="h5" fontWeight={700}>{job.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {job.company} · {job.location}
              </Typography>
            </Box>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Stack spacing={3}>
            <Box>
              <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
                Cover Letter (optional)
              </Typography>
              <TextField
                multiline
                rows={5}
                fullWidth
                margin="dense"
                placeholder="Why are you a great fit for this role?"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                error={overLimit}
                helperText={overLimit ? "Character limit exceeded" : `${coverLetter.length}/3000`}
              />
            </Box>

            <Box>
              <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
                Resume URL (optional)
              </Typography>
              <TextField
                fullWidth
                margin="dense"
                placeholder="https://drive.google.com/your-resume"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
              />
            </Box>

            <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
              <Button onClick={onClose} disabled={loading}>Cancel</Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading || overLimit}
                startIcon={loading ? <CircularProgress size={16} color="inherit" /> : undefined}
              >
                {loading ? "Submitting..." : "Submit Application"}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Fade>
    </Modal>
  );
}

// ─── Job Detail Modal (MUI Version) ───────────────────────────────────────────

interface JobDetailModalProps {
  jobId: string;
  onClose: () => void;
  onApplySuccess: (msg: string) => void;
  onApplyError: (msg: string) => void;
  onLoadError: (msg: string) => void;
}

function JobDetailModal({ jobId, onClose, onApplySuccess, onApplyError, onLoadError }: JobDetailModalProps) {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [justApplied, setJustApplied] = useState(false);
  const [showApply, setShowApply] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchJob(jobId), fetchMyApplicationForJob(jobId)])
      .then(([j, app]) => {
        setJob(j);
        setAlreadyApplied(!!app);
      })
      .catch(() => {
        onLoadError("Could not load job details.");
        onClose();
      })
      .finally(() => setLoading(false));
  }, [jobId]);

  const applied = alreadyApplied || justApplied;

  const content = loading ? (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}>
      <CircularProgress />
    </Box>
  ) : job ? (
    <Stack spacing={3}>
      {/* Header */}
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <Avatar sx={{ width: 64, height: 64, bgcolor: stringToColor(job.company), fontSize: 24 }}>
          {getInitials(job.company)}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" fontWeight={700}>{job.title}</Typography>
          <Stack direction="row" alignItems="center" spacing={1} color="text.secondary">
            <BusinessIcon sx={{ fontSize: 16 }} />
            <Typography variant="body2">{job.company}</Typography>
            <span>·</span>
            <LocationOnIcon sx={{ fontSize: 16 }} />
            <Typography variant="body2">{job.location}</Typography>
          </Stack>
        </Box>
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </Stack>

      {/* Meta Chips */}
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Chip size="small" label={JOB_TYPE_LABELS[job.type]} variant="outlined" color="primary" />
        <Chip size="small" label={EXP_LABELS[job.experienceLevel]} variant="outlined" />
        <Chip size="small" label={`${job.openings} Openings`} />
        <Chip size="small" icon={<AttachMoneyIcon />} label={formatSalary(job)} />
      </Stack>

      <Divider />

      {/* Description */}
      <Box>
        <Typography variant="subtitle2" color="primary.main" gutterBottom sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
          About the Role
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-wrap" }}>
          {job.description}
        </Typography>
      </Box>

      {/* Requirements & Skills */}
      {job.requirements.length > 0 && (
        <Box>
          <Typography variant="subtitle2" color="primary.main" gutterBottom sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
            Requirements
          </Typography>
          <Box component="ul" sx={{ pl: 2.5, m: 0, color: "text.secondary" }}>
            {job.requirements.map((r, i) => (
              <Typography component="li" variant="body2" key={i} sx={{ mb: 0.5 }}>{r}</Typography>
            ))}
          </Box>
        </Box>
      )}

      {job.skills.length > 0 && (
        <Box>
          <Typography variant="subtitle2" color="primary.main" gutterBottom sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
            Skills
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {job.skills.map((s) => (
              <Chip key={s} label={s} size="small" sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1) }} />
            ))}
          </Stack>
        </Box>
      )}

      {/* CTA */}
      <Divider />
      <Box textAlign="right">
        {applied ? (
          <Alert severity="success" icon={<CheckCircleOutlineIcon />} sx={{ display: "inline-flex" }}>
            Application submitted
          </Alert>
        ) : job.status !== "open" ? (
          <Button disabled variant="outlined">Applications Closed</Button>
        ) : (
          <Button variant="contained" size="large" onClick={() => setShowApply(true)}>
            Apply Now
          </Button>
        )}
      </Box>
    </Stack>
  ) : null;

  return (
    <>
      <Modal open onClose={onClose} closeAfterTransition BackdropComponent={Backdrop}>
        <Fade in>
          <Box sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "95%", sm: 600 },
            bgcolor: "background.paper",
            borderRadius: 4,
            boxShadow: 24,
            p: { xs: 2, sm: 4 },
            maxHeight: "90vh",
            overflowY: "auto",
            outline: "none"
          }}>
            {content}
          </Box>
        </Fade>
      </Modal>

      {showApply && job && (
        <ApplyModal
          job={job}
          onClose={() => setShowApply(false)}
          onSuccess={(msg) => {
            setJustApplied(true);
            setShowApply(false);
            onApplySuccess(msg);
          }}
          onError={onApplyError}
        />
      )}
    </>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Jobs() {
  const theme = useTheme();
  const [filters, setFilters] = useState<JobFilters>({ page: 1, limit: 10 });
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Toast State
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" | "info" } | null>(null);
  const showToast = useCallback((msg: string, type: "success" | "error" | "info" = "info") => {
    setToast({ msg, type });
  }, []);

  const loadJobs = useCallback(async (f: JobFilters) => {
    setLoading(true);
    try {
      const res = await fetchJobs(f);
      setJobs(res.jobs);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch {
      showToast("Failed to load jobs.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => loadJobs(filters), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [filters, loadJobs]);

  function updateFilters(partial: Partial<JobFilters>) {
    setFilters((prev) => ({ ...prev, ...partial }));
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
      {/* Hero */}
      <Typography
        variant="h2"
        sx={{ fontSize: { xs: 32, md: 48 }, mb: 1, fontWeight: 700, color: "text.primary" }}
      >
        Find your next role
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 5 }}>
        {loading ? "Loading opportunities..." : `${total} curated openings across the globe.`}
      </Typography>

      {/* Filters */}
      <Card sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            fullWidth
            placeholder="Search role, company, skill…"
            value={filters.search ?? ""}
            onChange={(e) => updateFilters({ search: e.target.value, page: 1 })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          <FormControl sx={{ minWidth: 160 }}>
            {/* Change shrink to permanently be true so it stays out of the way of your "All..." text */}
            <InputLabel id="job-type-label" shrink>Type</InputLabel>
            <Select
              labelId="job-type-label"
              value={filters.type ?? ""}
              label="Type"
              onChange={(e) => updateFilters({ type: e.target.value as JobType | "", page: 1 })}
              displayEmpty
            >
              <MenuItem value="">All types</MenuItem>
              {JOB_TYPES.map((t) => (
                <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 160 }}>
            {/* Same here: force shrink to true */}
            <InputLabel id="experience-label" shrink>Experience</InputLabel>
            <Select
              labelId="experience-label"
              value={filters.experienceLevel ?? ""}
              label="Experience"
              onChange={(e) => updateFilters({ experienceLevel: e.target.value as ExperienceLevel | "", page: 1 })}
              displayEmpty
            >
              <MenuItem value="">All levels</MenuItem>
              {EXP_LEVELS.map((l) => (
                <MenuItem key={l.value} value={l.value}>{l.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Card>

      {/* Content */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress />
        </Box>
      ) : jobs.length === 0 ? (
        <Card sx={{ p: 6, textAlign: "center", borderRadius: 3 }}>
          <Typography color="text.secondary">No jobs match your filters.</Typography>
          <Button sx={{ mt: 2 }} variant="outlined" onClick={() => setFilters({ page: 1, limit: 10 })}>
            Clear Filters
          </Button>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {jobs.map((job) => (
            <Grid item xs={12} key={job._id}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: 3,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  border: "1px solid transparent",
                  "&:hover": {
                    borderColor: alpha(theme.palette.primary.main, 0.4),
                    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                  },
                }}
                onClick={() => setSelectedJobId(job._id)}
              >
                <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
                  <Stack direction={{ xs: "column", md: "row" }} spacing={3} alignItems={{ md: "center" }}>
                    <Avatar
                      sx={{
                        width: 56,
                        height: 56,
                        bgcolor: stringToColor(job.company),
                        color: "#fff",
                        fontWeight: 800,
                        fontSize: 22,
                      }}
                    >
                      {getInitials(job.company)}
                    </Avatar>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                        <Typography variant="h6" fontWeight={700} noWrap>{job.title}</Typography>
                        {job.status !== "open" && (
                          <Chip size="small" label="Closed" color="default" />
                        )}
                      </Stack>

                      <Stack direction="row" spacing={2} alignItems="center" color="text.secondary" sx={{ mb: 1 }}>
                        <Typography variant="body2">{job.company}</Typography>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <LocationOnIcon sx={{ fontSize: 14 }} />
                          <Typography variant="body2">{job.location}</Typography>
                        </Stack>
                        <Typography variant="body2">· {timeAgo(job.createdAt)}</Typography>
                      </Stack>

                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        <Chip size="small" label={JOB_TYPE_LABELS[job.type]} variant="outlined" />
                        <Chip size="small" label={EXP_LABELS[job.experienceLevel]} variant="outlined" />
                        {job.skills.slice(0, 3).map((s) => (
                          <Chip
                            key={s}
                            size="small"
                            label={s}
                            sx={{
                              bgcolor: alpha(theme.palette.primary.main, 0.08),
                              color: "primary.main",
                              border: "none",
                            }}
                          />
                        ))}
                        {job.skills.length > 3 && (
                          <Chip size="small" label={`+${job.skills.length - 3}`} />
                        )}
                      </Stack>
                    </Box>

                    <Box sx={{ textAlign: { xs: "left", md: "right" }, minWidth: 140 }}>
                      <Typography variant="caption" color="text.secondary">Salary</Typography>
                      <Typography variant="h6" sx={{ color: "primary.main", fontWeight: 700 }}>
                        {formatSalary(job)}
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{ mt: 1 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedJobId(job._id);
                        }}
                      >
                        View & Apply
                      </Button>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Stack direction="row" justifyContent="center" sx={{ mt: 5 }}>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              disabled={(filters.page ?? 1) <= 1}
              onClick={() => updateFilters({ page: (filters.page ?? 1) - 1 })}
            >
              Prev
            </Button>
            {/* Simple Page Display */}
            <Chip label={`Page ${filters.page} of ${totalPages}`} sx={{ alignSelf: "center" }} />
            <Button
              variant="outlined"
              disabled={(filters.page ?? 1) >= totalPages}
              onClick={() => updateFilters({ page: (filters.page ?? 1) + 1 })}
            >
              Next
            </Button>
          </Stack>
        </Stack>
      )}

      {/* Modals */}
      {selectedJobId && (
        <JobDetailModal
          jobId={selectedJobId}
          onClose={() => setSelectedJobId(null)}
          onApplySuccess={(msg) => {
            showToast(msg, "success");
            loadJobs(filters); // Refresh list to update count if needed
          }}
          onApplyError={(msg) => showToast(msg, "error")}
          onLoadError={(msg) => showToast(msg, "error")}
        />
      )}

      {/* Snackbar Toasts */}
      <Snackbar
        open={!!toast}
        autoHideDuration={4000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={toast?.type} onClose={() => setToast(null)} variant="filled">
          {toast?.msg}
        </Alert>
      </Snackbar>
    </Container>
  );
}