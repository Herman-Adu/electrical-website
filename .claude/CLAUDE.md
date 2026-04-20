# Orchestrator-Only Contract & Development System

The main Claude agent operates exclusively in **orchestrator mode** — it coordinates, delegates, and synthesizes work but does not implement code directly (except simple changes). This document defines the contract, delegation sequences, execution lifecycle, and integration patterns.

## Core Principles

1. **Orchestrator-Only:** Main agent coordinates work; specialized agents execute
   - **NEVER directly implement code** (except trivial single-file changes < 50 lines)
   - **ALWAYS delegate** to appropriate SME agent for architecture/validation/security/QA/code-gen
   - **ALWAYS persist** work via Docker memory at session end
2. **Delegated Analysis:** SME sub-agents provide focused analysis before implementation
3. **Docker-First Memory (MANDATORY):** Persist learnings, decisions, and project state via MCP
   - **Endpoint:** `POST http://localhost:3100/mcp/tools/call` (MCP aggregator gateway)
   - **Discovery:** `GET http://localhost:3100/mcp/tools` → lists all available tools
   - **Rehydration:** Session start auto-calls `search_nodes("electrical-website-state")`
   - **Persistence:** Session end creates entities + relations for all work/learnings/decisions
   - **NEVER write memory to `.md` files** — use Docker memory only (strict enforcement)
   - **See:** `.claude/reference/DOCKER_MCP_QUICK_REFERENCE.md` for correct working format
4. **Sequential Reasoning:** Use extended thinking for multi-step or ambiguous decisions
5. **No Bypass:** Never skip validation, security, or QA gates — delegation enforces this

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

## Orchestrator Session Automation (Hooks + Skills)

