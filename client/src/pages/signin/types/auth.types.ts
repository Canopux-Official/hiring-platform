// types/auth.types.ts

export type Role = "admin" | "recruiter" | "job_seeker";

export type AuthStep = "role" | "signIn" | "register";

export interface FormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: Role;
  phone?: string;
}

export interface User {
  email: string;
  name: string;
  role: Role;
  phone?: string;
  /** Initials for the avatar, derived client-side */
  avatar: string;
}

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

export interface RoleOption {
  value: Role;
  title: string;
  desc: string;
  showRegister: boolean;
}