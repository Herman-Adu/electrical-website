import { z } from "zod";
import type { AgentIntent, SkillContext } from "../types/core";
import type { SkillManifest } from "../types/skill";
import { MCP } from "../constants/mcp-servers";
import { SKILLS } from "../constants/skill-ids";

// ─── Sub-schemas ──────────────────────────────────────────────────────────────

const SkillMetaSchema = z.object({
  id: z.string(),
  version: z.string(),
  costTier: z.enum(["cheap", "medium", "expensive"]),
  dryRunCapable: z.boolean(),
  requiredServers: z.array(z.string()),
  /** Whether .github/skills/<id>/SKILL.md exists */
  hasPlaybook: z.boolean().default(false),
  /** Whether registered in agent/skills/index.ts */
  registeredInIndex: z.boolean().default(false),
  /** Whether an entry exists in agent/constants/skill-ids.ts */
  registeredInConstants: z.boolean().default(false),
  /** Whether assigned to a named agent pool */
  assignedToPool: z.string().optional(),
  /** Whether the fitness() function returns > 0 on at least one intent category */
  hasFitnessSignal: z.boolean().default(true),
  /** Avg latency from memory observations, if known */
  avgLatencyMs: z.number().optional(),
  /** Recent success rate, if known */
  successRate: z.number().min(0).max(1).optional(),
});

const HeuristicEntrySchema = z.object({
  skillId: z.string(),
  score: z.number(),
  observations: z.number(),
  avgLatencyMs: z.number().optional(),
});

const InputSchema = z.discriminatedUnion("mode", [
  // ── Scaffold mode (existing behaviour) ────────────────────────────────────
  z.object({
    mode: z.literal("scaffold"),
    skillId: z.string().min(1),
    description: z.string().min(1),
    suggestedServers: z.array(z.string()).default([]),
    dryRunCapable: z.boolean().default(false),
    persistObservation: z.boolean().default(true),
  }),
  // ── Audit mode ─────────────────────────────────────────────────────────────
  z.object({
    mode: z.literal("audit"),
    /**
     * Metadata for every registered skill.
     * The caller (e.g. the orchestrator integration layer) provides this by
     * iterating the SkillRegistry — the skill itself produces output only.
     */
    skillMetadata: z.array(SkillMetaSchema).min(1),
    persistObservation: z.boolean().default(true),
  }),
  // ── Optimise mode ──────────────────────────────────────────────────────────
  z.object({
    mode: z.literal("optimise"),
    skillMetadata: z.array(SkillMetaSchema).min(1),
    heuristicSnapshot: z.array(HeuristicEntrySchema).optional(),
    persistObservation: z.boolean().default(true),
  }),
]);

// ─── Finding schemas ──────────────────────────────────────────────────────────

const AuditFindingSchema = z.object({
  skillId: z.string(),
  severity: z.enum(["critical", "warning", "info"]),
  category: z.enum(["quality", "best-practice", "organisation", "parity"]),
  message: z.string(),
  remediation: z.string(),
});

const OptimiseFindingSchema = z.object({
  area: z.enum([
    "routing",
    "cost-tier",
    "pool-assignment",
    "server-allocation",
    "schema",
    "observability",
  ]),
  severity: z.enum(["high", "medium", "low"]),
  current: z.string(),
  recommendation: z.string(),
});

const OutputSchema = z.object({
  // scaffold output
  files: z
    .array(
      z.object({
        path: z.string(),
        content: z.string(),
      }),
    )
    .optional(),
  memoryKey: z.string().optional(),
  nextSteps: z.array(z.string()).optional(),
  // audit output
  auditReport: z
    .object({
      totalSkills: z.number().int().nonnegative(),
      findings: z.array(AuditFindingSchema),
      score: z.number().min(0).max(100),
      summary: z.string(),
    })
    .optional(),
  // optimise output
  optimiseReport: z
    .object({
      findings: z.array(OptimiseFindingSchema),
      summary: z.string(),
      priorityActions: z.array(z.string()),
    })
    .optional(),
  summary: z.string(),
});

export type SkillBuilderInput = z.infer<typeof InputSchema>;
export type SkillBuilderOutput = z.infer<typeof OutputSchema>;
export type SkillMeta = z.infer<typeof SkillMetaSchema>;
export type HeuristicEntry = z.infer<typeof HeuristicEntrySchema>;
export type AuditFinding = z.infer<typeof AuditFindingSchema>;
export type OptimiseFinding = z.infer<typeof OptimiseFindingSchema>;

