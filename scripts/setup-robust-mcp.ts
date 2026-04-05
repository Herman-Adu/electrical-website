#!/usr/bin/env node

/**
 * Robust MCP Client Setup Example
 *
 * Usage: Pass this setup to Orchestrator.create()
 * Shows how to integrate the robust wrapper for production-grade error handling
 */

import { MCP_CANONICAL_ENTRIES } from "../agent/constants/mcp-canonical.ts";
import {
  createRobustMCPClient,
  createRobustMCPPing,
  createGatewayCallFunction,
} from "../agent/mcp/client-wrapper.ts";
import type { McpServerId } from "../agent/types/core.ts";

const GATEWAY = "http://127.0.0.1:3100";

// Step 1: Extract docker-gateway routes
const dockerEntries = MCP_CANONICAL_ENTRIES.filter(
  (e) => e.transport === "docker-gateway" && e.gatewayRoute,
);
const routeByServer = new Map(
  dockerEntries.map((e) => [e.serverId, e.gatewayRoute]),
);

// Step 2: Create raw gateway caller
const callGateway = createGatewayCallFunction(GATEWAY);

// Step 3: Create base MCP client (with retry capability built-in)
const baseClient = async (
  serverId: string,
  tool: string,
  args?: Record<string, unknown>,
) => {
  const route = routeByServer.get(serverId as McpServerId);
  if (!route) {
    throw new Error(`No docker-gateway route for serverId=${serverId}`);
  }
  return await callGateway(route, tool, args ?? {});
};

// Step 4: Wrap with robust error handling and retries
const mcpClient = createRobustMCPClient(baseClient, {
  maxRetries: 3,
  initialDelayMs: 100,
  maxDelayMs: 2000,
  allowFailOpen: false, // Set to true if you want graceful degradation
});

// Step 5: Create ping function with retry support
const basePing = async (
  serverId: string,
  timeoutMs: number,
): Promise<number> => {
  const route = routeByServer.get(serverId as McpServerId);
  if (!route) return 1;

  const started = Date.now();
  const probes: Array<[string, Record<string, unknown>]> =
    route === "/executor"
      ? [
          ["list_tools", {}],
          ["ping", {}],
        ]
      : [
          ["ping", {}],
          ["list_tools", {}],
        ];

  const runProbe = async () => {
    let lastErr;
    for (const [toolName, toolArgs] of probes) {
      try {
        await callGateway(route, toolName, toolArgs);
        return;
      } catch (err) {
        lastErr = err;
      }
    }
    throw lastErr ?? new Error(`All probes failed for ${route}`);
  };

  await Promise.race([
    runProbe(),
    new Promise((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error(`ping timeout for ${serverId} after ${timeoutMs}ms`),
          ),
        timeoutMs,
      ),
    ),
  ]);

  return Date.now() - started;
};

const pingFn = createRobustMCPPing(basePing, {
  maxRetries: 2,
  initialDelayMs: 50,
  maxDelayMs: 500,
});

// Export for use in orchestrator setup
export { mcpClient, pingFn };

// Example usage for testing
if (import.meta.main) {
  console.error("[Setup] Robust MCP client wrapper configured");
  console.error(`[Setup] Gateway: ${GATEWAY}`);
  console.error(
    `[Setup] Routes: ${Array.from(routeByServer.entries()).length} servers`,
  );
  console.error("[Setup] Retry policy: max 3 attempts, exponential backoff");
  console.error("[Setup] Ready for Orchestrator.create({mcpClient, pingFn})");
}
