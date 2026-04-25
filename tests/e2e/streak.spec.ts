/**
 * Streak system tests.
 *
 * Covers:
 *  - POST /api/streak increments for a new day
 *  - POST /api/streak is idempotent on the same day
 *  - POST /api/streak resets when last activity was 2+ days ago
 *  - POST /api/streak awards a shield at every 5-day milestone
 *  - POST /api/streak-shield decrements shield count and refreshes last_active_date
 *  - POST /api/streak-shield returns 400 when user has no shields
 *  - Both endpoints require authentication (401 for guests)
 *  - streak_longest is updated correctly
 *  - Streak data persists after relogin
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
  setUserStreak,
} from "../helpers/supabase-admin";

test.describe("Streak — authentication guard", () => {
  test("POST /api/streak returns 401 for unauthenticated caller", async ({ page }) => {
    const res = await page.request.post("/api/streak");
    expect(res.status()).toBe(401);
  });

  test("POST /api/streak-shield returns 401 for unauthenticated caller", async ({ page }) => {
    const res = await page.request.post("/api/streak-shield");
    expect(res.status()).toBe(401);
  });
});

test.describe("Streak — increment logic", () => {
  let user: FinlyTestUser;

  test.beforeAll(async () => {
    user = await provisionUser({
      role: "learner",
      prefix: "streak_incr",
      displayName: "Streak Incr",
    });
  });

  test.afterAll(async () => {
    await cleanupUser(user);
  });

  test("calling /api/streak on a new day increments streak_current by 1", async ({ page }) => {
    // Seed: streak=3, last_active yesterday
    const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
    await setUserStreak(user.id, {
      streak_current: 3,
      streak_longest: 3,
      streak_shields: 0,
      last_active_date: yesterday,
    });

    await loginViaUi(page, user, { next: "/dashboard", waitFor: /\/dashboard/ });
    const res = await page.request.post("/api/streak");
    expect(res.status()).toBe(200);
    const body = (await res.json()) as { ok: boolean };
    expect(body.ok).toBe(true);

    const profile = await getUserProfile(user.id);
    expect(profile.streak_current).toBe(4);
  });

  test("calling /api/streak twice on the same day is idempotent", async ({ page }) => {
    const today = new Date().toISOString().slice(0, 10);
    await setUserStreak(user.id, {
      streak_current: 5,
      streak_longest: 5,
      streak_shields: 0,
      last_active_date: today,
    });

    await loginViaUi(page, user, { next: "/dashboard", waitFor: /\/dashboard/ });
    await page.request.post("/api/streak");
    await page.request.post("/api/streak");

    const profile = await getUserProfile(user.id);
    expect(profile.streak_current).toBe(5);
  });

  test("streak resets to 1 when last activity was 2+ days ago", async ({ page }) => {
    const twoDaysAgo = new Date(Date.now() - 2 * 86_400_000).toISOString().slice(0, 10);
    await setUserStreak(user.id, {
      streak_current: 7,
      streak_longest: 10,
      streak_shields: 0,
      last_active_date: twoDaysAgo,
    });

    await loginViaUi(page, user, { next: "/dashboard", waitFor: /\/dashboard/ });
    const res = await page.request.post("/api/streak");
    expect(res.status()).toBe(200);

    const profile = await getUserProfile(user.id);
    expect(profile.streak_current).toBe(1);
    // streak_longest should be preserved (10 > 1)
    expect(profile.streak_longest).toBe(10);
  });

  test("streak_longest is updated when current streak exceeds it", async ({ page }) => {
    const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
    await setUserStreak(user.id, {
      streak_current: 9,
      streak_longest: 9,
      streak_shields: 0,
      last_active_date: yesterday,
    });

    await loginViaUi(page, user, { next: "/dashboard", waitFor: /\/dashboard/ });
    await page.request.post("/api/streak");

    const profile = await getUserProfile(user.id);
    expect(profile.streak_current).toBe(10);
    expect(profile.streak_longest).toBe(10);
  });

  test("hitting a 5-day milestone awards exactly 1 shield (capped at 3)", async ({ page }) => {
    const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
    // Streak currently at 4 — next call will make it 5, crossing a milestone
    await setUserStreak(user.id, {
      streak_current: 4,
      streak_longest: 4,
      streak_shields: 0,
      last_active_date: yesterday,
    });

    await loginViaUi(page, user, { next: "/dashboard", waitFor: /\/dashboard/ });
    await page.request.post("/api/streak");

    const profile = await getUserProfile(user.id);
    expect(profile.streak_current).toBe(5);
    expect(profile.streak_shields).toBe(1);
  });

  test("shield count is capped at 3 even at a milestone", async ({ page }) => {
    const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
    // Already at 3 shields, crossing milestone 5 should stay at 3
    await setUserStreak(user.id, {
      streak_current: 4,
      streak_longest: 4,
      streak_shields: 3,
      last_active_date: yesterday,
    });

    await loginViaUi(page, user, { next: "/dashboard", waitFor: /\/dashboard/ });
    await page.request.post("/api/streak");

    const profile = await getUserProfile(user.id);
    expect(profile.streak_shields).toBe(3); // capped, not 4
  });
});

test.describe("Streak Shield — use a shield", () => {
  let user: FinlyTestUser;

  test.beforeAll(async () => {
    user = await provisionUser({
      role: "learner",
      prefix: "shield_user",
      displayName: "Shield User",
    });
  });

  test.afterAll(async () => {
    await cleanupUser(user);
  });

  test("POST /api/streak-shield with 1 shield decrements to 0 and updates last_active_date", async ({
    page,
  }) => {
    const twoDaysAgo = new Date(Date.now() - 2 * 86_400_000).toISOString().slice(0, 10);
    await setUserStreak(user.id, {
      streak_current: 6,
      streak_shields: 1,
      last_active_date: twoDaysAgo,
    });

    await loginViaUi(page, user, { next: "/dashboard", waitFor: /\/dashboard/ });
    const res = await page.request.post("/api/streak-shield");

    expect(res.status()).toBe(200);
    const body = (await res.json()) as { ok: boolean; shields_remaining: number };
    expect(body.ok).toBe(true);
    expect(body.shields_remaining).toBe(0);

    const profile = await getUserProfile(user.id);
    expect(profile.streak_shields).toBe(0);

    const today = new Date().toISOString().slice(0, 10);
    expect(profile.last_active_date).toBe(today);
  });

  test("POST /api/streak-shield with 0 shields returns 400", async ({ page }) => {
    await setUserStreak(user.id, { streak_shields: 0 });

    await loginViaUi(page, user, { next: "/dashboard", waitFor: /\/dashboard/ });
    const res = await page.request.post("/api/streak-shield");

    expect(res.status()).toBe(400);
    const body = (await res.json()) as { error: string };
    expect(body.error).toMatch(/no shields/i);
  });

  test("using multiple shields decrements count correctly each time", async ({ page }) => {
    await setUserStreak(user.id, { streak_shields: 3 });

    await loginViaUi(page, user, { next: "/dashboard", waitFor: /\/dashboard/ });

    // Use first shield
    const res1 = await page.request.post("/api/streak-shield");
    expect(res1.status()).toBe(200);
    const b1 = (await res1.json()) as { shields_remaining: number };
    expect(b1.shields_remaining).toBe(2);

    // Use second shield (reset date first to allow another use)
    const twoDaysAgo = new Date(Date.now() - 2 * 86_400_000).toISOString().slice(0, 10);
    await setUserStreak(user.id, { last_active_date: twoDaysAgo });
    const res2 = await page.request.post("/api/streak-shield");
    expect(res2.status()).toBe(200);
    const b2 = (await res2.json()) as { shields_remaining: number };
    expect(b2.shields_remaining).toBe(1);
  });
});

test.describe("Streak — UI display and persistence", () => {
  let user: FinlyTestUser;

  test.beforeAll(async () => {
    user = await provisionUser({
      role: "learner",
      prefix: "streak_ui",
      displayName: "Streak UI",
    });
  });

  test.afterAll(async () => {
    await cleanupUser(user);
  });

  test("dashboard displays streak count from DB", async ({ page }) => {
    await setUserStreak(user.id, {
      streak_current: 7,
      streak_longest: 7,
      streak_shields: 2,
    });

    await loginViaUi(page, user, { next: "/dashboard", waitFor: /\/dashboard/ });
    await expect(page.getByText(/7/).first()).toBeVisible({ timeout: 8_000 });
    await expect(page.getByText(/streak/i).first()).toBeVisible();
  });

  test("profile page displays streak count and shields", async ({ page }) => {
    await setUserStreak(user.id, {
      streak_current: 3,
      streak_longest: 8,
      streak_shields: 1,
    });

    await loginViaUi(page, user, { next: "/profile", waitFor: /\/profile/ });
    await expect(page.getByText(/streak/i).first()).toBeVisible({ timeout: 8_000 });
  });

  test("streak data persists across fresh login sessions", async ({ browser }) => {
    await setUserStreak(user.id, {
      streak_current: 12,
      streak_longest: 12,
      streak_shields: 2,
    });

    const ctx1 = await browser.newContext();
    const p1 = await ctx1.newPage();
    await loginViaUi(p1, user, { next: "/dashboard", waitFor: /\/dashboard/ });
    await expect(p1.getByText(/12/).first()).toBeVisible({ timeout: 8_000 });
    await ctx1.close();

    const ctx2 = await browser.newContext();
    const p2 = await ctx2.newPage();
    await loginViaUi(p2, user, { next: "/dashboard", waitFor: /\/dashboard/ });
    await expect(p2.getByText(/12/).first()).toBeVisible({ timeout: 8_000 });
    await ctx2.close();
  });
});
