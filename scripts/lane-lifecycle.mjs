#!/usr/bin/env node
/**
 * lane-lifecycle.mjs
 *
 * Manage memory-lane state transitions and lifecycle.
 *
 * Commands:
 *   npm run lane:open {phase-name}           → Create config + Docker entity + relations
 *   npm run lane:sync [optional: phase]      → Update config snapshot + Docker observations
 *   npm run lane:close {phase-name}          → Mark completed + archive config
 *   npm run lane:list [--active|--archived]  → Show active/archived lanes
 *   npm run validate:memory-lanes            → Check config/Docker sync
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const LANES_DIR = path.join(PROJECT_ROOT, 'config', 'memory-lanes');
const ARCHIVES_DIR = path.join(LANES_DIR, 'archives');

// Ensure directories exist
[LANES_DIR, ARCHIVES_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

/**
 * Get current git branch
 */
function getCurrentBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', {
      cwd: PROJECT_ROOT,
      encoding: 'utf-8',
    }).trim();
  } catch {
    return 'unknown';
  }
}

/**
 * Validate phase name format (kebab-case: a-z, 0-9, hyphens only)
 */
function validatePhaseName(phaseName) {
  if (!phaseName.match(/^[a-z0-9-]+$/)) {
    console.error(`❌ Invalid phase name: "${phaseName}"`);
    console.error('   Must use kebab-case (lowercase letters, numbers, hyphens only)');
    console.error('   Example: phase-7-dark-mode');
    process.exit(1);
  }
}

/**
 * Command: lane:open {phase-name}
 * Creates a new memory lane config and sets up Docker entity
 */
function commandOpen(phaseName) {
  if (!phaseName) {
    console.error('❌ Usage: npm run lane:open {phase-name}');
    console.error('   Example: npm run lane:open phase-7-dark-mode');
    process.exit(1);
  }

  validatePhaseName(phaseName);

  const configPath = path.join(LANES_DIR, `${phaseName}.json`);
  if (fs.existsSync(configPath)) {
    console.warn(
      `⚠️  Memory lane "${phaseName}" already exists at ${path.relative(PROJECT_ROOT, configPath)}`
    );
    return;
  }

  const branch = getCurrentBranch();
  const now = new Date().toISOString();

  const config = {
    memoryLane: {
      id: `feat-${phaseName}`,
      name: formatPhaseName(phaseName),
      description: `Phase development: ${phaseName}`,
      branch,
      status: 'active',
      created_date: now.split('T')[0],
      docker_entities: {
        project_state: 'electrical-website-state',
        feature: `feat-${phaseName}`,
      },
      related_learnings: [],
      related_decisions: [],
      work_snapshot: {
        files_modified: 0,
        commits_created: 0,
        last_updated: now,
        test_coverage: 0,
      },
    },
  };

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log(
    `✅ Created memory lane: ${path.relative(PROJECT_ROOT, configPath)}`
  );
  console.log(`   Phase: ${phaseName}`);
  console.log(`   Branch: ${branch}`);
  console.log(
    `   \n   Next: Create Docker entity via mcp__MCP_DOCKER__create_entities()`
  );
}

/**
 * Command: lane:sync [optional: phase]
 * Updates memory lane config with current snapshot
 */
function commandSync(phaseName) {
  const lanes = findActiveLanes();

  if (lanes.length === 0) {
    console.log('ℹ️  No active memory lanes found.');
    return;
  }

  const targetLanes = phaseName
    ? lanes.filter(lane => lane.name === phaseName)
    : lanes;

  if (targetLanes.length === 0) {
    console.warn(
      `⚠️  No memory lane found matching "${phaseName}". Available lanes:`
    );
    lanes.forEach(lane => console.log(`   - ${lane.name}`));
    return;
  }

  targetLanes.forEach(lane => {
    const config = JSON.parse(fs.readFileSync(lane.path, 'utf-8'));

    // Update snapshot
    const gitStatus = getGitStats();
    config.memoryLane.work_snapshot = {
      files_modified: gitStatus.filesModified,
      commits_created: gitStatus.commitsCreated,
      last_updated: new Date().toISOString(),
      test_coverage: 0,
    };

    fs.writeFileSync(lane.path, JSON.stringify(config, null, 2));
    console.log(
      `✅ Synced: ${path.relative(PROJECT_ROOT, lane.path)}`
    );
    console.log(
      `   Last updated: ${config.memoryLane.work_snapshot.last_updated}`
    );
  });
}

/**
 * Command: lane:close {phase-name}
 * Archives a memory lane and marks it completed
 */
