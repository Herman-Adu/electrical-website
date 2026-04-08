#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import process from "node:process";

const gatewayUrl = process.env.MCP_GATEWAY_URL || "http://127.0.0.1:3100";

// SYNC_VERSION: 2026-04-05-v4 — added contact migration complete snapshot + next-migration blueprint nodes
// To update: edit observations here and re-run pnpm migration:contact:hydrate:strict
const REQUIRED_NODES = [
  {
    name: "agent:v1:project:electrical-website",
    entityType: "project",
    observations: [
      "Project memory root for electrical-website.",
      "Startup rule: run pnpm migration:contact:hydrate:strict before orchestration.",
      "When browser automation is required, immediately run pnpm docker:mcp:playwright:bootstrap after hydrate to ensure browser binaries exist in MCP runtime containers.",
      "Playwright MCP runtime baseline: playwright and executor-playwright compose services pinned to mcr.microsoft.com/playwright:v1.58.2-noble.",
      "If bootstrap reports non-browser-capable runtime, recreate the two Playwright services with --force-recreate --pull always before retrying.",
      "Memory MCP is the primary source of truth for session continuity.",
      "Stack: Next.js 16 App Router, TypeScript strict, Tailwind, shadcn/ui, Zod, pnpm.",
      "Branch: fix/contact-form-captcha-dev. Build passes. Emails send end-to-end.",
    ],
  },
  {
    name: "agent:v1:heuristic_snapshots:2026-04-04-contact-form-migration-learnings",
    entityType: "snapshot",
    observations: [
      "FINAL STATE 2026-04-05: Turnstile reintegrated into the 5-step contact form. Build passes.",
      "BUG: react-hook-form isValid never true on mount with mode onChange and Zustand defaultValues.",
      "FIX: add trigger to useForm destructure and call useEffect(() => { trigger(); }, [trigger]) after useForm.",
      "FIX APPLIED TO: contact-info-step.tsx, inquiry-type-step.tsx, reference-linking-step.tsx, message-details-step.tsx.",
      "Turnstile restored: turnstileToken is back in completeContactFormSchema, serverContactFormSchema, Zustand getCompleteFormData, and submitContactRequest verification flow.",
      "Step 1 now renders the Turnstile widget with success, expiry, and error handlers backed by ephemeral Zustand state.",
      "REUSABLE PATTERN: react-hook-form multi-step with Zustand defaults always needs trigger() on mount.",
      "Contact regression suite passes after reintegration: 3 files, 16 tests.",
    ],
  },
  {
    name: "agent:v1:heuristic_snapshots:2026-04-04-turnstile-reintegration-status",
    entityType: "snapshot",
    observations: [
      "STATUS 2026-04-05: Turnstile reintegration completed in code using the contact form payload path.",
      "REINTEGRATION STEP 1: Add test keys to .env.local only. Keys: NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA and TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA",
      "Completed: restored turnstileToken field validation in completeContactFormSchema and serverContactFormSchema.",
      "Completed: restored getCompleteFormData to return turnstileToken from ephemeral Zustand state.",
      "Completed: restored verifyTurnstileToken call in submitContactRequest before honeypot handling.",
      "Completed: contact-info-step.tsx now uses @marsidev/react-turnstile with success, expire, error, and retry handling.",
      "Completed: Continue and Submit buttons are both gated on turnstileToken presence.",
      "Regression tests updated: contact-schemas.test.ts now covers server schema turnstile validation.",
      "Validation status: pnpm build passed and pnpm test __tests__/contact passed with 16 tests.",
      "BLOCKER STATUS 2026-04-05: resolved at runtime config level by pinning Playwright MCP services to browser-capable image in docker-compose.yml and docker-compose.dev.yml.",
      "Bootstrap behavior updated: containers with Chromium/browser payload in /ms-playwright are treated as ready even when Playwright CLI is absent.",
      "Deterministic preflight now fails fast only on true non-browser-capable runtime mismatch.",
      "Operational rule: keep pnpm docker:mcp:playwright:bootstrap as mandatory pre-browser check after hydrate strict.",
      "Recovery path: if bootstrap reports Non-browser-capable runtime detected, run docker compose up -d --force-recreate --pull always playwright executor-playwright and rerun bootstrap.",
    ],
  },
  {
    name: "agent:v1:reasoning:2026-04-04-multistep-form-architecture-standard",
    entityType: "reasoning",
    observations: [
      "Next.js 16 pattern: Server Components first, client islands only for interactivity.",
      "Multi-step form: each step owns its schema, validates independently, stores to Zustand on Continue.",
      "Zustand store pattern: persist step data, never persist volatile anti-bot tokens.",
      "Validation gate: data-entry step Continue uses disabled={!isValid || isSubmitting}.",
      "Server action: use useActionState + useFormStatus, native form action={serverAction}.",
      "Server validation is authoritative: always safeParse with Zod regardless of client state.",
      "trigger() on mount is mandatory for any step that sources defaultValues from a Zustand store.",
    ],
  },
  {
    name: "agent:v1:reasoning:2026-04-04-turnstile-rebuild-next-actions",
    entityType: "reasoning",
    observations: [
      "Reintegration sequence: add test keys, restore schema, restore server verify, add widget, add gates.",
      "Validate every batch: pnpm build, targeted tests, manual browser check on /contact.",
      "Token lifecycle: widget onVerify stores to Zustand, getCompleteFormData includes in payload, server verifies with Siteverify.",
      "Token is ephemeral: never persist to localStorage or storage, reset on expiry and error.",
      "Siteverify request: secret + response token + idempotency_key (UUID) + optional remoteip.",
      "Error classes: timeout-or-duplicate (expired/replayed), invalid-input-secret, domain mismatch.",
      "Review step guard should redirect back to Step 1 when the token is missing or expired before submit.",
      "If MCP browser automation fails, run pnpm docker:mcp:playwright:bootstrap first; if mismatch persists, force-recreate Playwright services from compose and retry before manual-only fallback.",
      "Persist outcomes back to memory via pnpm migration:contact:hydrate:strict at session close.",
    ],
  },
  {
    name: "agent:v1:reasoning:2026-04-04-turnstile-react19-next16-best-practices",
    entityType: "reasoning",
    observations: [
      "React 19 + Next.js 16: useActionState replaces useFormState for server action state binding.",
      "useFormStatus pending flag prevents duplicate submits without extra state.",
      "Server Action mutation path: form action={serverAction}, progressive enhancement compatible.",
      "Turnstile widget: render in client component island, not in Server Component.",
      "Anti-bot tokens must be ephemeral: no localStorage, reset on expiry, re-challenge on error.",
      "Use strict hydration at session start to guarantee full context before implementation batches.",
      "MCP memory write-back uses direct HTTP to gateway, not VS Code MCP tool layer (encoding issues with tool layer).",
    ],
  },
  {
    name: "agent:v1:heuristic_snapshots:2026-04-05-contact-form-migration-complete",
    entityType: "heuristic_snapshot",
    observations: [
      "DATE: 2026-04-05. Status: COMPLETE. Merged to main as PR #39 commit 4e1f517. Branch fix/contact-validation-on-load deleted.",
      "FILE MAP: features/contact/ — schemas/, api/, hooks/, components/organisms/contact-steps/ (5 steps), components/organisms/contact-form.tsx.",
      "ZUSTAND STORE: use-contact-store.ts — partialize excludes isSubmitted, isSubmitting, turnstileToken. setSubmitted resets all slices + currentStep:1.",
      "STEP 1 (contact-info-step.tsx): mode onTouched, no trigger() useEffect, isTurnstileVerified = Boolean(turnstileToken), mapTurnstileClientError() for error codes.",
      "STEP 5 (contact-review-step.tsx): useActionState (React 19, NOT useFormState), native form action={serverAction}, SubmitButton uses useFormStatus.",
      "SERVER ACTION (contact-request.ts): use server, AbortController 8000ms on Siteverify, idempotency_key crypto.randomUUID(), reference CR-{timestamp36}-{uuid6}.",
      "SCHEMAS: contact-schemas.ts — one Zod schema per step + completeContactFormSchema + serverContactFormSchema. UK phone via isValidUkPhoneNumber().",
      "BUG FIXED THIS MIGRATION: react-hook-form isValid never true on mount with mode onChange + Zustand defaultValues — fix: add trigger() to useForm destructure and call in useEffect.",
      "BUG FIXED: trigger() useEffect removed from contact-info-step.tsx in final pass — mode onTouched makes it unnecessary and it caused hydration mismatch warnings.",
      "ENV VARS REQUIRED: NEXT_PUBLIC_TURNSTILE_SITE_KEY, TURNSTILE_SECRET_KEY, RESEND_API_KEY, CONTACT_EMAIL_TO, CONTACT_EMAIL_FROM, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS.",
      "TEST GATE: pnpm test __tests__/contact — 3 files, 16 tests must pass before any PR. pnpm build must pass.",
      "DOCKER WORKFLOW: pnpm docker:dev:up starts web-dev-1 on port 3000. pnpm docker:mcp:playwright:bootstrap ensures browser binaries. E2E via pnpm test:e2e.",
      "BRANCH PROTECTION: all work on feature branches. PR to main only. Copilot review requested via GitHub Actions skill before merge.",
      "RATE LIMITING: lib/rate-limit.ts — in-memory LRU, keyed on IP. Applied before email dispatch in server action.",
      "SANITISATION: lib/sanitise.ts — DOMPurify-style strip on all string inputs before email template render.",
      "EMAILS: lib/emails/ — ContactRequestEmail and ContactConfirmationEmail React Email components. Sent via Resend API in parallel (Promise.all).",
      "NEXT SESSION POINTER: next task is small contact section refinements, then 7-step quote form migration using the blueprint node.",
    ],
  },
  {
    name: "agent:v1:reasoning:2026-04-05-multistep-form-migration-blueprint",
    entityType: "reasoning",
    observations: [
      "PURPOSE: Blueprint for migrating any multi-step form (e.g. quote request) following the contact form pattern. Version: 2026-04-05.",
      "FOLDER STRUCTURE: features/<form-id>/ with schemas/, api/, hooks/, components/organisms/<form-id>-steps/, components/organisms/<form-id>-form.tsx.",
      "STEP PATTERN: each step is a client component island. Props: onNext(data), onBack(), defaultValues from Zustand, isLastDataStep flag.",
      "ZUSTAND PATTERN: one store per form. persist() with partialize to exclude volatile tokens. setSubmitted() resets all slices. resetForm() for new inquiry.",
      "ZOD PATTERN: one schema per step exported from schemas file. completeSchema = merge of all step schemas + turnstileToken. serverSchema adds honeypot.",
      "REACT HOOK FORM PATTERN: useForm with zodResolver and defaultValues from Zustand. mode: onTouched. trigger() only if needed for non-touched default population.",
      "SERVER ACTION PATTERN: use server file. Zod safeParse (authoritative). Honeypot check. Rate limit. Turnstile verify. Sanitise. Send emails. Return typed ActionResult.",
      "TURNSTILE INTEGRATION STEPS: (1) add widget to Step 1 client island, (2) store token in ephemeral Zustand slice, (3) gate Continue on isTurnstileVerified, (4) include in completeSchema, (5) server verify before rate limit.",
      "EMAIL PATTERN: two React Email templates (request to admin, confirmation to user). Send in Promise.all via Resend. Reference ID in both subjects.",
      "SECURITY CHECKLIST: honeypot field, rate limit (IP-keyed), Turnstile server verify, input sanitisation, idempotency_key on Siteverify, AbortController timeout.",
      "DOCKER E2E WORKFLOW: pnpm docker:dev:up → pnpm docker:mcp:playwright:bootstrap → pnpm test:e2e. If browser mismatch: force-recreate playwright services.",
      "PRE-COMMIT GATE: pnpm typecheck && pnpm build && pnpm test __tests__/<form-id> must all pass before push.",
      "PR WORKFLOW: feature branch → PR to main → Copilot review (github-actions skill) → merge → branch delete.",
      "NEXT FORM TARGET: 7-step quote request form. Steps: QuoteInfoStep, ServiceTypeStep, PropertyStep, ProjectDetailsStep, TimescaleStep, BudgetStep, ReviewStep. Reference: QR-{timestamp36}-{uuid6}.",
      "MEMORY WRITE-BACK: at session close run pnpm migration:contact:hydrate:strict, then write new heuristic_snapshot node to memory via direct HTTP POST to MCP gateway.",
      "ANTI-PATTERN WARNING: never use mode onChange with Zustand defaultValues without trigger() on mount — isValid will never be true and Continue button stays disabled.",
    ],
  },
];