**SessionStart Hook (Automatic):**  
Runs preflight on session start via `.claude/settings.json`. Outputs:
- Docker health check
- `search_nodes("electrical-website-state")` → `open_nodes([id])`
- Git status and recent commits
- If unavailable: fallback to `.claude/CLAUDE.md` (## Session State section)

**CONTEXT MONITOR (Automatic):**  
UserPromptSubmit hook fires on every prompt. At 70% context:
- Pauses before response
- Generates inline continuation prompt
- Waits for user confirmation to sync
- Updates Docker entities + WIP commit

**To sync manually:**  
Use `/session-lifecycle sync` at any time.

**SUB-AGENT DISPATCH (Orchestrator Responsibility):**  
Always prepend `.claude/reference/ORCHESTRATOR_DISPATCH_PREAMBLE.md` content to all SME agent prompts. Ensures agents use Docker-first approach and available MCP tools.

---

## Execution Lifecycle

Every task follows this 5-stage lifecycle:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. PREFLIGHT & MEMORY HYDRATION                             │
│    ├─ mcp__MCP_DOCKER__search_nodes [project/phase name]   │
│    ├─ mcp__MCP_DOCKER__open_nodes [returned entity IDs]    │
│    ├─ Check git status and recent commits                   │
│    ├─ Review project .claude/CLAUDE.md                       │
│    └─ Understand active context (phase, goals, decisions)   │
├─────────────────────────────────────────────────────────────┤
│ 2. DELEGATED ANALYSIS (Parallel)                            │
│    ├─ Dispatch Architecture SME agent                        │
│    ├─ Dispatch Validation SME agent                          │
│    ├─ Dispatch Security SME agent                            │
│    ├─ Dispatch QA SME agent                                  │
│    └─ Collect findings → unified requirements               │
├─────────────────────────────────────────────────────────────┤
│ 3. SYNTHESIS & PLANNING                                     │
│    ├─ Combine agent findings                                 │
│    ├─ Resolve conflicts (with reasoning)                     │
│    ├─ Create execution plan:                                 │
│    │  ├─ File structure changes                              │
│    │  ├─ Component signatures                                │
│    │  ├─ Test outline                                        │
│    │  └─ Security checklist                                  │
│    └─ Validate against standards                             │
├─────────────────────────────────────────────────────────────┤
│ 4. IMPLEMENTATION & VERIFICATION                            │
│    ├─ Execute plan via orchestrator coordination             │
│    ├─ Delegate complex subtasks; implement simple            │
│    ├─ Run verification gates:                                │
│    │  ├─ pnpm typecheck                                      │
│    │  ├─ pnpm build                                          │
│    │  ├─ pnpm test                                           │
│    │  └─ Security/regression checks                          │
│    └─ Iterate if gates fail                                  │
├─────────────────────────────────────────────────────────────┤
│ 5. MEMORY SYNC & TASK CLOSE                                 │
│    ├─ mcp__MCP_DOCKER__create_entities [new learning/phase] │
│    ├─ mcp__MCP_DOCKER__add_observations [findings, outcomes]│
│    ├─ mcp__MCP_DOCKER__create_relations [link to existing]  │
│    ├─ Close task tracking (GitHub issue, etc.)              │
│    └─ Report completion + next steps                         │
└─────────────────────────────────────────────────────────────┘
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
├── rules/memory-policy.md      # Docker memory schema + naming conventions
│
└── CLAUDE.md                  # This file: orchestrator contract
    └── ## Session State        # Emergency fallback notes (Docker down only)
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

## Memory System — Docker First

**SINGLE SOURCE OF TRUTH:** Docker `memory-reference` service via MCP tools  

**UNIVERSAL PROHIBITION:**
NEVER create ANY .md file for memory, session state, staging, handoff, rehydration, or seeding purposes — regardless of filename, directory, or rationalization.

Prohibited directories:
- Any .claude/ subdirectory for memory or session-state .md files (examples: session-state, archives/session-context)
- Do not create subdirectories with names like session-state or archives/session-context
- Policy: Use Docker memory service exclusively for session state persistence

The ONLY .md writes permitted in `.claude/` are:
- Pre-existing policy documents (`rules/`, `security/`, `reference/`)
- Skill/agent definition files (`skills/`, `agents/`)
- One-line fallback note in CLAUDE.md `## Session State` (Docker down only)

**If Docker entities do not exist yet: CREATE THEM IMMEDIATELY via mcp__MCP_DOCKER__create_entities().**  
**Never stage entity data in .md files "ready to seed later."**

### Rehydration (Session Start)

**Use the node script with correct JSON format:**

```bash
# Search for project state
pnpm docker:mcp:memory:search "electrical-website-state"

# Load entities
pnpm docker:mcp:memory:open electrical-website-state
```

**Cost:** ~50 tokens vs ~5,000+ tokens for `.md` files

### Sync (Session End)

**Use the node script with correct JSON format:**

```bash
# Create session entity
node scripts/mcp-memory-call.mjs create_entities '{
  "entities": [{
    "name": "session-2026-04-20-001",
    "entityType": "session",
    "observations": ["Work completed...", "Build status...", "Next steps..."]
  }]
}'

# Add observations to existing entity
node scripts/mcp-memory-call.mjs add_observations '{
  "observations": [{
    "entityName": "electrical-website-state",
    "contents": ["Session end update...", "Next tasks..."]
  }]
}'

# Create relations
node scripts/mcp-memory-call.mjs create_relations '{
  "relations": [{
    "from": "session-2026-04-20-001",
    "to": "electrical-website-state",
    "relationType": "updates"
  }]
}'
```

**See:** [.claude/reference/DOCKER_MCP_QUICK_REFERENCE.md](reference/DOCKER_MCP_QUICK_REFERENCE.md) for complete working examples and common mistakes.

### Entity Types

| Type | Purpose | Example |
|------|---------|---------|
| `project_state` | Current branch, build status, next tasks | `"electrical-website-state"` |
| `feature` | Completed/in-progress work | `"phase5-animation-optimization"` |
| `learning` | Technical patterns discovered | `"hook-rules-conditional-effects"` |
| `infrastructure` | Docker services, MCP tools | `"mcp-infrastructure"` |
| `decision` | Architectural choices + rationale | `"docker-memory-policy"` |
| `session` | Handoff context for continuation | `"session-2026-04-16"` |

### Fallback (Docker Unavailable)

If Docker memory service is down:
- Write ONE one-line note into `## Session State` section of this file (e.g., "2026-04-16 10:00 — Phase 5 animation work paused on component X")
- **Do NOT create `.md` memory files** under any circumstance
- Priority: Resume work next session by reading Git history + code state

**Principle:** Memory informs decisions; local code is source of truth for implementation details.

---

## Common Docker MCP Mistakes

**These mistakes wasted significant tokens in prior sessions. Avoid them:**

### Mistake 1: Using curl Instead of Node Script
❌ **WRONG:** Direct curl calls to localhost:3100
✅ **RIGHT:** `node scripts/mcp-memory-call.mjs` or `pnpm docker:mcp:memory:*`

### Mistake 2: Observations as Object Instead of Array
❌ **WRONG:** `"observations": { "work": "...", "status": "..." }`
✅ **RIGHT:** `"observations": ["Work completed...", "Status: passing"]`

Observations MUST be an array of strings, not a JSON object.

### Mistake 3: Missing entityType Field
❌ **WRONG:** `{ "name": "...", "observations": [...] }`
✅ **RIGHT:** `{ "name": "...", "entityType": "session", "observations": [...] }`

Every entity requires entityType. Options: session, feature, learning, decision, infrastructure, task, plan, project_state.

### Mistake 4: Creating Duplicate Entities
❌ **WRONG:** Create same entity twice without searching
✅ **RIGHT:** Search first (`pnpm docker:mcp:memory:search "name"`), then use `add_observations` for existing entities

### Mistake 5: Forgetting Quotes Around JSON
❌ **WRONG:** `node scripts/mcp-memory-call.mjs create_entities { "entities": [...] }`
✅ **RIGHT:** `node scripts/mcp-memory-call.mjs create_entities '{ "entities": [...] }'`

JSON argument must be a single-quoted string to prevent bash expansion.

**See:** [DOCKER_MCP_QUICK_REFERENCE.md](reference/DOCKER_MCP_QUICK_REFERENCE.md) for detailed examples and fixes.

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
- Sync session context: `mcp__MCP_DOCKER__add_observations(project_state_id, [session_end])`
- Create session entity: `mcp__MCP_DOCKER__create_entities([session])`
- Commit and push to GitHub

**Close:** "Onboarding form complete. Email verification working. Next: integrate with CRM."

---

## Orchestrator Violation Detection

**If the orchestrator is NOT in proper mode, these will be true:**

- ✗ Code was implemented without delegating to SME agents
- ✗ Work completed but no entities created in Docker
- ✗ Learnings discovered but not persisted
- ✗ Decisions made but not documented
- ✗ "Docker API isn't working" → instead of discovering correct endpoint
- ✗ Memory written to `.md` files instead of Docker
- ✗ Session ended without creating `session-YYYY-MM-DD-*` entity

**If any are true, the session failed the orchestrator contract.**

---

## Session State

**2026-04-20 17:45 — SESSION 5 HANDOFF** | Context: 1% remaining | Branch: feat/phase-8-scrollreveal-production

✅ **SESSION 4 COMPLETED (Phase 8: SectionValues Professional Refactor)**
- ✅ SectionValues reveal animation REMOVED (show all content always)
- ✅ Professional CSS Grid minmax layout (320px/380px responsive minima)
- ✅ Equal-height cards with content-driven sizing
- ✅ Optimized row/column gap (reduced excessive spacing)
- ✅ CLS prevention (will-change, contain: content)
- ✅ Tests updated: 267/270 passing (4 skipped)
- ✅ Build: 58/58 pages passing
- ✅ Commits: 4 (b7f9a4f, 3c00b5b, 5137b0b, e146894)
- ✅ Branch: 17 commits ahead of origin

**CRITICAL BLOCKER — SESSION 5 START:**
🔴 **phase-8-blockers.spec.ts EXISTS & TESTS IMPLEMENTATION**
- File: `e2e/phase-8-blockers.spec.ts` (anti-pattern: phase-specific tests)
- Problem: Tests outdated implementation (reveal animation, scroll-to race conditions)
- Action: RUN tests first thing. If FAIL → DELETE file. If PASS → migrate valid behavior tests to main suites, DELETE phase-specific file.
- NEVER commit phase-numbered tests to main.

**SESSION 5 TASKS (In Order):**
1. Run `pnpm test` — MUST PASS 267+
2. Deal with phase-8-blockers.spec.ts (delete or migrate)
3. Delegate: ServicesHero + ProjectCategoryHero brightness/saturation (use About hero as reference)
4. Reference: `components/about/about-hero.tsx` (has brightness/saturation already)
5. Apply same pattern to: `components/sections/services.tsx`, `components/projects/project-category-hero.tsx`
6. Run Lighthouse audit
7. Build + Commit + Push (all green)
8. Merge feat/phase-8-scrollreveal-production → main

**Git State:**
- Branch: feat/phase-8-scrollreveal-production (17 commits ahead of origin)
- Last 4 commits: SectionValues refactor (b7f9a4f, 3c00b5b, 5137b0b, e146894)
- Modified: 16 files (components, data, baselines)
- Untracked: MCP logs, test docs, profile images
- Status: Ready for phase-8-blockers.spec.ts decision

**Docker Memory Status:**
- Attempted sync at session end (curl calls sent)
- Verify on next session start: search for "session-2026-04-20-005"
- If entities missing: use this ## Session State as fallback

**Next Session Start (Session 5):**
```
ORCHESTRATOR MODE - Phase 8 Final Push

STEP 1: Deal with phase-8-blockers.spec.ts
- Run: pnpm test
- If fails: DELETE e2e/phase-8-blockers.spec.ts (tests old implementation)
- If passes: migrate valid tests to main suites, DELETE phase-specific file
- NEVER commit phase-specific tests

STEP 2: Delegate brightness/saturation to heroes
- Reference: components/about/about-hero.tsx (existing pattern)
- Apply to: components/sections/services.tsx, components/projects/project-category-hero.tsx

STEP 3: Build → Commit → Push → Merge
- All tests passing
- All builds passing
- Merge to main for production

Go!
```

---

**Document Version:** 2.1 (2026-04-16)  
**Last Updated:** Optimization audit — extracted execution timing and error recovery to reference docs  
**Status:** Lean, authoritative contract — detailed guidance moved to searchable reference
