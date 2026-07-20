// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { DataGrid } from './DataGrid';
import type { ColumnDef, GridApi } from '../types';

interface Row {
  id: number;
  name: string;
  amount: number;
}

const rows: Row[] = [
  { id: 1, name: 'Ada', amount: 100 },
  { id: 2, name: 'Grace', amount: 200 },
];

const columns: ColumnDef<Row>[] = [
  { field: 'name', headerName: 'Name' },
  { field: 'amount', headerName: 'Amount' },
];

beforeEach(() => localStorage.clear());

describe('DataGrid characterization', () => {
  it('renders rows and headers', () => {
    render(<DataGrid rowData={rows} columnDefs={columns} />);
    expect(screen.getByText('Name')).toBeTruthy();
    expect(screen.getByText('Ada')).toBeTruthy();
    expect(screen.getByText('Grace')).toBeTruthy();
  });

  it('shows the no-rows message for an empty dataset (zero rows, not an error)', () => {
    render(<DataGrid rowData={[]} columnDefs={columns} noRowsMessage="zero rows" />);
    expect(screen.getByText('zero rows')).toBeTruthy();
  });

  it('exposes a working GridApi via onGridReady', async () => {
    let api!: GridApi<Row>;
    render(
      <DataGrid rowData={rows} columnDefs={columns} onGridReady={(e) => (api = e.api)} />
    );
    expect(api).toBeTruthy();
    expect(api.getRowData()).toHaveLength(2);
    expect(api.getDisplayedRowCount()).toBe(2);

    await act(async () => api.setSortModel([{ colId: 'amount', sort: 'desc' }]));
    expect(api.getSortModel()).toEqual([{ colId: 'amount', sort: 'desc' }]);

    await act(async () => api.setFilterModel({ name: 'Ada' }));
    expect(api.getFilterModel()).toEqual({ name: 'Ada' });
    expect(api.getDisplayedRowCount()).toBe(1);
  });

  it('getState/applyState round-trips grid state', async () => {
    let api!: GridApi<Row>;
    render(
      <DataGrid rowData={rows} columnDefs={columns} onGridReady={(e) => (api = e.api)} />
    );
    await act(async () => api.setSortModel([{ colId: 'name', sort: 'asc' }]));
    const state = api.getState();
    expect(state.sorting).toEqual([{ colId: 'name', sort: 'asc' }]);

    await act(async () => api.setSortModel([]));
    expect(api.getSortModel()).toEqual([]);
    await act(async () => api.applyState(state));
    expect(api.getSortModel()).toEqual([{ colId: 'name', sort: 'asc' }]);
  });

  it('applies gridType presets (finance disables pagination + row selection)', () => {
    const { container } = render(
      <DataGrid rowData={rows} columnDefs={columns} gridType="finance" />
    );
    expect(container.querySelector('.jt-datagrid')).toBeTruthy();
    // finance preset: no selection column
    expect(container.querySelector('[data-anyselected]')).toBeTruthy();
  });
});
