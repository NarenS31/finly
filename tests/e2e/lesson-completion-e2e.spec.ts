/**
 * Lesson completion end-to-end tests.
 *
 * Covers:
 *  - POST /api/lesson-complete awards XP on first completion
 *  - POST /api/lesson-complete is idempotent (alreadyCompleted=true, no extra XP)
 *  - POST /api/lesson-complete with missing lessonId returns 400
 *  - lesson_progress row is created/updated with status="completed"
 *  - quiz_score is correctly stored from correct/total ratio
 *  - POST /api/quiz-result saves quiz score for in-progress lesson
 *  - POST /api/quiz-result only updates if new score is better
 *  - POST /api/progress syncs guest progress on login
 *  - Guest can access /learn page and lesson pages without authentication
 *  - Full UI flow: authenticated user completes a lesson, XP appears on dashboard
 */

import { test, expect } from "@playwright/test";
import { loginViaUi } from "../fixtures/auth";
import {
  cleanupUser,
  provisionUser,
  type FinlyTestUser,
} from "../fixtures/users";
import {
  getUserProfile,
  getLessonIdBySlug,
  getLessonProgress,
  clearLessonProgress,
  setUserXp,
} from "../helpers/supabase-admin";

const LESSON_SLUG = "needs-vs-wants";
const LESSON_SLUG_2 = "what-is-money";

test.describe("Lesson completion — API contract", () => {
  let user: FinlyTestUser;
  let lessonId: string | null = null;

  test.beforeAll(async () => {
    user = await provisionUser({
      role: "learner",
      prefix: "lesson_api",
      displayName: "Lesson API",
    });
    lessonId = await getLessonIdBySlug(LESSON_SLUG);
  });

  test.afterAll(async () => {
    if (lessonId) await clearLessonProgress(user.id, lessonId);
    await cleanupUser(user);
  });

  test("POST /api/lesson-complete requires authentication (401 for guests)", async ({ page }) => {
    const res = await page.request.post("/api/lesson-complete", {
      data: { lessonId: "fake-id", slug: LESSON_SLUG },
    });
    expect(res.status()).toBe(401);
  });

  test("POST /api/lesson-complete without lessonId returns 400", async ({ page }) => {
    await loginViaUi(page, user, { next: "/dashboard", waitFor: /\/dashboard/ });
    const res = await page.request.post("/api/lesson-complete", {
      data: { slug: LESSON_SLUG },
    });
    expect(res.status()).toBe(400);
  });

  test("POST /api/lesson-complete without slug returns 400", async ({ page }) => {
    await loginViaUi(page, user, { next: "/dashboard", waitFor: /\/dashboard/ });
    const res = await page.request.post("/api/lesson-complete", {
      data: { lessonId: "some-id" },
    });
    expect(res.status()).toBe(400);
  });

  test("first completion awards XP and creates lesson_progress row", async ({ page }) => {
    test.skip(!lessonId, "Lesson not seeded in DB — cannot test completion");

    if (lessonId) await clearLessonProgress(user.id, lessonId);
    await setUserXp(user.id, 0);

    await loginViaUi(page, user, { next: "/dashboard", waitFor: /\/dashboard/ });

    const res = await page.request.post("/api/lesson-complete", {
      data: {
        lessonId,
        slug: LESSON_SLUG,
        quizCorrect: 2,
        quizTotal: 3,
        scrollProgress: 100,
      },
    });

    expect(res.status()).toBe(200);
    const body = (await res.json()) as {
      alreadyCompleted: boolean;
      xpResult: unknown;
    };
    expect(body.alreadyCompleted).toBe(false);

    const progress = await getLessonProgress(user.id, lessonId!);
    expect(progress?.status).toBe("completed");
    expect(progress?.quiz_score).toBe(67); // Math.round(2/3 * 100) = 67

    const profile = await getUserProfile(user.id);
    expect((profile.xp as number) ?? 0).toBeGreaterThan(0);
  });

  test("completing the same lesson twice marks alreadyCompleted=true and awards no extra XP", async ({
    page,
  }) => {
    test.skip(!lessonId, "Lesson not seeded in DB — cannot test completion");

    if (lessonId) await clearLessonProgress(user.id, lessonId);
    await setUserXp(user.id, 0);

    await loginViaUi(page, user, { next: "/dashboard", waitFor: /\/dashboard/ });

    // First completion
    await page.request.post("/api/lesson-complete", {
      data: { lessonId, slug: LESSON_SLUG, quizCorrect: 3, quizTotal: 3 },
    });

    const profileAfterFirst = await getUserProfile(user.id);
    const xpAfterFirst = (profileAfterFirst.xp as number) ?? 0;

    // Second completion — same lesson
    const res2 = await page.request.post("/api/lesson-complete", {
      data: { lessonId, slug: LESSON_SLUG, quizCorrect: 3, quizTotal: 3 },
    });

    expect(res2.status()).toBe(200);
    const body2 = (await res2.json()) as { alreadyCompleted: boolean };
    expect(body2.alreadyCompleted).toBe(true);

    const profileAfterSecond = await getUserProfile(user.id);
    expect(profileAfterSecond.xp).toBe(xpAfterFirst); // No XP gained on repeat
  });
});

