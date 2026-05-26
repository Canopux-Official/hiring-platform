// import { Response, NextFunction } from "express";
// import { AuthenticatedRequest, RecruiterApprovalStatus } from "../types";
// import User from "../models/User";
// import JobSeekerProfile from "../models/JobSeekerProfile";
// import { AppError } from "../utils/AppError";
// import {
//   generateToken,
//   sendTokenCookie,
//   successResponse,
// } from "../utils/helpers";

// // ─── Register ─────────────────────────────────────────────────────────────────
// export const register = async (
//   req: AuthenticatedRequest,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const { name, email, password, role, phone } = req.body;

//     const existing = await User.findOne({ email });
//     if (existing) {
//       return next(new AppError("Email already registered.", 409));
//     }

//     // ✅ Recruiters start as inactive + pending approval
//     const isRecruiter = role === "recruiter";
//     const user = await User.create({
//       name,
//       email,
//       password,
//       role,
//       phone,
//       isActive: !isRecruiter,                                          // inactive until approved
//       approvalStatus: isRecruiter
//         ? RecruiterApprovalStatus.PENDING
//         : null,
//     });

//     // Auto-create empty profile for job seekers
//     if (user.role === "job_seeker") {
//       await JobSeekerProfile.create({ user: user._id });
//     }

//     // Recruiters get a pending response — no token issued
//     if (isRecruiter) {
//       res.status(201).json(
//         successResponse(
//           "Registration successful. Your account is pending admin approval. You will be able to login once approved.",
//           { pendingApproval: true }
//         )
//       );
//       return;
//     }

//     const token = generateToken(user._id, user.role, user.email);
//     sendTokenCookie(res, token);

//     res.status(201).json(
//       successResponse("Registration successful", { token, user })
//     );
//   } catch (err) {
//     next(err);
//   }
// };

// // ─── Login ────────────────────────────────────────────────────────────────────
// export const login = async (
//   req: AuthenticatedRequest,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const { email, password, role } = req.body;

//     const user = await User.findOne({ email }).select("+password +approvalStatus");
//     if (!user || !(await user.comparePassword(password))) {
//       return next(new AppError("Invalid email or password.", 401));
//     }

//     if (role && user.role !== role) {
//       return next(new AppError("Invalid email or password.", 401));
//     }

//     // Block pending recruiters
//     if (
//       user.role === "recruiter" &&
//       user.approvalStatus === RecruiterApprovalStatus.PENDING
//     ) {
//       return next(
//         new AppError("Your account is pending admin approval.", 403)
//       );
//     }

//     // Block rejected recruiters
//     if (
//       user.role === "recruiter" &&
//       user.approvalStatus === RecruiterApprovalStatus.REJECTED
//     ) {
//       return next(
//         new AppError("Your recruiter application was rejected. Contact support.", 403)
//       );
//     }

//     if (!user.isActive) {
//       return next(new AppError("Account deactivated. Contact support.", 403));
//     }

//     const token = generateToken(user._id, user.role, user.email);
//     sendTokenCookie(res, token);

//     const userObj = user.toJSON();
//     res.status(200).json(successResponse("Login successful", { token, user: userObj }));
//   } catch (err) {
//     next(err);
//   }
// };

// // ─── Logout ───────────────────────────────────────────────────────────────────
// export const logout = (_req: AuthenticatedRequest, res: Response): void => {
//   res.cookie("token", "", { maxAge: 0, httpOnly: true });
//   res.status(200).json(successResponse("Logged out successfully"));
// };

// // ─── Get Current User (me) ────────────────────────────────────────────────────
// export const getMe = async (
//   req: AuthenticatedRequest,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const user = await User.findById(req.user?._id);
//     if (!user) return next(new AppError("User not found.", 404));
//     res.status(200).json(successResponse("User fetched", user));
//   } catch (err) {
//     next(err);
//   }
// };

// // ─── Change Password ──────────────────────────────────────────────────────────
// export const changePassword = async (
//   req: AuthenticatedRequest,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const { currentPassword, newPassword } = req.body;

//     const user = await User.findById(req.user?._id).select("+password");
//     if (!user) return next(new AppError("User not found.", 404));

//     if (!(await user.comparePassword(currentPassword))) {
//       return next(new AppError("Current password is incorrect.", 401));
//     }

//     user.password = newPassword;
//     await user.save();

//     const token = generateToken(user._id, user.role, user.email);
//     sendTokenCookie(res, token);

