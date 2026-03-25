import type { McpServerId, SkillId } from "../types/core.ts";
import type { SkillManifest, SkillRegistryEntry } from "../types/skill.ts";
import type { AgentIntent } from "../types/core.ts";
import type { ScoredSkill } from "../types/skill.ts";

// ─── Skill Registry ───────────────────────────────────────────────────────────

/**
 * Versioned, immutable-after-registration store of all SkillManifest instances.
 *
 * Rules:
 * - Skill IDs must be globally unique within a registry instance.
 * - A skill may not be re-registered with the same ID (use a new version instead).
 * - Registration is synchronous; IO happens at the execution layer, never here.
 */
export class SkillRegistry {
  readonly #entries = new Map<SkillId, SkillRegistryEntry>();

  /**
   * Register a skill. Throws if a skill with the same ID is already registered.
   */
  register(manifest: SkillManifest): void {
    if (this.#entries.has(manifest.id)) {
      throw new Error(
        `SkillRegistry: duplicate skill ID "${manifest.id}". ` +
          `Already registered at version ${this.#entries.get(manifest.id)?.manifest.version}.`,
      );
    }
    const entry: SkillRegistryEntry = {
      manifest,
      registeredAt: new Date().toISOString(),
    };
    this.#entries.set(manifest.id, entry);
  }

  /**
   * Retrieve a skill by ID. Returns undefined if not found.
   */
  get(id: SkillId): SkillManifest | undefined {
    return this.#entries.get(id)?.manifest;
  }

  /**
   * Retrieve a skill by ID. Throws if not found.
   */
  getOrThrow(id: SkillId): SkillManifest {
    const manifest = this.get(id);
    if (!manifest) {
      throw new Error(`SkillRegistry: skill "${id}" not found.`);
    }
    return manifest;
  }

  /**
   * Return all registered skills.
   */
  all(): ReadonlyArray<SkillManifest> {
    return [...this.#entries.values()].map((e) => e.manifest);
  }

  /**
   * Return all skills that declare a given MCP server as required.
   */
  byServer(serverId: McpServerId): ReadonlyArray<SkillManifest> {
    return this.all().filter((s) => s.requiredServers.includes(serverId));
  }

  /**
   * Return the N highest-fitness skills for a given intent, filtered by costCap.
   * Does NOT apply heuristic weights — that is the HeuristicEngine's job.
   * Excludes skills with fitness === 0.
   */
  rankByFitness(
    intent: AgentIntent,
    opts: { limit?: number } = {},
  ): ReadonlyArray<ScoredSkill> {
    const { limit = 5 } = opts;

    const costOrder: Record<string, number> = {
      cheap: 0,
      medium: 1,
      expensive: 2,
    };
    const capIndex = costOrder[intent.costCap] ?? 2;

    return this.all()
      .filter((skill) => {
        const tierIndex = costOrder[skill.costTier] ?? 2;
        return tierIndex <= capIndex;
      })
      .map((skill) => {
        const fitnessScore = skill.fitness(intent);
        return {
          skill,
          fitnessScore,
          adjustedScore: fitnessScore, // heuristics applied by HeuristicEngine
          scoreBreakdown: {
            fitness: fitnessScore,
            heuristicMultiplier: 1.0,
            costPenalty: 0,
          },
        } satisfies ScoredSkill;
      })
      .filter((s) => s.fitnessScore > 0)
      .sort((a, b) => b.fitnessScore - a.fitnessScore)
      .slice(0, limit);
  }

  /**
   * Returns the count of registered skills — useful for diagnostics.
   */
  get size(): number {
    return this.#entries.size;
  }
}

// ─── Singleton ────────────────────────────────────────────────────────────────

/**
 * The global registry. All skill files import this and call .register()
 * at module load time. The orchestrator imports this after all skill modules
 * have been loaded.
 */
export const skillRegistry = new SkillRegistry();
