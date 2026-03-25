import type { HeuristicSnapshot } from "../types/heuristics.ts";
import type { HeuristicStore } from "./heuristic-engine.ts";
import type { McpClient } from "../agents/agent-pool.ts";
import { MCP } from "../constants/mcp-servers";

// ─── Memory MCP Key Schema ────────────────────────────────────────────────────

const SNAPSHOT_ENTITY_TYPE = "heuristic_snapshot";
const LATEST_KEY = "agent:v1:heuristic_snapshots:latest";

// ─── Memory Store Implementation ──────────────────────────────────────────────

/**
 * Persists HeuristicSnapshots to the memory MCP server.
 * Schema: entity name = agent:v1:heuristic_snapshots:<version>
 *         observations = ["snapshot:<JSON>"]
 *
 * The "latest" entity always points to the most recent version name,
 * enabling fast reads without scanning all versions.
 */
export class MemoryHeuristicStore implements HeuristicStore {
  readonly #callMcp: McpClient;

  constructor(mcpClient: McpClient) {
    this.#callMcp = mcpClient;
  }

  async readLatestSnapshot(): Promise<HeuristicSnapshot | null> {
    try {
      // Read the "latest" pointer entity
      const result = await this.#callMcp<{
        entities: Array<{ name: string; observations: string[] }>;
      }>(MCP.MEMORY, "search_nodes", { query: LATEST_KEY });

      const latestEntity = result.entities.find((e) => e.name === LATEST_KEY);
      if (!latestEntity) return null;

      const pointerObs = latestEntity.observations.find((o) =>
        o.startsWith("pointsTo:"),
      );
      if (!pointerObs) return null;

      const targetKey = pointerObs.replace("pointsTo:", "").trim();

      // Read the actual snapshot entity
      const snapResult = await this.#callMcp<{
        entities: Array<{ name: string; observations: string[] }>;
      }>(MCP.MEMORY, "search_nodes", { query: targetKey });

      const snapEntity = snapResult.entities.find((e) => e.name === targetKey);
      if (!snapEntity) return null;

      const snapObs = snapEntity.observations.find((o) =>
        o.startsWith("snapshot:"),
      );
      if (!snapObs) return null;

      const json = snapObs.replace("snapshot:", "").trim();
      return JSON.parse(json) as HeuristicSnapshot;
    } catch {
      // Memory MCP unavailable or no snapshot yet — start fresh
      return null;
    }
  }

  async writeSnapshot(snapshot: HeuristicSnapshot): Promise<void> {
    const entityKey = `agent:v1:heuristic_snapshots:${snapshot.version}`;
    const json = JSON.stringify(snapshot);

    // Write versioned snapshot entity
    await this.#callMcp(MCP.MEMORY, "create_entities", {
      entities: [
        {
          name: entityKey,
          entityType: SNAPSHOT_ENTITY_TYPE,
          observations: [`snapshot:${json}`, `createdAt:${snapshot.createdAt}`],
        },
      ],
    });

    // Update "latest" pointer — delete old pointer, create new
    try {
      await this.#callMcp(MCP.MEMORY, "delete_entities", {
        entityNames: [LATEST_KEY],
      });
    } catch {
      // Entity may not exist on first write — that's fine
    }

    await this.#callMcp(MCP.MEMORY, "create_entities", {
      entities: [
        {
          name: LATEST_KEY,
          entityType: "heuristic_pointer",
          observations: [
            `pointsTo:${entityKey}`,
            `version:${snapshot.version}`,
            `updatedAt:${snapshot.createdAt}`,
          ],
        },
      ],
    });
  }
}
