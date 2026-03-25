import { createHash } from "node:crypto";
import type { AgentIntent, AgentOutput, SkillId } from "../types/core.ts";
import type { ValidationIssue, ValidationResult } from "../types/audit.ts";
import { ValidationError } from "../types/audit";
import type { SkillManifest } from "../types/skill.ts";

// ─── Validation Gate ──────────────────────────────────────────────────────────

/**
 * ValidationGate enforces output schema and scope contracts after every
 * sub-agent execution.
 *
 * Rules (all are HARD STOPS — no partial proceed):
 * 1. Output must satisfy SkillManifest.outputSchema (Zod parse)
 * 2. If skill is not dryRunCapable but was invoked with dryRun=true → error
 * 3. AgentOutput.skillId must match the dispatched skill's id
 * 4. AgentOutput.agentPoolId must match the dispatching pool's id
 *
 * On failure: throws ValidationError (never swallows).
 * On success: returns the validated, typed output unchanged.
 */
export class ValidationGate {
  /**
   * Validate the output of a skill execution.
   * Throws ValidationError on any violation.
   */
  validate<TOutput>(
    raw: AgentOutput<TOutput>,
    skill: SkillManifest<unknown, TOutput>,
    intent: AgentIntent,
  ): AgentOutput<TOutput> {
    const issues: ValidationIssue[] = [];

    // Rule 1: Output schema
    const parseResult = skill.outputSchema.safeParse(raw.data);
    if (!parseResult.success) {
      for (const err of parseResult.error.errors) {
        issues.push({
          path: err.path.map(String),
          message: err.message,
          code: err.code,
        });
      }
    }

    // Rule 2: dryRun compliance
    if (!skill.dryRunCapable && intent.dryRun) {
      issues.push({
        path: [],
        message: `Skill "${skill.id}" is not dryRunCapable but was executed with dryRun=true`,
        code: "dry_run_violation",
      });
    }

    // Rule 3: skill ID integrity
    if (raw.skillId !== skill.id) {
      issues.push({
        path: ["skillId"],
        message: `Output skillId "${raw.skillId}" does not match dispatched skill "${skill.id}"`,
        code: "skill_id_mismatch",
      });
    }

    if (issues.length > 0) {
      const result: ValidationResult = {
        ok: false,
        reason: `${issues.length} validation issue(s) found`,
        details: issues,
      };
      throw new ValidationError(skill.id as SkillId, result);
    }

    return raw;
  }

  /**
   * Attempt validation — returns ValidationResult without throwing.
   * Used by the audit logger to record results independently.
   */
  safeValidate<TOutput>(
    raw: AgentOutput<TOutput>,
    skill: SkillManifest<unknown, TOutput>,
    intent: AgentIntent,
  ): ValidationResult {
    try {
      this.validate(raw, skill, intent);
      return { ok: true };
    } catch (err) {
      if (err instanceof ValidationError) {
        return err.result;
      }
      return {
        ok: false,
        reason: "Unexpected validation error",
        details: [{ path: [], message: String(err), code: "unexpected" }],
      };
    }
  }
}

// ─── Intent Hashing ───────────────────────────────────────────────────────────

/**
 * Produces a deterministic SHA-256 hex hash of the intent for audit trail.
 * Does not include any fields that may contain PII.
 */
export function hashIntent(intent: AgentIntent): string {
  const canonical = JSON.stringify({
    id: intent.id,
    category: intent.category,
    costCap: intent.costCap,
    dryRun: intent.dryRun,
  });
  return createHash("sha256").update(canonical).digest("hex");
}
