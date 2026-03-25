import type { SkillId } from "../types/core.ts";
import type {
  HeuristicSnapshot,
  OutcomeObservation,
  SkillHeuristicWeight,
} from "../types/heuristics.ts";
import type { ScoredSkill } from "../types/skill.ts";
import type { AgentIntent } from "../types/core.ts";

// ─── Memory Persistence Contract ──────────────────────────────────────────────

/**
 * Injected by the orchestrator. Wraps memory MCP read/write.
 * Using a narrow interface keeps the engine testable without MCP infrastructure.
 */
export interface HeuristicStore {
  readLatestSnapshot(): Promise<HeuristicSnapshot | null>;
  writeSnapshot(snapshot: HeuristicSnapshot): Promise<void>;
}

// ─── Constants ────────────────────────────────────────────────────────────────

/**
 * Exponential moving average smoothing factor.
 * α = 0.1 means new observations have 10% weight; history has 90%.
 */
const EMA_ALPHA = 0.1;

/** Cost penalty multipliers applied to adjusted scores */
const COST_PENALTY: Record<string, number> = {
  cheap: 0,
  medium: 0.05,
  expensive: 0.15,
};

const DEFAULT_WEIGHT: SkillHeuristicWeight = {
  successRate: 1.0,
  avgLatencyMs: 500,
  costAccuracy: 1.0,
  sampleCount: 0,
  lastUpdatedAt: new Date(0).toISOString(),
};

// ─── Heuristic Engine ─────────────────────────────────────────────────────────

/**
 * The HeuristicEngine:
 * - Loads the latest snapshot from the memory MCP store on first use (lazy init)
 * - Applies learned weights on top of raw fitness scores → adjusted scores
 * - Records new observations and writes an incremented snapshot version
 * - Every snapshot is immutable and versioned — full audit trail in memory
 *
 * Scoring formula:
 *   adjustedScore = (fitness × successRate × costAccuracy) × (1 - costPenalty)
 *       where successRate and costAccuracy come from the heuristic snapshot.
 *
 * Observable: `explainScore()` returns the full breakdown for any skill/intent pair.
 */
export class HeuristicEngine {
  readonly #store: HeuristicStore;
  #snapshot: HeuristicSnapshot | null = null;
  #initialized = false;

  constructor(store: HeuristicStore) {
    this.#store = store;
  }

  // ─── Public API ─────────────────────────────────────────────────────────────

  /**
   * Adjust raw fitness scores with learned heuristic weights.
   * Returns a new array with `adjustedScore` and `scoreBreakdown` populated.
   * Does NOT modify the input array.
   */
  async adjustScores(
    scored: ReadonlyArray<ScoredSkill>,
    _intent: AgentIntent,
  ): Promise<ReadonlyArray<ScoredSkill>> {
    await this.#ensureInitialized();

    return scored
      .map((entry) => {
        const weight = this.#getWeight(entry.skill.id);
        const costPenalty = COST_PENALTY[entry.skill.costTier] ?? 0;
        const heuristicMultiplier = weight.successRate * weight.costAccuracy;
        const adjustedScore =
          entry.fitnessScore * heuristicMultiplier * (1 - costPenalty);

        return {
          ...entry,
          adjustedScore,
          scoreBreakdown: {
            fitness: entry.fitnessScore,
            heuristicMultiplier,
            costPenalty,
          },
        } satisfies ScoredSkill;
      })
      .sort((a, b) => b.adjustedScore - a.adjustedScore);
  }

  /**
   * Record the outcome of a skill execution and persist a new snapshot.
   * Observable: snapshot version increments; no in-place mutation.
   */
  async recordObservation(obs: OutcomeObservation): Promise<void> {
    await this.#ensureInitialized();

    const current = this.#getWeight(obs.skillId);
    const isSuccess = obs.outcome === "success";

    const updated: SkillHeuristicWeight = {
      successRate: this.#ema(current.successRate, isSuccess ? 1 : 0),
      avgLatencyMs: this.#ema(current.avgLatencyMs, obs.latencyMs),
      costAccuracy: current.costAccuracy, // updated by separate cost signal if needed
      sampleCount: current.sampleCount + 1,
      lastUpdatedAt: obs.observedAt,
    };

    const currentSnapshot = this.#snapshot!;
    const newSnapshot: HeuristicSnapshot = {
      version: currentSnapshot.version + 1,
      createdAt: obs.observedAt,
      schemaVersion: "v1",
      weights: {
        ...currentSnapshot.weights,
        [obs.skillId]: updated,
      },
    };

    this.#snapshot = newSnapshot;
    await this.#store.writeSnapshot(newSnapshot);
  }

  /**
   * Returns a detailed score breakdown for observability / debugging.
   * Pure read — no side effects.
   */
  async explainScore(
    skillId: SkillId,
    fitnessScore: number,
    costTier: "cheap" | "medium" | "expensive",
  ): Promise<{
    skillId: SkillId;
    fitnessScore: number;
    weight: SkillHeuristicWeight;
    costPenalty: number;
    adjustedScore: number;
  }> {
    await this.#ensureInitialized();
    const weight = this.#getWeight(skillId);
    const costPenalty = COST_PENALTY[costTier] ?? 0;
    const adjustedScore =
      fitnessScore *
      weight.successRate *
      weight.costAccuracy *
      (1 - costPenalty);
    return { skillId, fitnessScore, weight, costPenalty, adjustedScore };
  }

  /**
   * Return the current snapshot for inspection / audit.
   */
  async currentSnapshot(): Promise<HeuristicSnapshot | null> {
    await this.#ensureInitialized();
    return this.#snapshot;
  }

  // ─── Private Helpers ───────────────────────────────────────────────────────

  async #ensureInitialized(): Promise<void> {
    if (this.#initialized) return;
    const stored = await this.#store.readLatestSnapshot();
    this.#snapshot = stored ?? this.#emptySnapshot();
    this.#initialized = true;
  }

  #getWeight(skillId: SkillId): SkillHeuristicWeight {
    const snap = this.#snapshot;
    if (!snap) return DEFAULT_WEIGHT;
    return snap.weights[skillId] ?? DEFAULT_WEIGHT;
  }

  #ema(prev: number, observation: number): number {
    return EMA_ALPHA * observation + (1 - EMA_ALPHA) * prev;
  }

  #emptySnapshot(): HeuristicSnapshot {
    return {
      version: 0,
      createdAt: new Date().toISOString(),
      schemaVersion: "v1",
      weights: {},
    };
  }
}
