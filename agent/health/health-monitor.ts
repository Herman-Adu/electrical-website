import type { McpServerId } from "../types/core.ts";
import type {
  CircuitBreakerConfig,
  PreFlightReport,
  ServerHealthReport,
  ServerHealthStatus,
} from "../types/health.ts";
import { DEFAULT_CIRCUIT_BREAKER } from "../types/health.ts";

// ─── Ping Function Contract ───────────────────────────────────────────────────

/**
 * A ping function is injected at construction time.
 * It attempts to call a lightweight no-op tool on the target MCP server.
 * Returns latencyMs on success, throws on failure.
 */
export type PingFn = (
  serverId: McpServerId,
  timeoutMs: number,
) => Promise<number>;

// ─── Circuit State ────────────────────────────────────────────────────────────

interface CircuitState {
  status: ServerHealthStatus;
  consecutiveFailures: number;
  lastCheckedAt: string;
  lastLatencyMs: number;
  /**
   * When the circuit was tripped to unavailable.
   * Used to decide when to attempt recovery probes.
   */
  trippedAt: string | null;
}

// ─── Health Monitor ───────────────────────────────────────────────────────────

/**
 * HealthMonitor maintains a circuit-breaker per MCP server.
 *
 * State transitions:
 *   healthy  → degraded      after 1 failure
 *   degraded → unavailable   after `failureThreshold` consecutive failures
 *   unavailable → healthy    after a successful probe during recovery window
 *
 * - Does NOT call the memory MCP directly; the orchestrator reads state and
 *   writes health_status entries to memory after each pre-flight check.
 * - All public methods are safe to call concurrently.
 */
export class HealthMonitor {
  readonly #config: CircuitBreakerConfig;
  readonly #ping: PingFn;
  readonly #state = new Map<McpServerId, CircuitState>();
  readonly #registeredServers: ReadonlyArray<McpServerId>;

  constructor(
    servers: ReadonlyArray<McpServerId>,
    ping: PingFn,
    config: CircuitBreakerConfig = DEFAULT_CIRCUIT_BREAKER,
  ) {
    this.#registeredServers = servers;
    this.#ping = ping;
    this.#config = config;

    const now = new Date().toISOString();
    for (const serverId of servers) {
      this.#state.set(serverId, {
        status: "healthy",
        consecutiveFailures: 0,
        lastCheckedAt: now,
        lastLatencyMs: -1,
        trippedAt: null,
      });
    }
  }

  /**
   * Check a single server. Updates internal circuit state.
   */
  async check(serverId: McpServerId): Promise<ServerHealthReport> {
    const state = this.#getState(serverId);
    const now = new Date().toISOString();

    // If unavailable, only probe if the recovery window has elapsed
    if (state.status === "unavailable" && state.trippedAt !== null) {
      const elapsed = Date.now() - new Date(state.trippedAt).getTime();
      if (elapsed < this.#config.recoveryWindowMs) {
        // Still in cooldown — return cached state without pinging
        return this.#toReport(serverId, state);
      }
    }

    try {
      const latencyMs = await this.#ping(serverId, this.#config.pingTimeoutMs);
      // Success — reset circuit
      const next: CircuitState = {
        status: "healthy",
        consecutiveFailures: 0,
        lastCheckedAt: now,
        lastLatencyMs: latencyMs,
        trippedAt: null,
      };
      this.#state.set(serverId, next);
      return this.#toReport(serverId, next);
    } catch {
      const failures = state.consecutiveFailures + 1;
      const tripped = failures >= this.#config.failureThreshold;
      const status: ServerHealthStatus = tripped ? "unavailable" : "degraded";
      const next: CircuitState = {
        status,
        consecutiveFailures: failures,
        lastCheckedAt: now,
        lastLatencyMs: -1,
        trippedAt: tripped ? (state.trippedAt ?? now) : null,
      };
      this.#state.set(serverId, next);
      return this.#toReport(serverId, next);
    }
  }

  /**
   * Run pre-flight checks for a specific set of required servers.
   * Used by the router before dispatching a skill.
   */
  async preFlight(
    requiredServers: ReadonlyArray<McpServerId>,
  ): Promise<PreFlightReport> {
    const reports = await Promise.all(
      requiredServers.map((id) => this.check(id)),
    );
    const unavailableServers = reports
      .filter((r) => r.status === "unavailable")
      .map((r) => r.serverId);

    return {
      allHealthy: unavailableServers.length === 0,
      reports,
      unavailableServers,
      checkedAt: new Date().toISOString(),
    };
  }

  /**
   * Run pre-flight checks for ALL registered servers.
   * Called once at orchestrator startup.
   */
  async preFlightAll(): Promise<PreFlightReport> {
    return this.preFlight(this.#registeredServers);
  }

  /**
   * Return cached status without pinging. Used for fast reads.
   */
  getCachedReport(serverId: McpServerId): ServerHealthReport {
    return this.#toReport(serverId, this.#getState(serverId));
  }

  /**
   * Returns all currently registered server IDs.
   */
  get registeredServers(): ReadonlyArray<McpServerId> {
    return this.#registeredServers;
  }

  // ─── Private Helpers ───────────────────────────────────────────────────────

  #getState(serverId: McpServerId): CircuitState {
    const state = this.#state.get(serverId);
    if (!state) {
      throw new Error(`HealthMonitor: server "${serverId}" is not registered.`);
    }
    return state;
  }

  #toReport(serverId: McpServerId, state: CircuitState): ServerHealthReport {
    return {
      serverId,
      status: state.status,
      latencyMs: state.lastLatencyMs,
      checkedAt: state.lastCheckedAt,
      consecutiveFailures: state.consecutiveFailures,
      schemaVersion: "v1",
    };
  }
}
