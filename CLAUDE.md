# Claude Code — electrical-website

Next.js 16 App Router, strict TypeScript. Server Components by default; `"use client"` only for browser interactivity. Server Actions for mutations. All external input validated with Zod before processing.

**Build gate (mandatory before commit):** `pnpm typecheck && pnpm build`

**Secrets:** Never output values from `.env*`, logs, or screenshots. Reference variable names only (`DATABASE_URL is present`). Treat contaminated session as compromised — rotate immediately.

**Multi-step forms:** Follow `docs/standards/NEXTJS16_SERVER_ACTIONS_FORM_VALIDATION_APP_ROUTER.md`

**Orchestrator contract:** `.claude/CLAUDE.md` — delegation rules, agents, MCP stack, memory.

## Commands
| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start dev server (localhost:3000) |
| `pnpm typecheck` | TypeScript strict check |
| `pnpm build` | Production build |
| `pnpm test` | Run tests |
| `pnpm docker:mcp:ready` | Start full Docker MCP stack (port 3100) |
| `pnpm docker:mcp:smoke` | Health-check all MCP services |
| `pnpm docker:mcp:memory:search "query"` | Search Docker memory |
| `pnpm docker:mcp:memory:open entity-name` | Load Docker memory entity |
