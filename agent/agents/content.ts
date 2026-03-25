import { BaseAgentPool, AGENT_POOL_IDS, type McpClient } from "./agent-pool";
import { MCP } from "../constants/mcp-servers";

/**
 * Content Agent
 * Allowed servers: fetch, wikipedia-mcp, youtube_transcript
 * Skills: content-research (future), general web content tasks
 *
 * Read-only agent — all three allowed servers are read operations.
 */
export class ContentAgent extends BaseAgentPool {
  constructor(mcpClient: McpClient) {
    super(
      AGENT_POOL_IDS.CONTENT,
      [MCP.FETCH, MCP.WIKIPEDIA, MCP.YOUTUBE],
      mcpClient,
    );
  }
}
