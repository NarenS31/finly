# FinPath

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20Postgres-3ecf8e?logo=supabase)](https://supabase.com/)

**FinPath** is a free, self-directed financial literacy platform for ages **8–17**: two age-tier tracks, lightweight **currency symbols** for calculators, interactive MDX lessons (calculators, scenarios, quizzes), optional Supabase auth with **guest → account** progress sync, and deploy targets for **Vercel**.

> **Screenshots:** add `docs/screenshots/` images here after your first deploy (hero, `/learn`, lesson reader, profile).

> **Live demo:** replace with your production URL after deployment.

## Why FinPath

- **Student-first:** no teacher gate, no paywall — learn on any phone or laptop.
- **Two tracks:** Foundation (8–12) and Real World (13–17) share one brand with different tone and layout density.
- **Global-friendly:** calculator currency (USD, NGN, INR, PHP, BRL); lesson copy stays universal for v1.
- **Interactive core:** compound interest, budget allocator, savings goal, debt payoff, and needs vs wants sorters — powered by Recharts and Zustand.

## Tech stack

| Area        | Choice                                      |
| ----------- | ------------------------------------------- |
| Framework   | Next.js 16 (App Router, TypeScript)         |
| Styling     | Tailwind CSS v4                           |
| Auth & DB   | Supabase (Postgres + RLS + Auth)          |
| Content     | `next-mdx-remote` (RSC) + MDX in `/content` |
| State       | Zustand (persisted currency, age tier, guest progress) |
| Motion      | Framer Motion                               |
| Charts      | Recharts                                    |
| Email       | Resend (welcome + streak reminder path)     |
| Themes      | `next-themes` (light / dark)                |

## Prerequisites

- **Node.js 18+** (LTS recommended)
- A **Supabase** project (Postgres + Auth enabled)
- A **Resend** account (for transactional email — optional for local dev except welcome route)

## Local setup

1. **Clone and install**

   ```bash
   git clone <your-repo-url> finpath
   cd finpath
   npm install
   ```

2. **Environment variables**

   ```bash
   cp .env.local.example .env.local
   ```

   Fill in:

   - `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from Supabase project settings.
   - `SUPABASE_SERVICE_ROLE_KEY` — server-only; used by Edge Functions / future admin paths (keep secret).
   - `NEXT_PUBLIC_SITE_URL` — e.g. `http://localhost:3000` locally, production URL on Vercel.
   - `RESEND_API_KEY` — for `/api/email/welcome` and the `streak-reminder` Edge Function.

3. **Run database migrations**

   From the Supabase SQL editor or CLI, apply files in order:

   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_seed_achievements.sql`
   - `supabase/migrations/003_seed_lessons.sql`
   - `supabase/migrations/004_xp_and_achievements.sql` (RPCs for XP + achievements)
   - `supabase/migrations/005_lesson_quiz_breakdown.sql` (optional `quiz_correct` / `quiz_total` on `lesson_progress`)

4. **Start the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Adding a new lesson

1. Create `content/lessons/<slug>.mdx`.
2. Add **YAML frontmatter** (minimum):

   ```yaml
   slug: my-lesson
   title: "Readable title"
   description: "One line for SEO/cards."
   topic: budgeting # budgeting | saving | investing | debt | banking | goals | tax | credit | money_basics
   ageTier: 13-17 # or 8-12 or both
   difficulty: beginner # beginner | intermediate | advanced
   estimatedMinutes: 8
   orderIndex: 10
   published: true
   xpReward: 10
   quizCount: 3
   keyTakeaways:
     - "Bullet one for completion card"
     - "Bullet two"
     - "Bullet three"
   ```

3. Use MDX components exported in `components/lesson/mdx-components.tsx`, e.g. `ConceptCard`, `InteractiveCalculator`, `Scenario`, `QuizQuestion`, `KeyTakeaway`, `RealWorldExample`, `FunFact`, `Term`, and heading `##` / `###` for TOC.

4. Optionally insert the same slug into the `lessons` table (`published = true`) so Supabase-backed features stay aligned.

## API routes

- `GET /api/stats` — platform counters (falls back if Supabase unavailable).
- `POST /api/progress` — authenticated sync of `finpath_guest_progress` from the client into `lesson_progress`.
- `POST /api/email/welcome` — sends the welcome email via Resend.

## Supabase Edge Function: streak reminder

`supabase/functions/streak-reminder/index.ts` runs on a **daily schedule** (configure in Supabase Dashboard → Edge Functions → Cron). It selects profiles with `streak_current >= 2`, `last_active_date` before today, and `email_notify_streak = true`, resolves emails via the service role, and sends a Resend message.

Secrets: `RESEND_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL`.

## Deployment (Vercel)

1. Push the repo to GitHub/GitLab/Bitbucket.
2. Import the project in [Vercel](https://vercel.com/) and set the same env vars as `.env.local.example`.
3. Deploy (`vercel --prod` or Dashboard **Deploy**).

Ensure Supabase **Auth redirect URLs** include your production domain for OAuth/password reset.

## Before you launch

1. Apply all database migrations (including `004` and `005`) via `supabase db push` or the SQL editor.
2. Replace Resend’s `onboarding@resend.dev` sender with a [verified domain](https://resend.com/docs/dashboard/domains/introduction) in `app/api/email/welcome/route.ts` and `supabase/functions/streak-reminder/index.ts`.
3. Confirm `SUPABASE_SERVICE_ROLE_KEY` is set server-side only (account deletion and Edge Functions).

## Contributing

1. Open an issue or draft PR describing the change.
2. Keep diffs focused; match existing patterns (App Router, Zustand stores, Tailwind tokens).
3. Run `npm run build` before submitting.

## License

MIT