//     res.status(200).json(successResponse("Password changed successfully", { token }));
//   } catch (err) {
//     next(err);
//   }
// };

import { Response, NextFunction } from "express";
import { AuthenticatedRequest, RecruiterApprovalStatus } from "../types";
import User from "../models/User";
import JobSeekerProfile from "../models/JobSeekerProfile";
import { AppError } from "../utils/AppError";
import {
  generateToken,
  sendTokenCookie,
  successResponse,
} from "../utils/helpers";

// ─── Register ─────────────────────────────────────────────────────────────────
export const register = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, role, phone } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return next(new AppError("Email already registered.", 409));
    }

    const isRecruiter = role === "recruiter";
    const isJobSeeker = role === "job_seeker";
    const requiresApproval = isRecruiter || isJobSeeker;

    const user = await User.create({
      name,
      email,
      password,
      role,
      phone,
      isActive: !requiresApproval,
      approvalStatus: requiresApproval
        ? RecruiterApprovalStatus.PENDING
        : null,
    });

    if (isJobSeeker) {
      await JobSeekerProfile.create({ user: user._id });
    }

    if (requiresApproval) {
      res.status(201).json(
        successResponse(
          "Registration successful. Your account is pending admin approval. You will be able to login once approved.",
          { pendingApproval: true }
        )
      );
      return;
    }

    const token = generateToken(user._id, user.role, user.email);
    sendTokenCookie(res, token);

    res.status(201).json(
      successResponse("Registration successful", { token, user })
    );
  } catch (err) {
    next(err);
  }
};

// ─── Login ────────────────────────────────────────────────────────────────────
export const login = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email }).select("+password +approvalStatus");
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError("Invalid email or password.", 401));
    }

    if (role && user.role !== role) {
      return next(new AppError("Invalid email or password.", 401));
    }

    // Recruiter approval checks
    if (
      user.role === "recruiter" &&
      user.approvalStatus === RecruiterApprovalStatus.PENDING
    ) {
      return next(new AppError("Your account is pending admin approval.", 403));
    }

    if (
      user.role === "recruiter" &&
      user.approvalStatus === RecruiterApprovalStatus.REJECTED
    ) {
      return next(
        new AppError("Your recruiter application was rejected. Contact support.", 403)
      );
    }

    // Job seeker approval checks
    if (
      user.role === "job_seeker" &&
      user.approvalStatus === RecruiterApprovalStatus.PENDING
    ) {
      return next(new AppError("Your account is pending admin approval.", 403));
    }

    if (
      user.role === "job_seeker" &&
      user.approvalStatus === RecruiterApprovalStatus.REJECTED
    ) {
      return next(
        new AppError("Your account was rejected by admin. Contact support.", 403)
      );
    }

    if (!user.isActive) {
      return next(new AppError("Account deactivated. Contact support.", 403));
    }

    const token = generateToken(user._id, user.role, user.email);
    sendTokenCookie(res, token);

    const userObj = user.toJSON();
    res.status(200).json(successResponse("Login successful", { token, user: userObj }));
  } catch (err) {
    next(err);
  }
};


// ─── Logout ───────────────────────────────────────────────────────────────────
export const logout = (_req: AuthenticatedRequest, res: Response): void => {
  const isProd = process.env.NODE_ENV === "production"; // ← CHANGED
  res.cookie("token", "", {
    maxAge: 0,
    httpOnly: true,
    secure: isProd,                    // ← CHANGED
    sameSite: isProd ? "none" : "lax", // ← CHANGED: must match how cookie was set
  });
  res.status(200).json(successResponse("Logged out successfully"));
};

// ─── Get Current User (me) ────────────────────────────────────────────────────
export const getMe = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) return next(new AppError("User not found.", 404));
    res.status(200).json(successResponse("User fetched", user));
  } catch (err) {
    next(err);
  }
};

// ─── Change Password ──────────────────────────────────────────────────────────
export const changePassword = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id).select("+password");
    if (!user) return next(new AppError("User not found.", 404));

    if (!(await user.comparePassword(currentPassword))) {
      return next(new AppError("Current password is incorrect.", 401));
    }

    user.password = newPassword;
    await user.save();

    const token = generateToken(user._id, user.role, user.email);
    sendTokenCookie(res, token);

    res.status(200).json(successResponse("Password changed successfully", { token }));
  } catch (err) {
    next(err);
  }
};