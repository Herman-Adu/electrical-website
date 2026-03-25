import type {
  AgentIntent,
  AgentOutput,
  AgentPoolId,
  McpServerId,
} from "../types/core.ts";
import type { ScoredSkill, SkillManifest } from "../types/skill.ts";
import type { AgentPool } from "../types/agent.ts";
import type { PreFlightReport } from "../types/health.ts";
import { SkillRegistry } from "../registry/skill-registry";
import { HeuristicEngine } from "../heuristics/heuristic-engine";
import { HealthMonitor } from "../health/health-monitor";

// ─── Router Config ────────────────────────────────────────────────────────────

export interface ToolRouterConfig {
  /** Minimum adjusted score to consider a skill eligible. Default: 0.1 */
  minScore?: number;
  /** Maximum number of candidate skills to evaluate. Default: 5 */
  topK?: number;
}

const DEFAULTS: Required<ToolRouterConfig> = {
  minScore: 0.1,
  topK: 5,
};

// ─── Routing Result ───────────────────────────────────────────────────────────

export interface RoutingDecision {
  readonly selected: ScoredSkill;
  readonly candidates: ReadonlyArray<ScoredSkill>;
  readonly preFlightReport: PreFlightReport;
  readonly agentPoolId: AgentPoolId;
}

export type RouterError =
  | { readonly kind: "no_eligible_skills"; intent: AgentIntent }
  | {
      readonly kind: "servers_unavailable";
      servers: ReadonlyArray<McpServerId>;
    }
  | { readonly kind: "no_pool_found"; skillId: string };

export class RoutingError extends Error {
  readonly detail: RouterError;
  constructor(detail: RouterError) {
    super(
      detail.kind === "no_eligible_skills"
        ? `No eligible skills found for intent category "${detail.intent.category}"`
        : detail.kind === "servers_unavailable"
          ? `Required MCP servers unavailable: [${detail.servers.join(", ")}]`
          : `No agent pool found for skill "${detail.skillId}"`,
    );
    this.name = "RoutingError";
    this.detail = detail;
  }
}

// ─── Tool Router ──────────────────────────────────────────────────────────────

/**
 * ToolRouter routes an AgentIntent to the optimal ScoredSkill and dispatches
 * it through the appropriate AgentPool.
 *
 * Selection algorithm:
 * 1. Registry.rankByFitness() → raw fitness scores, filtered by costCap
 * 2. HeuristicEngine.adjustScores() → learned heuristic weights applied
 * 3. Take top-scoring skill
 * 4. HealthMonitor.preFlight(skill.requiredServers) → gate on server health
 * 5. Find the AgentPool that can service the skill (has all requiredServers)
 * 6. Dispatch via pool.dispatch()
 * 7. HeuristicEngine.recordObservation() → update learned weights
 */
export class ToolRouter {
  readonly #registry: SkillRegistry;
  readonly #heuristics: HeuristicEngine;
  readonly #health: HealthMonitor;
  readonly #pools: Map<AgentPoolId, AgentPool>;
  readonly #config: Required<ToolRouterConfig>;

  constructor(
    registry: SkillRegistry,
    heuristics: HeuristicEngine,
    health: HealthMonitor,
    pools: ReadonlyArray<AgentPool>,
    config: ToolRouterConfig = {},
  ) {
    this.#registry = registry;
    this.#heuristics = heuristics;
    this.#health = health;
    this.#config = { ...DEFAULTS, ...config };

    this.#pools = new Map();
    for (const pool of pools) {
      this.#pools.set(pool.id, pool);
    }
  }

  /**
   * Route intent → skill → pool → output.
   * Throws RoutingError for all routing failures.
   * Throws ScopeViolationError or ValidationError from the pool/gate layer.
   */
  async route<TOutput = unknown>(
    intent: AgentIntent,
    input: unknown,
  ): Promise<AgentOutput<TOutput>> {
    const start = Date.now();

    // Step 1 + 2: fitness scores → heuristic-adjusted ranking
    const rawCandidates = this.#registry.rankByFitness(intent, {
      limit: this.#config.topK,
    });

    if (rawCandidates.length === 0) {
      throw new RoutingError({ kind: "no_eligible_skills", intent });
    }

    const candidates = await this.#heuristics.adjustScores(
      rawCandidates,
      intent,
    );
    const filtered = candidates.filter(
      (c) => c.adjustedScore >= this.#config.minScore,
    );

    if (filtered.length === 0) {
      throw new RoutingError({ kind: "no_eligible_skills", intent });
    }

    const selected = filtered[0] as ScoredSkill;

    // Step 3: pre-flight health check
    const preFlightReport = await this.#health.preFlight(
      selected.skill.requiredServers,
    );
    if (
      !preFlightReport.allHealthy &&
      selected.skill.requiredServers.length > 0
    ) {
      throw new RoutingError({
        kind: "servers_unavailable",
        servers: preFlightReport.unavailableServers,
      });
    }

    // Step 4: find agent pool
    const pool = this.#findPool(selected.skill);
    if (!pool) {
      throw new RoutingError({
        kind: "no_pool_found",
        skillId: selected.skill.id,
      });
    }

    // Step 5: dispatch
    const result = await (pool as AgentPool).dispatch(
      selected.skill as SkillManifest,
      intent,
      input,
    );

    // Step 6: record observation for self-learning
    await this.#heuristics.recordObservation({
      skillId: selected.skill.id,
      outcome: "success",
      latencyMs: result.latencyMs,
      costTierUsed: selected.skill.costTier,
      observedAt: new Date().toISOString(),
    });

    return result as AgentOutput<TOutput>;
  }

  /**
   * Expose the current routing candidates for a given intent (dry diagnostic).
   */
  async preview(intent: AgentIntent): Promise<ReadonlyArray<ScoredSkill>> {
    const raw = this.#registry.rankByFitness(intent, {
      limit: this.#config.topK,
    });
    return this.#heuristics.adjustScores(raw, intent);
  }

  // ─── Private ──────────────────────────────────────────────────────────────

  /**
   * Find the pool whose allowedServers is a superset of skill.requiredServers.
   * Prefers the pool with the smallest allowed set (principle of least privilege).
   */
  #findPool(skill: SkillManifest): AgentPool | undefined {
    const required = new Set(skill.requiredServers);

    const candidates = [...this.#pools.values()].filter((pool) => {
      if (required.size === 0) return true; // health-check meta-skill
      return [...required].every((s) => pool.allowedServers.has(s));
    });

    // Prefer smallest allocation (least privilege)
    return candidates.sort(
      (a, b) => a.allowedServers.size - b.allowedServers.size,
    )[0];
  }
}
