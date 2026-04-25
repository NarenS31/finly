import type { Locator, Page } from "@playwright/test";

export const routes = {
  home: "/",
  login: "/auth/login",
  signup: "/auth/signup",
  dashboard: "/dashboard",
  profile: "/profile",
  classes: "/classes",
  join: "/join",
  learn: "/learn",
};

export function classCodeInput(page: Page): Locator {
  return page.locator("input[maxlength='6']").first();
}

export function newClassButton(page: Page): Locator {
  return page
    .getByRole("button", { name: /new class|create your first class/i })
    .first();
}

export function createClassButton(page: Page): Locator {
  return page.getByRole("button", { name: /create class/i }).first();
}

export function classNameInput(page: Page): Locator {
  return page.getByPlaceholder(/class name|period/i).first();
}

export function displayNameInput(page: Page): Locator {
  return page.locator('div:has(> label:text-is("Display name")) input').first();
}

export function currencySelect(page: Page): Locator {
  return page.locator("select").first();
}

export function newGoalButton(page: Page): Locator {
  return page.getByRole("button", { name: /new goal/i }).first();
}

export function dailyChallengeCard(page: Page): Locator {
  return page
    .locator("div.rounded-2xl")
    .filter({ hasText: /daily challenge/i })
    .first();
}

export function weeklyPollCard(page: Page): Locator {
  return page
    .locator("div.rounded-2xl")
    .filter({ hasText: /what would you do/i })
    .first();
}
