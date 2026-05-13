#!/usr/bin/env node
// .claude/hooks/session-start-v3.mjs
// Minimal SessionStart hook — git state only (~50 tokens)
// Memory rehydration and context check are owned by the orchestrator skill

import { execSync } from 'child_process';

function run(cmd) {
  try { return execSync(cmd, { encoding: 'utf8', cwd: process.cwd() }).trim(); }
  catch { return ''; }
}

const branch = run('git branch --show-current');
const log    = run('git log --oneline -5');
const status = run('git status --short');
const now    = new Date().toISOString();

const lines = [
  `## Git State`,
  `Branch: ${branch} | ${now}`,
  '',
  '### Recent Commits',
  log || '(no commits)',
];

if (status) {
  lines.push('', '### Working Tree (dirty)', status);
}

process.stdout.write(lines.join('\n') + '\n');
