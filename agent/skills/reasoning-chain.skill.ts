import { z } from "zod";
import type { AgentIntent, SkillContext } from "../types/core";
import type { SkillManifest } from "../types/skill";
import { MCP } from "../constants/mcp-servers";
import { SKILLS } from "../constants/skill-ids";

// ─── Schemas ─────────────────────────────────────────────────────────────────

const InputSchema = z.object({
  /** The question or problem to reason through */
  question: z.string().min(1),
  /** Estimated steps needed. sequentialthinking will self-adjust. */
  estimatedSteps: z.number().int().positive().default(5),
  /** Facts or context to seed into the reasoning chain */
  context: z.array(z.string()).default([]),
  /** Whether to persist the conclusion to the memory MCP server */
  persistConclusion: z.boolean().default(true),
  /** Memory key to write final conclusion under (agent:v1:reasoning:<key>) */
  memoryKey: z.string().optional(),
});

const OutputSchema = z.object({
  conclusion: z.string(),
  thoughtSteps: z.number().int().nonnegative(),
  persisted: z.boolean(),
  memoryKey: z.string().optional(),
  confidence: z.enum(["low", "medium", "high"]),
});

export type ReasoningChainInput = z.infer<typeof InputSchema>;
export type ReasoningChainOutput = z.infer<typeof OutputSchema>;

// ─── Fitness keywords ─────────────────────────────────────────────────────────

const REASONING_KEYWORDS = [
  "reasoning",
  "analyze",
  "analyse",
  "think through",
  "evaluate",
  "decide",
  "plan",
  "strategy",
  "why",
  "how should",
  "what is the best",
  "tradeoff",
  "compare",
  "pros and cons",
] as const;

// ─── Skill Manifest ───────────────────────────────────────────────────────────

export const reasoningChainSkill: SkillManifest<
  ReasoningChainInput,
  ReasoningChainOutput
> = {
  id: SKILLS.REASONING_CHAIN,
  version: "1.0.0",
  description:
    "Work through a complex question using sequential chain-of-thought reasoning. " +
    "Optionally persists the final conclusion to the memory MCP server for future recall. " +
    "Use this when asked to reason, analyse, plan, evaluate trade-offs, or make decisions.",
  requiredServers: [MCP.SEQUENTIAL_THINKING, MCP.MEMORY],
  costTier: "expensive",
  dryRunCapable: false,

  inputSchema: InputSchema,
  outputSchema: OutputSchema,

  fitness(intent: AgentIntent): number {
    if (intent.category === "reasoning") return 0.96;

    const desc = intent.description.toLowerCase();
    const hits = REASONING_KEYWORDS.filter((kw) => desc.includes(kw)).length;
    if (hits === 0) return 0;

    return Math.min(0.88, 0.25 + hits * 0.12);
  },

  async execute(
    input: ReasoningChainInput,
    ctx: SkillContext,
  ): Promise<ReasoningChainOutput> {
    // Seed the context into sequential thinking
    const thinkResult = await ctx.callMcp<{
      conclusion: string;
      thoughtNumber: number;
      confidence?: string;
    }>(MCP.SEQUENTIAL_THINKING, "sequentialthinking", {
      thought: [input.question, ...input.context].join("\n\n"),
      nextThoughtNeeded: true,
      thoughtNumber: 1,
      totalThoughts: input.estimatedSteps,
    });

    const confidence =
      thinkResult.confidence === "high"
        ? "high"
        : thinkResult.confidence === "low"
          ? "low"
          : "medium";

    let memoryKey: string | undefined;
    let persisted = false;

    if (input.persistConclusion) {
      memoryKey = input.memoryKey ?? `agent:v1:reasoning:${ctx.intent.id}`;

      await ctx.callMcp(MCP.MEMORY, "create_entities", {
        entities: [
          {
            name: memoryKey,
            entityType: "reasoning_conclusion",
            observations: [
              `question: ${input.question}`,
              `conclusion: ${thinkResult.conclusion}`,
              `thoughtSteps: ${thinkResult.thoughtNumber}`,
              `confidence: ${confidence}`,
              `intentId: ${ctx.intent.id}`,
              `recordedAt: ${new Date().toISOString()}`,
            ],
          },
        ],
      });
      persisted = true;
    }

    return {
      conclusion: thinkResult.conclusion,
      thoughtSteps: thinkResult.thoughtNumber,
      persisted,
      memoryKey,
      confidence,
    };
  },
};
