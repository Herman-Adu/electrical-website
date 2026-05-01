#!/usr/bin/env node
// scripts/memory-lane-stop.mjs
// Stop hook — creates session entity and flushes observations to Docker
// Triggered by Claude Code Stop hook or manually: node scripts/memory-lane-stop.mjs --manual

import { readFileSync, writeFileSync, renameSync, createReadStream } from 'fs';
import { createInterface } from 'readline';
import { join } from 'path';
import { execSync } from 'child_process';

const PROJECT_ROOT = (() => {
  try { return execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim(); } catch { return process.cwd(); }
})();
const GATEWAY = process.env.MCP_GATEWAY_URL ?? 'http://127.0.0.1:3100';
const IS_MANUAL = process.argv.includes('--manual');

// POST to Docker memory gateway — mirrors pattern from memory-rehydrate.mjs
async function mcpCall(toolName, args, timeoutMs = 5000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch(`${GATEWAY}/memory/tools/call`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: toolName, arguments: args }),
      signal: ctrl.signal,
    });
    clearTimeout(t);
    const raw = await r.text();
    try {
      const data = JSON.parse(raw);
      return data?.content?.[0]?.json ?? data;
    } catch { return null; }
  } catch {
    clearTimeout(t);
    return null;
  }
}

async function checkDockerHealth() {
  try {
    const ctrl = new AbortController();
    setTimeout(() => ctrl.abort(), 3000);
    const r = await fetch(`${GATEWAY}/health`, { signal: ctrl.signal });
    return r.ok;
  } catch { return false; }
}

function readJson(path) {
  try { return JSON.parse(readFileSync(path, 'utf8')); } catch { return null; }
}

function writeJson(filePath, data) {
  const tmp = `${filePath}.tmp`;
  try {
    writeFileSync(tmp, JSON.stringify(data, null, 2) + '\n', 'utf8');
    renameSync(tmp, filePath);
  } catch { /* never fail — Stop hook must not throw */ }
}

// Extract entities array from Docker response (mirrors memory-rehydrate.mjs)
function extractEntities(result) {
  if (!result) return [];
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.nodes)) return result.nodes;
  if (Array.isArray(result?.entities)) return result.entities;
  if (result?.content) {
    try {
      const inner = JSON.parse(
        Array.isArray(result.content) ? result.content[0]?.text ?? '{}' : result.content
      );
      if (Array.isArray(inner?.nodes)) return inner.nodes;
      if (Array.isArray(inner)) return inner;
    } catch { /* ignore */ }
  }
  return [];
}

export function validateCreateEntitiesResponse(result) {
  if (!result) return false;
  if (Array.isArray(result?.entities) && result.entities.length > 0) return true;
  const inner = result?.content?.[0]?.json;
  if (Array.isArray(inner?.entities) && inner.entities.length > 0) return true;
  return false;
}

export function buildRetryMessage(entityName) {
  return `[memory:stop] WARNING: create_entities returned no confirmation for "${entityName}" — Docker may have dropped the write. Config NOT updated to avoid false sync state.`;
}

