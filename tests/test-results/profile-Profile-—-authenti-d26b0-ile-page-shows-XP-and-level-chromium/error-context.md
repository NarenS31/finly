# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: profile.spec.ts >> Profile — authenticated >> profile page shows XP and level
- Location: tests/e2e/profile.spec.ts:49:18

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/xp/i)
Expected: visible
Error: strict mode violation: getByText(/xp/i) resolved to 17 elements:
    1) <p class="text-sm text-[var(--color-text-secondary)]">Total XP</p> aka getByText('Total XP')
    2) <p class="text-sm text-[var(--color-text-secondary)]">0 / 100 XP to Saver</p> aka getByText('/ 100 XP to Saver')
    3) <p class="mt-2 text-xs text-[var(--color-text-muted)]">0–99 XP in 1</p> aka getByText('–99 XP in 1')
    4) <strong class="text-[var(--black)]">0 XP</strong> aka getByRole('strong')
    5) <span class="text-[10px] font-semibold leading-none">50 XP</span> aka getByRole('button', { name: '50 XP', exact: true })
    6) <span class="text-[10px] font-semibold leading-none">150 XP</span> aka getByRole('button', { name: '150 XP' })
    7) <span class="text-[10px] font-semibold leading-none">500 XP</span> aka getByRole('button', { name: '500 XP' })
    8) <span class="text-[10px] font-semibold leading-none">1000 XP</span> aka getByRole('button', { name: '🧙 1000 XP' })
    9) <span class="text-[10px] font-semibold leading-none">100 XP</span> aka getByRole('button', { name: '100 XP' })
    10) <span class="text-[10px] font-semibold leading-none">200 XP</span> aka getByRole('button', { name: 'XP' }).nth(5)
    ...

Call log:
  - Expect "toBeVisible" with timeout 8000ms
  - waiting for getByText(/xp/i)

