# Rozgaari — React + TypeScript + Material UI

The AI-powered global hiring platform — a faithful MUI port of the original Rozgaari Lovable build.

## Stack

- **React 18** + **TypeScript**
- **Material UI v6** (`@mui/material`, `@mui/icons-material`, Emotion)
- **React Router DOM v6**
- **Framer Motion** (animations)
- **Vite 5** (dev / build)

All compatible versions — no peer-dependency conflicts.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

Build for production:

```bash
npm run build
npm run preview
```

## Demo credentials

The auth is mocked in `src/lib/auth.tsx` and persisted via `localStorage`.

| Role        | Email                          | Password    |
|-------------|--------------------------------|-------------|
| Recruiter   | `recruiter@Rozgaari.com`     | `Recruit123`|
| Job Seeker  | `jobseeker@Rozgaari.com`     | `Job123`    |

Use the **Autofill** button on the sign-in screen.

## Features

- Landing page with hero, stats, features, testimonials, CTA
- Public **Jobs** browser with search & filters
- **Talent** discovery grid
- Animated 2-step **Sign In** (role selection → form)
- **Recruiter dashboard** with stats, active jobs, pipeline, activity
- **+ New Job** multi-step modal with AI assist, live preview, skill tagger
- **Seeker dashboard** with profile ring, AI resume score, job matches, timeline
- Persistent jobs store (localStorage) — new jobs appear instantly on the public board
- Midnight emerald glass theme, fully responsive

## Project structure

```
src/
  App.tsx              # routes
  main.tsx             # entry
  lib/
    theme.ts           # MUI theme
    auth.tsx           # mock auth context
    jobs-store.tsx     # jobs context + persistence
  components/
    SiteNav.tsx
    SiteFooter.tsx
    NewJobModal.tsx
  pages/
    Home.tsx
    Jobs.tsx
    Talent.tsx
    SignIn.tsx
    RecruiterDashboard.tsx
    SeekerDashboard.tsx
```

## License

MIT.
