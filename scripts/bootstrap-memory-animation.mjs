#!/usr/bin/env node
/**
 * Bootstrap animation memory lanes into Docker memory-reference service
 *
 * Usage:
 *   node scripts/bootstrap-memory-animation.mjs
 *
 * Prerequisites:
 *   - Docker compose stack running: `pnpm docker:mcp:up`
 *   - Memory service healthy: `pnpm docker:mcp:ps`
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MEMORY_API = 'http://localhost:3100/memory/tools/call';
const MEMORY_LANES_FILE = path.join(__dirname, '../config/memory-lanes-animation.json');

async function callMemoryTool(toolName, params) {
  try {
    const response = await fetch(MEMORY_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tool: toolName, params }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`[memory-api] ${toolName} failed:`, error.message);
    throw error;
  }
}

async function loadMemoryLanes() {
  console.log('[bootstrap] Loading animation memory lanes from config...');

  if (!fs.existsSync(MEMORY_LANES_FILE)) {
    console.error(`[bootstrap] Memory lanes file not found: ${MEMORY_LANES_FILE}`);
    process.exit(1);
  }

  const memoryConfig = JSON.parse(fs.readFileSync(MEMORY_LANES_FILE, 'utf8'));
  const memoryLanes = memoryConfig.memoryLanes || {};

  console.log(`[bootstrap] Found ${Object.keys(memoryLanes).length} memory lanes`);

  for (const [laneKey, laneData] of Object.entries(memoryLanes)) {
    console.log(`\n[bootstrap] Loading lane: ${laneKey}`);

    // Create entity for this memory lane
    const entityParams = {
      name: laneData.name,
      properties: {
        id: laneData.id,
        type: laneData.type,
        description: laneData.description,
        tags: laneData.tags || [],
        content: laneData.content || {},
        created_at: new Date().toISOString(),
      },
    };

    try {
      const result = await callMemoryTool('create_entities', [entityParams]);
      console.log(`✓ Created entity: ${laneData.name}`);
      console.log(`  ID: ${laneData.id}`);
    } catch (error) {
      console.error(`✗ Failed to create entity: ${laneData.name}`);
      throw error;
    }
  }

  console.log('\n[bootstrap] Memory lanes loaded successfully');
  console.log(`[bootstrap] Ready to rehydrate in new sessions`);
}

async function verifyMemoryAccess() {
  console.log('[bootstrap] Verifying memory service access...');
  try {
    const result = await callMemoryTool('read_graph', {});
    console.log('✓ Memory service is accessible');
    console.log(`  Existing entities: ${result.entities?.length || 0}`);
    console.log(`  Existing relations: ${result.relations?.length || 0}`);
  } catch (error) {
    console.error('✗ Cannot reach memory service at', MEMORY_API);
    console.log('\nMake sure Docker compose is running:');
    console.log('  pnpm docker:mcp:up');
    process.exit(1);
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('Bootstrap Animation Memory Lanes into Docker');
  console.log('='.repeat(60));

  try {
    await verifyMemoryAccess();
    console.log('');
    await loadMemoryLanes();
    console.log('\n' + '='.repeat(60));
    console.log('Bootstrap complete! Next session can rehydrate memory.');
    console.log('='.repeat(60));
  } catch (error) {
    console.error('\n[bootstrap] Fatal error:', error.message);
    process.exit(1);
  }
}

main();
