---
name: skill-builder
description: Use when creating new skills, optimizing existing skills, or auditing skill quality. Guides skill development following Claude Code official best practices.
argument-hint: "[skill-name or task]"
disable-model-invocation: true
---

## What This Skill Does

Guides the creation and optimization of Claude Code skills using official best practices. Use this whenever:

- Building a new skill from scratch
- Optimizing or auditing an existing skill
- Deciding on advanced features (subagent execution, hooks, dynamic context, etc.)
- Troubleshooting a skill that isn't working correctly

For the complete technical reference on all frontmatter fields, advanced patterns, and troubleshooting, see [reference.md](reference.md).

## Execution Method (Preflight)

**Step 1: Docker Preflight (Session Start)**
- Search for project state: `mcp__MCP_DOCKER__search_nodes("electrical-website-state")`
- Load context: `mcp__MCP_DOCKER__open_nodes([returned_entity_ids])`
- Extract: active phase, prior skill decisions, skill audit findings, blockers
- If Docker unavailable: check `.claude/CLAUDE.md` § Session State for fallback notes
- This ensures skill work builds on verified prior skill ecosystem context

**Step 2–N: Follow patterns below**

## Successful Patterns from Our 10-Skill Ecosystem

These patterns have been proven across 10 production skills. Use them when building new skills:

### Pattern 1: Context Injection for Personalization

**When to use:** Skill needs live data (user preferences, current priorities, brand voice) before processing
**How:** Use `!`command`` in skill body to preprocess files (guaranteed to inject, no reliability issues)
**Examples in our ecosystem:**

- research skill injects: current priorities, goals, brand voice
- content-creation skill injects: brand voice, communication style
- client-management skill injects: client context, brand voice
- this pattern is used effectively across multiple skills in this ecosystem

**Why it works:** File-read instructions are unreliable; injection is mechanically guaranteed

### Pattern 2: Extended Thinking (Ultrathink) for Synthesis

**When to use:** Step involves multi-factor analysis, architecture decisions, or connecting outputs from 3+ sub-agents
**How:** Add `(ultrathink)` marker to step heading (e.g., `**5. Synthesize recommendations** (ultrathink)`)
**Examples in our ecosystem:**

- research skill: Synthesis step uses (ultrathink) to connect insights
- business-strategy skill: Framework generation uses (ultrathink)
- planning skill: Roadmap synthesis uses (ultrathink)
- used selectively across this skill ecosystem for high-value decisions

**Why it works:** Extended reasoning improves synthesis quality and reduces errors in complex decisions

### Pattern 3: Agent Delegation as "Leaf Workers"

**When to use:** Skill needs fast, focused subtask execution (fast turnaround, bounded scope, parallel-safe)
**Pattern:** Each agent completes ONE subtask, returns structured output, leaves synthesis to skill
**Examples in our ecosystem:**

- code-generation delegates to Haiku for debugging, refactoring, test generation
- content-creation delegates to Haiku for ideation, repurposing
- agent delegation is the standard pattern across all 10 skills

**Why it works:** Keeps main skill context clean, enables parallel execution, improves cost efficiency

### Pattern 4: Clear Integration Points Between Skills

**When to use:** Building skills that will orchestrate with other skills
**Pattern:** Document inputs received from other skills + outputs returned to other skills
**Examples in our ecosystem:**

- research → business-strategy → planning (context flows forward)
- content-creation → brand-voice → social-media (coordination pattern)
- planning → code-generation → visualization (artifact flow)

**Why it works:** Prevents circular dependencies, clarifies multi-skill workflows

---

## When NOT to Build a New Skill

**Question: Should I build a new skill or extend an existing one?**

- ✅ **Build NEW** if: Completely different trigger phrases, different process, different output format
- ❌ **Don't build** if: Similar to existing skill, just slightly different. Extend instead.
- ✅ **Extend EXISTING** if: Same skill family, similar trigger, but different flavor/option

**Example:**

- ❌ DON'T build `/social-media-twitter` (too narrow, extend social-media with platform option)
- ✅ DO build `/brand-voice` (different purpose, different process, different output)

**Scope boundaries:**

- Too small: If skill is < 5 steps, probably should extend existing
- Too large: If skill is > 15 steps, probably should decompose into 2 skills or delegate heavy lifting to agents
- Just right: 7–12 steps, clear focus, atomic purpose

---

