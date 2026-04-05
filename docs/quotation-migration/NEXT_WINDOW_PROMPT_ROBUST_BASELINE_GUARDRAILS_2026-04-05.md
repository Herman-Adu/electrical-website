# Next Window Prompt — Robust Baseline, Contracts, Guardrails, TDD (2026-04-05)

```md
You are GitHub Copilot (GPT-5.3-Codex) in architect+implementation mode for Herman-Adu/electrical-website.

Mission:
Implement and lock a robust anti-flake baseline for quotation (and reusable multistep forms) using explicit contracts, deterministic waits, selector standards, and TDD-aligned verification.

Runtime mode protocol (user preference, mandatory):

- Docker dev runtime commonly uses port `3000` during app verification.
- Local VS Code runtime may be used when user switches modes.
- If port `3000` conflicts occur, automatically resolve by stopping the non-target runtime and continue without repeated mode-confirmation questions.
- Include active runtime mode and any conflict resolution action in each checkpoint.

## 1) Mandatory startup sequence

- pnpm migration:quotation:ready
- pnpm docker:mcp:playwright:bootstrap
- pnpm migration:quotation:hydrate:strict

Then read:

- docs/quotation-migration/quotation-page-lift-and-shift.md
- docs/quotation-migration/QUOTATION_MIGRATION_SYNC_RUNBOOK_2026-04-05.md
- docs/quotation-migration/FULL_MEMORY_SYNC_SNAPSHOT_QUOTATION_CLOSURE_2026-04-05.md

Open memory nodes:

- agent:v1:project:electrical-website
- agent:v1:heuristic_snapshots:2026-04-05-quotation-migration-readiness
- agent:v1:heuristic_snapshots:2026-04-05-robust-baseline-guardrails
- agent:v1:reasoning:2026-04-05-quotation-executor-playwright-validation

## 2) Target outcomes (deliver all)

A. Wait-contract baseline

- Replace readiness drift patterns (`networkidle` app-readiness assumptions, unjustified fixed sleeps) with explicit wait contracts.
- Standardize readiness on semantic assertions tied to visible/interactive UI state.

B. Selector contract baseline

- Establish selector hierarchy: role/label first, test id only when semantics are insufficient.
- Normalize key step/form selectors to stable contracts.

C. TDD guardrail suite

- Add or update focused tests to fail when wait/selector anti-patterns are reintroduced.
- Keep tests small, deterministic, and scoped to changed behavior.

D. Process guardrails

- Add static checks/scripts to detect anti-pattern regressions early.
- Ensure guardrails run in local gate flow and are easy to enforce in CI.

## 3) Implementation constraints

- Keep changes minimal and surgical.
- No new UX features; only reliability and contract hardening.
- Respect existing design tokens/components and Next.js 16 App Router patterns.
- Do not touch unrelated areas.
- Enforce runtime-switch awareness across all test/build execution steps.

## 4) Execution plan

Step 1 — Baseline audit

- Locate all test/runtime usages of `networkidle`, `waitForTimeout`, and brittle selectors near quotation flows.
- Classify each usage: allowed/replace/remove with rationale.

Step 2 — Contract codification

- Implement shared helper conventions for deterministic readiness (where appropriate).
- Align quotation lifecycle test and any hydration checks to these conventions.

Step 3 — Add anti-drift checks

- Add a lightweight script or test that fails on banned patterns unless explicitly allowlisted.
- Document allowlist mechanism for exceptional cases.

Step 4 — TDD validation

- Run targeted tests first.
- Then run full local quality gates:
  - npx tsc --noEmit
  - pnpm test
  - pnpm build

Step 5 — Evidence and handoff

- Produce concise summary of what changed and why.
- Record risks/remaining exceptions.
- Update memory nodes with final guardrail contract details.

## 5) Definition of done

- Quotation interactive lifecycle tests pass deterministically.
- No unjustified readiness anti-patterns remain in targeted scope.
- Anti-drift checks fail appropriately when patterns reappear.
- Local gates pass cleanly.
- Memory nodes updated with enforcement policy + evidence references.

## 6) Required reporting format

At each checkpoint report:

- findings
- evidence
- pass/fail
- risks
- next recommendation

Start now at Step 1 and show the first anti-pattern inventory before editing files.
```
