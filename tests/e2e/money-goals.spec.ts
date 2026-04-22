/**
 * Money Goals Tracker tests.
 * Covers: create, read, update progress, delete, completion,
 * persistence after refresh, unauthorized access rejection.
 */

import { test, expect } from "@playwright/test";
import {
  createTestUser,
  deleteTestUser,
  getMoneyGoals,
} from "../helpers/supabase-admin";
import { loginViaUI, uniqueEmail } from "../helpers/auth";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

const TEST_PASSWORD = "TestPass1!";

test.describe("Money Goals — API layer", () => {
  let userId: string;
  let email: string;

  test.beforeAll(async () => {
    email = uniqueEmail("goals");
    const user = await createTestUser(email, TEST_PASSWORD, "GoalsTester");
    userId = user.id;
  });

  test.afterAll(async () => {
    await deleteTestUser(userId);
  });

  test("GET /api/money-goals returns 401 when unauthenticated", async ({ page }) => {
    const response = await page.request.get("/api/money-goals");
    expect(response.status()).toBe(401);
  });

  test("POST /api/money-goals returns 401 when unauthenticated", async ({ page }) => {
    const response = await page.request.post("/api/money-goals", {
      data: { title: "Hack Goal", target_amount: 999 },
    });
    expect(response.status()).toBe(401);
  });

  test("authenticated user can create a money goal", async ({ page }) => {
    await loginViaUI(page, email, TEST_PASSWORD);

    const response = await page.request.post("/api/money-goals", {
      data: { title: "New Bike", target_amount: 200, currency_code: "USD" },
    });

    expect(response.status()).toBe(200);
    const body = (await response.json()) as { goal: { id: string; title: string } };
    expect(body.goal.title).toBe("New Bike");
    expect(body.goal.id).toBeTruthy();
  });

  test("created goal appears in GET /api/money-goals", async ({ page }) => {
    await loginViaUI(page, email, TEST_PASSWORD);

    await page.request.post("/api/money-goals", {
      data: { title: "Concert Ticket", target_amount: 80, currency_code: "USD" },
    });

    const getResponse = await page.request.get("/api/money-goals");
    const body = (await getResponse.json()) as { goals: Array<{ title: string }> };
    const found = body.goals.find((g) => g.title === "Concert Ticket");
    expect(found).toBeTruthy();
  });

  test("PATCH /api/money-goals updates saved_amount", async ({ page }) => {
    await loginViaUI(page, email, TEST_PASSWORD);

    const create = await page.request.post("/api/money-goals", {
      data: { title: "PATCH Test Goal", target_amount: 100 },
    });
    const { goal } = (await create.json()) as { goal: { id: string } };

    const patch = await page.request.patch("/api/money-goals", {
      data: { id: goal.id, saved_amount: 25 },
    });
    expect(patch.status()).toBe(200);
    const patched = (await patch.json()) as { goal: { saved_amount: number } };
    expect(patched.goal.saved_amount).toBe(25);
  });

  test("PATCH /api/money-goals can mark goal as completed", async ({ page }) => {
    await loginViaUI(page, email, TEST_PASSWORD);

    const create = await page.request.post("/api/money-goals", {
      data: { title: "Complete Me", target_amount: 50 },
    });
    const { goal } = (await create.json()) as { goal: { id: string } };

    const patch = await page.request.patch("/api/money-goals", {
      data: { id: goal.id, completed: true },
    });
    const patched = (await patch.json()) as { goal: { completed: boolean } };
    expect(patched.goal.completed).toBe(true);
  });

  test("DELETE /api/money-goals removes the goal", async ({ page }) => {
    await loginViaUI(page, email, TEST_PASSWORD);

    const create = await page.request.post("/api/money-goals", {
      data: { title: "Delete Me Goal", target_amount: 30 },
    });
    const { goal } = (await create.json()) as { goal: { id: string } };

    const del = await page.request.delete("/api/money-goals", {
      data: { id: goal.id },
    });
    expect(del.status()).toBe(200);

    // Verify it's gone
    const goals = await getMoneyGoals(userId);
    const found = (goals as Array<{ id: string }>).find((g) => g.id === goal.id);
    expect(found).toBeUndefined();
  });

  test("user cannot PATCH another user's goal", async ({ page }) => {
    // Create a second user with a goal
    const email2 = uniqueEmail("goals2");
    const user2 = await createTestUser(email2, TEST_PASSWORD, "OtherGoalUser");

    // Create goal as user2 — use admin API directly
    const createRes = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()}/rest/v1/money_goals`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "",
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          user_id: user2.id,
          title: "Private Goal",
          target_amount: 100,
          saved_amount: 0,
          currency_code: "USD",
          completed: false,
        }),
      }
    );
    const [privateGoal] = (await createRes.json()) as Array<{ id: string }>;

    // Login as user1 and try to patch user2's goal
    await loginViaUI(page, email, TEST_PASSWORD);
    const patch = await page.request.patch("/api/money-goals", {
      data: { id: privateGoal.id, saved_amount: 99 },
    });

    // Should return 400 (row not found for this user) or 200 with no rows affected
    // Either way, the private goal should NOT be updated
    const goals2 = await getMoneyGoals(user2.id);
    const unchanged = (goals2 as Array<{ id: string; saved_amount: number }>).find(
      (g) => g.id === privateGoal.id
    );
    expect(unchanged?.saved_amount).not.toBe(99);

    await deleteTestUser(user2.id);
  });

  test("goals persist after page refresh — DB state survives", async ({ page }) => {
    await loginViaUI(page, email, TEST_PASSWORD);

    await page.request.post("/api/money-goals", {
      data: { title: "Persist Check", target_amount: 150 },
    });

    await page.reload();

    const response = await page.request.get("/api/money-goals");
    const body = (await response.json()) as { goals: Array<{ title: string }> };
    const found = body.goals.find((g) => g.title === "Persist Check");
    expect(found).toBeTruthy();
  });
});

test.describe("Money Goals — UI", () => {
  let userId: string;
  let email: string;

  test.beforeAll(async () => {
    email = uniqueEmail("goalsui");
    const user = await createTestUser(email, TEST_PASSWORD, "GoalsUITester");
    userId = user.id;
  });

  test.afterAll(async () => {
    await deleteTestUser(userId);
  });

  test("profile page shows money goals section when authenticated", async ({ page }) => {
    await loginViaUI(page, email, TEST_PASSWORD);
    await page.goto("/profile");
    await expect(
      page.getByText(/money goals|savings goal|goal/i).first()
    ).toBeVisible({ timeout: 8_000 });
  });
});
