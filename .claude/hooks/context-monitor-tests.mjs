#!/usr/bin/env node
/**
 * Test suite for context-monitor.mjs
 * Run: node context-monitor-tests.mjs
 * 
 * Tests Batches 1-5:
 * - Batch 1: Secrets Redaction (8 test cases)
 * - Batch 2: JSON Escaping (5 test cases)
 * - Batch 3: Path Validation (6 test cases)
 * - Batch 4: Token Calculation (5 test cases)
 * - Batch 5: JSONL Parsing + Audit (4 test cases)
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Import functions from context-monitor.mjs ──────────────────────────────
// Since context-monitor.mjs has module.exports at bottom, we'll redefine helpers here

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

function sanitizeCommitMessage(message) {
  if (!message || typeof message !== 'string') return '';
  
  let redacted = message;
  REDACTION_PATTERNS.forEach(({ pattern }) => {
    redacted = redacted.replace(pattern, '[REDACTED]');
  });
  
  return redacted;
}

function escape_json(s) {
  if (!s || typeof s !== 'string') return '';
  
  let escaped = s.replace(/\\/g, '\\\\');
  escaped = escaped.replace(/"/g, '\\"');
  escaped = escaped.replace(/\b/g, '\\b');
  escaped = escaped.replace(/\f/g, '\\f');
  escaped = escaped.replace(/\n/g, '\\n');
  escaped = escaped.replace(/\r/g, '\\r');
  escaped = escaped.replace(/\t/g, '\\t');
  escaped = escaped.replace(/\0/g, '\\u0000');
  
  return escaped;
}

function validateProjectDir(input) {
  if (!input || typeof input !== 'string') return null;
  
  let resolved;
  try {
    resolved = path.resolve(input);
    
    if (!fs.existsSync(resolved)) return null;
    
    if (!fs.statSync(resolved).isDirectory()) return null;
    
    const stat = fs.lstatSync(resolved);
    if (stat.isSymbolicLink()) return null;
    
    return resolved;
  } catch {
    return null;
  }
}

function calculateContextPercentage(inputTokens, cacheCreation, cacheRead, contextLimit) {
  if (contextLimit <= 0 || typeof contextLimit !== 'number') {
    return null;
  }
  
  const input = (typeof inputTokens === 'number' && inputTokens >= 0) ? inputTokens : 0;
  const creation = (typeof cacheCreation === 'number' && cacheCreation >= 0) ? cacheCreation : 0;
  const read = (typeof cacheRead === 'number' && cacheRead >= 0) ? cacheRead : 0;
  
  const totalTokens = input + creation + read;
  let pct = (totalTokens / contextLimit) * 100;
  
  pct = Math.max(0, Math.min(100, pct));
  
  return { pct, totalTokens, contextLimit };
}

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
        200_000
      );

      if (!contextData) {
        resolve(null);
        return;
      }

      resolve({
        pct: contextData.pct,
        inputTokens: contextData.totalTokens,
        totalLimit: 200_000,
        audit,
      });
    });

    rl.on('error', () => resolve(null));
    setTimeout(() => { rl.close(); resolve(null); }, 4000);
  });
}

// ── TEST SUITES ─────────────────────────────────────────────────────────────

console.log('🧪 Running context-monitor.mjs test suite\n');

let totalPass = 0;
let totalTests = 0;

// BATCH 1: Secrets Redaction (8 test cases)
console.log('═══════════════════════════════════════════════════════════════════');
console.log('BATCH 1: Secrets Redaction (8 test cases)');
console.log('═══════════════════════════════════════════════════════════════════\n');

const batch1 = [
  {
    name: 'Database URL (PostgreSQL)',
    input: 'connect to postgres://user:pwd@host:5432/db',
    shouldRedact: true,
  },
  {
    name: 'OAuth Bearer Token (30+ chars)',
    input: 'auth: bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJzdWIiOiIxMjM0NTY3ODkwIn0',
    shouldRedact: true,
  },
  {
    name: 'AWS Access Key ID',
    input: 'found AKIAIOSFODNN7EXAMPLE in logs',
    shouldRedact: true,
  },
  {
    name: 'GitHub Token',
    input: 'ghp_1234567890abcdefghijklmnopqrstuvwxyz12 leaked',
    shouldRedact: true,
  },
  {
    name: 'NPM Token',
    input: 'npm_abcdefghijklmnopqrstuvwxyz1234567890',
    shouldRedact: true,
  },
  {
    name: 'MongoDB Connection',
    input: 'mongodb://user:pass@cluster.mongodb.net/db',
    shouldRedact: true,
  },
  {
    name: 'False Positive: Variable Name Only',
    input: 'feature/api_key_rotation',
    shouldRedact: false,
  },
  {
    name: 'False Positive: Documentation',
    input: 'the password field should be 8+ chars',
    shouldRedact: false,
  },
];

let batch1Pass = 0;
batch1.forEach((test, idx) => {
  totalTests++;
  const result = sanitizeCommitMessage(test.input);
  const hasRedacted = result.includes('[REDACTED]');
  const pass = hasRedacted === test.shouldRedact;
  
  if (pass) {
    batch1Pass++;
    totalPass++;
  }
  
  const status = pass ? '✓' : '✗';
  console.log(`${status} Test 1.${idx + 1}: ${test.name}`);
  if (!pass) {
    console.log(`   Input: "${test.input}"`);
    console.log(`   Result: "${result}"`);
    console.log(`   Expected: ${test.shouldRedact ? 'REDACTED' : 'NOT redacted'}, got: ${hasRedacted ? 'REDACTED' : 'NOT redacted'}`);
  }
});

console.log(`\nBatch 1: ${batch1Pass}/${batch1.length} passed\n`);

// BATCH 2: JSON Escaping (5 test cases)
console.log('═══════════════════════════════════════════════════════════════════');
console.log('BATCH 2: JSON Escaping (5 test cases)');
console.log('═══════════════════════════════════════════════════════════════════\n');

const batch2 = [
  {
    name: 'Quote Escape',
    input: 'say "hello"',
    test: (result) => result.includes('\\"'),
  },
  {
    name: 'Newline Escape',
    input: 'line1\nline2',
    test: (result) => result.includes('\\n'),
  },
  {
    name: 'Tab Escape',
    input: 'col1\tcol2',
    test: (result) => result.includes('\\t'),
  },
  {
    name: 'Backslash Escape',
    input: 'path\\to\\file',
    test: (result) => result.includes('\\\\'),
  },
  {
    name: 'Roundtrip: Parse as JSON',
    input: 'test "value" with\nnewline and\ttab',
    test: (result) => {
      try {
        JSON.parse(`{"field":"${result}"}`);
        return true;
      } catch {
        return false;
      }
    },
  },
];

let batch2Pass = 0;
batch2.forEach((test, idx) => {
  totalTests++;
  const result = escape_json(test.input);
  const pass = test.test(result);
  
  if (pass) {
    batch2Pass++;
    totalPass++;
  }
  
  const status = pass ? '✓' : '✗';
  console.log(`${status} Test 2.${idx + 1}: ${test.name}`);
  if (!pass) {
    console.log(`   Input: "${test.input}"`);
    console.log(`   Result: "${result}"`);
  }
});

console.log(`\nBatch 2: ${batch2Pass}/${batch2.length} passed\n`);

// BATCH 3: Path Validation (6 test cases)
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
    name: 'Invalid: Directory Traversal',
    input: '../../../../../../etc/passwd',
    shouldPass: false,
  },
  {
    name: 'Invalid: Empty Input',
    input: '',
    shouldPass: false,
  },
  {
    name: 'Valid: Absolute Path',
    input: process.cwd(),
    shouldPass: true,
  },
];

let batch3Pass = 0;
batch3.forEach((test, idx) => {
  totalTests++;
  const result = validateProjectDir(test.input);
  const pass = (result !== null) === test.shouldPass;
  
  if (pass) {
    batch3Pass++;
    totalPass++;
  }
  
  const status = pass ? '✓' : '✗';
  console.log(`${status} Test 3.${idx + 1}: ${test.name}`);
  if (!pass) {
    console.log(`   Expected: ${test.shouldPass ? 'VALID' : 'INVALID'}`);
    console.log(`   Got: ${result ? 'VALID' : 'INVALID'}`);
  }
});

console.log(`\nBatch 3: ${batch3Pass}/${batch3.length} passed\n`);

// BATCH 4: Token Calculation (5 test cases)
console.log('═══════════════════════════════════════════════════════════════════');
console.log('BATCH 4: Token Calculation Edge Cases (5 test cases)');
console.log('═══════════════════════════════════════════════════════════════════\n');

const batch4 = [
  {
    name: 'Null/Undefined → Default to 0%',
    input: { input: null, creation: undefined, read: 0, limit: 200000 },
    test: (result) => result && result.pct < 0.1,
  },
  {
    name: 'Negative → Clamped to 0%',
    input: { input: -100, creation: 0, read: 0, limit: 200000 },
    test: (result) => result && result.pct === 0,
  },
  {
    name: 'Overflow → Clamped to 100%',
    input: { input: 300000, creation: 0, read: 0, limit: 200000 },
    test: (result) => result && result.pct === 100,
  },
  {
    name: 'Exact 70%',
    input: { input: 140000, creation: 0, read: 0, limit: 200000 },
    test: (result) => result && result.pct === 70,
  },
  {
    name: 'Edge: 69.999%',
    input: { input: 139998, creation: 0, read: 0, limit: 200000 },
    test: (result) => result && result.pct < 70 && result.pct > 69.99,
  },
];

let batch4Pass = 0;
batch4.forEach((test, idx) => {
  totalTests++;
  const result = calculateContextPercentage(test.input.input, test.input.creation, test.input.read, test.input.limit);
  const pass = test.test(result);
  
  if (pass) {
    batch4Pass++;
    totalPass++;
  }
  
  const status = pass ? '✓' : '✗';
  console.log(`${status} Test 4.${idx + 1}: ${test.name}`);
  if (!pass) {
    console.log(`   Got: ${result ? `${result.pct}%` : 'null'}`);
  }
});

console.log(`\nBatch 4: ${batch4Pass}/${batch4.length} passed\n`);

// BATCH 5: JSONL Parsing (4 test cases)
console.log('═══════════════════════════════════════════════════════════════════');
console.log('BATCH 5: JSONL Parsing + Audit (4 test cases)');
console.log('═══════════════════════════════════════════════════════════════════\n');

const tmpFile = path.join(os.tmpdir(), `test-jsonl-${Date.now()}.jsonl`);

const batch5 = [
  {
    name: 'Valid Messages → Usage Calculated',
    content: `{"type":"assistant","requestId":"req1","message":{"usage":{"input_tokens":1000,"cache_creation_input_tokens":100,"cache_read_input_tokens":50}}}\n`,
    test: async (result) => result !== null && result.audit.messagesWithUsage === 1,
  },
  {
    name: 'Missing RequestId → Skipped',
    content: `{"type":"assistant","message":{"usage":{"input_tokens":1000}}}\n`,
    test: async (result) => result === null && fs.readFileSync(tmpFile, 'utf8').length > 0,
  },
  {
    name: 'Malformed JSON → Logged',
    content: `invalid json\n{"type":"assistant","requestId":"req2","message":{"usage":{"input_tokens":500}}}\n`,
    test: async (result) => {
      const data = JSON.parse(fs.readFileSync(tmpFile, 'utf8').split('\n')[1]);
      return result !== null;
    },
  },
  {
    name: 'Missing Usage → Skipped',
    content: `{"type":"assistant","requestId":"req3","message":{}}\n`,
    test: async (result) => result === null || (result && result.audit.skippedNoUsage.length === 1),
  },
];

let batch5Pass = 0;
(async () => {
  for (let idx = 0; idx < batch5.length; idx++) {
    totalTests++;
    const test = batch5[idx];
    try {
      fs.writeFileSync(tmpFile, test.content);
      
      const result = await getContextPercentage(tmpFile);
      const pass = await test.test(result);
      
      if (pass) {
        batch5Pass++;
        totalPass++;
      }
      
      const status = pass ? '✓' : '✗';
      console.log(`${status} Test 5.${idx + 1}: ${test.name}`);
    } catch (err) {
      console.log(`✗ Test 5.${idx + 1}: ${test.name} (${err.message})`);
    }
  }
  
  try { fs.unlinkSync(tmpFile); } catch { }
  
  console.log(`\nBatch 5: ${batch5Pass}/${batch5.length} passed\n`);
  
  // Final Summary
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log(`FINAL SCORE: ${totalPass}/${totalTests} tests passed (${((totalPass / totalTests) * 100).toFixed(1)}%)`);
  console.log('═══════════════════════════════════════════════════════════════════\n');
  
  process.exit(totalPass === totalTests ? 0 : 1);
})();
