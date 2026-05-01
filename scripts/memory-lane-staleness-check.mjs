#!/usr/bin/env node
// scripts/memory-lane-staleness-check.mjs
// Weekly ACT-R activation decay scoring for memory lane entities
// Usage:
//   node scripts/memory-lane-staleness-check.mjs --dry-run   (report only, no changes)
//   node scripts/memory-lane-staleness-check.mjs              (apply archival/deletion)

import { readFileSync, writeFileSync, mkdirSync, renameSync, readdirSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const PROJECT_ROOT = (() => {
  try { return execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim(); } catch { return process.cwd(); }
})();
const GATEWAY = process.env.MCP_GATEWAY_URL ?? 'http://127.0.0.1:3100';

const DRY_RUN = process.argv.includes('--dry-run');
const ARCHIVE_THRESHOLD = 0.1;
const DELETE_THRESHOLD = 0.05;
const DECAY_CONSTANT = 0.5; // ACT-R: exp(-d * days)
const MAX_ENTITY_COUNT = 200; // safety guard

// ---- Utility helpers -------------------------------------------------------

async function mcpCall(toolName, args, timeoutMs = 8000) {
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

// Extract entities array from Docker response
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

// ---- Protected entity loader -----------------------------------------------

function loadProtectedEntities() {
  const activeBranchPath = join(PROJECT_ROOT, 'config', 'active-branch.json');
  const data = readJson(activeBranchPath) ?? {};
  const protected_ = new Set(['electrical-website-state']);
  if (data.entity) protected_.add(data.entity);
  return protected_;
}

// ---- ACT-R scoring ---------------------------------------------------------

function extractLastTimestamp(observations) {
  const stamps = observations
    .filter(o => typeof o === 'string' && (
      o.startsWith('last_accessed_at:') ||
      o.startsWith('created_at:') ||
      o.startsWith('opened_at:') ||
      o.startsWith('session_end_at:') ||
      o.startsWith('merged_at:')
    ))
    .map(o => {
      const raw = o.split(/:\s(.+)/)[1]?.trim();
      const d = new Date(raw);
      return isNaN(d.getTime()) ? null : d;
    })
    .filter(Boolean)
    .sort((a, b) => b.getTime() - a.getTime());

  return stamps[0] ?? new Date(Date.now() - 30 * 86400000);
}

function computeScore(entity) {
  const obs = Array.isArray(entity.observations) ? entity.observations : [];
  const lastAccessed = extractLastTimestamp(obs);
  const daysSince = (Date.now() - lastAccessed.getTime()) / 86400000;
  const recency = Math.exp(-DECAY_CONSTANT * daysSince);

  let importance = 0.3;

  if (entity.entityType === 'feature') {
    const obsText = obs.join(' ');
    if (obsText.includes('lane_status: active')) importance = 0.5;
    else if (obsText.includes('lane_status: completed') || obsText.includes('merged')) importance = 0.3;
    else if (obsText.includes('lane_status: abandoned')) importance = 0.1;
  } else if (entity.entityType === 'learning') {
    const impObs = obs.find(o => typeof o === 'string' && o.startsWith('importance:'));
    if (impObs?.includes('high')) importance = 1.0;
    else if (impObs?.includes('medium')) importance = 0.6;
    else importance = 0.3;
  } else if (entity.entityType === 'decision') {
    const impObs = obs.find(o => typeof o === 'string' && o.startsWith('importance:'));
    if (impObs?.includes('high')) importance = 1.0;
    else if (impObs?.includes('medium')) importance = 0.6;
    else importance = 0.3;
  } else if (entity.entityType === 'session') {
    importance = 0.2;
  } else if (entity.entityType === 'plan') {
    importance = obs.some(o => typeof o === 'string' && o.includes('status: active')) ? 0.4 : 0.1;
  }

  const accessCount = obs.filter(o => typeof o === 'string' && o.startsWith('last_accessed_at:')).length;
  if (accessCount > 5) importance = Math.min(1.0, importance + 0.2);

  // ACT-R: 50% recency + 30% importance + 20% similarity (0 — no active context injected)
  return (0.5 * recency) + (0.3 * importance) + (0.2 * 0);
}

function getDaysSince(entity) {
  const obs = Array.isArray(entity.observations) ? entity.observations : [];
  const lastAccessed = extractLastTimestamp(obs);
  return (Date.now() - lastAccessed.getTime()) / 86400000;
}

function getAction(score, daysSince, isProtected) {
  if (isProtected) return 'PROTECTED';
  if (score < DELETE_THRESHOLD && daysSince > 30) return 'DELETE';
  if (score < ARCHIVE_THRESHOLD) return 'ARCHIVE';
  return 'KEEP';
}

// ---- Manifest helpers -------------------------------------------------------

function findManifest(entityId) {
  const lanesDir = join(PROJECT_ROOT, 'config', 'memory-lanes');
  let files;
  try { files = readdirSync(lanesDir); } catch { return null; }
  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    const fullPath = join(lanesDir, file);
    const data = readJson(fullPath);
    if (data?.memoryLane?.id === entityId) return fullPath;
  }
  return null;
}

function archiveManifest(manifestPath) {
  try {
    const archivesDir = join(PROJECT_ROOT, 'config', 'memory-lanes', 'archives');
    mkdirSync(archivesDir, { recursive: true });
    const filename = manifestPath.split(/[\\/]/).pop();
    const destPath = join(archivesDir, filename);
    renameSync(manifestPath, destPath);
    return true;
  } catch { return false; }
}

// ---- Table formatting -------------------------------------------------------

function tableRow(name, type, score, days, action) {
  const pad = (s, n) => String(s).slice(0, n).padEnd(n);
  const padL = (s, n) => String(s).padStart(n);
  return `${pad(name, 48)} | ${pad(type, 8)} | ${padL(score.toFixed(3), 6)} | ${padL(Math.round(days), 5) } | ${action}`;
}

// ---- Main ------------------------------------------------------------------

async function main() {
  console.log(`\n[memory:staleness] ACT-R Decay Scoring${DRY_RUN ? ' (DRY RUN — no changes)' : ' (APPLY MODE)'}`);
  console.log(`Thresholds: archive < ${ARCHIVE_THRESHOLD}, delete < ${DELETE_THRESHOLD} AND age > 30 days\n`);

  // Step 1: Load protected entities
  const protectedEntities = loadProtectedEntities();
  console.log(`Protected entities (${protectedEntities.size}): ${[...protectedEntities].join(', ')}`);

  // Step 2: Docker health check — required, no fallback
  const dockerOnline = await checkDockerHealth();
  if (!dockerOnline) {
    console.error('[memory:staleness] Docker offline — cannot run staleness check without entity access. Exiting safely.');
    process.exit(0);
  }

  // Step 3: read_graph — get all entities
  const graphResult = await mcpCall('read_graph', {}, 10000);
  const allEntities = extractEntities(graphResult);

  if (allEntities.length > MAX_ENTITY_COUNT) {
    console.error(`[memory:staleness] Safety guard: ${allEntities.length} entities exceeds limit of ${MAX_ENTITY_COUNT}. Manual review required.`);
    process.exit(0);
  }

  console.log(`Total entities in graph: ${allEntities.length}`);

  // Step 4: Filter to scoreable types only
  const scoreableTypes = new Set(['feature', 'learning', 'decision', 'session', 'plan']);
  const scoreable = allEntities.filter(e => scoreableTypes.has(e?.entityType));
  console.log(`Scoreable entities: ${scoreable.length}\n`);

  // Step 5: Compute scores
  const scored = scoreable.map(entity => {
    const daysSince = getDaysSince(entity);
    const score = computeScore(entity);
    const isProtected = protectedEntities.has(entity.name);
    const action = getAction(score, daysSince, isProtected);
    return { entity, score, daysSince, isProtected, action };
  });

  // Sort by score ascending (most stale first)
  scored.sort((a, b) => a.score - b.score);

  // Step 6: Print scoring table
  const header = `${'Entity Name'.padEnd(48)} | ${'Type'.padEnd(8)} | ${'Score'.padStart(6)} | ${'Days'.padStart(5)} | Action`;
  const divider = '-'.repeat(Math.max(header.length, 80));
  console.log(header);
  console.log(divider);
  for (const { entity, score, daysSince, action } of scored) {
    console.log(tableRow(entity.name ?? 'unknown', entity.entityType ?? 'unknown', score, daysSince, action));
  }
  console.log(divider + '\n');

  // Step 7: Apply actions (if not dry-run)
  let keptCount = 0;
  let archivedCount = 0;
  let deletedCount = 0;
  const now = new Date().toISOString();

  for (const { entity, score, daysSince, isProtected, action } of scored) {
    if (action === 'KEEP' || action === 'PROTECTED') {
      keptCount++;
      continue;
    }

    if (DRY_RUN) {
      // Count what would happen, but take no action
      if (action === 'ARCHIVE') archivedCount++;
      else if (action === 'DELETE') deletedCount++;
      continue;
    }

    if (action === 'DELETE') {
      const delResult = await mcpCall('delete_entities', { entityNames: [entity.name] });
      if (delResult !== null) {
        console.log(`[memory:staleness] Deleted: ${entity.name} (score: ${score.toFixed(3)}, days: ${Math.round(daysSince)})`);
        deletedCount++;
      }
      const manifestPath = findManifest(entity.name);
      if (manifestPath) archiveManifest(manifestPath);

    } else if (action === 'ARCHIVE') {
      await mcpCall('add_observations', {
        observations: [{
          entityName: entity.name,
          contents: [
            `lane_status: archived`,
            `archived_at: ${now}`,
          ],
        }],
      });
      console.log(`[memory:staleness] Archived: ${entity.name} (score: ${score.toFixed(3)}, days: ${Math.round(daysSince)})`);
      archivedCount++;

      const manifestPath = findManifest(entity.name);
      if (manifestPath) {
        const manifest = readJson(manifestPath) ?? {};
        if (manifest.memoryLane) {
          manifest.memoryLane.status = 'archived';
          writeJson(manifestPath, manifest);
        }
        archiveManifest(manifestPath);
      }
    }
  }

  if (!DRY_RUN) {
    keptCount = scored.length - archivedCount - deletedCount;
  } else {
    keptCount = scored.length - archivedCount - deletedCount;
  }

  // Step 8: Print summary
  const modeLabel = DRY_RUN ? '[DRY RUN] Would' : 'Applied';
  console.log(`Scored: ${scored.length} | Kept: ${keptCount} | ${modeLabel} archive: ${archivedCount} | ${modeLabel} delete: ${deletedCount}`);

  if (DRY_RUN && (archivedCount > 0 || deletedCount > 0)) {
    console.log('\nTo apply these changes:');
    console.log('  node scripts/memory-lane-staleness-check.mjs');
    console.log('  pnpm memory:stale:apply');
  }

  // Step 9: Exit 0
  process.exit(0);
}

main().catch(err => {
  console.error(`[memory:staleness] Error (non-fatal): ${err?.message ?? String(err)}`);
  process.exit(0);
});
