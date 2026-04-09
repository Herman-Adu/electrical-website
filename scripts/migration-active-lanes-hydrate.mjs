#!/usr/bin/env node

import fs from "node:fs";
import process from "node:process";
import { spawnSync } from "node:child_process";

const memoryKeysFile = process.argv[2] || "config/active-memory-lanes.json";

function readActiveMemoryKeys(path) {
  if (!fs.existsSync(path)) {
    throw new Error(`Active memory keys file not found: ${path}`);
  }

  const raw = fs.readFileSync(path, "utf8");
  const parsed = JSON.parse(raw);
  const keys = Array.isArray(parsed.memoryKeys)
    ? parsed.memoryKeys.filter(
        (k) => typeof k === "string" && k.trim().length > 0,
      )
    : [];

  if (keys.length === 0) {
    throw new Error(`No active memory keys configured in: ${path}`);
  }

  return [...new Set(keys)];
}

function openNodes(names) {
  const payload = JSON.stringify({ names });
  const result = spawnSync(
    "node",
    ["scripts/mcp-memory-call.mjs", "open_nodes", payload],
    {
      stdio: ["ignore", "pipe", "pipe"],
      encoding: "utf8",
      shell: false,
    },
  );

  if (result.error) {
    throw new Error(`Failed to run open_nodes: ${result.error.message}`);
  }

  if (result.status !== 0) {
    throw new Error(
      result.stderr?.trim() || `open_nodes failed with exit ${result.status}`,
    );
  }

  return JSON.parse(result.stdout);
}

function main() {
  const keys = readActiveMemoryKeys(memoryKeysFile);
  console.log(
    `[hydrate:active] Opening ${keys.length} configured active memory nodes...`,
  );

  const opened = openNodes(keys);
  const entities = opened?.content?.[0]?.json?.entities;

  if (!Array.isArray(entities)) {
    throw new Error(
      "Invalid response shape from open_nodes (entities missing)",
    );
  }

  console.log(`[hydrate:active] Loaded entities: ${entities.length}`);
  for (const entity of entities) {
    const observationCount = Array.isArray(entity?.observations)
      ? entity.observations.length
      : 0;
    console.log(
      `- ${entity?.name ?? "unknown"} (${entity?.entityType ?? "unknown"}, obs: ${observationCount})`,
    );
  }

  if (entities.length !== keys.length) {
    throw new Error(
      `Configured keys (${keys.length}) and loaded entities (${entities.length}) mismatch`,
    );
  }

  console.log("[hydrate:active] Complete.");
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[hydrate:active] Failed: ${message}`);
  process.exitCode = 1;
}
