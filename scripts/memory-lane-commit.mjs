#!/usr/bin/env node
// scripts/memory-lane-commit.mjs
// Appends commit metadata to active lane Docker entity (PostCommit hook)

import { readFileSync, writeFileSync, renameSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const GATEWAY = process.env.MCP_GATEWAY_URL ?? 'http://127.0.0.1:3100';
const PROJECT_ROOT = (() => {
  try { return execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim(); } catch { return process.cwd(); }
})();

function readJson(path) {
  try { return JSON.parse(readFileSync(path, 'utf8')); } catch { return null; }
}

function writeJson(path, data) {
  const tmp = `${path}.tmp`;
  try {
    writeFileSync(tmp, JSON.stringify(data, null, 2) + '\n', 'utf8');
    renameSync(tmp, path);
  } catch { /* ignore */ }
}

async function memoryCall(toolName, args, timeoutMs = 1800) {
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
    return res.ok;
  } catch {
    clearTimeout(timer);
    return false;
  }
}

async function checkDockerHealth() {
  try {
    const ctrl = new AbortController();
    setTimeout(() => ctrl.abort(), 1000);
    const r = await fetch(`${GATEWAY}/health`, { signal: ctrl.signal });
    return r.ok;
  } catch { return false; }
}

// Build updated fallback: prepend new commit, keep last 3
function buildUpdatedFallback(currentFallback, newCommitLine) {
  const existing = (currentFallback ?? '').split(' | ').map(s => s.trim()).filter(Boolean);
  const updated = [newCommitLine, ...existing].slice(0, 3);
  return updated.join(' | ');
}

async function main() {
  const activeBranchPath = join(PROJECT_ROOT, 'config', 'active-branch.json');
  const config = readJson(activeBranchPath);

  // Get current git branch
  let currentGitBranch = 'unknown';
  try { currentGitBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8', cwd: PROJECT_ROOT }).trim(); } catch { /* ignore */ }

  // Only run if branch matches configured branch
  if (!config || config.branch !== currentGitBranch) {
    process.exit(0);
  }

  const entity = config.entity ?? 'electrical-website-state';

  // Get commit info
  let commitInfo = 'unknown commit';
  try { commitInfo = execSync('git log -1 --format="%h %s"', { encoding: 'utf8', cwd: PROJECT_ROOT }).trim(); } catch { /* ignore */ }

  // Get changed files (max 10)
  let changedFiles = [];
  try {
    const filesOutput = execSync(
      'git diff HEAD~1 --name-only 2>/dev/null || git show --name-only --format="" HEAD',
      { encoding: 'utf8', cwd: PROJECT_ROOT, shell: '/bin/bash' }
    ).trim();
    changedFiles = filesOutput.split('\n').filter(Boolean).slice(0, 10);
  } catch { /* ignore */ }

  // Build observation string
  const firstThree = changedFiles.slice(0, 3).join(', ');
  const extra = changedFiles.length > 3 ? ` (+${changedFiles.length - 3} more)` : '';
  const filesStr = firstThree ? `files: ${firstThree}${extra}` : 'files: (none)';
  const now = new Date().toISOString();
  const observation = `commit: ${commitInfo} — ${filesStr} | at: ${now}`;

  // Docker health check (1s — hard cutoff)
  const dockerOnline = await checkDockerHealth();

  if (dockerOnline) {
    await memoryCall('add_observations', {
      observations: [{
        entityName: entity,
        contents: [observation],
      }],
    }, 1800);
  }

  // Update active-branch.json — updatedAt + fallback only
  const newFallback = buildUpdatedFallback(config.fallback, commitInfo);
  const updatedConfig = {
    branch: config.branch,
    entity: config.entity,
    fallback: newFallback,
    updatedAt: now,
  };
  writeJson(activeBranchPath, updatedConfig);

  process.exit(0);
}

main().catch(err => {
  // Never block git commit
  process.stderr.write(`[lane:commit] Warning: ${err?.message ?? String(err)}\n`);
  process.exit(0);
});
