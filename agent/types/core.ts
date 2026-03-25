/**
 * Brand utility — nominal typing for string IDs.
 * Prevents passing a McpServerId where a SkillId is expected, etc.
 */
export type Brand<T, B extends string> = T & { readonly __brand: B };

// ─── Primary Identifiers ────────────────────────────────────────────────────

export type McpServerId = Brand<string, "McpServerId">;
export type SkillId = Brand<string, "SkillId">;
export type AgentPoolId = Brand<string, "AgentPoolId">;

/** Semantic version literal. e.g. "1.0.0" */
export type SemVer = `${number}.${number}.${number}`;

// ─── Token Cost Tiers ────────────────────────────────────────────────────────

/**
 * cheap   — single MCP call, deterministic output, < 500 tokens
 * medium  — 2–5 MCP calls, possible branching, < 2 000 tokens
 * expensive — multi-step reasoning, browser, or code analysis, > 2 000 tokens
 */
export type TokenCostTier = "cheap" | "medium" | "expensive";

// ─── Agent Intent ────────────────────────────────────────────────────────────

/**
 * The structured intent passed into the orchestrator.
 * `category` drives initial skill eligibility filtering.
 * `costCap` is a hard upper bound — skills above this tier are excluded.
 */
export type IntentCategory =
  | "code-analysis"
  | "browser-test"
  | "github-action"
  | "notification"
  | "reasoning"
  | "content-research"
  | "devtools"
  | "health-check";

export interface AgentIntent {
  readonly id: string; // UUID v4
  readonly category: IntentCategory;
  readonly description: string; // human-readable, used by fitness functions
  readonly costCap: TokenCostTier;
  readonly dryRun: boolean;
  readonly metadata: Record<string, unknown>;
}

// ─── Skill Context ────────────────────────────────────────────────────────────

/**
 * Runtime context injected into skill.execute().
 * Skills must only call MCP servers listed in requiredServers.
 */
export interface SkillContext {
  readonly skillId: SkillId;
  readonly agentPoolId: AgentPoolId;
  readonly dryRun: boolean;
  readonly intent: AgentIntent;
  /** Opaque MCP call shim — implemented by the agent pool, typed per skill */
  readonly callMcp: <T>(
    serverId: McpServerId,
    tool: string,
    args: unknown,
  ) => Promise<T>;
}

// ─── Agent Output ─────────────────────────────────────────────────────────────

export interface AgentOutput<T = unknown> {
  readonly skillId: SkillId;
  readonly agentPoolId: AgentPoolId;
  readonly data: T;
  readonly dryRun: boolean;
  readonly latencyMs: number;
}
