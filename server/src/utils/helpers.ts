import jwt from "jsonwebtoken";
import { Response } from "express";
import { JwtPayload, ApiResponse, Role } from "../types";
import { Types } from "mongoose";

// ─── JWT ──────────────────────────────────────────────────────────────────────
export const generateToken = (
  id: Types.ObjectId | string,
  role: Role,
  email: string
): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not configured");

  return jwt.sign({ id: id.toString(), role, email } as JwtPayload, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): JwtPayload => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not configured");
  return jwt.verify(token, secret) as JwtPayload;
};

// ─── HTTP Cookie ──────────────────────────────────────────────────────────────
export const sendTokenCookie = (res: Response, token: string): void => {
  const days = parseInt(process.env.JWT_COOKIE_EXPIRES_IN ?? "7", 10);
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: days * 24 * 60 * 60 * 1000,
  });
};

// ─── Response Helpers ─────────────────────────────────────────────────────────
export const successResponse = <T>(
  message: string,
  data?: T
): ApiResponse<T> => ({ success: true, message, data });

export const errorResponse = (
  message: string,
  errors?: unknown
): ApiResponse => ({ success: false, message, errors });

// ─── Pagination ───────────────────────────────────────────────────────────────
export const getPagination = (
  page: string | undefined,
  limit: string | undefined
): { skip: number; limit: number; page: number } => {
  const parsedPage = Math.max(1, parseInt(page ?? "1", 10));
  const parsedLimit = Math.min(100, Math.max(1, parseInt(limit ?? "10", 10)));
  return {
    page: parsedPage,
    limit: parsedLimit,
    skip: (parsedPage - 1) * parsedLimit,
  };
};