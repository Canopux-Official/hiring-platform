import { Response, NextFunction } from "express";
import { AuthenticatedRequest, JobStatus, Role } from "../types";
import Job from "../models/Job";
import Application from "../models/Application";
import { AppError } from "../utils/AppError";
import { successResponse, getPagination } from "../utils/helpers";

// ─── Create Job (Recruiter) ───────────────────────────────────────────────────
export const createJob = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const job = await Job.create({
      ...req.body,
      postedBy: req.user!._id,
    });

    res.status(201).json(successResponse("Job posted successfully", job));
  } catch (err) {
    next(err);
  }
};

// ─── Get All Open Jobs (Public / Job Seeker) ──────────────────────────────────
export const getJobs = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page, limit, search, type, experienceLevel, location, skills } =
      req.query as Record<string, string>;

    const { skip, limit: take, page: currentPage } = getPagination(page, limit);

    const filter: Record<string, unknown> = {
      status: JobStatus.OPEN,
    };

    if (search) {
      filter.$text = { $search: search };
    }
    if (type) filter.type = type;
    if (experienceLevel) filter.experienceLevel = experienceLevel;
    if (location) filter.location = new RegExp(location, "i");
    if (skills) {
      filter.skills = { $in: skills.split(",").map((s) => s.trim().toLowerCase()) };
    }

    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .populate("postedBy", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(take),
      Job.countDocuments(filter),
    ]);

    res.status(200).json(
      successResponse("Jobs fetched", {
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

// ─── Get Single Job ───────────────────────────────────────────────────────────
export const getJob = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "postedBy",
      "name email"
    );

    if (!job) return next(new AppError("Job not found.", 404));

    res.status(200).json(successResponse("Job fetched", job));
  } catch (err) {
    next(err);
  }
};

// ─── Update Job (Recruiter – own jobs only) ───────────────────────────────────
export const updateJob = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return next(new AppError("Job not found.", 404));

    // Recruiters can only edit their own jobs; admins can edit any
    if (
      req.user!.role === Role.RECRUITER &&
      job.postedBy.toString() !== req.user!._id.toString()
    ) {
      return next(new AppError("You can only update your own job postings.", 403));
    }

    const updated = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(successResponse("Job updated", updated));
  } catch (err) {
    next(err);
  }
};

// ─── Delete Job (Recruiter – own jobs / Admin – any) ─────────────────────────
export const deleteJob = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return next(new AppError("Job not found.", 404));

    if (
      req.user!.role === Role.RECRUITER &&
      job.postedBy.toString() !== req.user!._id.toString()
    ) {
      return next(new AppError("You can only delete your own job postings.", 403));
    }

    await Promise.all([
      Job.findByIdAndDelete(req.params.id),
      Application.deleteMany({ job: req.params.id }),
    ]);

    res.status(200).json(successResponse("Job deleted successfully"));
  } catch (err) {
    next(err);
  }
};

// ─── Get My Jobs (Recruiter) ──────────────────────────────────────────────────
export const getMyJobs = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page, limit } = req.query as Record<string, string>;
    const { skip, limit: take, page: currentPage } = getPagination(page, limit);

    const [jobs, total] = await Promise.all([
      Job.find({ postedBy: req.user!._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(take),
      Job.countDocuments({ postedBy: req.user!._id }),
    ]);

    res.status(200).json(
      successResponse("My jobs fetched", {
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