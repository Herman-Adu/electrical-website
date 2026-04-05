import { BaseAgentPool, AGENT_POOL_IDS, type McpClient } from "./agent-pool";
import { MCP } from "../constants/mcp-servers";

/**
 * Browser Agent
 * Allowed servers: playwright-mcp-server + executor-playwright
 * Skills: browser-testing
 *
 * Both Playwright servers are allowed; routing is decided inside browser-testing.skill.ts
 * via resolveMode(): inspect → MCP.PLAYWRIGHT, workflow → MCP.EXECUTOR_PLAYWRIGHT.
 */
export class BrowserAgent extends BaseAgentPool {
  constructor(mcpClient: McpClient) {
    super(
      AGENT_POOL_IDS.BROWSER,
      [MCP.PLAYWRIGHT, MCP.EXECUTOR_PLAYWRIGHT],
      mcpClient,
    );
  }
}
