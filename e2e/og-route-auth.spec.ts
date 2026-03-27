import { test, expect } from "@playwright/test";

/**
 * OG Route Authentication Tests (ticket-002-fix-api-og-route-auth)
 *
 * Validates origin whitelist and parameter validation for /api/og route
 * Tests all 5 scenarios:
 * 1. No origin (SEO crawlers)
 * 2. Localhost authorized (local development)
 * 3. Subdomain authorized (cdn subdomain)
 * 4. Unauthorized attacker.com (should reject)
 * 5. Invalid parameters (should reject)
 */

// Base URL for tests
const BASE_URL = "http://localhost:3000";

test.describe("OG Route Authentication", () => {
  /**
   * Scenario 1: No origin header (SEO crawlers, direct browser)
   * Expected: 200 OK with SVG image
   */
  test("Scenario 1: No origin header - should allow SEO crawlers", async ({
    request,
  }) => {
    // Direct browser request without Origin header
    const response = await request.get(
      `${BASE_URL}/api/og?title=Test+Project&category=Industrial`,
    );

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/svg+xml");
  });

  /**
   * Scenario 2: Localhost authorized
   * Expected: 200 OK with SVG image
   */
  test("Scenario 2: Localhost authorized - should allow local development", async ({
    request,
  }) => {
    const response = await request.get(
      `${BASE_URL}/api/og?title=Test+Project&category=Industrial`,
      {
        headers: {
          Origin: "http://localhost:3000",
        },
      },
    );

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/svg+xml");
  });

  /**
   * Scenario 3: Authorized subdomain (cdn.nexgen-electrical-innovations.co.uk)
   * Expected: 200 OK with SVG image
   */
  test("Scenario 3: Authorized subdomain - should allow cdn subdomain", async ({
    request,
  }) => {
    const response = await request.get(
      `${BASE_URL}/api/og?title=Test+Project&category=Industrial`,
      {
        headers: {
          Origin: "https://cdn.nexgen-electrical-innovations.co.uk",
        },
      },
    );

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/svg+xml");
  });

  /**
   * Scenario 4: Unauthorized origin (attacker.com)
   * Expected: 403 Forbidden
   */
  test("Scenario 4: Unauthorized origin - should reject attacker.com", async ({
    request,
  }) => {
    const response = await request.get(
      `${BASE_URL}/api/og?title=Test+Project&category=Industrial`,
      {
        headers: {
          Origin: "https://attacker.com",
        },
      },
    );

    expect(response.status()).toBe(403);
    expect(response.headers()["cache-control"]).toContain("no-cache");
  });

  /**
   * Scenario 5: Invalid parameter - bad hex color
   * Expected: 400 Bad Request
   */
  test("Scenario 5: Invalid parameters - should reject bad hex color", async ({
    request,
  }) => {
    // accentColor must be valid hex format (#RRGGBB)
    const response = await request.get(
      `${BASE_URL}/api/og?title=Test&accentColor=NotHex`,
    );

    expect(response.status()).toBe(400);
    expect(response.headers()["cache-control"]).toContain("no-cache");
  });

  /**
   * Additional test: Title too long (max 100 chars)
   * Expected: 400 Bad Request
   */
  test("Bonus: Title exceeds max length - should reject", async ({
    request,
  }) => {
    const longTitle = "A".repeat(101); // 101 chars, exceeds 100 char limit
    const response = await request.get(
      `${BASE_URL}/api/og?title=${encodeURIComponent(longTitle)}`,
    );

    expect(response.status()).toBe(400);
  });

  /**
   * Additional test: Category too long (max 50 chars)
   * Expected: 400 Bad Request
   */
  test("Bonus: Category exceeds max length - should reject", async ({
    request,
  }) => {
    const longCategory = "A".repeat(51); // 51 chars, exceeds 50 char limit
    const response = await request.get(
      `${BASE_URL}/api/og?title=Test&category=${encodeURIComponent(longCategory)}`,
    );

    expect(response.status()).toBe(400);
  });

  /**
   * Additional test: Valid hex color accepted
   * Expected: 200 OK with custom color
   */
  test("Bonus: Valid hex color - should accept #FF00FF", async ({
    request,
  }) => {
    const response = await request.get(
      `${BASE_URL}/api/og?title=Test&category=Industrial&accentColor=%23FF00FF`,
    );

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/svg+xml");

    // Verify SVG contains the color
    const text = await response.text();
    expect(text).toContain("#FF00FF");
  });

  /**
   * Additional test: Valid authorized subdomain - API gateway
   * Expected: 200 OK
   */
  test("Bonus: API gateway subdomain - should allow api subdomain", async ({
    request,
  }) => {
    const response = await request.get(
      `${BASE_URL}/api/og?title=Test&category=Industrial`,
      {
        headers: {
          Origin: "https://api.nexgen-electrical-innovations.co.uk",
        },
      },
    );

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/svg+xml");
  });

  /**
   * Additional test: Valid main domain
   * Expected: 200 OK
   */
  test("Bonus: Main domain - should allow nexgen-electrical-innovations.co.uk", async ({
    request,
  }) => {
    const response = await request.get(
      `${BASE_URL}/api/og?title=Test&category=Industrial`,
      {
        headers: {
          Origin: "https://nexgen-electrical-innovations.co.uk",
        },
      },
    );

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/svg+xml");
  });

  /**
   * Security: Case-insensitive origin matching
   * Expected: 200 OK
   */
  test("Security: Uppercase origin - should handle case-insensitive", async ({
    request,
  }) => {
    const response = await request.get(
      `${BASE_URL}/api/og?title=Test&category=Industrial`,
      {
        headers: {
          Origin: "HTTPS://cdn.NEXGEN-ELECTRICAL-INNOVATIONS.CO.UK",
        },
      },
    );

    expect(response.status()).toBe(200);
  });
});
