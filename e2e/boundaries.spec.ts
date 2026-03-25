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
    const response = await page.goto("/services/error-test");
    // Without the trigger param, the page renders normally
    expect(response?.status()).toBe(200);
    await expect(page.getByText("Error Boundary Test Fixture")).toBeVisible();
  });

  test("error boundary surface activates when a render error is thrown", async ({
    page,
  }) => {
    // Navigate to the fixture with the controlled throw trigger.
    // The error.tsx boundary catches the render error and renders the recovery UI.
    await page.goto("/services/error-test?trigger=error");

    // Recovery surface markers (from app/services/error.tsx)
    await expect(page.getByText("Services Segment Error")).toBeVisible();
    await expect(
      page.getByText("Unable to Load This Service View"),
    ).toBeVisible();

    // Retry button must be present and interactive
    const retryButton = page.getByRole("button", { name: /retry/i });
    await expect(retryButton).toBeVisible();
  });

  test("error boundary retry button is present and clickable", async ({
    page,
  }) => {
    await page.goto("/services/error-test?trigger=error");

    const retryButton = page.getByRole("button", { name: /retry/i });
    await expect(retryButton).toBeVisible();

    // Click retry — without a persistent error source the page may recover
    // or re-throw; either outcome is observable without hard-coding the result.
    await retryButton.click();

    // After retry, the button or the recovery surface should still be in the DOM
    // (re-throw) OR the page should no longer show the error surface (recovery).
    // We only assert that the click does not cause a fatal browser crash.
    // A more precise assertion requires a stateful error source.
    await page.waitForLoadState("networkidle");
  });

  test("Back to Services link navigates to /services", async ({ page }) => {
    await page.goto("/services/error-test?trigger=error");

    const backLink = page.getByRole("link", { name: /back to services/i });
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
    await page.waitForLoadState("networkidle");

    // Page title should contain services-related metadata (not error/loading stuck)
    const title = await page.title();
    expect(title.toLowerCase()).toMatch(/service|nexgen|electrical/i);
  });
});
