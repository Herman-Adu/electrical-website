#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * MCP Aggregator — Bridges 9 custom-REST services to MCP Streamable HTTP transport.
 *
 * Discovery runs once at startup calling GET /tools (or POST /tools/call list_tools)
 * on each Docker-internal service hostname. The aggregator then presents all
 * discovered tools via proper MCP JSON-RPC 2.0 to Claude Code.
 *
 * Routing: Claude Code → POST /mcp → Server+Transport → tools/* handlers
 *                                                         ↓
 *                                    POST http://{service}:8000/tools/call
 */

import http from 'node:http';
import { randomUUID } from 'node:crypto';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import {
  isInitializeRequest,
  ListToolsRequestSchema,
  CallToolRequestSchema,
  ErrorCode,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

const PORT = Number(process.env.PORT ?? 8000);
const DISCOVERY_TIMEOUT_MS = 5000;
const CALL_TIMEOUT_MS = 600_000; // 10 minutes for run_build / run_tests

// ── Service registry ──────────────────────────────────────────────────────────

const SERVICES = [
  { name: 'memory-reference',    baseUrl: 'http://memory-reference:8000'    },
  { name: 'github-official',     baseUrl: 'http://github-official:8000'     },
  { name: 'nextjs-devtools',     baseUrl: 'http://nextjs-devtools:8000'     },
  { name: 'playwright',          baseUrl: 'http://playwright:8000'          },
  { name: 'executor-playwright', baseUrl: 'http://executor-playwright:8000' },
  { name: 'sequential-thinking', baseUrl: 'http://sequential-thinking:8000' },
  { name: 'wikipedia',           baseUrl: 'http://wikipedia:8000'           },
  { name: 'youtube-transcript',  baseUrl: 'http://youtube-transcript:8000'  },
  { name: 'openapi-schema',      baseUrl: 'http://openapi-schema:8000'      },
];

// ── Runtime state ─────────────────────────────────────────────────────────────

/**
 * toolRegistry: Map<toolName, { baseUrl: string, serviceName: string }>
 * Populated at startup; immutable after that.
 */
const toolRegistry = new Map();

/**
 * allToolDefs: Array<{ name, description, inputSchema }>
 * Returned verbatim in response to tools/list.
 */
const allToolDefs = [];

let reachableCount = 0;

// ── HTTP helper ───────────────────────────────────────────────────────────────

/**
 * Minimal Node.js HTTP requester. Does not throw on non-2xx status codes.
 * Returns { status: number, body: string }.
 */
function httpPost(url, bodyObj, timeoutMs = DISCOVERY_TIMEOUT_MS) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(bodyObj);
    const parsed = new URL(url);
    const req = http.request(
      {
        hostname: parsed.hostname,
        port: Number(parsed.port) || 80,
        path: parsed.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
      },
      (res) => {
        let raw = '';
        res.on('data', (c) => { raw += c; });
        res.on('end', () => resolve({ status: res.statusCode ?? 0, body: raw }));
      }
    );
    req.setTimeout(timeoutMs, () => { req.destroy(); reject(new Error(`POST ${url} timed out`)); });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function httpGet(url, timeoutMs = DISCOVERY_TIMEOUT_MS) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const req = http.request(
      {
        hostname: parsed.hostname,
        port: Number(parsed.port) || 80,
        path: parsed.pathname,
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      },
      (res) => {
        let raw = '';
        res.on('data', (c) => { raw += c; });
        res.on('end', () => resolve({ status: res.statusCode ?? 0, body: raw }));
      }
    );
    req.setTimeout(timeoutMs, () => { req.destroy(); reject(new Error(`GET ${url} timed out`)); });
    req.on('error', reject);
    req.end();
  });
}

function tryParseJson(raw) {
  try { return JSON.parse(raw); } catch { return null; }
}

// ── Tool discovery ────────────────────────────────────────────────────────────

/**
 * Extracts the tool definitions array from GET /tools response body.
 *
 * Three shapes across services:
 *   shape-A (memory-reference):  { tools: [...objects...] }
 *   shape-B (most services):     { tools: NUMBER, definitions: [...objects...] }
 *   shape-C (github, playwright): { tools: NUMBER }  ← must fallback to list_tools call
 */
