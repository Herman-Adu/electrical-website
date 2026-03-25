import type { AgentPoolId, SkillId, TokenCostTier } from "./core.ts";

// ─── Audit Trail Types ────────────────────────────────────────────────────────

/**
 * AuditEvent is append-only and immutable after creation.
 * Written to memory MCP under key: agent:v1:audit_events:<id>
 *
 * The intentHash is a SHA-256 of the serialised AgentIntent — it allows
 * correlation of events without storing potentially sensitive description text.
 */
export interface AuditEvent {
  /** UUID v4 — globally unique */
  readonly id: string;
  readonly timestamp: string; // ISO 8601
  readonly skillId: SkillId;
  readonly agentPoolId: AgentPoolId;
  readonly costTier: TokenCostTier;
  readonly dryRun: boolean;
  /** SHA-256 hex of JSON.stringify(AgentIntent) */
  readonly intentHash: string;
  readonly outcome: AuditOutcome;
  readonly validationResult: ValidationResult;
  readonly latencyMs: number;
  readonly schemaVersion: "v1";
}

export type AuditOutcome =
  | "success"
  | "validation_failure"
  | "server_unavailable"
  | "scope_violation"
  | "timeout"
  | "dry_run_skipped";

// ─── Validation Result ────────────────────────────────────────────────────────

export type ValidationResult =
  | { readonly ok: true }
  | {
      readonly ok: false;
      /** Human-readable summary of what failed */
      readonly reason: string;
      /** Zod or custom error details — structured for observability */
      readonly details: ReadonlyArray<ValidationIssue>;
    };

export interface ValidationIssue {
  readonly path: ReadonlyArray<string | number>;
  readonly message: string;
  readonly code: string;
}

// ─── Validation Error ─────────────────────────────────────────────────────────

export class ValidationError extends Error {
  readonly skillId: SkillId;
  readonly result: ValidationResult & { ok: false };

  constructor(skillId: SkillId, result: ValidationResult & { ok: false }) {
    super(`Validation failed for skill "${skillId}": ${result.reason}`);
    this.name = "ValidationError";
    this.skillId = skillId;
    this.result = result;
  }
}
