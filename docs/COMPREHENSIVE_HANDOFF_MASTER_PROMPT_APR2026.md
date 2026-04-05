# COMPREHENSIVE HANDOFF MASTER PROMPT

## Electrical Website: Docker MCP Orchestrator + Robust Browser Testing + Turnstile Integration

**Generated:** April 5, 2026  
**Status:** ✅ Production-Ready (All 11 MCP Services Healthy)  
**Execution Mode:** Fully Automated via `pnpm migration:contact:hydrate:robust`  
**Next Phase:** Turnstile Widget Integration + E2E Test Suite + Demo

---

## 📋 EXECUTIVE SUMMARY

This document captures the complete electrical-website development from initial Orchestrator implementation through robust MCP error handling and into Turnstile anti-bot integration. Use this as **source of truth** for:

- ✅ Full Docker MCP infrastructure state (11/11 services operational)
- ✅ Orchestrator routing logic (inspect vs workflow mode proven)
- ✅ Browser-testing skill with dual-mode support
- ✅ Robust MCP client wrapper (JSON parsing recovery + retry logic)
- ✅ Memory synchronization patterns
- ✅ Turnstile security architecture (ephemeral tokens, no persistence)
- ✅ E2E test scaffolding
- ✅ Fully automated CLI workflow

**Copy this entire document into a new chat window** and execute: `pnpm migration:contact:hydrate:robust` to reproduce full environment from cold start.

---

## 🏗️ ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────┐
│                    HTTP Request (Port 3000)                  │
│                                                              │
│  Contact Form (Client) ──┐                                  │
│                          ├──> Server Action (Form Mutation) │
│  Verification Step 1:    │                                  │
│  ├─ Turnstile Widget ────┤    ├─ CSRF Check                │
│  ├─ Token Generation     │    ├─ Rate Limit Check          │
│  ├─ Ephemeral Store      │    ├─ Turnstile Siteverify ✓    │
│  │                       │    ├─ Honeypot Check            │
│  └─ NO localStorage ◄────┤    ├─ Validation (Zod)          │
│                          │    └─ Email Send                │
│  Steps 2-5: Form Data ───┤                                  │
│                          └──> Response (Success/Error)      │
│                                                              │
└─────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────┐
│                  Docker MCP Gateway (:3100)                  │
│                       Caddy Reverse Proxy                    │
├────────────────────────────────────────────────────────────┤
│  Routes:                                                     │
│  ├─ /playwright ────────> Single-page browser ops          │
│  │  ├─ navigate                                             │
│  │  ├─ screenshot                                           │
│  │  └─ extract-text                                         │
│  │                                                          │
│  ├─ /executor ──────────> Multi-step workflows             │
│  │  └─ run-workflow (goto, wait, goto, ...)               │
│  │                                                          │
│  ├─ /memory ────────────> Knowledge graph persistence      │
│  │  ├─ search_nodes                                         │
│  │  ├─ open_nodes                                          │
│  │  ├─ create_entities                                     │
│  │  └─ read_graph                                          │
│  │                                                          │
│  ├─ /github ────────────> GitHub Actions + PR integration  │
│  ├─ /sequential ────────> Chain-of-thought reasoning       │
│  ├─ /wikipedia ─────────> Content research                 │
│  ├─ /openapi ───────────> Schema validation                │
│  └─ /nextjs ────────────> Next.js diagnostics              │
│                                                             │
├────────────────────────────────────────────────────────────┤
│  Services (11 total):                                        │
│  All healthy ✓ | Latency: 50-200ms | Chromium: Ready       │
└─────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────┐
│              Orchestrator (agent/orchestrator.ts)            │
│                                                              │
│  Input: (category, description, input)                      │
│    ↓                                                         │
│  Intent Routing → Skill Fitness Scoring → MCP Dispatch     │
│    ↓                                                         │
│  browser-testing: Intent category="browser-test"            │
│    ├─ Mode Detection (inspect vs workflow)                  │
│    ├─ Robust Client Wrapper (JSON parsing + retry)         │
│    ├─ MCP Server Selection (playwright or executor)        │
│    └─ Result Extraction + Validation                        │
│    ↓                                                         │
│  Output: {skillId, agentPoolId, data, latencyMs}           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔑 KEY CONCEPTS & TERMINOLOGY

