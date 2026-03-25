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
} from "./core";

export type { AgentPool } from "./agent";
export { ScopeViolationError } from "./agent";

export type { SkillManifest, SkillRegistryEntry, ScoredSkill } from "./skill";

export type {
  HeuristicSnapshot,
  OutcomeObservation,
  SkillHeuristicWeight,
  SkillOutcome,
} from "./heuristics";

export type {
  AuditEvent,
  AuditOutcome,
  ValidationIssue,
  ValidationResult,
} from "./audit";
export { ValidationError } from "./audit";

export type {
  CircuitBreakerConfig,
  PreFlightReport,
  ServerHealthReport,
  ServerHealthStatus,
} from "./health";
export { DEFAULT_CIRCUIT_BREAKER } from "./health";
