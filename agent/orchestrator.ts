import { randomUUID } from "node:crypto";
import type {
  AgentIntent,
  AgentOutput,
  IntentCategory,
  McpServerId,
  TokenCostTier,
} from "./types/core.ts";
import { ScopeViolationError } from "./types/agent";
import { ValidationError } from "./types/audit";
import { skillRegistry } from "./registry/index";
import { registerAllSkills } from "./skills/index";
import { HealthMonitor } from "./health/health-monitor";
import type { PingFn } from "./health/health-monitor.ts";
import { HeuristicEngine } from "./heuristics/heuristic-engine";
import { MemoryHeuristicStore } from "./heuristics/memory-heuristic-store";
import { ToolRouter } from "./router/tool-router";
import { RoutingError } from "./router/tool-router";
import { ValidationGate, hashIntent } from "./gates/validation-gate";
import { AuditLogger, MemoryAuditStore } from "./audit/audit-logger";
import {
  CodeIntelligenceAgent,
  BrowserAgent,
  ReasoningAgent,
  NotificationAgent,
  ContentAgent,
  DevtoolsAgent,
  AGENT_POOL_IDS,
} from "./agents/index";
import type { McpClient } from "./agents/agent-pool.ts";
import { ALL_MCP_SERVERS, MCP } from "./constants/mcp-servers";
import type { PreFlightReport } from "./types/health.ts";

// ─── Orchestrator Config ──────────────────────────────────────────────────────

export interface OrchestratorConfig {
  /**
   * The MCP client adapter — wraps Docker MCP gateway calls.
   * Injected externally; never hardcoded or secret-embedded.
   */
  mcpClient: McpClient;
  /**
   * Ping function for health monitor.
   * The default implementation calls a lightweight tool on the target server.
   */
  pingFn?: PingFn;
}

// ─── Orchestrator ─────────────────────────────────────────────────────────────

/**
 * Orchestrator — the top-level entry point for the agent skill system.
 *
 * Startup sequence:
 * 1. Register all skills into the global registry
 * 2. Boot HealthMonitor, HeuristicEngine, ValidationGate, AuditLogger
 * 3. Instantiate all sub-agent pools with the injected McpClient
 * 4. Wire ToolRouter with all pools
 * 5. Run pre-flight health check on all MCP servers
 *
 * Public interface:
 * - run(category, description, input, opts?) — full routing + execution + audit
 * - healthCheck() — run pre-flight on all servers and return report
 * - auditQuery(filter?) — query the audit trail
 */
export class Orchestrator {
  readonly #router: ToolRouter;
  readonly #validation: ValidationGate;
  readonly #audit: AuditLogger;
  readonly #health: HealthMonitor;
  readonly #heuristics: HeuristicEngine;
  #started = false;

  private constructor(
    router: ToolRouter,
    validation: ValidationGate,
    audit: AuditLogger,
    health: HealthMonitor,
    heuristics: HeuristicEngine,
  ) {
    this.#router = router;
    this.#validation = validation;
    this.#audit = audit;
    this.#health = health;
    this.#heuristics = heuristics;
  }

