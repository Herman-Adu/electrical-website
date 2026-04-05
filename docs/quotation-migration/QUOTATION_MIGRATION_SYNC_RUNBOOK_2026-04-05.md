# Quotation Migration Sync Runbook (Step-by-Step)

## 1) Pre-flight (shared baseline)

1. Checkout feature branch:
   - `git checkout -b feat/quotation-lift-shift-2026-04-05`
   - If branch already exists locally: `git checkout feat/quotation-lift-shift-2026-04-05`
   - If workspace is not clean before branch creation, stash or commit unrelated changes first.
2. Start and verify MCP stack:
   - `pnpm migration:quotation:ready`
3. Hydrate quotation memory context:
   - `pnpm migration:quotation:hydrate`
4. Strict verification pass:
   - `pnpm migration:quotation:hydrate:strict`
5. Confirm canonical source:
   - `docs/quotation-migration/quotation-page-lift-and-shift.md`

## 2) Session bootstrap in new window

1. Paste prompt from:
   - `docs/quotation-migration/NEXT_WINDOW_PROMPT_QUOTATION_MIGRATION_2026-04-05.md`
2. Assistant must hydrate memory before broad repo changes.
3. Assistant must confirm key memory entities loaded before releasing Batch 1.

## 3) Batch loop contract (repeat per batch)

1. Assistant releases one dependency-safe batch only.
2. User copies files for that batch only.
3. User replies: `Batch N copied`.
4. Assistant verifies:
   - file existence + exact target paths
   - import graph integrity
   - `get_errors` for touched files
5. If green:
   - assistant writes memory progress note (`batch_n: complete`, evidence, risks, next batch)
6. If red:
   - assistant issues minimal fix set
   - assistant re-verifies same batch
   - do not unlock next batch until green

## 4) Batch map for quotation migration (from canonical guide)

- Batch 1: lib sanitize/security/forms folders + lib utils/constants + action types
- Batch 2: email config/service files + types/marketing + quotation mock JSON
- Batch 3: providers/ui button/atoms + molecules + shared organisms
- Batch 4: full `features/quotation` folder
- Batch 5: `app/quotation/page.tsx` + env wiring + typecheck
- Batch 6: build + local route validation + step-by-step form progression checks

## 5) Validation gates

### Midpoint gate (after Batch 3)

- `npx tsc --noEmit`
- verify shared step imports resolve (`contact-info-step`, `address-info-step`)

### Feature gate (after Batch 4)

- `npx tsc --noEmit`
- verify `features/quotation/api/*` imports resolve
- verify server action compiles under strict mode

### Final gate (after Batch 6)

- `pnpm build`
- quotation route manual smoke: `/quotation`
- run local tests relevant to changed paths
- execute workflow browser validation via executor-playwright sequence (see section 6)

## 6) Executor-Playwright validation protocol (step sequence)

Use workflow mode (`executor-playwright`) to verify realistic user progression:

1. Go to `/quotation`
2. Confirm 7-step indicator is rendered
3. Fill Step 0 and Continue
4. Fill Step 1 and Continue
5. Fill Step 2 and Continue
6. Fill Step 3 and Continue
7. Fill Step 4 and Continue
8. Fill Step 5 and Continue
9. Verify Step 6 review content + submit availability
10. Submit and verify success state with `QR-` reference pattern

Evidence to capture:

- step transition snapshots
- any console/runtime errors
- final success confirmation

## 7) Drift lane policy

1. Track side issues as drift lanes (`open`/`resolved`).
2. Pause migration only if drift blocks current batch.
3. On resolution, write drift outcome to memory and continue migration lane.

## 8) Definition of done

- `/quotation` renders full header, form, trust indicators, and FAQ sections
- 7-step flow fully traversable with validation guardrails
- required terms acceptance enforced before final submit
- submission returns success with `QR-` reference
- server-action security path active (CSRF, rate limit, sanitize, safeParse)
- local `npx tsc --noEmit` + `pnpm build` pass
- executor-playwright workflow proof recorded

## 9) Closeout protocol

1. Run strict hydration to persist final state:
   - `pnpm migration:quotation:hydrate:strict`
2. Confirm key nodes show `ready`.
3. Save/update handoff prompt for next chat window.
4. Commit migration docs/scripts and implementation changes on the feature branch.
5. Push branch, open PR to `main`, wait for required green checks, then merge.
6. Branch cleanup after merge (required):
   - delete local feature branch: `git branch -d feat/quotation-lift-shift-2026-04-05`
   - delete remote feature branch: `git push origin --delete feat/quotation-lift-shift-2026-04-05`
   - prune stale remote refs: `git fetch --prune`
7. Confirm final state is clean on `main`:
   - `git checkout main && git pull --ff-only`
   - `git status --short`
