import type { McpServerId } from "./core";

// ─── Health Types ─────────────────────────────────────────────────────────────

export type ServerHealthStatus = "healthy" | "degraded" | "unavailable";

/**
 * Health report for a single MCP server.
 * Written to memory MCP under key: agent:v1:health_status:<serverId>
 */
export interface ServerHealthReport {
  readonly serverId: McpServerId;
  readonly status: ServerHealthStatus;
  /**
   * Latency of the last successful ping in milliseconds.
   * -1 when status is "unavailable".
   */
  readonly latencyMs: number;
  readonly checkedAt: string; // ISO 8601
  readonly consecutiveFailures: number;
  readonly schemaVersion: "v1";
}

/**
 * Aggregated pre-flight report for a set of required servers.
 * Used by the router to gate skill dispatch.
 */
export interface PreFlightReport {
  readonly allHealthy: boolean;
  readonly reports: ReadonlyArray<ServerHealthReport>;
  readonly unavailableServers: ReadonlyArray<McpServerId>;
  readonly checkedAt: string; // ISO 8601
}

// ─── Circuit-Breaker Config ───────────────────────────────────────────────────

export interface CircuitBreakerConfig {
  /** Number of consecutive failures before tripping to "unavailable" */
  readonly failureThreshold: number;
  /** Milliseconds to wait before attempting a single test probe  */
  readonly recoveryWindowMs: number;
  /** Timeout for a single ping attempt */
  readonly pingTimeoutMs: number;
}

export const DEFAULT_CIRCUIT_BREAKER: CircuitBreakerConfig = {
  failureThreshold: 3,
  recoveryWindowMs: 30_000,
  pingTimeoutMs: 5_000,
} as const;
