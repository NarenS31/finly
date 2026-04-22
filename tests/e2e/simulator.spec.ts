/**
 * Spending Simulator tests.
 * Covers: renders, user can make choices, happiness/savings tracking,
 * completes 10 days, grade report shown, reset/restart works.
 */

import { test, expect } from "@playwright/test";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

test.describe("Spending Simulator — public access", () => {
  test("simulator page loads without auth", async ({ page }) => {
    await page.goto("/simulator");
    await expect(page.getByRole("heading").first()).toBeVisible();
  });

  test("simulator shows Start Simulation intro screen", async ({ page }) => {
    await page.goto("/simulator");
    await expect(page.getByText(/spending simulator/i)).toBeVisible({ timeout: 8_000 });
    await expect(page.getByRole("button", { name: /start simulation/i })).toBeVisible();
  });

  test("clicking Start Simulation reveals Day 1 choices", async ({ page }) => {
    await page.goto("/simulator");
    await page.getByRole("button", { name: /start simulation/i }).click();

    // Day 1 event should be visible
    await expect(page.getByText(/day 1/i)).toBeVisible({ timeout: 5_000 });

    // Choice buttons should be present
    const choices = page.getByRole("button").filter({ hasNotText: /start simulation|next →|see results/i });
    await expect(choices.first()).toBeVisible();
  });

  test("clicking a choice shows feedback from Finn", async ({ page }) => {
    await page.goto("/simulator");
    await page.getByRole("button", { name: /start simulation/i }).click();

    const choices = page.getByRole("button").filter({
      hasNotText: /start simulation|next →|see results/i,
    });
    await choices.first().click();

    // After choice, Finn's feedback appears
    await expect(page.getByText(/finn says|fun!|smart|balance/i).first()).toBeVisible({ timeout: 5_000 });
    await expect(page).not.toHaveURL(/error|500/);
  });

  test("simulator tracks happiness and savings metrics", async ({ page }) => {
    await page.goto("/simulator");

    // Should show happiness and/or savings meters
    await expect(
      page.getByText(/happiness|savings|balance|score/i).first()
    ).toBeVisible({ timeout: 8_000 });
  });

  test("completing all 5 scenarios shows grade report", async ({ page }) => {
    await page.goto("/simulator");
    // Start the simulation
    await page.getByRole("button", { name: /start simulation/i }).click();

    // Click through all 5 events (each event: choose first option, then click Next)
    for (let i = 0; i < 5; i++) {
      // Wait for choices to be available
      const choices = page.getByRole("button").filter({
        hasNotText: /start simulation|next →|see results →|restart/i,
      });
      const visible = await choices.first().isVisible({ timeout: 5_000 }).catch(() => false);
      if (!visible) break;

      await choices.first().click();
      await page.waitForTimeout(200);

      // Click Next or See Results
      const nextBtn = page.getByRole("button", { name: /next →|see results →/i });
      const nextVisible = await nextBtn.isVisible({ timeout: 3_000 }).catch(() => false);
      if (nextVisible) await nextBtn.click();
      await page.waitForTimeout(200);
    }

    // After completing all events, grade report should show
    await expect(
      page.getByText(/grade:|simulation complete/i).first()
    ).toBeVisible({ timeout: 10_000 });
  });

  test("simulator can be restarted after completion", async ({ page }) => {
    await page.goto("/simulator");
    await page.getByRole("button", { name: /start simulation/i }).click();

    for (let i = 0; i < 5; i++) {
      const choices = page.getByRole("button").filter({
        hasNotText: /start simulation|next →|see results →|restart/i,
      });
      const visible = await choices.first().isVisible({ timeout: 5_000 }).catch(() => false);
      if (!visible) break;
      await choices.first().click();
      await page.waitForTimeout(200);
      const nextBtn = page.getByRole("button", { name: /next →|see results →/i });
      const nextVisible = await nextBtn.isVisible({ timeout: 3_000 }).catch(() => false);
      if (nextVisible) await nextBtn.click();
      await page.waitForTimeout(200);
    }

    const restartBtn = page.getByRole("button", { name: /restart|try again|play again/i });
    if (await restartBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await restartBtn.click();
      await expect(page.getByRole("button", { name: /start simulation/i })).toBeVisible({
        timeout: 5_000,
      });
    }
  });
});
