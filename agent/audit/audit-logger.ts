import { randomUUID } from "node:crypto";
import type {
  AgentPoolId,
  SkillId,
  TokenCostTier,
} from "../types/core.ts";
import type {
  AuditEvent,
  AuditOutcome,
  ValidationResult,
} from "../types/audit.ts";
import type { McpClient } from "../agents/agent-pool.ts";
import { MCP } from "../constants/mcp-servers";

// ─── Audit Store Contract ─────────────────────────────────────────────────────

/**
 * Injected by the orchestrator. Abstracts the append target.
 * Default implementation writes to memory MCP.
 * May be overridden with a file-based store for offline testing.
 */
export interface AuditStore {
  append(event: AuditEvent): Promise<void>;
  query(filter: AuditQueryFilter): Promise<ReadonlyArray<AuditEvent>>;
}

export interface AuditQueryFilter {
  skillId?: SkillId;
  outcome?: AuditOutcome;
  since?: string; // ISO 8601
  limit?: number;
}

// ─── Memory Audit Store ───────────────────────────────────────────────────────

/**
 * Persists AuditEvents to the memory MCP server.
 * Key pattern: agent:v1:audit_events:<uuid>
 *
 * Important: write is append-only. Once written, events are never modified.
 */
export class MemoryAuditStore implements AuditStore {
  readonly #callMcp: McpClient;

  constructor(mcpClient: McpClient) {
    this.#callMcp = mcpClient;
  }

  async append(event: AuditEvent): Promise<void> {
    const key = `agent:v1:audit_events:${event.id}`;
    const json = JSON.stringify(event);

    await this.#callMcp(MCP.MEMORY, "create_entities", {
      entities: [
        {
          name: key,
          entityType: "audit_event",
          observations: [
            `event:${json}`,
            `skillId:${event.skillId}`,
            `outcome:${event.outcome}`,
            `timestamp:${event.timestamp}`,
            `costTier:${event.costTier}`,
          ],
        },
      ],
    });
  }

  async query(filter: AuditQueryFilter): Promise<ReadonlyArray<AuditEvent>> {
    const query = filter.skillId
      ? `agent:v1:audit_events skillId:${filter.skillId}`
      : "agent:v1:audit_events";

    const result = await this.#callMcp<{
      entities: Array<{ name: string; observations: string[] }>;
    }>(MCP.MEMORY, "search_nodes", { query });

    const events: AuditEvent[] = [];

    for (const entity of result.entities) {
      const obs = entity.observations.find((o) => o.startsWith("event:"));
      if (!obs) continue;

      try {
        const event = JSON.parse(obs.replace("event:", "")) as AuditEvent;

        if (filter.outcome && event.outcome !== filter.outcome) continue;
        if (filter.since && event.timestamp < filter.since) continue;

        events.push(event);
      } catch {
        // Malformed record — skip silently, do not block audit reads
      }
    }

    return events
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
      .slice(0, filter.limit ?? 100);
  }
}

// ─── Audit Logger ─────────────────────────────────────────────────────────────

/**
 * AuditLogger is the single point of audit event creation.
 *
 * Called by the orchestrator after every skill execution (success or failure).
 * Uses the AuditStore for persistence — defaults to MemoryAuditStore.
 *
 * Resilience: if the store write fails, the error is caught and the failure
 * is logged to stderr. Audit write failures never propagate to the caller.
 */
export class AuditLogger {
  readonly #store: AuditStore;

  constructor(store: AuditStore) {
    this.#store = store;
  }

  async log(params: {
    skillId: SkillId;
    agentPoolId: AgentPoolId;
    costTier: TokenCostTier;
    dryRun: boolean;
    intentHash: string;
    outcome: AuditOutcome;
    validationResult: ValidationResult;
    latencyMs: number;
  }): Promise<void> {
    const event: AuditEvent = {
      id: randomUUID(),
      timestamp: new Date().toISOString(),
      schemaVersion: "v1",
      ...params,
    };

    try {
      await this.#store.append(event);
    } catch (err) {
      // Audit write failure must NEVER crash the system
      console.error("[AuditLogger] Failed to persist audit event:", err, event);
    }
  }

  async query(
    filter: AuditQueryFilter = {},
  ): Promise<ReadonlyArray<AuditEvent>> {
    return this.#store.query(filter);
  }
}
