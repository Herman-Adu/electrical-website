#!/usr/bin/env node
/* eslint-disable no-console */

const crypto = require("node:crypto");
const http = require("http");
const { execSync, spawn } = require("node:child_process");

const port = process.env.PORT || 8000;
const MAX_BODY_BYTES = 1_048_576;
const MAX_STEPS = 50;

let playwrightLib = null;
try {
  playwrightLib = require("playwright");
} catch {
  playwrightLib = null;
}

const TOOL_DEFINITIONS = [
  {
    name: "run-workflow",
    description: "Execute a browser workflow and return execution summary.",
  },
  {
    name: "orchestrate",
    description: "Alias for run-workflow.",
  },
  {
    name: "execute-sequence",
    description: "Alias for run-workflow.",
  },
  {
    name: "validate_workflow",
    description: "Validate workflow step shape without executing it.",
  },
  {
    name: "list_tools",
    description: "Return supported workflow tool definitions.",
  },
];

function setCommonHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json");
}

function sendJson(res, status, payload) {
  res.writeHead(status);
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > MAX_BODY_BYTES) {
        reject(new Error("Request body too large"));
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function ensureHttpUrl(value) {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error("url is required");
  }

  const parsed = new URL(value);
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("url must use http or https");
  }

  return parsed.toString();
}

function resolveChromiumBinary() {
  const fromEnv = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
  if (typeof fromEnv === "string" && fromEnv.length > 0) {
    return fromEnv;
  }

  const command = [
    "if command -v chromium >/dev/null 2>&1; then command -v chromium;",
    "elif command -v chromium-browser >/dev/null 2>&1; then command -v chromium-browser;",
    "elif [ -x /usr/bin/chromium ]; then echo /usr/bin/chromium;",
    "elif [ -x /usr/bin/chromium-browser ]; then echo /usr/bin/chromium-browser;",
    "else find /ms-playwright -type f -path '*/chrome-linux*/chrome' 2>/dev/null | head -n 1; fi",
  ].join(" ");

  const output = execSync(command, {
    encoding: "utf8",
    shell: "/bin/sh",
  }).trim();
  if (!output) {
    throw new Error("Chromium binary not found in container runtime");
  }

  return output;
}

