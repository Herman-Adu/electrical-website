import type { McpServerId, SkillId } from "./core.ts";

// ─── Heuristic Types ──────────────────────────────────────────────────────────

/**
 * Per-skill learned weight, derived from observed outcomes over time.
 * All fields are read-only — mutations create a new snapshot (immutable history).
 */
export interface SkillHeuristicWeight {
  /** Rolling success rate 0–1 over the last 30 days of observations */
  readonly successRate: number;
  /** Exponential moving average latency in milliseconds */
  readonly avgLatencyMs: number;
  /**
   * How accurately the skill's declared costTier predicted actual resource use.
   * 1.0 = perfect; < 0.5 = consistently under- or over-estimated.
   */
  readonly costAccuracy: number;
  /** Number of observations contributing to these weights */
  readonly sampleCount: number;
  /** ISO 8601 timestamp of the last update */
  readonly lastUpdatedAt: string;
}

/**
 * A versioned, immutable snapshot of all skill heuristic weights.
 * Written to the memory MCP server under key agent:v1:heuristic_snapshots:<version>
 * NEVER mutated in place — each learning cycle increments `version`.
 */
export interface HeuristicSnapshot {
  readonly version: number;
  readonly createdAt: string; // ISO 8601
  /** Namespace qualifier — for future schema migrations */
  readonly schemaVersion: "v1";
  readonly weights: Readonly<Record<SkillId, SkillHeuristicWeight>>;
}

/**
 * The outcome of a single skill execution, fed into the heuristic engine
 * to update weights.
 */
export type SkillOutcome =
  | "success"
  | "validation_failure"
  | "server_unavailable"
  | "scope_violation"
  | "timeout";

export interface OutcomeObservation {
  readonly skillId: SkillId;
  readonly outcome: SkillOutcome;
  readonly latencyMs: number;
  readonly costTierUsed: "cheap" | "medium" | "expensive";
  readonly observedAt: string; // ISO 8601
}
