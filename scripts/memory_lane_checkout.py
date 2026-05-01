#!/usr/bin/env python3
"""
Post-checkout hook — writes active-branch.json when branch changes.
Args: <prev-head> <new-head> <branch-flag>
branch-flag = 1 for branch checkout, 0 for file checkout
"""
from __future__ import annotations
import json
import subprocess
import sys
import urllib.request
import urllib.error
from pathlib import Path
from datetime import datetime, timezone

PROJECT_ROOT = Path(subprocess.run(
    ['git', 'rev-parse', '--show-toplevel'],
    capture_output=True, text=True
).stdout.strip())
GATEWAY = 'http://127.0.0.1:3100'


def get_git_branch() -> str:
    result = subprocess.run(['git', 'rev-parse', '--abbrev-ref', 'HEAD'],
                            capture_output=True, text=True, cwd=PROJECT_ROOT)
    return result.stdout.strip() if result.returncode == 0 else 'unknown'


def get_git_log(n: int = 3) -> str:
    result = subprocess.run(['git', 'log', '--oneline', f'-{n}'],
                            capture_output=True, text=True, cwd=PROJECT_ROOT)
    lines = [line.strip() for line in result.stdout.strip().splitlines() if line.strip()]
    return ' | '.join(lines)


def branch_to_slug(branch: str) -> str:
    for prefix in ('feat/', 'fix/', 'chore/', 'refactor/', 'docs/', 'test/', 'style/', 'perf/', 'ci/', 'hotfix/'):
        if branch.startswith(prefix):
            branch = branch[len(prefix):]
            break
    return branch.replace('/', '-')


def read_json(path: Path) -> dict:
    try:
        return json.loads(path.read_text(encoding='utf-8'))
    except Exception:
        return {}


def write_json_atomic(path: Path, data: dict) -> None:
    tmp = path.with_suffix('.json.tmp')
    try:
        tmp.write_text(json.dumps(data, indent=2) + '\n', encoding='utf-8')
        tmp.replace(path)
    except Exception:
        pass  # never fail a git hook


def check_docker_health(timeout: float = 1.5) -> bool:
    try:
        req = urllib.request.Request(f'{GATEWAY}/health')
        with urllib.request.urlopen(req, timeout=timeout):
            return True
    except Exception:
        return False


def mcp_call(tool_name: str, args: dict, timeout: float = 3.0) -> dict | None:
    try:
        payload = json.dumps({'name': tool_name, 'arguments': args}).encode()
        req = urllib.request.Request(
            f'{GATEWAY}/memory/tools/call',
            data=payload,
            headers={'Content-Type': 'application/json'},
            method='POST',
        )
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return json.loads(resp.read().decode())
    except Exception:
        return None


def main() -> None:
    args = sys.argv[1:]
    # branchFlag is arg index 2 (0-indexed) — skip file checkouts
    if len(args) >= 3 and args[2] == '0':
        return

    current_branch = get_git_branch()
    slug = branch_to_slug(current_branch)

    active_branch_path = PROJECT_ROOT / 'config' / 'active-branch.json'
    config = read_json(active_branch_path)

    # Idempotency guard
    if config.get('branch') == current_branch:
        print(f'[lane:checkout] Already on "{current_branch}" — no-op.')
        return

    # Pause previous lane in Docker (best-effort)
    previous_entity = config.get('entity')
    docker_online = check_docker_health()
    now = datetime.now(timezone.utc).isoformat()

    if docker_online and previous_entity and previous_entity != f'feat-{slug}':
        mcp_call('add_observations', {
            'observations': [{
                'entityName': previous_entity,
                'contents': [f'lane_status: paused | paused_at: {now}'],
            }]
        })

    # Determine new entity name
    new_entity = 'electrical-website-state' if slug == 'main' else f'feat-{slug}'

    # Ensure lane manifest exists in config/memory-lanes/
    manifest_path = PROJECT_ROOT / 'config' / 'memory-lanes' / f'{slug}.json'
    if not manifest_path.exists() and slug != 'main':
        manifest_path.parent.mkdir(parents=True, exist_ok=True)
        manifest = {
            'memoryLane': {
                'id': new_entity,
                'branch': current_branch,
                'dockerEntity': new_entity,
                'status': 'pending',
                'openedAt': now,
                'mergedAt': None,
                'fallback_summary': f'Auto-registered branch: {current_branch}',
            }
        }
        write_json_atomic(manifest_path, manifest)
        if docker_online:
            mcp_call('create_entities', {
                'entities': [{
                    'name': new_entity,
                    'entityType': 'feature',
                    'observations': [
                        f'branch: {current_branch}',
                        'status: pending',
                        f'opened_at: {now}',
                        'auto_registered: true',
                    ],
                }]
            })

    # Activate new lane in Docker
    if docker_online:
        mcp_call('add_observations', {
            'observations': [{
                'entityName': new_entity,
                'contents': [f'lane_status: active | resumed_at: {now}'],
            }]
        })

    # Write slim active-branch.json
    fallback = get_git_log(3)
    write_json_atomic(active_branch_path, {
        'branch': current_branch,
        'entity': new_entity,
        'fallback': fallback,
        'updatedAt': now,
    })
    print(f'[lane:checkout] Activated lane: {new_entity} (branch: {current_branch})')


if __name__ == '__main__':
    try:
        main()
    except Exception as e:
        print(f'[lane:checkout] Error (non-fatal): {e}', file=sys.stderr)
    sys.exit(0)