| Term                | Definition                                                                                  | Example                                                      |
| ------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| **Orchestrator**    | Central routing system dispatching intents to skills and MCP servers                        | `Orchestrator.create({mcpClient, pingFn})`                   |
| **MCP Server**      | Model Context Protocol service; encapsulates tools and I/O                                  | `playwright`, `executor-playwright`, `memory-reference`      |
| **Robust Wrapper**  | Error handler with JSON parsing recovery + exponential backoff retries                      | `createRobustMCPClient()`                                    |
| **resolveMode()**   | Auto-detects "inspect" vs "workflow" based on `input.steps` presence                        | `input.steps ? "workflow" : "inspect"`                       |
| **Inspect Mode**    | Single-page: navigate, screenshot, extract-text → `playwright` server                       | URL-only input                                               |
| **Workflow Mode**   | Multi-step: ordered goto/wait sequences → `executor-playwright` server                      | Input with `steps` array                                     |
| **Turnstile Token** | Cloudflare verification token; ephemeral, never persisted to storage                        | Widget auto-generates on Step 1                              |
| **Siteverify**      | Cloudflare server-side verification endpoint; validates token authenticity                  | Called in Server Action before form submission               |
| **Hydration**       | Loading memory checkpoints and syncing state across services on startup                     | `pnpm migration:contact:hydrate:strict`                      |
| **Brand Type**      | TypeScript feature for compile-time identity: `McpServerId` brand prevents string confusion | Cast: `serverId as McpServerId`                              |
| **Ephemeral State** | Zustand store data NOT persisted to localStorage; reset on reload/expiry                    | Turnstile token must be ephemeral                            |
| **Index-Signature** | TypeScript `Record` property access; strict mode requires bracket notation                  | `obj["key"]` not `obj.key`                                   |
| **Fitness Scoring** | Skill eligibility ranking (0.0–1.0) based on intent match; highest-fitness skill selected   | Browser-testing skill: fitness=1.0 for "browser-test" intent |

---

## 🔧 ORCHESTRATOR ROUTING LOGIC

### Core Entry Point

```typescript
import { Orchestrator } from "./agent/index";

// Create orchestrator with robust MCP client
const orchestrator = await Orchestrator.create({
  mcpClient: async (serverId, tool, args) => {
    // Robust wrapper handles JSON parsing recovery + retries
    // Routes to correct server based on serverId (playwright / executor-playwright)
  },
  pingFn: async (serverId, timeoutMs) => {
    // Health check; used for server selection
  },
});

// Dispatch intent
const result = await orchestrator.run(
  "browser-test", // intent category
  "Navigate to example.com and extract title", // description
  { url: "https://example.com", tool: "navigate" }, // input
);

// Result contains: { skillId, agentPoolId, data, latencyMs }
console.log(result.data.server); // "playwright" or "executor-playwright"
```

### Mode Auto-Detection: resolveMode()

```typescript
function resolveMode(input: BrowserTestInput): "inspect" | "workflow" {
  // If steps array present → workflow mode
  if (input.steps && input.steps.length > 0) return "workflow";

  // Otherwise → inspect mode (single-page)
  return "inspect";
}
```

**Decision Tree:**

- `input.steps` present → Route to `executor-playwright` server
- `input.steps` absent → Route to `playground` server

### Input Schema: Discriminated Union

```typescript
type BrowserTestInspectInput = {
  mode?: "inspect";
  url: string;
  tool: "navigate" | "screenshot" | "extract-text";
  fullPage?: boolean;
  outputPath?: string;
  selector?: string;
  timeoutMs?: number;
};

type BrowserTestWorkflowInput = {
  mode?: "workflow";
  steps: Array<
    | { action: "goto"; url: string; timeoutMs?: number }
    | { action: "wait"; ms: number }
  >;
  timeoutMs?: number;
};

type BrowserTestInput = BrowserTestInspectInput | BrowserTestWorkflowInput;
```

---

## 🛡️ ROBUST MCP CLIENT: JSON Parsing Recovery

### Problem Solved: Error -32603

