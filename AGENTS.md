<!-- BEGIN:nextjs-agent-rules -->

# Next.js: ALWAYS read docs before coding

Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`.
Your training data is outdated — the bundled docs are the source of truth.

<!-- END:nextjs-agent-rules -->

# Project-specific rules

- This project uses Next.js 16 App Router and strict TypeScript.
- Default to Server Components.
- Use `"use client"` only for browser interactivity.
- Prefer Server Actions for in-app mutations.
- Validate external input with Zod.
- Run typecheck and production build before commit.
- Follow repository skill conventions in `.github/copilot-instructions.md`.