const BUILDER_KEYWORDS = [
  "build a skill",
  "create a skill",
  "skill scaffold",
  "skill builder",
  "improve a skill",
  "new skill",
  "agent skill",
  "audit skills",
  "skill audit",
  "skill quality",
  "skill health",
  "optimise skills",
  "optimise agent",
  "optimise system",
] as const;

// ─── Scaffold helpers ─────────────────────────────────────────────────────────

function toConstKey(skillId: string): string {
  return skillId.replace(/-/g, "_").toUpperCase();
}

function toFunctionName(skillId: string): string {
  return (
    skillId.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase()) + "Skill"
  );
}

function buildSkillTs(
  skillId: string,
  description: string,
  suggestedServers: string[],
  dryRunCapable: boolean,
): string {
  const fnName = toFunctionName(skillId);
  const constKey = toConstKey(skillId);
  const requiredServers = suggestedServers.length
    ? `[${suggestedServers.map((s) => `MCP.${s}`).join(", ")}]`
    : "[]";

  return (
    `import { z } from "zod";\n` +
    `import type { AgentIntent, SkillContext } from "../types/core";\n` +
    `import type { SkillManifest } from "../types/skill";\n` +
    `import { MCP } from "../constants/mcp-servers";\n` +
    `import { SKILLS } from "../constants/skill-ids";\n\n` +
    `const InputSchema = z.object({});\n` +
    `const OutputSchema = z.object({\n  summary: z.string(),\n});\n\n` +
    `export const ${fnName}: SkillManifest = {\n` +
    `  id: SKILLS.${constKey},\n` +
    `  version: "1.0.0",\n` +
    `  description: ${JSON.stringify(description)},\n` +
    `  requiredServers: ${requiredServers},\n` +
    `  costTier: "cheap",\n` +
    `  dryRunCapable: ${dryRunCapable},\n` +
    `  inputSchema: InputSchema,\n` +
    `  outputSchema: OutputSchema,\n` +
    `  fitness(intent: AgentIntent): number {\n` +
    `    const desc = intent.description.toLowerCase();\n` +
    `    return desc.includes(${JSON.stringify(skillId)}) ? 0.9 : 0;\n` +
    `  },\n` +
    `  async execute(_input, _ctx: SkillContext) {\n` +
    `    return { summary: "Implement skill logic here." };\n` +
    `  },\n` +
    `};\n`
  );
}

function buildSkillMd(skillId: string, description: string): string {
  return (
    `---\nname: ${skillId}\ndescription: ${JSON.stringify(description)}\n---\n\n` +
    `# ${skillId}\n\n` +
    `## When to use\n\n- Add concrete usage examples here.\n\n` +
    `## Steps\n\n` +
    `1. Interpret the user's intent.\n` +
    `2. Gather only the context required for this skill.\n` +
    `3. Execute the smallest safe implementation.\n` +
    `4. Validate outputs before completing.\n\n` +
    `## Guidelines\n\n` +
    `- Keep this skill single-purpose.\n` +
    `- Add dry-run behavior for destructive actions.\n` +
    `- Update examples after every meaningful production use.\n`
  );
}

// ─── Audit helpers ────────────────────────────────────────────────────────────

