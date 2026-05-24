// utils/auth.utils.ts

import type { Role, FormState } from "../types/auth.types";

export function emptyForm(): FormState {
  return {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  };
}

export function roleHome(role: Role): string {
  if (role === "admin") return "/admin";
  if (role === "recruiter") return "/dashboard";
  return "/seeker";
}

export function validatePassword(pwd: string): string | null {
  if (pwd.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(pwd)) return "Must contain an uppercase letter.";
  if (!/[0-9]/.test(pwd)) return "Must contain a number.";
  return null;
}

export function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}