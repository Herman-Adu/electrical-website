# NEXT SESSION PROMPT

**Date to continue:** 2026-03-28  
**Project:** electrical-website  
**Status:** Phase 3A complete, Phase 3B implemented, production promotion pending final setup

---

## Start Here

You are continuing work on the `electrical-website` repo after Phase 3A + Phase 3B.

### Current confirmed state

- Phase 3A E2E coverage is complete: **54/54 Playwright tests passing**
- Phase 3B monitoring work is implemented:
  - `@sentry/nextjs` added
  - global error boundary added in [app/error.tsx](app/error.tsx)
  - Sentry init added in [app/layout.tsx](app/layout.tsx)
  - Lighthouse CI workflow added in [.github/workflows/lighthouse-ci.yml](.github/workflows/lighthouse-ci.yml)
  - monitoring docs added in [docs/PHASE_3B_MONITORING_RUNBOOK.md](docs/PHASE_3B_MONITORING_RUNBOOK.md)
- Production build was verified passing after the Phase 3B changes

### Important current caveat

The working tree may still contain **uncommitted tracked changes** from Phase 3B and doc formatting, especially:

- [package.json](package.json)
- [pnpm-lock.yaml](pnpm-lock.yaml)
- [PHASE_3A_COMPLETION_REPORT.md](PHASE_3A_COMPLETION_REPORT.md)
- [PHASE_3B_STARTUP_HANDOFF.md](PHASE_3B_STARTUP_HANDOFF.md)
- [PHASE_3_STARTUP_HANDOFF.md](PHASE_3_STARTUP_HANDOFF.md)
- possibly updated Phase 3B docs

Before doing anything else, verify the working tree and either commit or intentionally discard those changes.

---

## Primary Goal For This Session

**Finish the release path with minimal agent usage.**

### Priority order

1. **Sync and clean git state**
2. **Verify Phase 3B changes are fully committed**
3. **Configure and validate Sentry DSN / monitoring readiness**
4. **Choose one path:**
   - **Path A:** Production promotion workflow
   - **Path B:** Phase 3C accessibility audit

---

## Required Workflow

### Use lean sub-agent strategy

Use **only 1 planning sub-agent** unless a second verification sub-agent is clearly necessary.

#### Agent usage rules

- Use **1 planning sub-agent** to assess current repo state and decide the shortest safe path.
- Do **direct implementation** after planning.
- Only use a **second verification sub-agent** if needed for accessibility audit review or deployment checklist validation.
- Prefer batching reads in parallel, but do not spam agents.

---

## Step-by-Step Plan

### Step 1 — Repo sync

Run these checks first:

- `git status --short`
- `git log --oneline -6`
- verify whether `package.json` and `pnpm-lock.yaml` are still unstaged

If the dependency and doc changes are valid, commit them cleanly.

Suggested commit grouping:

1. dependency/config sync
2. doc formatting / handoff sync

### Step 2 — Validation

Run:

- `pnpm build`
- targeted sanity check for current app state
- if needed, `pnpm exec playwright test --reporter=list`

Only continue if build is passing.

### Step 3 — Monitoring readiness

Confirm:

- `NEXT_PUBLIC_SENTRY_DSN` is documented in [.env.example](.env.example)
- Sentry initialization is present in [app/layout.tsx](app/layout.tsx)
- global error boundary exists in [app/error.tsx](app/error.tsx)
- Lighthouse workflow exists in [.github/workflows/lighthouse-ci.yml](.github/workflows/lighthouse-ci.yml)

### Step 4 — Choose the next move

#### Path A — Production promotion

Do this if the goal is shipping fast.

Tasks:

- verify Sentry DSN/env setup requirements
- prepare deployment checklist
- confirm staging smoke test checklist
- confirm monitoring dashboards to verify after deploy

Success condition:

- project is fully ready for production promotion pending env config in deployment platform

#### Path B — Phase 3C accessibility audit

Do this if the goal is quality hardening before production.

Tasks:

- run automated accessibility checks
- inspect keyboard navigation and ARIA coverage
- fix critical/high issues only
- create a concise accessibility report and next actions

Success condition:

- critical accessibility risks are reduced and documented

---

## Current Best Recommendation

**Best next action tomorrow: Path A first.**

Reason:

- Phase 3A is done
- Phase 3B is implemented
- fastest path is to clean the repo, commit remaining dependency/doc changes, and prepare production promotion
- accessibility can still follow as a short hardening pass after deployment readiness is locked

---

## Constraints

- Do not re-run large exploratory work unnecessarily.
- Do not create many sub-agents.
- Do not re-open old Phase 2 handoff docs.
- Use current repo state, not stale handoff assumptions.
- Treat memory/docs as support, but git state is source of truth.

---

## Output expected at end of session

Provide:

1. current git state summary
2. what was committed
3. whether build/tests passed
4. whether project is ready for production promotion
5. if not, the exact blocker
6. the next smallest follow-up task

---

## Short Version Prompt

Use this if you want a compact restart prompt:

> Sync the repo first using `git status --short` and `git log --oneline -6`. Assume Phase 3A and Phase 3B are already implemented. Use only one planning sub-agent unless absolutely necessary. First, resolve and commit any remaining tracked changes, especially `package.json`, `pnpm-lock.yaml`, and Phase 3 docs. Then validate with `pnpm build`. After that, finish the shortest path to release readiness: confirm Sentry + Lighthouse setup and prepare production promotion. If production readiness is already satisfied, optionally move to a Phase 3C accessibility audit focusing only on critical/high issues. Keep agent usage minimal and batch read-only checks where possible.
