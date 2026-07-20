import { describe, it, expect } from 'vitest';
import { validatePersistedState } from './useGridEngine';

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
