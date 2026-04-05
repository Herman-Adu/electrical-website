# Next Window Prompt — Email Incident Orchestrator (2026-04-05)

```md
Run in FULL ORCHESTRATOR mode.

Mission:
Investigate live email send failures, identify regression commit(s), implement minimal fix, validate, merge, and memory-sync.

Execution sequence:
1) Preflight
- pnpm migration:quotation:ready
- pnpm migration:quotation:hydrate:strict
- enforce runtime switch protocol (docker/local on port 3000)

2) Context load
- docs/email-incidents/EMAIL_DELIVERY_INCIDENT_SNAPSHOT_2026-04-05.md
- docs/FULL_MEMORY_SYNC_PROMPT_EMAIL_DELIVERY_INCIDENT_2026-04-05.md

3) Commit archaeology
- inspect last 10 commits
- map email-impact files and classify impact

4) Root cause confirmation
- trace sender/recipient resolution path
- verify fallback precedence and env/settings behavior
- capture masked diagnostics only

5) Hotfix
- patch sender precedence if needed
- keep changes minimal and scoped

6) Verification
- npx tsc --noEmit
- targeted tests
- pnpm build

7) Delivery
- hotfix branch -> PR -> green checks -> merge main

8) Memory closure
- update incident handoff/reasoning/heuristics nodes with evidence and commit refs

Checkpoint output format:
- findings
- evidence
- pass/fail
- risks
- next recommendation
```