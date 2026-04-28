#!/usr/bin/env node
// scripts/install-git-hooks.mjs
// Idempotent installer for post-checkout and post-commit git hooks

import { readFileSync, writeFileSync, existsSync, chmodSync } from 'fs';
import { join, resolve } from 'path';
import { execSync } from 'child_process';

const IS_WINDOWS = process.platform === 'win32';

// Find .git/hooks directory by traversing upward
function findGitHooksDir(startDir) {
  let dir = resolve(startDir);
  for (let i = 0; i < 10; i++) {
    const candidate = join(dir, '.git', 'hooks');
    if (existsSync(candidate)) return candidate;
    const parent = resolve(dir, '..');
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

const PROJECT_ROOT = (() => {
  try { return execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim(); } catch { return process.cwd(); }
})();

const hooksDir = findGitHooksDir(PROJECT_ROOT);
if (!hooksDir) {
  console.error('[hooks:install] Could not find .git/hooks directory. Are you inside a git repo?');
  process.exit(0);
}

const SIGNATURE_CHECKOUT = '# memory-lane-activate — installed by pnpm hooks:install';
const SIGNATURE_COMMIT   = '# memory-lane-commit — installed by pnpm hooks:install';

const POST_CHECKOUT_CONTENT = `#!/usr/bin/env bash
${SIGNATURE_CHECKOUT}
if [ "$3" != "1" ]; then exit 0; fi
if ! command -v node >/dev/null 2>&1; then exit 0; fi
node "$(git rev-parse --show-toplevel)/scripts/memory-lane-activate.mjs" "$1" "$2" "$3" \\
  >/tmp/memory-lane-activate.log 2>&1 &
exit 0
`;

const POST_COMMIT_CONTENT = `#!/usr/bin/env bash
${SIGNATURE_COMMIT}
if ! command -v node >/dev/null 2>&1; then exit 0; fi
node "$(git rev-parse --show-toplevel)/scripts/memory-lane-commit.mjs" \\
  >/tmp/memory-lane-commit.log 2>&1
exit 0
`;

const hooks = [
  { filename: 'post-checkout', signature: SIGNATURE_CHECKOUT, content: POST_CHECKOUT_CONTENT },
  { filename: 'post-commit',   signature: SIGNATURE_COMMIT,   content: POST_COMMIT_CONTENT   },
];

for (const hook of hooks) {
  const hookPath = join(hooksDir, hook.filename);

  if (existsSync(hookPath)) {
    const existing = readFileSync(hookPath, 'utf8');

    if (existing.includes(hook.signature)) {
      console.log(`[hooks:install] ${hook.filename}: already installed — skipping`);
      continue;
    }

    // Append to existing hook (preserve existing hooks)
    const separator = existing.endsWith('\n') ? '\n' : '\n\n';
    writeFileSync(hookPath, existing + separator + hook.content, 'utf8');
    console.log(`[hooks:install] ${hook.filename}: appended to existing hook`);
  } else {
    writeFileSync(hookPath, hook.content, 'utf8');
    console.log(`[hooks:install] ${hook.filename}: created`);
  }

  // chmod +x on non-Windows
  if (!IS_WINDOWS) {
    try { chmodSync(hookPath, 0o755); } catch { /* ignore */ }
  }
}

console.log('[hooks:install] Done. Git hooks installed successfully.');
process.exit(0);
