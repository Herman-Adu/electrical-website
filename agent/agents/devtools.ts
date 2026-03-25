import { BaseAgentPool, AGENT_POOL_IDS, type McpClient } from "./agent-pool";
import { MCP } from "../constants/mcp-servers";

/**
 * Devtools Agent
 * Allowed servers: next-devtools-mcp, context7
 * Skills: Next.js runtime diagnostics, library documentation lookups
 */
export class DevtoolsAgent extends BaseAgentPool {
  constructor(mcpClient: McpClient) {
    super(
      AGENT_POOL_IDS.DEVTOOLS,
      [MCP.NEXT_DEVTOOLS, MCP.CONTEXT7],
      mcpClient,
    );
  }
}