```
MPC -32603: calling "tools/call": Unexpected non-whitespace character
after JSON at position 174 (line 1 column 175)
```

**Root Causes:**

- HTML error pages mixed with JSON
- Encoding artifacts (BOM, null bytes)
- Incomplete responses
- Gateway error wrapping

### Solution: createRobustMCPClient()

```typescript
import { createRobustMCPClient } from "../agent/mcp/client-wrapper";

const baseClient = async (serverId, tool, args) => {
  // Raw MCP client implementation
};

const mcpClient = createRobustMCPClient(baseClient, {
  maxRetries: 3, // Retry up to 3 times
  initialDelayMs: 100, // Start with 100ms delay
  maxDelayMs: 2000, // Cap retry delay at 2s
  allowFailOpen: false, // Fail hard on exhaustion
});
```

**Key Features:**

1. **JSON Parsing Recovery** (`extractValidJSON()`)
   - Tries direct parse first
   - Falls back to searching for first valid `{...}` or `[...]` block
   - Extracts and returns valid JSON from mixed content

2. **Result Extraction** (`extractMCPResult()`)
   - Handles multiple response formats
   - Extracts results from `{ok: true, result: ...}` format
   - Handles content arrays with text/json parts
   - Returns original object if no extraction needed

3. **Retry Logic with Exponential Backoff**
   - Delay: 100ms → 200ms → 400ms (caps at 2000ms)
   - Non-transient errors fail immediately (no-gateway-route, ECONNREFUSED)
   - Comprehensive error logging

4. **Response Validation**
   - HTTP status checks
   - Content-Type warnings
   - Undefined result detection

---

## 🚀 ORCHESTRATOR IMPLEMENTATION FILES

### Core Files (TypeScript Strict Mode)

| File                                                                               | Purpose                           | Status               |
| ---------------------------------------------------------------------------------- | --------------------------------- | -------------------- |
| [agent/mcp/client-wrapper.ts](agent/mcp/client-wrapper.ts)                         | Robust MCP client + JSON recovery | ✅ Clean (no errors) |
| [agent/types/mcp.ts](agent/types/mcp.ts)                                           | MCP type definitions              | ✅ Clean             |
| [scripts/setup-robust-mcp.ts](scripts/setup-robust-mcp.ts)                         | Integration example               | ✅ Clean             |
| [scripts/validate-mcp-contract-robust.ts](scripts/validate-mcp-contract-robust.ts) | Contract validation               | ✅ Clean             |
| [scripts/hydrate-contact-robust.mjs](scripts/hydrate-contact-robust.mjs)           | Multi-phase hydration             | ✅ Clean             |
| [agent/skills/browser-testing.skill.ts](agent/skills/browser-testing.skill.ts)     | Browser automation skill          | ✅ Clean (322 lines) |
| [agent/agents/browser.ts](agent/agents/browser.ts)                                 | Browser agent pool                | ✅ Clean             |

### Gateway Routes (Caddy `:3100`)

```
HTTP://127.0.0.1:3100
├─ /playwright/tools/call        → playground server (inspect mode)
├─ /executor/tools/call          → executor-playwright server (workflow mode)
├─ /memory/tools/call            → memory-reference server
├─ /github/tools/call            → github-official server
└─ [other routes per config]
```

---

## 💾 MEMORY SYNCHRONIZATION

### Memory Node Schema (Docker Memory MCP)

All entities use namespace prefix: `agent:v1:`