  /**
   * Factory — creates and boots an Orchestrator instance.
   * Returns only after the startup health check completes.
   */
  static async create(config: OrchestratorConfig): Promise<Orchestrator> {
    const { mcpClient } = config;

    // Step 1: Register all skills
    registerAllSkills();

    // Step 2: Boot subsystems
    const pingFn: PingFn =
      config.pingFn ??
      (async (serverId: McpServerId, timeoutMs: number) => {
        const start = Date.now();
        // Use a lightweight list/describe tool as the ping probe
        await Promise.race([
          mcpClient(serverId, "ping", {}),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("ping timeout")), timeoutMs),
          ),
        ]);
        return Date.now() - start;
      });

    const health = new HealthMonitor(ALL_MCP_SERVERS, pingFn);

    const heuristicStore = new MemoryHeuristicStore(mcpClient);
    const heuristics = new HeuristicEngine(heuristicStore);

    const validation = new ValidationGate();
    const auditStore = new MemoryAuditStore(mcpClient);
    const audit = new AuditLogger(auditStore);

    // Step 3: Instantiate sub-agent pools
    // The health monitor is wired via the orchestrator's MCP intercept (see below)
    const healthInterceptedClient = buildHealthInterceptedClient(
      mcpClient,
      health,
    );

    const pools = [
      new CodeIntelligenceAgent(healthInterceptedClient),
      new BrowserAgent(healthInterceptedClient),
      new ReasoningAgent(healthInterceptedClient),
      new NotificationAgent(healthInterceptedClient),
      new ContentAgent(healthInterceptedClient),
      new DevtoolsAgent(healthInterceptedClient),
    ];

    // Step 4: Wire router
    const router = new ToolRouter(skillRegistry, heuristics, health, pools);

    const orchestrator = new Orchestrator(
      router,
      validation,
      audit,
      health,
      heuristics,
    );

    // Step 5: Startup pre-flight (non-blocking on degraded servers — logs warning)
    const preFlightReport = await health.preFlightAll();
    orchestrator.#started = true;

    if (!preFlightReport.allHealthy) {
      console.warn(
        "[Orchestrator] Some MCP servers are unavailable at startup:",
        preFlightReport.unavailableServers,
      );
    }

    return orchestrator;
  }

  // ─── Public API ────────────────────────────────────────────────────────────

  /**
   * Route and execute an agent intent.
   *
   * @param category - The intent category (drives skill eligibility)
   * @param description - Human-readable description (used by fitness functions)
   * @param input - Skill-specific input (validated by outputSchema)
   * @param opts.costCap - Max cost tier (default: "expensive")
   * @param opts.dryRun - If true, destructive skills are skipped (default: false)
   */
  async run<TOutput = unknown>(
    category: IntentCategory,
    description: string,
    input: unknown,
    opts: {
      costCap?: TokenCostTier;
      dryRun?: boolean;
      metadata?: Record<string, unknown>;
    } = {},
  ): Promise<AgentOutput<TOutput>> {
    if (!this.#started)
      throw new Error("Orchestrator not started. Call Orchestrator.create().");

    const intent: AgentIntent = {
      id: randomUUID(),
      category,
      description,
      costCap: opts.costCap ?? "expensive",
      dryRun: opts.dryRun ?? false,
      metadata: opts.metadata ?? {},
    };

    const intentHash = hashIntent(intent);
    const start = Date.now();

    try {
      const output = await this.#router.route<TOutput>(intent, input);

      // Validate after execution — hard stop on failure
      const skill = skillRegistry.getOrThrow(output.skillId);
      this.#validation.validate(output as AgentOutput, skill, intent);

      await this.#audit.log({
        skillId: output.skillId,
        agentPoolId: output.agentPoolId,
        costTier: skill.costTier,
        dryRun: output.dryRun,
        intentHash,
        outcome: "success",
        validationResult: { ok: true },
        latencyMs: Date.now() - start,
      });

      return output;
    } catch (err) {
      const latencyMs = Date.now() - start;

      if (err instanceof ValidationError) {
        await this.#audit.log({
          skillId: err.skillId,
          agentPoolId: AGENT_POOL_IDS.ORCHESTRATOR,
          costTier: "cheap",
          dryRun: intent.dryRun,
          intentHash,
          outcome: "validation_failure",
          validationResult: err.result,
          latencyMs,
        });
        throw err;
      }

      if (err instanceof ScopeViolationError) {
        await this.#audit.log({
          skillId: err.skillId,
          agentPoolId: err.agentPoolId,
          costTier: "cheap",
          dryRun: intent.dryRun,
          intentHash,
          outcome: "scope_violation",
          validationResult: {
            ok: false,
            reason: err.message,
            details: [
              { path: [], message: err.message, code: "scope_violation" },
            ],
          },
          latencyMs,
        });
        throw err;
      }

      if (err instanceof RoutingError) {
        const outcome =
          err.detail.kind === "servers_unavailable"
            ? "server_unavailable"
            : "validation_failure";
        await this.#audit.log({
          skillId: "" as ReturnType<typeof skillRegistry.getOrThrow>["id"],
          agentPoolId: AGENT_POOL_IDS.ORCHESTRATOR,
          costTier: "cheap",
          dryRun: intent.dryRun,
          intentHash,
          outcome,
          validationResult: {
            ok: false,
            reason: err.message,
            details: [
              { path: [], message: err.message, code: err.detail.kind },
            ],
          },
          latencyMs,
        });
        throw err;
      }

      throw err;
    }
  }

  /**
   * Run a health check across all MCP servers.
   */
  async healthCheck(): Promise<PreFlightReport> {
    return this.#health.preFlightAll();
  }

  /**
   * Query the audit trail.
   */
  async auditQuery(filter: Parameters<AuditLogger["query"]>[0] = {}) {
    return this.#audit.query(filter);
  }

  /**
   * Inspect the current heuristic snapshot — useful for debugging and observability.
   */
  async heuristicSnapshot() {
    return this.#heuristics.currentSnapshot();
  }

  /**
   * Preview routing candidates for a given intent without executing.
   */
  async previewRouting(
    category: IntentCategory,
    description: string,
    opts: { costCap?: TokenCostTier } = {},
  ) {
    const intent: AgentIntent = {
      id: randomUUID(),
      category,
      description,
      costCap: opts.costCap ?? "expensive",
      dryRun: true,
      metadata: {},
    };
    return this.#router.preview(intent);
  }
}

// ─── Health Intercept ─────────────────────────────────────────────────────────

/**
 * Wraps the MCP client to intercept calls to the sentinel "__health_monitor"
 * server and route them to the HealthMonitor instead.
 * This is how the health-check skill (which has no requiredServers) works.
 */
function buildHealthInterceptedClient(
  mcpClient: McpClient,
  health: HealthMonitor,
): McpClient {
  return async <T>(
    serverId: McpServerId,
    tool: string,
    args: unknown,
  ): Promise<T> => {
    if (
      serverId === ("__health_monitor" as McpServerId) &&
      tool === "preFlight"
    ) {
      const { serverIds } = args as { serverIds: McpServerId[] };
      const report = await health.preFlight(serverIds);
      return report as T;
    }
    return mcpClient<T>(serverId, tool, args);
  };
}