function runAudit(
  skills: SkillMeta[],
): NonNullable<SkillBuilderOutput["auditReport"]> {
  const findings: AuditFinding[] = [];
  const destructiveServers = new Set([MCP.GITHUB, MCP.RESEND, MCP.MEMORY]);

  for (const skill of skills) {
    // ── Parity checks ──────────────────────────────────────
    if (!skill.hasPlaybook) {
      findings.push({
        skillId: skill.id,
        severity: "critical",
        category: "parity",
        message: `Missing SKILL.md playbook at .github/skills/${skill.id}/SKILL.md`,
        remediation: `Create .github/skills/${skill.id}/SKILL.md with frontmatter name: ${skill.id}.`,
      });
    }
    if (!skill.registeredInIndex) {
      findings.push({
        skillId: skill.id,
        severity: "critical",
        category: "parity",
        message: "Skill is not registered in agent/skills/index.ts",
        remediation:
          "Export the skill and call skillRegistry.register() inside registerAllSkills().",
      });
    }
    if (!skill.registeredInConstants) {
      findings.push({
        skillId: skill.id,
        severity: "critical",
        category: "parity",
        message: "Skill ID is not declared in agent/constants/skill-ids.ts",
        remediation: `Add SKILLS.${toConstKey(skill.id)} = sid("${skill.id}") to the SKILLS constant.`,
      });
    }

    // ── Best-practice checks ───────────────────────────────
    if (
      !skill.dryRunCapable &&
      skill.requiredServers.some((serverId) =>
        destructiveServers.has(serverId as typeof MCP.GITHUB),
      )
    ) {
      findings.push({
        skillId: skill.id,
        severity: "warning",
        category: "best-practice",
        message:
          "Skill performs potentially destructive MCP calls but dryRunCapable is false",
        remediation:
          "Implement dryRunCapable: true so orchestrators can test the routing path safely.",
      });
    }

    if (!skill.hasFitnessSignal) {
      findings.push({
        skillId: skill.id,
        severity: "warning",
        category: "quality",
        message: "Skill fitness() always returns 0 — it will never be selected",
        remediation:
          "Implement keyword or category matching in fitness() so the router can score this skill.",
      });
    }

    // ── Pool-assignment checks ─────────────────────────────
    if (!skill.assignedToPool) {
      findings.push({
        skillId: skill.id,
        severity: "warning",
        category: "organisation",
        message: "Skill is not explicitly assigned to a named agent pool",
        remediation:
          "Add the skill's requiredServers to the narrowest agent pool's allowedServers list.",
      });
    }

    // ── Quality checks ─────────────────────────────────────
    if (skill.costTier === "expensive" && skill.requiredServers.length === 0) {
      findings.push({
        skillId: skill.id,
        severity: "info",
        category: "quality",
        message: "Skill is marked expensive but requires no MCP servers",
        remediation:
          "Consider whether 'cheap' or 'medium' is a more accurate cost tier for this skill.",
      });
    }

    if (skill.successRate !== undefined && skill.successRate < 0.7) {
      findings.push({
        skillId: skill.id,
        severity: "warning",
        category: "quality",
        message: `Low observed success rate: ${(skill.successRate * 100).toFixed(1)}%`,
        remediation:
          "Review execution logic, improve input validation, and add error recovery paths.",
      });
    }

    if (skill.avgLatencyMs !== undefined && skill.avgLatencyMs > 10_000) {
      findings.push({
        skillId: skill.id,
        severity: "info",
        category: "quality",
        message: `High avg latency: ${skill.avgLatencyMs}ms`,
        remediation:
          "Profile the skill's execute() path. Consider caching or reducing MCP round-trips.",
      });
    }
  }

  const criticalCount = findings.filter(
    (f) => f.severity === "critical",
  ).length;
  const warningCount = findings.filter((f) => f.severity === "warning").length;

  // Score: start at 100, deduct per finding
  const score = Math.max(
    0,
    100 -
      criticalCount * 20 -
      warningCount * 8 -
      findings.filter((f) => f.severity === "info").length * 2,
  );

  return {
    totalSkills: skills.length,
    findings,
    score,
    summary:
      findings.length === 0
        ? `All ${skills.length} skills pass quality checks. Score: ${score}/100.`
        : `Found ${criticalCount} critical, ${warningCount} warning, and ${findings.filter((f) => f.severity === "info").length} info findings across ${skills.length} skills. Score: ${score}/100.`,
  };
}

// ─── Optimise helpers ─────────────────────────────────────────────────────────

