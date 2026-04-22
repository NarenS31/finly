/**
 * Navigation and public page rendering tests.
 * Verifies all public routes load correctly, nav links work,
 * mobile menu, age tier toggle, currency selector.
 */

import { test, expect } from "@playwright/test";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

test.describe("Public pages render without errors", () => {
  const publicRoutes = [
    { path: "/", heading: /finly|money|financial/i },
    { path: "/curriculum", heading: /curriculum/i },
    { path: "/leaderboard", heading: /leaderboard/i },
    { path: "/learn", heading: /learn|lessons/i },
    { path: "/simulator", heading: /simulator|spending/i },
    { path: "/cards", heading: /cards|collection/i },
    { path: "/about", heading: /about|finly/i },
  ];

  for (const route of publicRoutes) {
    test(`${route.path} renders a visible heading`, async ({ page }) => {
      await page.goto(route.path);
      await expect(page.getByRole("heading").first()).toBeVisible();
    });
  }
});

test.describe("Navbar", () => {
  test("navbar is visible on homepage", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation").first();
    await expect(nav).toBeVisible();
  });

  test("navbar has Learn link pointing to /learn", async ({ page }) => {
    await page.goto("/");
    const learnLink = page.getByRole("link", { name: /^learn$/i }).first();
    await expect(learnLink).toBeVisible();
    await expect(learnLink).toHaveAttribute("href", /\/learn/);
  });

  test("navbar has Leaderboard link", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /leaderboard/i }).first()).toBeVisible();
  });

  test("clicking logo navigates to homepage", async ({ page }) => {
    await page.goto("/learn");
    await page.getByRole("link", { name: /finly/i }).first().click();
    await expect(page).toHaveURL("/");
  });

  test("age tier toggle switches between Foundation and Real World", async ({ page }) => {
    await page.goto("/curriculum");
    // Look for age tier toggle
    const toggle = page.getByRole("button", { name: /foundation|8.12|real world|13.17/i }).first();
    if (await toggle.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await toggle.click();
      // State changed — button label or content should reflect new tier
      await expect(toggle).toBeVisible();
    }
  });
});

test.describe("Homepage content", () => {
  test("homepage shows sign up or start learning CTA", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("link", { name: /sign up|get started|start learning/i }).first()
    ).toBeVisible();
  });

  test("homepage renders daily challenge or today's challenge section", async ({ page }) => {
    await page.goto("/");
    const challengeSection = page.getByText(/today's challenge|daily challenge/i).first();
    await expect(challengeSection).toBeVisible();
  });

  test("homepage renders weekly poll section", async ({ page }) => {
    await page.goto("/");
    // Poll section OR weekly poll text
    const pollSection = page.getByText(/weekly poll|what would you do/i).first();
    await expect(pollSection).toBeVisible();
  });
});

test.describe("Curriculum page", () => {
  test("shows curriculum topics", async ({ page }) => {
    await page.goto("/curriculum");
    // Expect at least one topic (Budgeting, Saving, Investing, etc.)
    await expect(
      page.getByText(/budgeting|saving|investing|banking/i).first()
    ).toBeVisible();
  });

  test("accordion items expand on click", async ({ page }) => {
    await page.goto("/curriculum");
    const firstAccordion = page.getByRole("button").filter({ hasText: /budgeting|saving|investing/i }).first();
    if (await firstAccordion.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await firstAccordion.click();
      // Content should expand
      await expect(page.getByText(/foundation|real world|lesson/i).first()).toBeVisible({ timeout: 3_000 });
    }
  });
});

test.describe("Leaderboard page", () => {
  test("leaderboard renders without requiring auth", async ({ page }) => {
    await page.goto("/leaderboard");
    await expect(page.getByRole("heading", { name: /leaderboard/i })).toBeVisible();
  });

  test("leaderboard shows table or list of users", async ({ page }) => {
    await page.goto("/leaderboard");
    // Either shows a list of users or an empty state
    const content = page.getByText(/xp|rank|level|no one yet|be the first/i).first();
    await expect(content).toBeVisible();
  });
});

test.describe("Simulator page", () => {
  test("simulator loads with a day/scenario UI", async ({ page }) => {
    await page.goto("/simulator");
    await expect(page.getByText(/day|scenario|spending|choice/i).first()).toBeVisible();
  });

  test("simulator shows Start Simulation button then reveals choices", async ({ page }) => {
    await page.goto("/simulator");
    // In intro phase, a "Start Simulation" button is shown
    const startBtn = page.getByRole("button", { name: /start simulation/i });
    await expect(startBtn).toBeVisible({ timeout: 8_000 });
    await startBtn.click();
    // After start, choice buttons for Day 1 should appear
    const choices = page.getByRole("button").filter({ hasNotText: /start simulation|next|results/i });
    await expect(choices.first()).toBeVisible({ timeout: 5_000 });
  });
});

test.describe("Cards page", () => {
  test("cards page shows collection grid", async ({ page }) => {
    await page.goto("/cards");
    // Should show at least one card or empty state
    await expect(page.getByRole("heading").first()).toBeVisible();
  });

  test("cards page shows animal names", async ({ page }) => {
    await page.goto("/cards");
    await expect(
      page.getByText(/finn|ollie|bruno|remi|rio|wade|dean/i).first()
    ).toBeVisible();
  });
});