A skill is a reusable set of instructions that tells Claude Code how to handle a specific task. Skills live in `.claude/skills/[skill-name]/SKILL.md` inside your project. When you type `/skill-name` or describe what you need in natural language, Claude loads the skill's instructions and follows them.

Think of skills as SOPs for Claude. Instead of re-explaining a workflow every conversation, you write it once and invoke it forever.

**How they work under the hood:**

- Your project's `CLAUDE.md` instructions are always loaded, every conversation
- Skill _descriptions_ (from frontmatter) are always loaded so Claude knows what's available
- The full skill content only loads when the skill is actually invoked
- Once loaded, Claude follows the skill's instructions while still respecting your CLAUDE.md rules

---

## Mode 1: Build a New Skill

### Discovery Interview (6 Rounds)

Before building, conduct a structured discovery interview to clarify the skill's purpose, triggers, and constraints. **Skip rounds already answered by the user.** Move to Build Phase only after user confirms the summary.

**Round 1: Goal — What does this skill accomplish?**

- Ask: "What is the primary goal of this skill? What outcome should it deliver?"
- Goal: Understand the core purpose
- Record: 1-2 sentence goal statement

**Round 2: Trigger — When/how will this skill be invoked?**

- Ask: "When would someone use this skill? What would they say or do?"
- Examples: "When I need to summarize a PR", "When I want to generate a report"
- Record: 3-5 trigger phrases for natural language matching

**Round 3: Process — What does the skill do step-by-step?**

- Ask: "What are the steps the skill should follow to accomplish the goal?"
- Record: Numbered workflow (5-10 steps)

**Round 4: Inputs & Outputs — What data flows in and out?**

- Ask: "What information does the skill need as input? What should it produce?"
- Inputs: Files, arguments, context, APIs
- Outputs: Files created, reports returned, state changes
- Record: Input/output specification

**Round 5: Guardrails — What constraints or rules apply?**

- Ask: "Are there edge cases, limitations, or important rules to follow?"
- Examples: "Don't delete files", "Always validate input", "Never expose secrets"
- Record: 3-5 guardrails

**Round 6: Confirm — Summarize and verify understanding**

- Summarize all 5 rounds in 2-3 paragraphs
- Ask: "Does this match your intent? Any changes?"
- Wait for user confirmation before proceeding to Build Phase

**See [`reference.md`](reference.md) for detailed discovery prompts, question variations, and example interviews.**

### Build Phase

Once discovery is complete, build the skill following these steps:

**Step 1: Choose the skill type**

- **Task skills** (most common) give step-by-step instructions for a specific action. Invoked with `/name` or natural language. Examples: generate a report, summarize a PR, deploy code.
- **Reference skills** add knowledge Claude applies to current work without performing an action. Examples: coding conventions, API patterns, style guides.

**Step 2: Configure frontmatter**

Set these fields based on what you learned in discovery. **All fields must follow the Claude Code official specification** (see note below):

**Required:**

- `name` -- Matches the directory name. Lowercase, hyphens, max 64 chars.
- `description` -- Written as: "Use when someone asks to [action], [action], or [action]." Include natural keywords from the trigger phrases.
- `disable-model-invocation: true` -- Set if the skill has side effects (file generation, API calls, costs money). Prevents Claude from auto-invoking.

**Optional:**

- `argument-hint` -- Set if the skill accepts arguments. Shows in the `/` menu autocomplete.
- `model` -- Set only if a specific model capability is needed (e.g., `claude-opus-4-6`).
- `compatibility` -- Set only if the skill requires specific Claude Code version constraints.

Only set fields you actually need. Don't add frontmatter just because you can.

**⚠️ Unsupported keys (do not use):** The following keys are silently ignored by Claude Code and should be removed:

- ~~`context: fork`~~ (not officially supported; agent delegation happens via body text)
- ~~`agent: name`~~ (not officially supported; document agent calls in body text)
- ~~`enable-extended-thinking`~~ (not officially supported; use `(ultrathink)` in step headings instead)
- ~~`allowed-tools`~~ (not officially supported)

For the full field reference and invocation control matrix, see [reference.md](reference.md).

**Step 3: Write the skill content** (ultrathink)

Structure task skills as:

1. **Context** -- Files to read, APIs to call, reference material to load
2. **Step-by-step workflow** -- Numbered steps. Each step tells Claude exactly what to do.
3. **Output format** -- What the result looks like. Include templates, file paths, structured formats.
4. **Notes** -- Edge cases, constraints, what to delegate, what NOT to do.

