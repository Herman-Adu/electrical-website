# General-Purpose Agent

## Summary

The general-purpose agent is a reusable, focused worker for multi-step task completion. It handles decomposition, analysis, and synthesis subtasks while keeping parent skills clean and enabling parallel execution.

## Key Responsibilities

- Task Decomposition — Break complex tasks into subtasks, structure work for sequential or parallel execution
- Analysis & Synthesis — Perform focused analysis (patterns, themes, relationships), synthesize findings into conclusions
- Content Processing — Extract key information, summarize, compress, normalize, and restructure data
- Decision Support — Evaluate options, surface trade-offs, provide recommendations with confidence levels
- Error Handling — Provide clear, structured error messages with recovery steps when inputs are incomplete

## Confidence Level

High (88%+) — General-purpose task execution is reliable for focused, single-responsibility work. Limitation: highly specialized domains or ambiguous tasks may require domain-specific agents.

## Purpose

The general-purpose agent is a generic, reusable sub-agent for multi-step task completion within the Executive Assistant skill system. It's invoked by parent skills when they need to:

- Decompose complex tasks into subtasks
- Delegate work to a focused, efficient worker
- Keep the main skill context clean and focused
- Run multiple subtasks in parallel (independent execution)

## When to Use

The general-purpose agent is called by parent skills with `context: fork` set in SKILL.md. It handles:

- Research subtasks (factual lookups, analysis)
- Content analysis (extracting patterns, synthesizing information)
- Code review and refactoring
- Decision-making on specific dimensions
- Summarization and compression tasks
- Any focused, single-responsibility task

## When NOT to Use

- For tasks that need conversation history or multi-turn interaction (use a regular skill instead)
- For tasks requiring specialized domain knowledge (use a domain-specific agent)
- For tasks that are too simple to justify delegation (do them in the parent skill)

## Integration

### Called By

All parent skills with `context: fork` + `agent: general-purpose` can delegate to this agent.

Examples:

- `/research` skill — delegates research subtasks
- `/planning` skill — delegates decomposition and analysis subtasks
- `/business-strategy` skill — delegates strategic analysis subtasks

### Input Contract

Each invocation passes:

```json
{
  "task": "string describing the subtask",
  "context": "compressed notes from previous steps (optional)",
  "constraints": "rules or guardrails (optional)",
  "input_data": "structured input if needed (optional)"
}
```

### Output Contract

Agent returns structured markdown with:

- Task Summary (restatement)
- Results (primary output)
- Key Points (3-7 bullets)
- Uncertainties or Limitations
- Confidence level (High/Medium/Low)

## Example Usage in SKILL.md

For each subtask, invoke the agent with:

Agent invocation:

- Agent: general-purpose
- Input: { "task": "...", "context": "...", "constraints": "..." }
- Expected output: Structured markdown with results, key points, confidence

Example:

- **Subtask:** "Identify top 3 market segments"
- **Agent call:** Invoke with task and compressed context from previous subtasks
- **Expected output:** List of segments with supporting evidence

## Error Recovery

If the agent returns uncertain results:

- Flag the uncertainty in the parent skill's synthesis
- Either re-run the subtask with different parameters
- Or manually review and override the result
- Document the decision in logs

## Testing

To test the agent in isolation, invoke it with:

```
Task: "Summarize the key features of Next.js 15"
Context: "We're evaluating frameworks for a fullstack project"
Constraints: "Focus on production readiness and deployment ease"
```

Expected output: Structured markdown with 5-7 key points, sources, and confidence level.

## Notes

- This agent is designed for single-responsibility execution
- It prioritizes conciseness and token efficiency
- Multiple instances can run in parallel for independent subtasks
- Results should be compressible and mergeable by the parent skill