test.describe("Quiz result — API contract", () => {
  let user: FinlyTestUser;
  let lessonId: string | null = null;

  test.beforeAll(async () => {
    user = await provisionUser({
      role: "learner",
      prefix: "quiz_api",
      displayName: "Quiz API",
    });
    lessonId = await getLessonIdBySlug(LESSON_SLUG_2);
  });

  test.afterAll(async () => {
    if (lessonId) await clearLessonProgress(user.id, lessonId);
    await cleanupUser(user);
  });

  test("POST /api/quiz-result requires authentication (401 for guests)", async ({ page }) => {
    const res = await page.request.post("/api/quiz-result", {
      data: { lessonId: "fake-id", slug: LESSON_SLUG_2, correct: 1, total: 3 },
    });
    expect(res.status()).toBe(401);
  });

  test("POST /api/quiz-result without lessonId/total returns 400", async ({ page }) => {
    await loginViaUi(page, user, { next: "/dashboard", waitFor: /\/dashboard/ });
    const res = await page.request.post("/api/quiz-result", {
      data: { slug: LESSON_SLUG_2, correct: 1 },
    });
    expect(res.status()).toBe(400);
  });

  test("POST /api/quiz-result saves score and returns updated=true", async ({ page }) => {
    test.skip(!lessonId, "Lesson not seeded in DB");

    if (lessonId) await clearLessonProgress(user.id, lessonId);
    await loginViaUi(page, user, { next: "/dashboard", waitFor: /\/dashboard/ });

    const res = await page.request.post("/api/quiz-result", {
      data: { lessonId, slug: LESSON_SLUG_2, correct: 2, total: 4 },
    });

    expect(res.status()).toBe(200);
    const body = (await res.json()) as { updated: boolean; quiz_score: number };
    expect(body.updated).toBe(true);
    expect(body.quiz_score).toBe(50); // Math.round(2/4 * 100)

    const progress = await getLessonProgress(user.id, lessonId!);
    expect(progress?.quiz_score).toBe(50);
  });

  test("POST /api/quiz-result does NOT update when new score is lower", async ({ page }) => {
    test.skip(!lessonId, "Lesson not seeded in DB");

    if (lessonId) await clearLessonProgress(user.id, lessonId);
    await loginViaUi(page, user, { next: "/dashboard", waitFor: /\/dashboard/ });

    // First: score 80%
    await page.request.post("/api/quiz-result", {
      data: { lessonId, slug: LESSON_SLUG_2, correct: 4, total: 5 },
    });

    // Second: score 40% — should be rejected
    const res2 = await page.request.post("/api/quiz-result", {
      data: { lessonId, slug: LESSON_SLUG_2, correct: 2, total: 5 },
    });

    expect(res2.status()).toBe(200);
    const body2 = (await res2.json()) as { updated: boolean; quiz_score: number };
    expect(body2.updated).toBe(false);
    expect(body2.quiz_score).toBe(80); // unchanged
  });

  test("POST /api/quiz-result updates when new score is higher", async ({ page }) => {
    test.skip(!lessonId, "Lesson not seeded in DB");

    if (lessonId) await clearLessonProgress(user.id, lessonId);
    await loginViaUi(page, user, { next: "/dashboard", waitFor: /\/dashboard/ });

    // First: score 40%
    await page.request.post("/api/quiz-result", {
      data: { lessonId, slug: LESSON_SLUG_2, correct: 2, total: 5 },
    });

    // Second: score 80% — should update
    const res2 = await page.request.post("/api/quiz-result", {
      data: { lessonId, slug: LESSON_SLUG_2, correct: 4, total: 5 },
    });

    const body2 = (await res2.json()) as { updated: boolean; quiz_score: number };
    expect(body2.updated).toBe(true);
    expect(body2.quiz_score).toBe(80);
  });
});

