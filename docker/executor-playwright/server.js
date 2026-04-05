#!/usr/bin/env node
/* eslint-disable no-console */

const http = require("http");
const { execSync, spawn } = require("node:child_process");

const port = process.env.PORT || 8000;

const TOOL_DEFINITIONS = [
  {
    name: "run-workflow",
    description:
      "Execute a browser workflow with goto/wait actions and return execution summary.",
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
      if (body.length > 5_000_000) {
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

async function executeWorkflow(argumentsObject = {}) {
  const steps = Array.isArray(argumentsObject.steps)
    ? argumentsObject.steps
    : [];
  if (steps.length === 0) {
    throw new Error("steps must be a non-empty array");
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
      action === "waitForSelector"
    ) {
      throw new Error(
        `${action} is not supported in chromium-cli mode. Use run-workflow goto/wait or provision full Playwright runtime.`,
      );
    }

    throw new Error(`Unsupported action at step ${index + 1}: ${action}`);
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
    return { tools: TOOL_DEFINITIONS };
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
      engine: "chromium-cli",
    });
    return;
  }

  if (req.url === "/tools" && req.method === "GET") {
    sendJson(res, 200, {
      service: "executor-playwright",
      tools: TOOL_DEFINITIONS.length,
      examples: ["run-workflow", "orchestrate", "execute-sequence"],
      executable: true,
      engine: "chromium-cli",
    });
    return;
  }

  if (req.url === "/info" && req.method === "GET") {
    sendJson(res, 200, {
      name: "Execute Automation Playwright MCP Server",
      version: "2.1.0",
      role: "Complex automation workflows",
      runtime: "chromium-cli",
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