Content rules:

- Keep SKILL.md under 500 lines. Move detailed reference material to supporting files.
- Use `$ARGUMENTS` / `$N` for dynamic input from arguments.
- Use `!`command`` for dynamic context injection (preprocessing).
- Be specific about agent delegation -- include exact prompt text.
- Specify all file paths (inputs, outputs, scripts, references).

**Step 4: Add supporting files (if needed)**

If your skill needs detailed reference docs, examples, or scripts, add them alongside SKILL.md in the same directory. Reference them from SKILL.md so Claude knows they exist. Supporting files are NOT loaded automatically -- they load only when Claude needs them. See [reference.md](reference.md) for the full pattern.

**Step 5: Document in CLAUDE.md**

Your project's `CLAUDE.md` file is where Claude loads project-wide instructions every conversation. After creating a skill, add a brief entry so you (and your team) know what's available:

- Skill name and `/slash-command`
- Trigger phrases
- Brief description of what it does
- Output location (if it produces files)

This isn't required for the skill to work, but it keeps your project organized and helps Claude understand how skills fit into your broader workflow.

**Step 6: Test**

Test both invocation methods:

1. **Natural language** -- Say something matching the description. Does Claude load the skill?
   - If not, revise the `description` field to include the keywords you used
   - Try 2-3 different phrasings to verify it triggers reliably
2. **Direct invocation** -- Run `/skill-name` with test arguments
   - Verify `$ARGUMENTS` / `$N` are substituting correctly
   - Check that outputs go where expected
3. **Edge cases** -- Try invoking with missing arguments, unusual input, or empty input
4. **Character budget** -- If you have many skills, run `/context` to confirm your skill's description is being loaded. If it's not, your total descriptions may exceed the budget (see [reference.md](reference.md) for details).

If issues arise, see Troubleshooting in [reference.md](reference.md).

For a complete worked example of the meeting-notes skill and a Mode 4 evaluation template, see [`worked-examples.md`](worked-examples.md).

---

## Mode 2: Audit an Existing Skill

Use this checklist to audit any existing skill. Read the skill file first before running through the checklist. Fix issues before marking the audit complete.

### Frontmatter Audit

- [ ] `name` matches the directory name
- [ ] `description` uses natural keywords someone would actually say when they need this skill
- [ ] `description` is specific enough to avoid false triggers but broad enough to catch real requests
- [ ] `disable-model-invocation: true` is set if the skill has side effects (generates files, calls APIs, sends messages, costs money)
- [ ] `argument-hint` is set if the skill accepts arguments via `/name`
- [ ] `model` is set only if a specific model capability is needed (e.g., `claude-opus-4-6`)
- [ ] `compatibility` is set only if version constraints are needed
- [ ] No unsupported keys are present: ~~`context`~~, ~~`agent`~~, ~~`enable-extended-thinking`~~, ~~`allowed-tools`~~

### Agent Delegation Audit

- [ ] If the skill delegates to custom agents: read the referenced `.claude/agents/[name]/AGENT.md`
- [ ] Verify the agent is scoped to "complete ONE subtask" (leaf worker) and uses second-person format
- [ ] Verify the agent is called via the Agent tool from the skill body (not via unsupported frontmatter `agent:` field)
- [ ] Agent delegation should be explicitly documented in the skill steps (e.g., "Call `.claude/agents/[agent-name]/AGENT.md` with...")
- [ ] Note: `context: fork` and `agent:` frontmatter fields are **not** officially supported by Claude Code

### Agent Governance Audit

**File Location & Structure:**

- [ ] If the skill uses a custom agent, AGENT.md is in `.claude/agents/[name]/` — NOT inside `.claude/skills/[name]/`
- [ ] The agent folder has BOTH files: `.claude/agents/[name]/AGENT.md` + `.claude/agents/[name]/README.md`
- [ ] AGENT.md uses second-person prompt format: "You are a [role] sub-agent. Your job is..."
      (NOT a planning doc with Role/Responsibilities/Input Contract sections)
- [ ] AGENT.md has these sections: Rules, Input, Process (numbered steps), Output Format, Quality Checks, Error Handling, Integration
- [ ] README.md in the agent folder documents: what the agent does, how the skill calls it, file locations, error recovery

**Agent Content Format:**

