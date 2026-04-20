# Skill Builder Skill

CTO (Chief Technology Officer) for the skill system: design, create, optimize, audit, and govern all other skills. Ensure consistency, quality, and architectural integrity across the entire skill suite.

## Purpose

Skill Builder is a meta-skill that manages the skill system itself. Use this skill to:

- **Create New Skills** — Design and build skills from scratch using guided discovery
- **Optimize Existing Skills** — Refactor, improve, and update skills
- **Audit for Quality** — Validate consistency, documentation, and best practices
- **Fork/Variant Skills** — Create variations of existing skills for specific use cases
- **Document Patterns** — Establish and maintain architectural standards
- **Govern System** — Ensure all skills meet governance standards (9/9 checks)

This skill maintains the entire skill ecosystem, ensuring high quality and consistent patterns.

## When to Use

- Create new skills from scratch
- Optimize or refactor existing skills
- Audit skill quality and consistency
- Fork existing skills to create variants
- Document architectural patterns
- Implement new skill types or patterns

**Do NOT use for:**

- Using an existing skill (invoke it directly)
- General coding (use `/code-generation`)
- Non-skill documentation (use `/content-creation`)

**Trigger:** `/skill-builder "[action] [skill-name]"`

## How It Works

### 1. Discovery Phase (6 rounds)

Interactive interview to understand the skill:

- **Round 1:** What is the skill's core goal?
- **Round 2:** What trigger phrases activate it?
- **Round 3:** What is the execution process?
- **Round 4:** What are inputs and outputs?
- **Round 5:** What guardrails and constraints apply?
- **Round 6:** Confirm and build

### 2. Build Phase

Create skill structure:

- Choose skill type (task-based or reference)
- Write frontmatter (metadata, trigger phrases, examples)
- Define execution steps with agent delegation
- Create README (user-facing documentation)
- Write AGENT.md (if delegating to sub-agents)
- Test and document edge cases

### 3. Audit/Optimize Phase

Quality assurance:

- Review consistency with existing skills
- Identify documentation gaps
- Improve clarity and examples
- Ensure best practices
- Run governance validation (9/9 checks)

## Output Structure

Skills created at: `.claude/skills/[skill-name]/`

**Required Files:**

- `SKILL.md` — Main skill specification (500 lines max)
  - Frontmatter (goal, trigger phrases, examples, tier)
  - Execution steps with agent calls
  - Edge cases and guardrails
- `README.md` — User documentation (100+ lines)
  - Purpose, when to use, key features
  - Examples with context
  - Integration patterns
  - Error handling table
- `AGENT.md` — Sub-agent instructions (if applicable)
  - Second-person imperative format
  - Clear task delegation
  - Success criteria

**Optional Files:**

- `SPECIFICATIONS.md` — Detailed technical specs
- `examples/` — Example outputs and walkthroughs

## Examples

### Example 1: Create a New Skill

```
/skill-builder "Create a skill for analyzing customer feedback"
```

**Skill Builder Process:**

- Interviews: What does feedback analysis do? When is it used? What outputs matter?
- Design: Feedback Analysis skill with agents for sentiment, themes, recommendations
- Documentation: README with 100+ lines, 3+ examples
- Governance: 7/7 checks passing
- Output: SKILL.md, README.md, AGENT.md in new skill directory

**Result:** Ready-to-use skill integrated with system and discoverable via Docker memory

## When NOT to Use

❌ Do NOT use skill-builder for:

- Using an existing skill (invoke it directly, don't rebuild it)
- General coding tasks (use code-generation instead)
- Non-skill documentation (use content-creation instead)
- Iterating without clear goals (clarify first)
- Creating skills that duplicate existing ones (audit existing skills first)

## Worked Examples

**For full worked examples:** `references/examples/skill-builder/worked-examples.md`

### Example 2: Optimize Existing Skill

```
/skill-builder "Optimize content-creation skill for better examples"
```

**Skill Builder Process:**

- Audit: Review current content-creation SKILL.md and README
- Identify gaps: Examples missing, integration patterns unclear
- Refactor: Expand README, add workflow diagrams, improve examples
- Test: Verify governance checks still pass
- Result: Improved skill with better documentation and clarity

### Example 3: Fork a Skill

```
/skill-builder "Create video-script-writer by forking content-creation"
```

**Skill Builder Process:**

- Clone: Start from content-creation template
- Customize: Change trigger phrases, execution process, examples
- Focus: Specialize in video scripts (tone, pacing, visual descriptions)
- Document: Create new README tailored to video creation
- Result: Specialized `/video-script-writer` skill with dedicated examples

## Governance Checklist

All skills must pass 9/9 governance checks:

| Check                   | Requirement                                                                  |
| ----------------------- | ---------------------------------------------------------------------------- |
| **1. Size**             | SKILL.md ≤ 500 lines, README.md ≥ 100 lines                                  |
| **2. Agent Registry**   | All agents exist in `.claude/agents/` with AGENT.md + README.md              |
| **3. References**       | No stale paths, all links valid                                              |
| **4. Scripts**          | All referenced scripts exist (skill-health.sh, setup.sh, validate-skills.sh) |
| **5. Pre-commit Hook**  | Validation runs before each commit (scripts/validate-skills.sh)              |
| **6. Examples**         | Worked examples in `references/examples/[skill-name]/`                       |
| **7. Integration**      | Properly documented in `references/SKILLS.md`                                |
| **8. Frontmatter Keys** | Only official Claude Code keys used (no unsupported keys)                    |
| **9. Examples Quality** | Worked examples minimum 150+ lines                                           |

## Skill Creation Workflow

**Step-by-Step:**

1. **Initiate Discovery:** `/skill-builder "Create skill for [use case]"`
2. **Answer 6 Rounds:** Guide skill builder through discovery questions
3. **Review Design:** Check proposed structure and execution flow
4. **Build Skill:** Skill builder creates all files
5. **Test:** Try examples, verify edge cases
6. **Audit:** Run `bash scripts/validate-skills.sh`
7. **Integrate:** Update `references/SKILLS.md` with new skill
8. **Document:** Add skill examples to `references/examples/`
9. **Deploy:** Merge to main, update CLAUDE.md skill count

## Integration

**Works Best With:**

- **Knowledge Memory** — Archive skill documentation and patterns
- **Planning** — Define new skills as strategic work
- **Code Generation** — Build actual skill code
- **All Other Skills** — Skill Builder governs and maintains them

**Example Workflow:**

```
1. Planning "Design new skill for customer research"
2. Skill Builder "Create customer-research skill"
3. Code Generation "Implement customer research analysis logic"
4. Knowledge Memory "Archive skill documentation"
```

## Error Handling & Troubleshooting

| Issue                      | Solution                                                          |
| -------------------------- | ----------------------------------------------------------------- |
| **Governance check fails** | Run `bash scripts/validate-skills.sh` to see specific error       |
| **Agent missing**          | Ensure all referenced agents exist in `.claude/agents/`           |
| **Size too large**         | Split SKILL.md or move detailed docs to SPECIFICATIONS.md         |
| **Examples don't work**    | Test examples manually before adding to SKILL.md                  |
| **Integration unclear**    | Verify skill appears in `references/SKILLS.md` integration matrix |
| **Pre-commit fails**       | Commit again after fixing governance errors                       |

## Skill Architecture Best Practices

- **Modular:** Each skill does one thing well
- **Chainable:** Skills integrate cleanly with others
- **Documented:** Examples, use cases, integration patterns clear
- **Testable:** Example outputs are realistic and runnable
- **Governed:** All skills follow same structure and standards

## Examples & Reference

- **Full worked examples:** `references/examples/skill-builder/worked-examples.md`
- **All 20 skills:** `references/SKILLS.md` (complete skill matrix)
- **Governance validator:** `scripts/validate-skills.sh`
- **Skill health check:** `bash scripts/skill-health.sh [skill-name]`
- **Template:** See any existing skill in `.claude/skills/`

---

**For the full technical reference, see [`reference.md`](reference.md) in this directory.**
