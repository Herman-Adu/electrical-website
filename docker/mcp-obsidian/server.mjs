import http from "node:http";

const PORT = Number(process.env.PORT || 8000);
const OBSIDIAN_API_KEY = process.env.OBSIDIAN_API_KEY || "";
const OBSIDIAN_PORT = process.env.OBSIDIAN_PORT || "27124";
const OBSIDIAN_HOST = process.env.OBSIDIAN_HOST || "host.docker.internal";
const OBSIDIAN_BASE = `http://${OBSIDIAN_HOST}:${OBSIDIAN_PORT}`;

const TOOL_DEFINITIONS = [
  {
    name: "list_vault_files",
    description: "List all files in the Obsidian vault",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "read_note",
    description: "Read a note from the vault by path",
    inputSchema: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Relative path to the note, e.g. Daily Notes/2026-04-29.md",
        },
      },
      required: ["path"],
    },
  },
  {
    name: "create_or_update_note",
    description: "Create or overwrite a note at the given vault path",
    inputSchema: {
      type: "object",
      properties: {
        path: { type: "string" },
        content: { type: "string", description: "Markdown content" },
      },
      required: ["path", "content"],
    },
  },
  {
    name: "delete_note",
    description: "Delete a note from the vault",
    inputSchema: {
      type: "object",
      properties: {
        path: { type: "string" },
      },
      required: ["path"],
    },
  },
  {
    name: "search_vault",
    description: "Search the vault using a simple text query",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string" },
        contextLength: { type: "number", default: 100 },
      },
      required: ["query"],
    },
  },
  {
    name: "append_to_note",
    description: "Append content to an existing note (creates if not exists)",
    inputSchema: {
      type: "object",
      properties: {
        path: { type: "string" },
        content: { type: "string" },
      },
      required: ["path", "content"],
    },
  },
  {
    name: "open_note_in_obsidian",
    description: "Open a note in the running Obsidian application",
    inputSchema: {
      type: "object",
      properties: {
        path: { type: "string" },
      },
      required: ["path"],
    },
  },
];

// Make an HTTP request to the Obsidian Local REST API
function obsidianRequest(method, path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = `${OBSIDIAN_BASE}${path}`;
    const parsedUrl = new URL(url);

    const reqOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method,
      timeout: 10000,
      headers: {
        Authorization: `Bearer ${OBSIDIAN_API_KEY}`,
        ...options.headers,
      },
    };

    const req = http.request(reqOptions, (res) => {
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => {
        const body = Buffer.concat(chunks).toString("utf8");
        resolve({ statusCode: res.statusCode, body });
      });
    });

    req.on("timeout", () => {
      req.destroy();
      reject(Object.assign(new Error("Request timed out"), { code: "ETIMEDOUT" }));
    });

    req.on("error", (err) => {
      reject(err);
    });

    if (options.body !== undefined) {
      req.write(options.body);
    }

    req.end();
  });
}

// Check whether Obsidian is reachable
async function isObsidianReachable() {
  try {
    const res = await obsidianRequest("GET", "/");
    return res.statusCode < 500;
  } catch (err) {
    return false;
  }
}

// Tool handlers
async function handleListVaultFiles() {
  const res = await obsidianRequest("GET", "/vault/");
  if (res.statusCode < 200 || res.statusCode >= 300) {
    return {
      error: "Obsidian API error",
      status: res.statusCode,
      message: res.body,
    };
  }
  try {
    return JSON.parse(res.body);
  } catch {
    return { raw: res.body };
  }
}

async function handleReadNote(args) {
  const encodedPath = encodeURIComponent(args.path);
  const res = await obsidianRequest("GET", `/vault/${encodedPath}`);
  if (res.statusCode < 200 || res.statusCode >= 300) {
    return {
      error: "Obsidian API error",
      status: res.statusCode,
      message: res.body,
    };
  }
  return { content: res.body, path: args.path };
}

async function handleCreateOrUpdateNote(args) {
  const encodedPath = encodeURIComponent(args.path);
  const res = await obsidianRequest("PUT", `/vault/${encodedPath}`, {
    headers: { "Content-Type": "text/markdown" },
    body: args.content,
  });
  if (res.statusCode < 200 || res.statusCode >= 300) {
    return {
      error: "Obsidian API error",
      status: res.statusCode,
      message: res.body,
    };
  }
  return { success: true, path: args.path, message: "Note created or updated" };
}