// Get current git branch
function getCurrentBranch() {
  try { return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8', cwd: PROJECT_ROOT }).trim(); } catch { return 'unknown'; }
}

// Get recent git log for work summary
function getGitLog(n = 5) {
  try { return execSync(`git log --oneline -${n}`, { encoding: 'utf8', cwd: PROJECT_ROOT }).trim(); } catch { return '(git log unavailable)'; }
}

// Build fallback field: last 3 git commits as "hash msg | hash msg | hash msg"
function buildFallback() {
  try {
    const raw = execSync('git log --oneline -3', { encoding: 'utf8', cwd: PROJECT_ROOT }).trim();
    return raw.split('\n').map(l => l.trim()).filter(Boolean).join(' | ');
  } catch { return '(git log unavailable)'; }
}

// Parse stdin JSON from Claude Code Stop hook (non-blocking)
async function parseStdinPayload() {
  return new Promise((resolve) => {
    if (IS_MANUAL || process.stdin.isTTY) {
      resolve(null);
      return;
    }
    let raw = '';
    const timer = setTimeout(() => resolve(null), 2000);
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', chunk => { raw += chunk; });
    process.stdin.on('end', () => {
      clearTimeout(timer);
      try { resolve(JSON.parse(raw.trim())); } catch { resolve(null); }
    });
    process.stdin.on('error', () => { clearTimeout(timer); resolve(null); });
  });
}

// Streaming JSONL token + tool-use counter (avoids loading full transcript into memory)
async function parseTranscriptCosts(transcriptPath) {
  if (!transcriptPath) return { totalTokens: 0, toolUses: 0 };
  return new Promise((resolve) => {
    let totalTokens = 0;
    let toolUses = 0;
    const timer = setTimeout(() => resolve({ totalTokens, toolUses }), 5000);
    try {
      const rl = createInterface({
        input: createReadStream(transcriptPath, { encoding: 'utf8' }),
        crlfDelay: Infinity,
      });
      rl.on('line', (line) => {
        try {
          const obj = JSON.parse(line);
          // Accumulate token usage from assistant messages
          if (obj.type === 'assistant' && obj.message?.usage) {
            const u = obj.message.usage;
            totalTokens += (u.input_tokens || 0) + (u.cache_creation_input_tokens || 0) + (u.cache_read_input_tokens || 0) + (u.output_tokens || 0);
          }
          // Count tool uses
          if (obj.type === 'tool_result' || obj.type === 'tool_use') {
            toolUses++;
          }
        } catch { /* skip malformed lines */ }
      });
      rl.on('close', () => {
        clearTimeout(timer);
        resolve({ totalTokens, toolUses });
      });
      rl.on('error', () => {
        clearTimeout(timer);
        resolve({ totalTokens, toolUses });
      });
    } catch {
      clearTimeout(timer);
      resolve({ totalTokens, toolUses });
    }
  });
}

// Determine next session sequence number for today
async function resolveSessionName(dockerOnline) {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  let maxSeq = 0;

  if (dockerOnline) {
    const result = await mcpCall('search_nodes', { query: `session-${today}` }, 5000);
    const entities = extractEntities(result);
    for (const ent of entities) {
      const name = ent?.name ?? '';
      const match = new RegExp(`^session-${today}-(\\d+)$`).exec(name);
      if (match) {
        const seq = parseInt(match[1], 10);
        if (seq > maxSeq) maxSeq = seq;
      }
    }
  }

  const nextSeq = String(maxSeq + 1).padStart(3, '0');
  return `session-${new Date().toISOString().slice(0, 10)}-${nextSeq}`;
}

async function main() {
  // Phase 1: Read active-branch.json
  const activeBranchPath = join(PROJECT_ROOT, 'config', 'active-branch.json');
  const config = readJson(activeBranchPath) ?? {};
  const entity = config.entity ?? 'electrical-website-state';

  // Proceed if entity exists (always run — no status check needed)
  if (!entity) {
    console.log('[memory:stop] No entity configured in active-branch.json — skipping sync.');
    process.exit(0);
  }

  // Phase 2: Git log + branch detection
  const currentBranch = getCurrentBranch();
  const gitLog = getGitLog(5);

  // Phase 3: Docker health check (3s timeout)
  const dockerOnline = await checkDockerHealth();
  const now = new Date().toISOString();

  // Phase 4: Resolve session name (search Docker for today's sessions)
  const sessionName = await resolveSessionName(dockerOnline);

  // Parse stdin for transcript path (non-blocking)
  const payload = IS_MANUAL ? null : await parseStdinPayload();
  const transcriptPath = payload?.transcript_path ?? null;

  // Stream transcript costs (Phase 5 enrichment)
  const { totalTokens, toolUses } = await parseTranscriptCosts(transcriptPath);

  let entityCreated = false;

  if (dockerOnline) {
    // Phase 5: Create session entity in Docker
    const sessionObs = [
      `work_completed: ${gitLog.slice(0, 200).replace(/\n/g, ' | ')}`,
      `branch: ${currentBranch}`,
      `build_status: unknown`,
      `next_tasks: check git log for continuation`,
      `session_end_at: ${now}`,
      `docker_synced: true`,
    ];
    if (totalTokens > 0) sessionObs.push(`token_count: ${totalTokens}`);
    if (toolUses > 0) sessionObs.push(`tool_uses: ${toolUses}`);

    const createArgs = {
      entities: [{
        name: sessionName,
        entityType: 'session',
        observations: sessionObs,
      }],
    };
    let createResult = await mcpCall('create_entities', createArgs);
    if (validateCreateEntitiesResponse(createResult)) {
      entityCreated = true;
    } else {
      await new Promise(r => setTimeout(r, 500));
      createResult = await mcpCall('create_entities', createArgs);
      if (validateCreateEntitiesResponse(createResult)) {
        entityCreated = true;
      } else {
        console.warn(buildRetryMessage(sessionName));
      }
    }

    // Phase 6: add_observations to lane entity
    await mcpCall('add_observations', {
      observations: [{
        entityName: entity,
        contents: [
          `session_summary: ${gitLog.slice(0, 150).replace(/\n/g, ' | ')} | at: ${now}`,
          `last_accessed_at: ${now}`,
        ],
      }],
    });

    // Phase 7: add_observations to project state
    await mcpCall('add_observations', {
      observations: [{
        entityName: 'electrical-website-state',
        contents: [
          `session_end: branch ${currentBranch}, session ${sessionName} at: ${now}`,
          `next_tasks: check active lane entity for continuation`,
        ],
      }],
    });

    // Phase 8: create_relations
    await mcpCall('create_relations', {
      relations: [
        { from: sessionName, to: entity, relationType: 'documents' },
        { from: sessionName, to: 'electrical-website-state', relationType: 'updates' },
      ],
    });

    console.log(`[memory:stop] Session synced to Docker: ${sessionName}`);
  } else {
    console.log(`[memory:stop] Docker offline — skipping entity creation. Session: ${sessionName}`);
    entityCreated = true; // Docker offline is expected — still update local config
  }

  // Phase 8 (continued): Update active-branch.json — fallback field ONLY
  if (entityCreated) {
    const newFallback = buildFallback();
    const updatedConfig = {
      branch: config.branch ?? currentBranch,
      entity: config.entity ?? entity,
      fallback: newFallback,
      updatedAt: now,
    };
    writeJson(activeBranchPath, updatedConfig);
    console.log(`[memory:stop] active-branch.json updated. fallback: ${newFallback.slice(0, 80)}...`);
  } else {
    console.warn('[memory:stop] Skipping config update — Docker entity creation unconfirmed.');
  }

  // Phase 9 (STUB): writeObsidianSessionNote()
  console.log('[memory:stop] [obsidian:pending — implement in feat/obsidian-integration] Phase 9 skipped');

  // Phase 10 (STUB): writeObsidianDailyNote()
  console.log('[memory:stop] [obsidian:pending — implement in feat/obsidian-integration] Phase 10 skipped');

  // Phase 11 (STUB): mirrorDecisions()
  console.log('[memory:stop] [obsidian:pending — implement in feat/obsidian-integration] Phase 11 skipped');

  // Always exit 0 — never fail session end
  process.exit(0);
}

// Only run main() when executed directly (not when imported by tests)
const isMain = process.argv[1]?.endsWith('memory-lane-stop.mjs');
if (isMain) {
  main().catch(err => {
    console.error(`[memory:stop] Error (non-fatal): ${err?.message ?? String(err)}`);
    process.exit(0);
  });
}