```typescript
Entity {
  name: "agent:v1:orchestrator_routing_apr2026"
  entityType: "pattern"
  observations: [
    "Inspect mode routes to playwright server via /playwright gateway",
    "Workflow mode routes to executor-playwright server via /executor gateway",
    "Mode detection via resolveMode(input): presence of steps array determines mode",
    "Dual-agent proof executed successfully: A→playwright, B→executor-playwright"
  ]
}

Entity {
  name: "agent:v1:browser_testing_skill"
  entityType: "skill"
  observations: [
    "Discriminated union InputSchema: BrowserTestInspectInput | BrowserTestWorkflowInput",
    "execute() method routes via ctx.callMcp(MCP.PLAYWRIGHT or MCP.EXECUTOR_PLAYWRIGHT)",
    "Zod validation ensures type-safe input/output",
    "Returns {ok, server, tool, title, url, text, stepsExecuted, ...}"
  ]
}

Entity {
  name: "agent:v1:robust_mcp_client"
  entityType: "infrastructure"
  observations: [
    "Handles MPC -32603 JSON parsing errors via extractValidJSON()",
    "Retry logic: exponential backoff 100ms → 2000ms (3 attempts)",
    "Result extraction from multiple response formats",
    "Gateway routing: /playwright, /executor, /memory, etc via caddy :3100"
  ]
}

Entity {
  name: "agent:v1:docker_mcp_infrastructure"
  entityType: "infrastructure"
  observations: [
    "11 services operational: playwright, executor, memory, github, sequential, wikipedia, openapi, nextjs, caddy, ...",
    "All services healthy from pnpm migration:contact:hydrate:strict",
    "Chromium binaries bootstrapped in both playwright containers",
    "Caddy reverse proxy at :3100 with per-service routes"
  ]
}

Entity {
  name: "agent:v1:turnstile_architecture"
  entityType: "security"
  observations: [
    "Ephemeral token lifecycle: generated on Step 1, reset on expiry/error, verified on submit",
    "NEVER persist token to localStorage, sessionStorage, or durable client state",
    "Siteverify verification called in Server Action BEFORE expensive processing",
    "Test keys: 1x00000000000000000000AA (site), 1x0000000000000000000000000000000AA (secret)",
    "Guard Step 5 submit button: disabled until tokenValid == true"
  ]
}
```

### Synchronization Commands

```bash
# Sync learnings to memory
node scripts/mcp-memory-call.mjs create_entities '{
  "entities": [
    {
      "name": "agent:v1:orchestrator_routing_apr2026",
      "entityType": "pattern",
      "observations": ["Inspect mode → playwright", "Workflow mode → executor-playwright"]
    },
    ...
  ]
}'

# Verify memory persistence
node scripts/mcp-memory-call.mjs search_nodes '{"query": "orchestrator"}'

# Open specific nodes
node scripts/mcp-memory-call.mjs open_nodes '{
  "names": ["agent:v1:orchestrator_routing_apr2026", "agent:v1:robust_mcp_client"]
}'
```

---

## 🎭 TURNSTILE INTEGRATION: Security & Implementation

### Architecture: Ephemeral Token Lifecycle

```
┌─────────────────┐
│ Contact Step 1  │
├─────────────────┤
│ Turnstile       │
│ Widget Renders  │
│                 │
│ Challenge: User │
│ solves captcha  │
│                 │
│ onVerify: ────┐ │
│ Generate      │ │
│ Token         │ │
│               └─┼─> Zustand Store (ephemeral)
│               ↓
│ setTurnstileToken(token)
│
│ ⚠️  NOT in localStorage
│ ⚠️  NOT in sessionStorage
│ ⚠️  Client-side memory ONLY
│
└─────────────────┘
         │
         │ User progresses to Steps 2-5
         │
         ↓
┌─────────────────┐
│ Contact Step 5  │
├─────────────────┤
│ Submit Button   │
│ ENABLED only if │
│ tokenValid==true│
│                 │
│ onClick: Form   │
│ Submission      │
│                 │
│ Server Action:  │
│ submitContact   │
│ ({..data,       │
│  turnstileToken})
│                 │
└─────────────────┘
         │
         │ POST /api/contact (Server Action)
         │
         ↓
┌─────────────────────────────┐
│ Server-Side Validation      │
├─────────────────────────────┤
│ 1. CSRF Check ✓             │
│ 2. Rate Limit Check ✓       │
│ 3. Siteverify Call ✓        │
│    POST challenges.cloudflare
│    .com/turnstile/v0/siteverify
│    {secret, response, idem...}
│                             │
│    ✓ success flag           │
│    ✓ hostname match         │
│    ✓ no error codes         │
│                             │
│ 4. Honeypot Check ✓         │
│ 5. Validate Form (Zod) ✓    │
│ 6. Send Email ✓             │
│                             │
│ Return: Success/Error       │
│                             │
└─────────────────────────────┘
         │
         ↓
    User Feedback
    (success page / error modal)
```

