import { PersistedGridState, PersistedUiState } from '../types';
/**
 * Unified grid persistence — ONE localStorage key per grid: `jt-grid-<id>`.
 *
 * Schema history:
 *  - v1: legacy unversioned grid state (accepted, upgraded on next save)
 *  - v2: versioned grid state; UI state (look/accent/charts/styles) lived in a
 *        SEPARATE `jt-grid-<id>-ui` key with its own v1 schema
 *  - v3: grid state + `ui` sub-object in the one key. Legacy `-ui` keys are
 *        read as a migration fallback and left in place (never deleted).
 */
export declare const PERSIST_VERSION = 3;
export declare function validatePersistedState(raw: unknown): Partial<PersistedGridState> | null;
export declare function loadPersistedState(gridId: string): Partial<PersistedGridState> | null;
/** Persist grid state, preserving any `ui` sub-object already stored. */
export declare function saveGridState(gridId: string, state: PersistedGridState): void;
/** Load UI state from the unified key, falling back to the legacy `-ui` key (v1). */
export declare function loadUiState(gridId?: string): PersistedUiState | null;
/** Persist UI state into the unified key, preserving stored grid state. */
export declare function saveUiState(gridId: string, ui: PersistedUiState): void;
/**
 * Clear persisted GRID state only. UI state (look/accent/charts/styles)
 * deliberately survives a reset — matching the pre-unification behavior where
 * it lived under a separate key that reset never touched.
 */
export declare function clearGridState(gridId: string): void;
//# sourceMappingURL=persistence.d.ts.map