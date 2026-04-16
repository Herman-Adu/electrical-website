# Validation SME Agent

## Overview

The **Validation SME** analyzes **input constraints** and **error handling** before implementation. It focuses on Zod schemas, edge cases, async validation, and user feedback.

## When to Use

Dispatch this agent when:
- Designing forms (what fields, constraints, error messages)
- Defining API request/response contracts
- Adding user input handling (any user-facing form or endpoint)
- Planning error handling and recovery flows
- Considering rate limiting or abuse prevention

## What It Analyzes

| Dimension | Questions |
|-----------|-----------|
| **Input Schemas** | What type is each field? Min/max constraints? Format rules? |
| **Error Cases** | What if field is empty, too long, invalid format, etc.? |
| **Async Validation** | Do any fields need existence checks (email, username uniqueness)? |
| **Error Messages** | What should users see when validation fails? |
| **Recovery Flow** | Can user retry after error? How do they fix it? |

## Example Finding

```
Finding: Email Uniqueness Check

- **Rationale:** Database constraint fails if two users sign up with same email simultaneously.
- **Constraint:** Email must be unique; check async onBlur before submit
- **Error message:** "Email already in use. Try Sign In or choose another."
- **Implementation note:** Async validation; disable submit until available
- **Blocking?** Yes — sign-up broken without this
```

## Tools It Uses

- `mcp__MCP_DOCKER__*` — load prior validation patterns
- `context7` — fetch latest Zod docs
- `Grep` / `Read` — inspect existing schemas
- `sequential-thinking` — analyze complex validation rules

## How to Read Its Output

The agent returns a structured analysis:

```
## Domain: Input Validation & Error Handling

### Finding 1: [Validation issue or edge case]
- **Rationale:** Why this validation matters
- **Constraint:** What's being validated
- **Error message:** What to show user
- **Blocking?** Yes/No

### Async Validations Required?
- [List fields needing async checks]

### Edge Cases Not Covered
- [List unhandled scenarios]

### Conflicts with Other SMEs?
- [If validation rule conflicts with architecture, security, or QA]
```

## Key Validation Patterns It Enforces

- **Zod Schemas:** All input must have explicit Zod schema
- **Server-Side:** Validate on server ALWAYS, never trust client-side alone
- **User Feedback:** Every error must have clear, friendly message
- **Async Validation:** Email/username checks happen onBlur, async
- **Error Recovery:** Users can retry, fix, and resubmit

## Success Criteria

You'll know the agent did good analysis when:

- ✅ You understand what each field's validation rules are
- ✅ Error messages are user-friendly
- ✅ Edge cases are explicit (empty, max length, invalid format)
- ✅ Async validation strategy is clear (when, how, user feedback)
- ✅ Blocking vs. nice-to-have validations are identified

---

**Role:** Validation analyst (reads findings, doesn't code)  
**Dispatch:** Before designing forms, defining API contracts, or planning error handling  
**Duration:** ~3–5 minutes analysis + response
