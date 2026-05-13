#!/usr/bin/env node
// One-time migration: validate/archive 47 config/memory-lanes/*.json → Docker, then delete
// Run once: node scripts/migrate-memory-lanes.mjs [--dry-run]
// After success: manually delete config/memory-lanes/ and config/active-branch.json

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const DRY_RUN = process.argv.includes('--dry-run');
const GATEWAY = process.env.MCP_GATEWAY_URL ?? 'http://127.0.0.1:3100';
const PROJECT_ROOT = (() => {
  try { return execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim(); }
  catch { return process.cwd(); }
})();

async function mcpCall(name, args, timeoutMs = 6000) {
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

function readJson(p) {
  try { return JSON.parse(readFileSync(p, 'utf8')); } catch { return null; }
}

function branchExists(branch) {
  try {
    const refs = execSync('git branch -a', { encoding: 'utf8' }).trim();
    return refs.split('\n').some(l => l.trim().replace(/^remotes\/origin\//, '') === branch);
  } catch { return false; }
}

const lanesDir = join(PROJECT_ROOT, 'config', 'memory-lanes');
let files;
try { files = readdirSync(lanesDir).filter(f => f.endsWith('.json')); }
catch { console.error(`[migrate] Cannot read ${lanesDir}`); process.exit(1); }

console.log(`[migrate] Found ${files.length} lane manifests. DRY_RUN=${DRY_RUN}\n`);

if (!await dockerHealth()) {
  console.error('[migrate] Docker offline. Start with: pnpm docker:mcp:ready');
  process.exit(1);
}

const ts = new Date().toISOString();
let archived = 0, kept = 0, skipped = 0;

for (const file of files) {
  const data = readJson(join(lanesDir, file));
  if (!data?.memoryLane) { console.log(`  SKIP ${file} — no memoryLane`); skipped++; continue; }

  const { id, branch, status } = data.memoryLane;
  if (!id) { console.log(`  SKIP ${file} — no id`); skipped++; continue; }

  const exists = !branch || branchExists(branch);
  const shouldArchive = !exists || status === 'completed' || status === 'archived';

  if (shouldArchive) {
    console.log(`  ARCHIVE ${id} (branch: ${branch ?? 'none'}, status: ${status})`);
    if (!DRY_RUN) {
      await mcpCall('add_observations', {
        observations: [{
          entityName: id,
          contents: [`lifecycle: archived | reason: branch-gone-or-completed | migrated: ${ts}`]
        }]
      });
    }
    archived++;
  } else {
    console.log(`  KEEP    ${id} (branch: ${branch}, status: ${status})`);
    if (!DRY_RUN) {
      await mcpCall('add_observations', {
        observations: [{
          entityName: id,
          contents: [`lane_status: active | branch: ${branch} | migration_validated: ${ts}`]
        }]
      });
    }
    kept++;
  }
}

console.log(`\n[migrate] Done: ${archived} archived, ${kept} kept active, ${skipped} skipped.`);
if (DRY_RUN) {
  console.log('[migrate] DRY_RUN mode — no Docker writes. Re-run without --dry-run to apply.');
} else {
  console.log('[migrate] Next: verify Docker entities, then delete config/memory-lanes/ and config/active-branch.json');
}
