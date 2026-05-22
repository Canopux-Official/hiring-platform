// api/auth.ts
// All auth-related API calls. Backend uses cookies (httpOnly), so credentials: "include" is critical.

import type { Role } from "../lib/auth";

const BASE = "/api/auth";

export interface ApiUser {
  email: string;
  name: string;
  role: Role;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  user: ApiUser;
}

export interface ApiResult<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

// ─── helpers ─────────────────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResult<T>> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      ...options,
      credentials: "include", // send & receive cookies
      headers: {
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
      },
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      // Try to surface a message from whatever shape the backend returns
      const message =
        json?.message ??
        json?.error ??
        json?.errors?.[0]?.message ??
        `Request failed (${res.status})`;
      return { ok: false, error: message };
    }

    // Backend wraps data in { data: { token, user } } via successResponse()
    return { ok: true, data: (json?.data ?? json) as T };
  } catch (err) {
    return { ok: false, error: "Network error – please try again." };
  }
}

// ─── Auth endpoints ───────────────────────────────────────────────────────────

/** POST /auth/register */
export async function apiRegister(payload: {
  name: string;
  email: string;
  password: string;
  role: Role;
  phone?: string;
}): Promise<ApiResult<AuthResponse>> {
  return request<AuthResponse>("/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** POST /auth/login */
export async function apiLogin(payload: {
  email: string;
  password: string;
  role: Role;
}): Promise<ApiResult<AuthResponse>> {
  console.log("Logging in with payload:", payload);
  return request<AuthResponse>("/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** POST /auth/logout */
export async function apiLogout(): Promise<ApiResult<void>> {
  return request<void>("/logout", { method: "POST" });
}

/** GET /auth/me */
export async function apiMe(): Promise<ApiResult<ApiUser>> {
  return request<ApiUser>("/me");
}

/** PATCH /auth/change-password */
export async function apiChangePassword(payload: {
  currentPassword: string;
  newPassword: string;
}): Promise<ApiResult<void>> {
  return request<void>("/change-password", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}