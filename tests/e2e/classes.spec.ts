import { test, expect } from "@playwright/test";
import {
  createTestClass,
  deleteTestClass,
} from "../helpers/supabase-admin";
import { loginViaUi } from "../fixtures/auth";
import {
  cleanupUsers,
  provisionUser,
  type FinlyTestUser,
} from "../fixtures/users";
import {
  classCodeInput,
  classNameInput,
  createClassButton,
  newClassButton,
} from "../helpers/selectors";

test.describe("Classes", () => {
  let teacher: FinlyTestUser;
  let classSystemReady = false;
  let probeClassId = "";

  test.beforeAll(async () => {
    teacher = await provisionUser({
      role: "teacher",
      prefix: "class_teacher",
      displayName: "Teacher Alpha",
    });

    try {
      const probe = await createTestClass(teacher.id, "Schema Probe");
      probeClassId = probe.id;
      classSystemReady = true;
    } catch {
      classSystemReady = false;
    }
  });

  test.afterAll(async () => {
    if (probeClassId) {
      await deleteTestClass(probeClassId);
    }
    await cleanupUsers([teacher]);
  });

  test("guest access to teacher classes redirects to login", async ({ page }) => {
    await page.goto("/classes");
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test("join page prevents short codes and rejects unknown codes", async ({
    page,
  }) => {
    const learner = await provisionUser({
      role: "learner",
      prefix: "join_invalid",
      displayName: "Join Invalid",
    });

    await loginViaUi(page, learner, { next: "/join", waitFor: /\/join/ });
    await page.goto("/join");
    await classCodeInput(page).fill("AB");
    await expect(page.getByRole("button", { name: /join class/i })).toBeDisabled();

    await classCodeInput(page).fill("ZZZZZZ");
    await page.getByRole("button", { name: /join class/i }).click();

    await expect(
      page.getByText(/class not found|check the code/i)
    ).toBeVisible();

    await cleanupUsers([learner]);
  });

  test("guest entering a valid-looking join code is redirected into signup", async ({
    page,
  }) => {
    await page.goto("/join?code=ABC123");
    await page.getByRole("button", { name: /join class/i }).click();
    await expect(page).toHaveURL(/\/auth\/signup\?redirect=\/join&code=ABC123/);
  });

  test("teacher can create a class and the generated code persists after refresh", async ({
    page,
  }) => {
    test.skip(
      !classSystemReady,
      "Class schema or RPCs are not available in this Supabase environment."
    );

    const className = `QA Class ${Date.now()}`;

    await loginViaUi(page, teacher, { next: "/classes", waitFor: /\/classes/ });
    await newClassButton(page).click();
    await classNameInput(page).fill(className);
    await createClassButton(page).click();

    const classCard = page.locator("div").filter({ hasText: className }).first();
    await expect(classCard).toBeVisible({ timeout: 15_000 });

    const cardText = (await classCard.textContent()) ?? "";
    const classCode = cardText.match(/[A-Z0-9]{6}/)?.[0];
    expect(classCode).toBeTruthy();

    await page.reload();
    await expect(page.locator("div").filter({ hasText: className }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /view progress/i }).first()).toBeVisible();
  });
});
