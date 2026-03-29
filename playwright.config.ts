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

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";
const REUSE_EXISTING_SERVER = process.env.PLAYWRIGHT_REUSE_SERVER === "true";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: !!process.env.CI,
  workers: process.env.CI ? 2 : 1,
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "playwright-report" }],
  ],
  retries: process.env.CI ? 2 : 1,

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

  // Local: Playwright auto-manages server lifecycle (spawns, waits, stops).
  // CI: Undefined — GitHub Actions manages server separately to avoid double-spawn conflicts.
  webServer: process.env.CI
    ? undefined
    : {
        command:
          "pnpm build && pnpm exec next start --hostname 127.0.0.1 --port 3000",
        url: BASE_URL,
        // Set PLAYWRIGHT_REUSE_SERVER=true when you manually run `pnpm dev`
        // and want Playwright to reuse that server instead of spawning another one.
        reuseExistingServer: REUSE_EXISTING_SERVER,
        timeout: 300_000,
        // Environment for spawned server: only used by Playwright's local webServer spawner.
        // NEXT_IMAGE_UNOPTIMIZED=true disables image optimization for faster test runs locally.
        // Note: This is injected AFTER build, so build uses default image optimization.
        // CI builds separately before webServer is spawned, so CI always uses default.
        env: {
          ...process.env,
          NEXT_IMAGE_UNOPTIMIZED: "true",
          HOSTNAME: "127.0.0.1",
          PORT: "3000",
        },
      },
});
