import type { McpServerId } from "../types/core.ts";

/**
 * Typed constants for every MCP server in the Docker gateway.
 * These are the ONLY valid McpServerId values in the system.
 *
 * Adding a new server:
 * 1. Add a constant here
 * 2. Register it in agent/health/health-monitor instantiation
 * 3. Assign it to at least one AgentPool in agents/
 */

function id(s: string): McpServerId {
  return s as McpServerId;
}

export const MCP = {
  GITHUB: id("github-official"),
  PLAYWRIGHT: id("playwright-mcp-server"),
  SEQUENTIAL_THINKING: id("sequentialthinking"),
  MEMORY: id("memory"),
  RESEND: id("resend"),
  AST_GREP: id("ast-grep"),
  FETCH: id("fetch"),
  WIKIPEDIA: id("wikipedia-mcp"),
  YOUTUBE: id("youtube_transcript"),
  NEXT_DEVTOOLS: id("next-devtools-mcp"),
  CONTEXT7: id("context7"),
  EXCALIDRAW: id("excalidraw-remote"),
} as const satisfies Record<string, McpServerId>;

/** Ordered list of all registered MCP servers — used by HealthMonitor */
export const ALL_MCP_SERVERS: ReadonlyArray<McpServerId> = Object.values(MCP);
