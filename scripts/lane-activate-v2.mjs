#!/usr/bin/env node
// scripts/lane-activate-v2.mjs
// Post-checkout activation — no config files, Docker is the registry
// Called by git post-checkout hook: node lane-activate-v2.mjs <prevHead> <newHead> <branchFlag>
// Also called manually: pnpm lane:activate

import { execSync } from 'child_process';

const GATEWAY = process.env.MCP_GATEWAY_URL ?? 'http://127.0.0.1:3100';

// Git post-checkout passes branchFlag: '1' = branch switch, '0' = file checkout
const branchFlag = process.argv[4];
if (branchFlag === '0') process.exit(0);

async function dockerHealth() {
  try {
    const ctrl = new AbortController();
    setTimeout(() => ctrl.abort(), 1500);
    const r = await fetch(`${GATEWAY}/health`, { signal: ctrl.signal });
    return r.ok;
  } catch { return false; }
}

async function mcpCall(name, args) {
  const ctrl = new AbortController();
  setTimeout(() => ctrl.abort(), 4000);
  try {
    const r = await fetch(`${GATEWAY}/memory/tools/call`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, arguments: args }),
      signal: ctrl.signal,
    });
    return r.ok;
  } catch { return false; }
}

function branchToEntity(branch) {
  if (!branch || branch === 'main' || branch === 'master') {
    return 'nexgen-electrical-innovations-state';
  }
  // feat/my-feature → feat-my-feature
  // hotfix/1234-desc → hotfix-1234-desc
  return branch.toLowerCase().replace(/\//g, '-').replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

async function main() {
  let branch = 'unknown';
  try { branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim(); } catch { /* ignore */ }

  const entity = branchToEntity(branch);
  const ts = new Date().toISOString();

  if (!await dockerHealth()) {
    // Silent skip — Docker offline is not an error during git checkout
    process.exit(0);
  }

  await mcpCall('add_observations', {
    observations: [{
      entityName: entity,
      contents: [`lane_status: active | branch: ${branch} | activated: ${ts}`]
    }]
  });

  process.exit(0);
}

main().catch(() => process.exit(0)); // always exit 0 — never block git
