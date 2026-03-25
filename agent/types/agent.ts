import type {
  AgentIntent,
  AgentOutput,
  AgentPoolId,
  McpServerId,
  SkillId,
} from "./core.ts";
import type { SkillManifest } from "./skill.ts";

// ─── Agent Pool Contract ──────────────────────────────────────────────────────

/**
 * Each AgentPool has a fixed, immutable set of allowed MCP servers.
 * Both the TypeScript compiler (via nominal types) and the runtime
 * guard in AgentPool.dispatch() enforce this boundary.
 *
 * A ScopeViolationError is thrown BEFORE any MCP call is made.
 */
export interface AgentPool {
  readonly id: AgentPoolId;
  /**
   * Immutable set of servers this pool may call.
   * Attempting to dispatch a skill that requires a server outside this
   * set results in a ScopeViolationError.
   */
  readonly allowedServers: ReadonlySet<McpServerId>;
  dispatch<TInput, TOutput>(
    skill: SkillManifest<TInput, TOutput>,
    intent: AgentIntent,
    input: TInput,
  ): Promise<AgentOutput<TOutput>>;
}

// ─── Scope Violation ─────────────────────────────────────────────────────────

export class ScopeViolationError extends Error {
  readonly agentPoolId: AgentPoolId;
  readonly requiredServers: ReadonlyArray<McpServerId>;
  readonly disallowedServers: ReadonlyArray<McpServerId>;
  readonly skillId: SkillId;

  constructor(opts: {
    agentPoolId: AgentPoolId;
    skillId: SkillId;
    requiredServers: ReadonlyArray<McpServerId>;
    disallowedServers: ReadonlyArray<McpServerId>;
  }) {
    super(
      `Scope violation: agent pool "${opts.agentPoolId}" attempted to dispatch skill "${opts.skillId}" ` +
        `which requires servers not in its allocation: [${opts.disallowedServers.join(", ")}]`,
    );
    this.name = "ScopeViolationError";
    this.agentPoolId = opts.agentPoolId;
    this.skillId = opts.skillId;
    this.requiredServers = opts.requiredServers;
    this.disallowedServers = opts.disallowedServers;
  }
}
