#!/bin/bash
#
# PreCompact safety hook — injects memory sync reminder before context compaction
#
# Purpose:
#   When Claude Code compacts context (removes old messages to stay under token limit),
#   this hook is called. We inject a system message reminding the model to sync
#   electrical-website-state to Docker before the compaction boundary, preventing
#   context loss.
#
# Flow:
#   1. PreCompact hook fires
#   2. This script outputs a systemMessage JSON
#   3. Claude Code injects the message before compaction
#   4. Compaction proceeds with memory sync reminder active
#   5. Next user message triggers normal SessionStart + UserPromptSubmit hooks
#
# Exit code: Always 0 (never fail a hook)
#

echo '{"systemMessage": "PRECOMPACT: Context compacting. Before accepting — run add_observations on electrical-website-state with: current branch, build status, next 2 tasks. Prevents context loss at compaction boundary."}'
exit 0
