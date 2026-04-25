import { test, expect } from "@playwright/test";
import {
  deleteDailyChallengeCompletion,
  deletePollVote,
  seedDailyChallenge,
  seedWeeklyPoll,
} from "../helpers/supabase-admin";
import { createAuthedContext, loginViaUi } from "../fixtures/auth";
import {
  cleanupUsers,
  provisionUser,
  type FinlyTestUser,
} from "../fixtures/users";
import {
  currencySelect,
  dailyChallengeCard,
  displayNameInput,
  newGoalButton,
  weeklyPollCard,
} from "../helpers/selectors";

test.describe("Persistence", () => {
  let user: FinlyTestUser;
  let challengeId = "";
  let pollId = "";

  test.beforeAll(async () => {
    user = await provisionUser({
      role: "learner",
      prefix: "persist_user",
      displayName: "Persist User",
    });
    challengeId = await seedDailyChallenge();
    pollId = await seedWeeklyPoll();
    await deleteDailyChallengeCompletion(user.id, challengeId);
    await deletePollVote(user.id, pollId);
  });

  test.afterAll(async () => {
    try {
      await deleteDailyChallengeCompletion(user.id, challengeId);
    } catch {}
    try {
      await deletePollVote(user.id, pollId);
    } catch {}
    await cleanupUsers([user]);
  });

  test("profile display name and currency persist after refresh and relogin", async ({
    browser,
    page,
  }) => {
    await loginViaUi(page, user, { next: "/profile", waitFor: /\/profile/ });

    const newName = `Persisted ${Date.now()}`;
    await displayNameInput(page).fill(newName);
    await Promise.all([
      page.waitForResponse(
        (response) =>
          response.url().includes("/api/profile") &&
          response.request().method() === "PATCH"
      ),
      displayNameInput(page).blur(),
    ]);

    const currencySave = page.waitForResponse(
      (response) =>
        response.url().includes("/api/profile") &&
        response.request().method() === "PATCH"
    );
    await currencySelect(page).selectOption("NGN");
    await currencySave;

    await page.reload();
    await expect(displayNameInput(page)).toHaveValue(newName);
    await expect(currencySelect(page)).toHaveValue("NGN");

    const freshContext = await createAuthedContext(browser, user, {
      next: "/profile",
      waitFor: /\/profile/,
    });
    const [freshPage] = freshContext.pages();
    await freshPage.goto("/profile");
    await expect(displayNameInput(freshPage)).toHaveValue(newName);
    await expect(currencySelect(freshPage)).toHaveValue("NGN");
    await freshContext.close();
  });

  test("money goals remain visible after refresh and relogin", async ({
    browser,
    page,
  }) => {
    const goalName = `Bike Fund ${Date.now()}`;
    await loginViaUi(page, user, { next: "/profile", waitFor: /\/profile/ });

    await newGoalButton(page).click();
    await page.getByPlaceholder(/goal name/i).fill(goalName);
    await page.getByPlaceholder(/target amount/i).fill("250");
    await page.getByRole("button", { name: /add goal/i }).click();

    await expect(page.getByText(goalName)).toBeVisible({ timeout: 10_000 });
    await page.reload();
    await expect(page.getByText(goalName)).toBeVisible({ timeout: 10_000 });

    const freshContext = await createAuthedContext(browser, user, {
      next: "/profile",
      waitFor: /\/profile/,
    });
    const [freshPage] = freshContext.pages();
    await freshPage.goto("/profile");
    await expect(freshPage.getByText(goalName)).toBeVisible({ timeout: 10_000 });
    await freshContext.close();
  });

  test("daily challenge completion survives refresh and relogin", async ({
    browser,
    page,
  }) => {
    await deleteDailyChallengeCompletion(user.id, challengeId);
    await loginViaUi(page, user, { next: "/", waitFor: /\/$/ });

    const challenge = dailyChallengeCard(page);
    await challenge.locator("button").first().click();
    await expect(challenge.getByText(/correct|not quite|here's why/i)).toBeVisible({
      timeout: 10_000,
    });

    await page.reload();
    await expect(challenge.getByText(/correct|not quite|here's why/i)).toBeVisible({
      timeout: 10_000,
    });

    const freshContext = await createAuthedContext(browser, user, {
      next: "/",
      waitFor: /\/$/,
    });
    const [freshPage] = freshContext.pages();
    await freshPage.goto("/");
    await expect(
      dailyChallengeCard(freshPage).getByText(/correct|not quite|here's why/i)
    ).toBeVisible({ timeout: 10_000 });
    await freshContext.close();
  });

  test("weekly poll vote survives refresh and relogin", async ({
    browser,
    page,
  }) => {
    await deletePollVote(user.id, pollId);
    await loginViaUi(page, user, { next: "/", waitFor: /\/$/ });

    const poll = weeklyPollCard(page);
    await poll.locator("button").first().click();
    await expect(poll.getByText(/vote|votes/i)).toBeVisible({ timeout: 10_000 });

    await page.reload();
    await expect(poll.getByText(/vote|votes/i)).toBeVisible({ timeout: 10_000 });

    const freshContext = await createAuthedContext(browser, user, {
      next: "/",
      waitFor: /\/$/,
    });
    const [freshPage] = freshContext.pages();
    await freshPage.goto("/");
    await expect(weeklyPollCard(freshPage).getByText(/vote|votes/i)).toBeVisible({
      timeout: 10_000,
    });
    await freshContext.close();
  });
});
