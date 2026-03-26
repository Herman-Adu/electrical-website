# Copilot Custom Instructions — Nexgen Electrical Website

## Repository

- **Repo:** `Herman-Adu/electrical-website`
- **Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS, shadcn/ui, t3-env, Zod, pnpm
- **Deployment:** Vercel (production), Docker Desktop (local development)
- **MCP Gateway:** Docker MCP gateway with 16 enabled servers

## Next.js Documentation Resolution

Before changing Next.js behavior, resolve docs in this order:

1. `node_modules/next/dist/docs/`
2. `node_modules/next/docs/`
3. `node_modules/next/README.md`

Use `pnpm run status:next-docs` to detect available local docs paths.
If local packaged docs are missing, use Context7/library documentation tooling before implementation.
Use sequential reasoning for complex, multi-step, or ambiguous decisions.

## Agent Skill System

This repository has a production-grade agent skill system in `agent/`. Before writing automation or agentic code, understand the system:

- **Skills** live in `agent/skills/*.skill.ts` — each implements `SkillManifest<TInput, TOutput>`
- **Sub-agents** live in `agent/agents/` — each has a bounded `allowedServers` set
- **SKILL.md playbooks** live in `.github/skills/<skill-id>/SKILL.md`
- **Orchestrator** is `agent/orchestrator.ts` — entry point for all skill execution
- **Constants** are in `agent/constants/` — always use `MCP.*` and `SKILLS.*` typed constants, never raw strings

## Available Skills

Use `/code-search` — find code patterns, symbols, AST search  
Use `/browser-testing` — Playwright browser automation, screenshots, UI tests  
Use `/github-actions` — trigger CI, deploy preview, Copilot review, dependency audit  
Use `/send-notification` — send/schedule emails via Resend (always dry-run first)  
Use `/reasoning-chain` — chain-of-thought analysis, architectural decisions  
Use `/health-check` — verify MCP server connectivity and circuit-breaker state

## Coding Standards

- **TypeScript:** Strict mode, `noUncheckedIndexedAccess`, branded types for IDs
- **Zod:** All skill inputs and outputs are Zod-validated
- **Validation:** Never swallow errors; `ValidationGate` is a hard stop
- **Secrets:** All secrets via env vars (t3-env) or MCP keychain. Never hardcoded.
- **Dry-run:** Always implement for destructive operations (`dryRunCapable: true`)
- **Audit:** Every agent action is logged via `AuditLogger` with structured `AuditEvent`
- **Single responsibility:** One skill = one concern. No multi-concern skills.

## Secret Handling Protocol (Non-Negotiable)

- Never print, echo, summarize, or quote real secret values from `.env*`, terminal output, screenshots, logs, or tool results.
- If a secret appears in context, treat it as sensitive and mask it in all outputs (example: `re_***`, `gQAA***`).
- Never commit `.env`, `.env.local`, or any secret-bearing file. Only `.env.example` may contain placeholders.
- When providing examples, use placeholder tokens only (never realistic credential formats beyond masked stubs).
- If a user accidentally exposes credentials, immediately recommend rotation and continue using masked values only.
- During debugging and brainstorming, refer to secret variable names (e.g., `RESEND_API_KEY`) only — never values.

## File Naming Conventions

- Skills: `<skill-id>.skill.ts`
- Agent pools: `<pool-name>.ts` in `agent/agents/`
- Skill playbooks: `.github/skills/<skill-id>/SKILL.md`

## When Adding a New Skill

1. Add ID to `agent/constants/skill-ids.ts`
2. Create `agent/skills/<id>.skill.ts` implementing `SkillManifest`
3. Register in `agent/skills/index.ts` → `registerAllSkills()`
4. Create `.github/skills/<id>/SKILL.md` with matching `name:` frontmatter
5. Assign to an appropriate `AgentPool` in `agent/agents/`
6. The `skill-sync-check.yml` CI workflow validates parity automatically

## Memory MCP Schema Namespace

All memory MCP entities use the prefix `agent:v1:` — never write outside this namespace.

- Heuristic snapshots: `agent:v1:heuristic_snapshots:<version>`
- Audit events: `agent:v1:audit_events:<uuid>`
- Reasoning conclusions: `agent:v1:reasoning:<intentId>`
- Health status: `agent:v1:health_status:<serverId>`
