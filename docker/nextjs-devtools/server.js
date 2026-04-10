#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require("node:fs");
const http = require("node:http");
const { spawn } = require("node:child_process");

const port = Number(process.env.PORT || 8000);
const MAX_BODY_BYTES = 1_048_576;
const DEFAULT_RUNTIME_PORTS = [3000, 3001];
const PROJECT_ROOT = process.env.PROJECT_ROOT || "/workspace";

const TOOL_DEFINITIONS = [
  {
    name: "list_tools",
    description: "Return supported Next.js DevTools tool definitions.",
  },
  {
    name: "discover_servers",
    description:
      "Probe configured Next.js dev server ports and return MCP endpoint availability.",
  },
  {
    name: "check_route",
    description:
      "Fetch a route path from a Next.js server and return status diagnostics.",
  },
  {
    name: "run_typecheck",
    description:
      "Run `pnpm exec tsc --noEmit` if workspace is mounted; otherwise returns capability_unavailable.",
  },
  {
    name: "run_build",
    description:
      "Run `pnpm build` if workspace is mounted; otherwise returns capability_unavailable.",
  },
  {
    name: "run_tests",
    description:
      "Run `pnpm exec vitest run` if workspace is mounted; otherwise returns capability_unavailable.",
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

function sendToolError(res, status, code, message, details) {
  sendJson(res, status, {
    ok: false,
    error: {
      code,
      message,
      ...(details ? { details } : {}),
    },
  });
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > MAX_BODY_BYTES) {
        reject(
          Object.assign(
            new Error(`Request body exceeds ${MAX_BODY_BYTES} bytes`),
            { code: "E_BODY_TOO_LARGE" },
          ),
        );
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function ensureNonEmptyString(value, field) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw Object.assign(new Error(`${field} is required`), {
      status: 400,
      code: "E_VALIDATION",
    });
  }
}

function normalizePort(value, field = "port") {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1 || n > 65535) {
    throw Object.assign(new Error(`${field} must be a valid TCP port`), {
      status: 400,
      code: "E_VALIDATION",
    });
  }
  return n;
}

function parseRuntimePorts(args = {}) {
  const fromArgs = Array.isArray(args.ports) ? args.ports : [];
  if (fromArgs.length > 0) {
    return fromArgs.map((value, idx) => normalizePort(value, `ports[${idx}]`));
  }

  const fromEnv = String(process.env.NEXTJS_RUNTIME_PORTS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => Number(value))
    .filter((value) => Number.isInteger(value) && value > 0 && value <= 65535);

  return fromEnv.length > 0 ? fromEnv : DEFAULT_RUNTIME_PORTS;
}

function httpRequest({
  host = "web",
  port: targetPort,
  path,
  method = "GET",
  timeoutMs = 5000,
  body = null,
}) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = http.request(
      {
        host,
        port: targetPort,
        path,
        method,
        headers: {
          "Content-Type": "application/json",
          ...(payload ? { "Content-Length": Buffer.byteLength(payload) } : {}),
        },
        timeout: timeoutMs,
      },
      (res) => {
        let raw = "";
        res.on("data", (chunk) => {
          raw += chunk.toString();
          if (raw.length > 1_500_000) {
            req.destroy(new Error("Response too large"));
          }
        });
        res.on("end", () => {
          resolve({
            status: res.statusCode || 500,
            headers: res.headers,
            body: raw,
          });
        });
      },
    );

    req.on("timeout", () => req.destroy(new Error("Request timeout")));
    req.on("error", reject);
    if (payload) {
      req.write(payload);
    }
    req.end();
  });
}

async function discoverServers(args = {}) {
  const ports = parseRuntimePorts(args);
  const checks = await Promise.all(
    ports.map(async (targetPort) => {
      try {
        const root = await httpRequest({
          port: targetPort,
          path: "/",
          timeoutMs: 3000,
        });
        let mcp = null;
        try {
          mcp = await httpRequest({
            port: targetPort,
            path: "/_next/mcp",
            timeoutMs: 3000,
          });
        } catch {
          mcp = null;
        }
        return {
          port: targetPort,
          reachable: true,
          rootStatus: root.status,
          mcpReachable: Boolean(mcp),
          mcpStatus: mcp ? mcp.status : null,
        };
      } catch (error) {
        return {
          port: targetPort,
          reachable: false,
          error: error instanceof Error ? error.message : String(error),
        };
      }
    }),
  );

  return {
    checkedPorts: ports,
    servers: checks,
  };
}

