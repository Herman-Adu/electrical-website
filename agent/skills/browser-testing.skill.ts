import { z } from "zod";
import type { AgentIntent, SkillContext } from "../types/core";
import type { SkillManifest } from "../types/skill";
import { MCP } from "../constants/mcp-servers";
import { SKILLS } from "../constants/skill-ids";

// --- Routing Decision Reference -----------------------------------------------
//
//  Two Playwright MCP servers are available via the Caddy gateway:
//
//  playwright (inspect mode)
//    Gateway: /playwright/*
//    Use when: single-page inspection --- navigate, screenshot, extract-text
//    Tools:    navigate     -> page title + final URL
//              screenshot   -> PNG to /tmp, returns path + bytes
//              extract-text -> full DOM text dump (HTML tags stripped)
//    Do NOT use for: multi-page flows, click/type/form interaction
//
//  executor-playwright (workflow mode)
//    Gateway: /executor/*
//    Use when: ordered multi-step sequences --- goto/wait across multiple pages
//    Tools:    run-workflow -> executes steps[], returns executed[], finalUrl, title
//    Supported step actions:
//              goto  -> navigate to URL, dumps DOM for title
//              wait  -> pause ms (default 500)
//    Do NOT use for: screenshots, text extraction, click/type
//
//  Routing is determined by the `mode` field (or auto-detected from `steps`):
//    mode="inspect"  (or url present, no steps)  -> MCP.PLAYWRIGHT
//    mode="workflow" (or steps present)           -> MCP.EXECUTOR_PLAYWRIGHT
//
// ------------------------------------------------------------------------------

// --- Workflow step types -------------------------------------------------------

const GotoStep = z.object({
  action: z.literal("goto"),
  url: z.string().url("goto step requires a valid URL"),
  timeoutMs: z.number().int().positive().optional(),
});

const WaitStep = z.object({
  action: z.literal("wait"),
  /** Duration in ms. Defaults to 500. */
  ms: z.number().int().positive().default(500),
});

const WorkflowStep = z.discriminatedUnion("action", [GotoStep, WaitStep]);

// --- Input schema -------------------------------------------------------------

/**
 * BrowserTestInput - unified input for both Playwright MCP servers.
 *
 * The orchestrator selects the correct server based on `mode`
 * (auto-detected from the presence of `steps` when omitted):
 *
 * - mode="inspect"  -> MCP.PLAYWRIGHT           (navigate / screenshot / extract-text)
 * - mode="workflow" -> MCP.EXECUTOR_PLAYWRIGHT   (run-workflow with goto/wait steps)
 */
const InputSchema = z
  .object({
    /**
     * Server routing mode.
     * Omit to auto-detect: `steps` present -> "workflow", otherwise "inspect".
     */
    mode: z.enum(["inspect", "workflow"]).optional(),

    /** Target URL (required for inspect mode) */
    url: z.string().url().optional(),
    /**
     * Tool to invoke in inspect mode.
     * - navigate      -> returns page title + final URL
     * - screenshot    -> captures PNG, returns path + bytes
     * - extract-text  -> returns stripped DOM text
     * Default: "navigate"
     */
    tool: z
      .enum(["navigate", "screenshot", "extract-text"])
      .default("navigate"),
    /** Capture full-page screenshot (screenshot only). Default: false */
    fullPage: z.boolean().default(false),
    /** File path for screenshot output (screenshot only). Auto-generated if absent. */
    outputPath: z.string().optional(),
    /** CSS selector for text extraction (extract-text only). Default: body */
    selector: z.string().optional(),

    /**
     * Ordered workflow steps (workflow mode).
     * Supported: "goto" (navigate to URL) | "wait" (pause ms)
     */
    steps: z.array(WorkflowStep).optional(),

    /** Timeout in ms for the overall MCP call. Default: 30 000 */
    timeoutMs: z.number().int().positive().default(30_000),
  })
  .refine(
    (d) => {
      const effective =
        d.mode ?? (d.steps && d.steps.length > 0 ? "workflow" : "inspect");
      if (effective === "inspect")
        return typeof d.url === "string" && d.url.length > 0;
      return Array.isArray(d.steps) && d.steps.length > 0;
    },
    {
      message:
        'inspect mode requires "url"; workflow mode requires at least one step in "steps"',
    },
  );

// --- Output schema ------------------------------------------------------------

const OutputSchema = z.object({
  ok: z.boolean(),
  server: z.enum(["playwright", "executor-playwright"]),
  tool: z.string(),
  engine: z.string().optional(),
  title: z.string().optional(),
  url: z.string().optional(),
  text: z.string().optional(),
  screenshotPath: z.string().optional(),
  screenshotBytes: z.number().optional(),
  stepsExecuted: z.number().int().nonnegative().optional(),
  error: z.string().optional(),
});

export type BrowserTestInput = z.infer<typeof InputSchema>;
export type BrowserTestOutput = z.infer<typeof OutputSchema>;

