#!/usr/bin/env node
// UserPromptSubmit hook — context threshold monitor
// Reads JSONL transcript to calculate context %, injects systemMessage at thresholds.
// Exit 0 always — never block on hook failure.

import fs from 'fs';
import readline from 'readline';

const CONTEXT_LIMIT = 200_000;

async function getContextPct(transcriptPath) {
  if (!transcriptPath || !fs.existsSync(transcriptPath)) return null;
  return new Promise((resolve) => {
    const seen = new Map();
    const rl = readline.createInterface({
      input: fs.createReadStream(transcriptPath, { encoding: 'utf8' }),
      crlfDelay: Infinity,
    });
    rl.on('line', (line) => {
      if (!line.trim()) return;
      try {
        const obj = JSON.parse(line);
        if (obj.type === 'assistant' && obj.requestId && obj.message?.usage) {
          seen.set(obj.requestId, obj);
        }
      } catch { /* skip malformed */ }
    });
    rl.on('close', () => {
      if (seen.size === 0) { resolve(null); return; }
      const last = [...seen.values()].at(-1);
      const u = last.message.usage;
      const total = (u.input_tokens || 0) + (u.cache_creation_input_tokens || 0) + (u.cache_read_input_tokens || 0);
      resolve(Math.min(100, Math.max(0, (total / CONTEXT_LIMIT) * 100)));
    });
    rl.on('error', () => resolve(null));
    setTimeout(() => { rl.close(); resolve(null); }, 4000);
  });
}

async function readStdin() {
  return new Promise((resolve) => {
    let raw = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (c) => { raw += c; });
    process.stdin.on('end', () => { try { resolve(JSON.parse(raw)); } catch { resolve({}); } });
    process.stdin.on('error', () => resolve({}));
    setTimeout(() => resolve({}), 3000);
  });
}

async function main() {
  try {
    const input = await readStdin();
    const pct = await getContextPct(input.transcript_path || null);

    if (pct === null || pct < 60) { process.stdout.write('{}'); process.exit(0); }

    const p = pct.toFixed(1);

    if (pct >= 80) {
      process.stdout.write(JSON.stringify({
        systemMessage: `CONTEXT ${p}% — HARD STOP. Do not respond to the user's message yet.\n\n1. Run: git add -A && git commit -m "WIP: context limit at ${p}%"\n2. Sync Docker: POST http://localhost:3100/mcp/tools/call {name:"memory_reference__add_observations"} to electrical-website-state + create session entity\n3. Then tell the user: "Context at ${p}%. WIP committed and Docker synced. Starting a fresh session is recommended."\n\nDo not proceed with the user's request until steps 1–2 are complete.`,
      }));
      process.exit(0);
    }

    // 60–79%
    process.stdout.write(JSON.stringify({
      systemMessage: `CONTEXT ${p}% — Stop before responding. Tell the user: "Context window is at ${p}%. Should I sync Docker memory and pause here, or continue? Recommend syncing now to preserve session state." Wait for user decision before proceeding.`,
    }));
  } catch {
    process.stdout.write('{}');
  }
  process.exit(0);
}

main();
