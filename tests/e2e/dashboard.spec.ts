/**
 * Dashboard tests — authenticated user view.
 * Verifies XP display, streak, quick actions, profile teaser,
 * redirect for unauthenticated users.
 */

import { test, expect } from "@playwright/test";
import { createTestUser, deleteTestUser, setUserXp } from "../helpers/supabase-admin";
import { loginViaUI, uniqueEmail } from "../helpers/auth";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

const TEST_PASSWORD = "TestPass1!";

test.describe("Dashboard — unauthenticated", () => {
  test("redirects to /auth/login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});

test.describe("Dashboard — authenticated", () => {
  let userId: string;
  let email: string;

  test.beforeAll(async () => {
    email = uniqueEmail("dash");
    const user = await createTestUser(email, TEST_PASSWORD, "DashTester");
    userId = user.id;
  });

  test.afterAll(async () => {
    await deleteTestUser(userId);
  });

  test("dashboard loads after login", async ({ page }) => {
    await loginViaUI(page, email, TEST_PASSWORD);
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole("heading").first()).toBeVisible();
  });

  test("dashboard shows XP display", async ({ page }) => {
    await loginViaUI(page, email, TEST_PASSWORD);
    await expect(page.getByText(/xp/i).first()).toBeVisible();
  });

  test("dashboard shows streak section", async ({ page }) => {
    await loginViaUI(page, email, TEST_PASSWORD);
    await expect(page.getByText(/streak/i).first()).toBeVisible();
  });

  test("dashboard has link to Learn page", async ({ page }) => {
    await loginViaUI(page, email, TEST_PASSWORD);
    await expect(page.getByRole("link", { name: /learn|lessons|start/i }).first()).toBeVisible();
  });

  test("dashboard XP reflects actual DB value after update", async ({ page }) => {
    await setUserXp(userId, 150);
    await loginViaUI(page, email, TEST_PASSWORD);
    // Page should show 150 XP somewhere — use first() to avoid strict mode
    await expect(page.getByText(/150/).first()).toBeVisible({ timeout: 8_000 });
  });

  test("dashboard persists after page refresh", async ({ page }) => {
    await loginViaUI(page, email, TEST_PASSWORD);
    await page.reload();
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText(/xp/i).first()).toBeVisible();
  });

  test("dashboard shows user display name", async ({ page }) => {
    await loginViaUI(page, email, TEST_PASSWORD);
    await expect(page.getByText(/DashTester/i).first()).toBeVisible({ timeout: 8_000 });
  });
});
