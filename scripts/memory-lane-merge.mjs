#!/usr/bin/env node
// scripts/memory-lane-merge.mjs
// PR merge handler — marks feature entity as completed in Docker
// Triggered by GitHub Actions on PR merge, or manually:
//   node scripts/memory-lane-merge.mjs feat-contact-form-light-theme-polish

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const PROJECT_ROOT = (() => {
  try { return execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim(); } catch { return process.cwd(); }
})();
const GATEWAY = process.env.MCP_GATEWAY_URL ?? 'http://127.0.0.1:3100';

// CLI arg 1: Docker entity name (e.g. feat-contact-form-light-theme-polish)
const entityName = process.argv[2] ?? '';

// Env vars from GitHub Actions
const GITHUB_PR_NUMBER = process.env.GITHUB_PR_NUMBER ?? 'unknown';
const GITHUB_SHA = process.env.GITHUB_SHA ?? '';
const GITHUB_REF_NAME = process.env.GITHUB_REF_NAME ?? '';

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

// Scan config/memory-lanes/ for a manifest matching the entity name
function findManifestPath(entityId) {
  const lanesDir = join(PROJECT_ROOT, 'config', 'memory-lanes');
  let files;
  try { files = readdirSync(lanesDir); } catch { return null; }

  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    const fullPath = join(lanesDir, file);
    const data = readJson(fullPath);
    if (data?.memoryLane?.id === entityId) {
      return fullPath;
    }
  }
  return null;
}

async function main() {
  const now = new Date().toISOString();

  // Step 1: Validate entity name
  if (!entityName || !/^feat-[a-z0-9-]+$/.test(entityName)) {
    console.error(`[memory:merge] Invalid or missing entity name: "${entityName}". Must match /^feat-[a-z0-9-]+$/`);
    console.error('Usage: node scripts/memory-lane-merge.mjs feat-my-feature-name');
    process.exit(0);
  }

  console.log(`[memory:merge] Processing merge for entity: ${entityName}`);

  // Step 2: Find manifest file
  const manifestPath = findManifestPath(entityName);
  if (!manifestPath) {
    console.log(`[memory:merge] No manifest found for entity "${entityName}" in config/memory-lanes/. Continuing with Docker-only update.`);
  }

  // Step 3: Docker health check
  const dockerOnline = await checkDockerHealth();
  let dockerSynced = false;

  if (!dockerOnline) {
    console.log('[memory:merge] Docker offline — updating local files only.');
  }

  // Step 4: Add observations to feature entity in Docker
  if (dockerOnline) {
    const mergeObs = [
      `lane_status: completed`,
      `merged_at: ${now}`,
      `merged_pr: PR#${GITHUB_PR_NUMBER}`,
      `merge_sha: ${GITHUB_SHA ? GITHUB_SHA.slice(0, 7) : 'unknown'}`,
    ];

    const result = await mcpCall('add_observations', {
      observations: [{
        entityName,
        contents: mergeObs,
      }],
    });

    dockerSynced = result !== null;
    if (dockerSynced) {
      console.log(`[memory:merge] Docker entity "${entityName}" marked completed.`);
    } else {
      console.log(`[memory:merge] Warning: Docker call returned null for entity "${entityName}".`);
    }
  }

  // Step 5: Update manifest file
  if (manifestPath) {
    const manifest = readJson(manifestPath) ?? {};
    if (manifest.memoryLane) {
      manifest.memoryLane.status = 'completed';
      manifest.memoryLane.mergedAt = now;
      writeJson(manifestPath, manifest);
      console.log(`[memory:merge] Manifest updated: ${manifestPath}`);
    }
  }

  // Step 6: phaseSequence removed — active-branch.json has no phaseSequence field
  // Docker entity already updated in Step 4 above

  // Step 7: Print JSON summary for GitHub Actions step output
  const summary = {
    entity: entityName,
    status: 'completed',
    dockerSynced,
    mergedAt: now,
    pr: GITHUB_PR_NUMBER,
    sha: GITHUB_SHA ? GITHUB_SHA.slice(0, 7) : 'unknown',
    ref: GITHUB_REF_NAME,
  };

  console.log('\n--- Memory Merge Summary ---');
  console.log(JSON.stringify(summary, null, 2));

  // Step 8: Always exit 0
  process.exit(0);
}

main().catch(err => {
  console.error(`[memory:merge] Error (non-fatal): ${err?.message ?? String(err)}`);
  process.exit(0);
});