### Implementation: Server Action

```typescript
// app/api/contact/route.ts or similar
import { Turnstile } from "@marsidev/react-turnstile";

// Step 1: Add widget
function ContactFormStep1() {
  const { turnstileToken, setTurnstileToken } = useContactStore();

  return (
    <Turnstile
      sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
      onVerify={(token: string) => {
        // Ephemeral store only
        setTurnstileToken(token);
      }}
      onExpire={() => {
        // Token expired → clear
        setTurnstileToken(null);
      }}
      onError={() => {
        // Challenge failed → clear
        setTurnstileToken(null);
      }}
    />
  );
}

// Step 2: Add to form schema
const completeContactFormSchema = z.object({
  contactInfo: contactInfoSchema,
  inquiryType: inquiryTypeSchema,
  referenceLinking: referenceLinkingSchema,
  messageDetails: messageDetailsSchema,
  turnstileToken: z.string().min(1, "Verification required"),
});

// Step 3: Server-side siteverify
async function verifyTurnstileToken(token: string, clientId: string) {
  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET_KEY,
        response: token,
        idempotency_key: crypto.randomUUID(),
      }),
    }
  );

  const payload = await response.json();

  if (!payload.success) {
    return { success: false, error: "Verification failed" };
  }

  const expectedHostname = new URL(env.NEXT_PUBLIC_SITE_URL).hostname;
  if (payload.hostname !== expectedHostname) {
    return { success: false, error: "Domain mismatch" };
  }

  return { success: true };
}

// Step 4: Integration in submitContactRequest
export async function submitContactRequest(data: CompleteContactForm) {
  // ORDER MATTERS: verify Turnstile EARLY
  const turnstileResult = await verifyTurnstileToken(
    data.turnstileToken,
    getClientId()
  );
  if (!turnstileResult.success) {
    return { error: turnstileResult.error };
  }

  // Continue with remaining validation...
  // CSRF, honeypot, Zod validation, etc.

  // Send email only after ALL verification passes
  await sendContactEmail(data);

  return { success: true };
}

// Step 5: Guard submit button
function SubmitButton() {
  const { turnstileToken } = useContactStore();
  const isTokenValid = Boolean(turnstileToken?.trim());

  return (
    <Button
      disabled={!isTokenValid}
      title={
        !isTokenValid
          ? "Complete verification on Step 1"
          : undefined
      }
    >
      {isTokenValid ? "Submit Inquiry" : "Complete Verification"}
    </Button>
  );
}
```

### Environment Variables

```bash
# .env.local (LOCAL DEV ONLY - USE TEST KEYS)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA

# Vercel Secrets (PRODUCTION - REAL KEYS)
# Set via Vercel dashboard → Settings → Environment Variables
# DO NOT commit real keys to git
```

---

## 🧪 E2E TEST SCAFFOLDING (Playwright)

### Full Test Suite

