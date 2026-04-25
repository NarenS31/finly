import { test, expect } from "@playwright/test";
import {
  createTestClass,
  deleteTestClass,
  getClassMembers,
} from "../helpers/supabase-admin";
import {
  createAuthedContext,
  loginViaUi,
} from "../fixtures/auth";
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

test.describe("Collaboration", () => {
  let teacher: FinlyTestUser;
  let student: FinlyTestUser;
  let classSystemReady = false;
  let probeClassId = "";

  test.beforeAll(async () => {
    teacher = await provisionUser({
      role: "teacher",
      prefix: "collab_teacher",
      displayName: "Collab Teacher",
    });
    student = await provisionUser({
      role: "student",
      prefix: "collab_student",
      displayName: "Collab Student",
    });

    try {
      const probe = await createTestClass(teacher.id, "Collaboration Probe");
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
    await cleanupUsers([teacher, student]);
  });

  test("teacher-created class code can be consumed by a student and reflected back to the teacher", async ({
    browser,
    page,
  }) => {
    test.skip(
      !classSystemReady,
      "Class schema or RPCs are not available in this Supabase environment."
    );

    const className = `Collab ${Date.now()}`;

    await loginViaUi(page, teacher, { next: "/classes", waitFor: /\/classes/ });
    await newClassButton(page).click();
    await classNameInput(page).fill(className);
    await createClassButton(page).click();

    const classCard = page.locator("div").filter({ hasText: className }).first();
    await expect(classCard).toBeVisible({ timeout: 15_000 });
    const cardText = (await classCard.textContent()) ?? "";
    const classCode = cardText.match(/[A-Z0-9]{6}/)?.[0];
    expect(classCode).toBeTruthy();

    const viewProgressLink = classCard.getByRole("link", { name: /view progress/i });
    const href = await viewProgressLink.getAttribute("href");
    const classId = href?.split("/").pop() ?? "";
    expect(classId).toBeTruthy();

    const studentContext = await createAuthedContext(browser, student, {
      next: "/join",
      waitFor: /\/join/,
    });
    const studentPage = await studentContext.newPage();
    await studentPage.goto("/join");
    await classCodeInput(studentPage).fill(classCode!);
    await studentPage.getByRole("button", { name: /join class/i }).click();
    await studentPage.waitForURL(/\/learn/, { timeout: 20_000 });
    await expect(
      studentPage.getByText(/joined the class|teacher's dashboard/i)
    ).toBeVisible({ timeout: 10_000 });

    await studentPage.goto("/join");
    await classCodeInput(studentPage).fill(classCode!);
    await studentPage.getByRole("button", { name: /join class/i }).click();
    await studentPage.waitForURL(/\/learn/, { timeout: 20_000 });

    const members = await getClassMembers(classId);
    const studentOccurrences = members.filter((id) => id === student.id);
    expect(studentOccurrences).toHaveLength(1);

    await page.goto(`/classes/${classId}`);
    await expect(page.getByText(student.displayName)).toBeVisible({ timeout: 15_000 });

    await studentPage.reload();
    await expect(studentPage).toHaveURL(/\/join|\/learn/);

    await studentContext.close();

    if (classId !== probeClassId) {
      await deleteTestClass(classId);
    }
  });
});
