#!/usr/bin/env node
/* eslint-disable no-console */

const crypto = require("node:crypto");
const http = require("node:http");

const port = Number(process.env.PORT || 8000);
const MAX_BODY_BYTES = 1_048_576;
const chains = new Map();

const TOOL_DEFINITIONS = [
  {
    name: "list_tools",
    description: "Return supported sequential-thinking tool definitions.",
  },
  {
    name: "start_chain",
    description:
      "Start a reasoning chain. Args: goal (string), totalThoughts (optional positive int).",
  },
  {
    name: "add_thought",
    description:
      "Append a thought. Args: chainId, thought, nextThoughtNeeded (bool), isRevision (opt), revisesThought (opt), branchId (opt), branchFromThought (opt).",
  },
  {
    name: "revise_thought",
    description:
      "Convenience alias for add_thought with isRevision=true. Args: chainId, revisesThought, thought.",
  },
  {
    name: "branch_thought",
    description:
      "Convenience alias for add_thought with branch metadata. Args: chainId, branchFromThought, branchId, thought.",
  },
  {
    name: "get_chain",
    description: "Get a chain and all thoughts. Args: chainId.",
  },
  {
    name: "finalize_chain",
    description:
      "Finalize a chain with conclusion. Args: chainId, conclusion. Automatically marks closed.",
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

function ensureString(value, field) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw Object.assign(new Error(`${field} is required`), {
      status: 400,
      code: "E_VALIDATION",
    });
  }
}

function ensurePositiveInt(value, field) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1) {
    throw Object.assign(new Error(`${field} must be a positive integer`), {
      status: 400,
      code: "E_VALIDATION",
    });
  }
  return n;
}

function getChainOrThrow(chainId) {
  ensureString(chainId, "chainId");
  const chain = chains.get(chainId);
  if (!chain) {
    throw Object.assign(new Error(`Unknown chainId: ${chainId}`), {
      status: 404,
      code: "E_CHAIN_NOT_FOUND",
    });
  }
  return chain;
}

function createThought(payload, chain) {
  ensureString(payload.thought, "thought");
  const thoughtNumber = chain.thoughts.length + 1;
  const thought = {
    thoughtNumber,
    totalThoughts:
      payload.totalThoughts === undefined
        ? chain.totalThoughts
        : ensurePositiveInt(payload.totalThoughts, "totalThoughts"),
    thought: payload.thought.trim(),
    nextThoughtNeeded:
      payload.nextThoughtNeeded === undefined
        ? true
        : Boolean(payload.nextThoughtNeeded),
    isRevision: Boolean(payload.isRevision),
    revisesThought:
      payload.revisesThought === undefined
        ? null
        : ensurePositiveInt(payload.revisesThought, "revisesThought"),
    branchId:
      payload.branchId === undefined || payload.branchId === null
        ? null
        : String(payload.branchId),
    branchFromThought:
      payload.branchFromThought === undefined ||
      payload.branchFromThought === null
        ? null
        : ensurePositiveInt(payload.branchFromThought, "branchFromThought"),
    needsMoreThoughts: Boolean(payload.needsMoreThoughts),
    createdAt: new Date().toISOString(),
  };

  if (thought.isRevision && !thought.revisesThought) {
    throw Object.assign(
      new Error("revisesThought is required when isRevision is true"),
      {
        status: 400,
        code: "E_VALIDATION",
      },
    );
  }

  if (thought.branchId && !thought.branchFromThought) {
    throw Object.assign(
      new Error("branchFromThought is required when branchId is provided"),
      {
        status: 400,
        code: "E_VALIDATION",
      },
    );
  }

  if (thought.revisesThought && thought.revisesThought >= thoughtNumber) {
    throw Object.assign(
      new Error("revisesThought must refer to an earlier thought"),
      {
        status: 400,
        code: "E_VALIDATION",
      },
    );
  }

  if (thought.branchFromThought && thought.branchFromThought >= thoughtNumber) {
    throw Object.assign(
      new Error("branchFromThought must refer to an earlier thought"),
      {
        status: 400,
        code: "E_VALIDATION",
      },
    );
  }

  return thought;
}

