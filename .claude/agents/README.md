# Agents Directory

This directory contains **SME (Subject Matter Expert) sub-agents** that the orchestrator dispatches to analyze features before implementation.

## What Are Agents?

Agents are **specialized analysis roles** that evaluate a feature from one domain and return focused findings. The orchestrator runs all 4 agents in parallel, then synthesizes their findings into one implementation plan.

**Example:** Building a multi-step form with email verification

```
Orchestrator dispatches (parallel):
├─ Architecture SME → analyzes component structure + data flow
├─ Validation SME → analyzes input schemas + error handling
├─ Security SME → analyzes auth + token storage + email verification
└─ QA SME → analyzes test coverage + edge cases

↓

Orchestrator synthesizes → one unified spec + implementation plan

↓

Orchestrator (or code-gen agents) implement the plan
```

## Available Agents

### 1. **Architecture SME** (`architecture-sme/AGENT.md`)

**Analyzes:** Component hierarchy, data flow, performance, rendering efficiency

**Returns:** Component structure recommendations, lifting patterns, server vs. client boundary

**Triggers on:** New features, component refactoring, state lifting decisions

**Example findings:**
- "Lift form state to parent → reduces prop drilling"
- "Stream projects section with Suspense → improves FCP"
- "Keep form island isolated → reusable across pages"

---

### 2. **Validation SME** (`validation-sme/AGENT.md`)

**Analyzes:** Input schemas, error cases, async validation, user feedback

**Returns:** Zod schemas, error messages, edge case handling, async validation strategies

**Triggers on:** Form design, API endpoint definition, user input handling

**Example findings:**
- "Email field: required, unique, async check onBlur"
- "Message field: 10-5000 chars, show count (X/5000)"
- "CAPTCHA token: expires after 2 min, auto-refresh"

---

### 3. **Security SME** (`security-sme/AGENT.md`)

**Analyzes:** Authentication, secrets handling, OWASP compliance, data sensitivity

**Returns:** Auth/authz requirements, secrets policies, vulnerability mitigations

**Triggers on:** Auth features, PII handling, API design, third-party integrations

**Example findings:**
- "Add auth check before project delete"
- "Hash passwords with bcrypt, never log them"
- "CSRF token required on all POST forms"

---

### 4. **QA SME** (`qa-sme/AGENT.md`)

**Analyzes:** Test coverage gaps, edge cases, regression risks, verification strategy

**Returns:** Test matrix (unit/integration/e2e/visual), edge cases, verification approach

**Triggers on:** Feature implementation, refactoring, risky changes

**Example findings:**
- "Unit test: validateEmail() for valid/invalid/empty"
- "Integration test: Form submission with async validation"
- "E2E test: Full signup flow → confirmation email"
- "Visual test: Form layout on mobile (screenshot)"

---

## Operating Mode

All agents operate under **Orchestrator-Only Mode** as defined in `ORCHESTRATOR_DISPATCH_PREAMBLE.md`:

- **Analyze, don't implement.** Return findings, not code.
- **Flag conflicts, don't resolve them.** Orchestrator decides trade-offs.
- **Read from Docker, don't write.** Only orchestrator updates memory.
- **Stay focused.** Return 3–5 findings, not comprehensive coverage.

---

## Using Agents (For Orchestrator)

### Dispatch Sequence (Parallel)

When implementing a feature:

```
1. Read feature spec + acceptance criteria
2. Dispatch all 4 agents in parallel:
   - Agent: Architecture SME
     → Returns component hierarchy, data flow, performance concerns
   - Agent: Validation SME
     → Returns input schemas, error cases, async validation
   - Agent: Security SME
     → Returns auth/authz requirements, secrets handling
   - Agent: QA SME
     → Returns test matrix, edge cases, regression risks

3. Synthesis:
   - Combine findings into unified spec
   - Resolve conflicts (with reasoning)
   - Create implementation plan
   - Document trade-off decisions

4. Implementation:
   - Execute plan (via orchestrator or code-gen agents)
   - Verify build/tests pass
   - Update Docker memory with learnings
```

### Dispatch Prompt Template

Each agent receives this preamble + specific dispatch:

```
---PREAMBLE (from ORCHESTRATOR_DISPATCH_PREAMBLE.md)---

## [Agent-Specific Role]

## Specific Questions for [Agent Name]

1. What's the best component structure for this feature?
2. How should data flow between components?
3. [Specific question for this agent]

## Code Context

[Relevant files, imports, architecture diagrams]

## Constraints

- Next.js 16 App Router, strict TypeScript
- Server Components by default, "use client" only for interactivity
- All mutations via Server Actions
- Zod validation on all external input

---END PREAMBLE---

Analyze the above and return 3–5 key findings.
```

