#!/usr/bin/env node
'use strict';

/**
 * KIE.ai diagram generation — Flux Kontext
 *
 * Usage:
 *   node generate-visual.js "<prompt>" "<output.png>" "<16:9>" [--model fast|quality] [--input ref.png]
 *
 * Models:  fast    → flux-kontext-pro  (~$0.02/image)
 *          quality → flux-kontext-max  (~$0.09/image)
 *
 * Requires KIE_AI_API_KEY in .env (project root)
 */

const fs   = require('fs');
const path = require('path');

// ── Load .env from project root ───────────────────────────────────────────
const envPath = path.resolve(__dirname, '../../.env.local');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^([^#=\s][^=]*)=(.*)$/);
    if (m) process.env[m[1].trim()] ??= m[2].trim().replace(/^["']|["']$/g, '');
  }
}

const API_KEY = process.env.KIE_AI_API_KEY;
if (!API_KEY) {
  console.error('Error: KIE_AI_API_KEY not found in .env');
  console.error('Add KIE_AI_API_KEY=<your-key> to .env at the project root.');
  process.exit(1);
}

// ── Parse CLI args ────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
if (argv.length < 3) {
  console.error('Usage: node generate-visual.js "<prompt>" "<output>" "<aspect>" [--model fast|quality] [--input ref.png]');
  process.exit(1);
}
const [prompt, outputPath, aspectRatio] = argv;

let modelFlag  = 'fast';
let inputImage = null;
for (let i = 3; i < argv.length; i++) {
  if (argv[i] === '--model' && argv[i + 1]) { modelFlag  = argv[++i]; }
  if (argv[i] === '--input' && argv[i + 1]) { inputImage = argv[++i]; }
}

const MODEL       = modelFlag === 'quality' ? 'flux-kontext-max' : 'flux-kontext-pro';
const GENERATE    = 'https://api.kie.ai/api/v1/flux/kontext/generate';
const POLL_BASE   = 'https://api.kie.ai/api/v1/flux/kontext/record-info';
const HEADERS     = { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json' };

// ── Helpers ───────────────────────────────────────────────────────────────
async function post(url, body) {
  const res = await fetch(url, { method: 'POST', headers: HEADERS, body: JSON.stringify(body) });
  const text = await res.text();
  if (!res.ok) throw new Error(`POST ${url} → ${res.status}: ${text}`);
  return JSON.parse(text);
}

async function get(url) {
  const res = await fetch(url, { headers: HEADERS });
  const text = await res.text();
  if (!res.ok) throw new Error(`GET ${url} → ${res.status}: ${text}`);
  return JSON.parse(text);
}

async function download(imageUrl, dest) {
  const res = await fetch(imageUrl);
  if (!res.ok) throw new Error(`Download failed ${res.status}: ${imageUrl}`);
  const dir = path.dirname(path.resolve(dest));
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
}

async function poll(taskId, timeoutSecs = 300) {
  const deadline = Date.now() + timeoutSecs * 1000;
  while (Date.now() < deadline) {
    await new Promise(r => setTimeout(r, 5000));
    const data   = await get(`${POLL_BASE}?taskId=${taskId}`);
    const flag   = data?.data?.successFlag;
    const imgUrl = data?.data?.response?.resultImageUrl;
    process.stdout.write(`  polling… successFlag=${flag ?? 'unknown'}\n`);
    if (flag === 1 && imgUrl) return imgUrl;
    if (flag === 2 || flag === 3) throw new Error(`Task failed (flag=${flag}): ${data?.data?.errorMessage ?? JSON.stringify(data)}`);
  }
  throw new Error(`Timed out after ${timeoutSecs}s waiting for task ${taskId}`);
}

// ── Main ──────────────────────────────────────────────────────────────────
(async () => {
  console.log(`\nGenerating: ${path.basename(outputPath)}`);
  console.log(`  model=${MODEL}  ratio=${aspectRatio}`);
  if (inputImage) console.log(`  style-ref=${inputImage} (upload not yet wired — ignored)`);

  const body = { prompt, aspectRatio, outputFormat: 'png', model: MODEL };

  const createResp = await post(GENERATE, body);
  const taskId = createResp?.data?.taskId ?? createResp?.taskId;
  if (!taskId) throw new Error(`No taskId in response: ${JSON.stringify(createResp)}`);
  console.log(`  taskId=${taskId}`);

  const imageUrl = await poll(taskId);
  console.log(`  Downloading from ${imageUrl.substring(0, 60)}…`);
  await download(imageUrl, outputPath);
  console.log(`  Saved → ${outputPath}\n`);
})().catch(err => {
  console.error(`\nGeneration error: ${err.message}`);
  process.exit(1);
});