test.describe("Guest progress sync — /api/progress", () => {
  let user: FinlyTestUser;
  let lessonId: string | null = null;

  test.beforeAll(async () => {
    user = await provisionUser({
      role: "learner",
      prefix: "guest_sync",
      displayName: "Guest Sync",
    });
    lessonId = await getLessonIdBySlug(LESSON_SLUG);
  });

  test.afterAll(async () => {
    if (lessonId) await clearLessonProgress(user.id, lessonId);
    await cleanupUser(user);
  });

  test("POST /api/progress requires authentication (401 for guests)", async ({ page }) => {
    const res = await page.request.post("/api/progress", {
      data: { guestProgress: {} },
    });
    expect(res.status()).toBe(401);
  });

  test("POST /api/progress with empty guestProgress returns synced=0", async ({ page }) => {
    await loginViaUi(page, user, { next: "/dashboard", waitFor: /\/dashboard/ });
    const res = await page.request.post("/api/progress", {
      data: { guestProgress: {} },
    });
    expect(res.status()).toBe(200);
    const body = (await res.json()) as { ok: boolean; synced: number };
    expect(body.ok).toBe(true);
    expect(body.synced).toBe(0);
  });

  test("POST /api/progress syncs completed lesson from guest state to DB", async ({ page }) => {
    test.skip(!lessonId, "Lesson not seeded in DB");

    if (lessonId) await clearLessonProgress(user.id, lessonId);
    await loginViaUi(page, user, { next: "/dashboard", waitFor: /\/dashboard/ });

    const completedAt = new Date().toISOString();
    const guestProgress = {
      [LESSON_SLUG]: {
        status: "completed",
        scrollProgress: 100,
        quizScore: 75,
        completedAt,
      },
    };

    const res = await page.request.post("/api/progress", {
      data: { guestProgress },
    });

    expect(res.status()).toBe(200);
    const body = (await res.json()) as { ok: boolean; synced: number };
    expect(body.ok).toBe(true);
    expect(body.synced).toBe(1);

    const progress = await getLessonProgress(user.id, lessonId!);
    expect(progress?.status).toBe("completed");
    expect(progress?.scroll_progress).toBe(100);
  });

  test("POST /api/progress with scrollProgress > 5 marks lesson as in_progress", async ({ page }) => {
    test.skip(!lessonId, "Lesson not seeded in DB");

    if (lessonId) await clearLessonProgress(user.id, lessonId);
    await loginViaUi(page, user, { next: "/dashboard", waitFor: /\/dashboard/ });

    const guestProgress = {
      [LESSON_SLUG]: {
        status: "in_progress",
        scrollProgress: 30,
      },
    };

    await page.request.post("/api/progress", { data: { guestProgress } });

    const progress = await getLessonProgress(user.id, lessonId!);
    expect(progress?.status).toBe("in_progress");
  });

  test("POST /api/progress skips unknown slugs gracefully", async ({ page }) => {
    await loginViaUi(page, user, { next: "/dashboard", waitFor: /\/dashboard/ });

    const guestProgress = {
      "this-lesson-does-not-exist-at-all": {
        status: "completed",
        scrollProgress: 100,
      },
    };

    const res = await page.request.post("/api/progress", { data: { guestProgress } });
    expect(res.status()).toBe(200);
    const body = (await res.json()) as { ok: boolean; synced: number };
    expect(body.ok).toBe(true);
    expect(body.synced).toBe(0); // Skipped — slug not found
  });
});

test.describe("Lesson pages — public access", () => {
  test("guest can view /learn without being redirected to login", async ({ page }) => {
    await page.goto("/learn");
    await expect(page).not.toHaveURL(/\/auth\/login/);
    await expect(page.getByRole("heading").first()).toBeVisible();
  });

  test("guest can navigate to a known lesson page without being redirected", async ({ page }) => {
    await page.goto(`/learn/${LESSON_SLUG}`);
    await expect(page).not.toHaveURL(/\/auth\/login/);
    await expect(page.getByRole("main")).toBeVisible();
  });

  test("/learn page shows lesson cards linking to /learn/ paths", async ({ page }) => {
    await page.goto("/learn");
    // The library defaults to the "In Progress" tab which is empty for guests.
    // Switch to the "Not Started" tab to see all available lessons.
    const notStartedTab = page.getByRole("button", { name: /not started/i });
    if (await notStartedTab.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await notStartedTab.click();
    }
    // Wait for at least one lesson card link with a /learn/ path
    const firstLessonLink = page.locator('a[href^="/learn/"]').first();
    await expect(firstLessonLink).toBeVisible({ timeout: 10_000 });
    const href = await firstLessonLink.getAttribute("href");
    expect(href).toMatch(/^\/learn\//);
  });
});

test.describe("Lesson completion — XP reflected in UI", () => {
  let user: FinlyTestUser;
  let lessonId: string | null = null;

  test.beforeAll(async () => {
    user = await provisionUser({
      role: "learner",
      prefix: "lesson_ui_xp",
      displayName: "Lesson XP UI",
    });
    lessonId = await getLessonIdBySlug(LESSON_SLUG);
  });

  test.afterAll(async () => {
    if (lessonId) await clearLessonProgress(user.id, lessonId);
    await cleanupUser(user);
  });

  test("completing a lesson via API increases XP shown on the dashboard", async ({ page }) => {
    test.skip(!lessonId, "Lesson not seeded in DB");

    if (lessonId) await clearLessonProgress(user.id, lessonId);
    await setUserXp(user.id, 0);

    await loginViaUi(page, user, { next: "/dashboard", waitFor: /\/dashboard/ });

    await page.request.post("/api/lesson-complete", {
      data: { lessonId, slug: LESSON_SLUG, quizCorrect: 3, quizTotal: 3 },
    });

    await page.reload();
    // XP should now be > 0 and visible
    const profile = await getUserProfile(user.id);
    const xp = (profile.xp as number) ?? 0;
    expect(xp).toBeGreaterThan(0);

    // Dashboard should display XP somewhere (any text containing the number)
    await expect(page.getByText(new RegExp(String(xp))).first()).toBeVisible({ timeout: 8_000 });
  });
});
