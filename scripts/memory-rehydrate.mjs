#!/usr/bin/env node
// scripts/memory-rehydrate.mjs
// Selective memory rehydration engine for Claude Code SessionStart hook

import { readFileSync, accessSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const GATEWAY = process.env.MCP_GATEWAY_URL ?? 'http://127.0.0.1:3100';
const TOKEN_BUDGET = parseInt(process.env.MEMORY_TOKEN_BUDGET ?? '3000');
const MAX_LEARNINGS = parseInt(process.env.MEMORY_MAX_LEARNINGS ?? '2');
const MAX_DECISIONS = parseInt(process.env.MEMORY_MAX_DECISIONS ?? '1');
const PROJECT_ROOT = process.cwd();
const VERBOSE = process.argv.includes('--verbose');
const TIER1_ONLY = process.argv.includes('--tier1-only');

const today = new Date().toISOString().slice(0, 10);

// Token counting: approximate words * 1.33
function countTokens(text) {
  return Math.ceil(text.split(/\s+/).length * 1.33);
}

// Truncate at sentence boundary to fit within budget
function truncateToTokens(text, budget) {
  if (countTokens(text) <= budget) return text;
  const sentences = text.split(/(?<=\. |\n)/);
  let result = '';
  for (const sentence of sentences) {
    const candidate = result + sentence;
    if (countTokens(candidate) > budget) break;
    result = candidate;
  }
  return result.trimEnd() + ' [TRUNCATED]';
}

// POST to Docker memory gateway
async function memoryCall(toolName, args, timeoutMs = 5000) {
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
    const raw = await res.text();
    try { return JSON.parse(raw); } catch { return null; }
  } catch {
    clearTimeout(timer);
    return null;
  }
}

// Docker health check (2s hard timeout)
async function checkDockerHealth() {
  try {
    const ctrl = new AbortController();
    setTimeout(() => ctrl.abort(), 2000);
    const r = await fetch(`${GATEWAY}/health`, { signal: ctrl.signal });
    return r.ok;
  } catch { return false; }
}

// Verify file citations found in observation text
function verifyCitations(text) {
  const citationPattern = /([a-zA-Z0-9/_-]+\.[a-zA-Z]{2,4}:\d+)/g;
  const verified = [], stale = [];
  for (const match of (text ?? '').matchAll(citationPattern)) {
    const [filePath] = match[1].split(':');
    const fullPath = join(PROJECT_ROOT, filePath);
    try { accessSync(fullPath); verified.push(match[1]); }
    catch { stale.push(match[1] + ' [STALE — file not found]'); }
  }
  return { verified, stale };
}

// Extract entities array from Docker response
function extractEntities(result) {
  if (!result) return [];
  // open_nodes returns { nodes: [...] } or array directly
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.nodes)) return result.nodes;
  if (Array.isArray(result?.entities)) return result.entities;
  // Docker MCP gateway wraps responses as { content: [{ type, json|text }] }
  if (result?.content) {
    // type:"json" — content[0].json holds the payload object
    const jsonPayload = result.content?.[0]?.json;
    if (jsonPayload) {
      if (Array.isArray(jsonPayload?.nodes)) return jsonPayload.nodes;
      if (Array.isArray(jsonPayload?.entities)) return jsonPayload.entities;
      if (Array.isArray(jsonPayload)) return jsonPayload;
    }
    // type:"text" — content[0].text is a JSON string
    try {
      const inner = JSON.parse(
        Array.isArray(result.content) ? result.content[0]?.text ?? '{}' : result.content
      );
      if (Array.isArray(inner?.nodes)) return inner.nodes;
      if (Array.isArray(inner?.entities)) return inner.entities;
      if (Array.isArray(inner)) return inner;
    } catch { /* ignore */ }
  }
  return [];
}

// Format entity observations into concise text
function formatEntity(entity) {
  if (!entity) return '';
  const name = entity.name ?? entity.entityName ?? 'unknown';
  const obs = Array.isArray(entity.observations) ? entity.observations : [];
  return `**${name}**\n${obs.slice(0, 8).map(o => `  ${o}`).join('\n')}`;
}

