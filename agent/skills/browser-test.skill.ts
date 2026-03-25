import { z } from "zod";
import type { AgentIntent, SkillContext } from "../types/core";
import type { SkillManifest } from "../types/skill";
import { MCP } from "../constants/mcp-servers";
import { SKILLS } from "../constants/skill-ids";

// ─── Schemas ─────────────────────────────────────────────────────────────────

const InputSchema = z.object({
  /** URL to navigate to */
  url: z.string().url(),
  /** Steps to perform after navigation */
  steps: z.array(
    z.discriminatedUnion("action", [
      z.object({ action: z.literal("click"), selector: z.string() }),
      z.object({
        action: z.literal("fill"),
        selector: z.string(),
        value: z.string(),
      }),
      z.object({
        action: z.literal("screenshot"),
        filename: z.string().optional(),
      }),
      z.object({ action: z.literal("evaluate"), script: z.string() }),
      z.object({ action: z.literal("waitForSelector"), selector: z.string() }),
      z.object({ action: z.literal("navigate"), url: z.string().url() }),
    ]),
  ),
  /** Whether to capture a final screenshot */
  captureScreenshot: z.boolean().default(false),
  /** Timeout per step in milliseconds */
  stepTimeoutMs: z.number().int().positive().default(10_000),
});

const OutputSchema = z.object({
  success: z.boolean(),
  stepsCompleted: z.number().int().nonnegative(),
  stepsFailed: z.number().int().nonnegative(),
  consoleErrors: z.array(z.string()),
  screenshotPath: z.string().optional(),
  evaluationResults: z.array(z.unknown()),
  failureReason: z.string().optional(),
});

export type BrowserTestInput = z.infer<typeof InputSchema>;
export type BrowserTestOutput = z.infer<typeof OutputSchema>;

// ─── Fitness keywords ─────────────────────────────────────────────────────────

const BROWSER_KEYWORDS = [
  "browser",
  "playwright",
  "click",
  "navigate",
  "screenshot",
  "form",
  "e2e",
  "end-to-end",
  "page",
  "ui test",
  "web test",
  "selenium",
  "automation",
  "crawl",
  "scrape",
] as const;

// ─── Skill Manifest ───────────────────────────────────────────────────────────

export const browserTestSkill: SkillManifest<
  BrowserTestInput,
  BrowserTestOutput
> = {
  id: SKILLS.BROWSER_TEST,
  version: "1.0.0",
  description:
    "Execute browser automation steps using Playwright. " +
    "Can navigate, click, fill forms, take screenshots, and evaluate JavaScript. " +
    "Use this when asked to run browser tests, UI automation, screenshots, or web scraping tasks.",
  requiredServers: [MCP.PLAYWRIGHT],
  costTier: "expensive",
  dryRunCapable: false,

  inputSchema: InputSchema,
  outputSchema: OutputSchema,

  fitness(intent: AgentIntent): number {
    if (intent.category === "browser-test") return 0.98;

    const desc = intent.description.toLowerCase();
    const hits = BROWSER_KEYWORDS.filter((kw) => desc.includes(kw)).length;
    if (hits === 0) return 0;

    return Math.min(0.9, 0.3 + hits * 0.15);
  },

  async execute(
    input: BrowserTestInput,
    ctx: SkillContext,
  ): Promise<BrowserTestOutput> {
    // Navigate to starting URL
    await ctx.callMcp(MCP.PLAYWRIGHT, "navigate", { url: input.url });

    let stepsCompleted = 0;
    let stepsFailed = 0;
    const evaluationResults: unknown[] = [];
    let screenshotPath: string | undefined;
    let failureReason: string | undefined;

    for (const step of input.steps) {
      try {
        if (step.action === "click") {
          await ctx.callMcp(MCP.PLAYWRIGHT, "click", {
            selector: step.selector,
          });
        } else if (step.action === "fill") {
          await ctx.callMcp(MCP.PLAYWRIGHT, "fill", {
            selector: step.selector,
            value: step.value,
          });
        } else if (step.action === "screenshot") {
          const result = await ctx.callMcp<{ path: string }>(
            MCP.PLAYWRIGHT,
            "screenshot",
            {
              filename: step.filename,
            },
          );
          screenshotPath = result.path;
        } else if (step.action === "evaluate") {
          const result = await ctx.callMcp(MCP.PLAYWRIGHT, "evaluate", {
            script: step.script,
          });
          evaluationResults.push(result);
        } else if (step.action === "waitForSelector") {
          await ctx.callMcp(MCP.PLAYWRIGHT, "waitForSelector", {
            selector: step.selector,
          });
        } else if (step.action === "navigate") {
          await ctx.callMcp(MCP.PLAYWRIGHT, "navigate", { url: step.url });
        }
        stepsCompleted++;
      } catch (err) {
        stepsFailed++;
        failureReason = err instanceof Error ? err.message : String(err);
      }
    }

    if (input.captureScreenshot && screenshotPath === undefined) {
      const result = await ctx.callMcp<{ path: string }>(
        MCP.PLAYWRIGHT,
        "screenshot",
        {},
      );
      screenshotPath = result.path;
    }

    const consoleMessages = await ctx
      .callMcp<{
        messages: Array<{ level: string; text: string }>;
      }>(MCP.PLAYWRIGHT, "console_messages", { level: "error" })
      .catch(() => ({ messages: [] }));

    return {
      success: stepsFailed === 0,
      stepsCompleted,
      stepsFailed,
      consoleErrors: consoleMessages.messages
        .filter((m) => m.level === "error")
        .map((m) => m.text),
      screenshotPath,
      evaluationResults,
      failureReason,
    };
  },
};
