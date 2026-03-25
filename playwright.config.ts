import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for boundary smoke verification.
 *
 * Targets a running dev or production server. Start the server before running
 * tests with `pnpm dev` or `pnpm start`.
 *
 * Usage:
 *   pnpm test:e2e                 (expects server on http://localhost:3000)
 *   pnpm test:e2e:ui              (opens Playwright UI mode)
 */

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "playwright-report" }],
  ],
  retries: process.env.CI ? 2 : 0,

  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  /**
   * Optional: uncomment to let Playwright start the dev server automatically.
   * By default, local runs use an already-running server.
   */
  // webServer: {
  //   command: "pnpm dev",
  //   url: "http://localhost:3000",
  //   reuseExistingServer: true,
  //   timeout: 120_000,
  // },
});
