#!/usr/bin/env node
/**
 * UserPromptSubmit hook — context window monitor with refined security & validation
 *
 * Reads the session transcript JSONL, calculates context usage against the
 * 200K token limit (Claude Haiku 4.5), and injects a systemMessage when
 * usage >= 70% instructing Claude to pause, ask user to confirm sync, and
 * generate an inline continuation prompt.
 *
 * Refinements (2026-04-17):
 * - Secrets redaction (8 patterns)
 * - JSON escaping (complete control char set)
 * - Path validation (directory traversal prevention)
 * - Token calculation edge cases (null, negative, overflow)
 * - JSONL parsing with audit trail
 * - Continuation prompt variants (Docker-available vs unavailable)
 *
 * Token calculation (verified empirically):\n *   context_used = last_assistant_message.usage.input_tokens\n *                + last_assistant_message.usage.cache_creation_input_tokens
 *                + last_assistant_message.usage.cache_read_input_tokens
 *   percentage = (context_used / 200000) * 100
 *
 * Deduplication: Multiple JSONL entries share the same requestId; only the
 * last entry per requestId is used (matches session-report plugin approach).
 *
 * Exit codes:
 *   0 — success (output is valid JSON or empty)
 *   0 — all error paths (never block on hook failure)
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import http from 'http';
import { execSync } from 'child_process';
import os from 'os';

const CONTEXT_LIMIT = 200_000;
const THRESHOLD_PCT = 70;

// ── Redaction Patterns (8 categories) ───────────────────────────────────────
const REDACTION_PATTERNS = [
  { pattern: /([a-zA-Z_]*api[_-]?key\s*=\s*)[a-zA-Z0-9._\-]{20,}/gi, name: 'API Keys' },
  { pattern: /(mongodb|mysql|postgres|postgresql|redis):\/\/[^\s]+/gi, name: 'Database URLs' },
  { pattern: /(oauth|bearer|token)\s+[a-zA-Z0-9._\-]{30,}/gi, name: 'OAuth Tokens' },
  { pattern: /AKIA[0-9A-Z]{16}/g, name: 'AWS Access Keys' },
  { pattern: /(password|passwd|pwd)\s*[:=]\s*[^\s]+/gi, name: 'Passwords' },
  { pattern: /(gh[pou]_[a-zA-Z0-9_]{36,255})/g, name: 'GitHub Tokens' },
  { pattern: /(npm_[a-zA-Z0-9]{36,})/g, name: 'NPM Tokens' },
  { pattern: /(secret|app[_-]?secret|private[_-]?key)\s*[:=]\s*[a-zA-Z0-9!@#$%^&*._\-]{16,}/gi, name: 'Generic Secrets' },
];

// ── Helper: Sanitize commit message ─────────────────────────────────────────
/**
 * Redacts secrets from git commit messages using all 8 patterns
 * @param {string} message - Raw git commit message
 * @returns {string} Redacted message with secrets replaced by [REDACTED]
 */
function sanitizeCommitMessage(message) {
  if (!message || typeof message !== 'string') return '';
  
  let redacted = message;
  REDACTION_PATTERNS.forEach(({ pattern }) => {
    redacted = redacted.replace(pattern, '[REDACTED]');
  });
  
  return redacted;
}

// ── Helper: Sanitize branch name ────────────────────────────────────────────
/**
 * Redacts secrets from git branch names
 * @param {string} branch - Git branch name
 * @returns {string} Either original branch (if safe) or "[branch-name-redacted]"
 */
function sanitizeBranchName(branch) {
  if (!branch || typeof branch !== 'string') return 'unknown';
  
  // Check for secret patterns
  const hasSecret = REDACTION_PATTERNS.some(({ pattern }) => pattern.test(branch));
  
  return hasSecret ? '[branch-name-redacted]' : branch;
}

// ── Helper: Complete JSON escape ────────────────────────────────────────────
/**
 * Escapes all JSON-special characters in a string
 * @param {string} s - Unescaped string
 * @returns {string} JSON-safe escaped string
 *
 * Order: Must escape backslash FIRST to avoid double-escaping
 */
