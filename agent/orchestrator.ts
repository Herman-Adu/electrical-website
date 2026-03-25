import { randomUUID } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
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
import type { SkillBuilderOutput } from "./skills/skill-builder.skill";
import type { SkillManifest } from "./types/skill";
import type { HeuristicSnapshot } from "./types/heuristics";

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

export interface ProductionSkillAuditOptions {
  dryRun?: boolean;
  persistObservation?: boolean;
}

export interface ProductionSkillAuditResult {
  audit: AgentOutput<SkillBuilderOutput>;
  optimise: AgentOutput<SkillBuilderOutput>;
  skillCount: number;
  generatedAt: string;
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

  async #buildSkillBuilderMetadata(snapshot: HeuristicSnapshot | null): Promise<
    Array<{
      id: string;
      version: string;
      costTier: "cheap" | "medium" | "expensive";
      dryRunCapable: boolean;
      requiredServers: string[];
      hasPlaybook: boolean;
      registeredInIndex: boolean;
      registeredInConstants: boolean;
      assignedToPool?: string;
      hasFitnessSignal: boolean;
      avgLatencyMs?: number;
      successRate?: number;
    }>
  > {
    const skills = skillRegistry.all();

    const cwd = process.cwd();
    const rootPath = existsSync(resolve(cwd, ".github"))
      ? cwd
      : resolve(cwd, "..");

    const constantsPath = resolve(rootPath, "agent/constants/skill-ids.ts");
    const indexPath = resolve(rootPath, "agent/skills/index.ts");
    const constantsContent = existsSync(constantsPath)
      ? readFileSync(constantsPath, "utf8")
      : "";
    const indexContent = existsSync(indexPath)
      ? readFileSync(indexPath, "utf8")
      : "";

    return skills.map((skill) => {
      const playbookPath = resolve(
        rootPath,
        `.github/skills/${skill.id}/SKILL.md`,
      );

      const weight = snapshot?.weights[skill.id];

      const hasFitnessSignal = this.#hasFitnessSignal(skill);

      return {
        id: skill.id,
        version: skill.version,
        costTier: skill.costTier,
        dryRunCapable: skill.dryRunCapable,
        requiredServers: [...skill.requiredServers],
        hasPlaybook: existsSync(playbookPath),
        registeredInIndex:
          indexContent.includes(`\"${skill.id}.skill\"`) ||
          indexContent.includes(`'${skill.id}.skill'`),
        registeredInConstants:
          constantsContent.includes(`\"${skill.id}\"`) ||
          constantsContent.includes(`'${skill.id}'`),
        assignedToPool: this.#resolvePoolForRequiredServers(
          skill.requiredServers,
        ),
        hasFitnessSignal,
        avgLatencyMs: weight?.avgLatencyMs,
        successRate: weight?.successRate,
      };
    });
  }

  #hasFitnessSignal(skill: SkillManifest): boolean {
    const categories: IntentCategory[] = [
      "code-analysis",
      "browser-test",
      "github-action",
      "notification",
      "reasoning",
      "content-research",
      "devtools",
      "health-check",
      "project-setup",
      "skill-authoring",
    ];

    return categories.some(
      (category) =>
        skill.fitness({
          id: "audit-preview",
          category,
          description: `production audit probe for ${skill.id}`,
          costCap: "expensive",
          dryRun: true,
          metadata: {},
        }) > 0,
    );
  }

  #resolvePoolForRequiredServers(
    requiredServers: ReadonlyArray<McpServerId>,
  ): string | undefined {
    if (requiredServers.length === 0) {
      return AGENT_POOL_IDS.ORCHESTRATOR;
    }

    const poolCapabilities = [
      {
        id: AGENT_POOL_IDS.CODE_INTELLIGENCE,
        allowed: [MCP.AST_GREP, MCP.GITHUB],
      },
      {
        id: AGENT_POOL_IDS.BROWSER,
        allowed: [MCP.PLAYWRIGHT],
      },
      {
        id: AGENT_POOL_IDS.REASONING,
        allowed: [MCP.SEQUENTIAL_THINKING, MCP.MEMORY],
      },
      {
        id: AGENT_POOL_IDS.NOTIFICATION,
        allowed: [MCP.RESEND],
      },
      {
        id: AGENT_POOL_IDS.CONTENT,
        allowed: [MCP.FETCH, MCP.WIKIPEDIA, MCP.YOUTUBE],
      },
      {
        id: AGENT_POOL_IDS.DEVTOOLS,
        allowed: [MCP.NEXT_DEVTOOLS, MCP.CONTEXT7],
      },
    ] as const;

    const matches = poolCapabilities
      .filter((pool) =>
        requiredServers.every((serverId) => pool.allowed.includes(serverId)),
      )
      .sort((a, b) => a.allowed.length - b.allowed.length);

    return matches[0]?.id;
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

  /**
   * Run a one-command production skill audit.
   *
   * This method gathers audit inputs directly from live runtime state:
   * - current SkillRegistry manifests
   * - playbook/registration parity files on disk
   * - latest HeuristicEngine snapshot
   *
   * Then executes skill-builder in both "audit" and "optimise" modes.
   */
  async runProductionSkillAudit(
    opts: ProductionSkillAuditOptions = {},
  ): Promise<ProductionSkillAuditResult> {
    const snapshot = await this.#heuristics.currentSnapshot();
    const skillMetadata = await this.#buildSkillBuilderMetadata(snapshot);
    const heuristicSnapshot = Object.entries(snapshot?.weights ?? {}).map(
      ([skillId, weight]) => ({
        skillId,
        score: weight.successRate * weight.costAccuracy,
        observations: weight.sampleCount,
        avgLatencyMs: weight.avgLatencyMs,
      }),
    );

    const common = {
      dryRun: opts.dryRun ?? false,
      costCap: "medium" as TokenCostTier,
      metadata: { systemAudit: true },
    };

    const audit = await this.run<SkillBuilderOutput>(
      "skill-authoring",
      "Run production skill quality and parity audit",
      {
        mode: "audit",
        skillMetadata,
        persistObservation: opts.persistObservation ?? true,
      },
      common,
    );

    const optimise = await this.run<SkillBuilderOutput>(
      "skill-authoring",
      "Run production skill optimisation analysis",
      {
        mode: "optimise",
        skillMetadata,
        heuristicSnapshot,
        persistObservation: opts.persistObservation ?? true,
      },
      common,
    );

    return {
      audit,
      optimise,
      skillCount: skillMetadata.length,
      generatedAt: new Date().toISOString(),
    };
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
