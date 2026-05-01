#!/usr/bin/env node
// scripts/memory-lane-activate.mjs
// Activates/deactivates memory lanes on git branch switch
// Args (from post-checkout hook): [prevHead, newHead, branchFlag]
// branchFlag = "1" for branch checkout, "0" for file checkout
// When called manually (pnpm lane:activate): no args, reads current branch

import { readFileSync, writeFileSync, renameSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const GATEWAY = process.env.MCP_GATEWAY_URL ?? 'http://127.0.0.1:3100';
const PROJECT_ROOT = (() => {
  try { return execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim(); } catch { return process.cwd(); }
})();

const [,, prevHead, newHead, branchFlag] = process.argv;

// Post-checkout: skip file checkouts (branchFlag === '0')
if (branchFlag === '0' && process.argv[1]?.endsWith('memory-lane-activate.mjs')) process.exit(0);

async function memoryCall(toolName, args, timeoutMs = 4000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${GATEWAY}/memory/tools/call`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: toolName, arguments: args }),
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    const raw = await res.text();
    try { return JSON.parse(raw); } catch { return null; }
  } catch {
    clearTimeout(timer);
    return null;
  }
}

async function checkDockerHealth() {
  try {
    const ctrl = new AbortController();
    setTimeout(() => ctrl.abort(), 1500);
    const r = await fetch(`${GATEWAY}/health`, { signal: ctrl.signal });
    return r.ok;
  } catch { return false; }
}

function readJson(path) {
  try { return JSON.parse(readFileSync(path, 'utf8')); } catch { return null; }
}

export function writeJsonAtomic(filePath, data) {
  const tmp = `${filePath}.tmp`;
  try {
    writeFileSync(tmp, JSON.stringify(data, null, 2) + '\n', 'utf8');
    renameSync(tmp, filePath);
  } catch { /* never fail — best-effort write */ }
}

function writeJson(filePath, data) { writeJsonAtomic(filePath, data); }

export function isAlreadyActive(currentBranch, config) {
  if (!config?.branch) return false;
  return config.branch === currentBranch;
}

// Convert branch name to manifest filename slug
function branchToSlug(branch) {
  return branch
    .replace(/^(feat|fix|chore|refactor|docs|test|style|perf|ci|hotfix)\//, '')
    .replace(/\//g, '-');
}

// Build fallback string from last 3 git commits
function buildFallback3() {
  try {
    const raw = execSync('git log --oneline -3', { encoding: 'utf8', cwd: PROJECT_ROOT }).trim();
    return raw.split('\n').map(l => l.trim()).filter(Boolean).join(' | ');
  } catch { return '(git log unavailable)'; }
}

async function main() {
  // Detect current branch
  let currentBranch = 'unknown';
  try { currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8', cwd: PROJECT_ROOT }).trim(); } catch { /* ignore */ }

  const slug = branchToSlug(currentBranch);
  const manifestPath = join(PROJECT_ROOT, 'config', 'memory-lanes', `${slug}.json`);
  const activeBranchPath = join(PROJECT_ROOT, 'config', 'active-branch.json');

  // Idempotency guard — skip all writes if this branch is already active
  const activeBranchEarly = readJson(activeBranchPath);
  if (isAlreadyActive(currentBranch, activeBranchEarly)) {
    console.log(`[lane:activate] Already active on "${currentBranch}" — no-op.`);
    process.exit(0);
  }

  // Check if manifest exists — auto-create for unregistered branches
  let newManifest = readJson(manifestPath);
  if (!newManifest) {
    // For main branch, always use electrical-website-state
    const entityName = slug === 'main' ? 'electrical-website-state' : `feat-${slug}`;
    const openedAt = new Date().toISOString();
    newManifest = {
      memoryLane: {
        id: entityName,
        branch: currentBranch,
        dockerEntity: entityName,
        status: 'pending',
        openedAt,
        mergedAt: null,
        fallback_summary: `Auto-registered branch: ${currentBranch}`,
      },
    };
    writeJson(manifestPath, newManifest);
    console.log(`[lane:activate] Auto-registered lane ${entityName} for branch "${currentBranch}"`);
    const dockerAvail = await checkDockerHealth();
    if (dockerAvail) {
      await memoryCall('create_entities', {
        entities: [{
          name: entityName,
          entityType: 'feature',
          observations: [
            `branch: ${currentBranch}`,
            `status: pending`,
            `opened_at: ${openedAt}`,
            `auto_registered: true`,
          ],
        }],
      });
    }
  }

  // Read current active-branch.json to get previous lane entity
  const activeBranch = readJson(activeBranchPath) ?? {};
  const previousLaneEntity = activeBranch.entity ?? null;
  const newLaneEntity = newManifest.memoryLane?.dockerEntity ?? newManifest.memoryLane?.id ?? slug;
  const now = new Date().toISOString();

  const dockerOnline = await checkDockerHealth();

  // Pause previous lane if different from new lane
  if (previousLaneEntity && previousLaneEntity !== newLaneEntity) {
    const prevSlug = branchToSlug(activeBranch.branch ?? '');
    const prevManifestPath = join(PROJECT_ROOT, 'config', 'memory-lanes', `${prevSlug}.json`);
    const prevManifest = readJson(prevManifestPath);

    if (prevManifest?.memoryLane) {
      prevManifest.memoryLane.status = 'paused';
      writeJson(prevManifestPath, prevManifest);
    }

    if (dockerOnline) {
      await memoryCall('add_observations', {
        observations: [{
          entityName: previousLaneEntity,
          contents: [`lane_status: paused | paused_at: ${now}`],
        }],
      });
    }

    console.log(`[lane:activate] Paused lane: ${previousLaneEntity}`);
  }

  // Activate new lane manifest
  newManifest.memoryLane.status = 'active';
  writeJson(manifestPath, newManifest);

  if (dockerOnline) {
    await memoryCall('add_observations', {
      observations: [{
        entityName: newLaneEntity,
        contents: [`lane_status: active | resumed_at: ${now}`],
      }],
    });
  }

  // Write active-branch.json — slim format only
  const gitLog3 = buildFallback3();
  const newActiveBranch = {
    branch: currentBranch,
    entity: newLaneEntity,
    fallback: gitLog3,
    updatedAt: now,
  };
  writeJson(activeBranchPath, newActiveBranch);

  console.log(`[lane:activate] Activated lane: ${newLaneEntity} (branch: ${currentBranch})`);
  process.exit(0);
}

// Only run main() when executed directly (not when imported by tests)
if (process.argv[1]?.endsWith('memory-lane-activate.mjs')) {
  main().catch(err => {
    console.error(`[lane:activate] Error: ${err?.message ?? String(err)}`);
    process.exit(0);
  });
}
