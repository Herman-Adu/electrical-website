#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * GitHub Official MCP Server
 * HTTP adapter proxying to GitHub REST API v2022-11-28
 * Supports: PR management, issue tracking, code search, repo operations
 */

const http = require("http");
const https = require("https");

const port = process.env.PORT || 8000;

// Token safety: log presence only, never the value
const GITHUB_TOKEN = process.env.GITHUB_TOKEN ?? "";
console.log(`GITHUB_TOKEN present: ${GITHUB_TOKEN.length > 0}`);

// Token format validation (GitHub tokens start with specific prefixes)
const GITHUB_TOKEN_PATTERNS = {
  classic: /^ghp_[a-zA-Z0-9]{36}$/, // Classic personal access token
  oauth: /^ghu_[a-zA-Z0-9]{36}$/, // OAuth token
  pat: /^github_pat_[a-zA-Z0-9]{82,93}$/, // Fine-grained PAT
  app: /^ghs_[a-zA-Z0-9]{36}$/, // GitHub App token
  refresh: /^ghr_[a-zA-Z0-9]{36}$/, // Refresh token
};

function isValidTokenFormat(token) {
  if (!token) return false;
  return Object.values(GITHUB_TOKEN_PATTERNS).some((pattern) =>
    pattern.test(token),
  );
}

// Operation scopes: define which operations require token and what level of access
const OPERATION_SCOPES = {
  safe_read: {
    name: "safe_read",
    operations: [
      "get_pull_request",
      "get_issue",
      "get_user",
      "list_pull_requests",
      "search_code",
      "get_pr_checks",
    ],
    description: "Read-only operations on public/private repos",
  },
  repo_write: {
    name: "repo_write",
    operations: ["create_pull_request", "create_issue"],
    description: "Create operations requiring repo write scope",
  },
  repo_admin: {
    name: "repo_admin",
    operations: ["merge_pull_request"],
    description: "Admin operations like PR merging",
  },
};

function getScopeForOperation(operation) {
  for (const [, scope] of Object.entries(OPERATION_SCOPES)) {
    if (scope.operations.includes(operation)) {
      return scope;
    }
  }
  return null;
}

const IDENTIFIER_RE = /^[a-zA-Z0-9._-]{1,100}$/;

const TOOL_DEFINITIONS = [
  { name: "list_tools", description: "Return all supported tool definitions." },
  {
    name: "get_pull_request",
    description:
      "Get a pull request by number. Args: owner, repo, pull_number.",
  },
  {
    name: "list_pull_requests",
    description:
      "List pull requests. Args: owner, repo, state (open|closed|all).",
  },
  {
    name: "create_pull_request",
    description:
      "Create a pull request. Args: owner, repo, title, head, base, body (opt).",
  },
  {
    name: "merge_pull_request",
    description:
      "Merge a pull request. Args: owner, repo, pull_number, merge_method (opt).",
  },
  {
    name: "get_pr_checks",
    description: "Get check runs for a commit ref. Args: owner, repo, ref.",
  },
  {
    name: "create_issue",
    description: "Create an issue. Args: owner, repo, title, body (opt).",
  },
  {
    name: "get_issue",
    description: "Get an issue by number. Args: owner, repo, issue_number.",
  },
  { name: "search_code", description: "Search code on GitHub. Args: query." },
  {
    name: "get_user",
    description:
      "Get a GitHub user. Args: username (opt, defaults to authenticated user).",
  },
];

