# Agents & Skills Integration Matrix

**Purpose:** Map how agents, skills, and sub-tasks interrelate for orchestration coordination.

**Last Updated:** 2026-04-15

---

## Skill → Agent Mapping

| Skill | Agent | Purpose | Invocation |
|-------|-------|---------|-----------|
| **planning** | `planning/AGENT.md` | Task breakdown, timeline estimation, risk analysis | `/planning [goal]` |
| **code-generation** | `code-generation/AGENT.md` | TDD, refactoring, debugging, component generation | `/code-generation [task]` |
| **skill-builder** | `skill-builder/AGENT.md` | Audit, build, optimize, evaluate skills | `/skill-builder [mode] [skill]` |
| **knowledge-memory** | `knowledge-memory/AGENT.md` | Extract learnings, capture knowledge, persist context | `/knowledge-memory [action]` |
| **mcp-automation** | `mcp-automation/AGENT.md` | Decompose workflows, wire MCP tools, orchestrate steps | `/mcp-automation [workflow]` |

---

## Execution Call Chain: Complete Feature

**User Request:** "Add a payment processing form"

```
┌─────────────────────────────────────────────────────────────┐
│ User: "Add payment processing form"                          │
└────────┬────────────────────────────────────────────────────┘
         │
         ├──→ Orchestrator: Load memory, clarify requirements
         │
         └──→ Orchestrator: Delegate Analysis (Parallel)
             │
             ├──→ Architecture SME: Component hierarchy + data flow
             ├──→ Validation SME: Zod schema + error handling
             ├──→ Security SME: Auth + PCI compliance + secrets
             └──→ QA SME: Test coverage + edge cases
         │
         ├──→ Orchestrator: Synthesize findings → one plan
         │
         └──→ Orchestrator: Execute plan
             │
             ├──→ /planning [optional: if feature is complex]
             │   └─→ planning/AGENT.md: Task breakdown
             │
             ├──→ /code-generation "Generate payment form tests + implementation"
             │   └─→ code-generation/AGENT.md: TDD pattern
             │       ├─ Generate tests first
             │       ├─ Generate components to pass tests
             │       └─ Generate Server Actions
             │
             ├──→ /knowledge-memory "Capture payment form patterns"
             │   └─→ knowledge-memory/AGENT.md: Extract + persist learnings
             │
             └──→ Orchestrator: Verify
                 ├─ pnpm typecheck ✅
                 ├─ pnpm build ✅
                 ├─ pnpm test ✅
                 └─ Security checklist ✅
```

---

## Skill Usage Decision Tree

```
┌─ Do I need to generate code?
│  ├─ YES: Use /code-generation
│  └─ NO: Continue
│
├─ Do I need to plan a project or break down tasks?
│  ├─ YES: Use /planning
│  └─ NO: Continue
│
├─ Do I need to create or audit a skill?
│  ├─ YES: Use /skill-builder
│  └─ NO: Continue
│
├─ Do I need to capture knowledge or update memory?
│  ├─ YES: Use /knowledge-memory
│  └─ NO: Continue
│
└─ Do I need to orchestrate multi-tool workflows?
   ├─ YES: Use /mcp-automation
   └─ NO: Continue directly (simple task)
```

---

## Orchestrator Coordination Patterns

### Pattern 1: Simple Task (Direct Implementation)

**When:** < 30 min, single file, obvious intent  
**Agents involved:** None  
**Flow:**
```
Orchestrator → Direct implementation → Verify → Close
```
**Example:** Fix typo, add import, single-line bug fix

---

### Pattern 2: Feature with Analysis (Parallel Delegation)

**When:** New feature requiring spec clarity  
**Agents involved:** 4 SMEs (parallel)  
**Flow:**
```
Orchestrator → [Arch + Validation + Security + QA agents] (parallel) → Synthesize → Plan → Execute → Verify → Close
```
**Duration:** 60–120 min  
**Example:** Multi-step form, auth change, API endpoint

---

### Pattern 3: Large Feature (Full Super Powers)

**When:** 2+ hours, complex architecture, multiple components  
**Agents involved:** All 4 SMEs + Planning + Code-Gen agents  
**Flow:**
```
Orchestrator
├─ [Brainstorm] (extended thinking)
├─ [Arch + Validation + Security + QA agents] (parallel analysis)
├─ [Planning agent] (task breakdown)
├─ [Code-Gen agent] (TDD: tests → implementation)
├─ [Knowledge-Memory agent] (capture learnings)
└─ Verify → Close
```
**Duration:** 90–180 min  
**Token savings:** 60–70% vs. baseline  
**Example:** New feature module, major refactor, new system design

---

### Pattern 4: Skill Creation (Recursive Orchestration)

**When:** Creating or improving a skill  
**Agents involved:** Skill-Builder agent  
**Flow:**
```
User request (/skill-builder)
└─ skill-builder/AGENT.md
   ├─ Mode: build/audit/optimize/evaluate
   ├─ Process interview
   ├─ Generate draft or audit findings
   ├─ Return structured output
   └─ Orchestrator: review, test, refine
```
**Duration:** 20–40 min per skill  
**Example:** Create `deployment-skill`, audit `planning-skill`, optimize `code-gen-skill`

---

## Agent Interdependencies

