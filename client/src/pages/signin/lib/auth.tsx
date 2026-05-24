// lib/auth.tsx

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  apiLogin,
  apiLogout,
  apiMe,
  apiRegister,
} from "../services/auth.services";
import type { Role, User, RegisterPayload, ApiUser } from "../types/auth.types";
import { initials } from "../utils/auth.utils";

// Re-export Role so existing imports from lib/auth still work
export type { Role, User, RegisterPayload };

// ─── Context shape ────────────────────────────────────────────────────────────

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

// ─── Storage key ──────────────────────────────────────────────────────────────
const STORAGE = "RagasHire.auth.v1";

// ─── Helper ───────────────────────────────────────────────────────────────────

function toUser(api: ApiUser): User {
  return { ...api, avatar: initials(api.name) };
}

// ─── Context ──────────────────────────────────────────────────────────────────

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hydrate = async () => {
      try {
        const raw = localStorage.getItem(STORAGE);
        if (raw) setUser(JSON.parse(raw) as User);

        const result = await apiMe();
        if (result.ok && result.data) {
          const u = toUser(result.data);
          setUser(u);
          localStorage.setItem(STORAGE, JSON.stringify(u));
        } else {
          setUser(null);
          localStorage.removeItem(STORAGE);
        }
      } catch {
        // Offline – keep optimistic local state
      } finally {
        setLoading(false);
      }
    };
    hydrate();
  }, []);

  const signIn = async (email: string, password: string, role: Role) => {
    const result = await apiLogin({ email, password, role });
    if (!result.ok || !result.data)
      return { ok: false, error: result.error ?? "Sign in failed." };
    const u = toUser(result.data.user);
    setUser(u);
    localStorage.setItem(STORAGE, JSON.stringify(u));
    return { ok: true };
  };

  const register = async (payload: RegisterPayload) => {
    const result = await apiRegister(payload);
    if (!result.ok || !result.data)
      return { ok: false, error: result.error ?? "Registration failed." };
    const u = toUser(result.data.user);
    setUser(u);
    localStorage.setItem(STORAGE, JSON.stringify(u));
    return { ok: true };
  };

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

// Demo credentials kept for autofill convenience
export const demoCredentials: Record<
  Role,
  { email: string; password: string }
> = {
  admin: { email: "admin@platform.com", password: "Admin@1234" },
  recruiter: { email: "recruiter@RagasHire.com", password: "Recruit@123" },
  job_seeker: { email: "jobseeker@RagasHire.com", password: "seeker@123" },
};