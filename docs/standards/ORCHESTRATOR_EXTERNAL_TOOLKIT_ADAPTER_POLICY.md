# ORCHESTRATOR EXTERNAL TOOLKIT ADAPTER POLICY

Last updated: 2026-04-09

## Purpose

Define how external toolkits (for example `superpowers-nextjs`) may be used in this repository without bypassing orchestrator governance.

## Scope

- Applies to all external plugins, skills, commands, docs, hooks, scripts, prompts, templates, and generated guidance.
- Applies to Architecture, Validation, Security, and QA delegation outputs.
- Applies to all implementation batches before merge.
- Applies to stage-based external asset routing in `ORCHESTRATOR_SUPERPOWERS_NEXTJS_SKILL_ROUTING.md`.

## Policy Statement

External toolkits are allowed as reference input only. They are never authoritative execution control.

The orchestrator remains the single authority for:

1. Delegation order and decision synthesis.
2. Tool/server scope and permissions.
3. Validation and security hard-stop gates.
4. Batch verification and release readiness decisions.

## Non-Negotiable Guardrails

1. Maintain delegation order: Architecture -> Validation -> Security -> QA.
2. Keep `ValidationGate` hard-stop semantics. No bypass for convenience.
3. Keep secrets fail-closed: names only, never values.
4. Keep anti-bot tokens ephemeral; never persist Turnstile/CAPTCHA tokens.
5. Keep least-privilege tool access and auditable actions.

## Adapter Workflow (Required)

For each externally sourced pattern or command:

1. **Classify**
   - Mark as one of: routing, server-actions, data/caching, testing, performance, or other.
2. **Map**
   - Map the pattern to local standards, existing architecture boundaries, and accepted primitives.
3. **Normalize**
   - Rewrite the pattern to local conventions (App Router defaults, Zod validation boundaries, action contracts, security requirements).
4. **Gate**
   - Run Phase 2 delegation checks and required test/build gates.
5. **Record**
   - Capture what was adopted, what was rejected, and why.

No mapped-normalized-gated-recorded path means no merge.

## Decision Matrix

- **Adopt**: pattern matches local standards and passes all gates.
- **Adopt with modifications**: pattern is useful after normalization; all changes documented.
- **Reject**: pattern conflicts with local architecture, validation, or security policy.
- **Defer**: insufficient evidence or high blast radius; schedule for targeted spike.

## Minimum Evidence Per Batch

- One short adapter note with:
  - external source used,
  - local mappings,
  - modifications applied,
  - rejected portions,
  - final decision.
- Validation evidence (tests/checks run, result status).
- Risk note and rollback pointer.

## Stop Conditions

Immediately stop execution and escalate if any condition is met:

- Schema parity breaks between client/server.
- Security protocol violation or potential secret exposure.
- Anti-bot lifecycle violation (persistence, replay risk, unknown verification state).
- Route/runtime behavior regression in critical flows.
- Build/typecheck/test hard gate failure.

## Rollout Mode

Use phased adoption:

1. **Pilot** (limited change surface).
2. **Constrained expansion** (same domain, wider scenarios).
3. **Standardized** (codified patterns and checklists).

At each stage, preserve orchestrator-only authority and hard gates.
