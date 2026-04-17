#!/usr/bin/env node
/**
 * Validate .claude scaffold before committing
 *
 * This script mimics the GitHub Skill Sync Check validation but runs locally
 * so you catch errors BEFORE pushing to GitHub.
 *
 * Usage:
 *   node scripts/validate-claude-scaffold.mjs
 *
 * Exit codes:
 *   0 = all checks passed
 *   1 = validation failed
 */

import { readdirSync, readFileSync, existsSync, statSync } from 'fs';
import { join } from 'path';

const root = process.cwd();
const errors = [];

console.log('🔍 Validating .claude scaffold...\n');

// ============================================================================
// Check 1: Required files in agents and skills directories
// ============================================================================

console.log('📋 Check 1: Required files in agents/skills directories...');

const readDirs = (base) => readdirSync(base, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

const requiredPairs = [
  { base: '.claude/agents', required: ['AGENT.md', 'README.md'] },
  { base: '.claude/skills', required: ['SKILL.md', 'README.md'] },
];

for (const pair of requiredPairs) {
  if (!existsSync(pair.base)) {
    errors.push(`Missing required directory: ${pair.base}`);
    continue;
  }

  for (const dir of readDirs(pair.base)) {
    const dirPath = join(pair.base, dir);
    for (const requiredFile of pair.required) {
      const filePath = join(dirPath, requiredFile);
      if (!existsSync(filePath)) {
        errors.push(`Missing ${requiredFile} in ${dirPath}`);
      }
    }
  }
}

console.log(errors.length === 0 ? '  ✓ All required files present\n' : '');

// ============================================================================
// Check 2: Frontmatter validation
// ============================================================================

console.log('📝 Check 2: Frontmatter validation (name, description)...');

const frontmatterErrors = [];

for (const pair of requiredPairs) {
  if (!existsSync(pair.base)) continue;

  for (const dir of readDirs(pair.base)) {
    const dirPath = join(pair.base, dir);
    const contractFile = pair.base.endsWith('agents') ? 'AGENT.md' : 'SKILL.md';
    const contractPath = join(dirPath, contractFile);

    if (!existsSync(contractPath)) continue;

    const content = readFileSync(contractPath, 'utf8');
    // Handle both CRLF (Windows) and LF (Unix) line endings
    const normalized = content.replace(/\r\n/g, '\n');
    const frontmatterMatch = normalized.match(/^---\n([\s\S]*?)\n---/);

    if (!frontmatterMatch) {
      frontmatterErrors.push(`Missing frontmatter in ${contractPath}`);
      continue;
    }

    const frontmatter = frontmatterMatch[1];
    const nameMatch = frontmatter.match(/^name:\s*(.+)$/m);
    const descriptionMatch = frontmatter.match(/^description:\s*(.+)$/m);

    // Trim values to handle any whitespace or control characters
    const name = nameMatch ? nameMatch[1].trim() : null;
    const description = descriptionMatch ? descriptionMatch[1].trim() : null;

    if (!name) {
      frontmatterErrors.push(`Missing frontmatter 'name' in ${contractPath}`);
    } else if (name !== dir) {
      frontmatterErrors.push(`Frontmatter name '${name}' does not match directory '${dir}' in ${contractPath}`);
    }

    if (!description) {
      frontmatterErrors.push(`Missing frontmatter 'description' in ${contractPath}`);
    }
  }
}

errors.push(...frontmatterErrors);
console.log(frontmatterErrors.length === 0 ? '  ✓ All frontmatter valid\n' : '');

// ============================================================================
// Check 3: Broken .claude references
// ============================================================================

console.log('🔗 Check 3: Checking for broken .claude file references...');

const walkMarkdown = (base) => {
  const results = [];
  const walk = (current) => {
    try {
      for (const entry of readdirSync(current, { withFileTypes: true })) {
        const full = join(current, entry.name);
        if (entry.isDirectory()) {
          walk(full);
        } else if (entry.isFile() && full.endsWith('.md')) {
          results.push(full);
        }
      }
    } catch (e) {
      // Skip directories we can't read
    }
  };
  walk(base);
  return results;
};

const referenceErrors = [];

if (existsSync('.claude')) {
  const mdFiles = walkMarkdown('.claude');
  for (const filePath of mdFiles) {
    const content = readFileSync(filePath, 'utf8');
    // Handle both CRLF (Windows) and LF (Unix) line endings
    const normalized = content.replace(/\r\n/g, '\n');
    // Find all backtick-quoted .claude references
    const references = [...normalized.matchAll(/`(\.claude\/[^`\n]+)`/g)].map((match) => match[1]);

    for (const ref of references) {
      // Skip glob patterns and markdown syntax
      if (ref.includes('*') || ref.includes('[') || ref.includes(']')) {
        continue;
      }

      const normalized = ref.replace(/\/+/g, '/').replace(/\/$/, '');
      const resolved = join(root, normalized);

      if (!existsSync(resolved)) {
        referenceErrors.push(`Broken .claude reference '${ref}' in ${filePath}`);
      } else {
        try {
          const info = statSync(resolved);
          if (!info.isFile() && !info.isDirectory()) {
            referenceErrors.push(`Invalid .claude reference '${ref}' in ${filePath}`);
          }
        } catch (e) {
          referenceErrors.push(`Cannot stat .claude reference '${ref}' in ${filePath}`);
        }
      }
    }
  }
}

errors.push(...referenceErrors);
console.log(referenceErrors.length === 0 ? '  ✓ No broken references found\n' : '');

// ============================================================================
// Report Results
// ============================================================================

if (errors.length > 0) {
  console.log('❌ VALIDATION FAILED:\n');
  for (const error of errors) {
    console.log(`  ✗ ${error}`);
  }
  console.log(`\n${errors.length} error(s) found.`);
  console.log('\n📖 Quick fixes:');
  console.log('  - Check that all file references use correct paths');
  console.log('  - Ensure AGENT.md and SKILL.md have name and description in frontmatter');
  console.log('  - Verify deleted files are not still referenced\n');
  process.exit(1);
} else {
  console.log('✅ VALIDATION PASSED\n');
  console.log('All .claude files are valid and ready to commit!');
  process.exit(0);
}
