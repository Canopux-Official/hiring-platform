import { IApplication, IJobSeekerProfile, IRecommendedJob, IUserInfo, PaginatedData } from "../types";

// src/api/seeker.ts
const BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

function authHeaders() {
  return {
    "Content-Type": "application/json",
  };
}

const FETCH_CONFIG: RequestInit = {
  headers: authHeaders(),
  credentials: "include",
};

// Generic unwrap function matching your backend
// async function unwrap<T>(res: Response): Promise<T> {
//   let json: any;
//   try {
//     json = await res.json();
//   } catch {
//     json = {};
//   }

//   if (!res.ok) {
//     // This matches your backend: new AppError("Message", status)
//     const message = json?.message || json?.error || `Request failed with status ${res.status}`;
//     const error = new Error(message);
//     (error as any).status = res.status;
//     throw error;
//   }

//   // Success format: { success: true, message: "...", data: ... }
//   return (json?.data !== undefined ? json.data : json) as T;
// }


async function unwrap<T>(res: Response): Promise<T> {
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.message ?? `Request failed with status ${res.status}`);
  }
  return (json?.data !== undefined ? json.data : json) as T;
}
 
async function unwrapPaginated<T>(res: Response): Promise<T[]> {
  const data = await unwrap<PaginatedData<T> | T[]>(res);
  if (data && !Array.isArray(data) && "items" in data) {
    return (data as PaginatedData<T>).items;
  }
  return data as T[];
}

// ────────────────────────────── Types are imported from types/seeker.ts
export * from "../types";

// ────────────────────────────── Profile APIs
export async function getMyProfile(): Promise<IJobSeekerProfile> {
  const res = await fetch(`${BASE_URL}/profile/me`, {
    ...FETCH_CONFIG,
    method: "GET"
  });
  return unwrap<IJobSeekerProfile>(res);
}

export async function updateMyProfile(data: Partial<IJobSeekerProfile>): Promise<IJobSeekerProfile> {
  const res = await fetch(`${BASE_URL}/profile/me`, {
    ...FETCH_CONFIG,
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return unwrap<IJobSeekerProfile>(res);
}

export async function updateUserInfo(data: Partial<IUserInfo>): Promise<IUserInfo> {
  const res = await fetch(`${BASE_URL}/profile/me/user-info`, {
    ...FETCH_CONFIG,
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return unwrap<IUserInfo>(res);
}

// ─── Applications (paginated) ─────────────────────────────────────────────────

export async function getMyApplications(): Promise<IApplication[]> {
  const res = await fetch(`${BASE_URL}/applications/my`, {
    ...FETCH_CONFIG,
    method: "GET"
  });
  return unwrapPaginated<IApplication>(res);
}

export async function withdrawApplication(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/applications/${id}/withdraw`, {
    ...FETCH_CONFIG,
    method: "DELETE",
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json?.message ?? "Failed to withdraw application");
  }
}

// ─── Recommended Jobs ─────────────────────────────────────────────────────────

export async function getRecommendedJobs(): Promise<IRecommendedJob[]> {
  try {
    const res = await fetch(`${BASE_URL}/jobs/recommended`, {
      ...FETCH_CONFIG,
      method: "GET"
    });
    if (!res.ok) return [];
    return unwrapPaginated<IRecommendedJob>(res);
  } catch {
    return [];
  }
}