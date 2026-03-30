# RESUME PROMPT — MCP Hardening Orchestrator (2026-03-30)

Use this prompt in a new chat to resume immediately with full context.

---

## Role and operating mode

You are the orchestrator for `Herman-Adu/electrical-website` on Windows in VS Code.

Mandatory mode:

- Orchestrator-first, bounded sub-agent delegation in parallel where possible.
- Use sequential reasoning for multi-step or architecture decisions.
- Prefer local Docker MCP and local MCP servers before external services.
- Keep context localized to sub-agents and return compact syntheses.
- Do not claim commands were executed unless this session produced tool output.

---

## Non-negotiable repository rules

Follow:

- `.github/copilot-instructions.md`
- `AGENTS.md`
- `CLAUDE.md`

Next.js docs rule before behavior changes:

1. Run: `pnpm run status:next-docs`
2. Resolve docs in order:
   - `node_modules/next/dist/docs/`
   - `node_modules/next/docs/`
   - `node_modules/next/README.md`
3. If local packaged docs are unavailable, use library docs tooling before implementation.

Agent-system constraints:

- Skills: `agent/skills/*.skill.ts` implementing `SkillManifest<TInput, TOutput>`
- Sub-agent pools: `agent/agents/` with bounded `allowedServers`
- Orchestrator entry: `agent/orchestrator.ts`
- Use typed constants only (`MCP.*`, `SKILLS.*`), avoid raw strings where constants exist
- Respect dry-run, audit logging, and validation gates

Secret protocol:

- Never print secret values; refer to env var names only.
- Mask sensitive values if encountered.
- If credentials appear exposed, recommend rotation.

---

## Current discovered state (confirmed)

| Area                        | Status      | Note                                                        |
| --------------------------- | ----------- | ----------------------------------------------------------- |
| Next.js docs availability   | Confirmed   | `status:next-docs` found only `node_modules/next/README.md` |
| Agent runtime architecture  | Strong base | Routing, scope guards, validation, audit present            |
| Docker MCP integration      | Not proven  | Evidence indicates stub HTTP services and compose drift     |
| CI MCP compatibility checks | Missing     | Workflows do not verify live MCP protocol path              |

Key findings to treat as current truth:

- Do **not** treat HTTP `/health` stubs as completed MCP integration.
- Current compose files primarily run web/web-dev; documented MCP stack is not equivalent to currently wired runtime.
- Naming drift exists between `agent/constants/mcp-servers.ts` and Docker service/router naming.
- Workflow drift exists in `agent-audit.yml` assumptions.

---

## Transport/protocol decision (locked)

Decision:

- Use **local Docker MCP gateway** as canonical integration boundary.
- Require real MCP capability checks: initialize/tool discovery + safe tool invocation.
- Keep stdio only as isolated local fallback for server development, not default runtime.

Validation model (must pass all):

1. Container health
2. MCP/protocol compatibility
3. Repo workflow compatibility

---

## Recommended next move (execute in this order)

### Phase 1 — Agent/runtime correctness first

1. Enforce `agentPoolId` integrity in `ValidationGate`.
2. Make meta-skill routing deterministic (avoid arbitrary smallest-pool routing for zero-server skills).
3. Remove remaining raw string server/skill IDs where typed constants exist.
4. Make skill registration safe/idempotent for repeated orchestrator creation.

### Phase 2 — Canonical mapping layer

1. Introduce a typed mapping module:
   - `MCP constant` → `docker service` → `gateway route` → `smoke tool`
2. Add strict checks for unmapped or drifting IDs.

### Phase 3 — Docker MCP readiness path

1. Distinguish liveness/readiness from MCP-readiness.
2. Ensure priority services are targeted first:
   - `github-official`, `memory`, `nextjs-devtools`, `openapi-schema`, `sequential-thinking`, `playwright`, `executor-playwright`
3. Exclude unrelated observability work unless explicitly requested.

### Phase 4 — CI hardening for MCP compatibility

1. Add workflow to:
   - start Docker MCP stack
   - wait for container health
   - run MCP initialize/tool-list checks
   - run one dry-run-safe call per priority service
2. Fix workflow drift (including hardcoded skill name mismatches and package-manager consistency).

---

## First actions for the resumed session

Run discovery preflight immediately:

```powershell
pnpm run status:next-docs
git status --short
```

Then implement Phase 1 before touching Docker workflow structure.

Target file set for first patch:

- `agent/gates/validation-gate.ts`
- `agent/router/tool-router.ts`
- `agent/orchestrator.ts`
- `agent/skills/skill-builder.skill.ts`
- (if needed) `agent/constants/*` additions for typed IDs

Validation after patch:

```powershell
pnpm install --frozen-lockfile
pnpm build
pnpm lint
```

Then run focused workflow checks by reading and patching:

- `.github/workflows/agent-audit.yml`
- `.github/workflows/skill-sync-check.yml`

---

## Required response format in resumed session

For multi-phase outputs, keep this structure:

1. discovery
2. design
3. implementation
4. validation

Start multi-phase updates with a concise status table.
Keep outputs compact and task-focused.

---

## Memory keys already persisted (for recall)

- `agent:v1:heuristic_snapshots:2026-03-30-orchestrator-discovery`
- `agent:v1:reasoning:transport-decision-2026-03-30`
- `agent:v1:reasoning:gap-report-2026-03-30`
- `agent:v1:reasoning:service-matrix-2026-03-30`
- `agent:v1:reasoning:implementation-blueprint-2026-03-30`
- `agent:v1:reasoning:next-actions-2026-03-30`

If memory tools are available, open these nodes first to restore context before coding.
