# Phase 1 QA Run Sheet — Quotation Header V1

Date: 2026-04-06  
Scope: Quotation templates only (customer + business)  
Purpose: Enforce Step 4 validation gates before Checkpoint B approval

## 1) Test Matrix (minimum required)

| Client Family | Platform             | Light Mode | Dark Mode | Images Blocked | Status  |
| ------------- | -------------------- | ---------: | --------: | -------------: | ------- |
| Gmail         | Web                  |        [ ] |       [ ] |            [ ] | Pending |
| Gmail         | Mobile (iOS/Android) |        [ ] |       [ ] |            [ ] | Pending |
| Outlook       | Desktop              |        [ ] |       [ ] |            [ ] | Pending |
| Outlook       | Web                  |        [ ] |       [ ] |            [ ] | Pending |
| Outlook       | Mobile               |        [ ] |       [ ] |            [ ] | Pending |
| Apple Mail    | macOS                |        [ ] |       [ ] |            [ ] | Pending |
| Apple Mail    | iOS                  |        [ ] |       [ ] |            [ ] | Pending |

## 2) Per-Client Acceptance Checks

For each row in matrix, mark PASS only if all checks pass:

- [ ] Logo renders correctly (no broken image icon)
- [ ] Company name + tagline alignment is stable
- [ ] Accent rule appears with proper thickness/placement
- [ ] Transaction title + reference are clearly readable
- [ ] Optional status indicator renders without overlap
- [ ] Header has no clipping at narrow widths
- [ ] Fallback behavior is readable when images are blocked
- [ ] Dark mode remains legible and brand-safe

## 3) Artifact Requirements

Attach evidence set before marking batch complete:

- [ ] Screenshot: quotation customer email (light)
- [ ] Screenshot: quotation business email (light)
- [ ] Screenshot: dark mode sample(s)
- [ ] Screenshot: images-blocked sample(s)
- [ ] Screenshot: mobile narrow-width sample(s)

Artifact location:

- [x] `docs/email-template-normalization/evidence/phase1-quotation/` (or approved equivalent)

## 4) Gate Commands

Execution gate commands:

- [x] `pnpm exec tsc --noEmit`

Optional focused tests (if available/added):

- [x] `pnpm test -- --runInBand` (only targeted scope when applicable)
- [x] Focused quotation suite run via test runner: `__tests__/quotation` (11 passed, 0 failed)

## 5) Risk Register (Phase 1)

| Risk                                  | Severity | Mitigation                                          | Owner              | Status |
| ------------------------------------- | -------- | --------------------------------------------------- | ------------------ | ------ |
| Outlook spacing drift                 | High     | Table-safe spacing + conservative inline styles     | QA SME             | Open   |
| Dark mode contrast degradation        | High     | Verify across required clients and tune safe colors | Design SME         | Open   |
| Image blocking degrades brand clarity | Medium   | Ensure alt text + stable text hierarchy             | Implementation SME | Open   |
| Narrow viewport clipping              | Medium   | Validate 320px/360px behavior and adjust safely     | QA SME             | Open   |

## 6) Phase 1 Pass/Fail Decision

### PASS Criteria (all required)

- [ ] Matrix rows completed
- [ ] All per-client checks pass
- [ ] Required artifacts attached
- [ ] Typecheck gate passes

### FAIL Criteria (any one fails)

- [ ] Broken logo/header in any required client
- [ ] Clipping/overlap in required client
- [ ] Illegible dark mode rendering
- [ ] Missing proof artifacts

Decision:

- [ ] PASS — Move to Checkpoint B approval
- [ ] FAIL — Fix and rerun Phase 1 QA

## 7) Sign-off

- QA SME: **\*\*\*\***\_\_\_\_**\*\*\*\*** Date: \***\*\_\_\*\***
- Design SME: **\*\***\_\_\_\_**\*\*** Date: \***\*\_\_\*\***
- Orchestrator: **\*\***\_\_\_**\*\*** Date: \***\*\_\_\*\***
- Stakeholder (Checkpoint B): ** Date: **\_\_\_\_\*\*\*\*
