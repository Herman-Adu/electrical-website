#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import process from "node:process";

const gatewayUrl = process.env.MCP_GATEWAY_URL || "http://127.0.0.1:3100";

// SYNC_VERSION: 2026-04-05-v1 — service-request animated + shared-core migration hydration
const REQUIRED_NODES = [
  {
    name: "agent:v1:project:electrical-website",
    entityType: "project",
    observations: [
      "Project memory root for electrical-website.",
      "Startup rule for service-request migration: run pnpm migration:service-request:hydrate:strict before orchestration.",
      "Always run pnpm docker:mcp:playwright:bootstrap before browser automation workflows.",
      "Playwright MCP runtime baseline: playwright and executor-playwright use browser-capable image mcr.microsoft.com/playwright:v1.58.2-noble.",
      "Memory MCP is the continuity source of truth for cross-session migration state.",
      "Service-request migration target: embedded section on /services only, preserve electric/light-bulb animation identity.",
    ],
  },
  {
    name: "agent:v1:batch:forms-hardening:batch-1",
    entityType: "batch",
    observations: [
      "Forms-hardening batch-1 baseline captured for shared form architecture consistency.",
    ],
  },
  {
    name: "agent:v1:batch:forms-hardening:batch-2",
    entityType: "batch",
    observations: [
      "Forms-hardening batch-2 baseline captured for shared form architecture consistency.",
    ],
  },
  {
    name: "agent:v1:batch:forms-hardening:batch-3",
    entityType: "batch",
    observations: [
      "Forms-hardening batch-3 baseline captured for shared form architecture consistency.",
    ],
  },
  {
    name: "agent:v1:batch:forms-hardening:batch-8-hotfix",
    entityType: "batch",
    observations: [
      "Forms-hardening batch-8 hotfix baseline captured for shared form architecture consistency.",
    ],
  },
  {
    name: "agent:v1:batch:forms-hardening:finalization-2026-04-05",
    entityType: "batch",
    observations: [
      "Forms-hardening finalization baseline used as prerequisite context for service-request migration.",
    ],
  },
  {
    name: "agent:v1:heuristic_snapshots:2026-04-05-orchestrator-workflow-gold-standard",
    entityType: "heuristic_snapshot",
    observations: [
      "Gold-standard orchestration baseline for dependency-safe batching and independent verification.",
      "Checkpoint format requirement: findings, evidence, pass/fail, risks, next recommendation.",
    ],
  },
  {
    name: "agent:v1:pr:47",
    entityType: "pull_request",
    observations: [
      "PR #47 baseline captured for forms-hardening continuity and shared-core compatibility expectations.",
    ],
  },
  {
    name: "agent:v1:scope:service-request:form-section-only-2026-04-05",
    entityType: "scope",
    observations: [
      "Scope lock: migrate only service-request form section on /services.",
      "Do not modify unrelated page blocks such as hero, services grid, certifications, trust, or footer.",
      "Preserve unique service-request electric/light-bulb animations while staying compatible with shared DRY multistep architecture.",
    ],
  },
  {
    name: "agent:v1:doc:service-request-form-section-only-migration-2026-04-05",
    entityType: "doc",
    observations: [
      "Canonical section-only guide: docs/Service request form migration/service-request-form-section-only-migration.md.",
      "Companion deep reference: docs/Service request form migration/services-page-lift-and-shift.md.",
      "Companion full-sync prompt: docs/FULL_MEMORY_SYNC_PROMPT_SERVICE_REQUEST_ANIMATED_MIGRATION_2026-04-05.md.",
      "Companion new-window prompt: docs/Service request form migration/NEXT_WINDOW_PROMPT_SERVICE_REQUEST_ANIMATED_MIGRATION_2026-04-05.md.",
    ],
  },
  {
    name: "agent:v1:next-task:service-request:section-only-implementation",
    entityType: "next_task",
    observations: [
      "Implement only the embedded service-request section on /services.",
      "Required outcomes: preserve full behavior (validation, review/edit routing, action flow, security, email).",
      "Required outcomes: preserve electric/light-bulb animation identity and shared-core compatibility.",
      "Validation gate: targeted tests, then pnpm exec tsc --noEmit, then pnpm build.",
    ],
  },
  {
    name: "agent:v1:handoff:service-request-migration-new-window-2026-04-05",
    entityType: "handoff",
    observations: [
      "New-window prompt file: docs/Service request form migration/NEXT_WINDOW_PROMPT_SERVICE_REQUEST_ANIMATED_MIGRATION_2026-04-05.md.",
      "Full-memory prompt file: docs/FULL_MEMORY_SYNC_PROMPT_SERVICE_REQUEST_ANIMATED_MIGRATION_2026-04-05.md.",
      "Hydration commands: pnpm migration:service-request:hydrate then pnpm migration:service-request:hydrate:strict.",
    ],
  },
];

