#!/usr/bin/env node

/**
 * Robust MCP Contract Validation
 *
 * Tests memory MCP API endpoints with:
 * - JSON parsing recovery
 * - Retry logic with exponential backoff
 * - Comprehensive error logging
 * - Response validation
 */

import { MCP_CANONICAL_ENTRIES } from "../agent/constants/mcp-canonical.ts";
import {
  createRobustMCPClient,
  createGatewayCallFunction,
} from "../agent/mcp/client-wrapper.ts";
import type { McpServerId } from "../agent/types/core.ts";

const GATEWAY = "http://127.0.0.1:3100";

// Setup robust client
const dockerEntries = MCP_CANONICAL_ENTRIES.filter(
  (e) => e.transport === "docker-gateway" && e.gatewayRoute,
);
const routeByServer = new Map(
  dockerEntries.map((e) => [e.serverId, e.gatewayRoute]),
);

const callGateway = createGatewayCallFunction(GATEWAY);

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

const mcpClient = createRobustMCPClient(baseClient, {
  maxRetries: 3,
  initialDelayMs: 100,
  maxDelayMs: 2000,
  allowFailOpen: false,
});

async function validateContract(): Promise<void> {
  console.error(
    "[Contract] Starting memory MCP validation with robust client...\n",
  );

  const tests = [
    {
      name: "list_tools",
      tool: "list_tools",
      args: {},
      validate: (result: unknown) => {
        if (!Array.isArray(result)) {
          throw new Error(`Expected array, got ${typeof result}`);
        }
        console.error(`  ✓ Found ${(result as unknown[]).length} tools`);
      },
    },
    {
      name: "search_nodes",
      tool: "search_nodes",
      args: { query: "orchestrator" },
      validate: (result: unknown) => {
        if (typeof result !== "object" || result === null) {
          throw new Error(`Expected object, got ${typeof result}`);
        }
        console.error(`  ✓ Search returned results`);
      },
    },
    {
      name: "open_nodes",
      tool: "open_nodes",
      args: { names: ["agent:v1:orchestrator_routing_apr2026"] },
      validate: (result: unknown) => {
        if (typeof result !== "object" || result === null) {
          throw new Error(`Expected object, got ${typeof result}`);
        }
        console.error(`  ✓ Opened node successfully`);
      },
    },
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.error(`[Test] ${test.name}...`);
      const result = await mcpClient("memory-reference", test.tool, test.args);
      test.validate(result);
      passed++;
      console.error();
    } catch (err) {
      failed++;
      const message = err instanceof Error ? err.message : String(err);
      console.error(`  ✗ FAILED: ${message}\n`);
    }
  }

  console.error("=".repeat(70));
  console.error(`[Contract] Results: ${passed} passed, ${failed} failed`);

  if (failed > 0) {
    process.exit(1);
  }
}

validateContract().catch((err) => {
  console.error("[Contract] Fatal error:", err);
  process.exit(1);
});
