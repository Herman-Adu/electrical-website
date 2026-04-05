# Full Memory Sync Prompt — Email Delivery Incident (2026-04-05)

Use this prompt at the start of a new chat to rehydrate full incident context and run in orchestrator mode.

```md
You are GitHub Copilot (GPT-5.3-Codex) in FULL ORCHESTRATOR mode for Herman-Adu/electrical-website.

Objective:
Diagnose and resolve live email delivery failure (contact/quotation), identify what changed in recent commits, ship fix safely through protected branch workflow, and sync memory for future sessions.

## MODE 0 — Preflight (mandatory)

1. Repo/runtime baseline

- git rev-parse --abbrev-ref HEAD
- git status --short
- pnpm migration:quotation:ready
- pnpm migration:quotation:hydrate:strict

2. Runtime switching contract (mandatory)

- Docker runtime may own port 3000.
- Local VS Code runtime may replace Docker when user switches.
- On port conflict, auto-resolve and continue; do not ask repeated mode questions.
- Report runtime mode (`docker` or `local`) at every checkpoint.

3. Load incident docs

- docs/email-incidents/EMAIL_DELIVERY_INCIDENT_SNAPSHOT_2026-04-05.md
- docs/quotation-migration/FULL_MEMORY_SYNC_SNAPSHOT_QUOTATION_CLOSURE_2026-04-05.md

4. Hydrate memory nodes

- agent:v1:project:electrical-website
- agent:v1:handoff:quotation-closure-orchestrator-2026-04-05
- agent:v1:reasoning:2026-04-05-quotation-closure-full-delivery-plan
- agent:v1:heuristic_snapshots:2026-04-05-robust-baseline-guardrails
- agent:v1:handoff:email-delivery-incident-2026-04-05
- agent:v1:reasoning:2026-04-05-email-delivery-regression-analysis
- agent:v1:heuristic_snapshots:2026-04-05-email-sender-config-fallbacks

## MODE 1 — Regression archaeology

Goal: determine exactly what changed in last couple commits and whether it can affect sending.

Commands:

- git log --oneline --decorate -10
- git show --name-status --oneline <recent-commits>
- git log --oneline -- lib/email/config/email-config-builder.ts features/quotation/api/quotation-email-service.ts features/contact/api/contact-email-service.ts

Deliverable:

- concise matrix: commit -> files -> email impact (none/low/high) -> rationale

## MODE 2 — Production failure diagnosis

Goal: identify sender/recipient resolution and likely Resend rejection causes.

Trace and verify:

- sender value used by contact and quotation flows
- fallback precedence in email config builder
- whether settings loaders provide runtime values or null
- whether code reads env sender overrides

Do not print secrets.
Only report key names and status: present/missing.

## MODE 3 — Hotfix implementation

If root cause is sender fallback mismatch:

Implement deterministic sender precedence in `lib/email/config/email-config-builder.ts`:

- quotation from: env override -> settings -> fallback constant
- contact from: env override -> settings -> fallback constant
- generic from/reply-to: env override -> settings -> fallback constant

Constraints:

- minimal surgical change
- no unrelated refactors
- no secret logging

## MODE 4 — Validation

Required gates:

- npx tsc --noEmit
- run targeted tests first
- pnpm build

Then verify app behavior in active runtime mode and collect evidence.

## MODE 5 — Delivery workflow

- create hotfix branch
- commit scoped changes
- push and open PR
- wait required checks green
- merge to main (respect branch protection)
- clean local branch
- return to clean main

## MODE 6 — Memory closure sync

Upsert observations into:

- agent:v1:handoff:email-delivery-incident-2026-04-05
- agent:v1:reasoning:2026-04-05-email-delivery-regression-analysis
- agent:v1:heuristic_snapshots:2026-04-05-email-sender-config-fallbacks

Include:

- final diagnosis
- changed files
- commit/PR references
- CI state
- runtime mode actions

## Reporting contract (every checkpoint)

- findings
- evidence
- pass/fail
- risks
- next recommendation

Start in MODE 0 now.
```
