// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import {
  validatePersistedState,
  saveGridState,
  loadPersistedState,
  loadUiState,
  saveUiState,
  clearGridState,
  PERSIST_VERSION,
} from './persistence';
import type { PersistedGridState } from '../types';

describe('validatePersistedState', () => {
  it('accepts a valid v2 state', () => {
    const state = { version: 2, columnOrder: ['a', 'b'], sorting: [], grouping: [], density: 'compact' };
    expect(validatePersistedState(state)).toEqual(state);
  });

  it('accepts legacy v1 (unversioned) state', () => {
    const v1 = { columnOrder: ['a'], columnSizing: { a: 120 }, pageSize: 50 };
    expect(validatePersistedState(v1)).toEqual(v1);
  });

  it('rejects states from a future schema version', () => {
    expect(validatePersistedState({ version: 99, columnOrder: [] })).toBeNull();
  });

  it('rejects non-object and malformed payloads', () => {
    expect(validatePersistedState(null)).toBeNull();
    expect(validatePersistedState('str')).toBeNull();
    expect(validatePersistedState([1, 2])).toBeNull();
    expect(validatePersistedState({ columnOrder: 'not-an-array' })).toBeNull();
    expect(validatePersistedState({ sorting: {} })).toBeNull();
  });
});

const gridState = (over: Partial<PersistedGridState> = {}): PersistedGridState => ({
  columnOrder: ['a'],
  columnSizing: {},
  columnVisibility: {},
  sorting: [],
  columnFilters: {},
  grouping: [],
  expanded: {},
  pageSize: 50,
  columnPinning: { left: [], right: [] },
  ...over,
});

describe('unified persistence (v3)', () => {
  beforeEach(() => localStorage.clear());

  it('saveGridState writes the current version and round-trips', () => {
    saveGridState('g', gridState({ columnOrder: ['x', 'y'] }));
    const loaded = loadPersistedState('g');
    expect(loaded?.version).toBe(PERSIST_VERSION);
    expect(loaded?.columnOrder).toEqual(['x', 'y']);
  });

  it('saveGridState preserves the stored ui sub-object', () => {
    saveUiState('g', { look: 'midnight', accent: 'blue' });
    saveGridState('g', gridState());
    expect(loadUiState('g')).toEqual({ look: 'midnight', accent: 'blue' });
  });

  it('saveUiState preserves stored grid state', () => {
    saveGridState('g', gridState({ columnOrder: ['kept'] }));
    saveUiState('g', { accent: 'green' as any });
    expect(loadPersistedState('g')?.columnOrder).toEqual(['kept']);
  });

  it('loadUiState migrates from the legacy jt-grid-<id>-ui key', () => {
    localStorage.setItem('jt-grid-legacy-ui', JSON.stringify({ version: 1, look: 'airtable' }));
    expect(loadUiState('legacy')).toEqual({ version: 1, look: 'airtable' });
    // legacy key is left in place (never deleted)
    expect(localStorage.getItem('jt-grid-legacy-ui')).toBeTruthy();
  });

  it('unified ui wins over the legacy key', () => {
    localStorage.setItem('jt-grid-g-ui', JSON.stringify({ version: 1, look: 'airtable' }));
    saveUiState('g', { look: 'midnight' });
    expect(loadUiState('g')?.look).toBe('midnight');
  });

  it('clearGridState removes grid state but keeps ui', () => {
    saveGridState('g', gridState());
    saveUiState('g', { look: 'midnight' });
    clearGridState('g');
    expect(loadPersistedState('g')?.columnOrder).toBeUndefined();
    expect(loadUiState('g')?.look).toBe('midnight');
  });

  it('clearGridState removes the key entirely when no ui is stored', () => {
    saveGridState('g', gridState());
    clearGridState('g');
    expect(localStorage.getItem('jt-grid-g')).toBeNull();
  });
});
