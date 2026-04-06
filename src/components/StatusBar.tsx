import { useMemo } from 'react';
import { Table } from '@tanstack/react-table';
import { getColumnHeader } from '../core/gridUtils';
import type { ColumnMeta } from '../types';

interface StatusBarProps<TData> {
  table: Table<TData>;
}

interface Agg {
  label: string;
  sum: number;
  avg: number;
  min: number;
  max: number;
  count: number;
}

export function StatusBar<TData>({ table }: StatusBarProps<TData>) {
  const totalRows = table.getPreFilteredRowModel().rows.length;
  const filteredRows = table.getFilteredRowModel().rows.length;
  const selectedRows = table.getSelectedRowModel().rows;
  const rowSelectionState = table.getState().rowSelection;
  const hasFilters = totalRows !== filteredRows;

  const numericColumns = useMemo(() => {
    return table.getAllLeafColumns().filter((col) => {
      const meta = col.columnDef.meta as ColumnMeta | undefined;
      return meta?.autoNumeric || meta?.filterType === 'number';
    });
  }, [table]);

  const aggregates = useMemo<Agg[]>(() => {
    if (numericColumns.length === 0) return [];

    const selected = table.getSelectedRowModel().rows;
    const rows = selected.length > 0
      ? selected
      : table.getFilteredRowModel().rows;

    if (rows.length === 0) return [];

    return numericColumns.map((col) => {
      const header = getColumnHeader(col);
      let sum = 0;
      let min = Infinity;
      let max = -Infinity;
      let count = 0;

      for (const row of rows) {
        const val = Number(row.getValue(col.id));
        if (!isNaN(val) && val != null) {
          sum += val;
          if (val < min) min = val;
          if (val > max) max = val;
          count++;
        }
      }

      if (count === 0) return null;

      return {
        label: header,
        sum,
        avg: sum / count,
        min: min === Infinity ? 0 : min,
        max: max === -Infinity ? 0 : max,
        count,
      };
    }).filter(Boolean) as Agg[];
  }, [numericColumns, rowSelectionState, table, filteredRows]);

  const fmt = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 2 });

  // Show at most 3 columns in the status bar to avoid overflow
  const shown = aggregates.slice(0, 3);
  const source = selectedRows.length > 0 ? 'selected' : 'all';

  return (
    <div className="jt-status-bar flex items-center gap-4 border-t border-grid-border bg-gray-50 px-3 py-1.5 text-grid-sm text-grid-text-secondary overflow-x-auto">
      <span>
        Total: <strong className="text-grid-text">{totalRows}</strong>
      </span>
      {hasFilters && (
        <span>
          Showing: <strong className="text-grid-text">{filteredRows}</strong>
        </span>
      )}
      {selectedRows.length > 0 && (
        <span>
          Selected: <strong className="text-grid-accent">{selectedRows.length}</strong>
        </span>
      )}

      {shown.length > 0 && (
        <>
          <span className="text-gray-300">|</span>
          {shown.map((agg) => (
            <span key={agg.label} className="flex items-center gap-1.5 whitespace-nowrap">
              <strong className="text-grid-text">{agg.label}</strong>
              <span title={`Sum of ${source} rows`}>
                Sum: {fmt(agg.sum)}
              </span>
              <span className="text-gray-300">/</span>
              <span title={`Avg of ${source} rows`}>
                Avg: {fmt(agg.avg)}
              </span>
            </span>
          ))}
        </>
      )}
    </div>
  );
}
