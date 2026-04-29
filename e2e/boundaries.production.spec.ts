import { expect, test } from "@playwright/test";

/**
 * Error Boundary Tests — Production Build Only
 *
 * These tests require a production Next.js build. In development mode, Next.js
 * intercepts error-triggering render streams to inject its error overlay, which
 * causes Playwright to receive net::ERR_ABORTED. Against a production build the
 * error boundary catches the throw and renders the recovery UI correctly.
 *
 * Run via the `production-only` Playwright project:
 *   pnpm build && pnpm start
 *   PLAYWRIGHT_REUSE_SERVER=true pnpm test:e2e --project=production-only
 */

// ---------------------------------------------------------------------------
// 1. Services segment error boundary (production-required tests)
// ---------------------------------------------------------------------------
test.describe("services segment error boundary", () => {
  test("error fixture page renders informational content without trigger param", async ({
    page,
  }) => {
    const response = await page.goto("/services/error-test", {
      waitUntil: "domcontentloaded",
    });
    expect(response?.status()).toBe(200);
    await expect(page).toHaveURL(/\/services\/error-test$/);
    await expect(page.getByText(/error boundary test fixture/i)).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /services error boundary fixture/i }),
    ).toBeVisible();
  });

  test("error boundary surface activates when a render error is thrown", async ({
    page,
  }) => {
    const response = await page.goto("/services/error-test?trigger=error", {
      waitUntil: "domcontentloaded",
    });
    expect(response?.status()).toBe(200);
    await expect(page).toHaveURL(/\/services\/error-test\?trigger=error/);
    await expect(page.getByText(/services segment error/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /^retry$/i })).toBeVisible();
    await expect(
      page.getByRole("link", { name: /^back to services$/i }),
    ).toBeVisible();
  });

  test("error boundary retry button is present and clickable", async ({
    page,
  }) => {
    await page.goto("/services/error-test?trigger=error", {
      waitUntil: "domcontentloaded",
    });
    const retryButton = page.getByRole("button", { name: /^retry$/i });
    await expect(retryButton).toBeVisible();
    await retryButton.click();
    await expect(page).toHaveURL(/\/services\/error-test\?trigger=error/);
    await expect(page.getByText(/services segment error/i)).toBeVisible();
    await expect(
      page.getByRole("link", { name: /^back to services$/i }),
    ).toBeVisible();
  });

  test("Back to Services link navigates to /services", async ({ page }) => {
    await page.goto("/services/error-test?trigger=error", {
      waitUntil: "domcontentloaded",
    });
    const backLink = page.getByRole("link", { name: /^back to services$/i });
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute("href", "/services");
  });
});

// ---------------------------------------------------------------------------
// 2. Services segment loading boundary (structural wiring check)
// ---------------------------------------------------------------------------
test.describe("services segment loading boundary", () => {
  test("services index route responds 200 and renders expected content", async ({
    page,
  }) => {
    const response = await page.goto("/services", {
      waitUntil: "domcontentloaded",
    });
    expect(response?.status()).toBe(200);
    await page.waitForLoadState("domcontentloaded");
    const title = await page.title();
    expect(title.toLowerCase()).toMatch(/service|nexgen|electrical/i);
  });
});
