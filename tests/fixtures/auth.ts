import type { Browser, BrowserContext, Page } from "@playwright/test";
import { expect } from "@playwright/test";
import type { FinlyTestUser } from "./users";

export async function loginViaUi(
  page: Page,
  user: Pick<FinlyTestUser, "email" | "password">,
  options?: { next?: string; waitFor?: RegExp }
): Promise<void> {
  const nextQuery = options?.next
    ? `?next=${encodeURIComponent(options.next)}`
    : "";
  await page.goto(`/auth/login${nextQuery}`);
  await page.getByPlaceholder("Email").fill(user.email);
  await page.getByPlaceholder("Password").fill(user.password);
  await page.getByRole("button", { name: /^log in$/i }).click();
  await page.waitForURL(options?.waitFor ?? /\/(dashboard|onboarding|learn|profile)/, {
    timeout: 25_000,
  });
}

export async function signUpViaUi(
  page: Page,
  options: {
    displayName: string;
    email: string;
    password: string;
    ageTier?: "8-12" | "13-17";
    acceptTerms?: boolean;
  }
): Promise<void> {
  await page.goto("/auth/signup");
  await page.getByPlaceholder(/display name/i).fill(options.displayName);
  await page.getByPlaceholder("Email").fill(options.email);
  await page.getByPlaceholder("Password").fill(options.password);
  await page
    .locator("select")
    .selectOption(options.ageTier ?? "13-17");

  if (options.acceptTerms !== false) {
    await page.locator('input[type="checkbox"]').first().check();
  }

  await page.getByRole("button", { name: /create account/i }).click();
}

export async function completeOnboarding(
  page: Page,
  options?: {
    tier?: "8-12" | "13-17";
    currencyCode?: string;
    firstLessonLabel?: RegExp;
  }
): Promise<void> {
  const tier = options?.tier ?? "13-17";

  await expect(page).toHaveURL(/\/onboarding/);
  await page.getByRole("button", {
    name: tier === "8-12" ? /foundation/i : /real world/i,
  }).click();

  const currencySelectCard = page
    .getByText(options?.currencyCode ?? "USD")
    .first();
  if (await currencySelectCard.isVisible().catch(() => false)) {
    await currencySelectCard.click();
  }
  await page.getByRole("button", { name: /continue/i }).click();

  const firstLesson = page.getByRole("button", {
    name: options?.firstLessonLabel ?? /compound interest|needs vs wants/i,
  });
  await firstLesson.click();
  await page.getByRole("button", { name: /start learning/i }).click();
  await page.waitForURL(/\/learn(\/|\?)/, { timeout: 20_000 });
}

export async function createAuthedContext(
  browser: Browser,
  user: Pick<FinlyTestUser, "email" | "password">,
  options?: { next?: string; waitFor?: RegExp }
): Promise<BrowserContext> {
  const context = await browser.newContext();
  const page = await context.newPage();
  await loginViaUi(page, user, options);
  return context;
}

export async function deleteAccountViaProfile(page: Page): Promise<void> {
  await page.goto("/profile");
  await page.getByRole("button", { name: /delete account/i }).click();
  await page.getByRole("button", { name: /confirm delete/i }).click();
  await page.waitForURL("/", { timeout: 20_000 });
}

export async function expectGuestRedirect(
  page: Page,
  target: string
): Promise<void> {
  await page.goto(target);
  await expect(page).toHaveURL(/\/auth\/login/);
}
