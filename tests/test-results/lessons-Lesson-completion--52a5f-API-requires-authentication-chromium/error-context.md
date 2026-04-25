# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: lessons.spec.ts >> Lesson completion API >> quiz-result API requires authentication
- Location: tests/e2e/lessons.spec.ts:85:18

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 401
Received: 405
```

# Test source

```ts
  1   | /**
  2   |  * Lesson Library and completion flow tests.
  3   |  * Covers: lesson library renders, filtering by topic/tier, lesson page loads,
  4   |  * lesson completion API awards XP, quiz API tracks answers.
  5   |  */
  6   | 
  7   | import { test, expect } from "@playwright/test";
  8   | import {
  9   |   createTestUser,
  10  |   deleteTestUser,
  11  |   getUserProfile,
  12  | } from "../helpers/supabase-admin";
  13  | import { loginViaUI, uniqueEmail } from "../helpers/auth";
  14  | import * as dotenv from "dotenv";
  15  | import path from "path";
  16  | 
  17  | dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });
  18  | 
  19  | const TEST_PASSWORD = "TestPass1!";
  20  | 
  21  | test.describe("Lesson Library — public", () => {
  22  |   test("/learn page renders lesson cards or empty state", async ({ page }) => {
  23  |     await page.goto("/learn");
  24  |     await expect(page.getByRole("heading").first()).toBeVisible();
  25  |   });
  26  | 
  27  |   test("lesson library shows topic filter options", async ({ page }) => {
  28  |     await page.goto("/learn");
  29  |     await expect(
  30  |       page.getByText(/budgeting|saving|investing|banking|all/i).first()
  31  |     ).toBeVisible({ timeout: 8_000 });
  32  |   });
  33  | 
  34  |   test("lesson cards link to individual lesson pages", async ({ page }) => {
  35  |     await page.goto("/learn");
  36  | 
  37  |     // Find first lesson card link
  38  |     const lessonLink = page.getByRole("link").filter({ hasText: /learn|read|start|lesson/i }).first();
  39  |     if (await lessonLink.isVisible({ timeout: 3_000 }).catch(() => false)) {
  40  |       const href = await lessonLink.getAttribute("href");
  41  |       expect(href).toMatch(/\/learn\//);
  42  |     }
  43  |   });
  44  | });
  45  | 
  46  | test.describe("Lesson completion API", () => {
  47  |   let userId: string;
  48  |   let email: string;
  49  | 
  50  |   test.beforeAll(async () => {
  51  |     email = uniqueEmail("lesson");
  52  |     const user = await createTestUser(email, TEST_PASSWORD, "LessonTester");
  53  |     userId = user.id;
  54  |   });
  55  | 
  56  |   test.afterAll(async () => {
  57  |     await deleteTestUser(userId);
  58  |   });
  59  | 
  60  |   test("POST /api/lesson-complete requires authentication", async ({ page }) => {
  61  |     const response = await page.request.post("/api/lesson-complete", {
  62  |       data: { slug: "needs-vs-wants", timeSpent: 120 },
  63  |     });
  64  |     expect(response.status()).toBe(401);
  65  |   });
  66  | 
  67  |   test("POST /api/lesson-complete requires lessonId and slug — returns 400 without them", async ({
  68  |     page,
  69  |   }) => {
  70  |     await loginViaUI(page, email, TEST_PASSWORD);
  71  | 
  72  |     const response = await page.request.post("/api/lesson-complete", {
  73  |       data: { slug: "needs-vs-wants" }, // missing lessonId
  74  |     });
  75  |     expect(response.status()).toBe(400);
  76  |   });
  77  | 
  78  |   test("quiz-result API requires authentication", async ({ page }) => {
  79  |     const response = await page.request.get(
  80  |       "/api/quiz-result?slug=needs-vs-wants&questionIndex=0&answer=0"
  81  |     );
  82  |     expect(response.status()).toBe(401);
  83  |   });
  84  | 
  85  |   test("lesson progress API returns lesson_progress rows for authenticated user", async ({ page }) => {
  86  |     await loginViaUI(page, email, TEST_PASSWORD);
  87  | 
  88  |     // Mark a lesson as in-progress via lesson-complete or direct check
> 89  |     const profileRes = await page.request.get("/api/profile");
      |                                          ^ Error: expect(received).toBe(expected) // Object.is equality
  90  |     expect(profileRes.status()).toBe(200);
  91  |   });
  92  | });
  93  | 
  94  | test.describe("Individual lesson pages", () => {
  95  |   test("a known lesson page renders content", async ({ page }) => {
  96  |     // Try to load a lesson that's likely to exist
  97  |     await page.goto("/learn/needs-vs-wants");
  98  |     // Either 404 or lesson content renders
  99  |     const status = await page.evaluate(() => document.title);
  100 |     // Not testing specific content since lessons depend on DB/files
  101 |     expect(status).toBeTruthy();
  102 |   });
  103 | 
  104 |   test("lesson page does not redirect to login when accessed as guest", async ({ page }) => {
  105 |     await page.goto("/learn");
  106 |     await expect(page).not.toHaveURL(/\/auth\/login/);
  107 |   });
  108 | });
  109 | 
```