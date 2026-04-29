#!/usr/bin/env node
// scripts/memory-lane-stop.mjs
// Stop hook — creates session entity and flushes observations to Docker
// Triggered by Claude Code Stop hook or manually: node scripts/memory-lane-stop.mjs --manual

import { readFileSync, writeFileSync } from 'fs';
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

function writeJson(path, data) {
  try { writeFileSync(path, JSON.stringify(data, null, 2) + '\n', 'utf8'); } catch { /* ignore */ }
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

// Attempt to read transcript file (last 2000 chars)
function readTranscriptTail(transcriptPath) {
  try {
    const content = readFileSync(transcriptPath, 'utf8');
    return content.length > 2000 ? content.slice(-2000) : content;
  } catch { return null; }
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

// Determine next session sequence number for today
async function resolveSessionName(dockerOnline) {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  let maxSeq = 0;

  if (dockerOnline) {
    const result = await mcpCall('search_nodes', { query: `session-${today}` }, 5000);
    const entities = extractEntities(result);
    for (const entity of entities) {
      const name = entity?.name ?? '';
      const match = new RegExp(`^session-${today}-(\\d+)$`).exec(name);
      if (match) {
        const seq = parseInt(match[1], 10);
        if (seq > maxSeq) maxSeq = seq;
      }
    }
  }

  const nextSeq = String(maxSeq + 1).padStart(3, '0');
  return `session-${today}-${nextSeq}`;
}

// Build concise emergency summary (<=150 words)
function buildEmergencySummary(branch, workSummary) {
  // Extract git log portion only — transcript content is raw JSON, not human-readable
  const gitPart = workSummary.includes('| git:')
    ? workSummary.split('| git:').pop().trim()
    : workSummary;
  const truncated = gitPart.slice(0, 200).replace(/\n/g, ' ').trim();
  return `Branch ${branch}. Recent: ${truncated}`.slice(0, 600);
}

async function main() {
  // Step 1: Read active-memory-lanes.json
  const activeLanesPath = join(PROJECT_ROOT, 'config', 'active-memory-lanes.json');
  const lanesConfig = readJson(activeLanesPath) ?? {};

  if (lanesConfig.status !== 'active') {
    console.log('[memory:stop] Lane status is not active — skipping sync.');
    process.exit(0);
  }

  const laneEntityName = lanesConfig.laneEntityName ?? 'electrical-website-state';

  // Step 2: Get work summary
  const currentBranch = getCurrentBranch();
  const gitLog = getGitLog(5);
  let workSummary = gitLog;

  if (!IS_MANUAL) {
    // Try reading from Stop hook stdin payload
    const payload = await parseStdinPayload();
    if (payload?.transcript_path) {
      const transcriptContent = readTranscriptTail(payload.transcript_path);
      if (transcriptContent) {
        // Use transcript tail as enriched context, but still include git log
        workSummary = `${transcriptContent.slice(0, 300).replace(/\n/g, ' ')}... | git: ${gitLog}`;
      }
    }
  }

  // Step 3: Docker health check
  const dockerOnline = await checkDockerHealth();
  const now = new Date().toISOString();

  // Step 4: Determine session entity name
  const sessionName = await resolveSessionName(dockerOnline);

  let entityCreated = false;

  if (dockerOnline) {
    // Step 5: Create session entity — validate response, retry once
    const createArgs = {
      entities: [{
        name: sessionName,
        entityType: 'session',
        observations: [
          `work_completed: ${gitLog.slice(0, 200).replace(/\n/g, ' | ')}`,
          `branch: ${currentBranch}`,
          `build_status: unknown`,
          `next_tasks: check git log for continuation`,
          `session_end_at: ${now}`,
          `docker_synced: true`,
        ],
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

    // Step 6: Add observations to active lane entity
    await mcpCall('add_observations', {
      observations: [{
        entityName: laneEntityName,
        contents: [
          `session_summary: ${gitLog.slice(0, 150).replace(/\n/g, ' | ')} | at: ${now}`,
          `last_accessed_at: ${now}`,
        ],
      }],
    });

    // Step 7: Add observations to project state
    await mcpCall('add_observations', {
      observations: [{
        entityName: 'electrical-website-state',
        contents: [
          `session_end: branch ${currentBranch}, session ${sessionName} at: ${now}`,
          `next_tasks: check active lane entity for continuation`,
        ],
      }],
    });

    // Step 8: Create relations
    await mcpCall('create_relations', {
      relations: [
        { from: sessionName, to: laneEntityName, relationType: 'documents' },
        { from: sessionName, to: 'electrical-website-state', relationType: 'updates' },
      ],
    });

    console.log(`[memory:stop] Session synced to Docker: ${sessionName}`);
  } else {
    console.log(`[memory:stop] Docker offline — skipping entity creation. Session: ${sessionName}`);
    entityCreated = true; // Docker offline is expected — still update local config
  }

  // Step 9: Update active-memory-lanes.json — only when entity write confirmed (or Docker offline)
  if (entityCreated) {
    lanesConfig.lastSyncedAt = now;
    lanesConfig.emergencySummary = buildEmergencySummary(currentBranch, workSummary);
    writeJson(activeLanesPath, lanesConfig);
    console.log(`[memory:stop] local config updated. emergencySummary: ${lanesConfig.emergencySummary.slice(0, 80)}...`);
  } else {
    console.warn('[memory:stop] Skipping config update — Docker entity creation unconfirmed.');
  }

  // Step 10: Always exit 0 — never fail session end
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