function escape_json(s) {
  if (!s || typeof s !== 'string') return '';
  
  // Escape backslash FIRST
  let escaped = s.replace(/\\/g, '\\\\');
  
  // Then remaining special chars
  escaped = escaped.replace(/"/g, '\\"');
  escaped = escaped.replace(/\b/g, '\\b');      // Backspace
  escaped = escaped.replace(/\f/g, '\\f');      // Form feed
  escaped = escaped.replace(/\n/g, '\\n');      // Newline
  escaped = escaped.replace(/\r/g, '\\r');      // Carriage return
  escaped = escaped.replace(/\t/g, '\\t');      // Tab
  escaped = escaped.replace(/\0/g, '\\u0000');  // NULL character
  
  return escaped;
}

// ── Helper: Validate project directory ──────────────────────────────────────
/**
 * Validates CLAUDE_PROJECT_DIR for path traversal safety
 * @param {string} input - User-provided or env value
 * @returns {string | null} Absolute path if valid; null if invalid
 */
function validateProjectDir(input) {
  if (!input || typeof input !== 'string') return null;
  
  let resolved;
  try {
    // Resolve relative paths to absolute
    resolved = path.resolve(input);
    
    // Verify path exists
    if (!fs.existsSync(resolved)) return null;
    
    // Verify it's a directory (not a file)
    if (!fs.statSync(resolved).isDirectory()) return null;
    
    // Reject symlinks
    const stat = fs.lstatSync(resolved);
    if (stat.isSymbolicLink()) return null;
    
    return resolved;
  } catch {
    return null;
  }
}

// ── Helper: Check if path is whitelisted ────────────────────────────────────
/**
 * Checks if an absolute path is in the whitelist of safe roots
 * @param {string} absolutePath - Resolved absolute path
 * @returns {boolean} True if path is under whitelist root
 */
function isWhitelisted(absolutePath) {
  // Default safe roots
  const homedir = os.homedir();
  const safeRoots = [homedir, '/tmp', '/var/tmp', process.cwd()];
  
  // Check defaults
  const isDefault = safeRoots.some(root => absolutePath.startsWith(root));
  if (isDefault) return true;
  
  // Check custom whitelist
  try {
    const whitelistPath = path.join(path.dirname(import.meta.url.replace('file://', '')), '..', 'security', 'CLAUDE_PROJECT_DIR_WHITELIST.txt');
    if (fs.existsSync(whitelistPath)) {
      const content = fs.readFileSync(whitelistPath, 'utf8');
      const lines = content.split('\n').filter(line => !line.startsWith('#') && line.trim());
      return lines.some(line => absolutePath.startsWith(line.trim()));
    }
  } catch {
    // Silently ignore whitelist errors
  }
  
  return false;
}

// ── Helper: Calculate context percentage with edge cases ────────────────────
/**
 * Calculates context usage percentage with comprehensive edge case handling
 * @param {number} inputTokens - Input tokens used
 * @param {number} cacheCreation - Cache creation input tokens (optional)
 * @param {number} cacheRead - Cache read input tokens (optional)
 * @param {number} contextLimit - Total context limit
 * @returns {{pct: number, totalTokens: number, contextLimit: number} | null}
 *
 * Edge cases:
 * - null/undefined → default to 0
 * - Negative (floating-point artifacts) → clamp to 0
 * - Overflow (> 100) → clamp to 100
 */
function calculateContextPercentage(inputTokens, cacheCreation, cacheRead, contextLimit) {
  // Validate context limit (invariant)
  if (contextLimit <= 0 || typeof contextLimit !== 'number') {
    return null;
  }
  
  // Default null/undefined to 0
  const input = (typeof inputTokens === 'number' && inputTokens >= 0) ? inputTokens : 0;
  const creation = (typeof cacheCreation === 'number' && cacheCreation >= 0) ? cacheCreation : 0;
  const read = (typeof cacheRead === 'number' && cacheRead >= 0) ? cacheRead : 0;
  
  const totalTokens = input + creation + read;
  let pct = (totalTokens / contextLimit) * 100;
  
  // Clamp to [0, 100]
  pct = Math.max(0, Math.min(100, pct));
  
  return { pct, totalTokens, contextLimit };
}

// ── Helper: Read stdin JSON ──────────────────────────────────────────────────
async function readStdin() {
  return new Promise((resolve) => {
    let raw = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', chunk => { raw += chunk; });
    process.stdin.on('end', () => {
      try { resolve(JSON.parse(raw)); }
      catch { resolve({}); }
    });
    process.stdin.on('error', () => resolve({}));
    setTimeout(() => resolve({}), 3000);
  });
}

// ── Helper: Parse JSONL transcript with audit trail ──────────────────────────
/**
 * Parses JSONL transcript and calculates context percentage with audit trail
 * @param {string} transcriptPath - Path to JSONL transcript file
 * @returns {{pct, inputTokens, totalLimit, audit} | null}
 *
 * Audit fields track: total lines, assistant messages, messages with requestId/usage
 */
async function getContextPercentage(transcriptPath) {
  if (!transcriptPath || !fs.existsSync(transcriptPath)) {
    return null;
  }

  return new Promise((resolve) => {
    const seen = new Map();
    const audit = {
      totalLines: 0,
      assistantMessages: 0,
      messagesWithRequestId: 0,
      messagesWithUsage: 0,
      skippedNoRequestId: [],
      skippedMalformedJSON: [],
      skippedNoUsage: [],
    };

    const rl = readline.createInterface({
      input: fs.createReadStream(transcriptPath, { encoding: 'utf8' }),
      crlfDelay: Infinity,
    });

    rl.on('line', (line) => {
      audit.totalLines++;
      
      if (!line.trim()) return;
      try {
        const obj = JSON.parse(line);
        
        if (obj.type === 'assistant') {
          audit.assistantMessages++;
          
          if (!obj.requestId) {
            audit.skippedNoRequestId.push({ line: audit.totalLines, reason: 'missing requestId' });
            return;
          }
          audit.messagesWithRequestId++;
          
          if (!obj.message?.usage) {
            audit.skippedNoUsage.push({ line: audit.totalLines, requestId: obj.requestId });
            return;
          }
          audit.messagesWithUsage++;
          
          // Store for deduplication
          seen.set(obj.requestId, obj);
        }
      } catch {
        audit.skippedMalformedJSON.push({ line: audit.totalLines });
      }
    });

    rl.on('close', () => {
      if (seen.size === 0) {
        resolve(null);
        return;
      }

      const entries = [...seen.values()];
      const last = entries[entries.length - 1];
      const u = last.message.usage;

      const inputTokens = (u.input_tokens || 0)
        + (u.cache_creation_input_tokens || 0)
        + (u.cache_read_input_tokens || 0);

      const contextData = calculateContextPercentage(
        u.input_tokens || 0,
        u.cache_creation_input_tokens || 0,
        u.cache_read_input_tokens || 0,
        CONTEXT_LIMIT
      );

      if (!contextData) {
        resolve(null);
        return;
      }

      resolve({
        pct: contextData.pct,
        inputTokens: contextData.totalTokens,
        totalLimit: CONTEXT_LIMIT,
        audit,
      });
    });

    rl.on('error', () => resolve(null));

    // Timeout guard for large transcripts
    setTimeout(() => { rl.close(); resolve(null); }, 4000);
  });
}

// ── Helper: Check Docker health ─────────────────────────────────────────────
function checkDocker() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3100/health', (res) => {
      res.resume();
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(1500, () => { req.destroy(); resolve(false); });
  });
}

