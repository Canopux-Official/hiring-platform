import { Response, NextFunction } from "express";
import { AuthenticatedRequest, JobStatus, Role } from "../types";
import Job from "../models/Job";
import Application from "../models/Application";
import { AppError } from "../utils/AppError";
import { successResponse, getPagination } from "../utils/helpers";
import JobSeekerProfile from "../models/JobSeekerProfile";
import mongoose from "mongoose";

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
// ─── Get My Jobs (Recruiter) ──────────────────────────────────────────────────
export const getJobs = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      page, limit, search, type, experienceLevel,
      location, skills, category, status, deadlineBefore,
    } = req.query as Record<string, string>;

    const { skip, limit: take, page: currentPage } = getPagination(page, limit);

    const filter: Record<string, unknown> = {};

    // Default to OPEN unless a specific status is requested
    filter.status = status ? status : JobStatus.OPEN;

    if (search) filter.$text = { $search: search };
    if (type) filter.type = type;
    if (experienceLevel) filter.experienceLevel = experienceLevel;
    if (location) filter.location = new RegExp(location, "i");
    if (category) filter.category = category;
    if (deadlineBefore) filter.applicationDeadline = { $lte: new Date(deadlineBefore) };
    if (skills) {
      filter.skills = {
        $in: skills.split(",").map((s) => s.trim().toLowerCase()),
      };
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




// ─── Get Recommended Jobs (Job Seeker) ───────────────────────────────────────
export const getRecommendedJobs = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page, limit } = req.query as Record<string, string>;
    const { skip, limit: take, page: currentPage } = getPagination(page, limit);

    // Fetch the seeker's profile to get their skills
    const profile = await JobSeekerProfile.findOne({
      user: req.user!._id,
    }).select("skills");

    if (!profile || profile.skills.length === 0) {
      res.status(200).json(
        successResponse("Recommended jobs fetched", {
          items: [],
          total: 0,
          page: currentPage,
          limit: take,
          totalPages: 0,
        })
      );
      return;
    }

    const seekerSkills = profile.skills.map((s) => s.trim().toLowerCase());

    // Count how many of the seeker's skills each job matches
    const [jobs, total] = await Promise.all([
      Job.aggregate([
        {
          $match: {
            status: JobStatus.OPEN,
            skills: { $in: seekerSkills },
          },
        },
        {
          $addFields: {
            matchedSkills: {
              $size: {
                $ifNull: [
                  {
                    $filter: {
                      input: "$skills",
                      as: "skill",
                      cond: { $in: ["$$skill", seekerSkills] },
                    },
                  },
                  [],
                ],
              },
            },
          },
        },
        {
          $addFields: {
            matchScore: {
              $multiply: [
                { $divide: ["$matchedSkills", { $size: "$skills" }] },
                100,
              ],
            },
          },
        },
        { $sort: { matchScore: -1, createdAt: -1 } },
        { $skip: skip },
        { $limit: take },
      ]),
      Job.countDocuments({
        status: JobStatus.OPEN,
        skills: { $in: seekerSkills },
      }),
    ]);

    res.status(200).json(
      successResponse("Recommended jobs fetched", {
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





// ─── Get Recruiter Stats ──────────────────────────────────────────────────────
export const getRecruiterStats = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const recruiterId = req.user!._id;

    const [totalJobs, totalApplications, pipeline] = await Promise.all([
      Job.countDocuments({ postedBy: recruiterId }),
      Application.countDocuments({ recruiter: recruiterId }),
      Application.aggregate([
        { $match: { recruiter: new mongoose.Types.ObjectId(String(recruiterId)) } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
    ]);

    console.log("totalJobs:", totalJobs);
    console.log("totalApplications:", totalApplications);
    console.log("pipeline:", pipeline);

    const pipelineMap: Record<string, number> = {
      pending: 0,
      reviewed: 0,
      shortlisted: 0,
      rejected: 0,
      hired: 0,
    };
    pipeline.forEach(({ _id, count }) => {
      if (_id in pipelineMap) pipelineMap[_id] = count;
    });

    res.status(200).json(
      successResponse("Recruiter stats fetched", {
        totalJobs,
        totalApplications,
        pipeline: pipelineMap,
      })
    );
  } catch (err) {
    next(err);
  }
};