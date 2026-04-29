# Delegation Gates

## Default Gates — Delegate when ANY is true

| Trigger | Delegate to |
|---------|------------|
| Multi-file changes | `architecture-sme` |
| New feature (2hr+) | `planning` first, then `code-generation` |
| Refactoring with behavior changes | `qa-sme` |
| Security / auth / secrets | `security-sme` (no exceptions) |
| >50 LOC or >1 file with logic changes | `code-generation` via `general-purpose` |
| Ambiguous trade-offs | Clarify with user first |

## Allowed Direct Implementation (ALL must be true)

- Single file, <50 LOC, obvious intent
- No security/compliance surface
- Already planned — not a decision point

## Docker Memory Persistence (Before Session End)

Create entities for: completed features (`feat-*`), learnings (`learn-*`), decisions (`decide-*`), session summary (`session-YYYY-MM-DD-seq`)

Wire relations: feature ← decision (`derives_from`), learning → feature (`documents`), session → project_state (`updates`)

Verify: `search_nodes(query)` confirms entities saved.

## Exit Criteria

- [ ] Delegation complete (if gated)
- [ ] `pnpm typecheck && pnpm build && pnpm test` passing
- [ ] Docker entities created and relations linked
- [ ] Git pushed