---

## Example Dispatch (Complete)

**Orchestrator:** "Building a multi-step email verification form"

**Dispatch to Architecture SME:**
```
FEATURE SPEC: User enters email → receives 6-digit code → verifies code → continues

What should the component hierarchy look like?
How should data flow between form steps?
Should form be Server or Client Component?
```

**Response:**
```
## Domain: Architecture

### Finding 1: Form Island Pattern
- Page shell (server) fetches user context
- Form wrapper (client island) handles step transitions + form state
- Each step is a component (VerifyEmailStep, EnterCodeStep, SuccessStep)
- Reduces re-renders, keeps form state isolated

### Finding 2: Data Flow with Server Actions
- Step 1 data (email) → Server Action validateEmail()
- Server Action returns: { success, token, expiresAt }
- Token passed back to form → Step 2 uses it in next Server Action
- Prevents tampering with token in client

### Finding 3: Streaming for Slow Sections
- Email validation (DB lookup) might be slow
- Wrap in <Suspense> while checking uniqueness
- Show skeleton while loading
```

---

## Agent Files Organization

```
.claude/agents/
├── ORCHESTRATOR_DISPATCH_PREAMBLE.md    # Shared preamble (all agents read this)
├── README.md                             # This file
├── architecture-sme/
│   └── AGENT.md                          # Architecture agent definition
├── validation-sme/
│   └── AGENT.md                          # Validation agent definition
├── security-sme/
│   └── AGENT.md                          # Security agent definition
└── qa-sme/
    └── AGENT.md                          # QA agent definition
```

---

## When to Dispatch Agents

**Dispatch ALL 4 agents when:**
- Building new features (2+ hours of work)
- Architectural changes (component refactoring, state lifting)
- Adding auth/security features
- Adding new form or user input
- Making decisions with trade-offs

**Skip agent dispatch when:**
- Simple bug fixes (< 30 min, obvious intent)
- Trivial changes (single file, < 50 lines, no behavior changes)
- Following prior decisions (already decided, just implementing)

---

## Integration with Orchestrator

Agents are **read-only analyzers**. The orchestrator:

1. **Loads** agents (reads their AGENT.md files)
2. **Dispatches** (sends feature spec + specific questions)
3. **Collects** findings (waits for all 4 responses)
4. **Synthesizes** (combines findings into one spec)
5. **Implements** (uses findings to code or delegate)
6. **Verifies** (runs build/tests)
7. **Syncs** (updates Docker with learnings + decisions)

---

## Best Practices

### For Orchestrator (When Dispatching)

- ✅ Provide full context (feature spec, acceptance criteria, code samples)
- ✅ Ask specific questions (not vague "analyze this")
- ✅ Collect ALL 4 agents before synthesizing
- ✅ Document trade-off reasoning in implementation plan
- ✅ Flag conflicts between agents (e.g., security vs. performance)

### For Agents (When Analyzing)

- ✅ Return 3–5 key findings (focused, not exhaustive)
- ✅ Include rationale for each finding (why it matters)
- ✅ Flag conflicts with other domains (e.g., "security requires server check; architecture says server-render...")
- ✅ Offer alternatives if trade-offs exist
- ✅ Keep response under 500 words

### For Orchest rator (When Synthesizing)

- ✅ Combine findings into unified spec (don't repeat)
- ✅ Resolve conflicts explicitly ("Architecture recommends X, Security recommends Y, chosen X because...")
- ✅ Create one implementation plan (not 4 separate plans)
- ✅ Verify plan against project standards (TypeScript, validation, build gates)
- ✅ Update Docker with learnings (what was discovered, what was decided)

---

## Related Documents

- `ORCHESTRATOR_DISPATCH_PREAMBLE.md` — Shared context all agents read
- `./../CLAUDE.md` — Orchestrator contract + lifecycle
- `./../rules/memory-policy.md` — Docker memory entities + relations
- `./../rules/delegation-gates.md` — When to delegate (vs. direct implementation)

---

## Status

✅ **Complete** — All 4 SME agents defined and ready to dispatch  
**Last Updated:** 2026-04-16  
**Maintainer:** Orchestrator (Herman Adu / Claude Code)
