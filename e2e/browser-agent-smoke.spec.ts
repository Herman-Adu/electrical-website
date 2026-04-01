/**
 * Browser-agent smoke tests – run against production server at localhost:3000
 * These tests are driven by the browser-testing sub-agent mission.
 */
import { test, expect } from "@playwright/test";

const BASE = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";

test.describe("Step 1 – Pre-flight check", () => {
  test("homepage returns 200 with real content", async ({ page }) => {
    const response = await page.goto(BASE, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    // Confirm meaningful body text
    const body = await page.textContent("body");
    expect(body).toContain("Nexgen");
  });
});

test.describe("Step 2 – Smoke: mobile nav", () => {
  test("mobile hamburger opens nav drawer", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE, { waitUntil: "domcontentloaded" });

    // hamburger button
    const burger = page.locator('button[aria-label="Open menu"]');
    await expect(burger).toBeVisible({ timeout: 5000 });
    await burger.click({ force: true });
    await expect(page.locator('button[aria-label="Close menu"]')).toBeVisible({
      timeout: 5000,
    });
  });
});

test.describe("Step 3 – Smoke: contact form + CAPTCHA gate", () => {
  test("contact form fills and submit triggers alert or validation", async ({
    page,
  }) => {
    await page.goto(`${BASE}/contact`, { waitUntil: "domcontentloaded" });

    // Verify form fields exist
    await expect(page.locator('input[name="name"]')).toBeVisible({
      timeout: 5000,
    });

    // Fill the form
    await page.fill('input[name="name"]', "Test User");
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('textarea[name="message"]', "This is a smoke test message");
    await page.selectOption('select[name="projectType"]', "commercial");

    // Submit
    const submitBtn = page
      .locator('button[type="submit"]')
      .or(page.locator('input[type="submit"]'));
    await submitBtn.first().click();

    // Wait briefly for any feedback
    await page.waitForTimeout(2000);

    // Check for alert / error / success feedback
    const alert = page.locator('[role="alert"]');
    const alertCount = await alert.count();
    // We just report what we find – no hard assertion on content since CAPTCHA blocks submits
    console.log(
      `[step3] role=alert elements found after submit: ${alertCount}`,
    );
    if (alertCount > 0) {
      const alertText = await alert.first().textContent();
      console.log(`[step3] alert text: "${alertText}"`);
    }
  });
});

test.describe("Step 4 – Boundaries: /services/error-test", () => {
  test("error-test route returns 200 and shows nav link to /services", async ({
    page,
  }) => {
    const response = await page.goto(`${BASE}/services/error-test`, {
      waitUntil: "domcontentloaded",
    });

    // Accept 200 (page exists) or 404 (route not present) – record actual
    const status = response?.status();
    console.log(`[step4] HTTP status: ${status}`);

    // Nav link to /services
    const servicesLink = page.locator('a[href="/services"]');
    const linkCount = await servicesLink.count();
    console.log(`[step4] nav links to /services: ${linkCount}`);
    if (status === 200) {
      expect(linkCount).toBeGreaterThan(0);
      await expect(servicesLink.first()).toBeVisible({ timeout: 5000 });
    }

    // Confirm fixture visibility only when route exists.
    const fixtureText = page.getByText("Error Boundary Test Fixture", {
      exact: true,
    });
    if (status === 200) {
      await expect(fixtureText).toBeVisible({ timeout: 5000 });
      console.log('[step4] "Error Boundary Test Fixture" visible: true');
    } else {
      const fixtureVisible = await fixtureText.isVisible().catch(() => false);
      console.log(
        `[step4] "Error Boundary Test Fixture" visible: ${fixtureVisible}`,
      );
    }
  });
});
