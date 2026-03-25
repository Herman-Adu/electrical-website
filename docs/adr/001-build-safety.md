# ADR-001: Build Safety Must Be Truthful

- Status: accepted
- Date: 2026-03-24
- Decision owners: branch remediation effort

## Context

The current codebase includes production build configuration that suppresses TypeScript build failures. This weakens trust in the build, allows regressions to ship, and hides the true remediation baseline.

In a branch intended for full remediation, suppressed correctness checks are incompatible with the objective.

## Decision

The remediation effort will remove production build safety suppression and treat type correctness as a real release gate.

Specifically:

- production configuration must not ignore TypeScript build errors
- diagnostics must be surfaced, recorded, and reduced deliberately
- unresolved issues may be deferred only if explicitly documented in the status tracker and accepted as non-blocking

## Consequences

Positive:

- build output becomes trustworthy
- remediation progress can be measured accurately
- hidden regressions are less likely to escape

Negative:

- enabling truthful builds may surface a large number of existing issues
- initial remediation pace may slow while the baseline is established

## Implementation Notes

The first build-safety batch should:

1. remove suppression from next config
2. run validation to establish the truthful baseline
3. record the results in the status tracker

## Alternatives Considered

### Keep suppression temporarily

Rejected because it preserves ambiguity and undermines the entire remediation effort.

### Remove suppression only at the end of the branch

Rejected because it defers reality until late in the process and increases rework risk.
