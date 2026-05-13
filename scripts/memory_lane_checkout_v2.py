#!/usr/bin/env python3
"""
Post-checkout hook v2 — no config file writes.
Branch name -> Docker entity. Docker is the sole registry.
Args: <prev-head> <new-head> <branch-flag>
"""
from __future__ import annotations
import subprocess
import sys
import json
import re
import urllib.request
import urllib.error
from datetime import datetime, timezone

GATEWAY = 'http://127.0.0.1:3100'


def get_git_branch() -> str:
    r = subprocess.run(['git', 'rev-parse', '--abbrev-ref', 'HEAD'],
                       capture_output=True, text=True)
    return r.stdout.strip() if r.returncode == 0 else 'unknown'


def branch_to_entity(branch: str) -> str:
    if not branch or branch in ('main', 'master'):
        return 'nexgen-electrical-innovations-state'
    slug = branch.lower().replace('/', '-')
    slug = re.sub(r'[^a-z0-9-]', '-', slug)
    slug = re.sub(r'-+', '-', slug).strip('-')
    return slug


def docker_health() -> bool:
    try:
        req = urllib.request.Request(f'{GATEWAY}/health')
        with urllib.request.urlopen(req, timeout=1.5) as resp:
            return resp.status == 200
    except Exception:
        return False


def mcp_call(name: str, args: dict, timeout: float = 4.0) -> bool:
    try:
        payload = json.dumps({'name': name, 'arguments': args}).encode('utf-8')
        req = urllib.request.Request(
            f'{GATEWAY}/memory/tools/call',
            data=payload,
            headers={'Content-Type': 'application/json'},
            method='POST'
        )
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.status == 200
    except Exception:
        return False


def main() -> None:
    # branchFlag = sys.argv[3] when called from git hook
    if len(sys.argv) >= 4 and sys.argv[3] == '0':
        sys.exit(0)  # file checkout, skip

    if not docker_health():
        sys.exit(0)  # Docker offline, silent skip

    branch = get_git_branch()
    entity = branch_to_entity(branch)
    ts = datetime.now(timezone.utc).isoformat()

    mcp_call('add_observations', {
        'observations': [{
            'entityName': entity,
            'contents': [f'lane_status: active | branch: {branch} | activated: {ts}']
        }]
    })

    sys.exit(0)


if __name__ == '__main__':
    main()