```

# Test source

```ts
  1   | /**
  2   |  * Profile & Settings tests.
  3   |  * Covers: profile page loads, display name update, age tier change,
  4   |  * currency selector, avatar builder XP gates, share stats card,
  5   |  * persistence after refresh, unauthorized access.
  6   |  */
  7   | 
  8   | import { test, expect } from "@playwright/test";
  9   | import {
  10  |   createTestUser,
  11  |   deleteTestUser,
  12  |   setUserXp,
  13  |   getUserProfile,
  14  | } from "../helpers/supabase-admin";
  15  | import { loginViaUI, uniqueEmail } from "../helpers/auth";
  16  | import * as dotenv from "dotenv";
  17  | import path from "path";
  18  | 
  19  | dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });
  20  | 
  21  | const TEST_PASSWORD = "TestPass1!";
  22  | 
  23  | test.describe("Profile — unauthenticated", () => {
  24  |   test("redirects to /auth/login", async ({ page }) => {
  25  |     await page.goto("/profile");
  26  |     await expect(page).toHaveURL(/\/auth\/login/);
  27  |   });
  28  | });
  29  | 
  30  | test.describe("Profile — authenticated", () => {
  31  |   let userId: string;
  32  |   let email: string;
  33  | 
  34  |   test.beforeAll(async () => {
  35  |     email = uniqueEmail("profile");
  36  |     const user = await createTestUser(email, TEST_PASSWORD, "ProfileUser");
  37  |     userId = user.id;
  38  |   });
  39  | 
  40  |   test.afterAll(async () => {
  41  |     await deleteTestUser(userId);
  42  |   });
  43  | 
  44  |   test("profile page loads and shows display name", async ({ page }) => {
  45  |     await loginViaUI(page, email, TEST_PASSWORD);
  46  |     await page.goto("/profile");
  47  |     await expect(page.getByText(/ProfileUser/i)).toBeVisible({ timeout: 8_000 });
  48  |   });
  49  | 
  50  |   test("profile page shows XP and level", async ({ page }) => {
  51  |     await loginViaUI(page, email, TEST_PASSWORD);
  52  |     await page.goto("/profile");
  53  |     await expect(page.getByText(/xp/i)).toBeVisible();
> 54  |   });
      |                                                    ^ Error: expect(locator).toBeVisible() failed
  55  | 
  56  |   test("profile page shows streak section", async ({ page }) => {
  57  |     await loginViaUI(page, email, TEST_PASSWORD);
  58  |     await page.goto("/profile");
  59  |     await expect(page.getByText(/streak/i)).toBeVisible();
  60  |   });
  61  | 
  62  |   test("profile PATCH API updates display name", async ({ page }) => {
  63  |     await loginViaUI(page, email, TEST_PASSWORD);
  64  | 
  65  |     const response = await page.request.patch("/api/profile", {
  66  |       data: { display_name: "UpdatedName" },
  67  |     });
  68  |     expect(response.status()).toBe(200);
  69  |     const body = (await response.json()) as { success: boolean };
  70  |     expect(body.success).toBe(true);
  71  | 
  72  |     const profileData = await getUserProfile(userId);
  73  |     expect(profileData.display_name).toBe("UpdatedName");
  74  |   });
  75  | 
  76  |   test("updated display name persists after page refresh", async ({ page }) => {
  77  |     await loginViaUI(page, email, TEST_PASSWORD);
  78  | 
  79  |     await page.request.patch("/api/profile", {
  80  |       data: { display_name: "RefreshCheck" },
  81  |     });
  82  | 
  83  |     await page.goto("/profile");
  84  |     await expect(page.getByText(/RefreshCheck/i)).toBeVisible({ timeout: 8_000 });
  85  |   });
  86  | 
  87  |   test("profile PATCH API updates age tier", async ({ page }) => {
  88  |     await loginViaUI(page, email, TEST_PASSWORD);
  89  | 
  90  |     const response = await page.request.patch("/api/profile", {
  91  |       data: { age_tier: "8-12" },
  92  |     });
  93  |     expect(response.status()).toBe(200);
  94  | 
  95  |     const profileData = await getUserProfile(userId);
  96  |     expect(profileData.age_tier).toBe("8-12");
  97  |   });
  98  | 
  99  |   test("unauthenticated PATCH /api/profile returns 401", async ({ page }) => {
  100 |     const response = await page.request.patch("/api/profile", {
  101 |       data: { display_name: "Hacker" },
  102 |     });
  103 |     expect(response.status()).toBe(401);
  104 |   });
  105 | });
  106 | 
  107 | test.describe("Profile — Avatar Builder XP gates", () => {
  108 |   let userId: string;
  109 |   let email: string;
  110 | 
  111 |   test.beforeAll(async () => {
  112 |     email = uniqueEmail("avatar");
  113 |     const user = await createTestUser(email, TEST_PASSWORD, "AvatarTester");
  114 |     userId = user.id;
  115 |   });
  116 | 
  117 |   test.afterAll(async () => {
  118 |     await deleteTestUser(userId);
  119 |   });
  120 | 
  121 |   test("profile page shows avatar builder section", async ({ page }) => {
  122 |     await loginViaUI(page, email, TEST_PASSWORD);
  123 |     await page.goto("/profile");
  124 |     await expect(page.getByText(/avatar|customize/i).first()).toBeVisible({ timeout: 8_000 });
  125 |   });
  126 | 
  127 |   test("free avatar item (cap) is selectable at 0 XP", async ({ page }) => {
  128 |     await setUserXp(userId, 0);
  129 |     await loginViaUI(page, email, TEST_PASSWORD);
  130 |     await page.goto("/profile");
  131 | 
  132 |     // Look for Cap or free hat option
  133 |     const capOption = page.getByText(/cap|hat/i).first();
  134 |     await expect(capOption).toBeVisible({ timeout: 8_000 });
  135 |   });
  136 | 
  137 |   test("locked avatar item shows locked state at insufficient XP", async ({ page }) => {
  138 |     await setUserXp(userId, 0);
  139 |     await loginViaUI(page, email, TEST_PASSWORD);
  140 |     await page.goto("/profile");
  141 | 
  142 |     // Crown requires 500 XP — should show locked/XP requirement
  143 |     const lockedItems = page.getByText(/500 xp|locked|unlock at/i);
  144 |     await expect(lockedItems.first()).toBeVisible({ timeout: 8_000 });
  145 |   });
  146 | 
  147 |   test("POST /api/avatar saves avatar customization", async ({ page }) => {
  148 |     await loginViaUI(page, email, TEST_PASSWORD);
  149 | 
  150 |     const response = await page.request.post("/api/avatar", {
  151 |       data: { hat: "cap", accessory: "glasses", badge: "star" },
  152 |     });
  153 |     expect(response.status()).toBe(200);
  154 | 
```