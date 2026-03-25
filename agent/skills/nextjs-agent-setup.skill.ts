import { z } from "zod";
import type { AgentIntent, SkillContext } from "../types/core";
import type { SkillManifest } from "../types/skill";
import { SKILLS } from "../constants/skill-ids";

const InputSchema = z.object({
  projectName: z.string().min(1).optional(),
  includeClaude: z.boolean().default(true),
  includeCopilotNotes: z.boolean().default(true),
  includeCreateNextAppNotes: z.boolean().default(true),
  nextVersionHint: z.string().default("16.2+"),
});

const OutputSchema = z.object({
  files: z.array(
    z.object({
      path: z.string(),
      content: z.string(),
      purpose: z.string(),
    }),
  ),
  summary: z.string(),
  checklist: z.array(z.string()),
});

export type NextjsAgentSetupInput = z.infer<typeof InputSchema>;
export type NextjsAgentSetupOutput = z.infer<typeof OutputSchema>;

const SETUP_KEYWORDS = [
  "agents.md",
  "claude.md",
  "copilot",
  "ai tool",
  "ai agent",
  "create-next-app",
  "next.js setup",
  "project bootstrap",
  "agent setup",
] as const;

function buildAgentsMd(nextVersionHint: string): string {
  return [
    "<!-- BEGIN:nextjs-agent-rules -->",
    "# Next.js: ALWAYS read docs before coding",
    "",
    "Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`.",
    "Your training data is outdated — the bundled docs are the source of truth.",
    "",
    `This project targets Next.js ${nextVersionHint} with App Router and TypeScript strict mode.`,
    "",
    "Project rules:",
    "- Default to Server Components.",
    '- Use `"use client"` only for browser interactivity.',
    "- Prefer Server Actions for in-app mutations.",
    "- Validate all inputs and outputs with Zod.",
    "- Never expose secrets to client code.",
    "<!-- END:nextjs-agent-rules -->",
  ].join("\n");
}

function buildCopilotNotes(projectName?: string): string {
  return [
    `# Copilot Notes${projectName ? ` — ${projectName}` : ""}`,
    "",
    "- Use App Router conventions.",
    "- Read `node_modules/next/dist/docs/` before changing framework behavior.",
    "- Prefer feature-based folders.",
    "- Extract mapped list fragments into small components when readability improves.",
    "- Run typecheck and production build before commit.",
  ].join("\n");
}

export const nextjsAgentSetupSkill: SkillManifest<
  NextjsAgentSetupInput,
  NextjsAgentSetupOutput
> = {
  id: SKILLS.NEXTJS_AGENT_SETUP,
  version: "1.0.0",
  description:
    "Generate AI agent setup files for a Next.js project, including AGENTS.md, CLAUDE.md, and Copilot-oriented guidance. Use this when asked to bootstrap AI coding agent instructions for create-next-app or retrofit an existing Next.js repository.",
  requiredServers: [],
  costTier: "cheap",
  dryRunCapable: true,
  inputSchema: InputSchema,
  outputSchema: OutputSchema,

  fitness(intent: AgentIntent): number {
    if (intent.category === "project-setup") return 0.97;
    const desc = intent.description.toLowerCase();
    const hits = SETUP_KEYWORDS.filter((kw) => desc.includes(kw)).length;
    return hits === 0 ? 0 : Math.min(0.95, 0.35 + hits * 0.12);
  },

  async execute(
    input: NextjsAgentSetupInput,
    _ctx: SkillContext,
  ): Promise<NextjsAgentSetupOutput> {
    const files: Array<{ path: string; content: string; purpose: string }> = [
      {
        path: "AGENTS.md",
        content: buildAgentsMd(input.nextVersionHint),
        purpose:
          "Root agent instructions directing tools to version-matched Next.js docs.",
      },
    ];

    if (input.includeClaude) {
      files.push({
        path: "CLAUDE.md",
        content: "@AGENTS.md\n",
        purpose:
          "Ensures Claude-compatible tools reuse AGENTS.md without duplication.",
      });
    }

    if (input.includeCopilotNotes) {
      files.push({
        path: ".github/copilot-instructions.md",
        content: buildCopilotNotes(input.projectName),
        purpose:
          "Repository-specific Copilot instructions layered on top of AGENTS.md.",
      });
    }

    return {
      files,
      summary:
        "Prepared a minimal Next.js AI-agent bootstrap package aligned with Next.js 16.2 guidance: root AGENTS.md, optional CLAUDE.md import, and Copilot notes.",
      checklist: [
        "Create AGENTS.md at repo root.",
        "Create CLAUDE.md importing AGENTS.md if Claude-based tools are used.",
        "Keep project-specific instructions outside the Next.js-managed AGENTS markers.",
        "Regenerate or review these files when upgrading Next.js major/minor versions.",
      ],
    };
  },
};
