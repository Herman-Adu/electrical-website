// ---------------------------------------------------------------------------
// Shared types for server actions
// ---------------------------------------------------------------------------
// Extracted from "use server" files to comply with Next.js 16 which enforces
// that "use server" modules only export async functions. All non-function
// exports (types, interfaces, constants) must live in separate files.
// Pattern: A9 -> A10 -> CQ13 (code-review-log.ts)
// ---------------------------------------------------------------------------

// -- Generic action result (used by quotation-request & service-request) -----

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

// -- Contact request --------------------------------------------------------

export interface ContactSubmissionResult {
  success: boolean;
  referenceId?: string;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export interface ContactFormActionState {
  success: boolean;
  referenceId?: string;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

// -- Quotation request ------------------------------------------------------

export interface QuotationSubmissionResult {
  success: boolean;
  requestId?: string;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export interface QuotationFormActionState {
  success: boolean;
  requestId?: string;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

// -- Email admin ------------------------------------------------------------

export interface EnvVarStatus {
  key: string;
  label: string;
  description: string;
  isSet: boolean;
  preview: string;
  required: boolean;
  secret: boolean;
  fallback?: string;
}

export interface ResendHealth {
  connected: boolean;
  error?: string;
  domainVerified?: boolean;
}

export interface EmailHealthReport {
  envVars: EnvVarStatus[];
  resend: ResendHealth;
  timestamp: string;
}

export interface TestSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// -- Render email -----------------------------------------------------------

export type EmailTemplate =
  | "service-customer"
  | "service-business"
  | "contact-customer"
  | "contact-business"
  | "quotation-customer"
  | "quotation-business";

// -- Security audit ---------------------------------------------------------

export type SecurityStatus = "pass" | "warn" | "fail";
export type CheckType = "runtime" | "static";

export interface SecurityCheck {
  id: string;
  category:
    | "rate-limiting"
    | "csrf"
    | "sanitization"
    | "validation"
    | "email"
    | "honeypot"
    | "error-handling"
    | "env-security";
  label: string;
  description: string;
  status: SecurityStatus;
  detail: string;
  recommendation?: string;
  checkType: CheckType;
}

export interface SecurityAuditResult {
  timestamp: string;
  overallStatus: SecurityStatus;
  passCount: number;
  warnCount: number;
  failCount: number;
  totalChecks: number;
  checks: SecurityCheck[];
  score: number;
}