// --- MCP response shapes ------------------------------------------------------

interface NavigateResult {
  title: string;
  url: string;
}
interface ScreenshotResult {
  path: string;
  bytes: number;
}
interface ExtractTextResult {
  text: string;
  selector: string;
}
interface WorkflowResult {
  executed: Array<{ action: string; url?: string; durationMs?: number }>;
  finalUrl: string | null;
  title: string;
  engine: string;
}

// --- Fitness keywords ---------------------------------------------------------

const INSPECT_KEYWORDS = [
  "screenshot",
  "navigate",
  "extract",
  "what does",
  "page title",
  "page content",
  "text on",
  "verify page",
  "check page",
  "smoke test",
  "page renders",
  "after build",
  "post-deploy",
] as const;

const WORKFLOW_KEYWORDS = [
  "workflow",
  "sequence",
  "multi-step",
  "multiple pages",
  "then navigate",
  "page flow",
  "visit each",
  "route suite",
  "ordered steps",
] as const;

const ALL_BROWSER_KEYWORDS = [
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
  "automation",
  "crawl",
  ...INSPECT_KEYWORDS,
  ...WORKFLOW_KEYWORDS,
] as const;

// --- Internal routing helper --------------------------------------------------

function resolveMode(input: BrowserTestInput): "inspect" | "workflow" {
  if (input.mode) return input.mode;
  return input.steps && input.steps.length > 0 ? "workflow" : "inspect";
}

// --- Skill Manifest -----------------------------------------------------------

export const browserTestSkill: SkillManifest<
  BrowserTestInput,
  BrowserTestOutput
> = {
  id: SKILLS.BROWSER_TEST,
  version: "2.0.0",
  description:
    "Execute browser automation using the Docker MCP Playwright runtime. " +
    "Two modes: " +
    '"inspect" (default) - single-page navigate/screenshot/extract-text via playwright server; ' +
    '"workflow" - multi-step goto/wait sequences via executor-playwright server. ' +
    "The orchestrator auto-selects the correct server based on task analysis. " +
    "Use inspect for: post-deploy smoke, page content verification, screenshots. " +
    "Use workflow for: multi-page flows, ordered navigation sequences.",

  requiredServers: [MCP.PLAYWRIGHT, MCP.EXECUTOR_PLAYWRIGHT],
  costTier: "expensive",
  dryRunCapable: false,

  inputSchema: InputSchema,
  outputSchema: OutputSchema,

  fitness(intent: AgentIntent): number {
    if (intent.category === "browser-test") return 0.98;
    const desc = intent.description.toLowerCase();
    const hits = ALL_BROWSER_KEYWORDS.filter((kw) => desc.includes(kw)).length;
    if (hits === 0) return 0;
    return Math.min(0.92, 0.3 + hits * 0.15);
  },

  async execute(
    input: BrowserTestInput,
    ctx: SkillContext,
  ): Promise<BrowserTestOutput> {
    const mode = resolveMode(input);

    if (mode === "workflow") {
      const result = await ctx.callMcp<WorkflowResult>(
        MCP.EXECUTOR_PLAYWRIGHT,
        "run-workflow",
        { steps: input.steps },
      );
      return {
        ok: true,
        server: "executor-playwright",
        tool: "run-workflow",
        engine: result.engine,
        stepsExecuted: result.executed.length,
        title: result.title || undefined,
        url: result.finalUrl ?? undefined,
      };
    }

    const tool = input.tool ?? "navigate";

    if (tool === "navigate") {
      const result = await ctx.callMcp<NavigateResult>(
        MCP.PLAYWRIGHT,
        "navigate",
        { url: input.url!, timeoutMs: input.timeoutMs },
      );
      return {
        ok: true,
        server: "playwright",
        tool: "navigate",
        engine: "chromium-cli",
        title: result.title,
        url: result.url,
      };
    }

    if (tool === "screenshot") {
      const args: Record<string, unknown> = {
        url: input.url!,
        fullPage: input.fullPage,
      };
      if (input.outputPath) args["outputPath"] = input.outputPath;
      const result = await ctx.callMcp<ScreenshotResult>(
        MCP.PLAYWRIGHT,
        "screenshot",
        args,
      );
      return {
        ok: true,
        server: "playwright",
        tool: "screenshot",
        engine: "chromium-cli",
        screenshotPath: result.path,
        screenshotBytes: result.bytes,
        url: input.url,
      };
    }

    if (tool === "extract-text") {
      const args: Record<string, unknown> = { url: input.url! };
      if (input.selector) args["selector"] = input.selector;
      const result = await ctx.callMcp<ExtractTextResult>(
        MCP.PLAYWRIGHT,
        "extract-text",
        args,
      );
      return {
        ok: true,
        server: "playwright",
        tool: "extract-text",
        engine: "chromium-cli",
        text: result.text,
        url: input.url,
      };
    }

    throw new Error(`Unsupported tool in inspect mode: ${tool}`);
  },
};
