import React from 'react';
import { Row } from '@tanstack/react-table';
import { clsx } from 'clsx';
import { GridCell } from './GridCell';
import type { ColumnMeta, RowColorRule } from '../types';

interface GridRowProps<TData> {
  row: Row<TData>;
  rowIndex: number;
  columnAlignment?: Record<string, 'left' | 'center' | 'right'>;
  columnDecimals?: Record<string, number>;
  rowColorRules?: RowColorRule<TData>[];
  /** Precomputed max per dataBar column */
  columnMaxes?: Record<string, number>;
  onCellClick?: (cell: any, event: React.MouseEvent) => void;
  onCellDoubleClick?: (cell: any, event: React.MouseEvent) => void;
  onCellValueChanged?: (cell: any, oldValue: any, newValue: any) => void;
  onExpandRecord?: (rowId: string) => void;
}

export const GridRow = React.memo(function GridRow<TData>({
  row,
  rowIndex,
  columnAlignment,
  columnDecimals,
  rowColorRules,
  columnMaxes,
  onCellClick,
  onCellDoubleClick,
  onCellValueChanged,
  onExpandRecord,
}: GridRowProps<TData>) {
  const isSelected = row.getIsSelected();
  const isGroupRow = row.getIsGrouped();
  const depth = row.depth;

  // Conditional row coloring — first matching rule wins; selection wash wins over tint
  let rowStyle: React.CSSProperties | undefined;
  if (rowColorRules && !isGroupRow) {
    const rule = rowColorRules.find((r) => r.when(row.original));
    if (rule) {
      rowStyle =
        rule.target === 'leftBar'
          ? { boxShadow: `inset 3px 0 0 ${rule.color}` }
          : { backgroundColor: rule.color };
    }
  }

  const visibleCells = row.getVisibleCells();
  const firstDataCellIndex = visibleCells.findIndex(
    (c) => !(c.column.columnDef.meta as ColumnMeta | undefined)?.isSelectColumn
  );

  return (
    <tr
      className={clsx('jt-row', isGroupRow && 'font-medium')}
      style={rowStyle}
      data-row-index={rowIndex}
      data-selected={isSelected}
      data-group={isGroupRow}
    >
      {visibleCells.map((cell, cellIndex) => (
        <GridCell
          key={cell.id}
          cell={cell}
          rowIndex={rowIndex}
          alignment={columnAlignment?.[cell.column.id]}
          decimals={columnDecimals?.[cell.column.id]}
          indent={cellIndex === firstDataCellIndex && depth > 0 && !isGroupRow ? depth * 24 : undefined}
          columnMax={columnMaxes?.[cell.column.id]}
          onCellClick={onCellClick}
          onCellDoubleClick={onCellDoubleClick}
          onCellValueChanged={onCellValueChanged}
          onExpandRecord={onExpandRecord}
        />
      ))}
    </tr>
  );
}) as <TData>(props: GridRowProps<TData>) => React.ReactElement;
