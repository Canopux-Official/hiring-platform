import { Router } from "express";
import {
  getDashboardStats,
  getAllUsers,
  toggleUserStatus,
  getAllApplications,
  deleteUser,
  reviewRecruiter,
  getPendingRecruiters,
} from "../controllers/adminController";
import { authenticate, authorize } from "../middleware/auth";
import { Role } from "../types";

const router = Router();

// All admin routes require authentication + admin role
router.use(authenticate, authorize(Role.ADMIN));

router.get("/dashboard", getDashboardStats);
router.get("/users", getAllUsers);
router.patch("/users/:id/toggle-status", toggleUserStatus);
router.delete("/users/:id", deleteUser);
router.get("/applications", getAllApplications);

// new recruiter approval routes
router.get("/recruiters/pending", getPendingRecruiters);
router.patch("/recruiters/:id/review", reviewRecruiter);

export default router;