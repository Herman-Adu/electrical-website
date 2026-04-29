#!/usr/bin/env node
// .claude/hooks/session-start-v2.mjs
// SessionStart hook â€” wraps memory-rehydrate.mjs output for Claude Code

import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';

const PROJECT_ROOT = process.cwd();

try {
  const result = execSync(
    `node "${join(PROJECT_ROOT, 'scripts/memory-rehydrate.mjs')}"`,
    { encoding: 'utf8', timeout: 10000, cwd: PROJECT_ROOT }
  );
  const data = JSON.parse(result);

  const output = {
    hookSpecificOutput: {
      hookEventName: 'SessionStart',
      additionalContext: data.injectionBlock,
    },
  };

  // Branch mismatch guard — auto-correct stale lane
  let laneWarning = '';
  try {
    const activeLanesPath = join(PROJECT_ROOT, 'config', 'active-memory-lanes.json');
    const activeLanes = JSON.parse(readFileSync(activeLanesPath, 'utf8'));
    const gitBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8', cwd: PROJECT_ROOT }).trim();
    if (activeLanes.currentBranch && activeLanes.currentBranch !== gitBranch) {
      execSync(`node "${join(PROJECT_ROOT, 'scripts/memory-lane-activate.mjs')}"`, {
        encoding: 'utf8', timeout: 8000, cwd: PROJECT_ROOT,
      });
      laneWarning = `

> BRANCH MISMATCH DETECTED: lane was on '${activeLanes.currentBranch}', auto-corrected to '${gitBranch}'`;
    }
  } catch { /* non-fatal */ }

  // Append lane warning (if any) before git state block
  if (laneWarning) {
    output.hookSpecificOutput.additionalContext += laneWarning;
  }

  // Append live git state
  let gitLog = '';
  let gitStatus = '';
  try { gitLog = execSync('git log --oneline -5', { encoding: 'utf8', cwd: PROJECT_ROOT }).trim(); } catch { gitLog = '(unavailable)'; }
  try { gitStatus = execSync('git status --short', { encoding: 'utf8', cwd: PROJECT_ROOT }).trim(); } catch { gitStatus = ''; }

  output.hookSpecificOutput.additionalContext +=
    `\n\n### Git State\n\`\`\`\n${gitLog}\n${gitStatus || '(clean)'}\n\`\`\``;

  console.log(JSON.stringify(output));
} catch (err) {
  // Never block session start
  console.log(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'SessionStart',
      additionalContext: `Memory rehydration failed: ${err?.message ?? String(err)}. Proceed without memory context.`,
    },
  }));
}
process.exit(0);
