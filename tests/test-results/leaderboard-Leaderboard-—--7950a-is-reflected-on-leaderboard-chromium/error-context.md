# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: leaderboard.spec.ts >> Leaderboard — user visibility and ranking >> XP update is reflected on leaderboard
- Location: tests/e2e/leaderboard.spec.ts:71:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/1500|1,500/)
Expected: visible
Timeout: 8000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 8000ms
  - waiting for getByText(/1500|1,500/)

```

# Test source

```ts
  1  | /**
  2  |  * Leaderboard tests.
  3  |  * Covers: public visibility, ranking accuracy, current user highlight,
  4  |  * XP changes reflected, medal display for top 3.
  5  |  */
  6  | 
  7  | import { test, expect } from "@playwright/test";
  8  | import {
  9  |   createTestUser,
  10 |   deleteTestUser,
  11 |   setUserXp,
  12 | } from "../helpers/supabase-admin";
  13 | import { loginViaUI, uniqueEmail } from "../helpers/auth";
  14 | import * as dotenv from "dotenv";
  15 | import path from "path";
  16 | 
  17 | dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });
  18 | 
  19 | const TEST_PASSWORD = "TestPass1!";
  20 | 
  21 | test.describe("Leaderboard — public", () => {
  22 |   test("leaderboard is accessible without login", async ({ page }) => {
  23 |     await page.goto("/leaderboard");
  24 |     await expect(page.getByRole("heading", { name: /leaderboard/i })).toBeVisible();
  25 |   });
  26 | 
  27 |   test("shows top user entries or empty state message", async ({ page }) => {
  28 |     await page.goto("/leaderboard");
  29 |     // Either shows a user rank or "no one yet" / "be first"
  30 |     await expect(
  31 |       page.getByText(/xp|rank|level|no one yet|be the first|empty/i).first()
  32 |     ).toBeVisible({ timeout: 8_000 });
  33 |   });
  34 | 
  35 |   test("leaderboard data is available via page render", async ({ page }) => {
  36 |     await page.goto("/leaderboard");
  37 |     // No redirect, page renders
  38 |     await expect(page).toHaveURL("/leaderboard");
  39 |     await expect(page.getByRole("main").first()).toBeVisible();
  40 |   });
  41 | });
  42 | 
  43 | test.describe("Leaderboard — user visibility and ranking", () => {
  44 |   let userId: string;
  45 |   let email: string;
  46 | 
  47 |   test.beforeAll(async () => {
  48 |     email = uniqueEmail("lb");
  49 |     const user = await createTestUser(email, TEST_PASSWORD, "LBTester");
  50 |     userId = user.id;
  51 |     await setUserXp(userId, 999); // High XP to likely appear in top 50
  52 |   });
  53 | 
  54 |   test.afterAll(async () => {
  55 |     await deleteTestUser(userId);
  56 |   });
  57 | 
  58 |   test("user with high XP appears on leaderboard", async ({ page }) => {
  59 |     await page.goto("/leaderboard");
  60 |     await expect(page.getByText("LBTester")).toBeVisible({ timeout: 8_000 });
  61 |   });
  62 | 
  63 |   test("authenticated user's entry is highlighted on leaderboard", async ({ page }) => {
  64 |     await loginViaUI(page, email, TEST_PASSWORD);
  65 |     await page.goto("/leaderboard");
  66 |     // "You" or highlighted row
  67 |     const highlight = page.getByText(/you|LBTester/i).first();
  68 |     await expect(highlight).toBeVisible({ timeout: 8_000 });
  69 |   });
  70 | 
  71 |   test("XP update is reflected on leaderboard", async ({ page }) => {
  72 |     await setUserXp(userId, 1500);
  73 |     await page.goto("/leaderboard");
> 74 |     await expect(page.getByText(/1500|1,500/)).toBeVisible({ timeout: 8_000 });
     |                                                ^ Error: expect(locator).toBeVisible() failed
  75 |   });
  76 | });
  77 | 
```