async function callTool(name, args = {}) {
  if (name === "list_tools") {
    return { tools: TOOL_DEFINITIONS };
  }

  if (name === "start_chain") {
    ensureString(args.goal, "goal");
    const chainId =
      args.chainId && String(args.chainId).trim().length > 0
        ? String(args.chainId)
        : `chain_${crypto.randomUUID()}`;

    if (chains.has(chainId)) {
      throw Object.assign(new Error(`chainId already exists: ${chainId}`), {
        status: 400,
        code: "E_CHAIN_EXISTS",
      });
    }

    const chain = {
      chainId,
      goal: String(args.goal).trim(),
      totalThoughts:
        args.totalThoughts === undefined
          ? 8
          : ensurePositiveInt(args.totalThoughts, "totalThoughts"),
      status: "active",
      startedAt: new Date().toISOString(),
      finalizedAt: null,
      conclusion: null,
      thoughts: [],
    };

    chains.set(chainId, chain);
    return {
      chainId,
      status: chain.status,
      totalThoughts: chain.totalThoughts,
    };
  }

  if (name === "add_thought") {
    const chain = getChainOrThrow(args.chainId);
    if (chain.status !== "active") {
      throw Object.assign(
        new Error("Cannot add thought to a finalized chain"),
        {
          status: 400,
          code: "E_CHAIN_FINALIZED",
        },
      );
    }

    const thought = createThought(args, chain);
    chain.totalThoughts = thought.totalThoughts;
    chain.thoughts.push(thought);

    return {
      chainId: chain.chainId,
      thought,
      thoughtCount: chain.thoughts.length,
      status: chain.status,
    };
  }

  if (name === "revise_thought") {
    const merged = {
      ...args,
      isRevision: true,
      nextThoughtNeeded:
        args.nextThoughtNeeded === undefined
          ? true
          : Boolean(args.nextThoughtNeeded),
    };
    return callTool("add_thought", merged);
  }

  if (name === "branch_thought") {
    const merged = {
      ...args,
      branchId:
        args.branchId === undefined || String(args.branchId).trim().length === 0
          ? `branch_${Date.now()}`
          : String(args.branchId),
      nextThoughtNeeded:
        args.nextThoughtNeeded === undefined
          ? true
          : Boolean(args.nextThoughtNeeded),
    };
    return callTool("add_thought", merged);
  }

  if (name === "get_chain") {
    const chain = getChainOrThrow(args.chainId);
    return {
      chain,
      thoughtCount: chain.thoughts.length,
    };
  }

  if (name === "finalize_chain") {
    const chain = getChainOrThrow(args.chainId);
    ensureString(args.conclusion, "conclusion");
    chain.status = "finalized";
    chain.finalizedAt = new Date().toISOString();
    chain.conclusion = args.conclusion.trim();
    return {
      chainId: chain.chainId,
      status: chain.status,
      finalizedAt: chain.finalizedAt,
      thoughtCount: chain.thoughts.length,
      conclusion: chain.conclusion,
    };
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
      service: "sequential-thinking",
      activeChains: Array.from(chains.values()).filter(
        (chain) => chain.status === "active",
      ).length,
      totalChains: chains.size,
    });
    return;
  }

  if (req.url === "/tools" && req.method === "GET") {
    sendJson(res, 200, {
      service: "sequential-thinking",
      tools: TOOL_DEFINITIONS.length,
      definitions: TOOL_DEFINITIONS,
      examples: ["start_chain", "add_thought", "finalize_chain"],
      ready: true,
    });
    return;
  }

  if (req.url === "/info" && req.method === "GET") {
    sendJson(res, 200, {
      name: "Sequential Thinking MCP Server",
      version: "2.0.0",
      role: "Structured reasoning chains with revision/branch support",
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
      ensureString(name, "name");

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
      const status = Number.isInteger(error?.status) ? error.status : 500;
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
  console.log(`Sequential Thinking server on port ${port}`),
);

process.on("SIGTERM", () => {
  server.close(() => process.exit(0));
});
