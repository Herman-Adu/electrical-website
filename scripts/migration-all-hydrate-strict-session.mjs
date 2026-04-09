#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import process from "node:process";

const skipPreflight = process.argv.includes("--skip-preflight");

function runPnpm(commandArgs, env = process.env) {
  const result = spawnSync(`pnpm ${commandArgs.join(" ")}`, {
    stdio: "inherit",
    shell: true,
    env,
  });

  if (result.error) {
    throw new Error(`Failed to launch command: ${result.error.message}`);
  }

  if (result.status !== 0) {
    throw new Error(
      `Command failed: pnpm ${commandArgs.join(" ")} (exit ${result.status ?? "unknown"})`,
    );
  }
}

function main() {
  console.log(
    "[hydrate:session] Legacy all-lane mode is deprecated for orchestrator platinum lane. Prefer `pnpm migration:active:hydrate`.",
  );

  if (!skipPreflight) {
    console.log("[hydrate:session] Step 1/2: Running MCP preflight once...");
    runPnpm(["docker:mcp:ready"]);
  } else {
    console.log(
      "[hydrate:session] Step 1/2: Skipping MCP preflight (--skip-preflight).",
    );
  }

  console.log(
    "[hydrate:session] Step 2/2: Running strict hydration for contact, quotation, and service-request...",
  );

  const hydratedEnv = {
    ...process.env,
    MCP_PREFLIGHT_DONE: "1",
  };

  runPnpm(["migration:contact:hydrate:strict"], hydratedEnv);
  runPnpm(["migration:quotation:hydrate:strict"], hydratedEnv);
  runPnpm(["migration:service-request:hydrate:strict"], hydratedEnv);

  console.log("[hydrate:session] Complete.");
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[hydrate:session] Failed: ${message}`);
  process.exitCode = 1;
}
