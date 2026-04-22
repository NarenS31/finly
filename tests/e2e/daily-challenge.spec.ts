/**
 * Daily Challenge tests.
 * Verifies: challenge renders, correct/wrong answer flows, XP awarded on correct,
 * already-completed state, duplicate submission rejected (409), guest behavior.
 */

import { test, expect } from "@playwright/test";
import {
  createTestUser,
  deleteTestUser,
  seedDailyChallenge,
  deleteDailyChallengeCompletion,
  getUserProfile,
} from "../helpers/supabase-admin";
import { loginViaUI, uniqueEmail } from "../helpers/auth";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

const TEST_PASSWORD = "TestPass1!";

test.describe("Daily Challenge — public/guest view", () => {
  test.beforeAll(async () => {
    await seedDailyChallenge();
  });

  test("homepage shows today's challenge section", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/today's challenge/i).first()).toBeVisible({ timeout: 8_000 });
  });

  test("daily challenge shows a question", async ({ page }) => {
    await seedDailyChallenge();
    await page.goto("/");
    // Challenge widget should show question text
    const challengeSection = page.locator("[data-testid='daily-challenge'], section").filter({
      hasText: /daily challenge/i,
    }).first();
    await expect(challengeSection).toBeVisible();
  });
});

test.describe("Daily Challenge — authenticated", () => {
  let userId: string;
  let email: string;
  let challengeId: string;

  test.beforeAll(async () => {
    email = uniqueEmail("challenge");
    const user = await createTestUser(email, TEST_PASSWORD, "ChallengeTester");
    userId = user.id;
    challengeId = await seedDailyChallenge();
  });

  test.afterAll(async () => {
    await deleteDailyChallengeCompletion(userId, challengeId);
    await deleteTestUser(userId);
  });

  test("after login, daily challenge on homepage is interactive", async ({ page }) => {
    await loginViaUI(page, email, TEST_PASSWORD);
    await page.goto("/");
    const challengeSection = page.getByText(/daily challenge/i).first();
    await expect(challengeSection).toBeVisible();
  });

  test("submitting correct answer awards XP via API", async ({ page }) => {
    // Remove any prior completion to test fresh
    await deleteDailyChallengeCompletion(userId, challengeId);

    const profileBefore = await getUserProfile(userId);
    const xpBefore = (profileBefore.xp as number) ?? 0;

    // Call the API directly to simulate correct answer submission
    await loginViaUI(page, email, TEST_PASSWORD);

    const response = await page.request.post("/api/daily-challenge", {
      data: { challengeId, chosen: 0 }, // correct answer is index 0
    });

    expect(response.status()).toBe(200);
    const body = (await response.json()) as { correct: boolean; xp_awarded: number };
    expect(body.correct).toBe(true);
    expect(body.xp_awarded).toBeGreaterThan(0);

    // Verify XP actually increased in DB
    const profileAfter = await getUserProfile(userId);
    const xpAfter = (profileAfter.xp as number) ?? 0;
    expect(xpAfter).toBeGreaterThan(xpBefore);
  });

  test("submitting wrong answer gives no XP", async ({ page }) => {
    await deleteDailyChallengeCompletion(userId, challengeId);
    await loginViaUI(page, email, TEST_PASSWORD);

    const profileBefore = await getUserProfile(userId);
    const xpBefore = (profileBefore.xp as number) ?? 0;

    const response = await page.request.post("/api/daily-challenge", {
      data: { challengeId, chosen: 1 }, // index 1 is wrong (correct is 0)
    });

    const body = (await response.json()) as { correct: boolean; xp_awarded: number };
    expect(body.correct).toBe(false);
    expect(body.xp_awarded).toBe(0);

    const profileAfter = await getUserProfile(userId);
    expect(profileAfter.xp).toBe(xpBefore);
  });

  test("submitting same challenge twice returns 409 Already answered", async ({ page }) => {
    await deleteDailyChallengeCompletion(userId, challengeId);
    await loginViaUI(page, email, TEST_PASSWORD);

    // First submission
    await page.request.post("/api/daily-challenge", {
      data: { challengeId, chosen: 0 },
    });

    // Second submission — should be 409
    const secondResponse = await page.request.post("/api/daily-challenge", {
      data: { challengeId, chosen: 0 },
    });
    expect(secondResponse.status()).toBe(409);
  });

  test("GET /api/daily-challenge returns challenge without answer before completion", async ({
    page,
  }) => {
    await deleteDailyChallengeCompletion(userId, challengeId);
    await loginViaUI(page, email, TEST_PASSWORD);

    const response = await page.request.get("/api/daily-challenge");
    expect(response.status()).toBe(200);
    const body = (await response.json()) as {
      challenge: { question: string; correct?: number; completion?: unknown };
    };

    expect(body.challenge.question).toBeTruthy();
    // Should NOT reveal correct answer before user answers
    expect(body.challenge.correct).toBeUndefined();
    expect(body.challenge.completion).toBeUndefined();
  });

  test("GET /api/daily-challenge returns answer + explanation after completion", async ({
    page,
  }) => {
    await deleteDailyChallengeCompletion(userId, challengeId);
    await loginViaUI(page, email, TEST_PASSWORD);

    await page.request.post("/api/daily-challenge", {
      data: { challengeId, chosen: 0 },
    });

    const response = await page.request.get("/api/daily-challenge");
    const body = (await response.json()) as {
      challenge: { correct: number; explanation: string; completion: unknown };
    };

    expect(body.challenge.correct).toBe(0);
    expect(body.challenge.explanation).toBeTruthy();
    expect(body.challenge.completion).toBeTruthy();
  });

  test("unauthenticated POST to /api/daily-challenge returns 401", async ({ page }) => {
    const response = await page.request.post("/api/daily-challenge", {
      data: { challengeId, chosen: 0 },
    });
    expect(response.status()).toBe(401);
  });
});