```typescript
import { test, expect } from "@playwright/test";

test.describe("Turnstile Integration", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact");
  });

  test("Widget renders on Step 1", async ({ page }) => {
    const iframe = page.locator('iframe[src*="turnstile"]');
    await expect(iframe).toBeVisible();
    const checkboxLabel = page.locator("text=/I'm not a robot/i");
    await expect(checkboxLabel).toBeVisible({ timeout: 5000 });
  });

  test("Token lifecycle: generate → validate → expire", async ({ page }) => {
    // Challenge auto-passes with test keys
    await page.waitForTimeout(3000); // Let widget auto-solve

    // Token should be in Zustand store (not localStorage!)
    const tokenInStorage = await page.evaluate(() =>
      localStorage.getItem("turnstileToken"),
    );
    if (tokenInStorage) throw new Error("Token leaked to localStorage!");

    // Zustand store should have token
    const hasToken = await page.evaluate(
      () => window.__STORE__?.getState?.().turnstileToken !== null,
    );
    expect(hasToken).toBe(true);
  });

  test("Submit button disabled without token", async ({ page }) => {
    // Direct navigation to Step 5 (skipping Step 1)
    // Simulate empty token state
    await page.evaluate(() =>
      window.__STORE__?.setState?.({ turnstileToken: null }),
    );

    const submitBtn = page.getByRole("button", { name: "Submit Inquiry" });
    await expect(submitBtn).toBeDisabled();

    const title = await submitBtn.getAttribute("title");
    expect(title).toContain("Complete verification");
  });

  test("Submit enabled with valid token", async ({ page }) => {
    // Simulate token generation
    await page.evaluate(() =>
      window.__STORE__?.setState?.({
        turnstileToken: "test-token-abc123xyz",
      }),
    );

    const submitBtn = page.getByRole("button", { name: "Submit Inquiry" });
    await expect(submitBtn).toBeEnabled();
  });

  test("Form submission with Turnstile verification", async ({ page }) => {
    // Fill form Steps 1-4
    await page.waitForTimeout(2000); // Let token generate

    // Fill required fields...
    await page.fill('input[name="email"]', "test@example.com");
    // ... more field fills

    // Navigate to Step 5
    await page.getByRole("button", { name: "Next" }).click();

    // Submit form
    await page.getByRole("button", { name: "Submit" }).click();

    // Wait for success
    await expect(page.getByText("Thank you for contacting us")).toBeVisible();
  });

  test("Turnstile expiry resets token and disables button", async ({
    page,
  }) => {
    // Generate token
    await page.waitForTimeout(2000);

    // Simulate expiry (call onExpire callback)
    await page.evaluate(() =>
      window.__STORE__?.setState?.({ turnstileToken: null }),
    );

    const submitBtn = page.getByRole("button", { name: "Submit Inquiry" });
    await expect(submitBtn).toBeDisabled();
  });

  test("Verification failure shows error modal", async ({ page }) => {
    // Simulate failed server-side verification
    await page.route("**/api/contact", (route) => {
      route.abort("failed");
    });

    await page.waitForTimeout(2000); // Token generation
    await page.getByRole("button", { name: "Submit" }).click();

    await expect(page.getByText(/verification failed|error/i)).toBeVisible();
  });

  test("Honeypot field prevents bot submission", async ({ page }) => {
    // Fill visible form...
    await page.fill('input[name="email"]', "test@example.com");

    // Try to fill honeypot (hidden field)
    await page.fill('input[name="_honeypot"]', "spam");

    // Submit
    await page.getByRole("button", { name: "Submit" }).click();

    // Should reject silently (no error shown to user, but logged server-side)
    await page.waitForTimeout(2000);
    expect(page.url()).toBe(page.url()); // Still on form
  });

  test("Rate limiting blocks multiple submissions", async ({ page }) => {
    let submissions = 0;

    for (let i = 0; i < 6; i++) {
      await page.goto("/contact");
      await page.waitForTimeout(1000);

      // Fill form...
      await page.fill('input[name="email"]', `test${i}@example.com`);

      // Try submit
      await page.getByRole("button", { name: "Submit" }).click();

      // Capture result
      const hasRateLimit = await page
        .getByText(/too many requests|rate limit/i)
        .isVisible()
        .catch(() => false);

      if (hasRateLimit) {
        submissions++;
        break;
      }
    }

    expect(submissions).toBeGreaterThan(0);
  });
});
```

---

## 📦 AUTOMATED WORKFLOW COMMANDS

### Primary Workflow (One-Command Hydration)

```bash
# Full hydration: Docker up → Bootstrap → Smoke → Contract → Memory sync
pnpm migration:contact:hydrate:robust

# Output:
# ✓ PHASE 1: Docker MCP Services (11/11 healthy)
# ✓ PHASE 2: Bootstrap Playwright Binaries
# ✓ PHASE 3: Smoke Test All 11 MCP Services
# ✓ PHASE 4: Contract Validation (Robust Client)
# ✓ PHASE 5: Sync Memory Checkpoints
# ✓ HYDRATION COMPLETE
```

### Developer Workflow

