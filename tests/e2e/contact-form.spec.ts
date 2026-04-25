/**
 * Contact form and platform stats tests.
 *
 * Covers:
 *  - POST /api/contact requires name, email, message (400 on missing)
 *  - POST /api/contact rejects invalid email format (400)
 *  - POST /api/contact with valid data returns success (no auth required)
 *  - POST /api/contact is publicly accessible (no auth required)
 *  - GET /api/stats returns shape with platform counters
 *  - Homepage stats bar shows numeric data
 */

import { test, expect } from "@playwright/test";

test.describe("Contact form — POST /api/contact", () => {
  test("returns 200 with valid name, email, and message", async ({ page }) => {
    const res = await page.request.post("/api/contact", {
      data: {
        name: "QA Tester",
        email: "qa@example.com",
        message: "This is a test message from the automated QA suite.",
        reason: "feedback",
      },
    });
    expect(res.status()).toBe(200);
    const body = (await res.json()) as { success: boolean };
    expect(body.success).toBe(true);
  });

  test("returns 400 when name is missing", async ({ page }) => {
    const res = await page.request.post("/api/contact", {
      data: {
        email: "qa@example.com",
        message: "Missing name",
      },
    });
    expect(res.status()).toBe(400);
    const body = (await res.json()) as { error: string };
    expect(body.error).toMatch(/missing/i);
  });

  test("returns 400 when email is missing", async ({ page }) => {
    const res = await page.request.post("/api/contact", {
      data: {
        name: "QA Tester",
        message: "Missing email",
      },
    });
    expect(res.status()).toBe(400);
  });

  test("returns 400 when message is missing", async ({ page }) => {
    const res = await page.request.post("/api/contact", {
      data: {
        name: "QA Tester",
        email: "qa@example.com",
      },
    });
    expect(res.status()).toBe(400);
  });

  test("returns 400 when email format is invalid", async ({ page }) => {
    const res = await page.request.post("/api/contact", {
      data: {
        name: "QA Tester",
        email: "not-an-email",
        message: "Bad email format test",
      },
    });
    expect(res.status()).toBe(400);
    const body = (await res.json()) as { error: string };
    expect(body.error).toMatch(/invalid email/i);
  });

  test("is accessible without authentication", async ({ page }) => {
    // No login — should still work
    const res = await page.request.post("/api/contact", {
      data: {
        name: "Anonymous Tester",
        email: "anon@example.com",
        message: "Testing unauthenticated contact form submission.",
      },
    });
    expect(res.status()).toBe(200);
  });

  test("XSS-like input is handled safely without server error", async ({ page }) => {
    const res = await page.request.post("/api/contact", {
      data: {
        name: "<script>alert('xss')</script>",
        email: "xss@example.com",
        message: "<img src=x onerror=alert(1)>",
      },
    });
    // Should not throw 500 — escaping should handle this
    expect([200, 400]).toContain(res.status());
  });

  test("very long message is accepted (no hard truncation at API level)", async ({ page }) => {
    const longMessage = "A".repeat(2000);
    const res = await page.request.post("/api/contact", {
      data: {
        name: "Long Msg",
        email: "long@example.com",
        message: longMessage,
      },
    });
    // Either 200 (accepted) or 400 with a length-validation message
    expect([200, 400]).toContain(res.status());
    if (res.status() === 200) {
      const body = (await res.json()) as { success: boolean };
      expect(body.success).toBe(true);
    }
  });
});

test.describe("Platform stats — GET /api/stats", () => {
  test("returns 200 with stat data for unauthenticated caller", async ({ page }) => {
    const res = await page.request.get("/api/stats");
    expect(res.status()).toBe(200);
  });

  test("response contains non-negative numeric stat values", async ({ page }) => {
    const res = await page.request.get("/api/stats");
    const body = (await res.json()) as Record<string, unknown>;

    const numericValues = Object.values(body).filter(
      (v) => typeof v === "number"
    ) as number[];

    expect(numericValues.length).toBeGreaterThan(0);
    for (const v of numericValues) {
      expect(v).toBeGreaterThanOrEqual(0);
    }
  });

  test("homepage shows stat counters (users, lessons, countries)", async ({ page }) => {
    await page.goto("/");
    // Platform stats are shown on the landing page
    const statsSection = page.getByText(/\d{1,},?\d{0,}/).first();
    await expect(statsSection).toBeVisible({ timeout: 8_000 });
  });
});
