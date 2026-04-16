# Delegation Gates

This rule file defines when orchestrator-mode work must dispatch specialist agents before implementation.

## Purpose

- Enforce consistent delegation on high-risk or multi-step work.
- Keep direct edits limited to trivial, low-risk changes.

## Default Gates

Use delegation when any of the following is true:

- Crosses multiple domains (architecture, validation, security, QA).
- Introduces security/auth, data handling, or policy-sensitive changes.
- Requires multi-file refactor with behavior changes.
- Is ambiguous enough to need trade-off analysis.
- Exceeds a small, obvious patch (roughly >50 LOC or >1 file with logic changes).

## Allowed Direct Implementation

Direct implementation is acceptable when all are true:

- Single-file or tightly scoped change.
- Intent and acceptance criteria are explicit.
- No security/compliance surface is introduced.
- Quick local verification is possible.

## Exit Criteria

Before merge, ensure:

- Required delegated analysis (if gated) is complete.
- Build/tests pass for touched scope.
- No unresolved security or validation blockers remain.
