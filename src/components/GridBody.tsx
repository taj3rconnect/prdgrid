import React, { useMemo } from 'react';
import { Table } from '@tanstack/react-table';
import { GridRow } from './GridRow';
import type { ColumnMeta, RowColorRule } from '../types';

interface GridBodyProps<TData> {
  table: Table<TData>;
  columnAlignment?: Record<string, 'left' | 'center' | 'right'>;
  columnDecimals?: Record<string, number>;
  rowColorRules?: RowColorRule<TData>[];
  noRowsComponent?: React.ComponentType;
  noRowsMessage?: string;
  onCellClick?: (cell: any, event: React.MouseEvent) => void;
  onCellDoubleClick?: (cell: any, event: React.MouseEvent) => void;
  onCellValueChanged?: (cell: any, oldValue: any, newValue: any) => void;
  onExpandRecord?: (rowId: string) => void;
}

export function GridBody<TData>({
  table,
  columnAlignment,
  columnDecimals,
  rowColorRules,
  noRowsComponent: NoRowsComp,
  noRowsMessage,
  onCellClick,
  onCellDoubleClick,
  onCellValueChanged,
  onExpandRecord,
}: GridBodyProps<TData>) {
  const rows = table.getRowModel().rows;

  // Column max values for dataBar columns, over all filtered rows
  const dataBarColumns = table
    .getAllLeafColumns()
    .filter((c) => (c.columnDef.meta as ColumnMeta | undefined)?.dataBar)
    .map((c) => c.id);
  const filteredRows = table.getFilteredRowModel().rows;
  const columnMaxes = useMemo(() => {
    if (dataBarColumns.length === 0) return undefined;
    const maxes: Record<string, number> = {};
    for (const colId of dataBarColumns) {
      let max = 0;
      for (const r of filteredRows) {
        const v = Number(r.getValue(colId));
        if (!isNaN(v) && v > max) max = v;
      }
      maxes[colId] = max;
    }
    return maxes;
  }, [dataBarColumns.join(','), filteredRows]);

  if (rows.length === 0) {
    return (
      <tbody>
        <tr>
          <td
            colSpan={table.getVisibleLeafColumns().length}
            className="px-6 py-16 text-center text-grid-text-secondary"
          >
            {NoRowsComp ? (
              <NoRowsComp />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <svg
                  className="h-12 w-12"
                  style={{ color: 'var(--jt-grid-border-strong)' }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <span className="text-sm">{noRowsMessage || 'No data to display'}</span>
              </div>
            )}
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className="jt-body">
      {rows.map((row, index) => (
        <GridRow
          key={row.id}
          row={row}
          rowIndex={index}
          columnAlignment={columnAlignment}
          columnDecimals={columnDecimals}
          rowColorRules={rowColorRules}
          columnMaxes={columnMaxes}
          onCellClick={onCellClick}
          onCellDoubleClick={onCellDoubleClick}
          onCellValueChanged={onCellValueChanged}
          onExpandRecord={onExpandRecord}
        />
      ))}
    </tbody>
  );
}
