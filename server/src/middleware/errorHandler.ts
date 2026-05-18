import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { errorResponse } from "../utils/helpers";

// ─── Cast Error (bad MongoDB ObjectId) ───────────────────────────────────────
const handleCastError = (err: { path: string; value: unknown }): AppError =>
  new AppError(`Invalid ${err.path}: ${err.value}.`, 400);

// ─── Duplicate Key Error (MongoDB 11000) ──────────────────────────────────────
const handleDuplicateKeyError = (err: {
  keyValue: Record<string, unknown>;
}): AppError => {
  const field = Object.keys(err.keyValue)[0];
  return new AppError(
    `${field} already exists. Please use a different value.`,
    409
  );
};

// ─── Mongoose Validation Error ────────────────────────────────────────────────
const handleValidationError = (err: {
  errors: Record<string, { message: string }>;
}): AppError => {
  const messages = Object.values(err.errors).map((e) => e.message);
  return new AppError(`Validation error: ${messages.join(". ")}`, 422);
};

// ─── JWT Errors ───────────────────────────────────────────────────────────────
const handleJWTError = (): AppError =>
  new AppError("Invalid token. Please log in again.", 401);

const handleJWTExpiredError = (): AppError =>
  new AppError("Token expired. Please log in again.", 401);

// ─── Main Error Handler ───────────────────────────────────────────────────────
export const globalErrorHandler = (
  err: Error & {
    statusCode?: number;
    code?: number;
    name?: string;
    path?: string;
    value?: unknown;
    keyValue?: Record<string, unknown>;
    errors?: Record<string, { message: string }>;
  },
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let error = err;

  // Normalize known error types
  if (err.name === "CastError") {
    error = handleCastError(err as { path: string; value: unknown });
  } else if (err.code === 11000) {
    error = handleDuplicateKeyError(
      err as { keyValue: Record<string, unknown> }
    );
  } else if (err.name === "ValidationError") {
    error = handleValidationError(
      err as { errors: Record<string, { message: string }> }
    );
  } else if (err.name === "JsonWebTokenError") {
    error = handleJWTError();
  } else if (err.name === "TokenExpiredError") {
    error = handleJWTExpiredError();
  }

  const appError = error as AppError;
  const statusCode = appError.statusCode ?? 500;
  const message =
    appError.isOperational || process.env.NODE_ENV === "development"
      ? appError.message
      : "Something went wrong. Please try again later.";

  if (process.env.NODE_ENV === "development") {
    console.error("💥 ERROR:", err);
  }

  res.status(statusCode).json(errorResponse(message));
};

// ─── 404 Handler ──────────────────────────────────────────────────────────────
export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
};