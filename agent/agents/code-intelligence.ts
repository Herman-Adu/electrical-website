import { BaseAgentPool, AGENT_POOL_IDS, type McpClient } from "./agent-pool";
import { MCP } from "../constants/mcp-servers";

/**
 * Code Intelligence Agent
 * Allowed servers: ast-grep, github-official
 * Skills: code-search, github-actions (code analysis subset)
 */
export class CodeIntelligenceAgent extends BaseAgentPool {
  constructor(mcpClient: McpClient) {
    super(
      AGENT_POOL_IDS.CODE_INTELLIGENCE,
      [MCP.AST_GREP, MCP.GITHUB],
      mcpClient,
    );
  }
}
