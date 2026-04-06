# Header V1 Execution Brief — Email Template Normalization

Date: 2026-04-06  
Mode: Orchestrator-first, SME-led, no inline implementation in this phase

## 1) Objective

Define and approve a canonical, high-quality, email-client-safe header system for transactional templates, then roll it out in controlled phases.

Scope in this brief:

- Quotation templates (baseline first)
- Contact templates (after quotation approval)
- Service-request templates (after contact approval)

Out of scope in this brief:

- Footer redesign (footer is accepted baseline)
- Subject line strategy changes
- Non-header content layout redesign

## 2) Canonical Design Decision

Approved option: **Header V1 (Option 2)**

Structure (fixed order):

1. Brand Row
2. Accent Rule Row
3. Transaction Meta Row

Why this option:

- Best visual hierarchy for transactional context
- Lowest compatibility risk across Gmail, Outlook, Apple Mail
- Easy to normalize and reuse across all 3 form domains
- Supports premium brand feel without risky CSS

## 3) Header V1 Blueprint (Table-Safe)

### Row A — Brand Row

Purpose: identify sender brand instantly.

Required elements:

- Logo (left)
- Company name (right, dominant)
- Tagline (right, secondary)

Layout guidance:

- Outer cell with inline padding
- Nested table: logo cell + text cell
- Keep readable without media query support

### Row B — Accent Rule

Purpose: clean visual separator + brand signal.

Required elements:

- Thin full-width accent bar

Layout guidance:

- Single full-width row
- Solid accent color for maximum client safety

### Row C — Transaction Meta Row

Purpose: make message type + reference obvious at a glance.

Required elements:

- Transaction title
- Reference ID
- Optional status label/chip (Urgent, Received, etc.)

Layout guidance:

- Single row with text hierarchy
- Status can collapse to plain text in constrained clients

## 4) Token Contract (Single Source of Truth)

### Config-driven (mandatory)

- company.name
- company.tagline
- company.logoUrl (with fallback behavior)
- brand.primary
- brand.primaryLight
- brand.headerGradientStart
- brand.headerGradientEnd

### Transaction-driven (template-level)

- transaction.title
- transaction.reference
- transaction.status (optional)

Rule:

- Company and brand values must come from resolved config.
- Templates pass only transaction context.
- No hardcoded company naming/tagline/logo values in templates.

## 5) Accessibility + Quality Rules

Required:

- Meaningful logo alt text (company name)
- Clear heading hierarchy in header/meta
- Readable color contrast for title/tagline/status
- Text parity in plain-text email fallback for title/reference/status

Avoid:

- CSS features with poor email support as critical dependencies
- Complex layering effects, absolute positioning hacks, script-based behaviors

## 6) Compatibility Validation Protocol (PR Gate)

Minimum client matrix:

- Gmail web + Gmail mobile
- Outlook desktop + Outlook web + Outlook mobile
- Apple Mail macOS + iOS

Validate each for:

- Logo load/render
- Alignment and spacing
- Font fallback behavior
- Dark mode readability
- No clipping at narrow widths
- Stable rendering when images are blocked

Evidence required:

- Screenshot set per client family
- Pass/fail checklist attached to PR
- Any exception must include risk owner and explicit waiver note

## 7) Phased Rollout Plan (Stop/Go)

### Phase 0 — Baseline Lock

- Freeze accepted footer baseline
- Confirm quotation current state snapshot
- Approval checkpoint: A

### Phase 1 — Quotation First (Golden Baseline)

- Apply Header V1 to quotation customer + business templates
- Validation gate: typecheck + proof screenshots + client checks
- Approval checkpoint: B

### Phase 2 — Contact

- Propagate same Header V1 pattern to contact customer + business
- Validation gate repeated
- Approval checkpoint: C

### Phase 3 — Service-request

- Propagate same Header V1 pattern to service-request customer + business
- Validation gate repeated
- Approval checkpoint: D (final)

Rollback policy:

- One batch per commit slice
- Revert the batch commit on regression
- Do not patch-forward without sign-off

## 8) SME Agent Assignments

Design Architect SME

- Own Header V1 structural spec and token contract integrity

Compatibility QA SME

- Own matrix execution and artifact completeness

Implementation Planner SME

- Own phase sequencing, rollback, and checkpoint discipline

Orchestrator

- Enforce protocol steps, track approvals, and gate transitions

## 9) Batch Acceptance Checklist

A batch is complete only when all are true:

- Header structure matches Header V1 blueprint
- No hardcoded company-brand drift
- Validation gate passes for that batch
- Evidence artifacts attached
- Stakeholder checkpoint approved

## 10) Immediate Next Action (Approved)

Proceed with Phase 1 planning package only:

- Generate implementation checklist for quotation templates
- Prepare QA run sheet for Batch 1
- Do not execute code changes until checkpoint A sign-off is recorded
