import { Router } from "express";
import {
  getDashboardStats,
  getAllUsers,
  toggleUserStatus,
  getAllApplications,
  deleteUser,
  reviewRecruiter,
  getPendingRecruiters,
  getRecruiterJobs,       
  adminUpdateJob,        
  adminDeleteJob,         
  getSeekerApplications,  
  adminDeleteApplication, 
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


// Recruiter detail view
router.get("/recruiters/:recruiterId/jobs", getRecruiterJobs);
router.patch("/recruiters/:recruiterId/jobs/:jobId", adminUpdateJob);
router.delete("/recruiters/:recruiterId/jobs/:jobId", adminDeleteJob);

// Job seeker detail view
router.get("/seekers/:seekerId/applications", getSeekerApplications);
router.delete("/seekers/:seekerId/applications/:applicationId", adminDeleteApplication);

export default router;