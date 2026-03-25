import { BaseAgentPool, AGENT_POOL_IDS, type McpClient } from "./agent-pool";
import { MCP } from "../constants/mcp-servers";

/**
 * Notification Agent
 * Allowed servers: resend ONLY
 * Skills: send-notification
 *
 * The most constrained agent — one server, one skill category, no exceptions.
 * Destructive (sends real emails) — always check intent.dryRun before dispatch.
 */
export class NotificationAgent extends BaseAgentPool {
  constructor(mcpClient: McpClient) {
    super(AGENT_POOL_IDS.NOTIFICATION, [MCP.RESEND], mcpClient);
  }
}
