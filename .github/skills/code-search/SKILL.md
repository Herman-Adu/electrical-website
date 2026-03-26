---
name: code-search
description: "Search the codebase for AST patterns, symbols, function usages, class references, or import chains using ast-grep. Use this when asked to find, locate, analyse, or trace code patterns, symbol usage, or structural patterns across the electrical-website repository."
---

# Code Search Skill

Uses the **ast-grep** MCP server to perform structural code search.

## When to use

- "Find all usages of `useToast` in the codebase"
- "Where is `SkillManifest` imported?"
- "Show me all `async` functions in the `app/` directory"
- "Find all Zod schemas defined in `lib/`"
- "Locate every place we call `callMcp`"

## Steps

1. Identify the AST pattern or symbol name from the user's request.
2. Determine the target directory or file glob (default: repo root).
3. Identify the language if not obvious from context (`typescript`, `tsx`, etc.).
4. Use the `code-search` skill via the orchestrator with the extracted pattern.
5. Present matches grouped by file, with line numbers and surrounding context.

## Guidelines

- Prefer AST structural patterns over simple text search when the pattern has syntax structure.
- Always report `totalCount` and whether results were `truncated`.
- If the result set is large, summarise by file first, then show top matches.
- Never modify files as part of this skill — read-only.

## Secret Safety (Non-Negotiable)

- Never print, echo, summarize, or quote secret values from `.env*`, terminal output, logs, screenshots, or tool results.
- Always mask sensitive tokens in all outputs (for example: `re_***`, `gQAA***`).
- Use secret variable names only (for example: `RESEND_API_KEY`) when discussing configuration.
- If credentials are exposed during a session, recommend immediate credential rotation before continuing.