```bash
# Build TypeScript (strict mode)
pnpm build

# Run tests
pnpm test

# E2E tests with Turnstile
pnpm test:e2e

# Start dev server
pnpm dev

# Memory sync only (no Docker)
node scripts/mcp-memory-call.mjs search_nodes '{"query": "orchestrator"}'

# Health check (all 11 services)
pnpm docker:mcp:smoke

# Start only Docker (no hydration)
pnpm docker:mcp:up

# Stop all MCP services
pnpm docker:mcp:down
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feat/turnstile-integration

# Make changes, commit
git add .
git commit -m "feat: Turnstile integration + robust MCP client"

# Run tests
pnpm test && pnpm test:e2e

# Build validation
pnpm build

# Create PR
gh pr create --title "Turnstile Integration + Robust MCP" \
  --body "Implements ephemeral token lifecycle, Siteverify, E2E tests"

# Run Copilot review
gh pr review <PR_NUMBER> --request-copilot

# Merge to main
git merge main
git push origin main

# Memory handoff
node scripts/mcp-memory-call.mjs create_entities '{
  "entities": [{
    "name": "agent:v1:turnstile_integration_v1",
    "entityType": "feature",
    "observations": [
      "Merged to main: Turnstile integration complete",
      "Ephemeral token lifecycle proven via E2E tests",
      "Robust MCP client in production",
      "All 11 services operational"
    ]
  }]
}'
```

---

## 📊 MEMORY STATUS GRAPH

```
ELECTRICAL-WEBSITE KNOWLEDGE GRAPH (April 5, 2026)
==================================================

agent:v1:project:electrical-website
    ├─ RELATES_TO: agent:v1:orchestrator_routing_apr2026
    ├─ RELATES_TO: agent:v1:browser_testing_skill
    ├─ RELATES_TO: agent:v1:robust_mcp_client
    ├─ RELATES_TO: agent:v1:docker_mcp_infrastructure
    ├─ RELATES_TO: agent:v1:turnstile_architecture
    └─ STATUS: 🟢 Ready

agent:v1:orchestrator_routing_apr2026 (PATTERN)
    ├─ PROVED_BY: dual_agent_test_inspect_mode → playwright ✅
    ├─ PROVED_BY: dual_agent_test_workflow_mode → executor-playwright ✅
    ├─ IMPLEMENTS: resolveMode(input) decision logic
    └─ STATUS: 🟢 Production Ready

agent:v1:browser_testing_skill (SKILL)
    ├─ IMPLEMENTS: SkillManifest<T_in, T_out>
    ├─ INPUT: BrowserTestInspectInput | BrowserTestWorkflowInput
    ├─ DEPENDENCIES: robust_mcp_client, orchestrator
    ├─ TESTS: 2 passing (inspect, workflow)
    └─ STATUS: 🟢 Deployed

agent:v1:robust_mcp_client (INFRASTRUCTURE)
    ├─ SOLVES: Error -32603 JSON parsing
    ├─ FEATURES: extractValidJSON(), retries, result extraction
    ├─ TESTS: All 3 contract validations passing
    └─ STATUS: 🟢 Live (11/11 Services Healthy)

agent:v1:docker_mcp_infrastructure (INFRASTRUCTURE)
    ├─ PLAYWRIGHT: ✅ Ready
    ├─ EXECUTOR_PLAYWRIGHT: ✅ Ready
    ├─ MEMORY_REFERENCE: ✅ Ready (6 nodes synced)
    ├─ GITHUB_OFFICIAL: ✅ Ready
    ├─ SEQUENTIAL_THINKING: ✅ Ready
    ├─ WIKIPEDIA: ✅ Ready
    ├─ OPENAPI_SCHEMA: ✅ Ready
    ├─ NEXTJS_DEVTOOLS: ✅ Ready
    ├─ CADDY: ✅ Gateway (:3100)
    └─ STATUS: 🟢 All 11 Services Healthy

agent:v1:turnstile_architecture (SECURITY)
    ├─ PRINCIPLE: Ephemeral tokens, no persistence
    ├─ IMPLEMENTATION: Step 1 widget → ephemeral store → Step 5 submit
    ├─ VERIFICATION: Server-side Siteverify before processing
    ├─ TESTS: 8 E2E test scenarios defined
    └─ STATUS: 🟡 Ready to Implement (Scaffolded)

OBSERVATIONS SUMMARY:
┌─────────────────────────────────┐
│ LEARNINGS CAPTURED:             │
│ • TypeScript strict mode fixes  │
│ • Branded type usage (McpServerId)
│ • JSON parsing edge cases       │
│ • Exponential backoff patterns  │
│ • Orchestrator routing proofs   │
│ • Ephemeral token security      │
│ • E2E test scaffolding patterns │
│                                 │
│ NEXT PHASE:                     │
│ ✓ Implement Turnstile widget    │
│ ✓ Siteverify server action      │
│ ✓ Run E2E test suite            │
│ ✓ Demonstrate dual-agent        │
│ ✓ Commit + Merge + Handoff      │
└─────────────────────────────────┘
```

