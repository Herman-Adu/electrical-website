/**
 * MCP Type Definitions
 */

export type MCPClientFunction = (
  serverId: string,
  tool: string,
  args?: Record<string, unknown>,
) => Promise<unknown>;

export type MCPClientPingFunction = (
  serverId: string,
  timeoutMs: number,
) => Promise<number>; // Returns latency in ms

export interface MCPConfig {
  client: MCPClientFunction;
  ping: MCPClientPingFunction;
}
