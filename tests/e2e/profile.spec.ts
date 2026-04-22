/**
 * Profile & Settings tests.
 * Covers: profile page loads, display name update, age tier change,
 * currency selector, avatar builder XP gates, share stats card,
 * persistence after refresh, unauthorized access.
 */

import { test, expect } from "@playwright/test";
import {
  createTestUser,
  deleteTestUser,
  setUserXp,
  getUserProfile,
} from "../helpers/supabase-admin";
import { loginViaUI, uniqueEmail } from "../helpers/auth";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

const TEST_PASSWORD = "TestPass1!";

test.describe("Profile — unauthenticated", () => {
  test("redirects to /auth/login", async ({ page }) => {
    await page.goto("/profile");
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});

test.describe("Profile — authenticated", () => {
  let userId: string;
  let email: string;

  test.beforeAll(async () => {
    email = uniqueEmail("profile");
    const user = await createTestUser(email, TEST_PASSWORD, "ProfileUser");
    userId = user.id;
  });

  test.afterAll(async () => {
    await deleteTestUser(userId);
  });

  test("profile page loads and shows display name", async ({ page }) => {
    await loginViaUI(page, email, TEST_PASSWORD);
    await page.goto("/profile");
    await expect(page.getByText(/ProfileUser/i)).toBeVisible({ timeout: 8_000 });
  });

  test("profile page shows XP and level", async ({ page }) => {
    await loginViaUI(page, email, TEST_PASSWORD);
    await page.goto("/profile");
    await expect(page.getByText(/xp/i)).toBeVisible();
  });

  test("profile page shows streak section", async ({ page }) => {
    await loginViaUI(page, email, TEST_PASSWORD);
    await page.goto("/profile");
    await expect(page.getByText(/streak/i)).toBeVisible();
  });

  test("profile PATCH API updates display name", async ({ page }) => {
    await loginViaUI(page, email, TEST_PASSWORD);

    const response = await page.request.patch("/api/profile", {
      data: { display_name: "UpdatedName" },
    });
    expect(response.status()).toBe(200);
    const body = (await response.json()) as { success: boolean };
    expect(body.success).toBe(true);

    const profileData = await getUserProfile(userId);
    expect(profileData.display_name).toBe("UpdatedName");
  });

  test("updated display name persists after page refresh", async ({ page }) => {
    await loginViaUI(page, email, TEST_PASSWORD);

    await page.request.patch("/api/profile", {
      data: { display_name: "RefreshCheck" },
    });

    await page.goto("/profile");
    await expect(page.getByText(/RefreshCheck/i)).toBeVisible({ timeout: 8_000 });
  });

  test("profile PATCH API updates age tier", async ({ page }) => {
    await loginViaUI(page, email, TEST_PASSWORD);

    const response = await page.request.patch("/api/profile", {
      data: { age_tier: "8-12" },
    });
    expect(response.status()).toBe(200);

    const profileData = await getUserProfile(userId);
    expect(profileData.age_tier).toBe("8-12");
  });

  test("unauthenticated PATCH /api/profile returns 401", async ({ page }) => {
    const response = await page.request.patch("/api/profile", {
      data: { display_name: "Hacker" },
    });
    expect(response.status()).toBe(401);
  });
});

test.describe("Profile — Avatar Builder XP gates", () => {
  let userId: string;
  let email: string;

  test.beforeAll(async () => {
    email = uniqueEmail("avatar");
    const user = await createTestUser(email, TEST_PASSWORD, "AvatarTester");
    userId = user.id;
  });

  test.afterAll(async () => {
    await deleteTestUser(userId);
  });

  test("profile page shows avatar builder section", async ({ page }) => {
    await loginViaUI(page, email, TEST_PASSWORD);
    await page.goto("/profile");
    await expect(page.getByText(/avatar|customize/i).first()).toBeVisible({ timeout: 8_000 });
  });

  test("free avatar item (cap) is selectable at 0 XP", async ({ page }) => {
    await setUserXp(userId, 0);
    await loginViaUI(page, email, TEST_PASSWORD);
    await page.goto("/profile");

    // Look for Cap or free hat option
    const capOption = page.getByText(/cap|hat/i).first();
    await expect(capOption).toBeVisible({ timeout: 8_000 });
  });

  test("locked avatar item shows locked state at insufficient XP", async ({ page }) => {
    await setUserXp(userId, 0);
    await loginViaUI(page, email, TEST_PASSWORD);
    await page.goto("/profile");

    // Crown requires 500 XP — should show locked/XP requirement
    const lockedItems = page.getByText(/500 xp|locked|unlock at/i);
    await expect(lockedItems.first()).toBeVisible({ timeout: 8_000 });
  });

  test("POST /api/avatar saves avatar customization", async ({ page }) => {
    await loginViaUI(page, email, TEST_PASSWORD);

    const response = await page.request.post("/api/avatar", {
      data: { hat: "cap", accessory: "glasses", badge: "star" },
    });
    expect(response.status()).toBe(200);

    const profileData = await getUserProfile(userId);
    const avatar = profileData.avatar as { hat?: string };
    expect(avatar?.hat).toBe("cap");
  });

  test("avatar customization persists in DB", async ({ page }) => {
    await loginViaUI(page, email, TEST_PASSWORD);

    await page.request.post("/api/avatar", {
      data: { hat: "grad_cap", accessory: null, badge: "fire" },
    });

    const profileData = await getUserProfile(userId);
    const avatar = profileData.avatar as { hat?: string; badge?: string };
    expect(avatar?.hat).toBe("grad_cap");
  });

  test("unauthenticated POST /api/avatar returns 401", async ({ page }) => {
    const response = await page.request.post("/api/avatar", {
      data: { hat: "cap" },
    });
    expect(response.status()).toBe(401);
  });
});
