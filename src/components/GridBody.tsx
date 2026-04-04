import React from 'react';
import { Table } from '@tanstack/react-table';
import { GridRow } from './GridRow';
import type { GridDensity } from '../types';

interface GridBodyProps<TData> {
  table: Table<TData>;
  density: GridDensity;
  columnAlignment?: Record<string, 'left' | 'center' | 'right'>;
  noRowsComponent?: React.ComponentType;
  noRowsMessage?: string;
  onCellClick?: (cell: any, event: React.MouseEvent) => void;
  onCellDoubleClick?: (cell: any, event: React.MouseEvent) => void;
  onCellValueChanged?: (cell: any, oldValue: any, newValue: any) => void;
}

export function GridBody<TData>({
  table,
  density,
  columnAlignment,
  noRowsComponent: NoRowsComp,
  noRowsMessage,
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

  return (
    <tbody className="jt-body">
      {rows.map((row, index) => (
        <GridRow
          key={row.id}
          row={row}
          rowIndex={index}
          density={density}
          columnAlignment={columnAlignment}
          striped={index % 2 === 1}
          onCellClick={onCellClick}
          onCellDoubleClick={onCellDoubleClick}
          onCellValueChanged={onCellValueChanged}
        />
      ))}
    </tbody>
  );
}
