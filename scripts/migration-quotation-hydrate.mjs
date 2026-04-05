#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import process from "node:process";

const gatewayUrl = process.env.MCP_GATEWAY_URL || "http://127.0.0.1:3100";

// SYNC_VERSION: 2026-04-05-v1 — quotation migration readiness + contact-to-quotation learnings
const REQUIRED_NODES = [
  {
    name: "agent:v1:project:electrical-website",
    entityType: "project",
    observations: [
      "Project memory root for electrical-website.",
      "Startup rule for quotation migration: run pnpm migration:quotation:hydrate:strict before orchestration.",
      "Always run pnpm docker:mcp:playwright:bootstrap before browser automation workflows.",
      "Playwright MCP runtime baseline: playwright and executor-playwright use browser-capable image mcr.microsoft.com/playwright:v1.58.2-noble.",
      "Memory MCP is the continuity source of truth for cross-session migration state.",
      "Quotation migration target: /quotation page and 7-step form lift-and-shift.",
    ],
  },
  {
    name: "agent:v1:heuristic_snapshots:2026-04-05-contact-to-quotation-learnings",
    entityType: "heuristic_snapshot",
    observations: [
      "Carry-forward from contact migration: per-step schemas + authoritative server safeParse keeps multi-step forms stable.",
      "Carry-forward: each step stores validated data into Zustand and advances only when current step is valid.",
      "Carry-forward: avoid persisting anti-bot tokens in localStorage or durable client state.",
      "Carry-forward: strict preflight plus memory hydration reduces context drift in long migrations.",
      "Carry-forward: verify each dependency-safe batch before unlocking the next batch.",
      "Carry-forward: use executor-playwright workflow mode to validate realistic multi-step progression end-to-end.",
      "Carry-forward: prefer targeted validation gates at milestones over broad reruns on every file copy.",
      "Carry-forward: keep env reporting masked with key-name present/missing only.",
    ],
  },
  {
    name: "agent:v1:heuristic_snapshots:2026-04-05-quotation-migration-readiness",
    entityType: "heuristic_snapshot",
    observations: [
      "Canonical source for migration is docs/quotation-migration/quotation-page-lift-and-shift.md.",
      "Migration shape: /quotation page includes 7-step flow indexed 0..6 with shared step reuse.",
      "Shared steps required: components/organisms/shared-steps/contact-info-step.tsx and address-info-step.tsx.",
      "Key form differences vs contact: termsAccepted required, QR reference IDs, 3 requests per 5 minutes rate limit.",
      "Submission path includes CSRF check, rate limit check, sanitize, completeQuotationSchema safeParse, then email dispatch.",
      "Expected success output: QR-{timestamp36}-{uuidChunk} reference and success UI state.",
      "If Strapi-backed email config imports are unavailable, apply env-backed fallback documented in quotation guide section 8.",
      "Final validation gates: npx tsc --noEmit, pnpm build, and executor-playwright step-sequence proof.",
    ],
  },
  {
    name: "agent:v1:reasoning:2026-04-05-quotation-migration-execution-plan",
    entityType: "reasoning",
    observations: [
      "Execution model: copy in dependency order from canonical 10 rounds; do not skip rounds.",
      "Batch strategy: release one dependency-safe batch, verify green, then unlock next.",
      "Suggested batch map: (1) lib foundations, (2) email+types+data, (3) providers/atoms/molecules/shared organisms, (4) features/quotation, (5) app page + env + typecheck, (6) build + runtime validation.",
      "At each checkpoint report findings, evidence, pass/fail, risks, and next recommendation.",
      "Pause progression on blockers; resolve within current batch before continuing.",
      "Do not perform unrelated repo refactors while migration lane is active.",
      "Document all divergence decisions (e.g., env-backed email config fallback) in runbook evidence.",
    ],
  },
  {
    name: "agent:v1:reasoning:2026-04-05-quotation-executor-playwright-validation",
    entityType: "reasoning",
    observations: [
      "Use executor-playwright workflow mode for deterministic step-sequence validation on /quotation.",
      "Workflow should validate 7-step progression from step 0 contact info through step 6 review.",
      "Use valid test data that satisfies step schemas including required termsAccepted gate.",
      "Capture evidence: transition success per step, final submit, success state, and QR- reference pattern.",
      "On failure, capture failing step index, selector/runtime error, and remediation recommendation before retry.",
      "Ensure browser runtime preflight is green via pnpm docker:mcp:playwright:bootstrap before workflow execution.",
    ],
  },
  {
    name: "agent:v1:handoff:quotation-migration-new-window-2026-04-05",
    entityType: "handoff",
    observations: [
      "New-window startup prompt file: docs/quotation-migration/NEXT_WINDOW_PROMPT_QUOTATION_MIGRATION_2026-04-05.md.",
      "Full-memory prompt file: docs/FULL_MEMORY_SYNC_PROMPT_QUOTATION_PAGE_MIGRATION_2026-04-05.md.",
      "Runbook file: docs/quotation-migration/QUOTATION_MIGRATION_SYNC_RUNBOOK_2026-04-05.md.",
      "Batch-1 prompt file: docs/quotation-migration/NEXT_WINDOW_PROMPT_QUOTATION_BATCH1_2026-04-05.md.",
      "Hydration commands: pnpm migration:quotation:hydrate then pnpm migration:quotation:hydrate:strict.",
    ],
  },
];

const REQUIRED_RELATIONS = [
  {
    from: "agent:v1:project:electrical-website",
    to: "agent:v1:heuristic_snapshots:2026-04-05-contact-to-quotation-learnings",
    relationType: "tracks",
  },
  {
    from: "agent:v1:project:electrical-website",
    to: "agent:v1:heuristic_snapshots:2026-04-05-quotation-migration-readiness",
    relationType: "tracks",
  },
  {
    from: "agent:v1:project:electrical-website",
    to: "agent:v1:reasoning:2026-04-05-quotation-migration-execution-plan",
    relationType: "stores",
  },
  {
    from: "agent:v1:project:electrical-website",
    to: "agent:v1:reasoning:2026-04-05-quotation-executor-playwright-validation",
    relationType: "stores",
  },
  {
    from: "agent:v1:project:electrical-website",
    to: "agent:v1:handoff:quotation-migration-new-window-2026-04-05",
    relationType: "stores",
  },
  {
    from: "agent:v1:reasoning:2026-04-05-quotation-migration-execution-plan",
    to: "agent:v1:reasoning:2026-04-05-multistep-form-migration-blueprint",
    relationType: "references",
  },
  {
    from: "agent:v1:heuristic_snapshots:2026-04-05-contact-to-quotation-learnings",
    to: "agent:v1:heuristic_snapshots:2026-04-05-contact-form-migration-complete",
    relationType: "references",
  },
  {
    from: "agent:v1:handoff:quotation-migration-new-window-2026-04-05",
    to: "agent:v1:heuristic_snapshots:2026-04-05-quotation-migration-readiness",
    relationType: "references",
  },
  {
    from: "agent:v1:reasoning:2026-04-05-quotation-executor-playwright-validation",
    to: "agent:v1:reasoning:2026-04-05-quotation-migration-execution-plan",
    relationType: "supports",
  },
];

function hasStrictFlag() {
  return process.argv.includes("--strict");
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

  console.log(
    "[hydrate] Step 1/3: Running preflight (migration:quotation:ready)...",
  );
  runPnpm(["migration:quotation:ready"]);

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
    `\n[hydrate] Quotation migration memory hydration complete${strictMode ? " (strict mode)" : ""}.`,
  );
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[hydrate] Failed: ${message}`);
  process.exit(1);
});
