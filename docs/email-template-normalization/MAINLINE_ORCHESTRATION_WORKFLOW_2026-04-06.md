# Mainline Orchestration Workflow — Email Template Normalization

Date: 2026-04-06  
Branch: `feat/email-template-normalization-quotation-2026-04-06`  
HEAD: `65a8f64`

## Objective

Provide a full, repeatable workflow to move the normalization lane safely into `main`, with continuity preserved through Docker memory and explicit MCP learnings for the master orchestrator.

## A) Preflight + Scope Lock

1. Run orchestrator `/health-check` before any operation.
2. Hydrate continuity keys:
   - `agent:v1:project:electrical-website`
   - current normalization snapshots/handoff keys
   - current drift keys
3. Confirm branch continuity and commit anchor.
4. Lock scope:
   - width/header parity only
   - no unrelated cleanup
   - quotation baseline preserved

## B) Validation Gates (must pass)

1. `pnpm exec tsc --noEmit`
2. Targeted tests:
   - `__tests__/contact/*`
   - `__tests__/service-request/*`
   - `__tests__/quotation/*`
3. Visual evidence for all required variants:
   - contact customer
   - contact business
   - service-request customer
   - service-request business
4. Canonical browser-testing route preferred:
   - use orchestrator `/browser-testing` skill path
   - persist result metadata in artifact JSON

## C) PR-to-Main Workflow

1. Ensure branch pushed with scoped commit(s) only.
2. Create PR from `feat/email-template-normalization-quotation-2026-04-06` to `main`.
3. PR description must include:
   - scope boundaries
   - validation gates passed
   - visual evidence paths
   - known residual risks (if any)
4. Wait for CI checks + review policy completion.
5. Merge only when all required checks are green.

## D) Comprehensive Docker Memory Sync

Write the following at close-out:

1. **Outcome snapshot**
   - `agent:v1:heuristic_snapshots:2026-04-06-email-template-parity-contact-service-complete`
2. **Drift key** (if encountered)
   - `agent:v1:drift:2026-04-06-browser-testing-mcp-start-bin-sh-enoent`
3. **Next-task pointer** (or completion update)
   - `agent:v1:next-task:email-template-normalization:repair-browser-testing-mcp-and-recapture-evidence-2026-04-06`
4. **Orchestrator handoff key**
   - `agent:v1:handoff:master-orchestrator-mainline-workflow-2026-04-06`
5. **Project root observations**
   - append distilled “what worked / what failed / preferred execution path” to `agent:v1:project:electrical-website`

## E) MCP Learnings to Persist (Orchestrator-Aware)

1. Canonical evidence path: orchestrator `/browser-testing` skill succeeded with MCP Playwright.
2. Top-level tool startup may diverge from skill-path behavior in some environments.
3. Always prefer skill path for continuity and auditable routing.
4. Save tool output shape learnings (AgentOutput uses `.data`, not `.result`).
5. Preserve drift notes and mitigations as first-class memory entities.

## F) Operator Runbook (Quick Execute)

1. Health check → memory hydrate → branch verify.
2. Run validation gates.
3. Capture canonical browser-testing evidence and save artifact JSON.
4. Update memory entities (snapshot, drift, next-task, handoff, project root).
5. Open/refresh PR to `main` and post evidence comment.
6. Merge when checks pass.

## G) Current Status (2026-04-06)

- Template parity implementation is complete on branch `feat/email-template-normalization-quotation-2026-04-06`.
- Canonical browser-testing evidence exists at:
  - `test-results/email-previews/canonical-browser-skill-results.json`
- Existing unrelated local workspace modifications remain out-of-scope and untouched.
