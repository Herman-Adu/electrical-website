// .claude/hooks/post-tool-use-guard.mjs
// PostToolUse hook — warns on large edits without prior skill invocation

import { readFileSync, writeFileSync, renameSync } from 'fs';

const FILE_MODIFYING_TOOLS = new Set(['Edit', 'Write', 'NotebookEdit']);
const LOC_THRESHOLD = 50;

function captureDecideEntities(input) {
  const toolName = input?.tool_name ?? '';
  if (!toolName.includes('create_entities')) return;

  const entities = input?.tool_input?.entities ?? [];
  const decideEntities = entities.filter(e => (e?.name ?? '').startsWith('decide-'));
  if (decideEntities.length === 0) return;

  const today = new Date().toISOString().slice(0, 10);
  const manifestPath = `/tmp/session-entities-${today}.json`;

  let manifest = { entities: [] };
  try {
    manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  } catch { /* file doesn't exist yet — start fresh */ }

  // Deduplicate by name
  const existingNames = new Set((manifest.entities ?? []).map(e => e?.name));
  for (const ent of decideEntities) {
    if (!existingNames.has(ent.name)) {
      manifest.entities.push(ent);
    }
  }

  try {
    const tmp = `${manifestPath}.tmp`;
    writeFileSync(tmp, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
    renameSync(tmp, manifestPath);
  } catch { /* never fail PostToolUse hook */ }
}

export function countAddedLines(diff) {
  if (!diff || typeof diff !== 'string') return 0;
  return diff.split('\n').filter(l => l.startsWith('+') && !l.startsWith('++')).length;
}

export function buildWarning(toolName, addedLines) {
  if (!FILE_MODIFYING_TOOLS.has(toolName)) return null;
  if (addedLines <= LOC_THRESHOLD) return null;
  return `ORCHESTRATOR: Large edit detected (${addedLines} lines added via ${toolName}). Per orchestrator contract, >50 LOC changes require a superpowers skill invocation first (TDD, writing-plans, or subagent-driven-development). Was this intentional?`;
}

async function main() {
  let input = {};
  try {
    let raw = '';
    process.stdin.setEncoding('utf8');
    await Promise.race([
      (async () => { for await (const chunk of process.stdin) raw += chunk; })(),
      new Promise(resolve => setTimeout(resolve, 2000)),
    ]);
    input = JSON.parse(raw.trim());
  } catch { /* invalid stdin defaults to empty — hook exits safely */ }

  const toolName = input?.tool_name ?? '';
  const toolOutput = input?.tool_response ?? '';

  captureDecideEntities(input);

  const addedLines = countAddedLines(typeof toolOutput === 'string' ? toolOutput : JSON.stringify(toolOutput));
  const warning = buildWarning(toolName, addedLines);

  if (warning) {
    process.stdout.write(JSON.stringify({ systemMessage: warning }));
  } else {
    process.stdout.write('{}');
  }
  process.exit(0);
}

main().catch(() => { process.stdout.write('{}'); process.exit(0); });
