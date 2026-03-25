# @electrical-website/agent

Production-grade composable agent skill system on top of the Docker MCP gateway.

## Architecture

```
agent/
├── types/          — All TypeScript contracts (core, skill, agent, heuristics, audit, health)
├── constants/      — Typed MCP server IDs and skill IDs (never use raw strings)
├── registry/       — SkillRegistry — versioned, queryable skill store
├── skills/         — SkillManifest implementations (one file per skill)
├── agents/         — Sub-agent pools with bounded MCP server allocations
├── heuristics/     — HeuristicEngine — self-learning score adjustment + memory persistence
├── router/         — ToolRouter — intent → skill → pool selection
├── gates/          — ValidationGate — hard-stop schema + scope validation
├── audit/          — AuditLogger — append-only event trail via memory MCP
├── health/         — HealthMonitor — circuit-breaker per MCP server
└── orchestrator.ts — Top-level entry point
```

## Usage

```typescript
import { Orchestrator } from "./agent/orchestrator.ts";

const orchestrator = await Orchestrator.create({ mcpClient });

// Execute a skill
const result = await orchestrator.run(
  "code-analysis",
  "Find all usages of useToast in the codebase",
  { pattern: "useToast", language: "typescript" },
  { costCap: "cheap", dryRun: false },
);

// Health check
const health = await orchestrator.healthCheck();

// Preview routing candidates without executing
const candidates = await orchestrator.previewRouting(
  "browser-test",
  "Take a screenshot",
);

// Query audit trail
const events = await orchestrator.auditQuery({ outcome: "success", limit: 20 });

// One-command production skill audit (live registry + heuristics)
const productionAudit = await orchestrator.runProductionSkillAudit({
  dryRun: true,
  persistObservation: false,
});

console.log(productionAudit.audit.data.auditReport?.summary);
console.log(productionAudit.optimise.data.optimiseReport?.summary);
```

## Skills

| Skill ID             | Cost Tier | Dry-Run | Servers                    | Agent Pool              |
| -------------------- | --------- | ------- | -------------------------- | ----------------------- |
| `code-search`        | cheap     | No      | ast-grep                   | code-intelligence-agent |
| `browser-testing`    | expensive | No      | playwright-mcp-server      | browser-agent           |
| `github-actions`     | medium    | Yes     | github-official            | code-intelligence-agent |
| `send-notification`  | cheap     | Yes     | resend                     | notification-agent      |
| `reasoning-chain`    | expensive | No      | sequentialthinking, memory | reasoning-agent         |
| `health-check`       | cheap     | No      | (meta)                     | orchestrator            |
| `nextjs-agent-setup` | cheap     | Yes     | (none)                     | devtools-agent ¹        |
| `skill-builder`      | medium    | Yes     | memory                     | reasoning-agent         |

> ¹ `nextjs-agent-setup` has no server deps. It routes to the smallest eligible pool. Adding a dedicated `utility-agent` pool is a tracked optimisation.

## Sub-Agent Pools

Each pool has a **hard boundary** — the TypeScript compiler and runtime both prevent scope violations.

| Pool                      | Allowed Servers                          | Primary Skills                        |
| ------------------------- | ---------------------------------------- | ------------------------------------- |
| `code-intelligence-agent` | ast-grep, github-official                | code-search, github-actions           |
| `browser-agent`           | playwright-mcp-server                    | browser-testing                       |
| `reasoning-agent`         | sequentialthinking, memory               | reasoning-chain, skill-builder        |
| `notification-agent`      | resend                                   | send-notification                     |
| `content-agent`           | fetch, wikipedia-mcp, youtube_transcript | (content-research — planned)          |
| `devtools-agent`          | next-devtools-mcp, context7              | nextjs-agent-setup (no-server skills) |
| `orchestrator`            | (meta)                                   | health-check                          |

## Self-Learning

The `HeuristicEngine` records every skill execution outcome and adjusts future routing scores using exponential moving averages. Snapshots are persisted to the memory MCP server as immutable versioned entities under `agent:v1:heuristic_snapshots:*`.

## CI Workflows

- `skill-sync-check.yml` — Validates every registered skill has a matching SKILL.md (runs on skill file changes)
- `agent-audit.yml` — Daily audit report + typecheck (runs at 06:00 UTC)

## Adding a New Skill

See `.github/copilot-instructions.md` → "When Adding a New Skill".