const REQUIRED_RELATIONS = [
  {
    from: "agent:v1:project:electrical-website",
    to: "agent:v1:batch:forms-hardening:batch-1",
    relationType: "tracks",
  },
  {
    from: "agent:v1:project:electrical-website",
    to: "agent:v1:batch:forms-hardening:batch-2",
    relationType: "tracks",
  },
  {
    from: "agent:v1:project:electrical-website",
    to: "agent:v1:batch:forms-hardening:batch-3",
    relationType: "tracks",
  },
  {
    from: "agent:v1:project:electrical-website",
    to: "agent:v1:batch:forms-hardening:batch-8-hotfix",
    relationType: "tracks",
  },
  {
    from: "agent:v1:project:electrical-website",
    to: "agent:v1:batch:forms-hardening:finalization-2026-04-05",
    relationType: "tracks",
  },
  {
    from: "agent:v1:project:electrical-website",
    to: "agent:v1:heuristic_snapshots:2026-04-05-orchestrator-workflow-gold-standard",
    relationType: "tracks",
  },
  {
    from: "agent:v1:project:electrical-website",
    to: "agent:v1:pr:47",
    relationType: "references",
  },
  {
    from: "agent:v1:project:electrical-website",
    to: "agent:v1:scope:service-request:form-section-only-2026-04-05",
    relationType: "stores",
  },
  {
    from: "agent:v1:project:electrical-website",
    to: "agent:v1:doc:service-request-form-section-only-migration-2026-04-05",
    relationType: "stores",
  },
  {
    from: "agent:v1:project:electrical-website",
    to: "agent:v1:next-task:service-request:section-only-implementation",
    relationType: "stores",
  },
  {
    from: "agent:v1:project:electrical-website",
    to: "agent:v1:handoff:service-request-migration-new-window-2026-04-05",
    relationType: "stores",
  },
  {
    from: "agent:v1:next-task:service-request:section-only-implementation",
    to: "agent:v1:scope:service-request:form-section-only-2026-04-05",
    relationType: "references",
  },
  {
    from: "agent:v1:doc:service-request-form-section-only-migration-2026-04-05",
    to: "agent:v1:scope:service-request:form-section-only-2026-04-05",
    relationType: "defines",
  },
  {
    from: "agent:v1:handoff:service-request-migration-new-window-2026-04-05",
    to: "agent:v1:next-task:service-request:section-only-implementation",
    relationType: "references",
  },
  {
    from: "agent:v1:handoff:service-request-migration-new-window-2026-04-05",
    to: "agent:v1:doc:service-request-form-section-only-migration-2026-04-05",
    relationType: "references",
  },
];

function hasStrictFlag() {
  return process.argv.includes("--strict");
}

function shouldSkipPreflight() {
  return (
    process.argv.includes("--skip-preflight") ||
    process.env.MCP_PREFLIGHT_DONE === "1"
  );
}

function runPnpm(args) {
  const result = spawnSync(`pnpm ${args.join(" ")}`, {
    stdio: "inherit",
    shell: true,
  });

  if (result.error) {
    throw new Error(`Command launch failed: ${result.error.message}`);
  }

  if (result.status !== 0) {
    throw new Error(
      `Command failed: pnpm ${args.join(" ")} (exit ${result.status ?? "unknown"})`,
    );
  }
}

