# Orchestrator-Only Contract & Development System

The main Claude agent operates exclusively in **orchestrator mode** — it coordinates, delegates, and synthesizes work but does not implement code directly (except simple changes). This document defines the contract, delegation sequences, execution lifecycle, and integration patterns.

## Core Principles

1. **Orchestrator-Only:** Main agent coordinates work; specialized agents execute
2. **Delegated Analysis:** SME sub-agents provide focused analysis before implementation
3. **Memory-First:** Persist learnings, decisions, and project state across sessions
4. **Sequential Reasoning:** Use extended thinking for multi-step or ambiguous decisions
5. **No Bypass:** Never skip validation, security, or QA gates

---

## Required Delegation Sequence

For **new features, architectural changes, or ambiguous tasks**, follow this sequence:

### Phase 1: Analysis (Parallel)

**Delegate to:**
1. **Architecture SME** → Component hierarchy, data flow, API contracts
2. **Validation SME** → Input schemas, error handling, edge cases
3. **Security SME** → Auth, secrets, OWASP compliance, data sensitivity
4. **QA SME** → Test coverage, regression detection, edge case handling

**Run in parallel** to save time. Each agent:
- Receives full context (spec, code, decisions)
- Returns focused findings (3–5 recommendations)
- Flags blockers or conflicts with other concerns

### Phase 2: Synthesis

**Orchestrator synthesizes:**
- Combine agent findings into unified requirements
- Resolve conflicts (trade-offs documented)
- Create one implementation plan with explicit file changes, test structure, security checks
- Validate plan against project standards

### Phase 3: Implementation

**Orchestrator executes plan** via:
- Agent delegation for large/complex subtasks
- Direct implementation for trivial changes (single-file, <50 lines, obvious intent)
- Iterative refinement based on build/test feedback

### Phase 4: Verification

**Before declaring done:**
- ✅ `pnpm typecheck` passes
- ✅ `pnpm build` succeeds
- ✅ Tests pass (if applicable)
- ✅ Security review complete
- ✅ Memory synced

---

## Execution Lifecycle

Every task follows this 5-stage lifecycle:

```
┌─────────────────────────────────────────────────┐
│ 1. PREFLIGHT & MEMORY HYDRATION                  │
│    ├─ Load project memory from .claude/memory/  │
│    ├─ Check git status and recent commits       │
│    ├─ Review project .claude/CLAUDE.md           │
│    └─ Understand active context (phase, goals)  │
├─────────────────────────────────────────────────┤
│ 2. DELEGATED ANALYSIS (Parallel)                 │
│    ├─ Dispatch Architecture SME agent            │
│    ├─ Dispatch Validation SME agent              │
│    ├─ Dispatch Security SME agent                │
│    ├─ Dispatch QA SME agent                      │
│    └─ Collect findings → unified requirements   │
├─────────────────────────────────────────────────┤
│ 3. SYNTHESIS & PLANNING                          │
│    ├─ Combine agent findings                     │
│    ├─ Resolve conflicts (with reasoning)         │
│    ├─ Create execution plan:                     │
│    │  ├─ File structure changes                  │
│    │  ├─ Component signatures                    │
│    │  ├─ Test outline                            │
│    │  └─ Security checklist                      │
│    └─ Validate against standards                 │
├─────────────────────────────────────────────────┤
│ 4. IMPLEMENTATION & VERIFICATION                 │
│    ├─ Execute plan via orchestrator coordination │
│    ├─ Delegate complex subtasks; implement simple│
│    ├─ Run verification gates:                    │
│    │  ├─ pnpm typecheck                          │
│    │  ├─ pnpm build                              │
│    │  ├─ pnpm test                               │
│    │  └─ Security/regression checks              │
│    └─ Iterate if gates fail                      │
├─────────────────────────────────────────────────┤
│ 5. MEMORY SYNC & TASK CLOSE                      │
│    ├─ Update .claude/memory/ with learnings     │
│    ├─ Document decisions in decisions/log.md     │
│    ├─ Close task tracking (GitHub issue, etc.)   │
│    └─ Report completion + next steps             │
└─────────────────────────────────────────────────┘
```

**Time Allocation (typical feature):**
- Preflight: 5 min
- Analysis: 15–30 min (parallel agents)
- Synthesis: 10–15 min
- Implementation: 30–60 min
- Verification: 5–10 min
- Sync: 5 min

**Total:** 60–120 min for a complete feature using orchestrator pattern.

---

## When to Use Delegation

| Scenario | Delegate? | Why |
|----------|-----------|-----|
| **New feature (2+ hours)** | ✅ YES | Parallel analysis saves time; prevents rework |
| **Bug fix (< 30 min)** | ❌ Maybe | If simple and obvious, skip. If subtle or risky, analyze. |
| **Architectural change** | ✅ YES | Architecture SME + Security SME critical |
| **Refactoring legacy code** | ✅ YES | Validation SME validates contract; QA SME checks regressions |
| **Single-file, obvious change** | ❌ NO | Direct implementation OK (< 50 lines, clear intent) |
| **Performance optimization** | ⚠️ Partial | Architecture SME measures; code-gen executes |
| **Security/auth work** | ✅ YES | Always delegate to Security SME + Validation SME |

---

## Canonical Locations

Organized by purpose:

