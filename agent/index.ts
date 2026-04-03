/**
 * @electrical-website/agent
 * MCP Orchestration Runtime — public API
 *
 * Primary entry point: Orchestrator.create(config)
 */

// Top-level orchestrator
export { Orchestrator } from "./orchestrator";
export type {
  OrchestratorConfig,
  ProductionSkillAuditOptions,
  ProductionSkillAuditResult,
} from "./orchestrator.ts";

// Types
export type {
  AgentIntent,
  AgentOutput,
  AgentPool,
  AgentPoolId,
  AuditEvent,
  AuditOutcome,
  HeuristicSnapshot,
  IntentCategory,
  McpServerId,
  OutcomeObservation,
  PreFlightReport,
  ScoredSkill,
  ServerHealthReport,
  SkillId,
  SkillManifest,
  TokenCostTier,
  ValidationResult,
} from "./types/index.ts";

// Errors
export { ScopeViolationError } from "./types/agent";
export { ValidationError } from "./types/audit";
export { RoutingError } from "./router/tool-router";
export { SensitiveContentError } from "./gates/sensitive-content-gate";

// Constants (for external consumers that need typed IDs)
export { MCP, ALL_MCP_SERVERS } from "./constants/mcp-servers";
export { SKILLS } from "./constants/skill-ids";
export { AGENT_POOL_IDS } from "./agents/agent-pool";

// Skills (re-exported for external registration)
export {
  codeSearchSkill,
  browserTestSkill,
  githubActionsSkill,
  sendNotificationSkill,
  reasoningChainSkill,
  healthCheckSkill,
  nextjsAgentSetupSkill,
  skillBuilderSkill,
} from "./skills/index";
