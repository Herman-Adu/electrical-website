import { BaseAgentPool, AGENT_POOL_IDS, type McpClient } from "./agent-pool";
import { MCP } from "../constants/mcp-servers";

/**
 * Reasoning Agent
 * Allowed servers: sequentialthinking, memory
 * Skills: reasoning-chain
 *
 * Responsible for chain-of-thought analysis and persisting learned conclusions.
 */
export class ReasoningAgent extends BaseAgentPool {
  constructor(mcpClient: McpClient) {
    super(
      AGENT_POOL_IDS.REASONING,
      [MCP.SEQUENTIAL_THINKING, MCP.MEMORY],
      mcpClient,
    );
  }
}
