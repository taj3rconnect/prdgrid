import React, { useCallback } from 'react';
import { Table } from '@tanstack/react-table';
import { GridRow } from './GridRow';
import type { GridDensity } from '../types';

interface GridBodyProps<TData> {
  table: Table<TData>;
  density: GridDensity;
  columnAlignment?: Record<string, 'left' | 'center' | 'right'>;
  columnDecimals?: Record<string, number>;
  noRowsComponent?: React.ComponentType;
  noRowsMessage?: string;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
  rowStyle?: (data: TData) => React.CSSProperties | undefined;
  onCellClick?: (cell: any, event: React.MouseEvent) => void;
  onCellDoubleClick?: (cell: any, event: React.MouseEvent) => void;
  onCellValueChanged?: (cell: any, oldValue: any, newValue: any) => void;
}

export function GridBody<TData>({
  table,
  density,
  columnAlignment,
  columnDecimals,
  noRowsComponent: NoRowsComp,
  noRowsMessage,
  hasActiveFilters,
  onClearFilters,
  rowStyle,
  onCellClick,
  onCellDoubleClick,
  onCellValueChanged,
}: GridBodyProps<TData>) {
  const rows = table.getRowModel().rows;

  if (rows.length === 0) {
    return (
      <tbody>
        <tr>
          <td
            colSpan={table.getVisibleLeafColumns().length + 1}
            className="px-6 py-16 text-center text-grid-text-secondary"
          >
            {NoRowsComp ? (
              <NoRowsComp />
            ) : hasActiveFilters ? (
              <div className="flex flex-col items-center gap-3">
                <svg
                  className="h-12 w-12 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                <span className="text-sm">No rows match the current filters</span>
                <button
                  className="rounded-md border border-grid-accent bg-white px-3 py-1 text-sm text-grid-accent hover:bg-grid-accent-light transition-colors"
                  onClick={onClearFilters}
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <svg
                  className="h-12 w-12 text-gray-300"
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

  // ─── Keyboard navigation ───
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const active = document.activeElement as HTMLElement | null;
    if (!active?.classList.contains('jt-cell')) return;

    const cell = active.closest('td');
    const row = cell?.closest('tr');
    const body = row?.closest('tbody');
    if (!cell || !row || !body) return;

    const cells = Array.from(row.querySelectorAll<HTMLElement>('.jt-cell'));
    const colIdx = cells.indexOf(active);
    const rows = Array.from(body.querySelectorAll<HTMLElement>('tr'));
    const rowIdx = rows.indexOf(row);

    let target: HTMLElement | null = null;

    switch (e.key) {
      case 'ArrowRight':
      case 'Tab': {
        if (e.key === 'Tab' && e.shiftKey) {
          target = colIdx > 0 ? cells[colIdx - 1]! : null;
        } else {
          target = colIdx < cells.length - 1 ? cells[colIdx + 1]! : null;
        }
        break;
      }
      case 'ArrowLeft':
        target = colIdx > 0 ? cells[colIdx - 1]! : null;
        break;
      case 'ArrowDown': {
        const nextRow = rows[rowIdx + 1];
        if (nextRow) {
          const nextCells = nextRow.querySelectorAll<HTMLElement>('.jt-cell');
          target = nextCells[colIdx] ?? null;
        }
        break;
      }
      case 'ArrowUp': {
        const prevRow = rows[rowIdx - 1];
        if (prevRow) {
          const prevCells = prevRow.querySelectorAll<HTMLElement>('.jt-cell');
          target = prevCells[colIdx] ?? null;
        }
        break;
      }
      case 'Home':
        target = cells[0] ?? null;
        break;
      case 'End':
        target = cells[cells.length - 1] ?? null;
        break;
      default:
        return;
    }

    if (target) {
      e.preventDefault();
      target.focus();
    }
  }, []);

  return (
    <tbody className="jt-body" onKeyDown={handleKeyDown}>
      {rows.map((row, index) => (
        <GridRow
          key={row.id}
          row={row}
          rowIndex={index}
          density={density}
          columnAlignment={columnAlignment}
          columnDecimals={columnDecimals}
          striped={index % 2 === 1}
          rowStyle={rowStyle}
          onCellClick={onCellClick}
          onCellDoubleClick={onCellDoubleClick}
          onCellValueChanged={onCellValueChanged}
        />
      ))}
    </tbody>
  );
}
