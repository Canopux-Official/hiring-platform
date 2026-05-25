import { Response, NextFunction } from "express";
import { AuthenticatedRequest, RecruiterApprovalStatus, Role } from "../types";
import User from "../models/User";
import Job from "../models/Job";
import Application from "../models/Application";
import { AppError } from "../utils/AppError";
import { successResponse, getPagination } from "../utils/helpers";

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
export const getDashboardStats = async (
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const [
      totalUsers,
      totalJobs,
      totalApplications,
      usersByRole,
      jobsByStatus,
      applicationsByStatus,
      recentJobs,
      recentApplications,
    ] = await Promise.all([
      User.countDocuments(),
      Job.countDocuments(),
      Application.countDocuments(),
      User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]),
      Job.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      Application.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      Job.find().sort({ createdAt: -1 }).limit(5).populate("postedBy", "name"),
      Application.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("applicant", "name email")
        .populate("job", "title company"),
    ]);

    res.status(200).json(
      successResponse("Dashboard stats", {
        totals: { users: totalUsers, jobs: totalJobs, applications: totalApplications },
        usersByRole,
        jobsByStatus,
        applicationsByStatus,
        recentJobs,
        recentApplications,
      })
    );
  } catch (err) {
    next(err);
  }
};

// ─── Get All Users ────────────────────────────────────────────────────────────
export const getAllUsers = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page, limit, role, search } = req.query as Record<string, string>;
    const { skip, limit: take, page: currentPage } = getPagination(page, limit);

    const filter: Record<string, unknown> = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(take),
      User.countDocuments(filter),
    ]);

    res.status(200).json(
      successResponse("Users fetched", {
        items: users,
        total,
        page: currentPage,
        limit: take,
        totalPages: Math.ceil(total / take),
      })
    );
  } catch (err) {
    next(err);
  }
};

// ─── Toggle User Active Status ────────────────────────────────────────────────
export const toggleUserStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError("User not found.", 404));

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json(
      successResponse(
        `User ${user.isActive ? "activated" : "deactivated"} successfully`,
        { isActive: user.isActive }
      )
    );
  } catch (err) {
    next(err);
  }
};

// ─── Get All Applications (Admin) ─────────────────────────────────────────────
export const getAllApplications = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page, limit, status } = req.query as Record<string, string>;
    const { skip, limit: take, page: currentPage } = getPagination(page, limit);

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;

    const [applications, total] = await Promise.all([
      Application.find(filter)
        .populate("applicant", "name email")
        .populate("job", "title company")
        .populate("recruiter", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(take),
      Application.countDocuments(filter),
    ]);

    res.status(200).json(
      successResponse("Applications fetched", {
        items: applications,
        total,
        page: currentPage,
        limit: take,
        totalPages: Math.ceil(total / take),
      })
    );
  } catch (err) {
    next(err);
  }
};

// ─── Delete User (Admin) ──────────────────────────────────────────────────────
export const deleteUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return next(new AppError("User not found.", 404));

    res.status(200).json(successResponse("User deleted successfully"));
  } catch (err) {
    next(err);
  }
};



// ─── Get Pending Recruiters ───────────────────────────────────────────────────
export const getPendingRecruiters = async (
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const pendingRecruiters = await User.find({
      role: Role.RECRUITER,
      approvalStatus: RecruiterApprovalStatus.PENDING,
    }).sort({ createdAt: -1 });

    res.status(200).json(
      successResponse("Pending recruiters fetched", {
        items: pendingRecruiters,
        total: pendingRecruiters.length,
      })
    );
  } catch (err) {
    next(err);
  }
};

// ─── Approve or Reject Recruiter ──────────────────────────────────────────────
export const reviewRecruiter = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { action } = req.body; // "approve" | "reject"

    if (!["approve", "reject"].includes(action)) {
      return next(new AppError("Action must be 'approve' or 'reject'.", 400));
    }

    const user = await User.findOne({
      _id: req.params.id,
      role: Role.RECRUITER,
    });

    if (!user) return next(new AppError("Recruiter not found.", 404));

    if (user.approvalStatus !== RecruiterApprovalStatus.PENDING) {
      return next(new AppError("This recruiter has already been reviewed.", 400));
    }

    if (action === "approve") {
      user.approvalStatus = RecruiterApprovalStatus.APPROVED;
      user.isActive = true;             // activate account on approval
    } else {
      user.approvalStatus = RecruiterApprovalStatus.REJECTED;
      user.isActive = false;            // keep inactive on rejection
    }

    await user.save();

    res.status(200).json(
      successResponse(
        `Recruiter ${action === "approve" ? "approved" : "rejected"} successfully`,
        { approvalStatus: user.approvalStatus, isActive: user.isActive }
      )
    );
  } catch (err) {
    next(err);
  }
};



