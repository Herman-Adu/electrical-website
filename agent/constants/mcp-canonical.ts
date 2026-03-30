import type { McpServerId } from "../types/core";
import { MCP } from "./mcp-servers";

export type CanonicalMcpConstant = Exclude<keyof typeof MCP, "HEALTH_MONITOR">;
export type McpCanonicalTransport = "docker-gateway" | "external";

export interface McpCanonicalEntry<
  K extends CanonicalMcpConstant = CanonicalMcpConstant,
> {
  readonly constant: K;
  readonly serverId: (typeof MCP)[K];
  readonly transport: McpCanonicalTransport;
  readonly dockerService?: string;
  readonly gatewayRoute?: `/${string}`;
  readonly smokeTool: string;
  readonly smokeArgs?: Readonly<Record<string, unknown>>;
}

function entry<K extends CanonicalMcpConstant>(
  constant: K,
  transport: McpCanonicalTransport,
  options: {
    dockerService?: string;
    gatewayRoute?: `/${string}`;
    smokeTool?: string;
    smokeArgs?: Readonly<Record<string, unknown>>;
  } = {},
): McpCanonicalEntry<K> {
  const withOptionalFields: Pick<
    McpCanonicalEntry<K>,
    "dockerService" | "gatewayRoute" | "smokeArgs"
  > = {
    ...(options.dockerService !== undefined
      ? { dockerService: options.dockerService }
      : {}),
    ...(options.gatewayRoute !== undefined
      ? { gatewayRoute: options.gatewayRoute }
      : {}),
    ...(options.smokeArgs !== undefined
      ? { smokeArgs: options.smokeArgs }
      : {}),
  };

  return {
    constant,
    serverId: MCP[constant],
    transport,
    smokeTool: options.smokeTool ?? "ping",
    ...withOptionalFields,
  };
}

export const MCP_CANONICAL_MAP = {
  GITHUB: entry("GITHUB", "docker-gateway", {
    dockerService: "github-official",
    gatewayRoute: "/github",
  }),
  OPENAPI_SCHEMA: entry("OPENAPI_SCHEMA", "docker-gateway", {
    dockerService: "openapi-schema",
    gatewayRoute: "/openapi",
  }),
  PLAYWRIGHT: entry("PLAYWRIGHT", "docker-gateway", {
    dockerService: "playwright",
    gatewayRoute: "/playwright",
  }),
  EXECUTOR_PLAYWRIGHT: entry("EXECUTOR_PLAYWRIGHT", "docker-gateway", {
    dockerService: "executor-playwright",
    gatewayRoute: "/executor",
  }),
  SEQUENTIAL_THINKING: entry("SEQUENTIAL_THINKING", "docker-gateway", {
    dockerService: "sequential-thinking",
    gatewayRoute: "/sequential",
  }),
  MEMORY: entry("MEMORY", "docker-gateway", {
    dockerService: "memory-reference",
    gatewayRoute: "/memory",
  }),
  RESEND: entry("RESEND", "external"),
  AST_GREP: entry("AST_GREP", "external"),
  FETCH: entry("FETCH", "external"),
  WIKIPEDIA: entry("WIKIPEDIA", "docker-gateway", {
    dockerService: "wikipedia",
    gatewayRoute: "/wikipedia",
  }),
  YOUTUBE: entry("YOUTUBE", "external"),
  NEXT_DEVTOOLS: entry("NEXT_DEVTOOLS", "docker-gateway", {
    dockerService: "nextjs-devtools",
    gatewayRoute: "/nextjs",
  }),
  CONTEXT7: entry("CONTEXT7", "external"),
  EXCALIDRAW: entry("EXCALIDRAW", "external"),
} as const satisfies Record<CanonicalMcpConstant, McpCanonicalEntry>;

export const MCP_CANONICAL_ENTRIES: ReadonlyArray<McpCanonicalEntry> =
  Object.values(MCP_CANONICAL_MAP);

export const MCP_CANONICAL_PRIORITY_SERVERS: ReadonlyArray<McpServerId> = [
  MCP.GITHUB,
  MCP.MEMORY,
  MCP.NEXT_DEVTOOLS,
  MCP.OPENAPI_SCHEMA,
  MCP.SEQUENTIAL_THINKING,
  MCP.PLAYWRIGHT,
  MCP.EXECUTOR_PLAYWRIGHT,
  MCP.WIKIPEDIA,
] as const;

export const MCP_CANONICAL_PRIORITY: ReadonlyArray<McpCanonicalEntry> =
  MCP_CANONICAL_ENTRIES.filter((entry) =>
    MCP_CANONICAL_PRIORITY_SERVERS.includes(entry.serverId),
  );

export interface McpCanonicalValidationIssue {
  readonly type:
    | "missing-mapping"
    | "server-id-mismatch"
    | "duplicate-server-id"
    | "duplicate-docker-service"
    | "duplicate-gateway-route"
    | "invalid-gateway-route"
    | "missing-docker-service"
    | "missing-gateway-route"
    | "external-has-docker-service"
    | "external-has-gateway-route"
    | "empty-smoke-tool";
  readonly message: string;
  readonly constant?: CanonicalMcpConstant;
  readonly serverId?: McpServerId;
  readonly value?: string;
}

