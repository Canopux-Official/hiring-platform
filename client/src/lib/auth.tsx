// lib/auth.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  apiLogin,
  apiLogout,
  apiMe,
  apiRegister,
  type ApiUser,
} from "../api/auth";

export type Role = "admin" | "recruiter" | "job_seeker";

export interface User {
  email: string;
  name: string;
  role: Role;
  phone?: string;
  /** Initials for the avatar, derived client-side */
  avatar: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: Role;
  phone?: string;
}

interface AuthCtx {
  user: User | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string,
    role: Role
  ) => Promise<{ ok: boolean; error?: string }>;
  register: (
    payload: RegisterPayload
  ) => Promise<{ ok: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

// ─── Storage key (UI state only – the real session lives in the cookie) ───────
const STORAGE = "RagasHire.auth.v1";

// ─── helpers ──────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function toUser(api: ApiUser): User {
  return { ...api, avatar: initials(api.name) };
}

// ─── Context ──────────────────────────────────────────────────────────────────

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  // Start loading=true so we can rehydrate from the cookie via /me before
  // rendering protected routes.
  const [loading, setLoading] = useState(true);

  // On mount: restore UI state from localStorage, then confirm with /me so
  // that a stale / expired cookie is caught early.
  useEffect(() => {
    const hydrate = async () => {
      try {
        const raw = localStorage.getItem(STORAGE);
        if (raw) {
          // Optimistic restore so the UI doesn't flash
          setUser(JSON.parse(raw) as User);
        }

        const result = await apiMe();
        if (result.ok && result.data) {
          const u = toUser(result.data);
          setUser(u);
          localStorage.setItem(STORAGE, JSON.stringify(u));
        } else {
          // Cookie is gone / expired – clear local state too
          setUser(null);
          localStorage.removeItem(STORAGE);
        }
      } catch {
        // Offline or server down – keep the optimistic local state
      } finally {
        setLoading(false);
      }
    };

    hydrate();
  }, []);

  // ── signIn ────────────────────────────────────────────────────────────────
  const signIn = async (email: string, password: string, role: Role) => {
    const result = await apiLogin({ email, password, role });
    if (!result.ok || !result.data) {
      return { ok: false, error: result.error ?? "Sign in failed." };
    }
    const u = toUser(result.data.user);
    setUser(u);
    localStorage.setItem(STORAGE, JSON.stringify(u));
    return { ok: true };
  };

  // ── register ──────────────────────────────────────────────────────────────
  const register = async (payload: RegisterPayload) => {
    const result = await apiRegister(payload);
    if (!result.ok || !result.data) {
      return { ok: false, error: result.error ?? "Registration failed." };
    }
    const u = toUser(result.data.user);
    setUser(u);
    localStorage.setItem(STORAGE, JSON.stringify(u));
    return { ok: true };
  };

  // ── signOut ───────────────────────────────────────────────────────────────
  const signOut = async () => {
    await apiLogout();
    setUser(null);
    localStorage.removeItem(STORAGE);
  };

  return (
    <Ctx.Provider value={{ user, loading, signIn, register, signOut }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used inside AuthProvider");
  return c;
}

// Demo credentials kept for convenience (autofill button)
export const demoCredentials = {
  admin: { email: "admin@platform.com", password: "Admin@1234" },
  recruiter: { email: "recruiter@RagasHire.com", password: "Recruit@123" },
  job_seeker: { email: "jobseeker@RagasHire.com", password: "seeker@123" },
};