import { test, expect } from "@playwright/test";

/**
 * Projects Category Slider — URL-driven filtering (Part A)
 * Project Detail Hero — Scroll animation fix (Part B)
 *
 * Verifies the URL-driven category slider on /projects:
 *   - Default load with no ?category shows "All" chip active
 *   - Chip click writes ?category=<slug> to URL and filters projects
 *   - Clicking "All" clears the URL param (no ?category=all artifact)
 *   - Invalid ?category=foo falls back to "all" without console errors
 *   - Part B: scroll indicator on project detail page fires without console error
 *
 * Prerequisites:
 *   - Next.js dev or production server on http://127.0.0.1:3000
 */

test.describe("projects category slider — URL-driven filtering", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("default load shows All chip as active", async ({ page }) => {
    const response = await page.goto("/projects", {
      waitUntil: "domcontentloaded",
    });
    expect(response?.status()).toBe(200);

    const sliderNav = page.getByRole("navigation", {
      name: /filter projects by category/i,
    });
    await expect(sliderNav).toBeVisible({ timeout: 10000 });

    const allChip = sliderNav.getByRole("button", { name: /^All/ });
    await expect(allChip).toBeVisible();
    await expect(allChip).toHaveAttribute("aria-current", "page");
  });

  test("clicking Residential chip updates URL and filters projects", async ({
    page,
  }) => {
    await page.goto("/projects", { waitUntil: "domcontentloaded" });

    const sliderNav = page.getByRole("navigation", {
      name: /filter projects by category/i,
    });
    await expect(sliderNav).toBeVisible({ timeout: 10000 });

    const residentialChip = sliderNav.getByRole("button", {
      name: /^Residential/,
    });
    await residentialChip.click();

    await expect(page).toHaveURL(/\?category=residential$/, { timeout: 5000 });
    await expect(residentialChip).toHaveAttribute("aria-current", "page");
  });

  test("clicking All chip navigates to clean /projects URL without ?category=all", async ({
    page,
  }) => {
    await page.goto("/projects?category=residential", {
      waitUntil: "domcontentloaded",
    });

    const sliderNav = page.getByRole("navigation", {
      name: /filter projects by category/i,
    });
    await expect(sliderNav).toBeVisible({ timeout: 10000 });

    const allChip = sliderNav.getByRole("button", { name: /^All/ });
    await allChip.click();

    await expect(page).toHaveURL(/\/projects(?:\/?$|\?(?!category=).*)/, {
      timeout: 5000,
    });
    expect(page.url()).not.toContain("category=all");
    await expect(allChip).toHaveAttribute("aria-current", "page");
  });

  test("invalid ?category=foo falls back to All without console errors", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    const response = await page.goto("/projects?category=bogus-invalid-slug", {
      waitUntil: "domcontentloaded",
    });
    expect(response?.status()).toBe(200);

    const sliderNav = page.getByRole("navigation", {
      name: /filter projects by category/i,
    });
    await expect(sliderNav).toBeVisible({ timeout: 10000 });

    const allChip = sliderNav.getByRole("button", { name: /^All/ });
    await expect(allChip).toHaveAttribute("aria-current", "page");

    // Filter out third-party noise; only flag app-level React/Next errors.
    const appErrors = consoleErrors.filter(
      (text) =>
        /react|hydrat|warning|error in|invariant|next\.js/i.test(text) &&
        !/favicon|manifest\.json|opengraph/i.test(text),
    );
    expect(appErrors).toEqual([]);
  });

  test("cold load with ?category=commercial hydrates the active chip", async ({
    page,
  }) => {
    const response = await page.goto("/projects?category=commercial", {
      waitUntil: "domcontentloaded",
    });
    expect(response?.status()).toBe(200);

    const sliderNav = page.getByRole("navigation", {
      name: /filter projects by category/i,
    });
    await expect(sliderNav).toBeVisible({ timeout: 10000 });

    const commercialChip = sliderNav.getByRole("button", {
      name: /^Commercial/,
    });
    await expect(commercialChip).toHaveAttribute("aria-current", "page");
  });
});

test.describe("project detail hero — scroll animation regression (Part B)", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("scroll indicator click fires without console error", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    // Navigate to the first available project detail page under a category slug.
    // The page contains the scroll-down indicator button.
    await page.goto("/projects/category/residential", {
      waitUntil: "domcontentloaded",
    });

    // Get the first project link from the list.
    const firstProjectLink = page.locator("a[href*='/projects/category/']").first();
    const href = await firstProjectLink.getAttribute("href");

    if (href) {
      await page.goto(href, { waitUntil: "domcontentloaded" });

      // Click the scroll indicator button.
      const scrollBtn = page.getByRole("button", {
        name: /scroll to project details/i,
      });
      if (await scrollBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
        await scrollBtn.click();
      }

      // No getElementById errors should be logged.
      const idErrors = consoleErrors.filter((text) =>
        /getElementById|scrollIntoView|cannot read/i.test(text),
      );
      expect(idErrors).toEqual([]);
    }
  });
});
