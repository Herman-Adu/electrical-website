# Docker Memory Migration Plan

**Status:** Ready for Implementation  
**Target Start Date:** 2026-04-17  
**Expected Completion:** 2026-04-24 (one week)

---

## Overview

Migrate from file-based `.claude/memory/*.md` context to Docker `memory-reference` MCP service for 60–70% token savings and faster session startup.

**Current State:**
- File-based memory: ~5,000+ tokens per session load
- Session startup: ~2 minutes to read/parse .md files
- Searchability: Limited (grep-based)

**Target State:**
- Docker graph database: ~50 tokens per session load
- Session startup: ~5 seconds
- Searchability: Full-text + relation queries
- Cost per session: ~60–70% reduction

---

## Deliverables Created

This plan implements the following documents:

### 1. Docker Memory Policy (`.claude/rules/docker-memory-policy.md`)

**Size:** ~3,500 lines  
**Scope:** Complete specification

Covers:
- Entity types (project_state, feature, learning, decision, infrastructure, session)
- Observation schema (build, blocker, performance, learning, regression)
- Relation types (derives_from, depends_on, documents, updates, supersedes, related_to)
- Session lifecycle (start, work, end, timeout)
- Fallback policy (Docker unavailable)
- Pruning rules (retention, archival, consolidation)
- Implementation checklist

**Who Uses:** Orchestrator agents, knowledge-memory skill, documentation

---

### 2. Docker Memory Setup Guide (`.claude/reference/setup/DOCKER_MEMORY_SETUP.md`)

**Size:** ~400 lines  
**Scope:** Installation & troubleshooting

Covers:
- Prerequisites & verification
- Service initialization
- Health checks
- Claude Code integration (MCP tool calls)
- Backup & recovery
- Performance tuning
- CI/CD integration
- Security considerations

**Who Uses:** DevOps, setup automation, CI/CD pipeline

---

### 3. Quick Reference Card (`.claude/reference/MEMORY_QUICK_REFERENCE.md`)

**Size:** ~200 lines  
**Scope:** Day-to-day operations

Covers:
- Session lifecycle (at a glance)
- Entity naming conventions (quick table)
- Common queries (copy-paste templates)
- Entity creation templates (feature, blocker, learning, decision)
- Observation categories (quick table)
- Relation types (quick table)
- Fallback procedure
- Session end checklist
- Pruning schedule
- Common pitfalls & fixes

**Who Uses:** Orchestrator, agents, day-to-day operators

---

## Implementation Phases

### Phase 1: Approval & Planning (1 day)

**Who:** Project lead (human) + Planning agent

**Tasks:**
- [ ] Review docker-memory-policy.md
- [ ] Approve entity naming conventions
- [ ] Confirm Docker service availability
- [ ] Schedule migration date
- [ ] Assign migration lead

**Deliverable:** Signed-off plan, go/no-go decision

---

### Phase 2: Infrastructure Setup (2 days)

**Who:** DevOps / Infrastructure lead

