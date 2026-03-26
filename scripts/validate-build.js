#!/usr/bin/env node

const { execSync } = require("child_process");

console.log("[v0] Starting build validation...");

try {
  console.log("[v0] Running: pnpm run build");
  execSync("pnpm run build", {
    cwd: "/vercel/share/v0-project",
    stdio: "inherit",
  });
  console.log("[v0] ✓ Build completed successfully!");
  process.exit(0);
} catch (error) {
  console.error("[v0] ✗ Build failed with error:");
  console.error(error.message);
  process.exit(1);
}