async function handleDeleteNote(args) {
  const encodedPath = encodeURIComponent(args.path);
  const res = await obsidianRequest("DELETE", `/vault/${encodedPath}`);
  if (res.statusCode < 200 || res.statusCode >= 300) {
    return {
      error: "Obsidian API error",
      status: res.statusCode,
      message: res.body,
    };
  }
  return { success: true, path: args.path, message: "Note deleted" };
}

async function handleSearchVault(args) {
  const contextLength = args.contextLength ?? 100;
  const encodedQuery = encodeURIComponent(args.query);
  const res = await obsidianRequest(
    "POST",
    `/search/simple/?query=${encodedQuery}&contextLength=${contextLength}`,
  );
  if (res.statusCode < 200 || res.statusCode >= 300) {
    return {
      error: "Obsidian API error",
      status: res.statusCode,
      message: res.body,
    };
  }
  try {
    return JSON.parse(res.body);
  } catch {
    return { raw: res.body };
  }
}

async function handleAppendToNote(args) {
  const encodedPath = encodeURIComponent(args.path);
  const res = await obsidianRequest("POST", `/vault/${encodedPath}`, {
    headers: { "Content-Type": "text/plain" },
    body: args.content,
  });
  if (res.statusCode < 200 || res.statusCode >= 300) {
    return {
      error: "Obsidian API error",
      status: res.statusCode,
      message: res.body,
    };
  }
  return { success: true, path: args.path, message: "Content appended to note" };
}

async function handleOpenNoteInObsidian(args) {
  const encodedPath = encodeURIComponent(args.path);
  const res = await obsidianRequest("POST", `/open/${encodedPath}`);
  if (res.statusCode < 200 || res.statusCode >= 300) {
    return {
      error: "Obsidian API error",
      status: res.statusCode,
      message: res.body,
    };
  }
  return { success: true, path: args.path, message: "Note opened in Obsidian" };
}

// Dispatch tool call
async function callTool(name, args) {
  switch (name) {
    case "list_vault_files":
      return handleListVaultFiles();
    case "read_note":
      return handleReadNote(args);
    case "create_or_update_note":
      return handleCreateOrUpdateNote(args);
    case "delete_note":
      return handleDeleteNote(args);
    case "search_vault":
      return handleSearchVault(args);
    case "append_to_note":
      return handleAppendToNote(args);
    case "open_note_in_obsidian":
      return handleOpenNoteInObsidian(args);
    default:
      return { error: "Unknown tool", message: `No tool named: ${name}` };
  }
}

// HTTP server
const server = http.createServer(async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  // Health check — verify Obsidian is reachable
  if (req.method === "GET" && req.url === "/health") {
    const reachable = await isObsidianReachable();
    if (reachable) {
      res.writeHead(200);
      res.end("OK");
    } else {
      res.writeHead(503);
      res.end("Obsidian offline");
    }
    return;
  }

  // List tools
  if (req.method === "GET" && req.url === "/tools") {
    res.writeHead(200);
    res.end(JSON.stringify(TOOL_DEFINITIONS));
    return;
  }

  // Call a tool
  if (req.method === "POST" && req.url === "/tools/call") {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", async () => {
      let parsed;
      try {
        parsed = JSON.parse(Buffer.concat(chunks).toString("utf8"));
      } catch {
        res.writeHead(400);
        res.end(
          JSON.stringify({
            content: [
              {
                type: "json",
                json: { error: "Invalid JSON", message: "Request body must be valid JSON" },
              },
            ],
          }),
        );
        return;
      }

      const { name, arguments: args = {} } = parsed;

      try {
        const result = await callTool(name, args);
        res.writeHead(200);
        res.end(
          JSON.stringify({ content: [{ type: "json", json: result }] }),
        );
      } catch (err) {
        const isOffline =
          err.code === "ECONNREFUSED" ||
          err.code === "ETIMEDOUT" ||
          err.code === "ENOTFOUND";

        const json = isOffline
          ? {
              error: "Obsidian offline",
              message:
                "Obsidian must be running with Local REST API plugin enabled",
            }
          : {
              error: "Tool execution failed",
              message: err.message || String(err),
            };

        res.writeHead(200);
        res.end(JSON.stringify({ content: [{ type: "json", json }] }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`[obsidian-vault] listening on port ${PORT}`);
  console.log(`[obsidian-vault] Obsidian base URL: ${OBSIDIAN_BASE}`);
});

process.on("SIGTERM", () => {
  server.close(() => process.exit(0));
});
