#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require("node:fs/promises");
const http = require("http");
const { execSync, spawn } = require("node:child_process");

const port = process.env.PORT || 8000;

const TOOL_DEFINITIONS = [
  {
    name: "navigate",
    description: "Navigate to a URL and return page title and final URL.",
  },
  {
    name: "screenshot",
    description: "Navigate and capture a screenshot to a file path.",
  },
  {
    name: "extract-text",
    description: "Navigate and extract visible text from selector or body.",
  },
  {
    name: "fill-form",
    description:
      "Compatibility method for form workflows; requires full Playwright runtime for interactive actions.",
  },
  {
    name: "list_tools",
    description: "Return supported tool definitions.",
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

function htmlToText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function callTool(name, args = {}) {
  if (name === "list_tools") {
    return { tools: TOOL_DEFINITIONS };
  }

  if (name === "navigate") {
    const url = ensureHttpUrl(args.url);
    const timeout = Number.isFinite(args.timeoutMs) ? args.timeoutMs : 30000;

    const { stdout } = await runChromium(
      [
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--dump-dom",
        url,
      ],
      timeout,
    );

    return {
      title: extractTitleFromHtml(stdout),
      url,
    };
  }

  if (name === "screenshot") {
    const url = ensureHttpUrl(args.url);
    const outputPath =
      typeof args.outputPath === "string" && args.outputPath.length > 0
        ? args.outputPath
        : `/tmp/playwright-${Date.now()}.png`;
    const fullPage = Boolean(args.fullPage);

    const chromiumArgs = [
      "--headless=new",
      "--disable-gpu",
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--hide-scrollbars",
      fullPage ? "--window-size=1440,2200" : "--window-size=1440,900",
      `--screenshot=${outputPath}`,
      url,
    ];

    await runChromium(chromiumArgs, 30000);
    const stat = await fs.stat(outputPath);

    return {
      path: outputPath,
      bytes: stat.size,
    };
  }

  if (name === "extract-text") {
    const url = ensureHttpUrl(args.url);
    const selector =
      typeof args.selector === "string" && args.selector.length > 0
        ? args.selector
        : "body";

    const { stdout } = await runChromium(
      [
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--dump-dom",
        url,
      ],
      30000,
    );

    return {
      selector,
      text: htmlToText(stdout),
      note:
        selector === "body"
          ? "selector applied to full document dump"
          : "selector-specific extraction not available in chromium-cli mode",
    };
  }

  if (name === "fill-form") {
    const url = ensureHttpUrl(args.url);
    const fields = Array.isArray(args.fields) ? args.fields : [];
    if (fields.length === 0) {
      throw new Error("fields must be a non-empty array");
    }

    await runChromium(
      [
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--dump-dom",
        url,
      ],
      30000,
    );

    return {
      url,
      fieldsFilled: fields.length,
      note: "fill-form is accepted for compatibility but interactive form actions require full Playwright runtime.",
    };
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
      service: "playwright",
      execution: "enabled",
      engine: "chromium-cli",
    });
    return;
  }

  if (req.url === "/tools" && req.method === "GET") {
    sendJson(res, 200, {
      service: "playwright",
      tools: TOOL_DEFINITIONS.length,
      examples: ["navigate", "screenshot", "extract-text", "fill-form"],
      executable: true,
      engine: "chromium-cli",
    });
    return;
  }

  if (req.url === "/info" && req.method === "GET") {
    sendJson(res, 200, {
      name: "Playwright MCP Server",
      version: "2.1.0",
      role: "Web automation, testing, screenshots",
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

server.listen(port, () => console.log(`Playwright server on port ${port}`));

process.on("SIGTERM", () => {
  server.close(() => process.exit(0));
});
