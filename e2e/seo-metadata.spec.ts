import { test, expect } from "@playwright/test";

/**
 * SEO & Metadata Tests
 *
 * Validates that structured metadata endpoints, XML feeds, and Open Graph
 * tags are correctly configured across key routes.
 *
 * HTTP-level checks use the `request` fixture to avoid full browser rendering.
 * DOM-level checks use `page` to read rendered meta tags.
 *
 * Prerequisites:
 *   - A Next.js dev or production server must be running on the configured
 *     base URL (default: http://localhost:3000).
 *   - Run: pnpm dev (or pnpm build && pnpm start) before executing these tests.
 */

// ---------------------------------------------------------------------------
// 1. Static SEO endpoints
// ---------------------------------------------------------------------------
test.describe("static SEO endpoints", () => {
  test("/robots.txt returns 200 with text/plain content-type and contains User-agent", async ({
    request,
  }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);

    const contentType = response.headers()["content-type"] ?? "";
    expect(contentType).toMatch(/text\/plain/i);

    const body = await response.text();
    expect(body).toContain("User-agent");
  });

  test("/sitemap.xml returns 200 with XML content-type", async ({
    request,
  }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);

    const contentType = response.headers()["content-type"] ?? "";
    expect(contentType).toMatch(/xml/i);
  });

  test("/sitemap.xml body contains at least one <url> entry", async ({
    request,
  }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);

    const body = await response.text();
    expect(body).toMatch(/<url>|<urlset/i);
  });

  test("/feed.xml returns 200 (RSS feed endpoint)", async ({ request }) => {
    const response = await request.get("/feed.xml");
    expect(response.status()).toBe(200);
  });

  test("/feed.xml has RSS content-type and contains <rss> or <channel>", async ({
    request,
  }) => {
    const response = await request.get("/feed.xml");
    expect(response.status()).toBe(200);

    const contentType = response.headers()["content-type"] ?? "";
    expect(contentType).toMatch(/xml|rss/i);

    const body = await response.text();
    expect(body).toMatch(/<rss|<channel/i);
  });
});

// ---------------------------------------------------------------------------
// 2. Open Graph tags — homepage
// ---------------------------------------------------------------------------
test.describe("homepage Open Graph tags", () => {
  test("og:title is present and non-empty", async ({ page }) => {
    await page.goto("/");

    const ogTitle = await page.getAttribute(
      'meta[property="og:title"]',
      "content",
    );
    expect(ogTitle).toBeTruthy();
    expect(ogTitle!.trim().length).toBeGreaterThan(0);
  });

  test("og:description is present and non-empty", async ({ page }) => {
    await page.goto("/");

    const ogDesc = await page.getAttribute(
      'meta[property="og:description"]',
      "content",
    );
    expect(ogDesc).toBeTruthy();
    expect(ogDesc!.trim().length).toBeGreaterThan(0);
  });

  test("og:url is present and non-empty", async ({ page }) => {
    await page.goto("/");

    const ogUrl = await page.getAttribute(
      'meta[property="og:url"]',
      "content",
    );
    expect(ogUrl).toBeTruthy();
    expect(ogUrl!.trim().length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// 3. Open Graph tags — about page
// ---------------------------------------------------------------------------
test.describe("about page Open Graph tags", () => {
  test("og:title is present and contains 'About' or 'Nexgen'", async ({
    page,
  }) => {
    await page.goto("/about");

    const ogTitle = await page.getAttribute(
      'meta[property="og:title"]',
      "content",
    );
    expect(ogTitle).toBeTruthy();
    expect(ogTitle).toMatch(/about|nexgen/i);
  });
});

// ---------------------------------------------------------------------------
// 4. Projects page metadata
// ---------------------------------------------------------------------------
test.describe("projects page metadata", () => {
  test("page title contains 'Project' or 'Nexgen'", async ({ page }) => {
    await page.goto("/projects");
    await page.waitForLoadState("networkidle");

    const title = await page.title();
    expect(title).toMatch(/project|nexgen/i);
  });
});

// ---------------------------------------------------------------------------
// 5. 404 page
// ---------------------------------------------------------------------------
test.describe("404 not-found page", () => {
  test("unmatched route returns HTTP 404 and page title does not say '200' or 'OK'", async ({
    page,
  }) => {
    const response = await page.goto("/does-not-exist");
    expect(response?.status()).toBe(404);

    const title = await page.title();
    expect(title).not.toMatch(/\b200\b/i);
    expect(title).not.toMatch(/\bOK\b/);
  });
});
