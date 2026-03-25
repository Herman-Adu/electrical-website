import { BaseAgentPool, AGENT_POOL_IDS, type McpClient } from "./agent-pool";
import { MCP } from "../constants/mcp-servers";

/**
 * Browser Agent
 * Allowed servers: playwright-mcp-server ONLY
 * Skills: browser-testing
 *
 * Strict single-server allocation — deliberately cannot call any other server.
 */
export class BrowserAgent extends BaseAgentPool {
  constructor(mcpClient: McpClient) {
    super(AGENT_POOL_IDS.BROWSER, [MCP.PLAYWRIGHT], mcpClient);
  }
}
