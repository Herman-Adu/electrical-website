/**
 * Spin test — exercises 4 skill execution paths without live MCP servers.
 * Run: npx tsx scripts/spin-test-skills.ts
 */

import { healthCheckSkill } from "../agent/skills/health-check.skill";
import { codeSearchSkill } from "../agent/skills/code-search.skill";
import { reasoningChainSkill } from "../agent/skills/reasoning-chain.skill";
import { skillBuilderSkill } from "../agent/skills/skill-builder.skill";
import type {
  AgentIntent,
  SkillContext,
  McpServerId,
  SkillId,
  AgentPoolId,
} from "../agent/types/core";

// ─── Mock helpers ─────────────────────────────────────────────────────────────

function mockIntent(
  category: AgentIntent["category"],
  description: string,
): AgentIntent {
  return {
    id: "test-00000000-0000-0000-0000-000000000000",
    category,
    description,
    costCap: "expensive",
    dryRun: true,
    metadata: {},
  };
}

function mockCtx(skillId: string): SkillContext {
  return {
    skillId: skillId as SkillId,
    agentPoolId: "test-pool" as AgentPoolId,
    dryRun: true,
    intent: mockIntent("skill-authoring", "spin test"),
    callMcp: async <T>(
      _serverId: McpServerId,
      _tool: string,
      _args: unknown,
    ): Promise<T> => {
      // No-op mock — dry-run so no actual MCP calls happen
      return {} as T;
    },
  };
}

// ─── Test runner ──────────────────────────────────────────────────────────────

interface TestResult {
  name: string;
  passed: boolean;
  detail: string;
}

const results: TestResult[] = [];

function pass(name: string, detail: string): void {
  results.push({ name, passed: true, detail });
  console.log(`  ✓ ${name} — ${detail}`);
}

function fail(name: string, detail: string): void {
  results.push({ name, passed: false, detail });
  console.error(`  ✗ ${name} — ${detail}`);
}

