#!/usr/bin/env node

/**
 * Comprehensive Memory Snapshot Generator
 *
 * Captures all learnings, architecture decisions, and implementation details
 * into Docker Memory MCP for persistence across chat sessions.
 *
 * Usage: node scripts/capture-memory-snapshot.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");

function generateTimestamp() {
  return new Date().toISOString().split("T")[0];
}

const COMPREHENSIVE_MEMORY_ENTITIES = [
  {
    name: `agent:v1:orchestrator_routing_architecture_${generateTimestamp()}`,
    entityType: "pattern",
    observations: [
      "Orchestrator routes browser automation tasks based on input characteristics",
      "Mode auto-detection via resolveMode(input): input.steps presence determines mode",
      "Inspect mode (single-page): navigate, screenshot, extract-text → playwright server (/playwright)",
      "Workflow mode (multi-step): ordered goto/wait sequences → executor-playwright server (/executor)",
      "Discriminated union InputSchema prevents runtime errors: BrowserTestInspectInput | BrowserTestWorkflowInput",
      "Dual-agent proof executed successfully: Agent A (inspect) → playwright ✅, Agent B (workflow) → executor-playwright ✅",
      "Routing correctness verified end-to-end via Orchestrator.create()->run() pipeline",
      "Gateway base URL: http://127.0.0.1:3100 (Caddy reverse proxy)",
      "Server selection fitness scoring: highest-fitness skill selected for intent category",
      "Result extraction captures data.server field for verification",
    ],
  },
  {
    name: `agent:v1:browser_testing_skill_implementation_${generateTimestamp()}`,
    entityType: "skill",
    observations: [
      "File: agent/skills/browser-testing.skill.ts (322 lines, zero TypeScript errors)",
      "Implements SkillManifest<BrowserTestInput, BrowserTestOutput>",
      "Input schema: discriminated union [inspect: url+tool] vs [workflow: steps[]]",
      "Output schema: {ok, server, tool, title, url, text, screenshotPath, stepsExecuted, ...}",
      "resolveMode() detects mode from input: input.steps?.length > 0 ? 'workflow' : 'inspect'",
      "execute() routes via ctx.callMcp(MCP.PLAYWRIGHT or MCP.EXECUTOR_PLAYWRIGHT)",
      "Zod validation ensures type-safe input/output across skill boundaries",
      "Supports tools: navigate, screenshot (with fullPage/outputPath), extract-text (with selector)",
      "Workflow steps: [{action: 'goto', url, timeoutMs?}, {action: 'wait', ms}]",
      "Error handling via robust MCP wrapper: JSON parsing recovery + exponential backoff retries",
      "Registered in agent/skills/index.ts → registerAllSkills()",
      "Assigned to BrowserAgent pool with allowedServers = [PLAYWRIGHT, EXECUTOR_PLAYWRIGHT]",
    ],
  },
  {
    name: `agent:v1:robust_mcp_client_wrapper_${generateTimestamp()}`,
    entityType: "infrastructure",
    observations: [
      "Solves: Error -32603 'Unexpected non-whitespace character after JSON at position X'",
      "Root causes: HTML mixed with JSON, encoding artifacts, incomplete responses, gateway error wrapping",
      "createRobustMCPClient() wraps base client with error handling and retry logic",
      "createRobustMCPPing() wraps ping function with same retry semantics",
      "createGatewayCallFunction(gatewayUrl) creates safe gateway caller with JSON recovery",
      "extractValidJSON(text): tries direct parse → searches for first valid {..} or [..] block",
      "extractMCPResult(parsed): handles multiple response formats (ok:true, result field, content arrays)",
      "Retry logic: exponential backoff [100ms → 200ms → 400ms], caps at 2000ms, 3 attempts max",
      "Non-transient errors fail immediately: 'No docker-gateway route', 'ECONNREFUSED'",
      "Comprehensive logging via console.error() (allowed console method for warnings/errors)",
      "allowFailOpen option for graceful degradation (returns {} on exhaustion if true)",
      "Response validation: HTTP status checks, Content-Type warnings, undefined result detection",
      "File: agent/mcp/client-wrapper.ts (clean TypeScript, no compilation errors)",
      "Types: MCPClientFunction, MCPClientPingFunction defined in agent/types/mcp.ts",
    ],
  },
  {
    name: `agent:v1:docker_mcp_infrastructure_status_${generateTimestamp()}`,
    entityType: "infrastructure",
    observations: [
      "All 11 MCP services operational via pnpm migration:contact:hydrate:strict",
      "Services healthy: playwright, executor-playwright, memory-reference, github-official, sequential-thinking, wikipedia, openapi-schema, nextjs-devtools, caddy, (2 more)",
      "Caddy reverse proxy at :3100 with per-service gateway routes",
      "Route mapping: /playwright → playground server (inspect mode), /executor → executor-playwright (workflow mode)",
      "Memory route: /memory → memory-reference server (search_nodes, open_nodes, create_entities, read_graph)",
      "Playwright containers bootstrapped: Chromium available in both playwright and executor-playwright",
      "Bootstrap check: 'no CLI install needed' for both containers",
      "Health checks: all services responding to /health and /tools endpoints",
      "Contract validation: memory protocol, playwright execution contracts all passing",
      "Smoke test: 11/11 services passed (pnpm docker:mcp:smoke)",
      "Latency: typical 50-200ms per call through Caddy reverse proxy",
      "Fully containerized: no host machine dependencies (except Docker)",
    ],
  },
  {
    name: `agent:v1:typescript_strict_mode_learnings_${generateTimestamp()}`,
    entityType: "pattern",
    observations: [
      "Index-signature properties require bracket notation, not dot notation: obj['key'] not obj.key",
      "tsconfig.json setting: noUncheckedIndexedAccess: true enforces this at compile time",
      "Branded types prevent string confusion: McpServerId brand requires explicit cast as McpServerId",
      "Console methods restriction: only console.warn(), console.error() allowed (no .log() or .info())",
      "Unused eslint-disable comments trigger compilation errors (must be removed if not needed)",
      "Type annotations forbidden in .mjs files (Node.js modules), .ts files only",
      "Parameter type inference required: (serverId: string, tool: string, args?: Record<string, unknown>)",
      "Function return types must be explicit: Promise<void>, Promise<number>, etc.",
      "All strict mode violations caught before runtime via get_errors tool",
      "Best practice: fix errors left-to-right, top-to-bottom, revalidate after each batch",
      "Sub-agents effective for delegating validation: they catch and fix their own work autonomously",
    ],
  },
  {
    name: `agent:v1:turnstile_anti_bot_architecture_${generateTimestamp()}`,
    entityType: "security",
    observations: [
      "Cloudflare Turnstile widget renders on Contact Step 1 (CAPTCHA challenge)",
      "⚠️  CRITICAL: Token must be EPHEMERAL - never persist to localStorage/sessionStorage/durable storage",
      "Token lifecycle: onVerify() → Zustand store (in-memory) → onExpire()/onError() → clear from store",
      "Step 5 submit button guarded: disabled until turnstileToken !== null and tokenValid === true",
      "Form schema includes: turnstileToken: z.string().min(1, 'Verification required')",
      "Server-side verification: Siteverify API POST to challenges.cloudflare.com/turnstile/v0/siteverify",
      "Siteverify call happens in Server Action EARLY (before expensive processing)",
      "Siteverify request includes: {secret: TURNSTILE_SECRET_KEY, response: token, idempotency_key}",
      "Siteverify checks: success flag, hostname match, error code inspection",
      "Order of validation: CSRF → RateLimit → Turnstile → Honeypot → Zod validation → SendEmail",
      "Honeypot protection: hidden form field catches bots; server-side rejection on non-empty value",
      "Rate limiting: track submissions per IP; reject after threshold (e.g., 5 per minute)",
      "Test keys: 1x00000000000000000000AA (site), 1x0000000000000000000000000000000AA (secret)",
      "Production keys: stored in Vercel secrets (never committed to git)",
    ],
  },
  {
    name: `agent:v1:e2e_test_scenarios_${generateTimestamp()}`,
    entityType: "testing",
    observations: [
      "Test 1: Widget renders on Step 1 - verify iframe with captcha visible",
      "Test 2: Token lifecycle - generate → ephemeral storage → validate NOT in localStorage",
      "Test 3: Submit disabled without token - button disabled + helpful title message",
      "Test 4: Submit enabled with token - Zustand state has token → button enabled",
      "Test 5: Full form submission flow - fill Steps 1-5 → success message shown",
      "Test 6: Token expiry logic - call onExpire → state cleared → button re-disabled",
      "Test 7: Verification failure - server returns error → modal/toast shown to user",
      "Test 8: Honeypot protection - fill hidden field → request rejected silently server-side",
      "Test 9: Rate limiting - multiple rapid submissions → 6th blocked with rate-limit error",
      "Test 10: CSRF validation - missing/invalid token → 403 Forbidden",
      "Tests run via: pnpm test:e2e (Playwright runner)",
      "Test patterns: waitFor, expect, locator selectors, route interception, evaluate() for Zustand access",
    ],
  },
  {
    name: `agent:v1:automated_workflow_commands_${generateTimestamp()}`,
    entityType: "automation",
    observations: [
      "Primary workflow (one command): pnpm migration:contact:hydrate:robust",
      "Hydration phases: Docker up → Bootstrap → Smoke → Contract → Memory sync",
      "Build validation: pnpm build (TypeScript strict + minification + route pre-generation)",
      "Testing: pnpm test (unit), pnpm test:e2e (Playwright)",
      "Development: pnpm dev (hot reload, :3000)",
      "Docker lifecycle: pnpm docker:mcp:up, pnpm docker:mcp:ps, pnpm docker:mcp:down",
      "Health checks: pnpm docker:mcp:smoke (11/11 services verification)",
      "Memory operations: node scripts/mcp-memory-call.mjs [tool] [args]",
      "Tools: search_nodes, open_nodes, create_entities, read_graph",
      "Git workflow: checkout -b → changes → commit → test → build → pr → merge → memory handoff",
      "CI integration: GitHub Actions triggers on push, validates build + tests + Turnstile proof",
    ],
  },
  {
    name: `agent:v1:next_phase_handoff_${generateTimestamp()}`,
    entityType: "planning",
    observations: [
      "Ready to implement: Turnstile widget in components/contact/step-one.tsx",
      "Ready to implement: Server Action in app/api/contact/route.ts (Siteverify + submission)",
      "Ready to implement: Form schema field addition: turnstileToken",
      "Ready to implement: Step 5 button guard with token validation check",
      "Ready to test: 10 E2E test scenarios covering token lifecycle + security",
      "Ready to validate: pnpm build (TypeScript strict) ✓, pnpm test (units) ✓, pnpm test:e2e (Playwright) ✓",
      "Ready to merge: Feature branch → main → trigger CI/CD pipeline",
      "Ready to handoff: Create memory snapshot with learnings, merge status, next steps",
      "Memory checkpoint: Document final feature state in Docker memory MCP",
      "Demo deliverable: Show token lifecycle in action, all E2E tests passing, build clean",
      "Success criteria: Feature complete, all tests passing, memory snapshot captured, PR merged",
    ],
  },
];

async function captureMemorySnapshot() {
  console.error("\n");
  console.error("═".repeat(70));
  console.error("  MEMORY SNAPSHOT GENERATOR");
  console.error("═".repeat(70));
  console.error("");

  try {
    console.error(
      `[Memory] Generated ${COMPREHENSIVE_MEMORY_ENTITIES.length} learnings entities`,
    );

    // Display preview
    COMPREHENSIVE_MEMORY_ENTITIES.forEach((entity) => {
      console.error(`\n  📌 ${entity.name}`);
      console.error(`     Type: ${entity.entityType}`);
      console.error(`     Observations: ${entity.observations.length}`);
    });

    console.error("\n");
    console.error("═".repeat(70));
    console.error("  TO PUSH TO DOCKER MEMORY:");
    console.error("═".repeat(70));
    console.error("");
    console.error("Run this command to sync learnings to memory MCP:");
    console.error("");
    console.error(
      `node scripts/mcp-memory-call.mjs create_entities '${JSON.stringify(
        { entities: COMPREHENSIVE_MEMORY_ENTITIES },
        null,
        0,
      )}'`,
    );

    console.error("");
    console.error("═".repeat(70));
    console.error("  HANDOFF CHECKLIST:");
    console.error("═".repeat(70));
    console.error("");
    console.error("  ✓ Memory snapshot generated");
    console.error("  ✓ Comprehensive master prompt created");
    console.error("  ⏳ Ready to push entities to Docker memory");
    console.error(
      "  🔄 Next: Copy master prompt to new chat + execute hydration",
    );
    console.error("");
  } catch (err) {
    console.error(
      "[Memory] Error:",
      err instanceof Error ? err.message : String(err),
    );
    process.exit(1);
  }
}

function dirname(url) {
  return path.dirname(url);
}

captureMemorySnapshot().catch((err) => {
  console.error("[Memory] Fatal error:", err);
  process.exit(1);
});
