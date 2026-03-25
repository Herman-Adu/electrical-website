# Remediation Plan

## Purpose

This document is the authoritative execution plan for branch-wide remediation of the codebase.

Goals:

- restore build integrity
- align the codebase with React 19 and Next.js 16 best practices
- remove avoidable architectural drift
- improve security posture
- establish repeatable validation and handoff discipline

Non-goals:

- introducing unrelated features
- mixing cleanup with redesign unless explicitly approved
- hiding debt behind temporary flags or suppressed checks

## Working Rules

1. No shortcuts.
2. No untracked temporary fixes.
3. One batch at a time.
4. Each batch ends with validation.
5. The status tracker must be updated at the end of every batch.
6. If a decision changes architecture, runtime behavior, or policy, record an ADR.
7. Prefer the smallest safe change that improves the system without creating fresh debt.

## Phase Model

### Phase 0 - Governance and Baseline

Objective:

- establish in-repo tracking, handoff, and validation discipline

Deliverables:

- remediation plan
- remediation status tracker
- first ADR
- batch template and validation template

Exit criteria:

- tracking files exist
- current baseline risks are recorded
- next batch is explicitly defined

### Phase 1 - Build Safety and Correctness

Objective:

- restore build truthfulness and eliminate hidden failure modes

Primary targets:

- remove TypeScript build suppression
- establish a trustworthy validation flow
- reduce blocking diagnostics to an actionable baseline

Exit criteria:

- no ignored type failures in production build configuration
- build diagnostics are known, recorded, and trending down

### Phase 2 - Navigation and App Router Compliance

Objective:

- replace navigation patterns that bypass framework behavior

Primary targets:

- replace internal `window.location.href` navigation with framework-safe routing
- replace raw internal anchors where appropriate
- preserve anchor-scroll behavior intentionally

Exit criteria:

- internal navigation follows App Router best practice
- behavior verified on desktop and mobile navigation paths

### Phase 3 - Server and Client Boundary Cleanup

Objective:

- reduce unnecessary client components and restore server-first composition

Primary targets:

- identify components marked client without browser-only behavior
- move pure render/composition layers back to server components
- keep animation islands client-side only where needed

Exit criteria:

- server/client boundaries are intentional and documented
- easy boundary wins are completed

### Phase 4 - Forms, Validation, and Security Hardening

Objective:

- move interactive workflows to production-grade handling

Primary targets:

- harden contact flow
- add server-side validation
- define spam/rate-limit strategy
- add security headers and related hardening

Exit criteria:

- contact workflow has a real handling strategy
- security posture improvements are implemented and documented

### Phase 5 - Tailwind v4 and Code Quality Cleanup

Objective:

- remove diagnostic noise and standardize utility usage

Primary targets:

- resolve framework and linter-reported Tailwind migrations
- standardize class conventions where safe
- remove noise that obscures real defects

Exit criteria:

- targeted diagnostics reduced or eliminated
- no broad stylistic churn outside agreed scope

### Phase 6 - Metadata, SEO, and Resilience

Objective:

- improve discoverability and route resilience

Primary targets:

- complete metadata consistency
- add robots and sitemap support
- add loading, error, and not-found boundaries where useful
- unify branding content

Exit criteria:

- public routes have coherent metadata strategy
- resilience files exist where justified

### Phase 7 - Performance and Asset Strategy

Objective:

- restore framework performance strengths and remove avoidable overhead

Primary targets:

- revisit image optimization strategy
- review `priority` usage and large media behavior
- reduce unnecessary client execution cost

Exit criteria:

- image handling strategy is explicit
- performance-sensitive paths are improved and validated

### Phase 8 - Branch Acceptance and Final QA

Objective:

- finish the branch with confidence and traceability

Primary targets:

- final validation sweep
- branch acceptance checklist
- confirm no unresolved critical issues remain hidden

Exit criteria:

- acceptance checklist complete
- residual issues documented explicitly

### Phase 9 - Deep Architectural Review & Optimization

Objective:

- conduct three-axis deep review (architectural, security, code quality)
- identify high-impact optimization opportunities (server/client boundaries, reusability, client cost reduction)
- establish component library and composition best practices
- validate recommendations with staged implementation batches

Primary targets:

- server/client boundary rationalization (move 10+ pure render layers to server)
- component reusability analysis (extract 8-12 core micro-components)
- security posture deep dive (validation, rate limiting, authorization gaps)
- code quality & React 19 idiom alignment (DRY violations, type safety, async components)
- single responsibility & composition refactor (split 5+ monolithic components)

Exit criteria:

- three-axis SME reports delivered (architecture, security, code quality)
- ranked refactoring roadmap established (high-impact, low-risk first)
- reusable component library proposal complete
- implementation batches scoped and estimated

---

## Batch Execution Template

For each batch, record:

- Batch ID
- Phase
- Objective
- Files in scope
- Risks
- Planned validations
- Outcome
- Follow-up actions

Recommended ID format:

- P0-B1
- P1-B2
- P3-B1

## Validation Standards

Validation must be explicit. Record exactly what was run or checked.

Validation types:

- type diagnostics
- build diagnostics
- lint diagnostics
- targeted code review
- behavior verification
- accessibility verification where relevant

Every batch should record:

- diagnostics before
- diagnostics after
- files changed
- unresolved issues

## Handoff Protocol for New Chats

At the start of a new chat:

1. Read the status tracker first.
2. Confirm current phase and batch.
3. Confirm the last completed validation.
4. Continue only from the next planned action.

Suggested handoff prompt:

> Read docs/remediation-status.md and continue from the current phase, current batch, and next planned action. Do not skip validation or status updates.

## Initial Sequence

1. P0-B1: Create governance and tracking docs.
2. P1-B1: Remove build safety suppression and establish truthful baseline.
3. P2-B1: Refactor internal navigation to framework-safe routing.
4. P3-B1: Convert obvious unnecessary client wrappers to server components.
5. P4-B1: Design and implement proper contact handling strategy.

## Notes

This plan is intended to evolve. Changes to sequence are allowed, but must be reflected in the status tracker and justified when they materially affect risk or architecture.