// --- helpers -----------------------------------------------------------------

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
      if (body.length > 1_000_000) {
        reject(new Error("Request body exceeds 1MB limit"));
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

// --- validation --------------------------------------------------------------

function validateIdentifier(value, fieldName) {
  if (typeof value !== "string" || !IDENTIFIER_RE.test(value)) {
    throw Object.assign(
      new Error(
        `${fieldName} must be a valid identifier (alphanumeric, dots, dashes, underscores)`,
      ),
      { status: 400 },
    );
  }
}

function requireString(args, field) {
  if (typeof args[field] !== "string" || args[field].trim() === "") {
    throw Object.assign(new Error(`${field} is required`), { status: 400 });
  }
}

function requireOwnerRepo(args) {
  requireString(args, "owner");
  requireString(args, "repo");
  validateIdentifier(args.owner, "owner");
  validateIdentifier(args.repo, "repo");
}

function coercePositiveInt(args, field) {
  if (args[field] === undefined || args[field] === null) {
    throw Object.assign(new Error(`${field} is required`), { status: 400 });
  }
  const n = Number(args[field]);
  if (!Number.isInteger(n) || n < 1) {
    throw Object.assign(new Error(`${field} must be a positive integer`), {
      status: 400,
    });
  }
  args[field] = n;
}

function requireToken() {
  if (!GITHUB_TOKEN) {
    throw Object.assign(new Error("GITHUB_TOKEN env var is required"), {
      status: 401,
    });
  }
  // Validate token format for security
  if (!isValidTokenFormat(GITHUB_TOKEN)) {
    console.warn(
      "[Security] GITHUB_TOKEN present but does not match expected GitHub token format",
    );
    throw Object.assign(
      new Error(
        "Invalid GITHUB_TOKEN format. Expected GitHub Personal Access Token or OAuth token",
      ),
      { status: 401 },
    );
  }
}

function validateOperationScope(operation) {
  const scope = getScopeForOperation(operation);
  if (!scope) {
    throw Object.assign(new Error(`Unknown operation: ${operation}`), {
      status: 400,
    });
  }
  // Log scope information for audit trail (without exposing token)
  console.log(`[Audit] Operation '${operation}' requires scope: ${scope.name}`);
  return scope;
}

// --- GitHub REST API client --------------------------------------------------

function githubApiCall(method, path, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const options = {
      hostname: "api.github.com",
      port: 443,
      path,
      method,
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "electrical-website-mcp/1.0",
        "Content-Type": "application/json",
        ...(payload ? { "Content-Length": Buffer.byteLength(payload) } : {}),
      },
    };

    const req = https.request(options, (res) => {
      let raw = "";
      res.on("data", (c) => {
        raw += c;
      });
      res.on("end", () => {
        let data;
        try {
          data = JSON.parse(raw);
        } catch {
          data = raw;
        }
        resolve({
          status: res.statusCode,
          data,
          rateLimitRemaining: res.headers["x-ratelimit-remaining"],
          rateLimitReset: res.headers["x-ratelimit-reset"],
        });
      });
    });

    req.on("error", () => reject(new Error("upstream_unavailable")));
    if (payload) req.write(payload);
    req.end();
  });
}

async function ghCall(method, path, body) {
  const { status, data, rateLimitRemaining, rateLimitReset } =
    await githubApiCall(method, path, body);
  if (status < 200 || status >= 300) {
    const msg =
      typeof data === "object" && data?.message
        ? data.message
        : `GitHub API error ${status}`;
    const err = Object.assign(new Error(msg), { status });
    if (rateLimitRemaining === "0") err.rateLimitReset = rateLimitReset;
    throw err;
  }
  return data;
}

// --- tool dispatcher ---------------------------------------------------------

