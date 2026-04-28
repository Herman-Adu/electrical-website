#!/usr/bin/env node
// scripts/memory-status.mjs
// Human-readable terminal health report for the memory lane system
// Usage: pnpm memory:status  OR  node scripts/memory-status.mjs

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { execSync, spawnSync } from 'child_process';

const PROJECT_ROOT = (() => {
  try { return execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim(); } catch { return process.cwd(); }
})();
const GATEWAY = process.env.MCP_GATEWAY_URL ?? 'http://127.0.0.1:3100';

// ---- Utility helpers -------------------------------------------------------

function readJson(path) {
  try { return JSON.parse(readFileSync(path, 'utf8')); } catch { return null; }
}

function fileExists(p) {
  try { return existsSync(p); } catch { return false; }
}

async function checkDockerHealth() {
  try {
    const ctrl = new AbortController();
    setTimeout(() => ctrl.abort(), 2000);
    const r = await fetch(`${GATEWAY}/health`, { signal: ctrl.signal });
    return r.ok;
  } catch { return false; }
}

function getCurrentBranch() {
  try { return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8', cwd: PROJECT_ROOT }).trim(); } catch { return 'unknown'; }
}

// Format time elapsed since an ISO8601 timestamp
function formatTimeSince(isoStr) {
  if (!isoStr) return 'never';
  const then = new Date(isoStr);
  if (isNaN(then.getTime())) return 'unknown';
  const diffMs = Date.now() - then.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffH = Math.floor(diffMin / 60);
  const remMin = diffMin % 60;
  if (diffH < 24) return `${diffH}h ${remMin}m ago`;
  const diffD = Math.floor(diffH / 24);
  return `${diffD}d ago`;
}

// Approximate token count: words * 1.33
function countTokens(text) {
  if (!text) return 0;
  return Math.ceil(text.split(/\s+/).length * 1.33);
}

// Count words in a string
function wordCount(str) {
  if (!str) return 0;
  return str.trim().split(/\s+/).filter(Boolean).length;
}

// Box-drawing title line
function boxTitle(title, width = 48) {
  const inner = ` ${title} `;
  const pad = Math.max(0, width - inner.length);
  const left = Math.floor(pad / 2);
  const right = pad - left;
  return `╔${'═'.repeat(left + inner.length + right)}╗\n║${' '.repeat(left)}${inner}${' '.repeat(right)}║\n╚${'═'.repeat(left + inner.length + right)}╝`;
}

// Status check/cross icon
const OK = '✓';
const FAIL = '✗';
const WARN = '⚠';

// ---- Run memory-rehydrate --verbose in subprocess, extract token counts ----
function runRehydrateVerbose() {
  try {
    const result = spawnSync('node', [
      join(PROJECT_ROOT, 'scripts', 'memory-rehydrate.mjs'),
      '--verbose',
    ], {
      encoding: 'utf8',
      cwd: PROJECT_ROOT,
      timeout: 15000,
    });

    const stderr = result.stderr ?? '';
    const stdout = result.stdout ?? '';

    const tiers = {};
    const tierPattern = /\[tier(\d+)\]\s+(.+?):\s+(\d+)\s+tokens/g;
    for (const match of stderr.matchAll(tierPattern)) {
      tiers[`tier${match[1]}`] = { label: match[2], tokens: parseInt(match[3], 10) };
    }

    // Parse total from JSON output
    let totalTokens = null;
    try {
      const parsed = JSON.parse(stdout.trim());
      totalTokens = parsed?.tokenCount ?? null;
    } catch { /* ignore */ }

    return { tiers, totalTokens };
  } catch {
    return { tiers: {}, totalTokens: null };
  }
}

// ---- Main ------------------------------------------------------------------

async function main() {
  console.log('\n' + boxTitle('Memory Lane Health Status') + '\n');

  // Step 1: Read active-memory-lanes.json
  const activeLanesPath = join(PROJECT_ROOT, 'config', 'active-memory-lanes.json');
  const lanesConfig = readJson(activeLanesPath) ?? {};
  const {
    active: activeLane = 'unknown',
    status: laneStatus = 'unknown',
    currentBranch: configBranch = 'unknown',
    laneEntityName = 'unknown',
    lastSyncedAt = null,
    emergencySummary = '',
    memoryKeys = [],
  } = lanesConfig;

  // Step 2: Docker health check
  const dockerOnline = await checkDockerHealth();
  const dockerLabel = dockerOnline
    ? `${OK} online (${GATEWAY.replace('http://', '')})`
    : `${FAIL} offline — run: pnpm docker:mcp:ready`;

  // Step 3: Branch comparison
  const currentBranch = getCurrentBranch();
  const branchMatch = currentBranch === configBranch;
  const branchMatchLabel = branchMatch
    ? `${OK} (current branch matches lane)`
    : `${WARN} MISMATCH — config: "${configBranch}", current: "${currentBranch}". Run: pnpm lane:activate`;

  // Step 4: Time since last sync
  const syncAge = formatTimeSince(lastSyncedAt);

  // Step 5: Emergency summary word count
  const summaryWords = wordCount(emergencySummary);
  const summaryLabel = summaryWords > 0
    ? `${summaryWords <= 150 ? OK : WARN} (${summaryWords} words${summaryWords > 150 ? ' — EXCEEDS 150 WORD LIMIT' : ''})`
    : `${FAIL} (missing)`;

  // Step 6: Check hook files exist
  const hookPaths = {
    'SessionStart': join(PROJECT_ROOT, '.claude', 'hooks', 'session-start-v2.mjs'),
    'Stop': join(PROJECT_ROOT, 'scripts', 'memory-lane-stop.mjs'),
    'PostCheckout': join(PROJECT_ROOT, '.git', 'hooks', 'post-checkout'),
    'PostCommit': join(PROJECT_ROOT, '.git', 'hooks', 'post-commit'),
  };

  const hookStatus = {};
  for (const [name, path] of Object.entries(hookPaths)) {
    hookStatus[name] = fileExists(path);
  }

  // Print core status lines
  console.log(`Docker:       ${dockerLabel}`);
  console.log(`Active Lane:  ${activeLane}`);
  console.log(`Lane Status:  ${laneStatus}`);
  console.log(`Branch:       ${currentBranch}`);
  console.log(`Branch Match: ${branchMatchLabel}`);
  console.log(`Last Synced:  ${syncAge}${lastSyncedAt ? ` (${lastSyncedAt})` : ''}`);
  console.log(`Emergency Summary: ${summaryLabel}`);
  if (emergencySummary) {
    console.log(`  "${emergencySummary.slice(0, 120)}${emergencySummary.length > 120 ? '...' : ''}"`);
  }

  // Step 7: Memory budget (run rehydrate if Docker is online)
  console.log('\nMemory Budget:');
  if (dockerOnline) {
    const { tiers, totalTokens } = runRehydrateVerbose();
    const tier1 = tiers.tier1;
    const tier2 = tiers.tier2;
    const tier3L = tiers.tier3;
    const total = totalTokens ?? 'unknown';

    if (tier1) {
      const mark = tier1.tokens <= 500 ? OK : WARN;
      console.log(`  Project State: ~${tier1.tokens} tokens (budget: 500) ${mark}`);
    } else {
      console.log(`  Project State: (not loaded)`);
    }

    if (tier2) {
      const mark = tier2.tokens <= 1000 ? OK : WARN;
      console.log(`  Feature Entity: ~${tier2.tokens} tokens (budget: 1000) ${mark}`);
    } else {
      console.log(`  Feature Entity: (not loaded)`);
    }

    // Tier 3 summary from stderr pattern
    const learningsMatch = Object.values(tiers).find(t => t.label?.includes('Learnings'));
    const decisionsMatch = Object.values(tiers).find(t => t.label?.includes('Decisions'));
    console.log(`  Tier 3 Slots: ${learningsMatch ? learningsMatch.tokens + ' tokens learnings' : '0 learnings'}, ${decisionsMatch ? decisionsMatch.tokens + ' tokens decisions' : '0 decisions'} (max: 4/2)`);

    const totalMark = typeof total === 'number' && total <= 3000 ? OK : WARN;
    console.log(`  Total: ~${total} / 3,000 tokens ${totalMark}`);
  } else {
    console.log(`  ${FAIL} Docker offline — cannot compute live token counts`);
    console.log(`  Run: pnpm docker:mcp:ready then pnpm memory:status`);
  }

  // Step 8: Citation health note
  console.log('\nCitation Health:');
  console.log(`  Run \`pnpm memory:rehydrate\` to verify citations`);

  // Step 9: Memory keys
  console.log('\nMemory Keys:');
  if (memoryKeys.length === 0) {
    console.log(`  ${WARN} No memory keys configured`);
  } else {
    memoryKeys.forEach((key, i) => {
      const tag = i === 0 ? '(mandatory)' : i === 1 ? '(active lane)' : '(tier 3)';
      console.log(`  [${i}] ${key} ${tag}`);
    });
  }

  // Step 10: Hooks status
  console.log('\nHooks:');
  for (const [name, exists] of Object.entries(hookStatus)) {
    const icon = exists ? OK : FAIL;
    const scriptName = hookPaths[name].split(/[\\/]/).pop();
    const label = exists ? scriptName : `${scriptName} MISSING`;
    console.log(`  ${name.padEnd(14)}: ${icon} ${label}`);
  }

  console.log('');

  // Final advisory if issues found
  const issues = [];
  if (!dockerOnline) issues.push('Docker offline — run: pnpm docker:mcp:ready');
  if (!branchMatch) issues.push('Branch mismatch — run: pnpm lane:activate');
  if (!hookStatus.Stop) issues.push('Stop hook missing — scripts/memory-lane-stop.mjs not found');
  if (!hookStatus.SessionStart) issues.push('SessionStart hook missing — .claude/hooks/session-start-v2.mjs not found');
  if (summaryWords === 0) issues.push('Emergency summary is empty — run: pnpm memory:sync');

  if (issues.length > 0) {
    console.log(`${WARN} Issues detected (${issues.length}):`);
    for (const issue of issues) console.log(`  - ${issue}`);
    console.log('');
  } else {
    console.log(`${OK} All systems healthy\n`);
  }

  process.exit(0);
}

main().catch(err => {
  console.error(`[memory:status] Error (non-fatal): ${err?.message ?? String(err)}`);
  process.exit(0);
});
