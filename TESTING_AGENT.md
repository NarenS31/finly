# QA Testing Agent Brief

## App Reconnaissance Summary

Finly is a Next.js 16 App Router product backed by Supabase auth and Postgres. The product surface is broader than a simple content site: it includes guest and authenticated learning flows, onboarding, lessons, full-screen quiz mode, XP and achievements, daily engagement loops, class creation and joining, profile customization, savings goals, streak systems, leaderboards, a spending simulator, and a contact workflow.

### Primary routes discovered

- `/`
- `/dashboard`
- `/learn`
- `/learn/[slug]`
- `/learn/[slug]/quiz`
- `/curriculum`
- `/simulator`
- `/leaderboard`
- `/cards`
- `/about`
- `/profile`
- `/classes`
- `/classes/[id]`
- `/join`
- `/onboarding`
- `/auth/login`
- `/auth/signup`
- `/auth/forgot-password`

### Stateful API routes discovered

- `/api/profile`
- `/api/account`
- `/api/avatar`
- `/api/lesson-complete`
- `/api/quiz-result`
- `/api/progress`
- `/api/daily-challenge`
- `/api/poll`
- `/api/money-goals`
- `/api/streak`
- `/api/streak-shield`
- `/api/contact`
- `/api/email/welcome`

## Product Role Model

- `Guest`
  Accesses public pages, lessons, simulator, leaderboard, daily challenge and weekly poll read views, and accumulates local guest progress.
- `Authenticated learner`
  Owns profile, dashboard, progress, XP, streaks, goals, avatar, poll vote, daily challenge completion, and can join classes.
- `Class owner / teacher-like user`
  Any authenticated user who creates classes. Can create class codes, archive classes, and view teacher dashboards.
- `Class member / student-like user`
  Any authenticated user who joins a class code and whose progress becomes visible to the class owner.
- `System`
  Supabase auth, RPCs for XP/achievements/class dashboard, and Resend-backed email endpoints.

## Proposed Test Domains

1. Authentication and onboarding
2. Protected route guards and API authorization
3. Core lesson flows and progress persistence
4. Profile settings, avatar, streak, and account lifecycle
5. Money goals CRUD and cross-user isolation
6. Class creation, join flow, teacher dashboard, and duplicate joins
7. Daily challenge and weekly poll statefulness
8. Dashboard and leaderboard consistency
9. Secondary features: simulator, curriculum, contact, cards

## Critical Flows To Prioritize

1. Guest to authenticated learner
2. Login, protected navigation, refresh, relogin, and account deletion
3. Lesson progress creation and persistence
4. Profile updates and saved preferences
5. Money goal create/update/delete lifecycle
6. Teacher creates class, student joins, teacher observes membership
7. Duplicate/replay behavior for daily challenge, weekly poll, and class join

## Assumptions

- `.env.local` points at a reachable Supabase project with auth enabled.
- Service-role-backed test setup is acceptable for seeding and cleanup.
- Email confirmation behavior may vary by Supabase environment, so successful signup can branch into either an authenticated onboarding path or a confirmation-required login path.
- Browser share and clipboard APIs are best-effort and should be asserted through visible fallback behavior rather than exact OS dialogs.

## Known Blockers / Risks

- Class flows depend on migration `007_class_system.sql` being applied in the active Supabase environment.
- Engagement flows depend on migration `008_engagement_features.sql`.
- Password-reset and Google OAuth flows are partly third-party dependent and may require manual support for end-to-end confirmation.
- The cards feature appears intentionally incomplete in the current UI and may be more suitable for bug reporting than functional validation.
- Some UI surfaces use inline styles and have limited semantic hooks, so locator resilience must lean heavily on roles, labels, and visible text.

## Execution Notes

- Feature coverage is tracked in [FEATURE_MATRIX.md](/Users/narensara11/finn/FEATURE_MATRIX.md).
- High-value automated coverage is implemented in:
  - `/Users/narensara11/finn/tests/e2e/auth.spec.ts`
  - `/Users/narensara11/finn/tests/e2e/classes.spec.ts`
  - `/Users/narensara11/finn/tests/e2e/permissions.spec.ts`
  - `/Users/narensara11/finn/tests/e2e/persistence.spec.ts`
  - `/Users/narensara11/finn/tests/e2e/collaboration.spec.ts`
