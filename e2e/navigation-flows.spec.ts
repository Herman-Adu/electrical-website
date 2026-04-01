import { test, expect } from "@playwright/test";

/**
 * Navigation Flow Tests
 *
 * Verifies that all primary routes load correctly, navigation links work,
 * and pages expose the expected DOM content for key sections.
 *
 * Prerequisites:
 *   - A Next.js dev or production server must be running on the configured
 *     base URL (default: http://localhost:3000).
 *   - Run: pnpm dev (or pnpm build && pnpm start) before executing these tests.
 */

// ---------------------------------------------------------------------------
// 1. Core page availability
// ---------------------------------------------------------------------------
test.describe("core page availability", () => {
  test("homepage responds with HTTP 200 and title contains Nexgen or Electrical", async ({
    page,
  }) => {
    // Use domcontentloaded to avoid blocking on animated assets under parallel load
    const response = await page.goto("/", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);

    const title = await page.title();
    expect(title).toMatch(/nexgen|electrical/i);
  });

  test("about page responds with HTTP 200 and H1 is visible", async ({
    page,
  }) => {
    const response = await page.goto("/about");
    expect(response?.status()).toBe(200);

    await page.waitForLoadState("domcontentloaded");
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible({ timeout: 5000 });
  });

  test("projects page responds with HTTP 200 and project content is visible", async ({
    page,
  }) => {
    const response = await page.goto("/projects");
    expect(response?.status()).toBe(200);

    await page.waitForLoadState("domcontentloaded");
    // Projects page renders a main element with project sections
    const main = page.getByRole("main").first();
    await expect(main).toBeVisible();
    // At least one section should be rendered (allow for dev-mode render timing)
    await expect(main.locator("section").first()).toBeVisible({
      timeout: 10000,
    });
  });

  test("contact page responds with HTTP 200 and form is visible", async ({
    page,
  }) => {
    const response = await page.goto("/contact");
    expect(response?.status()).toBe(200);

    const form = page.locator("form").first();
    await expect(form).toBeVisible({ timeout: 5000 });
  });

  test("services page responds with HTTP 200", async ({ page }) => {
    const response = await page.goto("/services");
    expect(response?.status()).toBe(200);

    await page.waitForLoadState("domcontentloaded");
    const main = page.getByRole("main").first();
    await expect(main).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// 2. In-page navigation
// ---------------------------------------------------------------------------
test.describe("in-page navigation", () => {
  test("clicking About link from footer navigates to /about", async ({
    page,
  }) => {
    await page.goto("/");

    // Scroll to footer and find the About Us link
    const footer = page.locator("footer");
    await footer.scrollIntoViewIfNeeded();
    const aboutLink = footer.locator("a[href='/about']").first();
    await expect(aboutLink).toBeVisible({ timeout: 5000 });

    // Use Promise.all to capture the navigation event triggered by the click
    await Promise.all([
      page.waitForURL(/\/about/, { timeout: 10000 }),
      aboutLink.click(),
    ]);

    expect(page.url()).toMatch(/\/about/);
  });

  test("footer contains a link to /about and it is reachable", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // Scroll to footer and find the About Us link
    const footer = page.locator("footer");
    await footer.scrollIntoViewIfNeeded();

    const footerAboutLink = footer
      .locator("a[href='/about'], a[href*='/about']")
      .first();
    await expect(footerAboutLink).toBeVisible({ timeout: 5000 });

    const response = await page.goto("/about");
    expect(response?.status()).toBe(200);
  });
});

// ---------------------------------------------------------------------------
// 3. Projects category filter
// ---------------------------------------------------------------------------
test.describe("projects category filter", () => {
  test("?category=commercial-lighting loads and shows main content", async ({
    page,
  }) => {
    const response = await page.goto("/projects?category=commercial-lighting");
    expect(response?.status()).toBe(200);

    await page.waitForLoadState("domcontentloaded");
    const main = page.getByRole("main").first();
    await expect(main).toBeVisible();
  });

  test("?category=power-boards loads and shows main content", async ({
    page,
  }) => {
    const response = await page.goto("/projects?category=power-boards");
    expect(response?.status()).toBe(200);

    await page.waitForLoadState("domcontentloaded");
    const main = page.getByRole("main").first();
    await expect(main).toBeVisible();
  });

  test("invalid ?category=invalid falls back gracefully with HTTP 200", async ({
    page,
  }) => {
    // Invalid category should fall back to 'all', not crash with 500
    const response = await page.goto("/projects?category=invalid");
    expect(response?.status()).toBe(200);

    await page.waitForLoadState("domcontentloaded");
    const main = page.getByRole("main").first();
    await expect(main).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// 4. Page metadata
// ---------------------------------------------------------------------------
test.describe("page metadata", () => {
  test("homepage <meta name='description'> is set and non-empty", async ({
    page,
  }) => {
    await page.goto("/");

    const description = await page.getAttribute(
      'meta[name="description"]',
      "content",
    );
    expect(description).toBeTruthy();
    expect(description!.trim().length).toBeGreaterThan(0);
  });

  test("about page has <link rel='canonical'> set", async ({ page }) => {
    await page.goto("/about");

    const canonical = await page.getAttribute('link[rel="canonical"]', "href");
    expect(canonical).toBeTruthy();
    expect(canonical).toMatch(/about/);
  });

  test("homepage <meta property='og:title'> is present and non-empty", async ({
    page,
  }) => {
    await page.goto("/");

    const ogTitle = await page.getAttribute(
      'meta[property="og:title"]',
      "content",
    );
    expect(ogTitle).toBeTruthy();
    expect(ogTitle!.trim().length).toBeGreaterThan(0);
  });
});