```
                    Orchestrator
                   /      |      \
                  /       |       \
          Planning      Code-Gen   Skill-Builder
            Agent         Agent        Agent
            /   \           / \          |
           /     \         /   \         |
        Break-   Risk    TDD   Refactor Audit
        down     Analysis      Compile
        
        Validation        Security       QA
          Agent            Agent        Agent
           |               |              |
           |               |              |
        Schemas         Auth+Secrets    Regressions
        Error Cases     OWASP Rules     Coverage
        
        Knowledge-Memory
           Agent
           /   |   \
      Capture Extract Persist
```

**Rules:**
- Orchestrator coordinates all agents; no agent-to-agent communication
- Parallel agents (4 SMEs) have no interdependencies
- Sequential agents (Planning → Code-Gen) depend on output of prior agent
- All agents return structured findings; Orchestrator synthesizes

---

## Timing & Parallelization

| Task | Duration | Parallelizable? | Typical Flow |
|------|----------|-----------------|--------------|
| **4 SME agents** | 15–30 min | YES (all 4 in parallel) | Parallel |
| **Planning agent** | 2–10 min | NO (sequential after analysis) | After SMEs |
| **Code-Gen agent** | 5–30 min | NO (sequential after plan) | After planning |
| **Skill-Builder agent** | 5–20 min | NO (sequential) | Any time |
| **Knowledge-Memory agent** | 2–5 min | YES (parallel during implementation) | Parallel to code-gen |
| **Verification gates** | 5–10 min | NO (sequential, after implementation) | After implementation |

**Total time savings with parallelization:**
- Without parallelization: SMEs (30 min) + Planning (10 min) + Code-Gen (30 min) = **70 min**
- With parallelization: SMEs (30 min) + Planning (10 min) + Code-Gen (30 min) **in parallel with Memory** = **40 min**
- **Savings: 43% time reduction**

---

## Adding New Agents & Skills

When creating a new agent/skill:

1. **Define scope:** What problem does it solve?
2. **Place in hierarchy:** Where in the orchestration does it fit?
3. **Document interface:**
   - Inputs (what it expects)
   - Outputs (what it returns)
   - Parallelization (can it run in parallel with others?)
4. **Update this matrix:** Add row, update call chains, note timing
5. **Register in SKILLS.md:** Add to registry

---

## Future Enhancements

- [ ] Timing benchmark: Run real features and log actual agent timing
- [ ] Dependency graph visualization: Create SVG diagram of agent relationships
- [ ] Auto-decision logic: Based on feature type/scope, auto-select orchestration pattern
- [ ] Cost estimation: Based on agent parallelization, estimate token cost upfront
- [ ] Failure recovery playbooks: For each agent, document recovery steps if it fails

---

## FAQ

**Q: Can two agents run in parallel?**  
A: Only if they don't depend on each other. The 4 SME agents always run in parallel. Planning and Code-Gen are sequential (Planning depends on SME findings; Code-Gen depends on Plan).

**Q: What if a task doesn't need an agent?**  
A: Skip delegation. For simple, obvious changes, Orchestrator implements directly and verifies. Not everything needs SME analysis.

**Q: Can an agent invoke another agent?**  
A: No. Agents only invoke tools (file I/O, web search, etc.). Orchestrator coordinates all agent invocations to maintain visibility and control.

**Q: How do I know if I should delegate?**  
A: Use the decision tree or check `.claude/CLAUDE.md` → "When to Use Delegation" table.

---

## Example: End-to-End Payment Form Implementation

```
User: "Add Stripe payment form"

1. PREFLIGHT (Orchestrator)
   ├─ Load memory: Prior form patterns
   ├─ Check CLAUDE.md: Form standards
   └─ Load context: Current codebase

2. ANALYSIS (Parallel, 15–30 min)
   ├─ Architecture: "Component: PaymentForm island + PaymentServer action + Stripe SDK integration"
   ├─ Validation: "Zod schema for card details, amount validation, error handling"
   ├─ Security: "PCI compliance, token handling, no card logging, SSL enforced"
   └─ QA: "Test valid card, invalid card, network failure, duplicate submission"

3. SYNTHESIS (Orchestrator, 10 min)
   └─ Plan:
       ├─ File structure: app/payments/page.tsx + components/PaymentForm.tsx + lib/stripe.ts
       ├─ Component signatures: PaymentForm (client) + createPaymentIntent (server action)
       ├─ Test outline: unit + integration + edge cases
       └─ Security gates: PCI audit + token validation

4. IMPLEMENTATION (Code-Gen agent, 20 min)
   ├─ Generate tests (TDD first)
   ├─ Generate PaymentForm component
   ├─ Generate Server Action + Stripe integration
   └─ Generate documentation

5. VERIFICATION (Orchestrator, 5–10 min)
   ├─ pnpm typecheck ✅
   ├─ pnpm build ✅
   ├─ pnpm test ✅
   └─ Security review ✅

6. MEMORY SYNC (Knowledge-Memory agent, 2 min)
   └─ Capture: "Payment form pattern: island + server action + Stripe SDK"

7. CLOSE (Orchestrator, 1 min)
   └─ "Payment form complete. Next: webhook handling."

TOTAL: ~60 min
```

---

**Document Version:** 1.0  
**Next Review:** After 3 new features using orchestrator pattern