export interface McpCanonicalValidationResult {
  readonly ok: boolean;
  readonly issues: ReadonlyArray<McpCanonicalValidationIssue>;
}

export class McpCanonicalDriftError extends Error {
  readonly issues: ReadonlyArray<McpCanonicalValidationIssue>;

  constructor(issues: ReadonlyArray<McpCanonicalValidationIssue>) {
    super(
      `[MCP Canonical] Drift detected with ${issues.length} issue(s): ${issues
        .map((issue) => issue.message)
        .join(" | ")}`,
    );
    this.name = "McpCanonicalDriftError";
    this.issues = issues;
  }
}

function duplicateValues(values: readonly string[]): ReadonlyArray<string> {
  const counts = new Map<string, number>();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()]
    .filter(([, count]) => count > 1)
    .map(([value]) => value);
}

export function validateMcpCanonicalMapping(
  entries: ReadonlyArray<McpCanonicalEntry> = MCP_CANONICAL_ENTRIES,
): McpCanonicalValidationResult {
  const issues: McpCanonicalValidationIssue[] = [];

  const expectedConstants = Object.keys(MCP).filter(
    (constant): constant is CanonicalMcpConstant =>
      constant !== "HEALTH_MONITOR",
  );

  const seenConstants = new Set(entries.map((entry) => entry.constant));

  for (const constant of expectedConstants) {
    if (!seenConstants.has(constant)) {
      issues.push({
        type: "missing-mapping",
        message: `No canonical mapping for constant ${constant}`,
        constant,
        serverId: MCP[constant],
      });
    }
  }

  for (const item of entries) {
    if (item.serverId !== MCP[item.constant]) {
      issues.push({
        type: "server-id-mismatch",
        message: `Canonical mapping for ${item.constant} has mismatched serverId`,
        constant: item.constant,
        serverId: item.serverId,
      });
    }

    if (item.smokeTool.trim().length === 0) {
      issues.push({
        type: "empty-smoke-tool",
        message: `Canonical mapping for ${item.constant} has empty smokeTool`,
        constant: item.constant,
        serverId: item.serverId,
      });
    }

    if (item.transport === "docker-gateway") {
      if (!item.dockerService || item.dockerService.trim().length === 0) {
        issues.push({
          type: "missing-docker-service",
          message: `Docker gateway mapping for ${item.constant} is missing dockerService`,
          constant: item.constant,
          serverId: item.serverId,
        });
      }
      if (!item.gatewayRoute) {
        issues.push({
          type: "missing-gateway-route",
          message: `Docker gateway mapping for ${item.constant} is missing gatewayRoute`,
          constant: item.constant,
          serverId: item.serverId,
        });
      } else if (!/^\/[a-z0-9-]+$/i.test(item.gatewayRoute)) {
        issues.push({
          type: "invalid-gateway-route",
          message: `Docker gateway mapping for ${item.constant} has invalid route ${item.gatewayRoute}`,
          constant: item.constant,
          serverId: item.serverId,
          value: item.gatewayRoute,
        });
      }
    }

    if (item.transport === "external") {
      if (item.dockerService) {
        issues.push({
          type: "external-has-docker-service",
          message: `External mapping for ${item.constant} must not set dockerService`,
          constant: item.constant,
          serverId: item.serverId,
          value: item.dockerService,
        });
      }
      if (item.gatewayRoute) {
        issues.push({
          type: "external-has-gateway-route",
          message: `External mapping for ${item.constant} must not set gatewayRoute`,
          constant: item.constant,
          serverId: item.serverId,
          value: item.gatewayRoute,
        });
      }
    }
  }

  const duplicateServerIds = duplicateValues(
    entries.map((item) => item.serverId),
  );
  for (const serverId of duplicateServerIds) {
    issues.push({
      type: "duplicate-server-id",
      message: `Duplicate serverId mapping: ${serverId}`,
      value: serverId,
    });
  }

  const dockerEntries = entries.filter(
    (item) => item.transport === "docker-gateway",
  );

  const duplicateServices = duplicateValues(
    dockerEntries
      .map((item) => item.dockerService)
      .filter((value): value is string => Boolean(value)),
  );
  for (const service of duplicateServices) {
    issues.push({
      type: "duplicate-docker-service",
      message: `Duplicate dockerService mapping: ${service}`,
      value: service,
    });
  }

  const duplicateRoutes = duplicateValues(
    dockerEntries
      .flatMap((item) =>
        item.gatewayRoute !== undefined ? [item.gatewayRoute] : [],
      )
      .map((route) => String(route)),
  );
  for (const route of duplicateRoutes) {
    issues.push({
      type: "duplicate-gateway-route",
      message: `Duplicate gatewayRoute mapping: ${route}`,
      value: route,
    });
  }

  return {
    ok: issues.length === 0,
    issues,
  };
}

export function assertMcpCanonicalMapping(
  entries: ReadonlyArray<McpCanonicalEntry> = MCP_CANONICAL_ENTRIES,
): void {
  const result = validateMcpCanonicalMapping(entries);
  if (!result.ok) {
    throw new McpCanonicalDriftError(result.issues);
  }
}
