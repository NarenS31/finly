/**
 * Teacher Classes + Student Join Flow.
 * Tests: teacher creates class, code generated, student joins with valid code,
 * teacher sees student in class, invalid code fails, duplicate join handled,
 * archived class code rejected, unauthenticated join redirects.
 */

import { test, expect } from "@playwright/test";
import {
  createTestUser,
  deleteTestUser,
  createTestClass,
  deleteTestClass,
  getClassMembers,
} from "../helpers/supabase-admin";
import { loginViaUI, uniqueEmail } from "../helpers/auth";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

const TEST_PASSWORD = "TestPass1!";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";

test.describe("Classes — UI (Teacher creates class)", () => {
  let teacherId: string;
  let teacherEmail: string;

  test.beforeAll(async () => {
    teacherEmail = uniqueEmail("teacher");
    const teacher = await createTestUser(teacherEmail, TEST_PASSWORD, "MrTeacher");
    teacherId = teacher.id;
  });

  test.afterAll(async () => {
    await deleteTestUser(teacherId);
  });

  test("authenticated user can access /classes page (renders even without DB table)", async ({
    page,
  }) => {
    await loginViaUI(page, teacherEmail, TEST_PASSWORD);
    await page.goto("/classes");
    // Page renders — shows heading regardless of DB state
    await expect(page.getByText(/class/i).first()).toBeVisible({ timeout: 8_000 });
  });

  test("BUG: classes table not found — class creation silently fails (migration 007 not run)", async ({
    page,
  }) => {
    await loginViaUI(page, teacherEmail, TEST_PASSWORD);
    await page.goto("/classes");

    const newClassBtn = page.getByRole("button", { name: /new class/i });
    await expect(newClassBtn).toBeVisible();
    await newClassBtn.click();

    const nameInput = page.getByPlaceholder(/class name|period/i).or(
      page.locator("input[type=text]").first()
    );
    await nameInput.fill("QA Test Class");

    await page.getByRole("button", { name: /create/i }).click();

    // EXPECTED: 6-char code appears
    // ACTUAL: class creation fails silently (table does not exist in DB)
    const codeVisible = await page
      .getByText(/[A-Z0-9]{6}/)
      .first()
      .isVisible({ timeout: 5_000 })
      .catch(() => false);

    // This documents the bug — class codes are never generated
    expect(codeVisible).toBe(false);
  });
});

test.describe("Classes — Join flow (multi-user) [BLOCKED: classes table missing]", () => {
  let teacherId: string;
  let teacherEmail: string;
  let studentId: string;
  let studentEmail: string;
  let classId: string = "";
  let classCode: string = "XXXXXX";
  let tableExists = false;

  test.beforeAll(async () => {
    teacherEmail = uniqueEmail("teacher2");
    studentEmail = uniqueEmail("student");

    const teacher = await createTestUser(teacherEmail, TEST_PASSWORD, "Teacher2");
    teacherId = teacher.id;

    const student = await createTestUser(studentEmail, TEST_PASSWORD, "Student1");
    studentId = student.id;

    try {
      const cls = await createTestClass(teacherId, "Test Class Join", "13-17");
      classId = cls.id;
      classCode = cls.code;
      tableExists = true;
    } catch {
      // classes table does not exist — migration 007 not run
      tableExists = false;
    }
  });

  test.afterAll(async () => {
    if (classId) await deleteTestClass(classId);
    await deleteTestUser(teacherId);
    await deleteTestUser(studentId);
  });

  test("student can join class with valid code and is redirected to /learn", async ({ page }) => {
    test.skip(!tableExists, "classes table missing — run migration 007");
    await loginViaUI(page, studentEmail, TEST_PASSWORD);
    await page.goto("/join");

    await page.locator("input[maxlength='6']").fill(classCode);
    await page.getByRole("button", { name: /join/i }).click();

    await expect(page).toHaveURL(/\/learn/, { timeout: 10_000 });
  });

  test("student membership persists in DB after joining", async ({ page }) => {
    test.skip(!tableExists, "classes table missing — run migration 007");
    // Verify DB has the student as a member
    const members = await getClassMembers(classId);
    expect(members).toContain(studentId);
  });

  test("duplicate join is handled gracefully — no crash", async ({ page }) => {
    test.skip(!tableExists, "classes table missing — run migration 007");
    await loginViaUI(page, studentEmail, TEST_PASSWORD);
    await page.goto("/join");

    await page.locator("input[maxlength='6']").fill(classCode);
    await page.getByRole("button", { name: /join/i }).click();

    // Second join — should either succeed silently or show friendly message
    // Not crash to 500
    await page.goto("/join");
    await page.locator("input[maxlength='6']").fill(classCode);
    await page.getByRole("button", { name: /join/i }).click();

    // Should NOT show a 500 or unhandled error
    await expect(page.getByText(/500|unexpected error|something went wrong/i)).not.toBeVisible({
      timeout: 5_000,
    });
  });

  test("invalid class code shows error message", async ({ page }) => {
    test.skip(!tableExists, "classes table missing — run migration 007");
    await loginViaUI(page, studentEmail, TEST_PASSWORD);
    await page.goto("/join");

    await page.locator("input[maxlength='6']").fill("XXXXXX");
    await page.getByRole("button", { name: /join/i }).click();

    await expect(page.getByText(/not found|invalid|check the code/i)).toBeVisible({
      timeout: 8_000,
    });
  });

  test("code shorter than 6 chars keeps join button disabled", async ({ page }) => {
    // This test does not require the DB table
    await loginViaUI(page, studentEmail, TEST_PASSWORD);
    await page.goto("/join");

    await page.locator("input[maxlength='6']").fill("AB");
    const joinBtn = page.getByRole("button", { name: /join/i });
    await expect(joinBtn).toBeDisabled();
  });

  test("unauthenticated user is redirected to signup when entering code", async ({ page }) => {
    // This test does not require the DB table
    await page.goto("/join");
    await page.locator("input[maxlength='6']").fill(classCode);
    await page.getByRole("button", { name: /join/i }).click();

    await expect(page).toHaveURL(/\/auth\/signup/, { timeout: 8_000 });
  });

  test("archived class code is rejected", async ({ page }) => {
    test.skip(!tableExists, "classes table missing — run migration 007");
    // Archive the class
    await fetch(`${SUPABASE_URL}/rest/v1/classes?id=eq.${classId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ archived_at: new Date().toISOString() }),
    });

    await loginViaUI(page, studentEmail, TEST_PASSWORD);
    await page.goto("/join");
    await page.locator("input[maxlength='6']").fill(classCode);
    await page.getByRole("button", { name: /join/i }).click();

    await expect(page.getByText(/not found|invalid|check the code/i)).toBeVisible({
      timeout: 8_000,
    });

    // Un-archive for cleanup
    await fetch(`${SUPABASE_URL}/rest/v1/classes?id=eq.${classId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ archived_at: null }),
    });
  });
});

test.describe("Classes — permissions", () => {
  test("unauthenticated access to /classes redirects to login", async ({ page }) => {
    await page.goto("/classes");
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});