function runOptimise(
  skills: SkillMeta[],
  heuristics: HeuristicEntry[] = [],
): NonNullable<SkillBuilderOutput["optimiseReport"]> {
  const findings: OptimiseFinding[] = [];
  const writeServerIds = new Set<string>([MCP.RESEND, MCP.GITHUB, MCP.MEMORY]);

  // ── Skills with no server deps should remain explicitly mapped ─────────────
  const noServerSkills = skills.filter(
    (s) => s.requiredServers.length === 0 && s.id !== SKILLS.HEALTH_CHECK,
  );
  if (noServerSkills.length > 0) {
    findings.push({
      area: "pool-assignment",
      severity: "low",
      current: `${noServerSkills.map((s) => s.id).join(", ")} have requiredServers: [] and rely on static no-server pool mapping`,
      recommendation:
        "Keep no-server skill-to-pool mapping explicit in ToolRouter to preserve deterministic routing as new skills are added.",
    });
  }

  // ── Expensive skills that have no history observations ─────────────────────
  const expensiveSkills = skills.filter((s) => s.costTier === "expensive");
  const unobservedExpensive = expensiveSkills.filter(
    (s) => !heuristics.find((h) => h.skillId === s.id),
  );
  if (unobservedExpensive.length > 0) {
    findings.push({
      area: "observability",
      severity: "medium",
      current: `${unobservedExpensive.map((s) => s.id).join(", ")} are expensive but have no heuristic observations`,
      recommendation:
        "Run each expensive skill at least once in a staging environment so the HeuristicEngine can calibrate scores and prevent unexpected production cost spikes.",
    });
  }

  // ── Skills with very low heuristic scores  ─────────────────────────────────
  const lowScoreSkills = heuristics.filter(
    (h) => h.score < 0.3 && h.observations > 5,
  );
  if (lowScoreSkills.length > 0) {
    findings.push({
      area: "routing",
      severity: "high",
      current: `Skills with persistently low heuristic scores after >5 observations: ${lowScoreSkills.map((h) => h.skillId).join(", ")}`,
      recommendation:
        "Review fitness() and execute() for these skills. Low scores after multiple runs indicate chronic miscategorisation or execution failures.",
    });
  }

  // ── Skills sharing MEMORY server — potential sequencing conflicts ───────────
  const memorySkills = skills.filter((s) =>
    s.requiredServers.includes(MCP.MEMORY),
  );
  if (memorySkills.length > 3) {
    findings.push({
      area: "server-allocation",
      severity: "low",
      current: `${memorySkills.length} skills all write to the memory MCP server`,
      recommendation:
        "Consider namespacing memory keys strictly by skill (agent:v1:<skill-id>:*) and adding a read-only memory server to read-only consumers to prevent accidental overwrites.",
    });
  }

  // ── Skills with cheap tier but high observed latency ──────────────────────
  const slowCheapSkills = skills.filter(
    (s) =>
      s.costTier === "cheap" &&
      s.avgLatencyMs !== undefined &&
      s.avgLatencyMs > 3_000,
  );
  if (slowCheapSkills.length > 0) {
    findings.push({
      area: "cost-tier",
      severity: "medium",
      current: `${slowCheapSkills.map((s) => s.id).join(", ")} are cost-tier cheap but average >3 s latency`,
      recommendation:
        "Re-classify to 'medium' so the router can apply an appropriate costCap filter and avoid cheap routing to slow skills.",
    });
  }

  // ── No dryRun-capable write skills ────────────────────────────────────────
  const writeSkillsWithoutDryRun = skills.filter(
    (s) =>
      !s.dryRunCapable &&
      s.requiredServers.some((srv) => writeServerIds.has(srv)),
  );
  if (writeSkillsWithoutDryRun.length > 0) {
    findings.push({
      area: "schema",
      severity: "high",
      current: `${writeSkillsWithoutDryRun.map((s) => s.id).join(", ")} write to external services but are not dry-run capable`,
      recommendation:
        "Add dryRunCapable: true and guard destructive callMcp() calls with ctx.dryRun checks. This is required for safe orchestrator testing.",
    });
  }

  const highCount = findings.filter((f) => f.severity === "high").length;
  const priorityActions = [
    ...findings
      .filter((f) => f.severity === "high")
      .map((f) => f.recommendation),
    ...findings
      .filter((f) => f.severity === "medium")
      .map((f) => f.recommendation),
  ].slice(0, 5);

  return {
    findings,
    summary:
      findings.length === 0
        ? "System routing, pool assignments, cost tiers, and observability all look healthy."
        : `Found ${highCount} high-priority optimisation opportunities. Address these before scaling the agent system.`,
    priorityActions,
  };
}

// ─── Skill Manifest ───────────────────────────────────────────────────────────

export const skillBuilderSkill: SkillManifest<
  SkillBuilderInput,
  SkillBuilderOutput