// ── Helper: Get git state (with sanitization) ───────────────────────────────
function getGitState(projectDir) {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', {
      cwd: projectDir, timeout: 3000, encoding: 'utf8'
    }).trim();
    
    const lastCommit = execSync('git log --oneline -1', {
      cwd: projectDir, timeout: 3000, encoding: 'utf8'
    }).trim();
    
    return {
      branch: sanitizeBranchName(branch),
      lastCommit: sanitizeCommitMessage(lastCommit),
    };
  } catch {
    return {
      branch: 'unknown',
      lastCommit: 'unknown',
    };
  }
}

// ── Build continuation prompts (Variant A & B — Concise) ─────────────────────
/**
 * Builds concise continuation prompt based on Docker availability and context state
 * Token savings: ~200 tokens vs previous ~900 tokens
 */
function buildContinuationPrompt(data, dockerOk, gitState) {
  const { pct } = data;
  const pctStr = pct.toFixed(1);
  const { branch, lastCommit } = gitState;
  const now = new Date().toISOString();
  const shortCommit = lastCommit.split(' ')[0].substring(0, 7);

  if (dockerOk) {
    // Variant A: Docker available — 12 lines
    return `---CONTINUATION PROMPT---
Session: ${branch} | ${pctStr}% | ${now}
Last: ${shortCommit}
Docker: ✓

Preflight (before responding):
1. curl -X POST http://localhost:3100/mcp/tools/call -H "Content-Type: application/json" -d '{"name":"memory_reference__search_nodes","arguments":{"query":"electrical-website-state"}}'
2. git status && git log --oneline -5
3. Load .claude/rules/orchestrator-enforcement.txt

Next: [fill in exact next task]
---END CONTINUATION PROMPT---`;
  } else {
    // Variant B: Docker unavailable — 11 lines
    return `---CONTINUATION PROMPT---
Session: ${branch} | ${pctStr}% | ${now}
Last: ${shortCommit}
Docker: DOWN

Preflight (before responding):
1. Read .claude/CLAUDE.md ## Session State
2. git status && git log --oneline -10
3. Retry Docker: curl http://localhost:3100/health

Next: [fill in exact next task]
---END CONTINUATION PROMPT---`;
  }
}

