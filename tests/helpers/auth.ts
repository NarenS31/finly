/**
 * Auth helpers for Playwright tests.
 * Logs in via the UI login form and saves storage state for reuse.
 */

import { Page } from "@playwright/test";

export async function loginViaUI(
  page: Page,
  email: string,
  password: string
): Promise<void> {
  await page.goto("/auth/login");
  await page.getByPlaceholder("Email").fill(email);
  await page.getByPlaceholder("Password").fill(password);
  await page.getByRole("button", { name: /log in/i }).click();
  await page.waitForURL(/\/(dashboard|onboarding)/, { timeout: 25_000 });
}

export async function logoutViaUI(page: Page): Promise<void> {
  // Try navbar logout button or profile page
  const logoutBtn = page.getByRole("button", { name: /log out/i });
  if (await logoutBtn.isVisible({ timeout: 2_000 }).catch(() => false)) {
    await logoutBtn.click();
    await page.waitForURL("/", { timeout: 8_000 });
  }
}

export function uniqueEmail(prefix = "test"): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}@finlytest.invalid`;
}
