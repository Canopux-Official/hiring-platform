# Hiring Platform API

A RESTful backend API for a hiring platform supporting job seekers, recruiters, and admins — built with **Node.js**, **Express**, and **TypeScript**.

---

## Base URL

```
http://localhost:5000/api
```

---

## Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express.js
- **Auth:** Cookie-based sessions with JWT
- **Security:** Helmet, CORS, Rate Limiting
- **Logging:** Morgan

---

## Roles

| Role | Description |
|---|---|
| `JOB_SEEKER` | Can browse jobs, apply, and manage their profile |
| `RECRUITER` | Can post jobs and manage applications |
| `ADMIN` | Full platform access including user management |

---

## Rate Limits

| Scope | Limit |
|---|---|
| All `/api/*` routes | 100 requests / 15 min |
| `/api/auth/*` routes | 10 requests / 15 min |

---

## Health Check

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/health` | None | Returns API status and runtime environment |

---

## Auth Routes

**Base path:** `/api/auth`

> All auth routes are rate-limited to 10 requests per 15 minutes.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | None | Register a new user account |
| `POST` | `/auth/login` | None | Authenticate and receive a session cookie |
| `POST` | `/auth/logout` | None | Clear the session cookie |
| `GET` | `/auth/me` | Required | Get the currently authenticated user's details |
| `PATCH` | `/auth/change-password` | Required | Update password for the authenticated user |

---

## Job Routes

**Base path:** `/api/jobs`

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `GET` | `/jobs` | None | Public | List all available job postings with optional filters |
| `GET` | `/jobs/:id` | None | Public | Get full details of a single job posting |
| `POST` | `/jobs` | Required | RECRUITER, ADMIN | Create a new job posting |
| `GET` | `/jobs/recruiter/my-jobs` | Required | RECRUITER, ADMIN | List all jobs posted by the authenticated recruiter |
| `PATCH` | `/jobs/:id` | Required | RECRUITER, ADMIN | Update an existing job posting |
| `DELETE` | `/jobs/:id` | Required | RECRUITER, ADMIN | Delete a job posting |
| `GET` | `/jobs/:jobId/applications` | Required | RECRUITER, ADMIN | List all applications submitted for a specific job |
| `POST` | `/jobs/:jobId/apply` | Required | JOB_SEEKER | Submit an application for a job |

---

## Application Routes

**Base path:** `/api/applications`

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `GET` | `/applications/my` | Required | JOB_SEEKER | List all applications submitted by the authenticated job seeker |
| `DELETE` | `/applications/:id/withdraw` | Required | JOB_SEEKER | Withdraw a pending application |
| `GET` | `/applications/:id` | Required | Any | Get details of a single application (accessible by applicant, recruiter, or admin) |
| `PATCH` | `/applications/:id/status` | Required | RECRUITER, ADMIN | Update the status of an application (e.g. shortlisted, rejected) |

---

## Profile Routes

**Base path:** `/api/profile`

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `GET` | `/profile/me` | Required | JOB_SEEKER | Get the authenticated job seeker's full profile |
| `PATCH` | `/profile/me` | Required | JOB_SEEKER | Update the authenticated job seeker's profile details |
| `PATCH` | `/profile/me/user-info` | Required | Any | Update basic user info (name, email) for the authenticated user |
| `GET` | `/profile/:userId` | Required | RECRUITER, ADMIN | View a specific job seeker's profile by user ID |

---

## Admin Routes

**Base path:** `/api/admin`

> All admin routes require authentication and the `ADMIN` role.

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `GET` | `/admin/dashboard` | Required | ADMIN | Get platform-wide stats (users, jobs, applications) |
| `GET` | `/admin/users` | Required | ADMIN | List all registered users |
| `PATCH` | `/admin/users/:id/toggle-status` | Required | ADMIN | Enable or disable a user account |
| `DELETE` | `/admin/users/:id` | Required | ADMIN | Permanently delete a user account |
| `GET` | `/admin/applications` | Required | ADMIN | List all applications across the platform |

---

## Error Responses

All errors follow a consistent shape:

```json
{
  "success": false,
  "message": "Description of the error"
}
```

| Status | Meaning |
|---|---|
| `400` | Validation error / bad request |
| `401` | Unauthenticated — login required |
| `403` | Unauthorized — insufficient role |
| `404` | Resource not found |
| `429` | Rate limit exceeded |
| `500` | Internal server error |

---

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run in development
npm run dev

# Build for production
npm run build
npm start
```

### Required Environment Variables

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```