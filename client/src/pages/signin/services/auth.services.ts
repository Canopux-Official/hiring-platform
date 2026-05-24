// services/auth.service.ts
// All auth-related API calls. Backend uses cookies (httpOnly), so credentials: "include" is critical.

import type { Role, ApiUser, AuthResponse, ApiResult } from "../types/auth.types";

const BASE = `${import.meta.env.VITE_API_URL}/api/auth`;
console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);

// ─── helpers ─────────────────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResult<T>> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
      },
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      const message =
        json?.message ??
        json?.error ??
        json?.errors?.[0]?.message ??
        `Request failed (${res.status})`;
      return { ok: false, error: message };
    }

    return { ok: true, data: (json?.data ?? json) as T };
  } catch {
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