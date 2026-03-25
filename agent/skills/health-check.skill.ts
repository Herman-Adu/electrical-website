import { z } from "zod";
import type { AgentIntent, SkillContext } from "../types/core";
import type { SkillManifest } from "../types/skill";
import { ALL_MCP_SERVERS } from "../constants/mcp-servers";
import { SKILLS } from "../constants/skill-ids";

// ─── Schemas ─────────────────────────────────────────────────────────────────

const InputSchema = z.object({
  /** Subset of server IDs to check. Defaults to all registered servers. */
  serverIds: z.array(z.string()).optional(),
  /** Timeout per ping in milliseconds */
  pingTimeoutMs: z.number().int().positive().default(5_000),
});

const OutputSchema = z.object({
  totalChecked: z.number().int().nonnegative(),
  healthy: z.number().int().nonnegative(),
  degraded: z.number().int().nonnegative(),
  unavailable: z.number().int().nonnegative(),
  allHealthy: z.boolean(),
  reports: z.array(
    z.object({
      serverId: z.string(),
      status: z.enum(["healthy", "degraded", "unavailable"]),
      latencyMs: z.number(),
      checkedAt: z.string(),
    }),
  ),
});

export type HealthCheckInput = z.infer<typeof InputSchema>;
export type HealthCheckOutput = z.infer<typeof OutputSchema>;

// ─── Skill Manifest ───────────────────────────────────────────────────────────

/**
 * The health-check skill is a meta-skill: it requires NO external MCP servers.
 * It delegates to the HealthMonitor that is injected into the SkillContext via
 * ctx.callMcp with a sentinel server ID "__health_monitor".
 *
 * The AgentPool for this skill is the orchestrator itself (not a sub-agent pool).
 */
export const healthCheckSkill: SkillManifest<
  HealthCheckInput,
  HealthCheckOutput
> = {
  id: SKILLS.HEALTH_CHECK,
  version: "1.0.0",
  description:
    "Check the health of all Docker MCP gateway servers before dispatching other skills. " +
    "Returns per-server status, latency, and circuit-breaker state. " +
    "Use this when asked to verify MCP server connectivity, run a health check, or diagnose tool availability.",
  requiredServers: [], // meta-skill — uses HealthMonitor, not MCP calls
  costTier: "cheap",
  dryRunCapable: false,

  inputSchema: InputSchema,
  outputSchema: OutputSchema,

  fitness(intent: AgentIntent): number {
    if (intent.category === "health-check") return 0.99;

    const desc = intent.description.toLowerCase();
    const hits =
      (desc.includes("health") ? 1 : 0) +
      (desc.includes("status") ? 0.5 : 0) +
      (desc.includes("ping") ? 1 : 0) +
      (desc.includes("available") ? 0.5 : 0) +
      (desc.includes("mcp") ? 0.5 : 0);

    return hits > 0 ? Math.min(0.95, hits * 0.3) : 0;
  },

  async execute(
    input: HealthCheckInput,
    ctx: SkillContext,
  ): Promise<HealthCheckOutput> {
    // Delegate to health monitor via injected callMcp shim
    // The orchestrator wires this to HealthMonitor.preFlight()
    const serverIds = input.serverIds ?? ALL_MCP_SERVERS;
    const result = await ctx.callMcp<HealthCheckOutput>(
      // sentinel value — the orchestrator intercepts this call
      "__health_monitor" as Parameters<typeof ctx.callMcp>[0],
      "preFlight",
      { serverIds },
    );
    return result;
  },
};