async function checkRoute(args = {}) {
  const routePath = typeof args.path === "string" ? args.path : "/";
  const targetPort =
    args.port === undefined ? 3000 : normalizePort(args.port, "port");
  if (!routePath.startsWith("/")) {
    throw Object.assign(new Error("path must start with '/'"), {
      status: 400,
      code: "E_VALIDATION",
    });
  }

  const response = await httpRequest({
    port: targetPort,
    path: routePath,
    timeoutMs: Number.isFinite(args.timeoutMs)
      ? Math.max(500, Math.min(Number(args.timeoutMs), 20000))
      : 5000,
  });

  return {
    port: targetPort,
    path: routePath,
    status: response.status,
    contentType: response.headers["content-type"] || null,
    bodyPreview: response.body.slice(0, 400),
  };
}

function isWorkspaceMounted() {
  return (
    fs.existsSync(PROJECT_ROOT) && fs.existsSync(`${PROJECT_ROOT}/package.json`)
  );
}

function runWorkspaceCommand(label, command, args) {
  if (!isWorkspaceMounted()) {
    return Promise.resolve({
      capability: "capability_unavailable",
      reason: "workspace_not_mounted",
      expectedProjectRoot: PROJECT_ROOT,
      command: `${command} ${args.join(" ")}`.trim(),
      label,
    });
  }

  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd: PROJECT_ROOT,
      shell: false,
      stdio: ["ignore", "pipe", "pipe"],
      env: process.env,
    });

    let stdout = "";
    let stderr = "";
    const timeout = setTimeout(() => {
      child.kill("SIGKILL");
      resolve({
        capability: "executed",
        label,
        exitCode: -1,
        timedOut: true,
        stdout: stdout.slice(-12000),
        stderr: stderr.slice(-12000),
      });
    }, 600000);

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("close", (code) => {
      clearTimeout(timeout);
      resolve({
        capability: "executed",
        label,
        exitCode: code,
        timedOut: false,
        stdout: stdout.slice(-12000),
        stderr: stderr.slice(-12000),
      });
    });
  });
}

async function callTool(name, args = {}) {
  if (name === "list_tools") {
    return { tools: TOOL_DEFINITIONS };
  }

  if (name === "discover_servers") {
    return discoverServers(args);
  }

  if (name === "check_route") {
    return checkRoute(args);
  }

  if (name === "run_typecheck") {
    return runWorkspaceCommand("run_typecheck", "pnpm", [
      "exec",
      "tsc",
      "--noEmit",
      "--pretty",
      "false",
    ]);
  }

  if (name === "run_build") {
    return runWorkspaceCommand("run_build", "pnpm", ["build"]);
  }

  if (name === "run_tests") {
    return runWorkspaceCommand("run_tests", "pnpm", ["exec", "vitest", "run"]);
  }

  throw Object.assign(new Error(`Unknown tool: ${name}`), {
    status: 404,
    code: "E_TOOL_NOT_FOUND",
  });
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
      service: "nextjs-devtools",
      workspaceMounted: isWorkspaceMounted(),
      projectRoot: PROJECT_ROOT,
    });
    return;
  }

  if (req.url === "/tools" && req.method === "GET") {
    sendJson(res, 200, {
      service: "nextjs-devtools",
      tools: TOOL_DEFINITIONS.length,
      definitions: TOOL_DEFINITIONS,
      examples: ["discover_servers", "check_route", "run_typecheck"],
      ready: true,
    });
    return;
  }

  if (req.url === "/info" && req.method === "GET") {
    sendJson(res, 200, {
      name: "Next.js DevTools MCP Server",
      version: "2.0.0",
      role: "Runtime diagnostics, route checks, and workspace command wrappers",
      runtime: "node",
      tools_call: "enabled",
    });
    return;
  }

  if (req.url === "/tools/call" && req.method === "POST") {
    try {
      const rawBody = await readBody(req);
      let parsed = {};
      try {
        parsed = rawBody ? JSON.parse(rawBody) : {};
      } catch {
        sendToolError(
          res,
          400,
          "E_JSON_INVALID",
          "Request body must be valid JSON",
        );
        return;
      }

      const name = parsed?.name;
      const args = parsed?.arguments ?? {};

      ensureNonEmptyString(name, "name");
      if (typeof args !== "object" || args === null || Array.isArray(args)) {
        throw Object.assign(new Error("arguments must be an object"), {
          status: 400,
          code: "E_ARGUMENTS_TYPE",
        });
      }

      const result = await callTool(name, args);
      sendJson(res, 200, { ok: true, name, result });
      return;
    } catch (error) {
      const status = Number.isInteger(error?.status) ? error.status : 400;
      const code = error?.code || "E_INTERNAL";
      sendToolError(
        res,
        status,
        code,
        error instanceof Error ? error.message : String(error),
      );
      return;
    }
  }

  sendJson(res, 404, {
    ok: false,
    error: { code: "E_ROUTE_NOT_FOUND", message: "Route not found" },
  });
});

server.listen(port, () =>
  console.log(`Next.js DevTools server on port ${port}`),
);

process.on("SIGTERM", () => {
  server.close(() => process.exit(0));
});
