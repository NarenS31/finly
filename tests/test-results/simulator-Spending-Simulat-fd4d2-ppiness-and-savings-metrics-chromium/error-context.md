# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: simulator.spec.ts >> Spending Simulator — public access >> simulator tracks happiness and savings metrics
- Location: tests/e2e/simulator.spec.ts:72:18

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/happiness|savings|balance|score/i).first()
Expected: visible
Timeout: 8000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 8000ms
  - waiting for getByText(/happiness|savings|balance|score/i).first()

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - navigation [ref=e3]:
      - link "Finly" [ref=e4] [cursor=pointer]:
        - /url: /
        - img "Finly" [ref=e5]:
          - generic [ref=e9]: fin
          - generic [ref=e10]: ly
      - generic [ref=e11]:
        - link "Dashboard" [ref=e12] [cursor=pointer]:
          - /url: /dashboard
        - link "Learn" [ref=e13] [cursor=pointer]:
          - /url: /learn
        - link "Curriculum" [ref=e14] [cursor=pointer]:
          - /url: /curriculum
        - link "Simulator" [ref=e15] [cursor=pointer]:
          - /url: /simulator
        - link "Leaderboard" [ref=e16] [cursor=pointer]:
          - /url: /leaderboard
        - link "Classes" [ref=e17] [cursor=pointer]:
          - /url: /classes
        - link "About" [ref=e18] [cursor=pointer]:
          - /url: /about
      - generic [ref=e19]:
        - generic [ref=e20]:
          - button "8–12" [ref=e21]
          - button "13–17" [ref=e22]
        - link "Login" [ref=e23] [cursor=pointer]:
          - /url: /auth/login
        - link "Sign Up" [ref=e24] [cursor=pointer]:
          - /url: /auth/signup
  - main [ref=e26]:
    - generic [ref=e27]:
      - generic [ref=e28]:
        - paragraph [ref=e29]: Interactive
        - heading "Spending Simulator" [level=1] [ref=e30]
        - paragraph [ref=e31]: 10 days. Real decisions. How much will you save?
      - generic [ref=e32]:
        - img [ref=e33]
        - heading "Spending Simulator" [level=2] [ref=e64]
        - paragraph [ref=e65]:
          - text: You have
          - strong [ref=e66]: $100
          - text: and 10 days of real-life money decisions. Spend wisely, save smart, stay happy. Let's see how you do!
        - button "Start Simulation →" [ref=e67]
  - contentinfo [ref=e68]:
    - generic [ref=e69]:
      - generic [ref=e70]:
        - img "Finly" [ref=e71]:
          - generic [ref=e75]: fin
          - generic [ref=e76]: ly
        - paragraph [ref=e77]: Financial education for the next generation.
      - navigation [ref=e78]:
        - link "Learn" [ref=e79] [cursor=pointer]:
          - /url: /learn
        - link "Curriculum" [ref=e80] [cursor=pointer]:
          - /url: /curriculum
        - link "About" [ref=e81] [cursor=pointer]:
          - /url: /about
        - link "Privacy" [ref=e82] [cursor=pointer]:
          - /url: /privacy
      - paragraph [ref=e83]: 100% free, always
  - button "Open Next.js Dev Tools" [ref=e89] [cursor=pointer]:
    - img [ref=e90]
  - alert [ref=e93]
