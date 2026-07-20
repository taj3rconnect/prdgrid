import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Cell, flexRender } from '@tanstack/react-table';
import { clsx } from 'clsx';
import { renderTypedCell, formatTypedValue, Sparkline, DataBar } from './renderers';
import type { ColumnDef, ColumnMeta } from '../types';

interface GridCellProps<TData> {
  cell: Cell<TData, unknown>;
  rowIndex: number;
  alignment?: 'left' | 'center' | 'right';
  decimals?: number;
  /** Indent (px) applied to the first data cell of nested rows */
  indent?: number;
  /** Column max for dataBar columns */
  columnMax?: number;
  onCellClick?: (cell: Cell<TData, unknown>, event: React.MouseEvent) => void;
  onCellDoubleClick?: (cell: Cell<TData, unknown>, event: React.MouseEvent) => void;
  onCellValueChanged?: (cell: Cell<TData, unknown>, oldValue: any, newValue: any) => void;
  onExpandRecord?: (rowId: string) => void;
}

export const GridCell = React.memo(function GridCell<TData>({
  cell,
  rowIndex,
  alignment,
  decimals,
  indent,
  columnMax,
  onCellClick,
  onCellDoubleClick,
  onCellValueChanged,
  onExpandRecord,
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
    const typed = formatTypedValue(meta?.dataType, value, decimals);
    if (typed !== null) return typed;
    if (meta?.autoNumeric && value != null && !isNaN(Number(value))) {
      const d = decimals ?? 0;
      return Number(value).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
    }
    if (value === null || value === undefined) return '';
    return String(value);
  }, [meta, value, row.original, colDef, rowIndex, decimals]);

  const cellStyle = useMemo(() => {
    let style: any = undefined;
    if (meta?.cellStyle) {
      style = typeof meta.cellStyle === 'function'
        ? meta.cellStyle({ value, data: row.original, colDef: colDef || ({} as any), rowIndex })
        : meta.cellStyle;
    }
    if (alignment) {
      style = { ...style, textAlign: alignment };
    }
    if (indent) {
      style = { ...style, paddingLeft: `calc(var(--jt-grid-cell-px) + ${indent}px)` };
    }
    // Conditional cell coloring (first matching rule wins; explicit cellStyle wins over rules)
    if (meta?.cellColorRules && !style?.backgroundColor) {
      const rule = meta.cellColorRules.find((r) => r.when(value, row.original));
      if (rule) style = { ...style, backgroundColor: rule.color };
    }
    if (isPinned === 'left') style = { ...style, left: cell.column.getStart('left') };
    if (isPinned === 'right') style = { ...style, right: cell.column.getAfter('right') };
    return style;
  }, [meta, value, row.original, colDef, rowIndex, alignment, indent, isPinned, cell.column]);

  const cellClassName = useMemo(() => {
    if (!meta?.cellClass) return '';
    if (typeof meta.cellClass === 'function') {
      return meta.cellClass({ value, data: row.original, colDef: colDef || ({} as any), rowIndex });
    }
    return meta.cellClass;
  }, [meta, value, row.original, colDef, rowIndex]);

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

  // ─── Row-number / selection / expand column ───
  if (meta?.isSelectColumn) {
    const canSelect = row.getCanSelect();
    const isSelected = row.getIsSelected();
    return (
      <td
        className="jt-cell jt-cell-select jt-cell-pinned sticky left-0 z-10 !p-0 text-center"
        style={{ width: cell.column.getSize() }}
      >
        <span className="relative flex h-full items-center justify-center gap-1">
          <span className="jt-rownum">{isGrouped || row.getIsGrouped() ? '' : rowIndex + 1}</span>
          <span className="jt-select-hover items-center justify-center gap-1">
            {canSelect && (
              <input
                type="checkbox"
                className="h-[15px] w-[15px] rounded accent-[var(--jt-grid-accent)] cursor-pointer"
                checked={isSelected}
                onChange={row.getToggleSelectedHandler()}
                onClick={(e) => e.stopPropagation()}
              />
            )}
            {onExpandRecord && !row.getIsGrouped() && (
              <button
                className="jt-expand-btn flex h-[18px] w-[18px] items-center justify-center rounded hover:bg-grid-accent-light"
                style={{ color: 'var(--jt-grid-accent)' }}
                title="Expand record"
                onClick={(e) => {
                  e.stopPropagation();
                  onExpandRecord(row.id);
                }}
              >
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M9 2h5v5M14 2L9 7M7 14H2V9M2 14l5-5" />
                </svg>
              </button>
            )}
          </span>
        </span>
      </td>
    );
  }

  if (isGrouped) {
    return (
      <td
        className={clsx('jt-cell jt-cell-grouped', 'font-semibold text-grid-header-text', cellClassName)}
        style={{ ...cellStyle, backgroundColor: 'var(--jt-grid-bg-alt)' }}
      >
        <div className="flex items-center gap-1.5">
          <button
            className="flex h-4 w-4 shrink-0 items-center justify-center rounded text-grid-text-secondary transition-transform duration-100 hover:bg-grid-accent-light hover:text-grid-accent"
            style={{ transform: row.getIsExpanded() ? 'rotate(90deg)' : undefined }}
            onClick={() => row.toggleExpanded()}
          >
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M6 3l5 5-5 5" />
            </svg>
          </button>
          <span className="truncate">{formattedValue}</span>
          <span className="jt-chip shrink-0" style={{ backgroundColor: 'var(--jt-grid-accent-light)', color: 'var(--jt-grid-accent)' }}>
            {row.subRows.length}
          </span>
        </div>
      </td>
    );
  }

  if (isPlaceholder) {
    return <td className="jt-cell" />;
  }

  const CustomRenderer = meta?.cellRenderer;
  const rendererParams = meta?.cellRendererParams || {};

  if (isAggregated) {
    return (
      <td
        className={clsx('jt-cell jt-cell-aggregated', 'font-medium italic', cellClassName)}
        style={{ ...cellStyle, color: 'var(--jt-grid-accent)' }}
      >
        {flexRender(cell.column.columnDef.aggregatedCell ?? cell.column.columnDef.cell, cell.getContext())}
      </td>
    );
  }

  // ─── Content: editor > custom renderer > sparkline > typed > data-bar > text ───
  let content: React.ReactNode;
  if (isEditing) {
    content = (
      <input
        ref={inputRef}
        type={colDef?.cellEditor === 'number' ? 'number' : 'text'}
        className="w-full border-none bg-transparent outline-none text-grid-base"
        value={editValue ?? ''}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={commitEdit}
      />
    );
  } else if (CustomRenderer) {
    content = (
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
    );
  } else if (meta?.sparkline && Array.isArray(value)) {
    content = <Sparkline type={meta.sparkline} values={value as number[]} />;
  } else {
    const typed = meta?.dataType ? renderTypedCell(meta.dataType, value, formattedValue) : null;
    if (typed !== null) {
      content = typed;
    } else if (meta?.dataBar && value != null && !isNaN(Number(value)) && columnMax != null) {
      content = (
        <DataBar value={Number(value)} columnMax={columnMax}>
          {formattedValue}
        </DataBar>
      );
    } else {
      content = <span className="block truncate">{formattedValue}</span>;
    }
  }

  return (
    <td
      className={clsx(
        'jt-cell text-grid-text',
        isEditing && 'bg-grid-cell-edit ring-2 ring-grid-accent ring-inset',
        isPinned && 'sticky z-10 jt-cell-pinned',
        isPinned === 'left' && cell.column.getIsLastColumn('left') && 'jt-cell-pinned-edge-left',
        isPinned === 'right' && cell.column.getIsFirstColumn('right') && 'jt-cell-pinned-edge-right',
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
      {content}
    </td>
  );
}) as <TData>(props: GridCellProps<TData>) => React.ReactElement;
