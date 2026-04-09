# ORCHESTRATOR PHASE 2 DELEGATION GATE CHECKLIST

Last updated: 2026-04-09

## Objective

Provide a strict, reusable checklist for Phase 2 delegation:

1. Architecture SME
2. Validation SME
3. Security SME
4. QA SME

Then orchestrator synthesizes one execution plan.

## Usage

- Run this checklist before implementation for each batch.
- Treat unchecked items as blockers.
- Do not skip sequence.

## A. Architecture SME Gate

- [ ] Server/Client boundaries respect Next.js 16 App Router defaults.
- [ ] Pattern aligns with existing domain architecture and naming conventions.
- [ ] No duplicated concern across features/components/hooks.
- [ ] Caching/data strategy is explicit and compatible with route behavior.
- [ ] Change blast radius is documented and acceptable for a single batch.

## B. Validation SME Gate

- [ ] Authoritative server-side validation uses `safeParse` and rejects invalid input.
- [ ] Client/server schema parity is confirmed for all affected fields.
- [ ] Step gating is deterministic for all multi-step flows.
- [ ] Error envelopes are normalized and route users to the correct step.
- [ ] Validation failures are hard-stop events; no fallback shortcuts.

## C. Security SME Gate

- [ ] No secret values are exposed in prompts, logs, screenshots, or outputs.
- [ ] Tool/server scope is least-privilege for the batch.
- [ ] Anti-bot token lifecycle is ephemeral only (no persistent storage).
- [ ] External/toolkit content is treated as untrusted and normalized before use.
- [ ] High-risk actions remain dry-run-first unless explicitly approved.

## D. QA SME Gate

- [ ] Targeted tests are selected for affected surfaces first.
- [ ] Route/form/action/cache/perf test coverage is mapped to change type.
- [ ] Typecheck and production build are included in required verification.
- [ ] Local-first rule is enforced: required local verification is green before any GitHub workflow/check trigger or rerun.
- [ ] Failure triage and rollback trigger are pre-defined.
- [ ] Batch Definition of Done is measurable and evidence-backed.

## Required Verification Commands (Per Batch)

Minimum verification baseline:

1. Targeted tests for changed domain.
2. `pnpm exec tsc --noEmit`
3. `pnpm build`
4. `pnpm test:e2e`

Widen verification scope only when targeted checks indicate coupling risk.
Do not trigger/rerun GitHub workflows or check suites until this local baseline is green.

## Batch Definition of Done

- [ ] All four SME gates are passed.
- [ ] Required verification commands are green.
- [ ] External pattern usage (if any) is adapter-documented.
- [ ] No unresolved high-severity regressions remain.
- [ ] Rollback path is explicit and tested at least to commit-level revert readiness.

## Rollback Triggers

Any of the following is immediate rollback/escalation:

- Build/typecheck failure in required path.
- Critical user flow regression.
- Validation/security contract breach.
- Unstable or non-deterministic step routing.
- Unexpected cache/runtime behavior on critical pages.
