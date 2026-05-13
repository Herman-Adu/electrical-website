#!/usr/bin/env node
// .claude/mcp/memory-bridge.mjs
// MCP stdio bridge: speaks JSON-RPC 2024-11-05 to Claude Code via stdin/stdout
// Proxies tools/call → http://localhost:3100/memory/tools/call

const GATEWAY = process.env.MCP_GATEWAY_URL ?? 'http://127.0.0.1:3100';
const TOOL_CACHE_TTL = 300_000; // 5 minutes

let toolCache = null;
let toolCacheAt = 0;

async function fetchTools() {
  const now = Date.now();
  if (toolCache && now - toolCacheAt < TOOL_CACHE_TTL) return toolCache;
  try {
    const ctrl = new AbortController();
    setTimeout(() => ctrl.abort(), 5000);
    const res = await fetch(`${GATEWAY}/memory/tools`, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const tools = Array.isArray(data) ? data : (data.tools ?? []);
    toolCache = tools;
    toolCacheAt = now;
    return tools;
  } catch {
    // Hardcoded fallback — all memory-reference tools
    return [
      {
        name: 'create_entities',
        description: 'Create entities in the knowledge graph',
        inputSchema: {
          type: 'object',
          properties: {
            entities: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  entityType: { type: 'string' },
                  observations: { type: 'array', items: { type: 'string' } }
                },
                required: ['name', 'entityType', 'observations']
              }
            }
          },
          required: ['entities']
        }
      },
      {
        name: 'create_relations',
        description: 'Create relations between entities',
        inputSchema: {
          type: 'object',
          properties: {
            relations: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  from: { type: 'string' },
                  to: { type: 'string' },
                  relationType: { type: 'string' }
                },
                required: ['from', 'to', 'relationType']
              }
            }
          },
          required: ['relations']
        }
      },
      {
        name: 'add_observations',
        description: 'Add observations to existing entities',
        inputSchema: {
          type: 'object',
          properties: {
            observations: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  entityName: { type: 'string' },
                  contents: { type: 'array', items: { type: 'string' } }
                },
                required: ['entityName', 'contents']
              }
            }
          },
          required: ['observations']
        }
      },
      {
        name: 'delete_entities',
        description: 'Delete entities from the knowledge graph',
        inputSchema: {
          type: 'object',
          properties: { entityNames: { type: 'array', items: { type: 'string' } } },
          required: ['entityNames']
        }
      },
      {
        name: 'delete_observations',
        description: 'Delete observations from entities',
        inputSchema: {
          type: 'object',
          properties: {
            deletions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  entityName: { type: 'string' },
                  observations: { type: 'array', items: { type: 'string' } }
                },
                required: ['entityName', 'observations']
              }
            }
          },
          required: ['deletions']
        }
      },
      {
        name: 'delete_relations',
        description: 'Delete relations from the knowledge graph',
        inputSchema: {
          type: 'object',
          properties: {
            relations: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  from: { type: 'string' },
                  to: { type: 'string' },
                  relationType: { type: 'string' }
                },
                required: ['from', 'to', 'relationType']
              }
            }
          },
          required: ['relations']
        }
      },
      {
        name: 'read_graph',
        description: 'Read the entire knowledge graph',
        inputSchema: { type: 'object', properties: {} }
      },
      {
        name: 'search_nodes',
        description: 'Search for nodes in the knowledge graph',
        inputSchema: {
          type: 'object',
          properties: { query: { type: 'string' } },
          required: ['query']
        }
      },
      {
        name: 'open_nodes',
        description: 'Open specific nodes by name',
        inputSchema: {
          type: 'object',
          properties: { names: { type: 'array', items: { type: 'string' } } },
          required: ['names']
        }
      }
    ];
  }
}

async function dockerCall(name, args, timeoutMs = 10000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${GATEWAY}/memory/tools/call`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, arguments: args ?? {} }),
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    const raw = await res.text();
    try { return JSON.parse(raw); }
    catch { return { content: [{ type: 'text', text: raw }] }; }
  } catch (err) {
    clearTimeout(timer);
    return {
      content: [{ type: 'text', text: `Memory service unavailable: ${err.message}. Start with: pnpm docker:mcp:ready` }],
      isError: true
    };
  }
}

function send(obj) {
  process.stdout.write(JSON.stringify(obj) + '\n');
}

async function handle(msg) {
  const { jsonrpc = '2.0', id, method, params } = msg;

  if (method === 'initialize') {
    send({
      jsonrpc, id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: { name: 'memory', version: '1.0.0' }
      }
    });
    return;
  }

  if (method === 'initialized') return; // notification — no response

  if (method === 'ping') {
    send({ jsonrpc, id, result: {} });
    return;
  }

  if (method === 'tools/list') {
    const tools = await fetchTools();
    send({ jsonrpc, id, result: { tools } });
    return;
  }

  if (method === 'tools/call') {
    const result = await dockerCall(params?.name, params?.arguments);
    send({ jsonrpc, id, result });
    return;
  }

  // Unknown method — only respond if request (has id)
  if (id != null) {
    send({ jsonrpc, id, error: { code: -32601, message: `Method not found: ${method}` } });
  }
}

// Read newline-delimited JSON from stdin
let buf = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', async (chunk) => {
  buf += chunk;
  const lines = buf.split('\n');
  buf = lines.pop() ?? ''; // keep incomplete last line
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const msg = JSON.parse(trimmed);
      await handle(msg);
    } catch { /* skip malformed messages */ }
  }
});

process.stdin.on('end', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));
process.on('SIGINT', () => process.exit(0));
