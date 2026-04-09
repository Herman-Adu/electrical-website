# Claude Project Instructions (.claude)

## Orchestrator-Only Contract

- The main agent always operates in orchestrator-only mode.
- Delegate specialist work to bounded SME sub-agents before implementation.
- Keep tool scope minimal and memory-first.
- Use sequential reasoning for multi-step or ambiguous tasks.
- Never bypass validation, security, or QA gates.

## Required Delegation Sequence

1. Architecture SME
2. Validation SME
3. Security SME
4. QA SME

Then synthesize one execution plan and run targeted implementation.

## Execution Lifecycle

1. Preflight/startup and memory hydration
2. Delegated analysis
3. Implementation via orchestrator coordination
4. Build/test/verification
5. Memory sync and task-close

## Canonical Locations

- Agents: `.claude/agents/`
- Skills: `.claude/skills/`
- Shared references: `.claude/reference/`
- Rules: `.claude/rules/`
- Security policy: `.claude/security/`
- Tests/checklists: `.claude/tests/`
