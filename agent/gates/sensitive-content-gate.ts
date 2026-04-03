import type { ValidationIssue, ValidationResult } from "../types/audit";
import { inspectForSensitiveContent } from "../security/sensitive-content";

export type SensitiveBoundary =
  | "intent_description"
  | "intent_input"
  | "intent_metadata"
  | "assistant_output"
  | "memory_write"
  | "audit_write";

export class SensitiveContentError extends Error {
  readonly boundary: SensitiveBoundary;
  readonly result: ValidationResult & { ok: false };

  constructor(
    boundary: SensitiveBoundary,
    result: ValidationResult & { ok: false },
  ) {
    super(
      `Sensitive content blocked at boundary "${boundary}": ${result.reason}`,
    );
    this.name = "SensitiveContentError";
    this.boundary = boundary;
    this.result = result;
  }
}

export class SensitiveContentGate {
  validate(value: unknown, boundary: SensitiveBoundary): void {
    const issues = inspectForSensitiveContent(value).map<ValidationIssue>(
      (issue) => ({
        ...issue,
        code: `${boundary}:${issue.code}`,
      }),
    );

    if (issues.length === 0) {
      return;
    }

    throw new SensitiveContentError(boundary, {
      ok: false,
      reason: `${issues.length} sensitive content issue(s) found`,
      details: issues,
    });
  }

  safeValidate(value: unknown, boundary: SensitiveBoundary): ValidationResult {
    try {
      this.validate(value, boundary);
      return { ok: true };
    } catch (error) {
      if (error instanceof SensitiveContentError) {
        return error.result;
      }

      return {
        ok: false,
        reason: "Unexpected sensitive content validation error",
        details: [
          {
            path: [],
            message: String(error),
            code: `${boundary}:unexpected`,
          },
        ],
      };
    }
  }
}