function extractDefsFromGetBody(body) {
  if (!body) return null;
  if (Array.isArray(body.tools)) return body.tools;         // shape-A
  if (Array.isArray(body.definitions)) return body.definitions; // shape-B
  return null;                                               // shape-C
}

/**
 * Fetches tool definitions by calling the list_tools tool via POST /tools/call.
 * Used as fallback for shape-C services (github-official, playwright).
 */
async function fetchDefsViaListTools(baseUrl) {
  const { status, body: raw } = await httpPost(
    `${baseUrl}/tools/call`,
    { name: 'list_tools', arguments: {} }
  );
  if (status !== 200) return null;
  const data = tryParseJson(raw);
  if (!data) return null;
  // { ok: true, result: { tools: [...] } }
  if (Array.isArray(data.result?.tools)) return data.result.tools;
  // memory-reference shape (shouldn't reach here but defensive)
  if (Array.isArray(data.content?.[0]?.json?.tools)) return data.content[0].json.tools;
  return null;
}

/**
 * Discovers all tools from one service. Returns count of tools registered.
 */
async function discoverService({ name, baseUrl }) {
  let defs = null;

  try {
    const { status, body: raw } = await httpGet(`${baseUrl}/tools`);
    if (status === 200) {
      defs = extractDefsFromGetBody(tryParseJson(raw));
    }
  } catch (err) {
    console.warn(`[aggregator] ${name}: GET /tools error — ${err.message}`);
  }

  if (!defs) {
    try {
      defs = await fetchDefsViaListTools(baseUrl);
    } catch (err) {
      console.warn(`[aggregator] ${name}: list_tools fallback error — ${err.message}`);
    }
  }

  if (!Array.isArray(defs) || defs.length === 0) {
    console.warn(`[aggregator] ${name}: unreachable or no tools found, skipping`);
    return 0;
  }

  let count = 0;
  for (const tool of defs) {
    if (typeof tool.name !== 'string' || !tool.name) continue;
    if (tool.name === 'list_tools') continue; // internal meta-tool, don't surface
    if (toolRegistry.has(tool.name)) {
      console.warn(`[aggregator] Name collision: '${tool.name}' from ${name} skipped (already registered)`);
      continue;
    }
    toolRegistry.set(tool.name, { baseUrl, serviceName: name });
    allToolDefs.push({
      name: tool.name,
      description: tool.description ?? '',
      inputSchema: tool.inputSchema ?? { type: 'object', properties: {} },
    });
    count++;
  }

  console.log(`[aggregator] ${name}: ${count} tools registered`);
  return count;
}

async function runDiscovery() {
  console.log('[aggregator] Starting tool discovery...');
  const results = await Promise.allSettled(SERVICES.map(discoverService));
  reachableCount = results.filter(
    (r) => r.status === 'fulfilled' && r.value > 0
  ).length;
  console.log(
    `[aggregator] Discovery done: ${allToolDefs.length} tools from ${reachableCount}/${SERVICES.length} services`
  );
}

// ── MCP response normalization ────────────────────────────────────────────────

/**
 * Normalizes upstream /tools/call response into MCP content array.
 *
 * Upstream shapes:
 *   memory-reference: { content: [{ type:"json", json: result }] }
 *   all others:       { ok: true, name, result: {...} }
 *   error:            { ok: false, error: "..." } or HTTP 4xx/5xx
 */
function normalizeCallResponse(status, data, toolName) {
  if (status < 200 || status >= 300) {
    const msg = (typeof data?.error === 'string')
      ? data.error
      : `Upstream HTTP ${status} for tool '${toolName}'`;
    throw new McpError(ErrorCode.InternalError, msg);
  }

  // memory-reference MCP-like wrapper
  if (Array.isArray(data?.content)) {
    return data.content.map((item) =>
      item.type === 'json'
        ? { type: 'text', text: JSON.stringify(item.json) }
        : item
    );
  }

  // Standard { ok: true, result }
  if (data?.ok === true) {
    return [{ type: 'text', text: JSON.stringify(data.result) }];
  }

  // Standard error { ok: false, error }
  if (data?.ok === false) {
    const msg = typeof data.error === 'string'
      ? data.error
      : JSON.stringify(data.error);
    throw new McpError(ErrorCode.InternalError, `Tool '${toolName}' error: ${msg}`);
  }

  // Fallback: stringify whatever arrived
  return [{ type: 'text', text: JSON.stringify(data) }];
}

// ── MCP Server factory ────────────────────────────────────────────────────────