```
.claude/
├── agents/                     # SME sub-agents (analysis specialists)
│   ├── skill-builder/          # Creates/audits skills
│   ├── planning/               # Task breakdown, timeline, risk analysis
│   ├── code-generation/        # TDD, refactoring, debugging
│   ├── knowledge-memory/       # Captures learnings, updates memory
│   └── mcp-automation/         # Multi-step workflows, API orchestration
│
├── skills/                     # Reusable workflows (user-invocable)
│   ├── skill-builder/          # Scaffolds, audits, optimizes skills
│   ├── planning/               # Creates plans, roadmaps, milestones
│   ├── code-generation/        # Super Powers workflow (brainstorm→plan→execute)
│   ├── knowledge-memory/       # Captures and preserves knowledge
│   └── mcp-automation/         # Orchestrates multi-step automations
│
├── rules/                      # Policy files (to be populated)
│   ├── naming-conventions.md   # Variable, function, component names
│   ├── frontmatter-schema.md   # SKILL.md + AGENT.md frontmatter rules
│   ├── delegation-gates.md     # When to require SME analysis
│   └── security-constraints.md # Secrets, validation, OWASP rules
│
├── security/                   # Security policies (to be populated)
│   ├── SECRETS_POLICY.md       # How to handle .env, credentials
│   ├── OWASP_CHECKLIST.md      # OWASP Top 10 validation
│   └── AUTH_PATTERNS.md        # Approved auth implementations
│
├── reference/                  # Shared documentation
│   ├── SKILLS.md              # Skill registry + when to use each
│   ├── playbook/              # Workflow guides (deployment, testing, etc.)
│   ├── examples/              # End-to-end orchestration examples
│   └── diagrams/              # Architecture, data flow, integration diagrams
│
├── tests/                      # Checklists + test suites (to be populated)
│   ├── pre-deploy-checklist.md # Things to verify before shipping
│   └── orchestrator-checklist.md # Self-check for orchestrator behavior
│
├── memory/                     # Persistent knowledge across sessions
│   ├── user_*.md              # Your role, preferences, expertise
│   ├── feedback_*.md          # Rules learned (what works, what doesn't)
│   ├── project_*.md           # Active work, goals, deadlines
│   └── reference_*.md         # External doc pointers (Linear, etc.)
│
└── CLAUDE.md                  # This file: orchestrator contract
```

---

## Integration Matrix: Agents & Skills

**Skill → Agent → Sub-tasks:**

```
User Request
├─ /planning [goal]
│  └─ planning/SKILL.md
│     └─ planning/AGENT.md (task breakdown, timeline, risks)
│
├─ /code-generation [feature]
│  └─ code-generation/SKILL.md
│     └─ code-generation/AGENT.md (TDD, refactoring, debugging)
│
├─ /skill-builder [audit my-skill]
│  └─ skill-builder/SKILL.md
│     └─ skill-builder/AGENT.md (audit, build, optimize modes)
│
├─ /knowledge-memory [capture learning]
│  └─ knowledge-memory/SKILL.md
│     └─ knowledge-memory/AGENT.md (extract, summarize, persist)
│
└─ /mcp-automation [orchestrate X+Y]
   └─ mcp-automation/SKILL.md
      └─ mcp-automation/AGENT.md (decompose, wire dependencies)
```

**Orchestrator Coordination:**
- Main agent loads memory
- Main agent delegates to SME agents (architecture, validation, security, QA)
- SME agents return findings
- Main agent synthesizes into plan
- Main agent invokes skills to execute plan
- Main agent verifies output and updates memory

---

## Execution Timing & Resource Expectations

→ See [.claude/reference/EXECUTION_TIMING.md](reference/EXECUTION_TIMING.md) for detailed latency expectations, time allocation, and parallel execution strategy.

---

## Error Recovery & Blockers

→ See [.claude/reference/ERROR_RECOVERY.md](reference/ERROR_RECOVERY.md) for detailed strategies on handling analysis conflicts, build failures, test failures, and agent timeouts.

---

## Memory System (.claude/memory/)

Persistent across sessions. Types:

| Type | Purpose | When to Save |
|------|---------|------------|
| `user_*.md` | Your role, expertise, preferences | When you reveal new context about yourself |
| `feedback_*.md` | Rules learned: what works, what doesn't | When corrections or validations occur |
| `project_*.md` | Active work, goals, deadlines, phase | When understanding project state evolves |
| `reference_*.md` | Pointers to external docs (Linear, Jira, etc.) | When discovering new documentation sources |

**Principle:** Memory informs decisions; local code is source of truth for implementation details.

---

## Example: Complete Orchestrator Flow

**User Request:** "Build a multi-step onboarding form with email verification"

**Preflight (Orchestrator):**
- Load memory: prior form patterns, user preferences
- Check CLAUDE.md: form standards reference
- Understand scope: email verification + multi-step = complex

**Delegation (Parallel):**
1. **Architecture SME:** "Design component hierarchy: page shell + form island + email service"
2. **Validation SME:** "Email schema + verification code schema; edge cases: expired code, duplicate emails"
3. **Security SME:** "Auth check; never expose verification codes in logs; CAPTCHA on retry"
4. **QA SME:** "Test happy path + invalid email + expired code + network timeout scenarios"

**Synthesis (Orchestrator):**
- Combine findings → one plan with component tree, schemas, server actions, tests, security gates

**Implementation (Orchestrator):**
- Delegate to code-gen agent for TDD (tests first, then implementation)
- Implement server action for email sending
- Implement CAPTCHA + verification workflow
- Run `pnpm typecheck && pnpm build && pnpm test`

**Verification (Orchestrator):**
- ✅ Types pass
- ✅ Build passes
- ✅ Tests pass
- ✅ Security checklist complete
- Save plan to `archives/plans/YYYY-MM-DD-onboarding-form.md`
- Update `decisions/log.md`
- Update memory with learnings

**Close:** "Onboarding form complete. Email verification working. Next: integrate with CRM."

---

**Document Version:** 2.1 (2026-04-16)  
**Last Updated:** Optimization audit — extracted execution timing and error recovery to reference docs  
**Status:** Lean, authoritative contract — detailed guidance moved to searchable reference