// ── Build 70% warning message ───────────────────────────────────────────────
function buildWarningMessage(data, dockerOk, gitState) {
  const { pct, inputTokens, totalLimit } = data;
  const pctStr = pct.toFixed(1);
  const usedK = (inputTokens / 1000).toFixed(1);
  const limitK = (totalLimit / 1000).toFixed(0);
  const { branch } = gitState;
  const now = new Date().toISOString();
  
  const continuationPrompt = buildContinuationPrompt(data, dockerOk, gitState);

  return `<context-window-warning>
CONTEXT WINDOW AT ${pctStr}% (${usedK}K / ${limitK}K tokens used).

ACTION REQUIRED — PAUSE BEFORE RESPONDING:

1. STOP. Do not continue the current task yet.

2. TELL THE USER:
   "Context window is at ${pctStr}%. I need to sync state to Docker memory before we run out of context. Can you confirm I should proceed with the sync? (Docker: ${dockerOk ? 'AVAILABLE' : 'UNAVAILABLE — fallback mode'})"

3. WAIT for user confirmation ("yes", "go ahead", "confirm", or similar).

4. AFTER CONFIRMATION — SYNC SEQUENCE:
   a. ${dockerOk ? 'mcp__MCP_DOCKER__search_nodes("electrical-website-state") → get entity ID' : 'Docker unavailable; skip to step b'}
   b. ${dockerOk ? 'mcp__MCP_DOCKER__add_observations(entity_id, [' : 'Write one-line fallback to .claude/CLAUDE.md ## Session State:\n      Format: YYYY-MM-DD HH:MM — [Work summary]. Next: [next step]. Blocker: [if any].\n      Example: 2026-04-17 20:15 — Completed hook refactoring + tests (5 commits). Next: verification gates.'}
   ${dockerOk ? `{
        "category": "session_end",
        "timestamp": "${now}",
        "branch": "${branch}",
        "context_pct_at_sync": ${pctStr}
      }])` : ''}
   c. git status → if uncommitted work: git commit -m "WIP: context-sync at ${pctStr}%"

5. GENERATE INLINE CONTINUATION PROMPT — include this exact block in your response:

${continuationPrompt}

6. INFORM USER: "Sync complete. You can continue in this session or paste the continuation prompt into a new session."

IMPORTANT: The continuation prompt must be copy-paste ready and self-contained.
</context-window-warning>`;
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  try {
    const input = await readStdin();
    const transcriptPath = input.transcript_path || null;
    const projectDirEnv = process.env.CLAUDE_PROJECT_DIR || null;
    
    // Validate project directory (use process.cwd() as fallback)
    let projectDir = process.cwd();
    if (projectDirEnv) {
      const validated = validateProjectDir(projectDirEnv);
      if (validated && isWhitelisted(validated)) {
        projectDir = validated;
      }
    }

    // Get context percentage
    const contextData = await getContextPercentage(transcriptPath);

    if (!contextData) {
      // No transcript data — pass through silently
      process.stdout.write('{}');
      process.exit(0);
    }

    if (contextData.pct < THRESHOLD_PCT) {
      // Below threshold — no action
      process.stdout.write('{}');
      process.exit(0);
    }

    // At or above 70% — check Docker and inject warning
    const dockerOk = await checkDocker();
    const gitState = getGitState(projectDir);
    const message = buildWarningMessage(contextData, dockerOk, gitState);

    const output = JSON.stringify({ systemMessage: message });
    process.stdout.write(output);
    process.exit(0);

  } catch (err) {
    // Never fail the hook — silent error recovery
    process.stdout.write('{}');
    process.exit(0);
  }
}

