import type { z } from "zod";
import type {
  AgentIntent,
  AgentOutput,
  McpServerId,
  SemVer,
  SkillContext,
  SkillId,
  TokenCostTier,
} from "./core";

// ─── Skill Manifest ───────────────────────────────────────────────────────────

/**
 * The contract every skill must satisfy.
 *
 * Constraints:
 * - `id` must match the directory name under agent/skills/ and .github/skills/
 * - `version` follows semver; bump minor on behaviour change, major on breaking
 * - `fitness` is PURE — no side effects, no async, no MCP calls. Returns 0–1.
 * - `dryRunCapable` must be true for any destructive skill (write/send/trigger)
 * - `outputSchema` is used by ValidationGate to hard-reject malformed output
 */
export interface SkillManifest<TInput = unknown, TOutput = unknown> {
  readonly id: SkillId;
  readonly version: SemVer;
  readonly description: string; // mirrors SKILL.md frontmatter description exactly
  readonly requiredServers: ReadonlyArray<McpServerId>;
  readonly costTier: TokenCostTier;
  readonly dryRunCapable: boolean;
  readonly inputSchema: z.ZodType<TInput, z.ZodTypeDef, unknown>;
  readonly outputSchema: z.ZodType<TOutput, z.ZodTypeDef, unknown>;

  /**
   * Pure fitness function. Must be unit-testable with no infrastructure.
   * Returns 0.0 (not suitable) → 1.0 (perfect match).
   */
  fitness(intent: AgentIntent): number;

  /**
   * Execute the skill. Called only after:
   * 1. Health check confirms all requiredServers are available
   * 2. Agent pool scope guard has confirmed allowed servers
   * 3. dryRun preference has been applied
   */
  execute(input: TInput, ctx: SkillContext): Promise<TOutput>;
}

// ─── Scored Skill (router output) ────────────────────────────────────────────

export interface ScoredSkill<TInput = unknown, TOutput = unknown> {
  readonly skill: SkillManifest<TInput, TOutput>;
  /** Raw fitness score 0–1 */
  readonly fitnessScore: number;
  /** Heuristic-adjusted final score 0–1 */
  readonly adjustedScore: number;
  /** Breakdown for observability */
  readonly scoreBreakdown: {
    readonly fitness: number;
    readonly heuristicMultiplier: number;
    readonly costPenalty: number;
  };
}

// ─── Skill Registry Entry ─────────────────────────────────────────────────────

export interface SkillRegistryEntry {
  readonly manifest: SkillManifest;
  readonly registeredAt: string; // ISO 8601
}

// ─── Agent Output (typed) ─────────────────────────────────────────────────────
export type { AgentOutput };
