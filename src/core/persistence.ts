import type { PersistedGridState, PersistedUiState } from '../types';

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
export const PERSIST_VERSION = 3;

const gridKey = (gridId: string) => `jt-grid-${gridId}`;
const legacyUiKey = (gridId: string) => `jt-grid-${gridId}-ui`;

export function validatePersistedState(raw: unknown): Partial<PersistedGridState> | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const state = raw as Partial<PersistedGridState>;
  // Reject states written by a future schema we don't understand
  if (state.version != null && (typeof state.version !== 'number' || state.version > PERSIST_VERSION)) return null;
  if (state.columnOrder != null && !Array.isArray(state.columnOrder)) return null;
  if (state.sorting != null && !Array.isArray(state.sorting)) return null;
  if (state.grouping != null && !Array.isArray(state.grouping)) return null;
  return state;
}

function readStored(gridId: string): Partial<PersistedGridState> | null {
  try {
    const raw = localStorage.getItem(gridKey(gridId));
    if (raw) return validatePersistedState(JSON.parse(raw));
  } catch {
    // Ignore corrupted state
  }
  return null;
}

function writeStored(gridId: string, state: Partial<PersistedGridState>): void {
  try {
    localStorage.setItem(gridKey(gridId), JSON.stringify(state));
  } catch {
    // localStorage full or unavailable
  }
}

export function loadPersistedState(gridId: string): Partial<PersistedGridState> | null {
  return readStored(gridId);
}

/** Persist grid state, preserving any `ui` sub-object already stored. */
export function saveGridState(gridId: string, state: PersistedGridState): void {
  const existing = readStored(gridId);
  writeStored(gridId, { ...state, version: PERSIST_VERSION, ui: existing?.ui ?? state.ui });
}

/** Load UI state from the unified key, falling back to the legacy `-ui` key (v1). */
export function loadUiState(gridId?: string): PersistedUiState | null {
  if (!gridId) return null;
  const unified = readStored(gridId);
  if (unified?.ui) return unified.ui;
  try {
    const raw = localStorage.getItem(legacyUiKey(gridId));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || (parsed.version && parsed.version > 1)) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Persist UI state into the unified key, preserving stored grid state. */
export function saveUiState(gridId: string, ui: PersistedUiState): void {
  const existing = readStored(gridId) ?? {};
  writeStored(gridId, { ...existing, version: PERSIST_VERSION, ui });
}

/**
 * Clear persisted GRID state only. UI state (look/accent/charts/styles)
 * deliberately survives a reset — matching the pre-unification behavior where
 * it lived under a separate key that reset never touched.
 */
export function clearGridState(gridId: string): void {
  const existing = readStored(gridId);
  try {
    if (existing?.ui) {
      writeStored(gridId, { version: PERSIST_VERSION, ui: existing.ui } as Partial<PersistedGridState>);
    } else {
      localStorage.removeItem(gridKey(gridId));
    }
  } catch {
    // localStorage unavailable
  }
}
