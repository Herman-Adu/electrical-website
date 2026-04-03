<!-- BEGIN:nextjs-agent-rules -->

# Next.js: ALWAYS read docs before coding

Before any Next.js work, resolve local docs in this order:

1. `node_modules/next/dist/docs/` (preferred when present)
2. `node_modules/next/docs/`
3. `node_modules/next/README.md` (minimum local fallback)

Run `pnpm run status:next-docs` to discover which source exists in this workspace.
If packaged docs are unavailable locally, use a docs lookup source (Context7/library docs tooling) before coding.
For multi-step ambiguity, use sequential reasoning before implementation.

<!-- END:nextjs-agent-rules -->

# Project-specific rules

- Secrets safety first: never output secret values from `.env*`, terminal logs, screenshots, tool results, editor context, active selections, or auto-attached file content; use masked values only and reference variable names instead of values.
- Treat `.env*` and all secret-bearing files as restricted context: they may exist in the session but must never be quoted, summarized, attached, persisted to memory, copied into markdown, or treated as readable source material.
- If a secret-bearing file appears in active editor context or attachments, ignore the file contents and switch immediately to masked reporting (`present` / `missing`, variable names only).
- If credentials are exposed during a session, treat them as compromised and instruct immediate rotation.
- Prefer fail-closed handling: if there is any uncertainty whether content is sensitive, block it, mask it, and do not quote it.

- This project uses Next.js 16 App Router and strict TypeScript.
- Default to Server Components.
- Use `"use client"` only for browser interactivity.
- Prefer Server Actions for in-app mutations.
- Validate external input with Zod.
- Run typecheck and production build before commit.
- Follow repository skill conventions in `.github/copilot-instructions.md`.
