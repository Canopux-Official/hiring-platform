import { Response, NextFunction } from "express";
import { AuthenticatedRequest, ApplicationStatus, Role } from "../types";
import Application from "../models/Application";
import Job from "../models/Job";
import JobSeekerProfile from "../models/JobSeekerProfile";
import { AppError } from "../utils/AppError";
import { successResponse, getPagination } from "../utils/helpers";

// ─── Apply to a Job (Job Seeker) ──────────────────────────────────────────────
export const applyToJob = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return next(new AppError("Job not found.", 404));

    if (job.status !== "open") {
      return next(new AppError("This job is no longer accepting applications.", 400));
    }

    if (job.applicationDeadline && new Date() > job.applicationDeadline) {
      return next(new AppError("Application deadline has passed.", 400));
    }

    // Fetch resume from profile
    const profile = await JobSeekerProfile.findOne({ user: req.user!._id });

    const existing = await Application.findOne({
      job: req.params.jobId,
      applicant: req.user!._id,
    });
    if (existing) {
      return next(new AppError("You have already applied to this job.", 409));
    }

    const application = await Application.create({
      job: req.params.jobId,
      applicant: req.user!._id,
      recruiter: job.postedBy,
      coverLetter: req.body.coverLetter,
      resumeUrl: profile? profile.resumeUrl : req.body.resumeUrl,
      statusHistory: [
        {
          status: ApplicationStatus.PENDING,
          changedBy: req.user!._id,
          note: "Application submitted",
        },
      ],
    });

    // Increment applicationsCount on job
    await Job.findByIdAndUpdate(req.params.jobId, {
      $inc: { applicationsCount: 1 },
    });

    res.status(201).json(successResponse("Application submitted successfully", application));
  } catch (err) {
    next(err);
  }
};

// ─── Get Applications for a Job (Recruiter / Admin) ───────────────────────────
export const getJobApplications = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return next(new AppError("Job not found.", 404));

    // Recruiters can only view their own job's applications
    if (
      req.user!.role === Role.RECRUITER &&
      job.postedBy.toString() !== req.user!._id.toString()
    ) {
      return next(new AppError("Access denied.", 403));
    }

    const { page, limit, status } = req.query as Record<string, string>;
    const { skip, limit: take, page: currentPage } = getPagination(page, limit);

    const filter: Record<string, unknown> = { job: req.params.jobId };
    if (status) filter.status = status;

    const [applications, total] = await Promise.all([
      Application.find(filter)
        .populate("applicant", "name email phone avatar")
        .populate({
          path: "applicant",
          populate: { path: "_id", model: "JobSeekerProfile" },
        })
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

// ─── Get My Applications (Job Seeker) ─────────────────────────────────────────
export const getMyApplications = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page, limit, status } = req.query as Record<string, string>;
    const { skip, limit: take, page: currentPage } = getPagination(page, limit);

    const filter: Record<string, unknown> = { applicant: req.user!._id };
    if (status) filter.status = status;

    const [applications, total] = await Promise.all([
      Application.find(filter)
        .populate("job", "title company location type status")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(take),
      Application.countDocuments(filter),
    ]);

    res.status(200).json(
      successResponse("My applications fetched", {
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

// ─── Update Application Status (Recruiter) ────────────────────────────────────
export const updateApplicationStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, note } = req.body;

    const application = await Application.findById(req.params.id);
    if (!application) return next(new AppError("Application not found.", 404));

    // Ensure recruiter owns this application
    if (
      req.user!.role === Role.RECRUITER &&
      application.recruiter.toString() !== req.user!._id.toString()
    ) {
      return next(new AppError("Access denied.", 403));
    }

    application.status = status as ApplicationStatus;
    application.statusHistory.push({
      status: status as ApplicationStatus,
      changedAt: new Date(),
      changedBy: req.user!._id,
      note,
    });

    await application.save();

    res.status(200).json(successResponse("Application status updated", application));
  } catch (err) {
    next(err);
  }
};

// ─── Get Single Application ───────────────────────────────────────────────────
export const getApplication = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("job", "title company location type")
      .populate("applicant", "name email phone avatar");

    if (!application) return next(new AppError("Application not found.", 404));

    // Allow: admin, the recruiter who owns it, or the applicant
    const userId = req.user!._id.toString();
    const isAdmin = req.user!.role === Role.ADMIN;
    const isRecruiter = application.recruiter.toString() === userId;
    const isApplicant = application.applicant._id.toString() === userId;

    if (!isAdmin && !isRecruiter && !isApplicant) {
      return next(new AppError("Access denied.", 403));
    }

    res.status(200).json(successResponse("Application fetched", application));
  } catch (err) {
    next(err);
  }
};

// ─── Withdraw Application (Job Seeker) ───────────────────────────────────────
export const withdrawApplication = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      applicant: req.user!._id,
    });

    if (!application) return next(new AppError("Application not found.", 404));

    if (application.status !== ApplicationStatus.PENDING) {
      return next(
        new AppError("Only pending applications can be withdrawn.", 400)
      );
    }

    await Promise.all([
      application.deleteOne(),
      Job.findByIdAndUpdate(application.job, { $inc: { applicationsCount: -1 } }),
    ]);

    res.status(200).json(successResponse("Application withdrawn successfully"));
  } catch (err) {
    next(err);
  }
};