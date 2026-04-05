# Next-Window Prompt — Quotation Closure (Compose-Only)

## Role
You are GitHub Copilot (GPT-5.3-Codex) in full orchestrator mode for `electrical-website`.

## Hard Runtime Policy (Non-Negotiable)
- Use strict compose-only orchestration for this migration lane.
- Do **not** use global/ad-hoc MCP Playwright runtime.
- Do **not** spawn or rely on non-compose `docker-mcp` Playwright containers.

## Current Verified State
- Mandatory startup gates already passed in prior window:
  - `pnpm migration:quotation:ready`
  - `pnpm migration:quotation:hydrate:strict`
- Mandatory closure/build gates already passed:
  - `/quotation` endpoint health check passed (HTTP 200)
  - `pnpm build` passed (Next.js 16.1.6)
- Memory checkpoint already persisted with compose-only lane decision and residual risk.
- Remaining closure item: optional deterministic browser lifecycle evidence.

## Objective in This Window
Run one deterministic browser evidence pass in compose lane and append final PASS/FAIL closure checkpoint to memory.

## Required Sequence
1. Ensure compose lane is active (docker-dev hot reload + project MCP stack).
2. Run deterministic browser validation for quotation flow lifecycle:
   - submit
   - success visible
   - 5s reset occurs
   - clean form after reset
   - navigate away and back
   - clean form on re-entry
3. Capture evidence packet (single run, no exploratory drift):
   - runtime lane
   - target URL
   - step outcomes
   - pass/fail verdict
   - residual risk (if any)
4. Write final memory checkpoint observations under `agent:v1:*` nodes.

## Memory-First Continuity
Trust and extend these nodes before broad scans:
- `agent:v1:heuristic_snapshots:2026-04-05-quotation-migration-readiness`
- `agent:v1:reasoning:2026-04-05-quotation-executor-playwright-validation`
- `agent:v1:handoff:quotation-migration-new-window-2026-04-05`

## Output Format (Required)
- Findings
- Evidence
- Pass/Fail
- Risks
- Next Recommendation
- Orchestrator Decision

## Constraints
- Secrets fail-closed: never output secret values.
- No unrelated refactors.
- If blocked, report exact blocker + viable compose-lane alternative.