- [ ] AGENT.md is written in second person (invocable prompt, not a spec document)
- [ ] AGENT.md has named inputs (JSON schema or list of named fields)
- [ ] AGENT.md has numbered process steps (5–8 steps, not vague responsibilities)
- [ ] AGENT.md has structured output (markdown template or JSON schema, not prose)
- [ ] AGENT.md has a Quality Checks checklist before returning output
- [ ] AGENT.md has Error Handling with 3–5 named scenarios
- [ ] AGENT.md has Integration section specifying "Receives from: [skill] / Returns to: [skill]"

**Path Consistency:**

- [ ] No AGENT.md references stale paths: `brand-assets/output/`, `brand-assets/lead-magnets/`, `brand-assets/generated-imagery/`
- [ ] All file paths in AGENT.md match the skill's routing table (e.g., `images/brand/`, `images/social/`, `images/clients/`)
- [ ] Paths in AGENT.md and SKILL.md are synchronized

**To verify agent governance:** Use the Agent Governance Audit checklist above — check file location, completeness, stale paths, and second-person format.

### Content Audit

- [ ] Total SKILL.md is under 500 lines (detailed reference moved to supporting files)
- [ ] Clear step-by-step workflow with numbered steps (for task skills)
- [ ] Output format is specified with templates or examples
- [ ] All file paths and locations are documented
- [ ] Agent delegation instructions include the actual prompt text to send
- [ ] Notes section covers edge cases, constraints, and what NOT to do
- [ ] No vague instructions -- every step tells Claude exactly what to do
- [ ] String substitutions (`$ARGUMENTS`, `$N`) are used where the skill takes input

### Integration Audit

- [ ] Skill is documented in CLAUDE.md (recommended, not required)
- [ ] Supporting files (if any) are referenced from SKILL.md, not orphaned
- [ ] Scripts (if any) have correct file paths and are executable
- [ ] API keys (if any) are stored in environment variables, never hardcoded

### Quality Audit

- [ ] A beginner could follow the instructions without prior context
- [ ] Instructions are actionable, not abstract
- [ ] Delegates to subagents when appropriate to keep main context clean
- [ ] Doesn't duplicate information that lives elsewhere (CLAUDE.md, other skills)
- [ ] Output paths follow a predictable convention

### Anti-Patterns: What NOT to Do

Learn from mistakes found in our 20-skill audit:

**Vague step instructions** ❌

- DON'T: "Analyze the data"
- DO: "Extract 3–5 key themes from the data. Group by frequency. Rank by impact."
- Why: Vague instructions cause Claude to hallucinate; specific steps get consistent results

**Circular skill dependencies** ❌

- DON'T: Skill A calls Skill B, and Skill B calls Skill A
- DO: Design linear workflows (A → B → C, not A → B → A)
- Why: Circular dependencies create infinite loops and confusion

**Missing error handling** ❌

- DON'T: Assume input is always perfect, always available
- DO: Document 3–5 edge cases and how skill recovers from each
- Why: Real users will trigger edge cases; skill should handle gracefully

**Hardcoded API keys or secrets** ❌

- DON'T: Put API keys directly in SKILL.md
- DO: Store in environment variables, access via `process.env.API_KEY`
- Why: Secrets in code get exposed in version control and archives

**Over-engineering simple tasks** ❌

- DON'T: 15-step skill to do something that takes 3 steps
- DO: Keep scope focused. If it balloons, consider decomposing into 2 skills
- Why: Simpler skills are faster, easier to test, easier to maintain

**Duplicate information** ❌

- DON'T: Repeat CLAUDE.md instructions, other skills' content, or project conventions
- DO: Reference via links; skill focuses on unique value
- Why: Duplication creates maintenance burden and inconsistency

---

### Optimization Opportunities

After running the audit, consider these advanced patterns to improve the skill:

**Dynamic Context Injection:** Does this skill need live data before processing begins
(current priorities, business context, user profile, brand voice)? If yes, use
`!`cat path/to/file`` preprocessing in the skill body rather than instructing Claude to read the file.
File-read instructions are unreliable; injection is mechanically guaranteed.

**Extended Thinking (Ultrathink):** Does this skill involve multi-factor analysis, architecture
decisions, competing trade-off synthesis, or connecting outputs across 3+ sub-agents?
If yes, add `(ultrathink)` to the heading of the synthesis or decision-making step.
Example: `**5. Synthesize final recommendations** (ultrathink)`
High-value candidates: strategy synthesis, dependency mapping, risk analysis, final
report generation from multiple sources.

---