async function main(): Promise<void> {
  // ─── PATH 1: health-check ─────────────────────────────────────────────────────

  console.log("\n[1] health-check path");

  try {
    const score = healthCheckSkill.fitness(
      mockIntent("health-check", "check all MCP servers"),
    );
    score >= 0.95
      ? pass("fitness", `score=${score.toFixed(3)} ≥ 0.95`)
      : fail("fitness", `score=${score.toFixed(3)} < 0.95`);
  } catch (e) {
    fail("fitness", String(e));
  }

  try {
    const parseResult = healthCheckSkill.inputSchema.safeParse({
      pingTimeoutMs: 3000,
    });
    parseResult.success
      ? pass("inputSchema parse", "default input valid")
      : fail("inputSchema parse", JSON.stringify(parseResult.error));
  } catch (e) {
    fail("inputSchema parse", String(e));
  }

  // ─── PATH 2: code-search ─────────────────────────────────────────────────────

  console.log("\n[2] code-search path");

  try {
    const score = codeSearchSkill.fitness(
      mockIntent(
        "code-analysis",
        "find all usages of useToast in the codebase",
      ),
    );
    score > 0
      ? pass("fitness", `score=${score.toFixed(3)} > 0`)
      : fail(
          "fitness",
          `score=${score.toFixed(3)} — should be > 0 for code-analysis`,
        );
  } catch (e) {
    fail("fitness", String(e));
  }

  try {
    const parseResult = codeSearchSkill.inputSchema.safeParse({
      pattern: "useToast",
      language: "typescript",
    });
    parseResult.success
      ? pass("inputSchema parse", "valid code-search input accepted")
      : fail("inputSchema parse", JSON.stringify(parseResult.error));
  } catch (e) {
    fail("inputSchema parse", String(e));
  }

  // ─── PATH 3: reasoning-chain ─────────────────────────────────────────────────

  console.log("\n[3] reasoning-chain path");

  try {
    const highScore = reasoningChainSkill.fitness(
      mockIntent(
        "reasoning",
        "analyse trade-offs between SSR and SSG for the services page",
      ),
    );
    highScore > 0
      ? pass("fitness(reasoning)", `score=${highScore.toFixed(3)} > 0`)
      : fail(
          "fitness(reasoning)",
          `score=${highScore.toFixed(3)} — should be > 0`,
        );
  } catch (e) {
    fail("fitness", String(e));
  }

  try {
    const parseResult = reasoningChainSkill.inputSchema.safeParse({
      question: "Should I use SSR or SSG?",
      maxThoughts: 5,
      persistConclusion: false,
    });
    parseResult.success
      ? pass("inputSchema parse", "valid reasoning-chain input accepted")
      : fail("inputSchema parse", JSON.stringify(parseResult.error));
  } catch (e) {
    fail("inputSchema parse", String(e));
  }

  // ─── PATH 4: skill-builder — all 3 modes ─────────────────────────────────────

  console.log("\n[4] skill-builder path");

  // 4a. fitness
  try {
    const authoringScore = skillBuilderSkill.fitness(
      mockIntent("skill-authoring", "create a new skill"),
    );
    authoringScore >= 0.9
      ? pass("fitness(skill-authoring)", `score=${authoringScore.toFixed(3)}`)
      : fail(
          "fitness(skill-authoring)",
          `score=${authoringScore.toFixed(3)} < 0.9`,
        );
  } catch (e) {
    fail("fitness", String(e));
  }

  // 4b. scaffold mode
  try {
    const scaffoldInput = {
      mode: "scaffold" as const,
      skillId: "test-demo",
      description: "A test demonstration skill",
      suggestedServers: [],
      dryRunCapable: true,
      persistObservation: false,
    };
    const parsed = skillBuilderSkill.inputSchema.safeParse(scaffoldInput);
    if (!parsed.success) {
      fail("scaffold inputSchema", JSON.stringify(parsed.error));
    } else {
      const result = await skillBuilderSkill.execute(
        parsed.data as Parameters<typeof skillBuilderSkill.execute>[0],
        mockCtx("skill-builder"),
      );
      result.files && result.files.length === 2
        ? pass(
            "scaffold execute",
            `generated ${result.files.length} files: ${result.files.map((f) => f.path).join(", ")}`,
          )
        : fail(
            "scaffold execute",
            `unexpected output: ${JSON.stringify(result)}`,
          );
    }
  } catch (e) {
    fail("scaffold execute", String(e));
  }

  // 4c. audit mode
  try {
    const auditInput = {
      mode: "audit" as const,
      skillMetadata: [
        {
          id: "test-skill-a",
          version: "1.0.0",
          costTier: "cheap" as const,
          dryRunCapable: true,
          requiredServers: [],
          hasPlaybook: true,
          registeredInIndex: true,
          registeredInConstants: true,
          hasFitnessSignal: true,
        },
        {
          id: "test-skill-b",
          version: "1.0.0",
          costTier: "medium" as const,
          dryRunCapable: false,
          requiredServers: ["memory"],
          hasPlaybook: false, // missing playbook — should produce critical finding
          registeredInIndex: true,
          registeredInConstants: false, // missing constant — should produce critical finding
          hasFitnessSignal: false, // no fitness signal — should produce warning
        },
      ],
      persistObservation: false,
    };
    const parsed = skillBuilderSkill.inputSchema.safeParse(auditInput);
    if (!parsed.success) {
      fail("audit inputSchema", JSON.stringify(parsed.error));
    } else {
      const result = await skillBuilderSkill.execute(
        parsed.data as Parameters<typeof skillBuilderSkill.execute>[0],
        mockCtx("skill-builder"),
      );
      const report = result.auditReport;
      if (!report) {
        fail("audit execute", "auditReport missing from output");
      } else if (report.findings.length >= 3 && report.score < 100) {
        pass(
          "audit execute",
          `score=${report.score}/100, ${report.findings.length} findings (${report.findings.filter((f) => f.severity === "critical").length} critical, ${report.findings.filter((f) => f.severity === "warning").length} warning)`,
        );
      } else {
        fail(
          "audit execute",
          `expected ≥3 findings from bad skill, got ${report.findings.length}: ${JSON.stringify(report.findings)}`,
        );
      }
    }
  } catch (e) {
    fail("audit execute", String(e));
  }

  // 4d. optimise mode
  try {
    const optimiseInput = {
      mode: "optimise" as const,
      skillMetadata: [
        {
          id: "test-skill-c",
          version: "1.0.0",
          costTier: "cheap" as const,
          dryRunCapable: false,
          requiredServers: ["resend"], // write skill without dryRun → should flag
          hasPlaybook: true,
          registeredInIndex: true,
          registeredInConstants: true,
          hasFitnessSignal: true,
        },
        {
          id: "test-skill-d",
          version: "1.0.0",
          costTier: "expensive" as const,
          dryRunCapable: true,
          requiredServers: [], // no-server expensive skill
          hasPlaybook: true,
          registeredInIndex: true,
          registeredInConstants: true,
          hasFitnessSignal: true,
        },
      ],
      heuristicSnapshot: [
        { skillId: "test-skill-c", score: 0.2, observations: 10 }, // low score → should flag
      ],
      persistObservation: false,
    };
    const parsed = skillBuilderSkill.inputSchema.safeParse(optimiseInput);
    if (!parsed.success) {
      fail("optimise inputSchema", JSON.stringify(parsed.error));
    } else {
      const result = await skillBuilderSkill.execute(
        parsed.data as Parameters<typeof skillBuilderSkill.execute>[0],
        mockCtx("skill-builder"),
      );
      const report = result.optimiseReport;
      if (!report) {
        fail("optimise execute", "optimiseReport missing from output");
      } else if (report.findings.length >= 1) {
        pass(
          "optimise execute",
          `${report.findings.length} findings: ${report.findings.map((f) => `[${f.severity}] ${f.area}`).join(", ")}`,
        );
      } else {
        fail(
          "optimise execute",
          `expected ≥1 finding from flagged skills, got 0`,
        );
      }
    }
  } catch (e) {
    fail("optimise execute", String(e));
  }

  // ─── Summary ──────────────────────────────────────────────────────────────────

  console.log("\n─────────────────────────────────────────");
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  console.log(`Spin test complete: ${passed} passed, ${failed} failed`);
  if (failed > 0) {
    console.error("\nFailed tests:");
    results
      .filter((r) => !r.passed)
      .forEach((r) => console.error(`  ✗ ${r.name}: ${r.detail}`));
    process.exit(1);
  } else {
    console.log("All skill paths healthy ✓");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
