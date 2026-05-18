import { Router } from "express";
import {
  getMyProfile,
  updateMyProfile,
  updateUserInfo,
  getProfileById,
} from "../controllers/profileController";
import { authenticate, authorize } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { updateProfileSchema } from "../utils/validators";
import { Role } from "../types";

const router = Router();

router.get(
  "/me",
  authenticate,
  authorize(Role.JOB_SEEKER),
  getMyProfile
);

router.patch(
  "/me",
  authenticate,
  authorize(Role.JOB_SEEKER),
  validate(updateProfileSchema),
  updateMyProfile
);

router.patch(
  "/me/user-info",
  authenticate,
  updateUserInfo
);

// Recruiter / Admin: view any job seeker profile
router.get(
  "/:userId",
  authenticate,
  authorize(Role.RECRUITER, Role.ADMIN),
  getProfileById
);

export default router;