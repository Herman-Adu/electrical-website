import type { ValidationIssue } from "../types/audit";

const PATH_FIELD_NAMES = new Set([
  "filePath",
  "path",
  "paths",
  "uri",
  "resourcePath",
  "cwd",
]);

const SENSITIVE_PATH_PATTERNS = [
  /(^|[\\/])\.env(\.[^\\/]+)?$/i,
  /(^|[\\/])\.npmrc$/i,
  /(^|[\\/])\.pypirc$/i,
  /(^|[\\/])id_(rsa|ed25519)$/i,
  /\.(pem|key|p12|pfx)$/i,
  /(^|[\\/])credentials(\.json)?$/i,
] as const;

const SECRET_KEY_NAME =
  /(secret|token|api[_-]?key|password|passwd|private[_-]?key|client[_-]?secret|connectionstring)/i;

const SECRET_VALUE_PATTERNS = [
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  /\bgh[pousr]_[A-Za-z0-9_]{20,}\b/,
  /\bgithub_pat_[A-Za-z0-9_]{20,}\b/,
  /\b(?:sk|rk)_(?:live|test)_[A-Za-z0-9]{16,}\b/,
  /\bre_[A-Za-z0-9_-]{10,}\b/,
] as const;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function looksLikeSensitivePath(value: string): boolean {
  return SENSITIVE_PATH_PATTERNS.some((pattern) => pattern.test(value.trim()));
}

function countEnvAssignments(value: string): number {
  const matches = value.match(
    /^\s*(?:export\s+)?[A-Z][A-Z0-9_]{2,}\s*=\s*.+$/gm,
  );
  return matches?.length ?? 0;
}

function looksLikeVariableNameOnly(value: string): boolean {
  return /^[A-Z][A-Z0-9_]{1,}$/.test(value.trim());
}

function inspectString(
  value: string,
  path: ReadonlyArray<string | number>,
  issues: ValidationIssue[],
): void {
  const lastSegment = path[path.length - 1];
  const fieldName = typeof lastSegment === "string" ? lastSegment : undefined;

  if (
    fieldName !== undefined &&
    PATH_FIELD_NAMES.has(fieldName) &&
    looksLikeSensitivePath(value)
  ) {
    issues.push({
      path,
      message: `Restricted path reference detected for sensitive file "${value.trim()}"`,
      code: "restricted_path",
    });
  }

  if (countEnvAssignments(value) >= 2) {
    issues.push({
      path,
      message: "Secret-bearing environment file content detected",
      code: "env_file_content",
    });
  }

  for (const pattern of SECRET_VALUE_PATTERNS) {
    if (pattern.test(value)) {
      issues.push({
        path,
        message: "Secret-like token material detected",
        code: "secret_token_pattern",
      });
      break;
    }
  }

  if (
    fieldName !== undefined &&
    SECRET_KEY_NAME.test(fieldName) &&
    value.trim().length > 0 &&
    !looksLikeVariableNameOnly(value)
  ) {
    issues.push({
      path,
      message: `Sensitive value detected in field "${fieldName}"`,
      code: "sensitive_field_value",
    });
  }
}

function inspectValue(
  value: unknown,
  path: ReadonlyArray<string | number>,
  issues: ValidationIssue[],
  seen: WeakSet<object>,
  depth: number,
): void {
  if (depth > 8) {
    return;
  }

  if (typeof value === "string") {
    inspectString(value, path, issues);
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      inspectValue(item, [...path, index], issues, seen, depth + 1);
    });
    return;
  }

  if (!isPlainObject(value)) {
    return;
  }

  if (seen.has(value)) {
    return;
  }
  seen.add(value);

  for (const [key, nested] of Object.entries(value)) {
    inspectValue(nested, [...path, key], issues, seen, depth + 1);
  }
}

export function inspectForSensitiveContent(value: unknown): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const seen = new WeakSet<object>();
  inspectValue(value, [], issues, seen, 0);
  return issues;
}

export function hasSensitiveContent(value: unknown): boolean {
  return inspectForSensitiveContent(value).length > 0;
}
