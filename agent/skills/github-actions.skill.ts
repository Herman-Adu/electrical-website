import { z } from "zod";
import type { AgentIntent, SkillContext } from "../types/core";
import type { SkillManifest } from "../types/skill";
import { MCP } from "../constants/mcp-servers";
import { SKILLS } from "../constants/skill-ids";

// ─── Schemas ─────────────────────────────────────────────────────────────────

const WorkflowAction = z.enum([
  "trigger-e2e-tests",
  "deploy-preview",
  "request-copilot-review",
  "dependency-audit",
  "list-recent-runs",
  "summarize-failures",
]);

const InputSchema = z.object({
  action: WorkflowAction,
  owner: z.string().default("Herman-Adu"),
  repo: z.string().default("electrical-website"),
  /** Pull request number — required for deploy-preview and copilot-review */
  pullNumber: z.number().int().positive().optional(),
  /** Workflow file name — required for trigger-* actions */
  workflowFile: z.string().optional(),
  /** Extra inputs forwarded to workflow_dispatch */
  workflowInputs: z.record(z.string()).optional(),
  /** Limit for list-recent-runs */
  limit: z.number().int().positive().default(10),
});

const OutputSchema = z.object({
  action: WorkflowAction,
  dryRun: z.boolean(),
  success: z.boolean(),
  summary: z.string(),
  runId: z.number().int().optional(),
  runUrl: z.string().url().optional(),
  details: z.unknown().optional(),
});

export type GitHubActionsInput = z.infer<typeof InputSchema>;
export type GitHubActionsOutput = z.infer<typeof OutputSchema>;

// ─── Fitness keywords ─────────────────────────────────────────────────────────

const GITHUB_KEYWORDS = [
  "workflow",
  "ci",
  "pipeline",
  "github actions",
  "deploy",
  "preview",
  "e2e",
  "tests",
  "copilot review",
  "audit",
  "pull request",
  "pr",
  "check",
  "run",
] as const;

// ─── Skill Manifest ───────────────────────────────────────────────────────────

export const githubActionsSkill: SkillManifest<
  GitHubActionsInput,
  GitHubActionsOutput
> = {
  id: SKILLS.GITHUB_ACTIONS,
  version: "1.0.0",
  description:
    "Trigger and inspect GitHub Actions workflows as callable skills. " +
    "Supports: trigger e2e tests, deploy preview, request Copilot code review, dependency audit, " +
    "list recent runs, and summarise failures. " +
    "Use this when asked to run CI, trigger workflows, deploy, audit dependencies, or review PRs.",
  requiredServers: [MCP.GITHUB],
  costTier: "medium",
  dryRunCapable: true,

  inputSchema: InputSchema,
  outputSchema: OutputSchema,

  fitness(intent: AgentIntent): number {
    if (intent.category === "github-action") return 0.97;

    const desc = intent.description.toLowerCase();
    const hits = GITHUB_KEYWORDS.filter((kw) => desc.includes(kw)).length;
    if (hits === 0) return 0;

    return Math.min(0.88, 0.25 + hits * 0.13);
  },

  async execute(
    input: GitHubActionsInput,
    ctx: SkillContext,
  ): Promise<GitHubActionsOutput> {
    const base = { owner: input.owner, repo: input.repo };

    // Dry-run: describe what would happen without side effects
    if (ctx.dryRun) {
      return {
        action: input.action,
        dryRun: true,
        success: true,
        summary: `[DRY RUN] Would execute "${input.action}" on ${base.owner}/${base.repo}`,
        details: { input },
      };
    }

    switch (input.action) {
      case "trigger-e2e-tests": {
        const result = await ctx.callMcp<{ id: number; html_url: string }>(
          MCP.GITHUB,
          "trigger_workflow",
          {
            ...base,
            workflow_id: input.workflowFile ?? "e2e.yml",
            ref: "main",
            inputs: input.workflowInputs ?? {},
          },
        );
        return {
          action: input.action,
          dryRun: false,
          success: true,
          summary: `E2E test workflow triggered. Run ID: ${result.id}`,
          runId: result.id,
          runUrl: result.html_url,
        };
      }

      case "deploy-preview": {
        if (!input.pullNumber)
          throw new Error("pullNumber is required for deploy-preview");
        const result = await ctx.callMcp<{ id: number; html_url: string }>(
          MCP.GITHUB,
          "trigger_workflow",
          {
            ...base,
            workflow_id: input.workflowFile ?? "preview.yml",
            ref: "main",
            inputs: {
              pull_number: String(input.pullNumber),
              ...(input.workflowInputs ?? {}),
            },
          },
        );
        return {
          action: input.action,
          dryRun: false,
          success: true,
          summary: `Deploy preview triggered for PR #${input.pullNumber}. Run ID: ${result.id}`,
          runId: result.id,
          runUrl: result.html_url,
        };
      }

      case "request-copilot-review": {
        if (!input.pullNumber)
          throw new Error("pullNumber is required for request-copilot-review");
        const result = await ctx.callMcp(MCP.GITHUB, "request_copilot_review", {
          ...base,
          pull_number: input.pullNumber,
        });
        return {
          action: input.action,
          dryRun: false,
          success: true,
          summary: `Copilot review requested for PR #${input.pullNumber}`,
          details: result,
        };
      }

      case "dependency-audit": {
        const result = await ctx.callMcp<{ id: number; html_url: string }>(
          MCP.GITHUB,
          "trigger_workflow",
          {
            ...base,
            workflow_id: input.workflowFile ?? "dependency-audit.yml",
            ref: "main",
            inputs: input.workflowInputs ?? {},
          },
        );
        return {
          action: input.action,
          dryRun: false,
          success: true,
          summary: `Dependency audit triggered. Run ID: ${result.id}`,
          runId: result.id,
          runUrl: result.html_url,
        };
      }

      case "list-recent-runs": {
        const result = await ctx.callMcp<{ workflow_runs: unknown[] }>(
          MCP.GITHUB,
          "list_workflow_runs",
          { ...base, per_page: input.limit },
        );
        return {
          action: input.action,
          dryRun: false,
          success: true,
          summary: `Found ${result.workflow_runs.length} recent workflow runs`,
          details: result.workflow_runs,
        };
      }

      case "summarize-failures": {
        const result = await ctx.callMcp<{ summary: string }>(
          MCP.GITHUB,
          "summarize_job_log_failures",
          base,
        );
        return {
          action: input.action,
          dryRun: false,
          success: true,
          summary: result.summary,
          details: result,
        };
      }
    }
  },
};
