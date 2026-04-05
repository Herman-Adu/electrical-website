# 📌 Memory Synchronization Reference

## Quick Memory Sync (Optional but Recommended)

Run this command to push the 9 learnings entities to Docker memory for next session:

```bash
node scripts/capture-memory-snapshot.mjs
```

**This will:**

1. Generate 9 learnings entities (107 observations total)
2. Display preview of all entities
3. Output the complete push command

**Then copy the command and run it:**

```bash
node scripts/mcp-memory-call.mjs create_entities '{...}'
```

---

## After Memory Push

Verify the sync worked:

```bash
node scripts/mcp-memory-call.mjs search_nodes '{"query":"orchestrator"}'
```

**Expected:** Returns entities matching "orchestrator" as proof of sync.

---

## In New Chat Window

After starting new chat with master prompt and running hydration, retrieve the learnings:

```bash
node scripts/mcp-memory-call.mjs search_nodes '{"query":"browser-testing"}'
```

This will show all captured learnings from the previous session.

---

## Memory Entities Reference

| Entity                               | Observations | Purpose                                  |
| ------------------------------------ | ------------ | ---------------------------------------- |
| orchestrator_routing_architecture    | 10           | How routing works, patterns, decisions   |
| browser_testing_skill_implementation | 12           | Dual-mode skill design, validation       |
| robust_mcp_client_wrapper            | 14           | JSON recovery, retry logic, patterns     |
| docker_mcp_infrastructure_status     | 12           | Service health, bootstrap, configuration |
| typescript_strict_mode_learnings     | 11           | Type issues, solutions, patterns         |
| turnstile_anti_bot_architecture      | 14           | Design, security, implementation         |
| e2e_test_scenarios                   | 12           | Test patterns, Playwright usage          |
| automated_workflow_commands          | 11           | CLI commands, pnpm scripts               |
| next_phase_handoff_planning          | 11           | Timeline, next steps, continuation       |

---

## Memory Key Format

All entities use this namespace:

```
agent:v1:<entity_name>_<date>
agent:v1:orchestrator_routing_architecture_2026-04-05
agent:v1:browser_testing_skill_implementation_2026-04-05
(etc.)
```

---

## Optional: Skip Memory Push

If you prefer to skip memory sync now and do it manually later:

1. Keep `docs/COMPREHENSIVE_HANDOFF_MASTER_PROMPT_APR2026.md` as your context
2. The master prompt contains all critical information
3. New chat window will work fine without memory sync
4. Can sync later: `node scripts/capture-memory-snapshot.mjs`

---

## Why Memory Sync Matters

✅ **With Memory Sync:**

- 9 learnings entities available for query in future sessions
- Can search for patterns: "turbostile anti-bot", "orchestrator routing", etc.
- Automatic connection to previous session context
- Faster problem-solving (patterns already known)

✅ **Without Memory Sync:**

- Still have master prompt (1000+ lines of docs)
- Everything still works
- Just need to refer to docs instead of memory queries
- Less automated, but fully documented

**Recommendation:** Do the memory sync. Takes 2 minutes and enables automated pattern matching across sessions.

---

## If Memory Sync Fails

Check Docker MCP status:

```bash
pnpm migration:contact:hydrate:robust
```

If memory service is down:

```bash
docker-compose up -d memory-reference
```

Then retry:

```bash
node scripts/capture-memory-snapshot.mjs
```

---
