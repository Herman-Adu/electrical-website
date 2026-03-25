# Copilot Custom Instructions — Nexgen Electrical Website

## Repository

- **Repo:** `Herman-Adu/electrical-website`
- **Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS, shadcn/ui, t3-env, Zod, pnpm
- **Deployment:** Vercel (production), Docker Desktop (local development)
- **MCP Gateway:** Docker MCP gateway with 16 enabled servers

## Agent Skill System

This repository has a production-grade agent skill system in `agent/`. Before writing automation or agentic code, understand the system:

- **Skills** live in `agent/skills/*.skill.ts` — each implements `SkillManifest<TInput, TOutput>`
- **Sub-agents** live in `agent/agents/` — each has a bounded `allowedServers` set
- **SKILL.md playbooks** live in `.github/skills/<skill-id>/SKILL.md`
- **Orchestrator** is `agent/orchestrator.ts` — entry point for all skill execution
- **Constants** are in `agent/constants/` — always use `MCP.*` and `SKILLS.*` typed constants, never raw strings

## Available Skills

Use `/code-intelligence` — find code patterns, symbols, AST search  
Use `/browser-testing` — Playwright browser automation, screenshots, UI tests  
Use `/github-actions` — trigger CI, deploy preview, Copilot review, dependency audit  
Use `/send-notification` — send/schedule emails via Resend (always dry-run first)  
Use `/reasoning-audit` — chain-of-thought analysis, architectural decisions  
Use `/health-check` — verify MCP server connectivity and circuit-breaker state

## Coding Standards

- **TypeScript:** Strict mode, `noUncheckedIndexedAccess`, branded types for IDs
- **Zod:** All skill inputs and outputs are Zod-validated
- **Validation:** Never swallow errors; `ValidationGate` is a hard stop
- **Secrets:** All secrets via env vars (t3-env) or MCP keychain. Never hardcoded.
- **Dry-run:** Always implement for destructive operations (`dryRunCapable: true`)
- **Audit:** Every agent action is logged via `AuditLogger` with structured `AuditEvent`
- **Single responsibility:** One skill = one concern. No multi-concern skills.

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
