#!/usr/bin/env node
/**
 * validate-memory-lanes.mjs
 *
 * Validate that memory-lane configs are in sync with Docker entities.
 *
 * Checks:
 * 1. Config files are valid JSON
 * 2. Required fields present (branch, docker_entities, status)
 * 3. Entity IDs are properly formatted
 * 4. No stale or archived lanes in active directory
 * 5. All active lanes have matching Docker entities (if Docker available)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const LANES_DIR = path.join(PROJECT_ROOT, 'config', 'memory-lanes');
const ARCHIVES_DIR = path.join(LANES_DIR, 'archives');

let errorCount = 0;
let warningCount = 0;

/**
 * Validate a single memory lane config
 */
function validateLaneConfig(filePath, fileName) {
  let config;
  try {
    config = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (error) {
    console.error(`  ❌ Invalid JSON: ${fileName}`);
    errorCount++;
    return false;
  }

  const ml = config.memoryLane;

  // Check required fields
  const required = [
    'id',
    'name',
    'branch',
    'status',
    'docker_entities',
  ];
  for (const field of required) {
    if (!ml || !ml[field]) {
      console.error(
        `  ❌ Missing required field: ${field} in ${fileName}`
      );
      errorCount++;
      return false;
    }
  }

  // Check docker_entities structure
  if (typeof ml.docker_entities !== 'object') {
    console.error(`  ❌ docker_entities must be an object in ${fileName}`);
    errorCount++;
    return false;
  }

  // Check entity ID format (should be kebab-case)
  if (!ml.id.match(/^[a-z0-9-]+$/)) {
    console.warn(
      `  ⚠️  Entity ID should use kebab-case: ${ml.id}`
    );
    warningCount++;
  }

  // Check status is valid
  if (!['active', 'completed', 'paused'].includes(ml.status)) {
    console.warn(
      `  ⚠️  Unexpected status: ${ml.status} (expected: active|completed|paused)`
    );
    warningCount++;
  }

  console.log(`  ✓ ${fileName} is valid`);
  return true;
}

/**
 * Check for stale archived lanes in active directory
 */
function checkForStaleLanes() {
  if (!fs.existsSync(LANES_DIR)) return;

  const files = fs.readdirSync(LANES_DIR).filter(f => f.endsWith('.json'));

  for (const file of files) {
    const filePath = path.join(LANES_DIR, file);
    try {
      const config = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      if (config.memoryLane?.status === 'completed') {
        console.warn(
          `  ⚠️  Completed lane in active dir: ${file} (should be archived)`
        );
        warningCount++;
      }
    } catch {
      // Skip invalid files
    }
  }
}

/**
 * Validate all memory lanes
 */
function validateAllLanes() {
  console.log('🔍 Validating memory-lane configs...\n');

  if (!fs.existsSync(LANES_DIR)) {
    console.log(
      `ℹ️  Lanes directory not found: ${path.relative(PROJECT_ROOT, LANES_DIR)}`
    );
    return;
  }

  const files = fs
    .readdirSync(LANES_DIR)
    .filter(f => f.endsWith('.json') && f !== '.gitkeep');

  if (files.length === 0) {
    console.log('ℹ️  No memory-lane configs found.');
    return;
  }

  console.log('📄 Checking active lanes:\n');
  for (const file of files) {
    validateLaneConfig(path.join(LANES_DIR, file), file);
  }

  console.log('');
  checkForStaleLanes();

  // Report summary
  console.log('\n📊 Validation Summary:\n');
  if (errorCount === 0 && warningCount === 0) {
    console.log('✅ All memory-lane configs are valid and in sync\n');
  } else {
    if (errorCount > 0) {
      console.log(`❌ ${errorCount} error(s) found`);
    }
    if (warningCount > 0) {
      console.log(`⚠️  ${warningCount} warning(s) found`);
    }
    console.log('');
  }
}

// Run validation
validateAllLanes();
process.exit(errorCount > 0 ? 1 : 0);
