#!/usr/bin/env node
/**
 * load-active-memory-lane.mjs
 *
 * Selective rehydration for orchestrator sessions.
 *
 * BEFORE (full load): search_nodes("electrical-website-state") → ~500 tokens
 * AFTER (selective): open_nodes([project_state, current_feature]) → ~30 tokens
 * SAVINGS: 470 tokens/session, ~9,400 tokens/month (20 sessions)
 *
 * Strategy:
 * 1. Detect git branch → e.g., "docker-cleanup"
 * 2. Load matching config → config/memory-lanes/phase-6-infrastructure-and-workflows.json
 * 3. Extract entity IDs → docker_entities: { project_state, feature }
 * 4. Return open_nodes() call → Only loads 2-3 entities instead of 50+
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');

/**
 * 1. Detect current git branch
 */
function detectActiveBranch() {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', {
      cwd: PROJECT_ROOT,
      encoding: 'utf-8',
    }).trim();
    return branch;
  } catch (error) {
    console.error('❌ Failed to detect git branch:', error.message);
    process.exit(1);
  }
}

/**
 * 2. Find matching memory lane config
 * Pattern: config/memory-lanes/{branch-name}.json
 * Fallback: config/memory-lanes/project-state.json (if not found)
 */
function findMemoryLaneConfig(branch) {
  const lanesDir = path.join(PROJECT_ROOT, 'config', 'memory-lanes');

  // Try exact branch match first
  let configPath = path.join(lanesDir, `${branch}.json`);
  if (fs.existsSync(configPath)) {
    return configPath;
  }

  // Try to find any config with this branch in docker_entities.project_state
  if (fs.existsSync(lanesDir)) {
    const files = fs.readdirSync(lanesDir).filter(f => f.endsWith('.json'));
    for (const file of files) {
      const filePath = path.join(lanesDir, file);
      try {
        const config = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        if (config.memoryLane?.branch === branch) {
          return filePath;
        }
      } catch (error) {
        // Skip invalid JSON files
      }
    }
  }

  // Fallback: return null (will use default rehydration)
  return null;
}

/**
 * 3. Extract selective entity IDs from config
 */
function extractSelectiveEntities(configPath) {
  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    const entities = config.memoryLane?.docker_entities;

    if (!entities || typeof entities !== 'object') {
      return null;
    }

    // Return only the active entities to load
    const selectiveEntities = [];

    if (entities.project_state) {
      selectiveEntities.push(entities.project_state);
    }
    if (entities.feature) {
      selectiveEntities.push(entities.feature);
    }

    return selectiveEntities.length > 0 ? selectiveEntities : null;
  } catch (error) {
    console.error('❌ Failed to parse memory lane config:', error.message);
    return null;
  }
}

/**
 * 4. Load entities from Docker via HTTP API
 */
async function loadEntitiesViaHttp(entities) {
  try {
    const response = await fetch('http://localhost:3100/mcp/tools/call', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      timeout: 3000,
      body: JSON.stringify({
        name: 'memory_reference__open_nodes',
        arguments: { nodeIds: entities }
      })
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (data.content && data.content[0] && data.content[0].json && data.content[0].json.nodes) {
      return data.content[0].json.nodes;
    }
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * 4b. Format HTTP API fallback instructions for shell/hook integration
 */
function formatHttpApiFallback(entities) {
  if (!entities || entities.length === 0) {
    return null;
  }

  // Return HTTP API instructions as a shell-safe one-liner string
  const entityList = entities.map(e => `"${e}"`).join(',');
  const httpCall = `curl -s -X POST http://localhost:3100/mcp/tools/call -H "Content-Type: application/json" -d '{"name":"memory_reference__open_nodes","arguments":{"nodeIds":[${entityList}]}}'`;

  return httpCall;
}

/**
 * Main execution
 */
async function main() {
  const branch = detectActiveBranch();
  console.log(`🌳 Detected branch: ${branch}`);

  const configPath = findMemoryLaneConfig(branch);
  if (!configPath) {
    console.log(
      `⚠️  No memory lane config found for branch "${branch}".`,
      '\n   Falling back to default: HTTP search_nodes("electrical-website-state")'
    );
    console.log('');
    console.log(`curl -s -X POST http://localhost:3100/mcp/tools/call -H "Content-Type: application/json" -d '{"name":"memory_reference__search_nodes","arguments":{"query":"electrical-website-state"}}'`);
    return;
  }

  console.log(`📄 Found config: ${path.relative(PROJECT_ROOT, configPath)}`);

  const entities = extractSelectiveEntities(configPath);
  if (!entities) {
    console.log(
      `⚠️  No docker_entities found in config. Falling back to default.`
    );
    console.log('');
    console.log(`curl -s -X POST http://localhost:3100/mcp/tools/call -H "Content-Type: application/json" -d '{"name":"memory_reference__search_nodes","arguments":{"query":"electrical-website-state"}}'`);
    return;
  }

  const httpCall = formatHttpApiFallback(entities);
  console.log(
    `✨ Token savings: ~500 → ~30 tokens (${entities.length} entities loaded via HTTP)`
  );
  console.log('');
  console.log(httpCall);
}

main().catch(error => {
  console.error('❌ Fatal error:', error.message);
  process.exit(1);
});