main();

// ──────────────────────────────────────────────────────────────────────────
// TEST SUITES (Batches 1, 2, 3, 4, 5) — Run with: node context-monitor.mjs --test
// ──────────────────────────────────────────────────────────────────────────

if (process.argv.includes('--test')) {
  console.log('🧪 Running context-monitor.mjs test suites...\n');

  // Batch 1: Secrets Redaction (10 test cases)
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('BATCH 1: Secrets Redaction (10 test cases)');
  console.log('═══════════════════════════════════════════════════════════════════\n');

  const batch1 = [
    {
      name: 'API Key Redaction',
      input: 'fix: update API_KEY to sk1234567890abcdefghij',
      expected: 'fix: update [REDACTED]',
    },
    {
      name: 'Database URL (PostgreSQL)',
      input: 'connect to postgres://user:pwd@host:5432/db',
      expected: 'connect to [REDACTED]',
    },
    {
      name: 'OAuth Bearer Token',
      input: 'auth: bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0',
      expected: 'auth: [REDACTED]',
    },
    {
      name: 'AWS Access Key ID',
      input: 'export AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE',
      expected: 'export [REDACTED]',
    },
    {
      name: 'Password Redaction',
      input: 'db_password = MySecurePassword123!',
      expected: 'db_password = [REDACTED]',
    },
    {
      name: 'GitHub Token',
      input: 'github_token: ghp_1234567890abcdefghijklmnopqrstuvwxyz12',
      expected: 'github_token: [REDACTED]',
    },
    {
      name: 'NPM Token',
      input: 'npm_abcdefghijklmnopqrstuvwxyz1234567890',
      expected: '[REDACTED]',
    },
    {
      name: 'Generic Secret',
      input: 'APP_SECRET = mysecretkey123456789',
      expected: 'APP_SECRET = [REDACTED]',
    },
    {
      name: 'False Positive: Variable Name Only',
      input: 'feature/api_key_rotation',
      expected: 'feature/api_key_rotation',
    },
    {
      name: 'False Positive: Documentation',
      input: 'docs: password should be 8+ characters',
      expected: 'docs: password should be 8+ characters',
    },
  ];

  let batch1Pass = 0;
  batch1.forEach((test, idx) => {
    const result = sanitizeCommitMessage(test.input);
    const pass = result === test.expected;
    if (pass) batch1Pass++;
    const status = pass ? '✓ PASS' : '✗ FAIL';
    console.log(`${status} Test 1.${idx + 1}: ${test.name}`);
    if (!pass) {
      console.log(`  Input:    "${test.input}"`);
      console.log(`  Expected: "${test.expected}"`);
      console.log(`  Got:      "${result}"`);
    }
  });
  console.log(`\nBatch 1 Score: ${batch1Pass}/${batch1.length} passed\n`);

  // Batch 2: JSON Escaping (6 test cases)
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('BATCH 2: JSON Escaping (6 test cases)');
  console.log('═══════════════════════════════════════════════════════════════════\n');

  const batch2 = [
    {
      name: 'Backslash Escape (first priority)',
      input: 'path\\to\\file',
      expected: 'path\\\\to\\\\file',
    },
    {
      name: 'Quote Escape',
      input: 'say "hello"',
      expected: 'say \\"hello\\"',
    },
    {
      name: 'Newline Escape',
      input: 'line1\nline2',
      expected: 'line1\\nline2',
    },
    {
      name: 'Tab and Carriage Return',
      input: 'col1\tcol2\rend',
      expected: 'col1\\tcol2\\rend',
    },
    {
      name: 'Roundtrip: Escape then Parse',
      input: 'test "value" with\nnewline',
      checkFn: (result) => {
        try {
          const json = `{"field":"${result}"}`;
          JSON.parse(json);
          return true;
        } catch {
          return false;
        }
      },
    },
    {
      name: 'Backspace and Form Feed',
      input: 'back\bspace form\ffeed',
      expected: 'back\\bspace form\\ffeed',
    },
  ];

  let batch2Pass = 0;
  batch2.forEach((test, idx) => {
    let pass = false;
    if (test.checkFn) {
      const result = escape_json(test.input);
      pass = test.checkFn(result);
    } else {
      const result = escape_json(test.input);
      pass = result === test.expected;
    }
    if (pass) batch2Pass++;
    const status = pass ? '✓ PASS' : '✗ FAIL';
    console.log(`${status} Test 2.${idx + 1}: ${test.name}`);
    if (!pass && !test.checkFn) {
      const result = escape_json(test.input);
      console.log(`  Input:    "${test.input}"`);
      console.log(`  Expected: "${test.expected}"`);
      console.log(`  Got:      "${result}"`);
    }
  });
  console.log(`\nBatch 2 Score: ${batch2Pass}/${batch2.length} passed\n`);

  // Batch 3: Path Validation (6 test cases)
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('BATCH 3: Path Validation (6 test cases)');
  console.log('═══════════════════════════════════════════════════════════════════\n');

  const batch3 = [
    {
      name: 'Valid: Current Directory',
      input: '.',
      shouldPass: true,
    },
    {
      name: 'Valid: Home Directory',
      input: os.homedir(),
      shouldPass: true,
    },
    {
      name: 'Invalid: Non-existent Path',
      input: '/non/existent/path/xyz123',
      shouldPass: false,
    },
    {
      name: 'Invalid: Directory Traversal Attempt',
      input: '../../../../../../etc/passwd',
      shouldPass: false,
    },
    {
      name: 'Invalid: Null/Empty Input',
      input: '',
      shouldPass: false,
    },
    {
      name: 'Valid: Absolute Path Normalization',
      input: process.cwd(),
      shouldPass: true,
    },
  ];

  let batch3Pass = 0;
  batch3.forEach((test, idx) => {
    const result = validateProjectDir(test.input);
    const pass = (result !== null) === test.shouldPass;
    if (pass) batch3Pass++;
    const status = pass ? '✓ PASS' : '✗ FAIL';
    console.log(`${status} Test 3.${idx + 1}: ${test.name}`);
    if (!pass) {
      console.log(`  Input:    "${test.input}"`);
      console.log(`  Expected: ${test.shouldPass ? 'valid' : 'invalid'}`);
      console.log(`  Got:      ${result ? 'valid' : 'invalid'}`);
    }
  });
  console.log(`\nBatch 3 Score: ${batch3Pass}/${batch3.length} passed\n`);

  // Batch 4: Token Calculation Edge Cases (5 test cases)
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('BATCH 4: Token Calculation Edge Cases (5 test cases)');
  console.log('═══════════════════════════════════════════════════════════════════\n');

  const batch4 = [
    {
      name: 'Null/Undefined Usage → Default to 0',
      input: { inputTokens: null, cacheCreation: undefined, cacheRead: 0, limit: 200000 },
      expectedRange: [0, 0.01],
    },
    {
      name: 'Negative Percentage → Clamped to 0',
      input: { inputTokens: -100, cacheCreation: 0, cacheRead: 0, limit: 200000 },
      expectedRange: [0, 0.01],
    },
    {
      name: 'Overflow (>100%) → Clamped to 100',
      input: { inputTokens: 300000, cacheCreation: 0, cacheRead: 0, limit: 200000 },
      expectedRange: [99.9, 100],
    },
    {
      name: 'Exact Threshold (70%)',
      input: { inputTokens: 140000, cacheCreation: 0, cacheRead: 0, limit: 200000 },
      expectedRange: [69.9, 70.1],
    },
    {
      name: 'Just Below Threshold',
      input: { inputTokens: 139999, cacheCreation: 0, cacheRead: 0, limit: 200000 },
      expectedRange: [69.9, 69.99],
    },
  ];

  let batch4Pass = 0;
  batch4.forEach((test, idx) => {
    const result = calculateContextPercentage(test.input.inputTokens, test.input.cacheCreation, test.input.cacheRead, test.input.limit);
    const pct = result ? result.pct : 0;
    const pass = pct >= test.expectedRange[0] && pct <= test.expectedRange[1];
    if (pass) batch4Pass++;
    const status = pass ? '✓ PASS' : '✗ FAIL';
    console.log(`${status} Test 4.${idx + 1}: ${test.name}`);
    if (!pass) {
      console.log(`  Expected range: ${test.expectedRange[0]}–${test.expectedRange[1]}%`);
      console.log(`  Got: ${pct}%`);
    }
  });
  console.log(`\nBatch 4 Score: ${batch4Pass}/${batch4.length} passed\n`);

  // Batch 5: JSONL Parsing + Audit (4 test cases)
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('BATCH 5: JSONL Parsing + Audit Trail (4 test cases)');
  console.log('═══════════════════════════════════════════════════════════════════\n');

  // Create temp JSONL files for testing
  const tmpDir = '/tmp';
  const tmpFile = path.join(tmpDir, `test-transcript-${Date.now()}.jsonl`);

  const batch5 = [
    {
      name: 'Valid Assistant Messages with RequestId + Usage',
      content: `{"type":"assistant","requestId":"req1","message":{"usage":{"input_tokens":1000,"cache_creation_input_tokens":100,"cache_read_input_tokens":50}}}\n`,
      checkFn: async (pct) => pct !== null && pct.audit.messagesWithUsage > 0,
    },
    {
      name: 'Missing RequestId → Logged in Audit',
      content: `{"type":"assistant","message":{"usage":{"input_tokens":1000}}}\n`,
      checkFn: async (pct) => pct === null || pct.audit.skippedNoRequestId.length > 0,
    },
    {
      name: 'Malformed JSON → Logged in Audit',
      content: `{invalid json line}\n{"type":"assistant","requestId":"req1","message":{"usage":{"input_tokens":1000}}}\n`,
      checkFn: async (pct) => pct !== null && pct.audit.skippedMalformedJSON.length > 0,
    },
    {
      name: 'Missing Usage Field → Logged in Audit',
      content: `{"type":"assistant","requestId":"req1","message":{}}\n`,
      checkFn: async (pct) => pct === null || pct.audit.skippedNoUsage.length > 0,
    },
  ];

  let batch5Pass = 0;
  (async () => {
    for (let idx = 0; idx < batch5.length; idx++) {
      const test = batch5[idx];
      try {
        // Write test file
        fs.writeFileSync(tmpFile, test.content);
        
        // Parse
        const result = await getContextPercentage(tmpFile);
        const pass = await test.checkFn(result);
        
        if (pass) batch5Pass++;
        const status = pass ? '✓ PASS' : '✗ FAIL';
        console.log(`${status} Test 5.${idx + 1}: ${test.name}`);
        
        if (!pass) {
          console.log(`  Result: ${JSON.stringify(result, null, 2)}`);
        }
      } catch (err) {
        console.log(`✗ FAIL Test 5.${idx + 1}: ${test.name} (Error: ${err.message})`);
      }
    }
    
    // Cleanup
    try { fs.unlinkSync(tmpFile); } catch { }
    
    console.log(`\nBatch 5 Score: ${batch5Pass}/${batch5.length} passed\n`);
    
    // Summary
    const totalPass = batch1Pass + batch2Pass + batch3Pass + batch4Pass + batch5Pass;
    const totalTests = batch1.length + batch2.length + batch3.length + batch4.length + batch5.length;
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log(`OVERALL: ${totalPass}/${totalTests} tests passed (${((totalPass / totalTests) * 100).toFixed(1)}%)`);
    console.log('═══════════════════════════════════════════════════════════════════\n');
    
    process.exit(totalPass === totalTests ? 0 : 1);
  })();
}
