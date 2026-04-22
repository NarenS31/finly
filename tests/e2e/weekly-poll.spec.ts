/**
 * Weekly Poll tests.
 * Verifies: poll renders, user can vote, duplicate vote rejected (409),
 * vote counts update, unauthenticated POST rejected.
 */

import { test, expect } from "@playwright/test";
import {
  createTestUser,
  deleteTestUser,
  seedWeeklyPoll,
  deletePollVote,
} from "../helpers/supabase-admin";
import { loginViaUI, uniqueEmail } from "../helpers/auth";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

const TEST_PASSWORD = "TestPass1!";

test.describe("Weekly Poll — public/guest view", () => {
  test("homepage renders weekly poll section", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/weekly poll|what would you do/i).first()).toBeVisible();
  });

  test("GET /api/poll returns poll or null", async ({ page }) => {
    await page.goto("/");
    const response = await page.request.get("/api/poll");
    expect(response.status()).toBe(200);
    const body = (await response.json()) as { poll: unknown };
    expect(body).toHaveProperty("poll");
  });
});

test.describe("Weekly Poll — authenticated", () => {
  let userId: string;
  let email: string;
  let pollId: string;

  test.beforeAll(async () => {
    email = uniqueEmail("poll");
    const user = await createTestUser(email, TEST_PASSWORD, "PollTester");
    userId = user.id;
    pollId = await seedWeeklyPoll();
  });

  test.afterAll(async () => {
    await deletePollVote(userId, pollId);
    await deleteTestUser(userId);
  });

  test("authenticated user can cast a vote", async ({ page }) => {
    await deletePollVote(userId, pollId);
    await loginViaUI(page, email, TEST_PASSWORD);

    const response = await page.request.post("/api/poll", {
      data: { pollId, optionIdx: 0 },
    });

    expect(response.status()).toBe(200);
    const body = (await response.json()) as { ok: boolean };
    expect(body.ok).toBe(true);
  });

  test("casting same vote twice returns 409 Already voted", async ({ page }) => {
    await deletePollVote(userId, pollId);
    await loginViaUI(page, email, TEST_PASSWORD);

    await page.request.post("/api/poll", { data: { pollId, optionIdx: 0 } });

    const secondVote = await page.request.post("/api/poll", {
      data: { pollId, optionIdx: 1 },
    });
    expect(secondVote.status()).toBe(409);
  });

  test("GET /api/poll returns myVote after voting", async ({ page }) => {
    await deletePollVote(userId, pollId);
    await loginViaUI(page, email, TEST_PASSWORD);

    await page.request.post("/api/poll", { data: { pollId, optionIdx: 2 } });

    const response = await page.request.get("/api/poll");
    const body = (await response.json()) as {
      poll: { myVote: number; counts: number[]; total: number };
    };
    expect(body.poll.myVote).toBe(2);
    expect(body.poll.total).toBeGreaterThan(0);
  });

  test("unauthenticated POST to /api/poll returns 401", async ({ page }) => {
    const response = await page.request.post("/api/poll", {
      data: { pollId, optionIdx: 0 },
    });
    expect(response.status()).toBe(401);
  });
});
