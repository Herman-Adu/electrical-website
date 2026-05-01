#!/usr/bin/env python3
"""
Post-commit hook — updates active-branch.json fallback field with latest commit.
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


def get_latest_commit() -> str:
    result = subprocess.run(['git', 'log', '-1', '--format=%h %s'],
                            capture_output=True, text=True, cwd=PROJECT_ROOT)
    return result.stdout.strip() if result.returncode == 0 else 'unknown commit'


def get_changed_files() -> list[str]:
    result = subprocess.run(
        ['git', 'diff', 'HEAD~1', '--name-only'],
        capture_output=True, text=True, cwd=PROJECT_ROOT
    )
    if result.returncode != 0:
        result = subprocess.run(
            ['git', 'show', '--name-only', '--format=', 'HEAD'],
            capture_output=True, text=True, cwd=PROJECT_ROOT
        )
    return [f for f in result.stdout.strip().splitlines() if f][:10]


def read_json(path: Path) -> dict:
    try:
        return json.loads(path.read_text(encoding='utf-8'))
    except Exception:
        return {}


def write_json(path: Path, data: dict) -> None:
    try:
        path.write_text(json.dumps(data, indent=2) + '\n', encoding='utf-8')
    except Exception:
        pass


def check_docker_health(timeout: float = 1.0) -> bool:
    try:
        req = urllib.request.Request(f'{GATEWAY}/health')
        with urllib.request.urlopen(req, timeout=timeout):
            return True
    except Exception:
        return False


def mcp_call(tool_name: str, args: dict, timeout: float = 1.8) -> bool:
    try:
        payload = json.dumps({'name': tool_name, 'arguments': args}).encode()
        req = urllib.request.Request(
            f'{GATEWAY}/memory/tools/call',
            data=payload,
            headers={'Content-Type': 'application/json'},
            method='POST',
        )
        with urllib.request.urlopen(req, timeout=timeout):
            return True
    except Exception:
        return False


def main() -> None:
    active_branch_path = PROJECT_ROOT / 'config' / 'active-branch.json'
    config = read_json(active_branch_path)
    if not config:
        return

    entity = config.get('entity', '')
    config_branch = config.get('branch', '')
    current_branch = get_git_branch()

    # Only run if branch matches
    if config_branch != current_branch:
        return

    commit_info = get_latest_commit()
    changed_files = get_changed_files()
    first_three = ', '.join(changed_files[:3])
    extra = f' (+{len(changed_files) - 3} more)' if len(changed_files) > 3 else ''
    files_str = f'files: {first_three}{extra}' if first_three else 'files: (none)'
    now = datetime.now(timezone.utc).isoformat()
    observation = f'commit: {commit_info} — {files_str} | at: {now}'

    # Update Docker
    docker_online = check_docker_health()
    if docker_online and entity:
        mcp_call('add_observations', {
            'observations': [{'entityName': entity, 'contents': [observation]}]
        })

    # Update fallback: prepend new commit, keep last 3
    existing_fallback = config.get('fallback', '')
    existing_entries = [e.strip() for e in existing_fallback.split(' | ') if e.strip()]
    commit_short = commit_info[:60]
    new_entries = [commit_short] + existing_entries
    new_fallback = ' | '.join(new_entries[:3])

    config['fallback'] = new_fallback
    config['updatedAt'] = now
    write_json(active_branch_path, config)


if __name__ == '__main__':
    try:
        main()
    except Exception as e:
        print(f'[lane:commit] Warning: {e}', file=sys.stderr)
    sys.exit(0)