**Tasks:**
- [ ] Verify Docker daemon is running
- [ ] Deploy Docker memory-reference MCP service (or confirm it's available)
- [ ] Initialize memory graph schema (entities, relations, observations)
- [ ] Create initial `project_state` entity for electrical-website
- [ ] Run health checks
- [ ] Add health check to CI/CD pipeline

**Deliverable:**
- Docker service running on localhost:7777
- `electrical-website-state` entity created
- Health check passing

---

### Phase 3: Knowledge Migration (2 days)

**Who:** Knowledge-memory agent + Orchestrator

**Tasks:**
- [ ] Read existing `.claude/memory/*.md` files
- [ ] Parse into structured entity format
- [ ] Create entities: learnings, decisions, previous features
- [ ] Create relations between entities
- [ ] Verify migration count (before/after)
- [ ] Spot-check entity content for accuracy

**Deliverable:**
- All existing knowledge transferred to Docker
- Entity count matches prior files
- Relations created between related entities

---

### Phase 4: Orchestrator Integration (2 days)

**Who:** Orchestrator + Code-generation agent

**Tasks:**
- [ ] Update `.claude/CLAUDE.md` to reference docker-memory-policy.md
- [ ] Update session preflight to call `search_nodes("electrical-website-state")`
- [ ] Update session end to call `create_entities()`, `add_observations()`, `create_relations()`
- [ ] Add fallback: write session notes to `.claude/CLAUDE.md## Session State` if Docker down
- [ ] Test with sandbox session (no production impact)
- [ ] Update `.claude/agents/planning/AGENT.md` to use Docker memory

**Deliverable:**
- Orchestrator workflow updated
- Test session completes successfully
- Memory operations logged

---

### Phase 5: Documentation & Training (1 day)

**Who:** Knowledge-memory agent

**Tasks:**
- [ ] Update `.claude/reference/SKILLS.md` (add memory module)
- [ ] Create example workflows (docs)
- [ ] Train agents on new entity types
- [ ] Update README with migration note
- [ ] Create troubleshooting guide (ERROR_RECOVERY.md)

**Deliverable:**
- All documentation updated
- Agents trained
- Troubleshooting guide available

---

### Phase 6: Cutover & Monitoring (ongoing)

**Who:** Orchestrator + QA

**Tasks:**
- [ ] Monitor Docker memory service uptime
- [ ] Track session startup times (pre/post migration)
- [ ] Log any Docker unavailability events
- [ ] Verify fallback works if Docker goes down
- [ ] Optimize entity naming based on real usage
- [ ] Gather team feedback

**Deliverable:**
- Baseline metrics (uptime, speed, cost)
- Fallback procedures validated
- Team feedback incorporated

---

## Timeline

```
Week 1 (Apr 17–21)
├─ Mon (Apr 17):   Phase 1 (Approval)
├─ Tue–Wed (Apr 18–19): Phase 2 (Infrastructure)
├─ Wed–Thu (Apr 20–21): Phase 3 (Migration)
└─ Fri (Apr 22):   Testing & feedback

Week 2 (Apr 23–24)
├─ Mon (Apr 23):   Phase 4 (Orchestrator integration)
├─ Tue (Apr 24):   Phase 5 (Documentation)
└─ Wed (Apr 25):   Phase 6 (Cutover)
```

---

## Success Criteria

### Must Have

- [ ] Docker memory service running and healthy
- [ ] Project state entity created and loadable
- [ ] Session preflight loads memory in <10 seconds
- [ ] All knowledge transferred from `.md` to Docker
- [ ] Orchestrator successfully creates/updates entities
- [ ] Token cost per session reduced by 60%+

### Should Have

- [ ] Health check integrated into CI/CD
- [ ] Fallback procedure tested
- [ ] Entity count and relations documented
- [ ] Team trained on naming conventions

### Nice to Have

- [ ] Automated migration script
- [ ] Memory analytics dashboard
- [ ] Batch operations for large entity imports
- [ ] Export/import tooling

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Docker service unavailable | Blocks all sessions | Fallback: write to `.claude/CLAUDE.md## Session State` |
| Data loss in migration | Lost context | Backup `.md` files to git before migration |
| Entity naming conflicts | Duplicate entities | Pre-check schema, use naming convention strictly |
| Slow graph queries | Degrades UX | Add database indices on frequently searched fields |
| Team unfamiliar with Docker | Reduced adoption | Train with quick reference card + examples |
| Circular dependencies | Graph corruption | Validation rules in create_relations() |

---

## Fallback Plan (If Docker Unavailable)

If Docker memory service becomes unavailable during migration:

1. **Halt cutover** — Don't proceed with production use
2. **Use .md files** — Keep existing `.claude/memory/*.md` files active
3. **Investigate** — Debug Docker service (check logs, restart daemon)
4. **Delay migration** — Reschedule for next week
5. **Maintain both** — Run Docker in parallel with .md files for 1–2 weeks before full cutover

---

## Post-Migration Cleanup

After successful cutover (Week 3+):

- [ ] Archive old `.claude/memory/` directory to `.claude/archives/memory-backup-2026-04-16/`
- [ ] Remove from git: `.gitignore` no longer needs memory files
- [ ] Update CLAUDE.md to remove memory file references
- [ ] Schedule first pruning (remove sessions older than 90 days)
- [ ] Document any lessons learned in decision entity

---

## Monitoring & Maintenance

### Weekly

- [ ] Check Docker service health: `curl localhost:7777/health`
- [ ] Monitor entity count growth (should be linear)
- [ ] Archive sessions older than 90 days

### Monthly

- [ ] Review entity naming for consistency
- [ ] Consolidate duplicate learnings
- [ ] Update session statistics
- [ ] Report metrics to team (uptime, query performance, cost savings)

### Quarterly

- [ ] Review pruning rules (retention period still appropriate?)
- [ ] Backup entire graph: `curl localhost:7777/api/entities > backup.json`
- [ ] Optimize database indices
- [ ] Gather team feedback on memory system

---

## Rollback Plan

If Docker memory causes issues:

1. **Immediate:** Revert session preflight to load from `.md` files
2. **Short-term:** Run Docker in read-only mode while investigating
3. **Investigation:** Check Docker logs, verify data integrity
4. **Fix or Rollback:**
   - If fixable: patch and resume
   - If not: Restore `.md` files from git history and disable Docker memory

**Rollback Command:**
```bash
# Restore .md memory from git
git checkout HEAD~1 -- .claude/memory/

# Disable Docker in orchestrator
# (Edit .claude/CLAUDE.md to comment out Docker calls)

# Restart with .md files only
git commit -m "rollback: docker memory disabled"
```

---

## Sign-Off

| Role | Name | Date | Status |
|------|------|------|--------|
| Project Lead | Herman Adu | — | Pending |
| DevOps Lead | — | — | Pending |
| Orchestrator / Architect | Claude Code | — | Pending |
| QA | — | — | Pending |

---

## Questions & Clarifications

| Question | Answer | Status |
|----------|--------|--------|
| Is Docker service already provisioned? | Assume yes; verify in Phase 2 | Pending |
| What is max entity count before performance degrades? | Benchmark in Phase 2 | Pending |
| Should we version the memory policy? | Yes; use semantic versioning | Pending |
| How often to run pruning? | Weekly for sessions; quarterly for features | Implemented |
| Can we run Docker + .md files in parallel? | Yes, for 1–2 weeks during transition | Implemented |

---

## References

- **Policy Document:** `.claude/rules/docker-memory-policy.md`
- **Setup Guide:** `.claude/reference/setup/DOCKER_MEMORY_SETUP.md`
- **Quick Reference:** `.claude/reference/MEMORY_QUICK_REFERENCE.md`
- **Orchestrator Contract:** `.claude/CLAUDE.md`
- **Current Memory:** `.claude/memory/` (to be archived)

---

**Last Updated:** 2026-04-16  
**Version:** 1.0  
**Status:** Ready for Approval & Implementation

---

## Next Steps

1. **Review** this plan with team
2. **Approve** Phase 1 (sign-off above)
3. **Schedule** Phase 2 infrastructure setup
4. **Track** progress in GitHub issue or project board
5. **Report** weekly metrics once live

---

**Document Owner:** Claude Code (Orchestrator)  
**Contact:** herman@adudev.co.uk  
**Slack:** #infrastructure (if applicable)