## Governance Standards: The 9/9 Checks

This 10-skill ecosystem enforces 9 governance checks. Run them manually via the checklist below to prevent quality debt and architectural decay:

| Check                          | What It Validates                                                  | Why It Matters                                                  |
| ------------------------------ | ------------------------------------------------------------------ | --------------------------------------------------------------- |
| **1. Agent Location**          | All AGENT.md live in `.claude/agents/`, never in `.claude/skills/` | Prevents agent orphaning; enables central agent governance      |
| **2. Agent Pairs**             | Each agent has BOTH AGENT.md + README.md                           | Documentation completeness; prevents incomplete agents          |
| **3. Agent Delegation Syntax** | Agent calls use body text, not `agent:` frontmatter field          | Ensures proper invocation; prevents deprecated syntax           |
| **4. Skill Structure**         | Each skill has BOTH SKILL.md + README.md                           | Full documentation; prevents stubs                              |
| **5. Size Limits**             | All SKILL.md < 500 lines                                           | Enforces modularity; prevents bloat; indicates refactoring need |
| **6. Stale Paths**             | No dead links in AGENT.md files                                    | Prevents broken references; keeps documentation accurate        |
| **7. Script Existence**        | All scripts referenced in skills actually exist                    | Prevents runtime failures; catches missing files                |
| **8. Frontmatter Compliance**  | Only official Claude Code keys used (no unsupported keys)          | Prevents silent failures from ignored frontmatter               |
| **9. Quality Gate**            | All worked-examples.md ≥ 150 lines                                 | Ensures example quality; prevents hollow documentation          |

**Enforcement:** Run through the 9 checks manually before committing new or modified skills to catch issues early.

---

## Recommended Conventions

Adapt these to fit your project:

- Skills live in `.claude/skills/[skill-name]/SKILL.md`
- Agents live in `.claude/agents/[agent-name]/AGENT.md` + README.md pair
- Output files go in a predictable location (e.g., `output/[skill-name]/` or `archives/[type]/`)
- API keys go in environment variables, never hardcoded in skill files
- Document all active skills in your project's CLAUDE.md
- Frontmatter `description` is written as: "Use when someone asks to [action], [action], or [action]."
- Run through the 9-check governance checklist before committing new or modified skills

## Mode 3: Optimize an Existing Skill

Propose improvements to existing skills using evaluation-driven development. Analyze token usage, agent delegation, vague steps, and missing guardrails. Provide before/after diffs and cost/benefit analysis.

**Provide:**

- Skill name
- Current SKILL.md content
- Context (known limitations or goals)

**Steps:**

1. Call `.claude/agents/skill-builder/AGENT.md` with `mode: optimize`
2. Review proposed improvements (3–5 changes)
3. Approve or reject each improvement
4. Mode 3 generates before/after diffs
5. Use Mode 1 (Build) or manually edit SKILL.md to implement accepted changes
6. Test the optimized skill on real requests

---

## Mode 4: Evaluate a Skill (Claude A/Claude B Loop)

Test whether a skill performs correctly on real-world inputs before deploying. Based on the official Anthropic skill evaluation pattern.

**Provide:**

- The skill to evaluate
- 3+ test cases (trigger prompt + expected behavior)

**Steps:**

1. Call `.claude/agents/skill-builder/AGENT.md` with `mode: evaluate` and test cases
2. Review the evaluation report
3. Fix FAIL and PARTIAL items using Mode 3: Optimize
4. Re-run evaluation to confirm improvements
5. Repeat until all test cases pass

**Example input:**

```
/skill-builder evaluate research

Test cases:
1. Happy path: "Research TypeScript performance improvements 2026"
   Expected: 5+ sources, synthesis, key findings, recommendations

2. Edge case 1: "Research [empty]"
   Expected: Skill asks for research topic, doesn't error

3. Edge case 2: "Research with 100+ sources"
   Expected: Handles efficiently, maybe delegates to agent
```

**Output:** Evaluation report with score (X/N passing), failure analysis, priority improvements

See [`worked-examples.md`](worked-examples.md) for a full evaluation example.

---

## Important Notes

- Always read an existing skill before optimizing it. Never propose changes to a skill you haven't read.
- When building a new skill, check if a similar skill already exists that could be extended instead.
- For advanced patterns (subagent execution, hooks, permissions), see [reference.md](reference.md).
- For complete worked examples of all 4 modes, see [`worked-examples.md`](worked-examples.md).
