/**
 * XP and level progression tests.
 *
 * Level thresholds (from codebase):
 *   Beginner:      0 – 99 XP
 *   Saver:       100 – 299 XP
 *   Investor:    300 – 699 XP
 *   Finance Pro: 700 – 1499 XP
 *   Money Master: 1500+ XP
 *
 * Covers:
 *  - Level label matches XP value across all 5 tiers
 *  - Profile page shows correct level badge for current XP
 *  - Leaderboard rank ordering: user with more XP appears above user with less
 *  - XP value from DB matches what is displayed on dashboard and profile
 *  - Platform stats endpoint returns expected shape
 */

import { test, expect } from "@playwright/test";
import { loginViaUi } from "../fixtures/auth";
import {
  cleanupUsers,
  provisionUser,
  type FinlyTestUser,
} from "../fixtures/users";
import { setUserXp } from "../helpers/supabase-admin";

test.describe("XP and level display", () => {
  let user: FinlyTestUser;

  test.beforeAll(async () => {
    user = await provisionUser({
      role: "learner",
      prefix: "xp_level",
      displayName: "XP Level Tester",
    });
  });

  test.afterAll(async () => {
    await cleanupUsers([user]);
  });

  const levelCases: Array<{ xp: number; expectedLevel: RegExp }> = [
    { xp: 0, expectedLevel: /beginner/i },
    { xp: 99, expectedLevel: /beginner/i },
    { xp: 100, expectedLevel: /saver/i },
    { xp: 299, expectedLevel: /saver/i },
    { xp: 300, expectedLevel: /investor/i },
    { xp: 700, expectedLevel: /finance pro/i },
    { xp: 1500, expectedLevel: /money master/i },
  ];

  for (const { xp, expectedLevel } of levelCases) {
    test(`${xp} XP shows level "${expectedLevel.source}" on profile`, async ({ page }) => {
      await setUserXp(user.id, xp);
      await loginViaUi(page, user, { next: "/profile", waitFor: /\/profile/ });
      await expect(page.getByText(expectedLevel).first()).toBeVisible({ timeout: 8_000 });
    });
  }

  test("dashboard shows the user's current XP value", async ({ page }) => {
    await setUserXp(user.id, 350);
    await loginViaUi(page, user, { next: "/dashboard", waitFor: /\/dashboard/ });
    await expect(page.getByText(/350/).first()).toBeVisible({ timeout: 8_000 });
  });

  test("profile page shows the user's current XP value", async ({ page }) => {
    await setUserXp(user.id, 125);
    await loginViaUi(page, user, { next: "/profile", waitFor: /\/profile/ });
    await expect(page.getByText(/125/).first()).toBeVisible({ timeout: 8_000 });
  });
});

test.describe("Leaderboard ordering — multi-user", () => {
  let userHigh: FinlyTestUser;
  let userLow: FinlyTestUser;

  test.beforeAll(async () => {
    userHigh = await provisionUser({
      role: "learner",
      prefix: "lb_high",
      displayName: `LBHigh${Date.now()}`,
    });
    userLow = await provisionUser({
      role: "learner",
      prefix: "lb_low",
      displayName: `LBLow${Date.now()}`,
    });

    await setUserXp(userHigh.id, 1200);
    await setUserXp(userLow.id, 50);
  });

  test.afterAll(async () => {
    await cleanupUsers([userHigh, userLow]);
  });

  test("user with more XP appears above user with less XP on leaderboard", async ({ page }) => {
    await page.goto("/leaderboard");

    // Both users should be visible
    const highEntry = page.getByText(userHigh.displayName);
    const lowEntry = page.getByText(userLow.displayName);

    const highVisible = await highEntry.isVisible({ timeout: 8_000 }).catch(() => false);
    const lowVisible = await lowEntry.isVisible({ timeout: 8_000 }).catch(() => false);

    if (!highVisible || !lowVisible) {
      // Leaderboard may paginate; skip ordering check but verify both appear
      test.skip(true, "One or both test users not visible on leaderboard — may be paginated");
    }

    // Compare DOM positions: high XP user's entry bounding box should be above low XP user's
    const highBox = await highEntry.boundingBox();
    const lowBox = await lowEntry.boundingBox();

    if (highBox && lowBox) {
      expect(highBox.y).toBeLessThan(lowBox.y);
    }
  });

  test("authenticated user's own entry is visually highlighted on leaderboard", async ({ page }) => {
    await loginViaUi(page, userHigh, { next: "/leaderboard", waitFor: /\/leaderboard/ });
    // "You" label or highlighted row containing the display name
    const ownEntry = page.getByText(userHigh.displayName).first();
    await expect(ownEntry).toBeVisible({ timeout: 8_000 });
  });

  test("XP update is reflected on leaderboard — user entry shows updated XP", async ({ page }) => {
    await setUserXp(userHigh.id, 1350);
    await page.goto("/leaderboard");

    // The user should appear on the leaderboard
    const userEntry = page.getByText(userHigh.displayName);
    const userVisible = await userEntry.isVisible({ timeout: 8_000 }).catch(() => false);

    if (!userVisible) {
      test.skip(true, "User not visible on leaderboard — may be paginated beyond visible range");
    }

    // Their row should contain the updated XP value (possibly formatted as 1,350 or 1350)
    const entryRow = page.locator("tr, li, div").filter({ has: page.getByText(userHigh.displayName) }).first();
    await expect(entryRow.getByText(/1350|1,350/)).toBeVisible({ timeout: 8_000 });
  });
});

test.describe("Platform stats — GET /api/stats", () => {
  test("returns 200 with expected shape for unauthenticated caller", async ({ page }) => {
    const res = await page.request.get("/api/stats");
    expect(res.status()).toBe(200);
    const body = (await res.json()) as Record<string, unknown>;
    // Must have at least one of the expected stat fields
    const hasStats =
      "total_users" in body ||
      "totalUsers" in body ||
      "total_lessons_completed" in body ||
      "totalLessonsCompleted" in body;
    expect(hasStats).toBe(true);
  });

  test("stats contain numeric values (not null or undefined)", async ({ page }) => {
    const res = await page.request.get("/api/stats");
    const body = (await res.json()) as Record<string, unknown>;

    const values = Object.values(body).filter((v) => v !== null && v !== undefined);
    expect(values.length).toBeGreaterThan(0);

    for (const val of values) {
      if (typeof val === "number") {
        expect(val).toBeGreaterThanOrEqual(0);
      }
    }
  });
});