```

# Test source

```ts
  1   | /**
  2   |  * Spending Simulator tests.
  3   |  * Covers: renders, user can make choices, happiness/savings tracking,
  4   |  * completes 10 days, grade report shown, reset/restart works.
  5   |  */
  6   | 
  7   | import { test, expect } from "@playwright/test";
  8   | import * as dotenv from "dotenv";
  9   | import path from "path";
  10  | 
  11  | dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });
  12  | 
  13  | test.describe("Spending Simulator — public access", () => {
  14  |   test("simulator page loads without auth", async ({ page }) => {
  15  |     await page.goto("/simulator");
  16  |     await expect(page.getByRole("heading").first()).toBeVisible();
  17  |   });
  18  | 
  19  |   test("simulator shows Start Simulation intro screen", async ({ page }) => {
  20  |     await page.goto("/simulator");
  21  |     await expect(page.getByText(/spending simulator/i)).toBeVisible({ timeout: 8_000 });
  22  |     await expect(page.getByRole("button", { name: /start simulation/i })).toBeVisible();
  23  |   });
  24  | 
  25  |   test("clicking Start Simulation reveals Day 1 choices", async ({ page }) => {
  26  |     await page.goto("/simulator");
  27  |     await page.getByRole("button", { name: /start simulation/i }).click();
  28  | 
  29  |     // Day 1 event should be visible
  30  |     await expect(page.getByText(/day 1/i)).toBeVisible({ timeout: 5_000 });
  31  | 
  32  |     // Choice buttons should be present
  33  |     const choices = page.getByRole("button").filter({ hasNotText: /start simulation|next →|see results/i });
  34  |     await expect(choices.first()).toBeVisible();
  35  |   });
  36  | 
  37  |   test("clicking a choice shows feedback from Finn", async ({ page }) => {
  38  |     await page.goto("/simulator");
  39  |     await page.getByRole("button", { name: /start simulation/i }).click();
  40  | 
  41  |     const choices = page.getByRole("button").filter({
  42  |       hasNotText: /start simulation|next →|see results/i,
  43  |     });
  44  |     await choices.first().click();
  45  | 
  46  |     // After choice, Finn's feedback appears
  47  |     await expect(page.getByText(/finn says|fun!|smart|balance/i).first()).toBeVisible({ timeout: 5_000 });
  48  |     await expect(page).not.toHaveURL(/error|500/);
  49  |   });
  50  | 
  51  |   test("simulator tracks happiness and savings metrics", async ({ page }) => {
  52  |     await page.goto("/simulator");
  53  | 
  54  |     // Should show happiness and/or savings meters
  55  |     await expect(
  56  |       page.getByText(/happiness|savings|balance|score/i).first()
  57  |     ).toBeVisible({ timeout: 8_000 });
  58  |   });
  59  | 
  60  |   test("completing all 5 scenarios shows grade report", async ({ page }) => {
  61  |     await page.goto("/simulator");
  62  |     // Start the simulation
  63  |     await page.getByRole("button", { name: /start simulation/i }).click();
  64  | 
  65  |     // Click through all 5 events (each event: choose first option, then click Next)
  66  |     for (let i = 0; i < 5; i++) {
  67  |       // Wait for choices to be available
  68  |       const choices = page.getByRole("button").filter({
  69  |         hasNotText: /start simulation|next →|see results →|restart/i,
  70  |       });
  71  |       const visible = await choices.first().isVisible({ timeout: 5_000 }).catch(() => false);
  72  |       if (!visible) break;
  73  | 
  74  |       await choices.first().click();
  75  |       await page.waitForTimeout(200);
  76  | 
  77  |       // Click Next or See Results
> 78  |       const nextBtn = page.getByRole("button", { name: /next →|see results →/i });
      |                                                                                         ^ Error: expect(locator).toBeVisible() failed
  79  |       const nextVisible = await nextBtn.isVisible({ timeout: 3_000 }).catch(() => false);
  80  |       if (nextVisible) await nextBtn.click();
  81  |       await page.waitForTimeout(200);
  82  |     }
  83  | 
  84  |     // After completing all events, grade report should show
  85  |     await expect(
  86  |       page.getByText(/grade:|simulation complete/i).first()
  87  |     ).toBeVisible({ timeout: 10_000 });
  88  |   });
  89  | 
  90  |   test("simulator can be restarted after completion", async ({ page }) => {
  91  |     await page.goto("/simulator");
  92  |     await page.getByRole("button", { name: /start simulation/i }).click();
  93  | 
  94  |     for (let i = 0; i < 5; i++) {
  95  |       const choices = page.getByRole("button").filter({
  96  |         hasNotText: /start simulation|next →|see results →|restart/i,
  97  |       });
  98  |       const visible = await choices.first().isVisible({ timeout: 5_000 }).catch(() => false);
  99  |       if (!visible) break;
  100 |       await choices.first().click();
  101 |       await page.waitForTimeout(200);
  102 |       const nextBtn = page.getByRole("button", { name: /next →|see results →/i });
  103 |       const nextVisible = await nextBtn.isVisible({ timeout: 3_000 }).catch(() => false);
  104 |       if (nextVisible) await nextBtn.click();
  105 |       await page.waitForTimeout(200);
  106 |     }
  107 | 
  108 |     const restartBtn = page.getByRole("button", { name: /restart|try again|play again/i });
  109 |     if (await restartBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
  110 |       await restartBtn.click();
  111 |       await expect(page.getByRole("button", { name: /start simulation/i })).toBeVisible({
  112 |         timeout: 5_000,
  113 |       });
  114 |     }
  115 |   });
  116 | });
  117 | 
```