const REQUIRED_RELATIONS = [
  {
    from: "agent:v1:project:electrical-website",
    to: "agent:v1:heuristic_snapshots:2026-04-04-contact-form-migration-learnings",
    relationType: "tracks",
  },
  {
    from: "agent:v1:project:electrical-website",
    to: "agent:v1:heuristic_snapshots:2026-04-04-turnstile-reintegration-status",
    relationType: "tracks",
  },
  {
    from: "agent:v1:project:electrical-website",
    to: "agent:v1:reasoning:2026-04-04-multistep-form-architecture-standard",
    relationType: "stores",
  },
  {
    from: "agent:v1:project:electrical-website",
    to: "agent:v1:reasoning:2026-04-04-turnstile-rebuild-next-actions",
    relationType: "stores",
  },
  {
    from: "agent:v1:project:electrical-website",
    to: "agent:v1:reasoning:2026-04-04-turnstile-react19-next16-best-practices",
    relationType: "stores",
  },
  {
    from: "agent:v1:heuristic_snapshots:2026-04-05-contact-form-migration-complete",
    to: "agent:v1:project:electrical-website",
    relationType: "records_state_for",
  },
  {
    from: "agent:v1:reasoning:2026-04-05-multistep-form-migration-blueprint",
    to: "agent:v1:project:electrical-website",
    relationType: "informs",
  },
  {
    from: "agent:v1:heuristic_snapshots:2026-04-05-contact-form-migration-complete",
    to: "agent:v1:reasoning:2026-04-05-multistep-form-migration-blueprint",
    relationType: "hands_off_to",
  },
  {
    from: "agent:v1:reasoning:2026-04-05-multistep-form-migration-blueprint",
    to: "agent:v1:heuristic_snapshots:2026-04-05-contact-form-migration-complete",
    relationType: "references",
  },
  {
    from: "agent:v1:reasoning:2026-04-05-multistep-form-migration-blueprint",
    to: "agent:v1:heuristic_snapshots:2026-04-04-contact-form-migration-learnings",
    relationType: "references",
  },
  {
    from: "agent:v1:reasoning:2026-04-05-multistep-form-migration-blueprint",
    to: "agent:v1:reasoning:2026-04-04-multistep-form-architecture-standard",
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

// Upsert pattern: push latest observations to all nodes on every run.
// This ensures memory always reflects the current REQUIRED_NODES definitions
// regardless of whether nodes were pre-existing. Avoids stale observations
// from prior sessions persisting across hydrations.
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
      // Non-fatal: log but continue so partial failures don't abort the whole sync.
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
      "[hydrate] Step 1/3: Running preflight (migration:contact:ready)...",
    );
    runPnpm(["migration:contact:ready"]);
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
    `\n[hydrate] Contact migration memory hydration complete${strictMode ? " (strict mode)" : ""}.`,
  );
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[hydrate] Failed: ${message}`);
  process.exit(1);
});