function commandClose(phaseName) {
  if (!phaseName) {
    console.error('❌ Usage: npm run lane:close {phase-name}');
    process.exit(1);
  }

  validatePhaseName(phaseName);

  const configPath = path.join(LANES_DIR, `${phaseName}.json`);
  if (!fs.existsSync(configPath)) {
    console.error(`❌ Memory lane not found: ${phaseName}`);
    process.exit(1);
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  config.memoryLane.status = 'completed';
  config.memoryLane.completed_date = new Date().toISOString().split('T')[0];

  // Write updated config to archivePath BEFORE renaming
  const archivePath = path.join(
    ARCHIVES_DIR,
    `${phaseName}-${Date.now()}.json`
  );
  fs.writeFileSync(archivePath, JSON.stringify(config, null, 2));

  // Remove original from active lanes
  fs.unlinkSync(configPath);

  console.log(`✅ Closed and archived: ${phaseName}`);
  console.log(`   Archived to: ${path.relative(PROJECT_ROOT, archivePath)}`);
  console.log(
    `   \n   Next: Update Docker entity status via mcp__MCP_DOCKER__add_observations()`
  );
}

/**
 * Command: lane:list [--active|--archived]
 * Lists all memory lanes
 */
function commandList(filter) {
  const active = findActiveLanes();
  const archived = findArchivedLanes();

  if (filter === '--active' || !filter) {
    console.log('\n📌 Active Memory Lanes:\n');
    if (active.length === 0) {
      console.log('   (none)');
    } else {
      active.forEach(lane => {
        const config = JSON.parse(fs.readFileSync(lane.path, 'utf-8'));
        const ml = config.memoryLane;
        console.log(`   ${ml.id}`);
        console.log(`     Name: ${ml.name}`);
        console.log(`     Branch: ${ml.branch}`);
        console.log(
          `     Updated: ${ml.work_snapshot.last_updated.split('T')[0]}`
        );
        console.log('');
      });
    }
  }

  if (filter === '--archived' || !filter) {
    console.log('📦 Archived Memory Lanes:\n');
    if (archived.length === 0) {
      console.log('   (none)');
    } else {
      archived.forEach(lane => {
        const config = JSON.parse(fs.readFileSync(lane.path, 'utf-8'));
        const ml = config.memoryLane;
        console.log(`   ${ml.id}`);
        console.log(
          `     Completed: ${ml.completed_date || 'unknown'}`
        );
        console.log('');
      });
    }
  }
}

/**
 * Find active memory lanes
 */
function findActiveLanes() {
  if (!fs.existsSync(LANES_DIR)) return [];

  return fs
    .readdirSync(LANES_DIR)
    .filter(f => f.endsWith('.json') && f !== '.gitkeep')
    .map(f => ({
      name: f.replace('.json', ''),
      path: path.join(LANES_DIR, f),
    }))
    .filter(lane => {
      try {
        const config = JSON.parse(fs.readFileSync(lane.path, 'utf-8'));
        return config.memoryLane?.status === 'active';
      } catch {
        return false;
      }
    });
}

/**
 * Find archived memory lanes
 */
function findArchivedLanes() {
  if (!fs.existsSync(ARCHIVES_DIR)) return [];

  return fs
    .readdirSync(ARCHIVES_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => ({
      name: f.replace('.json', ''),
      path: path.join(ARCHIVES_DIR, f),
    }));
}

/**
 * Get current git stats
 */
function getGitStats() {
  try {
    const modifiedOutput = execSync('git status --porcelain', {
      cwd: PROJECT_ROOT,
      encoding: 'utf-8',
    });
    const filesModified = modifiedOutput.split('\n').filter(l => l.trim()).length;

    // Count commits in current branch compared to main
    let commitsCreated = 0;
    try {
      const commitCountOutput = execSync(
        'git rev-list --count main..HEAD',
        {
          cwd: PROJECT_ROOT,
          encoding: 'utf-8',
        }
      ).trim();
      commitsCreated = parseInt(commitCountOutput, 10) || 0;
    } catch {
      // If main doesn't exist or comparison fails, fall back to 0
      commitsCreated = 0;
    }

    return {
      filesModified,
      commitsCreated,
    };
  } catch {
    return { filesModified: 0, commitsCreated: 0 };
  }
}

/**
 * Format phase name (kebab-case → Title Case)
 */
function formatPhaseName(name) {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Main CLI dispatcher
 */
function main() {
  const [, , command, ...args] = process.argv;

  switch (command) {
    case 'open':
      commandOpen(args[0]);
      break;
    case 'sync':
      commandSync(args[0]);
      break;
    case 'close':
      commandClose(args[0]);
      break;
    case 'list':
      commandList(args[0]);
      break;
    default:
      console.log('Lane Lifecycle Manager');
      console.log('');
      console.log('Commands:');
      console.log('  open {phase}      Create new memory lane');
      console.log('  sync [phase]      Update lane snapshot');
      console.log('  close {phase}     Archive lane (mark completed)');
      console.log('  list [--active|--archived]  Show lanes');
      console.log('');
      console.log('Examples:');
      console.log(
        '  node scripts/lane-lifecycle.mjs open phase-7-dark-mode'
      );
      console.log('  node scripts/lane-lifecycle.mjs sync');
      console.log('  node scripts/lane-lifecycle.mjs list --active');
  }
}

main();
