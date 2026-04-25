import { test, expect } from "@playwright/test";
import { getUserProfile } from "../helpers/supabase-admin";
import {
  completeOnboarding,
  deleteAccountViaProfile,
  expectGuestRedirect,
  loginViaUi,
  signUpViaUi,
} from "../fixtures/auth";
import {
  cleanupUser,
  deleteUserByEmail,
  provisionUser,
  uniqueEmail,
  DEFAULT_PASSWORD,
} from "../fixtures/users";

test.describe("Authentication", () => {
  test("signup validates password strength and required terms", async ({
    page,
  }) => {
    await page.goto("/auth/signup");
    await page.getByPlaceholder(/display name/i).fill("QA Signup");
    await page.getByPlaceholder("Email").fill(uniqueEmail("signup"));
    await page.getByPlaceholder("Password").fill("abc");
    await page.getByRole("button", { name: /create account/i }).click();

    await expect(page.getByText(/please accept/i)).toBeVisible();

    await page.locator('input[type="checkbox"]').first().check();
    await page.getByRole("button", { name: /create account/i }).click();
    await expect(page.getByText(/stronger password/i)).toBeVisible();
  });

  test("duplicate signup does not create an authenticated session", async ({
    page,
  }) => {
    const existing = await provisionUser({
      role: "learner",
      prefix: "duplicate_signup",
      displayName: "Duplicate Signup",
    });

    try {
      await signUpViaUi(page, {
        displayName: "Duplicate Signup",
        email: existing.email,
        password: DEFAULT_PASSWORD,
      });

      await page.waitForURL(/\/auth\/login/, { timeout: 15_000 });
      await expect(page).not.toHaveURL(/\/onboarding/);
      await expect(
        page.getByText(/check your inbox|confirm your email/i)
      ).toBeVisible();
    } finally {
      await cleanupUser(existing);
    }
  });

  test("guest is redirected away from protected routes", async ({ page }) => {
    await expectGuestRedirect(page, "/dashboard");
    await expectGuestRedirect(page, "/profile");
    await expectGuestRedirect(page, "/classes");
  });

  test("confirmed user can log in, refresh, and regain access in a new context", async ({
    browser,
    page,
  }) => {
    const user = await provisionUser({
      role: "learner",
      prefix: "login_refresh",
      displayName: "Login Refresh",
    });

    try {
      await loginViaUi(page, user, { next: "/dashboard", waitFor: /\/dashboard/ });
      await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();

      await page.reload();
      await expect(page).toHaveURL(/\/dashboard/);

      const freshContext = await browser.newContext();
      const freshPage = await freshContext.newPage();
      await loginViaUi(freshPage, user, {
        next: "/profile",
        waitFor: /\/profile/,
      });
      await expect(freshPage).toHaveURL(/\/profile/);
      await freshContext.close();
    } finally {
      await cleanupUser(user);
    }
  });

  test("invalid credentials do not create a session", async ({ page }) => {
    const user = await provisionUser({
      role: "learner",
      prefix: "bad_login",
      displayName: "Bad Login",
    });

    try {
      await page.goto("/auth/login");
      await page.getByPlaceholder("Email").fill(user.email);
      await page.getByPlaceholder("Password").fill("WrongPassword99!");
      await page.getByRole("button", { name: /^log in$/i }).click();

      await expect(
        page.getByText(/invalid|incorrect|email.*confirm/i)
      ).toBeVisible({ timeout: 15_000 });
      await expect(page).not.toHaveURL(/\/dashboard/);
    } finally {
      await cleanupUser(user);
    }
  });

  test("new user signup can enter onboarding or confirmation-required login", async ({
    page,
  }) => {
    const email = uniqueEmail("signup_happy");

    try {
      await signUpViaUi(page, {
        displayName: "Happy Signup",
        email,
        password: DEFAULT_PASSWORD,
      });

      const outcome = await Promise.race([
        page
          .waitForURL(/\/(onboarding|auth\/login)/, { timeout: 20_000 })
          .then(() => "navigated" as const)
          .catch(() => null),
        page
          .getByText(/rate limit exceeded/i)
          .waitFor({ state: "visible", timeout: 20_000 })
          .then(() => "rate_limit" as const)
          .catch(() => null),
      ]);

      if (outcome === "rate_limit") {
        test.skip(
          true,
          "Supabase auth email rate limit is exceeded in the current environment."
        );
      }

      expect(outcome).toBe("navigated");

      if (/\/onboarding/.test(page.url())) {
        await completeOnboarding(page, { tier: "13-17" });
        await expect(page).toHaveURL(/\/learn(\/|\?)/);
      } else {
        await expect(
          page.getByText(/check your inbox|confirm your email/i)
        ).toBeVisible();
      }
    } finally {
      await deleteUserByEmail(email);
    }
  });

  test("profile account deletion returns the user to guest mode", async ({
    page,
  }) => {
    const user = await provisionUser({
      role: "learner",
      prefix: "delete_account",
      displayName: "Delete Me",
    });

    try {
      await loginViaUi(page, user, { next: "/profile", waitFor: /\/profile/ });
      await deleteAccountViaProfile(page);
      await page.goto("/dashboard");
      await expect(page).toHaveURL(/\/auth\/login/);
    } finally {
      const remainingProfile = await getUserProfile(user.id);
      if (remainingProfile?.id) {
        await cleanupUser(user);
      }
    }
  });
});
