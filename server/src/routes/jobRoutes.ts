import { Router } from "express";
import {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
  getMyJobs,
} from "../controllers/jobController";
import {
  applyToJob,
  getJobApplications,
} from "../controllers/applicationController";
import { authenticate, authorize } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createJobSchema, updateJobSchema, applyJobSchema } from "../utils/validators";
import { Role } from "../types";

const router = Router();



// Public
router.get("/", getJobs);


//Need to create this api.
// router.get(
//   "/recommended",
//   authenticate,
//   authorize(Role.JOB_SEEKER),
//   getRecommendedJobs
// );

// Recruiter / Admin
router.post(
  "/",
  authenticate,
  authorize(Role.RECRUITER, Role.ADMIN),
  validate(createJobSchema),
  createJob
);
router.get(
  "/recruiter/my-jobs",
  authenticate,
  authorize(Role.RECRUITER, Role.ADMIN),
  getMyJobs
);
router.get("/:id", getJob);
router.patch(
  "/:id",
  authenticate,
  authorize(Role.RECRUITER, Role.ADMIN),
  validate(updateJobSchema),
  updateJob
);
router.delete(
  "/:id",
  authenticate,
  authorize(Role.RECRUITER, Role.ADMIN),
  deleteJob
);

// Applications for a job (recruiter / admin)
router.get(
  "/:jobId/applications",
  authenticate,
  authorize(Role.RECRUITER, Role.ADMIN),
  getJobApplications
);

// Apply (job seeker)
router.post(
  "/:jobId/apply",
  authenticate,
  authorize(Role.JOB_SEEKER),
  validate(applyJobSchema),
  applyToJob
);

export default router;