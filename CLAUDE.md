# Nexgen Electrical Innovations

Next.js 16 + React 19, strict TypeScript, Tailwind v4.

## Commands

| `pnpm dev` | `pnpm typecheck` | `pnpm build` | `pnpm test` |
| `pnpm docker:mcp:ready` | `pnpm docker:mcp:smoke` |

## Five Hard Rules

1. Invoke orchestrator skill at the start of every session
2. Build gate before commit: `pnpm typecheck && pnpm build`
3. Memory: `mcp__memory__*` only — never write to .md or JSON files
4. React 19 first: `useTransition`, `useActionState`, Server Components; no `useEffect` when React 19 alternative exists
5. Server Components default; `"use client"` for browser interactivity only

Multi-step forms: `docs/standards/NEXTJS16_SERVER_ACTIONS_FORM_VALIDATION_APP_ROUTER.md`
Orchestrator contract: `.claude/CLAUDE.md`
