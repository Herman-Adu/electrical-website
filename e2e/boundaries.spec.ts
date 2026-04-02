import { expect, test } from "@playwright/test";

/**
 * Resilience Boundary Smoke Tests
 *
 * Verifies the three App Router boundary surfaces introduced in Phase 6:
 *   1. Global `not-found` boundary  — `app/not-found.tsx`
 *   2. Services segment error boundary — `app/services/error.tsx`
 *   3. Services segment loading boundary — `app/services/loading.tsx`
 *
 * These tests are intentionally minimal: they validate that each boundary
 * activates and renders its recovery UI, without testing visual details.
 *
 * Prerequisites:
 *   - A Next.js dev or production server must be running on the configured
 *     base URL (default: http://localhost:3000).
 *   - Run: pnpm dev (or pnpm build && pnpm start) before executing these tests.
 */

// ---------------------------------------------------------------------------
// 1. Global not-found boundary
// ---------------------------------------------------------------------------
test.describe("global not-found boundary", () => {
  test("unmatched route responds with 404 and renders custom not-found UI", async ({
    page,
  }) => {
    const response = await page.goto("/does-not-exist");

    // Next.js returns HTTP 404 for unmatched routes
    expect(response?.status()).toBe(404);

    // Custom boundary markers (from app/not-found.tsx)
    await expect(page.getByText("404 // Route Not Found")).toBeVisible();
    await expect(page.getByText("This Circuit Doesn't Exist")).toBeVisible();

    // Recovery link back to home
    await expect(page.getByRole("link", { name: /go home/i })).toBeVisible();
  });

  test("not-found page includes a link to services", async ({ page }) => {
    await page.goto("/does-not-exist");
    const servicesLink = page.getByRole("link", { name: /view services/i });
    await expect(servicesLink).toBeVisible();
    await expect(servicesLink).toHaveAttribute("href", "/services");
  });
});

// ---------------------------------------------------------------------------
// 2. Services segment error boundary
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
    // The fixture page renders its informational label when no trigger param is set.
    await expect(page.getByText(/error boundary test fixture/i)).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /services error boundary fixture/i }),
    ).toBeVisible();
  });

  test("error boundary surface activates when a render error is thrown", async ({
    page,
  }) => {
    // Navigate to the fixture with the controlled throw trigger.
    // The ErrorThrower component throws during render; the services error boundary
    // catches it and renders the recovery surface.
    const response = await page.goto("/services/error-test?trigger=error", {
      waitUntil: "domcontentloaded",
    });

    expect(response?.status()).toBe(200);
    await expect(page).toHaveURL(/\/services\/error-test\?trigger=error/);
    // Error boundary recovery surface must be visible.
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

    // The error boundary renders a Retry button — verify it is present and clickable.
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
    await page.goto("/services/error-test?trigger=error");

    // The error boundary renders a "Back to Services" link — verify it is present.
    const backLink = page.getByRole("link", { name: /^back to services$/i });
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute("href", "/services");
  });
});

// ---------------------------------------------------------------------------
// 3. Services segment loading boundary (structural wiring check)
// ---------------------------------------------------------------------------
test.describe("services segment loading boundary", () => {
  test("services index route responds 200 and renders expected content", async ({
    page,
  }) => {
    const response = await page.goto("/services");
    expect(response?.status()).toBe(200);

    // The loading skeleton is displayed during navigation transitions.
    // In a full SSR/static response the final content should be present.
    // We verify the route loads successfully — the boundary is wired correctly
    // if no fallback skeleton is stuck on screen.
    await page.waitForLoadState("domcontentloaded");

    // Page title should contain services-related metadata (not error/loading stuck)
    const title = await page.title();
    expect(title.toLowerCase()).toMatch(/service|nexgen|electrical/i);
  });
});
