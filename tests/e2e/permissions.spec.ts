import { test, expect } from "@playwright/test";
import {
  createTestClass,
  deleteTestClass,
  getMoneyGoals,
} from "../helpers/supabase-admin";
import { loginViaUi } from "../fixtures/auth";
import {
  cleanupUsers,
  provisionUser,
} from "../fixtures/users";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";

test.describe("Permissions", () => {
  test("protected APIs reject unauthenticated callers", async ({ page }) => {
    const checks = await Promise.all([
      page.request.patch("/api/profile", { data: { display_name: "Nope" } }),
      page.request.post("/api/avatar", { data: { hat: "cap" } }),
      page.request.get("/api/money-goals"),
      page.request.post("/api/streak-shield"),
      page.request.delete("/api/account"),
    ]);

    for (const response of checks) {
      expect(response.status()).toBe(401);
    }
  });

  test("one learner cannot update another learner's money goal", async ({
    page,
  }) => {
    const owner = await provisionUser({
      role: "learner",
      prefix: "goal_owner",
      displayName: "Goal Owner",
    });
    const attacker = await provisionUser({
      role: "learner",
      prefix: "goal_attacker",
      displayName: "Goal Attacker",
    });

    try {
      const createRes = await fetch(`${SUPABASE_URL}/rest/v1/money_goals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          user_id: owner.id,
          title: "Private Goal",
          target_amount: 120,
          saved_amount: 10,
          currency_code: "USD",
          completed: false,
        }),
      });
      const [goal] = (await createRes.json()) as Array<{ id: string }>;

      await loginViaUi(page, attacker);
      const patch = await page.request.patch("/api/money-goals", {
        data: { id: goal.id, saved_amount: 99 },
      });

      expect([400, 404]).toContain(patch.status());

      const ownerGoals = await getMoneyGoals(owner.id);
      const untouched = ownerGoals.find(
        (row) =>
          typeof row === "object" &&
          row !== null &&
          "id" in row &&
          (row as { id: string }).id === goal.id
      ) as { saved_amount?: number } | undefined;
      expect(untouched?.saved_amount).toBe(10);
    } finally {
      await cleanupUsers([owner, attacker]);
    }
  });

  test("student cannot open a teacher-only class dashboard", async ({
    page,
  }) => {
    const teacher = await provisionUser({
      role: "teacher",
      prefix: "perm_teacher",
      displayName: "Permission Teacher",
    });
    const student = await provisionUser({
      role: "student",
      prefix: "perm_student",
      displayName: "Permission Student",
    });

    let classId = "";
    try {
      const created = await createTestClass(teacher.id, "Permission Class");
      classId = created.id;
    } catch {
      test.skip(
        true,
        "Class schema or RPCs are not available in this Supabase environment."
      );
    }

    try {
      await loginViaUi(page, student, { next: `/classes/${classId}` });
      await expect(page).toHaveURL(/\/classes$/);
    } finally {
      if (classId) {
        await deleteTestClass(classId);
      }
      await cleanupUsers([teacher, student]);
    }
  });
});