> = {
  id: SKILLS.SKILL_BUILDER,
  version: "2.0.0",
  description:
    "Meta-skill for building, auditing, and optimising agent skills in this repository. " +
    "scaffold mode: generates .skill.ts and SKILL.md for a new skill. " +
    "audit mode: checks all skills for quality, parity, best-practice, and organisation issues. " +
    "optimise mode: analyses routing, cost tiers, pool assignments, and server allocation for inefficiencies.",
  requiredServers: [MCP.MEMORY],
  costTier: "medium",
  dryRunCapable: true,
  inputSchema: InputSchema,
  outputSchema: OutputSchema,

  fitness(intent: AgentIntent): number {
    if (intent.category === "skill-authoring") return 0.98;
    const desc = intent.description.toLowerCase();
    const hits = BUILDER_KEYWORDS.filter((kw) => desc.includes(kw)).length;
    return hits === 0 ? 0 : Math.min(0.95, 0.3 + hits * 0.12);
  },

  async execute(
    input: SkillBuilderInput,
    ctx: SkillContext,
  ): Promise<SkillBuilderOutput> {
    // ── Scaffold ───────────────────────────────────────────────────────────────
    if (input.mode === "scaffold") {
      const files = [
        {
          path: `agent/skills/${input.skillId}.skill.ts`,
          content: buildSkillTs(
            input.skillId,
            input.description,
            input.suggestedServers,
            input.dryRunCapable,
          ),
        },
        {
          path: `.github/skills/${input.skillId}/SKILL.md`,
          content: buildSkillMd(input.skillId, input.description),
        },
      ];

      let memoryKey: string | undefined;
      if (input.persistObservation && !ctx.dryRun) {
        memoryKey = `agent:v1:reasoning:skill-builder:${input.skillId}`;
        await ctx.callMcp(MCP.MEMORY, "create_entities", {
          entities: [
            {
              name: memoryKey,
              entityType: "skill_builder_observation",
              observations: [
                `skillId: ${input.skillId}`,
                `description: ${input.description}`,
                `suggestedServers: ${input.suggestedServers.join(", ") || "none"}`,
                `dryRunCapable: ${input.dryRunCapable}`,
                `recordedAt: ${new Date().toISOString()}`,
              ],
            },
          ],
        });
      }

      return {
        files,
        summary: "Prepared a scaffold for a new repo-native skill.",
        memoryKey,
        nextSteps: [
          `Add SKILLS.${toConstKey(input.skillId)} to agent/constants/skill-ids.ts.`,
          `Register ${toFunctionName(input.skillId)} in agent/skills/index.ts.`,
          `Add a matching .github/skills/${input.skillId}/SKILL.md playbook.`,
          "Assign required MCP servers to the narrowest agent pool possible.",
          "Run skill-sync-check and typecheck before commit.",
        ],
      };
    }

    // ── Audit ──────────────────────────────────────────────────────────────────
    if (input.mode === "audit") {
      const auditReport = runAudit(input.skillMetadata);

      if (input.persistObservation && !ctx.dryRun) {
        const memoryKey = `agent:v1:reasoning:skill-builder:audit:${new Date().toISOString().slice(0, 10)}`;
        await ctx.callMcp(MCP.MEMORY, "create_entities", {
          entities: [
            {
              name: memoryKey,
              entityType: "skill_audit_report",
              observations: [
                `score: ${auditReport.score}`,
                `totalSkills: ${auditReport.totalSkills}`,
                `criticalFindings: ${auditReport.findings.filter((f) => f.severity === "critical").length}`,
                `recordedAt: ${new Date().toISOString()}`,
              ],
            },
          ],
        });
      }

      return {
        auditReport,
        summary: auditReport.summary,
      };
    }

    // ── Optimise ───────────────────────────────────────────────────────────────
    const optimiseReport = runOptimise(
      input.skillMetadata,
      input.heuristicSnapshot ?? [],
    );

    if (input.persistObservation && !ctx.dryRun) {
      const memoryKey = `agent:v1:reasoning:skill-builder:optimise:${new Date().toISOString().slice(0, 10)}`;
      await ctx.callMcp(MCP.MEMORY, "create_entities", {
        entities: [
          {
            name: memoryKey,
            entityType: "skill_optimise_report",
            observations: [
              `highFindings: ${optimiseReport.findings.filter((f) => f.severity === "high").length}`,
              `totalFindings: ${optimiseReport.findings.length}`,
              `recordedAt: ${new Date().toISOString()}`,
            ],
          },
        ],
      });
    }

    return {
      optimiseReport,
      summary: optimiseReport.summary,
    };
  },
};
