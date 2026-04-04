import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Cell, flexRender } from '@tanstack/react-table';
import { clsx } from 'clsx';
import { densityPadding } from '../core/gridUtils';
import type { ColumnDef, ColumnMeta, GridDensity } from '../types';

interface GridCellProps<TData> {
  cell: Cell<TData, unknown>;
  rowIndex: number;
  density: GridDensity;
  onCellClick?: (cell: Cell<TData, unknown>, event: React.MouseEvent) => void;
  onCellDoubleClick?: (cell: Cell<TData, unknown>, event: React.MouseEvent) => void;
  onCellValueChanged?: (cell: Cell<TData, unknown>, oldValue: any, newValue: any) => void;
}

export const GridCell = React.memo(function GridCell<TData>({
  cell,
  rowIndex,
  density,
  onCellClick,
  onCellDoubleClick,
  onCellValueChanged,
}: GridCellProps<TData>) {
  const meta = cell.column.columnDef.meta as ColumnMeta<TData> | undefined;
  const colDef: ColumnDef<TData> | undefined = meta?.colDef;
  const value = cell.getValue();
  const row = cell.row;
  const isPinned = cell.column.getIsPinned();
  const isGrouped = cell.getIsGrouped();
  const isAggregated = cell.getIsAggregated();
  const isPlaceholder = cell.getIsPlaceholder();

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState<any>(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const isEditable = useMemo(() => {
    if (!colDef?.editable) return false;
    if (typeof colDef.editable === 'function') {
      return colDef.editable({ data: row.original, colDef, rowIndex });
    }
    return colDef.editable;
  }, [colDef, row.original, rowIndex]);

  const formattedValue = useMemo(() => {
    if (meta?.valueFormatter && value !== undefined && value !== null) {
      return meta.valueFormatter({
        value,
        data: row.original,
        colDef: colDef || ({} as any),
        rowIndex,
      });
    }
    if (value === null || value === undefined) return '';
    return String(value);
  }, [meta, value, row.original, colDef, rowIndex]);

  const cellStyle = useMemo(() => {
    if (!meta?.cellStyle) return undefined;
    if (typeof meta.cellStyle === 'function') {
      return meta.cellStyle({ value, data: row.original, colDef: colDef || ({} as any), rowIndex });
    }
    return meta.cellStyle;
  }, [meta, value, row.original, colDef, rowIndex]);

  const cellClassName = useMemo(() => {
    if (!meta?.cellClass) return '';
    if (typeof meta.cellClass === 'function') {
      return meta.cellClass({ value, data: row.original, colDef: colDef || ({} as any), rowIndex });
    }
    return meta.cellClass;
  }, [meta, value, row.original, colDef, rowIndex]);

  const padClass = densityPadding(density);

  const startEditing = useCallback(() => {
    if (!isEditable || isGrouped) return;
    setEditValue(value);
    setIsEditing(true);
  }, [isEditable, isGrouped, value]);

  const commitEdit = useCallback(() => {
    setIsEditing(false);
    if (editValue !== value) {
      onCellValueChanged?.(cell, value, editValue);
    }
  }, [editValue, value, cell, onCellValueChanged]);

  const cancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (isEditing) {
        if (e.key === 'Enter') {
          e.preventDefault();
          commitEdit();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          cancelEdit();
        }
      } else if (isEditable) {
        if (e.key === 'Enter' || e.key === 'F2') {
          e.preventDefault();
          startEditing();
        }
      }
    },
    [isEditing, isEditable, commitEdit, cancelEdit, startEditing]
  );

  if (isGrouped) {
    return (
      <td
        className={clsx(
          'jt-cell jt-cell-grouped',
          'border-r border-grid-border px-3 font-semibold text-grid-header-text',
          padClass,
          cellClassName
        )}
        style={cellStyle}
      >
        <div className="flex items-center gap-2">
          <button
            className="flex h-5 w-5 items-center justify-center rounded hover:bg-gray-200 text-xs"
            onClick={() => row.toggleExpanded()}
          >
            {row.getIsExpanded() ? '\u25BC' : '\u25B6'}
          </button>
          <span>{formattedValue}</span>
          <span className="ml-1 text-grid-text-secondary text-grid-sm">
            ({row.subRows.length})
          </span>
        </div>
      </td>
    );
  }

  if (isPlaceholder) {
    return <td className="jt-cell border-r border-grid-border px-3" />;
  }

  const CustomRenderer = meta?.cellRenderer;
  const rendererParams = meta?.cellRendererParams || {};

  if (isAggregated) {
    return (
      <td
        className={clsx(
          'jt-cell jt-cell-aggregated',
          'border-r border-grid-border px-3 font-medium text-grid-accent italic',
          padClass,
          cellClassName
        )}
        style={cellStyle}
      >
        {flexRender(cell.column.columnDef.aggregatedCell ?? cell.column.columnDef.cell, cell.getContext())}
      </td>
    );
  }

  return (
    <td
      className={clsx(
        'jt-cell',
        'border-r border-grid-border px-3 text-grid-base text-grid-text',
        padClass,
        isEditing && 'bg-grid-cell-edit ring-2 ring-grid-accent ring-inset',
        isPinned && 'sticky z-10 bg-grid-bg',
        isPinned === 'left' && 'left-0',
        isPinned === 'right' && 'right-0',
        cellClassName
      )}
      style={cellStyle}
      onClick={(e) => onCellClick?.(cell, e)}
      onDoubleClick={(e) => {
        onCellDoubleClick?.(cell, e);
        startEditing();
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type={colDef?.cellEditor === 'number' ? 'number' : 'text'}
          className="w-full border-none bg-transparent outline-none text-grid-base"
          value={editValue ?? ''}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={commitEdit}
        />
      ) : CustomRenderer ? (
        <CustomRenderer
          value={value}
          formattedValue={formattedValue}
          data={row.original}
          colDef={colDef || ({} as any)}
          rowIndex={rowIndex}
          isGroupRow={false}
          isExpanded={row.getIsExpanded()}
          node={{
            id: row.id,
            data: row.original,
            rowIndex,
            isSelected: row.getIsSelected(),
            isExpanded: row.getIsExpanded(),
            isGroupRow: false,
            depth: row.depth,
          }}
          {...rendererParams}
        />
      ) : (
        <span className="block truncate">{formattedValue}</span>
      )}
    </td>
  );
}) as <TData>(props: GridCellProps<TData>) => React.ReactElement;
