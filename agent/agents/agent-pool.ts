import type {
  AgentIntent,
  AgentOutput,
  AgentPool,
  AgentPoolId,
  McpServerId,
} from "../types/index.ts";
import type { SkillManifest } from "../types/skill.ts";
import { ScopeViolationError } from "../types/agent";

// ─── MCP Client Contract ──────────────────────────────────────────────────────

/**
 * Injected by the orchestrator. Wraps the actual Docker MCP gateway calls.
 * The BaseAgentPool uses this to build the SkillContext.callMcp shim.
 */
export type McpClient = <T>(
  serverId: McpServerId,
  tool: string,
  args: unknown,
) => Promise<T>;

// ─── Base Agent Pool ──────────────────────────────────────────────────────────

/**
 * BaseAgentPool enforces:
 * 1. Compile-time narrowing: allowedServers is a ReadonlySet<McpServerId>
 * 2. Runtime guard in dispatch(): throws ScopeViolationError before ANY MCP call
 *    if the skill requires servers outside this pool's allocation.
 *
 * Subclasses declare allowedServers in their constructor and call super().
 */
export abstract class BaseAgentPool implements AgentPool {
  readonly id: AgentPoolId;
  readonly allowedServers: ReadonlySet<McpServerId>;

  readonly #mcpClient: McpClient;

  constructor(
    id: AgentPoolId,
    allowedServers: ReadonlyArray<McpServerId>,
    mcpClient: McpClient,
  ) {
    this.id = id;
    this.allowedServers = new Set(allowedServers);
    this.#mcpClient = mcpClient;
  }

  async dispatch<TInput, TOutput>(
    skill: SkillManifest<TInput, TOutput>,
    intent: AgentIntent,
    input: TInput,
  ): Promise<AgentOutput<TOutput>> {
    // ── Scope Guard ── runtime enforcement of bounded MCP allocation
    const disallowed = skill.requiredServers.filter(
      (s) =>
        s !== ("__health_monitor" as McpServerId) &&
        !this.allowedServers.has(s),
    );
    if (disallowed.length > 0) {
      throw new ScopeViolationError({
        agentPoolId: this.id,
        skillId: skill.id,
        requiredServers: skill.requiredServers,
        disallowedServers: disallowed,
      });
    }

    const start = Date.now();

    // Build the skill execution context
    const ctx = {
      skillId: skill.id,
      agentPoolId: this.id,
      dryRun: intent.dryRun,
      intent,
      callMcp: <T>(serverId: McpServerId, tool: string, args: unknown) => {
        // Secondary runtime check inside callMcp — belt-and-suspenders
        if (
          serverId !== ("__health_monitor" as McpServerId) &&
          !this.allowedServers.has(serverId)
        ) {
          throw new ScopeViolationError({
            agentPoolId: this.id,
            skillId: skill.id,
            requiredServers: skill.requiredServers,
            disallowedServers: [serverId],
          });
        }
        return this.#mcpClient<T>(serverId, tool, args);
      },
    };

    const data = await skill.execute(input, ctx);

    return {
      skillId: skill.id,
      agentPoolId: this.id,
      data,
      dryRun: intent.dryRun,
      latencyMs: Date.now() - start,
    };
  }
}

// ─── Agent Pool Factory ───────────────────────────────────────────────────────

function poolId(s: string): AgentPoolId {
  return s as AgentPoolId;
}

export const AGENT_POOL_IDS = {
  CODE_INTELLIGENCE: poolId("code-intelligence-agent"),
  BROWSER: poolId("browser-agent"),
  REASONING: poolId("reasoning-agent"),
  NOTIFICATION: poolId("notification-agent"),
  CONTENT: poolId("content-agent"),
  DEVTOOLS: poolId("devtools-agent"),
  ORCHESTRATOR: poolId("orchestrator"), // used by health-check meta-skill
} as const satisfies Record<string, AgentPoolId>;
