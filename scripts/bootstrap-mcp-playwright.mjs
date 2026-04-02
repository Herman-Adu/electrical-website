#!/usr/bin/env node
/* eslint-disable no-console */

import { spawnSync } from "node:child_process";

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    stdio: options.capture ? "pipe" : "inherit",
    encoding: "utf8",
    ...options,
  });

  if (result.status !== 0) {
    const stderr = result.stderr?.trim();
    const stdout = result.stdout?.trim();
    const detail = stderr || stdout || `exit ${result.status}`;
    throw new Error(`${command} ${args.join(" ")} failed: ${detail}`);
  }

  return result;
}

function listPlaywrightContainers() {
  const result = run("docker", ["ps", "--format", "{{.Names}}|{{.Image}}"], {
    capture: true,
  });

  const lines = result.stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return lines
    .map((line) => {
      const [name, image] = line.split("|");
      return { name, image };
    })
    .filter(({ name, image }) => {
      const normalizedName = name.toLowerCase();
      const normalizedImage = image.toLowerCase();
      return (
        normalizedImage.includes("mcp/playwright") ||
        normalizedImage.includes("playwright-mcp") ||
        normalizedName.includes("playwright")
      );
    });
}

function hasPlaywrightCli(containerName) {
  const result = run(
    "docker",
    [
      "exec",
      containerName,
      "sh",
      "-lc",
      "if [ -f /app/node_modules/playwright/cli.js ] || [ -f /usr/local/lib/node_modules/playwright/cli.js ] || command -v playwright >/dev/null 2>&1; then echo yes; else echo no; fi",
    ],
    { capture: true },
  );

  return result.stdout.includes("yes");
}

function bootstrapContainer(containerName) {
  if (!hasPlaywrightCli(containerName)) {
    console.log(
      `[mcp:playwright:bootstrap] Skipping ${containerName} (no Playwright CLI in container).`,
    );
    return false;
  }

  const script = [
    "set -eu",
    "if [ -f /app/node_modules/playwright/cli.js ]; then CLI='node /app/node_modules/playwright/cli.js';",
    "elif [ -f /usr/local/lib/node_modules/playwright/cli.js ]; then CLI='node /usr/local/lib/node_modules/playwright/cli.js';",
    "elif command -v playwright >/dev/null 2>&1; then CLI='playwright';",
    "else echo 'Playwright CLI not found in container'; exit 1; fi",
    "PLAYWRIGHT_BROWSERS_PATH=/root/.cache/ms-playwright $CLI install chromium",
    "LATEST=$(ls -1d /root/.cache/ms-playwright/chromium_headless_shell-* 2>/dev/null | sort -V | tail -n 1 || true)",
    'if [ -n "$LATEST" ]; then',
    "  mkdir -p /root/.cache/ms-playwright/chromium_headless_shell-1179/chrome-linux",
    '  ln -sf "$LATEST/chrome-linux/headless_shell" /root/.cache/ms-playwright/chromium_headless_shell-1179/chrome-linux/headless_shell',
    "fi",
  ].join("; ");

  run("docker", ["exec", "-u", "0", containerName, "sh", "-lc", script]);
  return true;
}

function main() {
  try {
    const containers = listPlaywrightContainers();

    if (containers.length === 0) {
      console.log(
        "[mcp:playwright:bootstrap] No Playwright MCP containers detected. Skipping.",
      );
      return;
    }

    console.log(
      `[mcp:playwright:bootstrap] Found ${containers.length} Playwright-named container(s): ${containers
        .map((container) => container.name)
        .join(", ")}`,
    );

    let installedCount = 0;

    for (const { name } of containers) {
      console.log(`[mcp:playwright:bootstrap] Bootstrapping ${name} ...`);
      if (bootstrapContainer(name)) {
        installedCount += 1;
        console.log(`[mcp:playwright:bootstrap] ${name} ready.`);
      }
    }

    if (installedCount === 0) {
      console.log(
        "[mcp:playwright:bootstrap] No MCP Playwright runtime containers required bootstrapping.",
      );
      return;
    }

    console.log(
      `[mcp:playwright:bootstrap] Browser binaries installed successfully in ${installedCount} container(s).`,
    );
  } catch (error) {
    console.error(`[mcp:playwright:bootstrap] Failed: ${error.message}`);
    process.exit(1);
  }
}

main();