async function callTool(name, args = {}) {
  if (name === "list_tools") {
    return { tools: TOOL_DEFINITIONS };
  }

  // Validate operation scope before proceeding
  validateOperationScope(name);

  requireToken();

  switch (name) {
    case "get_pull_request":
      requireOwnerRepo(args);
      coercePositiveInt(args, "pull_number");
      return ghCall(
        "GET",
        `/repos/${args.owner}/${args.repo}/pulls/${args.pull_number}`,
        null,
      );

    case "list_pull_requests": {
      requireOwnerRepo(args);
      const state = args.state ?? "open";
      if (!["open", "closed", "all"].includes(state)) {
        throw Object.assign(
          new Error("state must be one of: open, closed, all"),
          { status: 400 },
        );
      }
      return ghCall(
        "GET",
        `/repos/${args.owner}/${args.repo}/pulls?state=${state}`,
        null,
      );
    }

    case "create_pull_request":
      requireOwnerRepo(args);
      requireString(args, "title");
      requireString(args, "head");
      requireString(args, "base");
      return ghCall("POST", `/repos/${args.owner}/${args.repo}/pulls`, {
        title: args.title,
        head: args.head,
        base: args.base,
        body: typeof args.body === "string" ? args.body : "",
      });

    case "merge_pull_request": {
      requireOwnerRepo(args);
      coercePositiveInt(args, "pull_number");
      const mergeMethod = args.merge_method ?? "squash";
      if (!["merge", "squash", "rebase"].includes(mergeMethod)) {
        throw Object.assign(
          new Error("merge_method must be one of: merge, squash, rebase"),
          { status: 400 },
        );
      }
      return ghCall(
        "PUT",
        `/repos/${args.owner}/${args.repo}/pulls/${args.pull_number}/merge`,
        { merge_method: mergeMethod },
      );
    }

    case "get_pr_checks":
      requireOwnerRepo(args);
      requireString(args, "ref");
      return ghCall(
        "GET",
        `/repos/${args.owner}/${args.repo}/commits/${encodeURIComponent(args.ref)}/check-runs`,
        null,
      );

    case "create_issue":
      requireOwnerRepo(args);
      requireString(args, "title");
      return ghCall("POST", `/repos/${args.owner}/${args.repo}/issues`, {
        title: args.title,
        body: typeof args.body === "string" ? args.body : "",
      });

    case "get_issue":
      requireOwnerRepo(args);
      coercePositiveInt(args, "issue_number");
      return ghCall(
        "GET",
        `/repos/${args.owner}/${args.repo}/issues/${args.issue_number}`,
        null,
      );

    case "search_code":
      requireString(args, "query");
      return ghCall(
        "GET",
        `/search/code?q=${encodeURIComponent(args.query)}`,
        null,
      );

    case "get_user":
      if (args.username) {
        validateIdentifier(args.username, "username");
        return ghCall(
          "GET",
          `/users/${encodeURIComponent(args.username)}`,
          null,
        );
      }
      return ghCall("GET", "/user", null);

    default:
      throw Object.assign(new Error(`Unknown tool: ${name}`), { status: 404 });
  }
}

// --- HTTP server -------------------------------------------------------------

const server = http.createServer(async (req, res) => {
  setCommonHeaders(res);

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === "/health" && req.method === "GET") {
    sendJson(res, 200, {
      status: "healthy",
      service: "github-official",
      token_configured: GITHUB_TOKEN.length > 0,
    });
    return;
  }

  if (req.url === "/tools" && req.method === "GET") {
    sendJson(res, 200, {
      service: "github-official",
      tools: TOOL_DEFINITIONS.length,
      examples: [
        "get_pull_request",
        "create_pull_request",
        "list_pull_requests",
        "search_code",
      ],
      ready: true,
    });
    return;
  }

  if (req.url === "/info" && req.method === "GET") {
    sendJson(res, 200, {
      name: "GitHub Official MCP Server",
      version: "2.0.0",
      role: "PR management, issue tracking, code search, repo operations",
      tools_count: TOOL_DEFINITIONS.length,
      tools_call: "enabled",
      mcp_first: true,
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
        throw Object.assign(new Error("name is required"), { status: 400 });
      }

      const result = await callTool(toolName, args);
      sendJson(res, 200, { ok: true, name: toolName, result });
      return;
    } catch (error) {
      const status =
        error?.status >= 400 && error?.status < 600 ? error.status : 400;
      sendJson(res, status, {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      });
      return;
    }
  }

  sendJson(res, 404, { error: "Endpoint not found" });
});

server.listen(port, () => {
  console.log(`GitHub Official server listening on port ${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