// ─── Get All Jobs by a Recruiter (Admin) ──────────────────────────────────────
export const getRecruiterJobs = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { recruiterId } = req.params;

    const recruiter = await User.findOne({
      _id: recruiterId,
      role: Role.RECRUITER,
    });
    if (!recruiter) return next(new AppError("Recruiter not found.", 404));

    const { page, limit } = req.query as Record<string, string>;
    const { skip, limit: take, page: currentPage } = getPagination(page, limit);

    const [jobs, total] = await Promise.all([
      Job.find({ postedBy: recruiterId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(take),
      Job.countDocuments({ postedBy: recruiterId }),
    ]);

    res.status(200).json(
      successResponse("Recruiter jobs fetched", {
        recruiter: { _id: recruiter._id, name: recruiter.name, email: recruiter.email },
        items: jobs,
        total,
        page: currentPage,
        limit: take,
        totalPages: Math.ceil(total / take),
      })
    );
  } catch (err) {
    next(err);
  }
};

// ─── Edit a Job Posted by a Recruiter (Admin) ─────────────────────────────────
export const adminUpdateJob = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { recruiterId, jobId } = req.params;

    const job = await Job.findOne({ _id: jobId, postedBy: recruiterId });
    if (!job) return next(new AppError("Job not found for this recruiter.", 404));

    const updated = await Job.findByIdAndUpdate(jobId, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(successResponse("Job updated by admin", updated));
  } catch (err) {
    next(err);
  }
};

// ─── Delete a Job Posted by a Recruiter (Admin) ───────────────────────────────
export const adminDeleteJob = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { recruiterId, jobId } = req.params;

    const job = await Job.findOne({ _id: jobId, postedBy: recruiterId });
    if (!job) return next(new AppError("Job not found for this recruiter.", 404));

    await Promise.all([
      Job.findByIdAndDelete(jobId),
      Application.deleteMany({ job: jobId }),
    ]);

    res.status(200).json(successResponse("Job and its applications deleted by admin"));
  } catch (err) {
    next(err);
  }
};

// ─── Get All Applications by a Job Seeker (Admin) ─────────────────────────────
export const getSeekerApplications = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { seekerId } = req.params;

    const seeker = await User.findOne({
      _id: seekerId,
      role: Role.JOB_SEEKER,
    });
    if (!seeker) return next(new AppError("Job seeker not found.", 404));

    const { page, limit, status } = req.query as Record<string, string>;
    const { skip, limit: take, page: currentPage } = getPagination(page, limit);

    const filter: Record<string, unknown> = { applicant: seekerId };
    if (status) filter.status = status;

    const [applications, total] = await Promise.all([
      Application.find(filter)
        .populate("job", "title company location type status")
        .populate("recruiter", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(take),
      Application.countDocuments(filter),
    ]);

    res.status(200).json(
      successResponse("Seeker applications fetched", {
        seeker: { _id: seeker._id, name: seeker.name, email: seeker.email },
        items: applications,
        total,
        page: currentPage,
        limit: take,
        totalPages: Math.ceil(total / take),
      })
    );
  } catch (err) {
    next(err);
  }
};

// ─── Delete/Withdraw an Application (Admin) ───────────────────────────────────
export const adminDeleteApplication = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { seekerId, applicationId } = req.params;

    const application = await Application.findOne({
      _id: applicationId,
      applicant: seekerId,
    });
    if (!application) return next(new AppError("Application not found for this seeker.", 404));

    await Promise.all([
      application.deleteOne(),
      Job.findByIdAndUpdate(application.job, { $inc: { applicationsCount: -1 } }),
    ]);

    res.status(200).json(successResponse("Application deleted by admin"));
  } catch (err) {
    next(err);
  }
};