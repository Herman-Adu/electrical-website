// ─── Public Type Surface ──────────────────────────────────────────────────────
// All agent system type contracts exported from a single barrel.
// Import from "agent/types" — never from individual type files.

export type {
  AgentIntent,
  AgentOutput,
  AgentPoolId,
  Brand,
  IntentCategory,
  McpServerId,
  SemVer,
  SkillContext,
  SkillId,
  TokenCostTier,
} from "./core.ts";

export type { AgentPool } from "./agent.ts";
export { ScopeViolationError } from "./agent.ts";

export type {
  SkillManifest,
  SkillRegistryEntry,
  ScoredSkill,
} from "./skill.ts";

export type {
  HeuristicSnapshot,
  OutcomeObservation,
  SkillHeuristicWeight,
  SkillOutcome,
} from "./heuristics.ts";

export type {
  AuditEvent,
  AuditOutcome,
  ValidationIssue,
  ValidationResult,
} from "./audit.ts";
export { ValidationError } from "./audit.ts";

export type {
  CircuitBreakerConfig,
  PreFlightReport,
  ServerHealthReport,
  ServerHealthStatus,
} from "./health.ts";
export { DEFAULT_CIRCUIT_BREAKER } from "./health.ts";
