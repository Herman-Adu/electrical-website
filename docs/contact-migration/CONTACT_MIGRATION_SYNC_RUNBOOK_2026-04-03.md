# Contact Migration Sync Runbook (Step-by-Step)

## 1) Pre-flight (shared baseline)

1. Checkout migration branch:
   - `git checkout -b feature/contact-lift-shift-2026-04-03-orchestrated`
2. Start and verify MCP stack:
   - `pnpm migration:contact:ready`
3. Confirm gateway memory contract:
   - Included in `pnpm migration:contact:ready`
   - Must show `Memory Protocol Contract` as passing.

## 2) Session bootstrap in new window

1. Paste prompt from:
   - `docs/contact-migration/NEXT_WINDOW_PROMPT_CONTACT_MIGRATION_2026-04-03.md`
2. Assistant must hydrate memory before any broad repo work.
3. Assistant must confirm canonical source:
   - `docs/contact-migration/contact-page-lift-and-shift.md`

## 3) Batch loop contract (repeat for each batch)

1. Assistant releases one dependency-safe batch only.
2. User copies files for that batch only.
3. User replies: `Batch N copied`.
4. Assistant verifies:
   - file existence
   - import graph integrity
   - `get_errors` for touched files
5. If green:
   - assistant writes memory progress note (`batch_n: complete` + risks + next batch)
6. If red:
   - assistant gives minimal fix actions
   - assistant re-verifies same batch
   - do not unlock next batch yet

## 4) Drift lane policy

1. Any side issue is tracked as a drift lane with explicit status (`open` or `resolved`).
2. Migration lane remains paused only if drift blocks current batch.
3. On resolve, assistant records drift resolution in memory and returns to batch loop.

## 5) Milestone validation gates

- Midpoint gate (after foundational libs/types/security/email wiring):
  - run targeted checks on touched areas
- Final gate:
  - `pnpm build`
  - visual check for `/contact`
  - scripted check path for form progression and success state

## 6) Closeout checklist

1. Confirm definition-of-done items are all green.
2. Persist final memory snapshot with:
   - completed batches
   - unresolved risks (if any)
   - evidence summary
3. Save/refresh next-window handoff prompt if process changed.
