---
name: reasoning-chain
description: "Work through a complex question or decision using sequential chain-of-thought reasoning. Optionally persists the final conclusion to the memory MCP server for future sessions. Use this when asked to reason, analyse, plan, evaluate trade-offs, compare approaches, or make an architectural or engineering decision for the electrical-website project."
---

# Reasoning Chain Skill

Uses **sequentialthinking** for chain-of-thought reasoning and **memory** for persisting conclusions.

## When to use

- "Should we use Redis or Vercel KV for rate limiting?"
- "Analyse the trade-offs between server components and client components here"
- "Plan the migration from CSS Modules to Tailwind"
- "Why might the contact form be rate-limiting incorrectly?"
- "Think through the best caching strategy for the services pages"

## Steps

1. Frame the `question` clearly from the user's request.
2. Seed relevant `context` facts (file names, constraints, known issues).
3. Estimate `estimatedSteps` based on complexity (5 for simple, 10+ for architectural).
4. Execute the reasoning chain.
5. Present the `conclusion` and `thoughtSteps` count.
6. If `persistConclusion: true`, report the `memoryKey` so the conclusion can be recalled.

## Guidelines

- Reasoning conclusions are observable — all decisions are logged to memory with timestamps.
- Use `persistConclusion: false` for speculative or exploratory reasoning.
- Chain confidence levels: `high` = well-supported; `medium` = reasonable; `low` = speculative.
- When confidence is `low`, explicitly flag this to the user and suggest follow-up.
- Never fabricate context facts — use only verified information from the workspace.
