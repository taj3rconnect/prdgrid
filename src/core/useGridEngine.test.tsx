// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGridEngine, isNumericDataType, SELECT_COLUMN_ID } from './useGridEngine';
import type { ColumnDef, DataGridProps } from '../types';

interface Row {
  name: string;
  billRate: number;
  status: string;
  hiredOn: string;
}

const rows: Row[] = [
  { name: 'Ada', billRate: 120, status: 'active', hiredOn: '2024-01-02' },
  { name: 'Grace', billRate: 95, status: 'inactive', hiredOn: '2023-06-10' },
  { name: 'Alan', billRate: 150, status: 'active', hiredOn: '2025-03-15' },
];

const columns: ColumnDef<Row>[] = [
  { field: 'name', headerName: 'Name' },
  { field: 'billRate', headerName: 'Bill Rate' },
  { field: 'status', headerName: 'Status', dataType: 'select' },
  { field: 'hiredOn', headerName: 'Hired', dataType: 'date' },
];

function run(props: Partial<DataGridProps<Row>> = {}) {
  return renderHook(() =>
    useGridEngine<Row>({ rowData: rows, columnDefs: columns, ...props } as DataGridProps<Row>)
  );
}

beforeEach(() => localStorage.clear());

describe('useGridEngine characterization', () => {
  it('exposes all rows through the core row model', () => {
    const { result } = run();
    expect(result.current.table.getCoreRowModel().rows.map((r) => r.original.name)).toEqual([
      'Ada', 'Grace', 'Alan',
    ]);
  });

  it('initializes sorting from columnDefs sort/sortIndex', () => {
    const sorted: ColumnDef<Row>[] = [
      { field: 'name', sort: 'asc', sortIndex: 1 },
      { field: 'billRate', sort: 'desc', sortIndex: 0 },
    ];
    const { result } = run({ columnDefs: sorted } as any);
    expect(result.current.sorting).toEqual([
      { id: 'billRate', desc: true },
      { id: 'name', desc: false },
    ]);
  });

  it('sorts rows when sorting state changes', () => {
    const { result } = run();
    act(() => result.current.setSorting([{ id: 'billRate', desc: false }]));
    expect(result.current.table.getRowModel().rows.map((r) => r.original.billRate)).toEqual([
      95, 120, 150,
    ]);
  });

  it('filters rows via column filters', () => {
    const { result } = run();
    act(() => result.current.setColumnFilters([{ id: 'name', value: 'a' }]));
    const names = result.current.table.getRowModel().rows.map((r) => r.original.name);
    expect(names).toEqual(['Ada', 'Grace', 'Alan'].filter((n) => n.toLowerCase().includes('a')));
  });

  it('initializes grouping from rowGroup/rowGroupIndex and groups the row model', () => {
    const grouped: ColumnDef<Row>[] = [
      { field: 'name' },
      { field: 'status', rowGroup: true },
    ];
    const { result } = run({ columnDefs: grouped } as any);
    expect(result.current.grouping).toEqual(['status']);
    const top = result.current.table.getRowModel().rows;
    expect(top.every((r) => r.getIsGrouped())).toBe(true);
    expect(top.map((r) => r.getValue('status')).sort()).toEqual(['active', 'inactive']);
  });

  it('initializes visibility from hide and pinning from pinned + select column', () => {
    const defs: ColumnDef<Row>[] = [
      { field: 'name', pinned: 'left' },
      { field: 'billRate', hide: true },
      { field: 'status', pinned: 'right' },
    ];
    const { result } = run({ columnDefs: defs, rowSelection: 'multiple' } as any);
    expect(result.current.columnVisibility).toEqual({ billRate: false });
    expect(result.current.columnPinning).toEqual({
      left: [SELECT_COLUMN_ID, 'name'],
      right: ['status'],
    });
  });

  it('right-aligns amount-pattern fields and numeric dataTypes by default', () => {
    const defs: ColumnDef<Row>[] = [
      { field: 'name' },
      { field: 'billRate' },                          // amount pattern
      { field: 'score', dataType: 'number' } as any,  // numeric dataType
    ];
    const { result } = run({ columnDefs: defs } as any);
    expect(result.current.columnAlignment).toEqual({ billRate: 'right', score: 'right' });
  });

  it('applies pagination page size', () => {
    const { result } = run({ pagination: true, paginationPageSize: 2 });
    expect(result.current.table.getRowModel().rows).toHaveLength(2);
  });

  it('persists state to jt-grid-<id> (debounced) and restores it on remount', () => {
    vi.useFakeTimers();
    const props = { persistSettings: true, gridId: 'char' };
    const first = run(props);
    act(() => first.result.current.setSorting([{ id: 'name', desc: true }]));
    act(() => vi.advanceTimersByTime(400));
    first.unmount();

    const raw = localStorage.getItem('jt-grid-char');
    expect(raw).toBeTruthy();
    expect(JSON.parse(raw!).version).toBe(3);

    const second = run(props);
    expect(second.result.current.sorting).toEqual([{ id: 'name', desc: true }]);
    vi.useRealTimers();
  });

  it('resetState clears persisted state and all grid state', () => {
    localStorage.setItem('jt-grid-char', JSON.stringify({ version: 2, sorting: [] }));
    const { result } = run({ persistSettings: true, gridId: 'char' });
    act(() => result.current.resetState());
    expect(localStorage.getItem('jt-grid-char')).toBeNull();
    expect(result.current.sorting).toEqual([]);
    expect(result.current.grouping).toEqual([]);
  });

  it('derives default filter types from dataType (select→set, date→date, number→number)', () => {
    const defs: ColumnDef<Row>[] = [
      { field: 'status', dataType: 'select' },
      { field: 'hiredOn', dataType: 'date' },
      { field: 'billRate', dataType: 'currency' },
      { field: 'name' }, // no dataType → no default filter
    ];
    const { result } = run({ columnDefs: defs } as any);
    const meta = (id: string) =>
      (result.current.table.getColumn(id)?.columnDef.meta as any)?.filterType;
    expect(meta('status')).toBe('set');
    expect(meta('hiredOn')).toBe('date');
    expect(meta('billRate')).toBe('number');
    expect(meta('name')).toBeUndefined();
  });

  it('isNumericDataType covers the numeric set', () => {
    const numeric = ['number', 'currency', 'percent', 'progress', 'rating'] as const;
    expect(numeric.every((t) => isNumericDataType(t))).toBe(true);
    expect(isNumericDataType('text' as any)).toBe(false);
    expect(isNumericDataType(undefined)).toBe(false);
  });
});
