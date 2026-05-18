import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types";
import JobSeekerProfile from "../models/JobSeekerProfile";
import User from "../models/User";
import { AppError } from "../utils/AppError";
import { successResponse } from "../utils/helpers";

// ─── Get My Profile (Job Seeker) ──────────────────────────────────────────────
export const getMyProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const profile = await JobSeekerProfile.findOne({
      user: req.user!._id,
    }).populate("user", "name email phone avatar");

    if (!profile) return next(new AppError("Profile not found.", 404));

    res.status(200).json(successResponse("Profile fetched", profile));
  } catch (err) {
    next(err);
  }
};

// ─── Update My Profile ────────────────────────────────────────────────────────
export const updateMyProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const profile = await JobSeekerProfile.findOneAndUpdate(
      { user: req.user!._id },
      { $set: req.body },
      { new: true, runValidators: true, upsert: true }
    );

    res.status(200).json(successResponse("Profile updated", profile));
  } catch (err) {
    next(err);
  }
};

// ─── Update User Info (name, phone, avatar) ───────────────────────────────────
export const updateUserInfo = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const allowed = ["name", "phone", "avatar"];
    const updates = Object.fromEntries(
      Object.entries(req.body).filter(([k]) => allowed.includes(k))
    );

    const user = await User.findByIdAndUpdate(req.user!._id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(successResponse("User info updated", user));
  } catch (err) {
    next(err);
  }
};

// ─── Get Any Profile by User ID (Admin / Recruiter) ──────────────────────────
export const getProfileById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const profile = await JobSeekerProfile.findOne({
      user: req.params.userId,
    }).populate("user", "name email phone avatar");

    if (!profile) return next(new AppError("Profile not found.", 404));

    res.status(200).json(successResponse("Profile fetched", profile));
  } catch (err) {
    next(err);
  }
};