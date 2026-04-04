import React from 'react';
import { Row } from '@tanstack/react-table';
import { clsx } from 'clsx';
import { GridCell } from './GridCell';
import { densityPadding } from '../core/gridUtils';
import type { GridDensity } from '../types';

interface GridRowProps<TData> {
  row: Row<TData>;
  rowIndex: number;
  density: GridDensity;
  striped: boolean;
  onCellClick?: (cell: any, event: React.MouseEvent) => void;
  onCellDoubleClick?: (cell: any, event: React.MouseEvent) => void;
  onCellValueChanged?: (cell: any, oldValue: any, newValue: any) => void;
}

export const GridRow = React.memo(function GridRow<TData>({
  row,
  rowIndex,
  density,
  striped,
  onCellClick,
  onCellDoubleClick,
  onCellValueChanged,
}: GridRowProps<TData>) {
  const isSelected = row.getIsSelected();
  const isGroupRow = row.getIsGrouped();
  const depth = row.depth;

  return (
    <tr
      className={clsx(
        'jt-row',
        'border-b border-grid-border transition-colors',
        isSelected && 'bg-grid-row-selected',
        !isSelected && striped && 'bg-grid-bg-alt',
        !isSelected && !striped && 'bg-grid-bg',
        !isSelected && 'hover:bg-grid-row-hover',
        isGroupRow && 'bg-grid-header-bg font-medium',
      )}
      data-row-index={rowIndex}
      data-selected={isSelected}
      data-group={isGroupRow}
    >
      {row.getCanSelect() && (
        <td
          className={clsx(
            'jt-cell-checkbox',
            'w-10 border-r border-grid-border px-2 text-center',
            densityPadding(density)
          )}
        >
          <input
            type="checkbox"
            className="h-3.5 w-3.5 rounded border-gray-300 text-grid-accent focus:ring-grid-accent"
            checked={isSelected}
            onChange={row.getToggleSelectedHandler()}
          />
        </td>
      )}

      {depth > 0 && !isGroupRow && (
        <td
          className="w-0 border-none p-0"
          style={{ paddingLeft: depth * 24 }}
        />
      )}

      {row.getVisibleCells().map((cell) => (
        <GridCell
          key={cell.id}
          cell={cell}
          rowIndex={rowIndex}
          density={density}
          onCellClick={onCellClick}
          onCellDoubleClick={onCellDoubleClick}
          onCellValueChanged={onCellValueChanged}
        />
      ))}
    </tr>
  );
}) as <TData>(props: GridRowProps<TData>) => React.ReactElement;