// Build offline fallback block
function buildOfflineBlock(currentBranch, fallback) {
  let gitLog = '';
  try { gitLog = execSync('git log --oneline -5', { encoding: 'utf8', cwd: PROJECT_ROOT }).trim(); } catch { gitLog = '(unavailable)'; }

  return `## Session Memory — ${today} [offline]

> Branch: ${currentBranch} | Docker: OFFLINE — using emergency summary

### Emergency Summary
${fallback}

### Git State
\`\`\`
${gitLog}
\`\`\`

---
Docker MCP is offline. Run \`pnpm docker:mcp:ready\` to restore full memory.
MANDATORY: Report 3-bullet summary then STOP and await instruction.`;
}

async function main() {
  // Step 1: Read current git branch
  let currentBranch = 'unknown';
  try { currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8', cwd: PROJECT_ROOT }).trim(); } catch { /* ignore */ }
  process.env._CURRENT_BRANCH = currentBranch;

  // Step 2: Read active-branch.json
  let config = {};
  try {
    config = JSON.parse(readFileSync(join(PROJECT_ROOT, 'config/active-branch.json'), 'utf8'));
  } catch { /* use defaults */ }

  const {
    entity = 'electrical-website-state',
    fallback: fallbackSummary = 'No emergency summary available. Run git log --oneline -5 for current state.',
    branch: expectedBranch = 'unknown',
  } = config;

  // Step 3: Docker health check (2s timeout)
  const dockerOnline = await checkDockerHealth();

  // Step 4: If Docker offline, return offline fallback
  if (!dockerOnline) {
    const offlineBlock = buildOfflineBlock(currentBranch, fallbackSummary);
    const output = {
      dockerStatus: 'offline',
      branch: currentBranch,
      entity,
      tokenCount: countTokens(offlineBlock),
      injectionBlock: offlineBlock,
      citations: { verified: [], stale: [] },
      fallback: fallbackSummary,
    };
    process.stdout.write(JSON.stringify(output) + '\n');
    return;
  }

  // Step 5: Drift detection
  const branchMismatch = currentBranch !== expectedBranch && expectedBranch !== 'unknown';

  // Step 6: PARA-tiered loading
  let tokenBudgetRemaining = TOKEN_BUDGET;
  const sections = [];

  // Tier 1+2: Combined — project state + lane entity in ONE call
  if (VERBOSE) process.stderr.write('[tier1+2] Loading project state + lane entity\n');
  const tier12Result = await memoryCall('open_nodes', { names: ['electrical-website-state', entity] });
  const tier12Entities = extractEntities(tier12Result);

  // First entity = project state, second = lane entity (may be absent for new branches)
  const projectStateEntity = tier12Entities.find(e => (e?.name ?? '') === 'electrical-website-state') ?? tier12Entities[0] ?? null;
  const featureEntity = tier12Entities.find(e => (e?.name ?? '') === entity) ?? (tier12Entities.length > 1 ? tier12Entities[1] : null);

  let tier1Text = '';
  if (projectStateEntity) {
    tier1Text = formatEntity(projectStateEntity);
    const tier1Tokens = countTokens(tier1Text);
    tokenBudgetRemaining -= tier1Tokens;
    if (VERBOSE) process.stderr.write(`[tier1+2] Project state: ${tier1Tokens} tokens\n`);
  }

  let tier2Text = '';
  if (!TIER1_ONLY && featureEntity && tokenBudgetRemaining > 300) {
    const raw = formatEntity(featureEntity);
    tier2Text = truncateToTokens(raw, Math.floor(tokenBudgetRemaining * 0.45));
    const tier2Tokens = countTokens(tier2Text);
    tokenBudgetRemaining -= tier2Tokens;
    if (VERBOSE) process.stderr.write(`[tier1+2] Lane entity: ${tier2Tokens} tokens\n`);
  } else if (TIER1_ONLY) {
    if (VERBOSE) process.stderr.write('[tier1+2] Lane entity skipped (--tier1-only)\n');
  }

  const combinedTokens = (TOKEN_BUDGET - tokenBudgetRemaining);
  if (VERBOSE) process.stderr.write(`[tier1+2] Combined: ${combinedTokens} tokens (project state + lane entity)\n`);

  sections.push({ label: 'Project State', text: tier1Text || '(no project state found)' });
  sections.push({ label: `Active Lane (${entity})`, text: tier2Text || '(no lane entity found in Docker)' });

  // Tier 3: Contextual search — ONE search call using branch slug, conditional on budget
  let learningsText = '';
  let decisionsText = '';
  if (!TIER1_ONLY && tokenBudgetRemaining > 300) {
    // Branch slug: remove feat/ prefix, use as search query
    const branchSlug = (config.branch ?? currentBranch).replace(/^feat\//, '').replace(/^fix\//, '').replace(/^chore\//, '');
    if (VERBOSE) process.stderr.write(`[tier3] Searching: "${branchSlug}"\n`);

    const searchResult = await memoryCall('search_nodes', { query: branchSlug }, 4000);
    const found = extractEntities(searchResult);

    const learnings = [];
    const decisions = [];

    for (const ent of found) {
      const name = ent?.name ?? '';
      if (name.startsWith('learn-') && learnings.length < MAX_LEARNINGS) {
        learnings.push(ent);
      } else if (name.startsWith('decide-') && decisions.length < MAX_DECISIONS) {
        decisions.push(ent);
      }
    }

    for (const ent of learnings) {
      if (tokenBudgetRemaining < 100) break;
      const raw = formatEntity(ent);
      const truncated = truncateToTokens(raw, Math.min(100, tokenBudgetRemaining));
      const toks = countTokens(truncated);
      tokenBudgetRemaining -= toks;
      learningsText += truncated + '\n\n';
    }

    for (const ent of decisions) {
      if (tokenBudgetRemaining < 100) break;
      const raw = formatEntity(ent);
      const truncated = truncateToTokens(raw, Math.min(100, tokenBudgetRemaining));
      const toks = countTokens(truncated);
      tokenBudgetRemaining -= toks;
      decisionsText += truncated + '\n\n';
    }

    if (VERBOSE) process.stderr.write(`[tier3] Learnings: ${learnings.length}, Decisions: ${decisions.length}\n`);
  } else {
    if (VERBOSE) process.stderr.write('[tier3] Skipped (--tier1-only or budget exhausted)\n');
  }

  // Tier 4: ELIMINATED — no session search

  // Step 7: Citation verification (across all text)
  const allText = [tier1Text, tier2Text, learningsText, decisionsText].join('\n');
  const citations = verifyCitations(allText);

  // Step 8: Compile injection block
  const driftWarning = branchMismatch
    ? `\n> WARNING: Branch mismatch — config expects "${expectedBranch}", current is "${currentBranch}". Run \`pnpm lane:activate\`.\n`
    : '';

  const tokensUsed = TOKEN_BUDGET - tokenBudgetRemaining;

  const tier1OnlyWarning = TIER1_ONLY
    ? '\n> CONTEXT PRE-CHECK: >55% at session start — memory truncated to Tier 1 only.'
    : '';

  let injectionBlock = `## Session Memory — ${today} [${tokensUsed} tokens]

> Branch: ${currentBranch} | Lane: ${entity} | Docker: online${driftWarning}${tier1OnlyWarning}

### Project State
${sections[0]?.text ?? '(unavailable)'}

### Active Lane (${entity})
${sections[1]?.text ?? '(unavailable)'}
`;

  if (learningsText.trim()) {
    injectionBlock += `\n### Learnings\n${learningsText.trim()}\n`;
  }

  if (decisionsText.trim()) {
    injectionBlock += `\n### Decisions\n${decisionsText.trim()}\n`;
  }

  const citationsSection = [
    citations.verified.length ? `Verified: ${citations.verified.join(', ')}` : '',
    citations.stale.length ? `Stale: ${citations.stale.join(', ')}` : '',
  ].filter(Boolean).join('\n');

  if (citationsSection) {
    injectionBlock += `\n### Citations\n${citationsSection}\n`;
  }

  injectionBlock += `\n---\nMANDATORY: Report 3-bullet summary (branch, build status, next tasks) then STOP and await instruction.`;

  const output = {
    dockerStatus: 'online',
    branch: currentBranch,
    entity,
    tokenCount: countTokens(injectionBlock),
    injectionBlock,
    citations,
    fallback: fallbackSummary,
  };

  process.stdout.write(JSON.stringify(output) + '\n');
}

main().catch(err => {
  // Never crash session start — emit offline fallback
  const fallback = {
    dockerStatus: 'error',
    branch: 'unknown',
    entity: 'unknown',
    tokenCount: 10,
    injectionBlock: `## Session Memory — ${today} [error]\n\nMemory rehydration error: ${err?.message ?? String(err)}. Proceed without memory context.\n\n---\nMANDATORY: Report 3-bullet summary then STOP and await instruction.`,
    citations: { verified: [], stale: [] },
    fallback: '',
  };
  process.stdout.write(JSON.stringify(fallback) + '\n');
  process.exit(0);
});