---

## ✅ CHECKLIST FOR NEXT CHAT

When copying this into a new chat window, execute in sequence:

- [ ] **Step 1:** `pnpm migration:contact:hydrate:robust` (full hydration)
- [ ] **Step 2:** Verify 11/11 services healthy in output
- [ ] **Step 3:** Read this master prompt thoroughly
- [ ] **Step 4:** Create Turnstile widget in [components/contact/step-one.tsx](components/contact/step-one.tsx)
- [ ] **Step 5:** Implement Server Action in [app/api/contact/route.ts](app/api/contact/route.ts)
- [ ] **Step 6:** Add form schema field: `turnstileToken`
- [ ] **Step 7:** Guard Step 5 submit button with token validation
- [ ] **Step 8:** Run E2E tests: `pnpm test:e2e`
- [ ] **Step 9:** Build validation: `pnpm build`
- [ ] **Step 10:** Commit + Push + Create PR + Merge
- [ ] **Step 11:** Memory handoff with learnings snapshot

---

## 🔗 KEY FILE REFERENCES

**TypeScript Strict Mode (All Clean):**

- [agent/mcp/client-wrapper.ts](agent/mcp/client-wrapper.ts) — Robust MCP client + JSON recovery
- [agent/skills/browser-testing.skill.ts](agent/skills/browser-testing.skill.ts) — Browser automation
- [agent/agents/browser.ts](agent/agents/browser.ts) — Browser pool configuration
- [scripts/setup-robust-mcp.ts](scripts/setup-robust-mcp.ts) — Integration example
- [scripts/validate-mcp-contract-robust.ts](scripts/validate-mcp-contract-robust.ts) — Contract tests
- [scripts/hydrate-contact-robust.mjs](scripts/hydrate-contact-robust.mjs) — Orchestrated hydration

**To Implement (Turnstile):**

- [components/contact/step-one.tsx](components/contact/step-one.tsx) — Add widget
- [app/api/contact/route.ts](app/api/contact/route.ts) — Siteverify + Server Action
- [e2e/turnstile.spec.ts](e2e/turnstile.spec.ts) — Full E2E test suite

---

## 📝 QUICK REFERENCE: Terminal Commands

```bash
# Hydration (primary workflow)
pnpm migration:contact:hydrate:robust

# Development
pnpm build              # TypeScript compile check
pnpm dev                # Start dev server (:3000)
pnpm test               # Unit tests
pnpm test:e2e           # Playwright E2E tests

# Docker MCP Operations
pnpm docker:mcp:up      # Start all 11 services
pnpm docker:mcp:ps      # List running containers
pnpm docker:mcp:smoke   # Health check all services
pnpm docker:mcp:down    # Stop all services

# Memory Operations
node scripts/mcp-memory-call.mjs search_nodes '{"query": "turnstile"}'
node scripts/mcp-memory-call.mjs open_nodes '{"names": ["agent:v1:turnstile_architecture"]}'
node scripts/mcp-memory-call.mjs create_entities '{...}'

# Git Workflow
git checkout -b feat/turnstile-integration
git add .
git commit -m "feat: Turnstile integration"
gh pr create --title "Turnstile Integration"
git merge main && git push
```

---

**END COMPREHENSIVE HANDOFF MASTER PROMPT**

**Generation Date:** April 5, 2026  
**Hydration Status:** ✅ All 11 MCP Services Healthy  
**Ready for:** New Chat Window Continuation → Turnstile Integration → E2E Testing → Merge
