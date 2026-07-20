import React, { useCallback } from 'react';
import { flexRender, Header } from '@tanstack/react-table';
import { clsx } from 'clsx';
import { FieldTypeIcon } from './renderers';
import type { ColumnMeta } from '../types';

interface HeaderCellProps<TData> {
  header: Header<TData, unknown>;
  alignment?: 'left' | 'center' | 'right';
  onDragStart?: (columnId: string) => void;
  onDragOver?: (columnId: string) => void;
  onDragEnd?: () => void;
  isDragTarget?: boolean;
  onHeaderContextMenu?: (columnId: string, x: number, y: number) => void;
}

export function HeaderCell<TData>({
  header,
  alignment,
  onDragStart,
  onDragOver,
  onDragEnd,
  isDragTarget,
  onHeaderContextMenu,
}: HeaderCellProps<TData>) {
  const column = header.column;
  const meta = column.columnDef.meta as ColumnMeta<TData> | undefined;
  const canSort = column.getCanSort();
  const sorted = column.getIsSorted();
  const canGroup = column.getCanGroup();
  const isGrouped = column.getIsGrouped();
  const isPinned = column.getIsPinned();

  const handleSort = useCallback(
    (e: React.MouseEvent) => {
      if (!canSort) return;
      column.toggleSorting(undefined, e.shiftKey);
    },
    [canSort, column]
  );

  const sortIndex = column.getSortIndex();

  const pinStyle: React.CSSProperties = {};
  if (isPinned === 'left') pinStyle.left = column.getStart('left');
  if (isPinned === 'right') pinStyle.right = column.getAfter('right');

  return (
    <th
      className={clsx(
        'jt-header-cell group',
        'relative select-none text-left',
        canSort && 'cursor-pointer',
        isPinned && 'sticky z-10 jt-cell-pinned',
        isPinned === 'left' && column.getIsLastColumn('left') && 'jt-cell-pinned-edge-left',
        isPinned === 'right' && column.getIsFirstColumn('right') && 'jt-cell-pinned-edge-right',
        isGrouped && '!bg-grid-accent-light'
      )}
      style={{
        width: header.getSize(),
        minWidth: column.columnDef.minSize,
        maxWidth: column.columnDef.maxSize,
        textAlign: alignment,
        boxShadow: isDragTarget ? 'inset 2px 0 0 var(--jt-grid-accent)' : undefined,
        ...pinStyle,
      }}
      title={meta?.headerTooltip}
      draggable={!meta?.colDef?.suppressMovable}
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', column.id);
        onDragStart?.(column.id);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver?.(column.id);
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDragEnd?.();
      }}
      onContextMenu={(e) => {
        if (!onHeaderContextMenu) return;
        e.preventDefault();
        onHeaderContextMenu(column.id, e.clientX, e.clientY);
      }}
    >
      <div
        className={clsx(
          'flex h-full items-center gap-1.5',
          alignment === 'right' && 'justify-end',
          alignment === 'center' && 'justify-center'
        )}
        onClick={handleSort}
      >
        {/* Field-type icon */}
        <FieldTypeIcon dataType={meta?.dataType} />

        {/* Header text */}
        <span className="min-w-0 truncate">
          {header.isPlaceholder ? null : flexRender(column.columnDef.header, header.getContext())}
        </span>

        {/* Sort indicator */}
        {sorted && (
          <span className="flex shrink-0 items-center" style={{ color: 'var(--jt-grid-accent)' }}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              {sorted === 'asc' ? <path d="M4 10l4-4 4 4" /> : <path d="M4 6l4 4 4-4" />}
            </svg>
            {sortIndex !== undefined && sortIndex > 0 && (
              <sup className="ml-0.5 text-[8px] font-semibold">{sortIndex + 1}</sup>
            )}
          </span>
        )}

        <span className="flex-1" />

        {/* Group toggle — appears on hover (or stays when grouped) */}
        {canGroup && (
          <button
            className={clsx(
              'flex h-4 w-4 shrink-0 items-center justify-center rounded transition-opacity duration-100',
              isGrouped
                ? 'opacity-100 text-white'
                : 'opacity-0 group-hover:opacity-100 text-grid-header-icon hover:text-grid-accent'
            )}
            style={isGrouped ? { backgroundColor: 'var(--jt-grid-accent)' } : undefined}
            onClick={(e) => {
              e.stopPropagation();
              column.toggleGrouping();
            }}
            title={isGrouped ? 'Ungroup' : 'Group by this column'}
          >
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
              <path d="M2 4h12M4.5 8h7M7 12h2" />
            </svg>
          </button>
        )}
      </div>

      {/* Resize handle — 2px accent line on hover */}
      {column.getCanResize() && (
        <div
          className={clsx(
            'absolute -right-[2px] top-0 z-10 h-full w-[5px] cursor-col-resize select-none touch-none',
            'after:absolute after:right-[1.5px] after:top-0 after:h-full after:w-[2px] after:transition-opacity after:duration-100',
            header.column.getIsResizing()
              ? 'after:bg-grid-accent after:opacity-100'
              : 'after:bg-grid-accent after:opacity-0 hover:after:opacity-100'
          )}
          onMouseDown={header.getResizeHandler()}
          onTouchStart={header.getResizeHandler()}
          onClick={(e) => e.stopPropagation()}
          onDoubleClick={() => column.resetSize()}
        />
      )}
    </th>
  );
}
