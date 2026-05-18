import { Response, NextFunction } from "express";
import { AuthenticatedRequest, Role } from "../types";
import { verifyToken } from "../utils/helpers";
import { AppError } from "../utils/AppError";
import User from "../models/User";

// ─── Authenticate ─────────────────────────────────────────────────────────────
export const authenticate = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // Check Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    // Fallback: check cookie
    else if (req.cookies?.token) {
      token = req.cookies.token as string;
    }

    if (!token) {
      return next(new AppError("Authentication required. Please log in.", 401));
    }

    const decoded = verifyToken(token);

    const user = await User.findById(decoded.id).select(
      "_id name email role isActive"
    );

    if (!user) {
      return next(new AppError("User no longer exists.", 401));
    }

    if (!user.isActive) {
      return next(new AppError("Your account has been deactivated.", 403));
    }

    req.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    next();
  } catch {
    next(new AppError("Invalid or expired token. Please log in again.", 401));
  }
};

// ─── Authorize (Role Guard) ───────────────────────────────────────────────────
export const authorize = (...roles: Role[]) => {
  return (
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction
  ): void => {
    if (!req.user) {
      return next(new AppError("Authentication required.", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          `Access denied. Required role: ${roles.join(" or ")}.`,
          403
        )
      );
    }

    next();
  };
};