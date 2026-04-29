#!/usr/bin/env node
// .claude/hooks/session-start-v2.mjs
// SessionStart hook — wraps memory-rehydrate.mjs output for Claude Code

import { execSync } from 'child_process';
import { readFileSync, createReadStream } from 'fs';
import { createInterface } from 'readline';
import { join } from 'path';

const PROJECT_ROOT = process.cwd();

async function getContextPct(transcriptPath) {
  if (!transcriptPath) return null;
  try {
    const LIMIT = 200_000;
    return await new Promise((resolve) => {
      const seen = new Map();
      const rl = createInterface({
        input: createReadStream(transcriptPath, { encoding: 'utf8' }),
        crlfDelay: Infinity,
      });
      rl.on('line', (line) => {
        try {
          const obj = JSON.parse(line);
          if (obj.type === 'assistant' && obj.requestId && obj.message?.usage) {
            seen.set(obj.requestId, obj);
          }
        } catch { /* skip */ }
      });
      rl.on('close', () => {
        if (!seen.size) { resolve(null); return; }
        const u = [...seen.values()].at(-1).message.usage;
        const total = (u.input_tokens || 0) + (u.cache_creation_input_tokens || 0) + (u.cache_read_input_tokens || 0);
        resolve(Math.min(100, (total / LIMIT) * 100));
      });
      rl.on('error', () => resolve(null));
      setTimeout(() => { rl.close(); resolve(null); }, 3000);
    });
  } catch { return null; }
}

async function main() {
  // Read input from stdin (Claude Code passes hook data as JSON on stdin)
  let input = null;
  try {
    const stdinData = readFileSync('/dev/stdin', { encoding: 'utf8', flag: 'r' });
    if (stdinData.trim()) input = JSON.parse(stdinData.trim());
  } catch { /* no stdin or not parseable — continue without it */ }

  try {
    const transcriptPath = input?.transcript_path ?? null;
    const contextPct = await getContextPct(transcriptPath);
    const tier1Only = contextPct !== null && contextPct > 55;

    const rehydrateFlags = tier1Only ? '--verbose --tier1-only' : '--verbose';
    const result = execSync(
      `node "${join(PROJECT_ROOT, 'scripts/memory-rehydrate.mjs')}" ${rehydrateFlags}`,
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
}

main().catch(() => {
  // Final safety net — never block session start
  console.log(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'SessionStart',
      additionalContext: 'Memory rehydration failed (fatal). Proceed without memory context.',
    },
  }));
}).finally(() => {
  process.exit(0);
});
