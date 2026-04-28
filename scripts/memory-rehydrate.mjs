#!/usr/bin/env node
// scripts/memory-rehydrate.mjs
// Selective memory rehydration engine for Claude Code SessionStart hook

import { readFileSync, accessSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const GATEWAY = process.env.MCP_GATEWAY_URL ?? 'http://127.0.0.1:3100';
const TOKEN_BUDGET = parseInt(process.env.MEMORY_TOKEN_BUDGET ?? '3000');
const MAX_LEARNINGS = parseInt(process.env.MEMORY_MAX_LEARNINGS ?? '4');
const MAX_DECISIONS = parseInt(process.env.MEMORY_MAX_DECISIONS ?? '2');
const PROJECT_ROOT = process.cwd();
const VERBOSE = process.argv.includes('--verbose');

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
  // search_nodes may wrap differently
  if (result?.content) {
    try {
      const inner = JSON.parse(
        Array.isArray(result.content) ? result.content[0]?.text ?? '{}' : result.content
      );
      if (Array.isArray(inner?.nodes)) return inner.nodes;
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

// Extract keywords for Tier 3 search
function extractKeywords(featureEntity, projectStateEntity) {
  const stopwords = new Set(['the','a','an','and','or','in','on','for','to','of','with','this','that','is','are','was','were']);
  const tokens = new Set();

  // From feature observations: scope: line
  const featureObs = Array.isArray(featureEntity?.observations) ? featureEntity.observations : [];
  for (const obs of featureObs) {
    const scopeMatch = /^scope:\s*(.+)/i.exec(obs);
    if (scopeMatch) {
      scopeMatch[1].split(/[\s,]+/).filter(w => w.length > 3 && !stopwords.has(w.toLowerCase())).slice(0, 4).forEach(w => tokens.add(w.toLowerCase()));
      break;
    }
  }

  // From project state: next_tasks: line
  const stateObs = Array.isArray(projectStateEntity?.observations) ? projectStateEntity.observations : [];
  for (const obs of stateObs) {
    const taskMatch = /^next_tasks?:\s*(.+)/i.exec(obs);
    if (taskMatch) {
      const firstTask = taskMatch[1].split(',')[0];
      firstTask.split(/\s+/).filter(w => w.length > 3 && !stopwords.has(w.toLowerCase())).slice(0, 2).forEach(w => tokens.add(w.toLowerCase()));
      break;
    }
  }

  // From branch name
  const branch = (process.env._CURRENT_BRANCH ?? '').replace(/^feat\//, '').replace(/^fix\//, '');
  branch.split('-').filter(w => w.length > 3 && !stopwords.has(w.toLowerCase())).forEach(w => tokens.add(w.toLowerCase()));

  return [...tokens].slice(0, 5);
}

// Build offline fallback block
function buildOfflineBlock(currentBranch, emergencySummary) {
  let gitLog = '';
  try { gitLog = execSync('git log --oneline -5', { encoding: 'utf8', cwd: PROJECT_ROOT }).trim(); } catch { gitLog = '(unavailable)'; }

  return `## Session Memory — ${today} [offline]

> Branch: ${currentBranch} | Docker: OFFLINE — using emergency summary

### Emergency Summary
${emergencySummary}

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

  // Step 2: Read active-memory-lanes.json
  let lanesConfig = {};
  try {
    lanesConfig = JSON.parse(readFileSync(join(PROJECT_ROOT, 'config/active-memory-lanes.json'), 'utf8'));
  } catch { /* use defaults */ }

  const {
    laneEntityName = 'electrical-website-state',
    emergencySummary = 'No emergency summary available. Run git log --oneline -5 for current state.',
    status: laneStatus = 'unknown',
    currentBranch: expectedBranch = 'unknown',
    memoryKeys = ['electrical-website-state'],
  } = lanesConfig;

  // Step 3: Docker health check (2s timeout)
  const dockerOnline = await checkDockerHealth();

  // Step 4: If Docker offline, return offline fallback
  if (!dockerOnline) {
    const offlineBlock = buildOfflineBlock(currentBranch, emergencySummary);
    const output = {
      dockerStatus: 'offline',
      branch: currentBranch,
      laneStatus,
      tokenCount: countTokens(offlineBlock),
      injectionBlock: offlineBlock,
      citations: { verified: [], stale: [] },
      emergencySummary,
    };
    process.stdout.write(JSON.stringify(output) + '\n');
    return;
  }

  // Step 5: Drift detection
  const branchMismatch = currentBranch !== expectedBranch && expectedBranch !== 'unknown';

  // Step 6: PARA-tiered loading
  let tokenBudgetRemaining = TOKEN_BUDGET;
  const sections = [];

  // Tier 1: Project state (always load)
  if (VERBOSE) process.stderr.write('[tier1] Loading project state entity\n');
  const tier1Result = await memoryCall('open_nodes', { names: ['electrical-website-state'] });
  const tier1Entities = extractEntities(tier1Result);
  const projectStateEntity = tier1Entities[0] ?? null;
  let tier1Text = '';
  if (projectStateEntity) {
    tier1Text = formatEntity(projectStateEntity);
    const tier1Tokens = countTokens(tier1Text);
    tokenBudgetRemaining -= tier1Tokens;
    if (VERBOSE) process.stderr.write(`[tier1] Project state: ${tier1Tokens} tokens\n`);
  }
  sections.push({ label: 'Project State', text: tier1Text || '(no project state found)' });

  // Tier 2: Active lane feature entity
  if (VERBOSE) process.stderr.write(`[tier2] Loading lane entity: ${laneEntityName}\n`);
  const tier2Result = await memoryCall('open_nodes', { names: [laneEntityName] });
  const tier2Entities = extractEntities(tier2Result);
  const featureEntity = tier2Entities[0] ?? null;
  let tier2Text = '';
  if (featureEntity && tokenBudgetRemaining > 300) {
    const raw = formatEntity(featureEntity);
    tier2Text = truncateToTokens(raw, Math.floor(tokenBudgetRemaining * 0.45));
    const tier2Tokens = countTokens(tier2Text);
    tokenBudgetRemaining -= tier2Tokens;
    if (VERBOSE) process.stderr.write(`[tier2] Lane entity: ${tier2Tokens} tokens\n`);
  }
  sections.push({ label: `Active Lane (${laneEntityName})`, text: tier2Text || '(no lane entity found in Docker)' });

  // Tier 3: Contextual learnings + decisions via keyword search
  const keywords = extractKeywords(featureEntity, projectStateEntity);
  if (VERBOSE) process.stderr.write(`[tier3] Keywords: ${keywords.join(', ')}\n`);

  const learnings = [];
  const decisions = [];

  for (const keyword of keywords) {
    if (learnings.length >= MAX_LEARNINGS && decisions.length >= MAX_DECISIONS) break;
    if (tokenBudgetRemaining < 200) break;

    const searchResult = await memoryCall('search_nodes', { query: keyword }, 4000);
    const found = extractEntities(searchResult);

    for (const entity of found) {
      const name = entity?.name ?? '';
      if (name.startsWith('learn-') && learnings.length < MAX_LEARNINGS) {
        if (!learnings.find(l => l.name === name)) learnings.push(entity);
      } else if (name.startsWith('decide-') && decisions.length < MAX_DECISIONS) {
        if (!decisions.find(d => d.name === name)) decisions.push(entity);
      }
    }
  }

  let learningsText = '';
  for (const entity of learnings) {
    if (tokenBudgetRemaining < 100) break;
    const raw = formatEntity(entity);
    const truncated = truncateToTokens(raw, Math.min(200, tokenBudgetRemaining));
    const toks = countTokens(truncated);
    tokenBudgetRemaining -= toks;
    learningsText += truncated + '\n\n';
  }
  if (VERBOSE) process.stderr.write(`[tier3] Learnings: ${learnings.length}, Decisions: ${decisions.length}\n`);

  let decisionsText = '';
  for (const entity of decisions) {
    if (tokenBudgetRemaining < 100) break;
    const raw = formatEntity(entity);
    const truncated = truncateToTokens(raw, Math.min(200, tokenBudgetRemaining));
    const toks = countTokens(truncated);
    tokenBudgetRemaining -= toks;
    decisionsText += truncated + '\n\n';
  }

  // Tier 4: Last session entity
  const sessionResult = await memoryCall('search_nodes', { query: 'session-2026' }, 3000);
  const sessionEntities = extractEntities(sessionResult);
  const lastSession = sessionEntities
    .filter(e => (e?.name ?? '').startsWith('session-'))
    .sort((a, b) => (b?.name ?? '').localeCompare(a?.name ?? ''))
    [0] ?? null;

  let sessionText = '';
  if (lastSession && tokenBudgetRemaining > 100) {
    const raw = formatEntity(lastSession);
    sessionText = truncateToTokens(raw, Math.min(300, tokenBudgetRemaining));
    tokenBudgetRemaining -= countTokens(sessionText);
    if (VERBOSE) process.stderr.write(`[tier4] Last session: ${lastSession.name}\n`);
  }

  // Step 7: Citation verification (across all text)
  const allText = [tier1Text, tier2Text, learningsText, decisionsText, sessionText].join('\n');
  const citations = verifyCitations(allText);

  // Step 8: Compile injection block
  const driftWarning = branchMismatch
    ? `\n> WARNING: Branch mismatch — config expects "${expectedBranch}", current is "${currentBranch}". Run \`pnpm lane:activate\`.\n`
    : '';

  const tokensUsed = TOKEN_BUDGET - tokenBudgetRemaining;

  let injectionBlock = `## Session Memory — ${today} [${tokensUsed} tokens]

> Branch: ${currentBranch} | Lane: ${laneStatus} | Docker: online${driftWarning}

### Project State
${sections[0]?.text ?? '(unavailable)'}

### Active Lane (${laneEntityName})
${sections[1]?.text ?? '(unavailable)'}
`;

  if (learningsText.trim()) {
    injectionBlock += `\n### Learnings\n${learningsText.trim()}\n`;
  }

  if (decisionsText.trim()) {
    injectionBlock += `\n### Decisions\n${decisionsText.trim()}\n`;
  }

  if (sessionText.trim()) {
    injectionBlock += `\n### Last Session\n${sessionText.trim()}\n`;
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
    laneStatus,
    tokenCount: countTokens(injectionBlock),
    injectionBlock,
    citations,
    emergencySummary,
  };

  process.stdout.write(JSON.stringify(output) + '\n');
}

main().catch(err => {
  // Never crash session start — emit offline fallback
  const fallback = {
    dockerStatus: 'error',
    branch: 'unknown',
    laneStatus: 'unknown',
    tokenCount: 10,
    injectionBlock: `## Session Memory — ${today} [error]\n\nMemory rehydration error: ${err?.message ?? String(err)}. Proceed without memory context.\n\n---\nMANDATORY: Report 3-bullet summary then STOP and await instruction.`,
    citations: { verified: [], stale: [] },
    emergencySummary: '',
  };
  process.stdout.write(JSON.stringify(fallback) + '\n');
  process.exit(0);
});