function extractFirstJsonPayload(raw) {
  const text = String(raw ?? "").trim();
  if (!text) {
    throw new Error("Empty response body");
  }

  try {
    return JSON.parse(text);
  } catch {
    // Recover when transport wraps JSON with non-JSON text.
  }

  const start = text.indexOf("{");
  if (start < 0) {
    throw new Error("No JSON object found in response body");
  }

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = start; index < text.length; index += 1) {
    const char = text[index];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === "{") {
      depth += 1;
      continue;
    }

    if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        const candidate = text.slice(start, index + 1);
        return JSON.parse(candidate);
      }
    }
  }

  throw new Error("Unable to parse response as JSON payload");
}

async function callMemoryTool(name, args) {
  const response = await fetch(`${gatewayUrl}/memory/tools/call`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, arguments: args }),
  });

  const rawText = await response.text();
  const parsed = extractFirstJsonPayload(rawText);

  if (!response.ok) {
    const message =
      typeof parsed?.error === "string"
        ? parsed.error
        : `HTTP ${response.status}`;
    throw new Error(message);
  }

  return parsed;
}

function getEntities(toolResult) {
  return (
    toolResult?.content?.[0]?.json?.entities ??
    toolResult?.content?.[0]?.entities ??
    []
  );
}

async function ensureNodes() {
  const names = REQUIRED_NODES.map((node) => node.name);
  const opened = await callMemoryTool("open_nodes", { names });
  const existing = new Set(getEntities(opened).map((entity) => entity.name));

  const missing = REQUIRED_NODES.filter((node) => !existing.has(node.name));

  if (missing.length > 0) {
    if (hasStrictFlag()) {
      throw new Error(
        `Strict hydration failed. Missing required memory keys: ${missing
          .map((node) => node.name)
          .join(", ")}`,
      );
    }

    await callMemoryTool("create_entities", {
      entities: missing.map((node) => ({
        entityType: node.entityType,
        name: node.name,
        observations: node.observations,
      })),
    });
  }

  return { created: missing.length, existing: names.length - missing.length };
}

async function syncObservations() {
  for (const node of REQUIRED_NODES) {
    try {
      await callMemoryTool("add_observations", {
        observations: [
          {
            entityName: node.name,
            contents: node.observations,
          },
        ],
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(
        `[hydrate] Warning: could not sync observations for ${node.name}: ${msg}`,
      );
    }
  }
}

async function ensureRelations() {
  await callMemoryTool("create_relations", {
    relations: REQUIRED_RELATIONS,
  });
}

async function hydrateAndPrintSummary() {
  const names = REQUIRED_NODES.map((node) => node.name);
  const opened = await callMemoryTool("open_nodes", { names });
  const entities = getEntities(opened);

  console.log("\n[hydrate] Hydrated keys:");
  for (const key of names) {
    const found = entities.some((entity) => entity.name === key);
    console.log(`- ${key} :: ${found ? "ready" : "missing"}`);
  }
}

async function main() {
  const strictMode = hasStrictFlag();
  const skipPreflight = shouldSkipPreflight();

  if (skipPreflight) {
    console.log(
      "[hydrate] Step 1/3: Skipping preflight (MCP_PREFLIGHT_DONE=1 or --skip-preflight).",
    );
  } else {
    console.log(
      "[hydrate] Step 1/3: Running preflight (migration:service-request:ready)...",
    );
    runPnpm(["migration:service-request:ready"]);
  }

  console.log(
    `[hydrate] Step 2/3: ${strictMode ? "Verifying" : "Ensuring"} required memory nodes and relations...`,
  );
  const nodeResult = await ensureNodes();
  await ensureRelations();

  console.log(
    `[hydrate] Nodes existing=${nodeResult.existing}, created=${nodeResult.created}`,
  );

  console.log(
    "[hydrate] Step 2b/3: Syncing latest observations to all nodes...",
  );
  await syncObservations();

  console.log("[hydrate] Step 3/3: Hydrating ordered key set...");
  await hydrateAndPrintSummary();

  console.log(
    `\n[hydrate] Service-request migration memory hydration complete${strictMode ? " (strict mode)" : ""}.`,
  );
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[hydrate] Failed: ${message}`);
  process.exit(1);
});