/**
 * Creates a fully configured low-level Server instance with tools/list and
 * tools/call handlers. Uses setRequestHandler because McpServer.registerTool()
 * only accepts Zod schemas, not the plain JSON Schema objects from upstream.
 *
 * A new Server + Transport pair is created per incoming request (stateless mode).
 */
function createServer() {
  const server = new Server(
    { name: 'mcp-aggregator', version: '1.0.0' },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: allToolDefs,
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name: toolName, arguments: args } = request.params;
    const entry = toolRegistry.get(toolName);

    if (!entry) {
      throw new McpError(
        ErrorCode.MethodNotFound,
        `Unknown tool: '${toolName}'`
      );
    }

    const { status, body: raw } = await httpPost(
      `${entry.baseUrl}/tools/call`,
      { name: toolName, arguments: args ?? {} },
      CALL_TIMEOUT_MS
    );

    const data = tryParseJson(raw);
    const content = normalizeCallResponse(status, data, toolName);
    return { content };
  });

  return server;
}

// ── HTTP server ───────────────────────────────────────────────────────────────

// Session state for stateful clients (optional but spec-compliant)
const sessions = new Map();

const httpServer = http.createServer(async (req, res) => {
  const url = req.url ?? '/';

  // Health endpoint
  if (req.method === 'GET' && url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      toolCount: allToolDefs.length,
      servicesReachable: reachableCount,
      totalServices: SERVICES.length,
    }));
    return;
  }

  // MCP endpoint — POST (requests) and GET (SSE streams)
  if (url === '/mcp') {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', (c) => { body += c; });
      req.on('end', async () => {
        const parsed = tryParseJson(body);

        try {
          const sessionId = req.headers['mcp-session-id'];
          let transport;

          if (sessionId && sessions.has(sessionId)) {
            transport = sessions.get(sessionId);
          } else if (!sessionId && isInitializeRequest(parsed)) {
            // New session: create server+transport pair
            const server = createServer();
            transport = new StreamableHTTPServerTransport({
              sessionIdGenerator: () => randomUUID(),
              onsessioninitialized: (sid) => {
                sessions.set(sid, transport);
              },
            });
            transport.onclose = () => {
              const sid = transport.sessionId;
              if (sid) sessions.delete(sid);
            };
            await server.connect(transport);
          } else if (!sessionId && isInitializeRequest(parsed) === false) {
            // Stateless request (no session, not an init) — one-shot
            const server = createServer();
            transport = new StreamableHTTPServerTransport({
              sessionIdGenerator: undefined,
            });
            await server.connect(transport);
          } else {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              jsonrpc: '2.0',
              error: { code: -32000, message: 'Bad Request: invalid session or missing initialize' },
              id: null,
            }));
            return;
          }

          await transport.handleRequest(req, res, parsed);
        } catch (err) {
          console.error('[aggregator] MCP request error:', err);
          if (!res.headersSent) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              jsonrpc: '2.0',
              error: { code: -32603, message: 'Internal server error' },
              id: null,
            }));
          }
        }
      });
      return;
    }

    if (req.method === 'GET') {
      // SSE stream for existing session
      const sessionId = req.headers['mcp-session-id'];
      if (!sessionId || !sessions.has(sessionId)) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Session not found' }));
        return;
      }
      const transport = sessions.get(sessionId);
      await transport.handleRequest(req, res);
      return;
    }

    if (req.method === 'DELETE') {
      const sessionId = req.headers['mcp-session-id'];
      if (sessionId && sessions.has(sessionId)) {
        const transport = sessions.get(sessionId);
        await transport.handleRequest(req, res);
        sessions.delete(sessionId);
      } else {
        res.writeHead(404).end();
      }
      return;
    }

    res.writeHead(405, { Allow: 'GET, POST, DELETE' }).end();
    return;
  }

  res.writeHead(404).end();
});

// ── Startup ───────────────────────────────────────────────────────────────────

await runDiscovery();

httpServer.listen(PORT, () => {
  console.log(`[aggregator] MCP Streamable HTTP server listening on port ${PORT}`);
  console.log(`[aggregator] ${allToolDefs.length} tools available from ${reachableCount} services`);
});

process.on('SIGTERM', () => {
  console.log('[aggregator] SIGTERM received, shutting down');
  httpServer.close(() => process.exit(0));
});
