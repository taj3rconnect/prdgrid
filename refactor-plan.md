# prdgrid refactor plan — 2026-07-20

Mode: `/trefactor --refactor`. Input: `docs/2026-07-20-assessment.md` (roadmap items 7–10 + demo split).
Scope: **structural, behavior-preserving**. Out of scope: virtualization, server hardening, dependency majors, perf work.
Lane: worktree `refactor/`, branch `feature/refactor` off origin/master.

## Test baseline (before any edit)

- `vitest run`: **40/40 passing** (6 files). No pre-existing failures.
- `tsc --noEmit`: **0 errors**.
- `npm run build`: **green** (core ~232KB; heavy export deps correctly code-split).
- Coverage caveat: components/engine/exports have **near-zero tests** → Phase 0 adds characterization tests before any split; splits additionally verified by build + typecheck + demo smoke.
- Lint: **non-functional** (script exists, no eslint dep/config) — fixed in Phase 0 so code-quality scoring is measurable.

## Backlog (ranked: log(size)+log(churn+1)+log(imports+1)) + depth-gate verdicts

| # | File | Lines | Churn | Inbound imports | Verdict |
|--:|---|--:|--:|--:|---|
| 1 | `src/types.ts` | 714 | 6 | 27 | **LEAVE WHOLE** (deep: pure declaration hub; splitting scatters 27 importers). Only change: stop exporting internal `ColumnMeta`. |
| 2 | `src/core/useGridEngine.ts` | 503 | 8 | 5 | **SPLIT** (shallow seams): extract `columnMapping.ts` (mapColumnDef + format heuristics) and `persistence.ts` (already named by its test file). |
| 3 | `demo/main.tsx` | 1,310 | 10 | 0 | **SPLIT** (1000+ ceiling; frontend monolith of demo tabs): per-tab modules under `demo/tabs/`, thin shell keeps nav. |
| 4 | `src/components/DataGrid.tsx` | 623 | 6 | 1 | **PARTIAL SPLIT**: unify its separate UI-persistence layer (`jt-grid-<id>-ui`, v1) with the engine's (`jt-grid-<id>`, v2) inside extracted `persistence.ts`; move GridApi construction out. Target <450 lines. |
| 5 | `demo/sampleData.ts` | 518 | 3 | 1 | **LEAVE WHOLE** (deep: pure data, trivial interface). |

## Consolidations & cleanups (assessment items 9–10 + dead code)

- **dataType registry**: `Record<ColumnDataType, {icon, format, defaultFilter, numeric…}>` in new `src/core/dataTypeRegistry.ts`, replacing the 6+ scattered switches.
- **`AMOUNT_FIELD_PATTERN`** (JobTalk field names in library core, `useGridEngine.ts:43`) → injectable `amountFieldPattern` prop; **default keeps the current regex** so behavior is unchanged.
- **`useClickOutside` hook** replacing 3 duplicate implementations (GridToolbar:32, HeaderContextMenu:30, TypeaheadSelect:43).
- **Single CSV entry point** (ExportModal bypasses `exportToCsv` via direct `generateCsvString` import).
- **Dead code removal** (auditable, revertable): `Chip` export (0 consumers), `ColumnMeta` from public exports. `startEditingCell`/`stopEditing`/`refreshCells` no-op stubs: pending user decision at approval gate (default: keep, mark `@deprecated`).

## Persistence-unification data-safety note

Unifying the two localStorage layers reshapes stored grid UI state. The unified schema **reads both legacy keys on first load and migrates forward** — no user-visible state loss. This is localStorage UI state, not DB data; no migration tool applies.

## Phases (each item = own commit + test cycle; ships to develop-equivalent via /tdev)

- **Phase 0 — safety net**: eslint flat config + dep (fix broken lint); characterization tests for useGridEngine behaviors (sort/filter/group/pagination/persistence keys) and DataGrid mount/API surface.
- **Phase 1** — `useGridEngine` split (columnMapping.ts, persistence.ts) + persistence unification in DataGrid.
- **Phase 2** — `demo/main.tsx` → per-tab modules.
- **Phase 3** — dataType registry; amount-pattern injection; useClickOutside; CSV single entry; dead-code removal.
- **Verify** — tverifier runs lint + tsc + vitest + build after each phase; demo smoke (open page) at the end.

## Quality scorecard — BEFORE (measured)

| Category | Before | Criteria (met/applicable) |
|---|--:|---|
| Code quality | 40% | lint functional ✗ · no dead exports ✗ (Chip, ColumnMeta, 3 stubs) · no duplicate blocks ✗ (3× click-outside, 2 CSV paths) · tsc clean ✓ · no commented-out code ✓ → 2/5 |
| Scalability | 75% | code-split heavy deps ✓ · stateless server layer ✓ · dataType logic centralized ✗ (6+ switches) · no N+1 in demo-server ✓ → 3/4 |
| Maintainability | 60% | consistent naming ✓ · JSDoc on public API ✓ · lint/CI gate ✗ · tests on refactor targets ✗ · function lengths OK ✓ → 3/5 |
| Modularity | 40% | all files ≤1000 or depth-noted ✗ (main.tsx 1310) · avg file length ~190 ✓ · one responsibility/module ✗ (engine 3 concerns, DataGrid dual persistence) · view/logic separation ✗ (demo monolith) · depth-gate honesty ✓ (types.ts, sampleData.ts noted) → 2/5 |

After-column filled at the end; gate ≥75% per category.
