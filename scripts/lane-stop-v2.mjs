#!/usr/bin/env node
// scripts/lane-stop-v2.mjs
// Claude Code Stop hook — creates session entity, syncs observations to Docker
// No config file reads or writes.
// Called by: settings.json Stop hook, or manually: node scripts/lane-stop-v2.mjs --manual

import { createReadStream } from 'fs';
import { createInterface } from 'readline';
import { execSync } from 'child_process';

const GATEWAY = process.env.MCP_GATEWAY_URL ?? 'http://127.0.0.1:3100';
const IS_MANUAL = process.argv.includes('--manual');

async function mcpCall(name, args, timeoutMs = 5000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch(`${GATEWAY}/memory/tools/call`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, arguments: args }),
      signal: ctrl.signal,
    });
    clearTimeout(t);
    const raw = await r.text();
    try { return JSON.parse(raw); } catch { return null; }
  } catch { clearTimeout(t); return null; }
}

async function dockerHealth() {
  try {
    const ctrl = new AbortController();
    setTimeout(() => ctrl.abort(), 3000);
    const r = await fetch(`${GATEWAY}/health`, { signal: ctrl.signal });
    return r.ok;
  } catch { return false; }
}

function run(cmd) {
  try { return execSync(cmd, { encoding: 'utf8' }).trim(); } catch { return ''; }
}

function branchToEntity(branch) {
  if (!branch || branch === 'main' || branch === 'master') {
    return 'nexgen-electrical-innovations-state';
  }
  return branch.toLowerCase().replace(/\//g, '-').replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

async function getContextPct(transcriptPath) {
  if (!transcriptPath) return null;
  try {
    const LIMIT = 200_000;
    return await new Promise((resolve) => {
      const seen = new Map();
      const rl = createInterface({
        input: createReadStream(transcriptPath, { encoding: 'utf8' }),
        crlfDelay: Infinity,
      });
      rl.on('line', (line) => {
        try {
          const obj = JSON.parse(line);
          if (obj.type === 'assistant' && obj.requestId && obj.message?.usage) {
            seen.set(obj.requestId, obj);
          }
        } catch { /* skip */ }
      });
      rl.on('close', () => {
        if (!seen.size) { resolve(null); return; }
        const u = [...seen.values()].at(-1).message.usage;
        const total = (u.input_tokens ?? 0) + (u.cache_creation_input_tokens ?? 0) + (u.cache_read_input_tokens ?? 0);
        resolve(Math.min(100, (total / LIMIT) * 100));
      });
      rl.on('error', () => resolve(null));
      setTimeout(() => { rl.close(); resolve(null); }, 3000);
    });
  } catch { return null; }
}

async function readStdinJson() {
  if (process.stdin.isTTY || IS_MANUAL) return null;
  return new Promise((resolve) => {
    let raw = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (c) => { raw += c; });
    process.stdin.on('end', () => { try { resolve(JSON.parse(raw.trim())); } catch { resolve(null); } });
    process.stdin.on('error', () => resolve(null));
    setTimeout(() => resolve(null), 2000);
  });
}

async function main() {
  const input = await readStdinJson();
  const transcriptPath = input?.transcript_path ?? null;

  if (!await dockerHealth()) {
    process.exit(0); // Docker offline — silent skip
  }

  const branch = run('git branch --show-current') || 'main';
  const entity = branchToEntity(branch);
  const lastCommit = run('git log --oneline -1');
  const ts = new Date().toISOString();
  const ctxPct = transcriptPath ? await getContextPct(transcriptPath) : null;

  // Generate session sequence number
  const today = ts.slice(0, 10);
  const search = await mcpCall('search_nodes', { query: `session-${today}` });
  const existingToday = (search?.entities ?? []).filter(e => e.name?.startsWith(`session-${today}`)).length;
  const seq = String(existingToday + 1).padStart(3, '0');
  const sessionName = `session-${today}-${seq}`;

  // Create session entity
  await mcpCall('create_entities', {
    entities: [{
      name: sessionName,
      entityType: 'session',
      observations: [
        `branch: ${branch}`,
        `entity: ${entity}`,
        `last_commit: ${lastCommit}`,
        `stopped_at: ${ts}`,
        ...(ctxPct !== null ? [`context_pct: ${ctxPct.toFixed(1)}%`] : [])
      ]
    }]
  });

  // Update project state
  await mcpCall('add_observations', {
    observations: [{
      entityName: entity,
      contents: [
        `lane_status: stopped | stopped_at: ${ts}`,
        `last_commit: ${lastCommit}`
      ]
    }]
  });

  // Wire session → project state
  await mcpCall('create_relations', {
    relations: [{
      from: sessionName,
      to: entity,
      relationType: 'updates'
    }]
  });

  process.exit(0);
}

main().catch(() => process.exit(0)); // never block Claude Code Stop
