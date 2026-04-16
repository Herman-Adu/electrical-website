# QA SME Agent

## Overview

The **QA SME** analyzes **test coverage gaps** and **regression risks** before implementation. It focuses on edge cases, test strategies, and verification approaches.

## When to Use

Dispatch this agent when:
- Implementing new features (need test plan)
- Refactoring components (need regression coverage)
- Making risky changes (touching core logic)
- Building user-facing flows (need e2e tests)
- Adding complex logic (async, state management, error handling)

## What It Analyzes

| Dimension | Questions |
|-----------|-----------|
| **Test Coverage** | What types of tests are needed (unit, integration, e2e, visual)? |
| **Edge Cases** | What could break? (null, undefined, empty, timeout, error states) |
| **Regression Risk** | Which existing features could break due to this change? |
| **Verification** | How to prove the feature works? (manual + automated) |
| **Test Tools** | Which testing frameworks/tools are best? |

## Example Finding

```
Test Matrix for Sign-Up Form:

- **Unit Tests:** validateEmail(), validatePassword() functions (valid, invalid, empty)
- **Integration Tests:** SignUpForm component (input, validation display, submit)
- **E2E Tests:** Full signup → confirmation email flow
- **Visual Tests:** Form responsive layout desktop/mobile

Edge Cases:
- Empty email (show "Required" error)
- Email already exists (show "In use" error)
- Password < 8 chars (show "Too short" error)
- Network timeout (show "Try again" error)

Regression Risk:
- Login page breaks if user model changes
- Email service outage breaks signup

Blocking? Yes — signup must have tests before merge
```

## Tools It Uses

- `mcp__MCP_DOCKER__*` — load prior test patterns
- `context7` — fetch Vitest, Playwright, RTL docs
- `Grep` / `Read` — inspect existing test patterns
- `Bash` — run tests (diagnostics only)
- `sequential-thinking` — analyze complex test scenarios

## How to Read Its Output

The agent returns a structured analysis:

```
## Domain: Quality Assurance & Test Coverage

### Test Matrix
- **Unit Tests:** [What to test at component/function level]
- **Integration Tests:** [What to test across components]
- **E2E Tests:** [What to test from user perspective]
- **Visual Tests:** [What visual regressions to check]

### Edge Cases
- [Specific scenarios that could break feature]

### Regression Risk Areas
- [Which existing features could break?]

### Verification Strategy
- [How to manually verify feature works?]

### Conflicts with Other SMEs?
- [If test requirements conflict with architecture, validation, or security]
```

## Key Testing Patterns It Enforces

- **Unit Tests:** Pure functions tested in isolation
- **Integration Tests:** Component behavior, state changes, user interactions
- **E2E Tests:** Complete user journeys (browser automation)
- **Visual Tests:** Screenshot comparison for regressions
- **Mixed Approach:** Unit + E2E for speed + confidence

## Success Criteria

You'll know the agent did good analysis when:

- ✅ You understand which tests are required (not optional)
- ✅ Edge cases that need testing are explicit
- ✅ Regression risks are identified
- ✅ Verification strategy is clear (manual + automated)
- ✅ Test coverage goals are realistic

---

**Role:** QA analyst (reads findings, doesn't code)  
**Dispatch:** When implementing features, refactoring, or making risky changes  
**Duration:** ~3–5 minutes analysis + response
