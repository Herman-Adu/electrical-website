#!/bin/bash
#
# PreCompact safety hook — prevents hook execution during context compaction
#
# Purpose:
#   When Claude Code compacts context (removes old messages to stay under token limit),
#   this hook is called. We respond with empty JSON to disable hook execution during
#   the compaction operation itself, protecting the transcript from mid-compaction
#   state inconsistencies.
#
# Flow:
#   1. PreCompact hook fires
#   2. This script outputs {} (empty JSON)
#   3. Claude Code skips hook execution during compaction
#   4. Compaction proceeds cleanly
#   5. Next user message triggers normal SessionStart + UserPromptSubmit hooks
#
# Exit code: Always 0 (never fail a hook)
#

# Output empty JSON to signal "no action"
echo "{}"
exit 0
