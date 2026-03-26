import { z } from "zod";
import type { AgentIntent, SkillContext } from "../types/core";
import type { SkillManifest } from "../types/skill";
import { MCP } from "../constants/mcp-servers";
import { SKILLS } from "../constants/skill-ids";

// ─── Schemas ─────────────────────────────────────────────────────────────────

const InputSchema = z.object({
  /** AST pattern or keyword to search for */
  pattern: z.string().min(1),
  /** Path glob relative to repo root. Defaults to all files. */
  pathGlob: z.string().optional(),
  /** Language hint for ast-grep (e.g. "typescript", "javascript") */
  language: z.string().optional(),
});

const OutputSchema = z.object({
  matches: z.array(
    z.object({
      file: z.string(),
      line: z.number().int().nonnegative(),
      column: z.number().int().nonnegative(),
      text: z.string(),
      context: z.string().optional(),
    }),
  ),
  totalCount: z.number().int().nonnegative(),
  searchedFiles: z.number().int().nonnegative(),
  truncated: z.boolean(),
});

export type CodeSearchInput = z.infer<typeof InputSchema>;
export type CodeSearchOutput = z.infer<typeof OutputSchema>;

// ─── Keyword lists for fitness scoring (pure, no IO) ─────────────────────────

const CODE_KEYWORDS = [
  "find",
  "search",
  "locate",
  "grep",
  "pattern",
  "ast",
  "symbol",
  "function",
  "class",
  "import",
  "usage",
  "reference",
  "code",
  "syntax",
  "codebase",
] as const;

// ─── Skill Manifest ───────────────────────────────────────────────────────────

export const codeSearchSkill: SkillManifest<CodeSearchInput, CodeSearchOutput> =
  {
    id: SKILLS.CODE_SEARCH,
    version: "1.0.0",
    description:
      "Search the codebase for AST patterns or symbols using ast-grep. " +
      "Use this when asked to find, locate, or analyse code patterns, function usages, or symbol references.",
    requiredServers: [MCP.AST_GREP],
    costTier: "cheap",
    dryRunCapable: false,

    inputSchema: InputSchema,
    outputSchema: OutputSchema,

    fitness(intent: AgentIntent): number {
      if (intent.category === "code-analysis") return 0.95;

      const desc = intent.description.toLowerCase();
      const hits = CODE_KEYWORDS.filter((kw) => desc.includes(kw)).length;
      if (hits === 0) return 0;

      return Math.min(0.9, 0.3 + hits * 0.12);
    },

    async execute(
      input: CodeSearchInput,
      ctx: SkillContext,
    ): Promise<CodeSearchOutput> {
      const astResult = await ctx.callMcp<{ matches: unknown[] }>(
        MCP.AST_GREP,
        "search",
        {
          pattern: input.pattern,
          path: input.pathGlob ?? ".",
          language: input.language,
        },
      );

      const matches = z
        .array(
          z.object({
            file: z.string(),
            line: z.number(),
            column: z.number(),
            text: z.string(),
            context: z.string().optional(),
          }),
        )
        .parse(astResult.matches);

      const LIMIT = 200;
      return {
        matches: matches.slice(0, LIMIT),
        totalCount: matches.length,
        searchedFiles: new Set(matches.map((m) => m.file)).size,
        truncated: matches.length > LIMIT,
      };
    },
  };
