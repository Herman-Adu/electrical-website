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

  test("community category shows slider, animated title, and 0-count badge", async ({
    page,
  }) => {
    await page.goto("/projects?category=community", {
      waitUntil: "domcontentloaded",
    });

    // Slider must still be present when category has 0 items
    const sliderNav = page.getByRole("navigation", {
      name: /filter projects by category/i,
    });
    await expect(sliderNav).toBeVisible({ timeout: 10000 });

    // Community chip is active
    const communityChip = sliderNav.getByRole("button", { name: /^Community/ });
    await expect(communityChip).toHaveAttribute("aria-current", "page");

    // Animated title "Community Projects" is visible
    const title = page.getByRole("heading", {
      level: 2,
      name: /community\s+projects/i,
    });
    await expect(title).toBeVisible({ timeout: 5000 });

    // Count badge shows "0 projects" (DOM text is lowercase; CSS uppercases it)
    await expect(page.getByText(/^0 projects$/i)).toBeVisible();
  });

  test("empty category shows enhanced card with heading and CTA link", async ({
    page,
  }) => {
    await page.goto("/projects?category=community", {
      waitUntil: "domcontentloaded",
    });

    const sliderNav = page.getByRole("navigation", {
      name: /filter projects by category/i,
    });
    await expect(sliderNav).toBeVisible({ timeout: 10000 });

    // Enhanced empty-state heading replaces the bare message
    await expect(
      page.getByRole("heading", { level: 3, name: /no projects yet/i }),
    ).toBeVisible({ timeout: 5000 });

    // CTA <Link> (rendered as <a>) is present — use .first() because
    // ProjectsListCTA also renders a "View All Projects" link on the same page.
    await expect(
      page.getByRole("link", { name: /view all projects/i }).first(),
    ).toBeVisible();
  });

  test("empty category CTA link clears ?category and activates All chip", async ({
    page,
  }) => {
    await page.goto("/projects?category=community", {
      waitUntil: "domcontentloaded",
    });

    // .first() scopes to the empty-state card link; ProjectsListCTA adds a second match.
    const ctaLink = page.getByRole("link", { name: /view all projects/i }).first();
    await expect(ctaLink).toBeVisible({ timeout: 10000 });
    await ctaLink.click();

    // URL has no ?category param
    await expect(page).toHaveURL(/\/projects(?:\/?$|\?(?!category=).*)/, {
      timeout: 5000,
    });
    expect(page.url()).not.toContain("category=community");

    // All chip becomes active
    const sliderNav = page.getByRole("navigation", {
      name: /filter projects by category/i,
    });
    const allChip = sliderNav.getByRole("button", { name: /^All/ });
    await expect(allChip).toHaveAttribute("aria-current", "page");
  });

  test("slider remains usable from empty Community category — can navigate to Residential", async ({
    page,
  }) => {
    await page.goto("/projects?category=community", {
      waitUntil: "domcontentloaded",
    });

    const sliderNav = page.getByRole("navigation", {
      name: /filter projects by category/i,
    });
    await expect(sliderNav).toBeVisible({ timeout: 10000 });

    // Navigate away via the slider — must work from an empty category
    const residentialChip = sliderNav.getByRole("button", {
      name: /^Residential/,
    });
    await residentialChip.click();

    await expect(page).toHaveURL(/\?category=residential$/, { timeout: 5000 });
    await expect(residentialChip).toHaveAttribute("aria-current", "page");

    // Projects load (2 residential projects exist)
    await expect(
      page.getByRole("heading", { level: 2, name: /residential\s+projects/i }),
    ).toBeVisible({ timeout: 5000 });
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
