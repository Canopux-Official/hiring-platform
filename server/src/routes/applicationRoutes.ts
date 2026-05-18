import { Router } from "express";
import {
  getMyApplications,
  getApplication,
  updateApplicationStatus,
  withdrawApplication,
} from "../controllers/applicationController";
import { authenticate, authorize } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { updateApplicationStatusSchema } from "../utils/validators";
import { Role } from "../types";

const router = Router();

// Job seeker: view own applications
router.get(
  "/my",
  authenticate,
  authorize(Role.JOB_SEEKER),
  getMyApplications
);

// Job seeker: withdraw a pending application
router.delete(
  "/:id/withdraw",
  authenticate,
  authorize(Role.JOB_SEEKER),
  withdrawApplication
);

// Shared: get single application (applicant, recruiter, admin)
router.get("/:id", authenticate, getApplication);

// Recruiter / Admin: update status
router.patch(
  "/:id/status",
  authenticate,
  authorize(Role.RECRUITER, Role.ADMIN),
  validate(updateApplicationStatusSchema),
  updateApplicationStatus
);

export default router;