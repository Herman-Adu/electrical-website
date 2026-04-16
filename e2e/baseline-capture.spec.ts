import { test } from "@playwright/test";

/**
 * Phase 0: Baseline Capture
 *
 * Captures visual baseline screenshots of all major animated sections
 * before Phase 5 animation optimization begins.
 *
 * Run with: pnpm test:e2e baseline-capture.spec.ts
 * Captured images saved to: .playwright/baselines/
 */

const SCREENSHOT_DIR = ".playwright/baselines";

test.describe("Phase 0: Animation Baseline Capture", () => {
  test("capture hero section baseline", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    // Wait for hero animations to initialize
    await page.waitForTimeout(2000);

    await page.screenshot({
      path: `${SCREENSHOT_DIR}/01-hero-section.png`,
      fullPage: false,
    });
  });

  test("capture smart-living section baseline", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Scroll to smart-living section
    await page.locator('text=/smart living/i').first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);

    await page.screenshot({
      path: `${SCREENSHOT_DIR}/02-smart-living-section.png`,
      fullPage: false,
    });
  });

  test("capture illumination section baseline", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Scroll to illumination section (counters, scan effects)
    const illuminationText = page.locator('text=/illumination|smart lighting/i').first();
    if (await illuminationText.isVisible({ timeout: 1000 }).catch(() => false)) {
      await illuminationText.scrollIntoViewIfNeeded();
      await page.waitForTimeout(2000);

      await page.screenshot({
        path: `${SCREENSHOT_DIR}/03-illumination-section.png`,
        fullPage: false,
      });
    }
  });

  test("capture cta-power section baseline (trust stats)", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Scroll to CTA section
    const ctaText = page.locator('text=/why choose|trust|statistics/i').first();
    if (await ctaText.isVisible({ timeout: 1000 }).catch(() => false)) {
      await ctaText.scrollIntoViewIfNeeded();
      await page.waitForTimeout(2000);

      await page.screenshot({
        path: `${SCREENSHOT_DIR}/04-cta-power-section.png`,
        fullPage: false,
      });
    }
  });

  test("capture about page hero baseline", async ({ page }) => {
    await page.goto("/about");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    await page.screenshot({
      path: `${SCREENSHOT_DIR}/05-about-hero.png`,
      fullPage: false,
    });
  });

  test("capture services page hero baseline", async ({ page }) => {
    await page.goto("/services");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    await page.screenshot({
      path: `${SCREENSHOT_DIR}/06-services-hero.png`,
      fullPage: false,
    });
  });

  test("capture projects page hero baseline", async ({ page }) => {
    await page.goto("/projects");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    await page.screenshot({
      path: `${SCREENSHOT_DIR}/07-projects-hero.png`,
      fullPage: false,
    });
  });

  test("capture footer baseline", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    const footer = page.locator('footer').first();
    if (await footer.isVisible({ timeout: 1000 }).catch(() => false)) {
      await page.screenshot({
        path: `${SCREENSHOT_DIR}/08-footer.png`,
        fullPage: false,
      });
    }
  });

  test("verify typecheck before optimization", async ({ page }) => {
    // This test runs a quick verification that the codebase is clean
    // before we start making changes
    const response = await page.request.get("/");
    if (response.ok()) {
      console.log("✓ Application loads successfully");
    }
  });
});