function runChromium(args, timeoutMs = 30000) {
  return new Promise((resolve, reject) => {
    const binary = resolveChromiumBinary();
    const child = spawn(binary, args, {
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    const timeout = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error(`Chromium command timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });

    child.on("close", (code) => {
      clearTimeout(timeout);
      if (code !== 0) {
        reject(new Error(stderr.trim() || `Chromium exited with code ${code}`));
        return;
      }

      resolve({ stdout, stderr });
    });
  });
}

function extractTitleFromHtml(html) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? match[1].trim() : "";
}

function ensureString(value, field) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${field} is required`);
  }
}

function validateWorkflowSteps(steps) {
  if (!Array.isArray(steps) || steps.length === 0) {
    throw new Error("steps must be a non-empty array");
  }
  if (steps.length > MAX_STEPS) {
    throw new Error(`steps exceeds MAX_STEPS (${MAX_STEPS})`);
  }

  steps.forEach((step, index) => {
    if (!step || typeof step !== "object") {
      throw new Error(`Step ${index + 1} must be an object`);
    }

    ensureString(step.action, `Step ${index + 1} action`);
    const action = step.action;

    if (action === "goto") {
      ensureHttpUrl(step.url);
      return;
    }

    if (action === "wait") {
      const durationMs =
        step.durationMs === undefined ? 500 : Number(step.durationMs);
      if (
        !Number.isFinite(durationMs) ||
        durationMs < 0 ||
        durationMs > 60000
      ) {
        throw new Error(
          `Step ${index + 1} durationMs must be between 0 and 60000`,
        );
      }
      return;
    }

    if (
      [
        "click",
        "type",
        "fill",
        "assert_text",
        "screenshot",
        "extract",
        "evaluate",
      ].includes(action)
    ) {
      return;
    }

    throw new Error(`Unsupported action at step ${index + 1}: ${action}`);
  });

  return true;
}

async function executeWorkflowWithPlaywright(steps) {
  const browser = await playwrightLib.chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const executed = [];
  const workflowId = `workflow_${crypto.randomUUID()}`;

  try {
    for (const [index, step] of steps.entries()) {
      const action = step.action;

      if (action === "goto") {
        const targetUrl = ensureHttpUrl(step.url);
        await page.goto(targetUrl, {
          timeout: Number.isFinite(step.timeoutMs) ? step.timeoutMs : 30000,
          waitUntil: "domcontentloaded",
        });
        executed.push({
          index: index + 1,
          action,
          url: targetUrl,
          title: await page.title(),
        });
        continue;
      }

      if (action === "wait") {
        const durationMs = Number.isFinite(step.durationMs)
          ? step.durationMs
          : 500;
        await page.waitForTimeout(durationMs);
        executed.push({ index: index + 1, action, durationMs });
        continue;
      }

      if (action === "click") {
        ensureString(step.selector, "selector");
        await page.click(step.selector, {
          timeout: Number.isFinite(step.timeoutMs) ? step.timeoutMs : 30000,
        });
        executed.push({ index: index + 1, action, selector: step.selector });
        continue;
      }

      if (action === "type") {
        ensureString(step.selector, "selector");
        ensureString(step.text, "text");
        await page.fill(step.selector, step.text);
        executed.push({ index: index + 1, action, selector: step.selector });
        continue;
      }

      if (action === "fill") {
        const fields = Array.isArray(step.fields) ? step.fields : [];
        if (fields.length === 0) {
          throw new Error(`Step ${index + 1} fields must be a non-empty array`);
        }
        for (const field of fields) {
          ensureString(field.selector, "field.selector");
          await page.fill(field.selector, String(field.value ?? ""));
        }
        executed.push({
          index: index + 1,
          action,
          fieldsFilled: fields.length,
        });
        continue;
      }

      if (action === "assert_text") {
        ensureString(step.selector, "selector");
        ensureString(step.contains, "contains");
        await page.waitForSelector(step.selector, {
          timeout: Number.isFinite(step.timeoutMs) ? step.timeoutMs : 30000,
        });
        const text = await page.locator(step.selector).innerText();
        const passed = text.includes(step.contains);
        if (!passed) {
          throw new Error(
            `Step ${index + 1} assertion failed: selector text does not contain expected value`,
          );
        }
        executed.push({
          index: index + 1,
          action,
          selector: step.selector,
          passed: true,
        });
        continue;
      }

      if (action === "screenshot") {
        const outputPath =
          typeof step.outputPath === "string" && step.outputPath.length > 0
            ? step.outputPath
            : `/tmp/executor-${Date.now()}-${index + 1}.png`;
        await page.screenshot({
          path: outputPath,
          fullPage: Boolean(step.fullPage),
        });
        executed.push({ index: index + 1, action, outputPath });
        continue;
      }

      if (action === "extract") {
        const selector =
          typeof step.selector === "string" && step.selector.length > 0
            ? step.selector
            : "body";
        await page.waitForSelector(selector, {
          timeout: Number.isFinite(step.timeoutMs) ? step.timeoutMs : 30000,
        });
        const text = await page.locator(selector).innerText();
        executed.push({
          index: index + 1,
          action,
          selector,
          extractedLength: text.length,
        });
        continue;
      }

      if (action === "evaluate") {
        ensureString(step.script, "script");
        const value = await page.evaluate((source) => {
          return (0, eval)(source);
        }, step.script);
        executed.push({ index: index + 1, action, value });
        continue;
      }
    }

    return {
      workflowId,
      executed,
      finalUrl: page.url(),
      title: await page.title(),
      engine: "playwright",
    };
  } finally {
    await browser.close();
  }
}

async function executeWorkflow(argumentsObject = {}) {
  const steps = Array.isArray(argumentsObject.steps)
    ? argumentsObject.steps
    : [];
  validateWorkflowSteps(steps);

  if (playwrightLib) {
    return executeWorkflowWithPlaywright(steps);
  }

  const executed = [];
  let finalUrl = null;
  let finalTitle = "";

  for (const [index, step] of steps.entries()) {
    const action = step?.action;
    if (typeof action !== "string") {
      throw new Error(`Step ${index + 1} is missing action`);
    }

    if (action === "goto") {
      const targetUrl = ensureHttpUrl(step.url);
      const { stdout } = await runChromium(
        [
          "--headless=new",
          "--disable-gpu",
          "--no-sandbox",
          "--disable-dev-shm-usage",
          "--dump-dom",
          targetUrl,
        ],
        Number.isFinite(step.timeoutMs) ? step.timeoutMs : 30000,
      );

      finalUrl = targetUrl;
      finalTitle = extractTitleFromHtml(stdout);
      executed.push({ action, url: targetUrl });
      continue;
    }

    if (action === "wait") {
      const durationMs = Number.isFinite(step.durationMs)
        ? step.durationMs
        : 500;
      await new Promise((resolve) => setTimeout(resolve, durationMs));
      executed.push({ action, durationMs });
      continue;
    }

    if (
      action === "click" ||
      action === "type" ||
      action === "fill" ||
      action === "assert_text" ||
      action === "evaluate" ||
      action === "extract"
    ) {
      throw new Error(
        `${action} is not supported in chromium-cli mode. Provision full Playwright runtime.`,
      );
    }

    if (action === "screenshot") {
      const outputPath =
        typeof step.outputPath === "string" && step.outputPath.length > 0
          ? step.outputPath
          : `/tmp/executor-${Date.now()}-${index + 1}.png`;

      if (!finalUrl) {
        throw new Error(
          "screenshot requires a previous goto step in chromium-cli mode",
        );
      }

      await runChromium(
        [
          "--headless=new",
          "--disable-gpu",
          "--no-sandbox",
          "--disable-dev-shm-usage",
          "--hide-scrollbars",
          "--window-size=1440,900",
          `--screenshot=${outputPath}`,
          finalUrl,
        ],
        30000,
      );
      executed.push({ action, outputPath });
      continue;
    }
  }

  return {
    executed,
    finalUrl,
    title: finalTitle,
    engine: "chromium-cli",
  };
}

async function callTool(name, args = {}) {
  if (name === "list_tools") {
    return {
      tools: TOOL_DEFINITIONS,
      runtime: playwrightLib ? "playwright" : "chromium-cli",
    };
  }

  if (name === "validate_workflow") {
    const steps = Array.isArray(args.steps) ? args.steps : [];
    validateWorkflowSteps(steps);
    return {
      valid: true,
      steps: steps.length,
      runtime: playwrightLib ? "playwright" : "chromium-cli",
    };
  }

  if (
    name === "run-workflow" ||
    name === "orchestrate" ||
    name === "execute-sequence"
  ) {
    return executeWorkflow(args);
  }

  throw new Error(`Unknown tool: ${name}`);
}

const server = http.createServer(async (req, res) => {
  setCommonHeaders(res);

  if (req.method === "OPTIONS") {
    sendJson(res, 204, {});
    return;
  }

  if (req.url === "/health" && req.method === "GET") {
    sendJson(res, 200, {
      status: "healthy",
      service: "executor-playwright",
      execution: "enabled",
      engine: playwrightLib ? "playwright" : "chromium-cli",
    });
    return;
  }

  if (req.url === "/tools" && req.method === "GET") {
    sendJson(res, 200, {
      service: "executor-playwright",
      tools: TOOL_DEFINITIONS.length,
      examples: ["validate_workflow", "run-workflow", "orchestrate"],
      executable: true,
      engine: playwrightLib ? "playwright" : "chromium-cli",
    });
    return;
  }

  if (req.url === "/info" && req.method === "GET") {
    sendJson(res, 200, {
      name: "Execute Automation Playwright MCP Server",
      version: "3.0.0",
      role: "Complex automation workflows",
      runtime: playwrightLib ? "playwright" : "chromium-cli",
      execution: "real-tools-call",
    });
    return;
  }

  if (req.url === "/tools/call" && req.method === "POST") {
    try {
      const rawBody = await readBody(req);
      const parsed = rawBody ? JSON.parse(rawBody) : {};
      const toolName = parsed?.name;
      const args = parsed?.arguments ?? {};

      if (typeof toolName !== "string" || toolName.length === 0) {
        throw new Error("name is required");
      }

      const result = await callTool(toolName, args);
      sendJson(res, 200, {
        ok: true,
        name: toolName,
        result,
      });
      return;
    } catch (error) {
      sendJson(res, 400, {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      });
      return;
    }
  }

  sendJson(res, 404, { error: "Not found" });
});

server.listen(port, () =>
  console.log(`Execute Automation Playwright server on port ${port}`),
);

process.on("SIGTERM", () => {
  server.close(() => process.exit(0));
});
