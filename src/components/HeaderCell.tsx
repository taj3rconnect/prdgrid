import React, { useCallback, useRef } from 'react';
import { flexRender, Header, Column } from '@tanstack/react-table';
import { clsx } from 'clsx';

interface HeaderCellProps<TData> {
  header: Header<TData, unknown>;
  alignment?: 'left' | 'center' | 'right';
  onDragStart?: (columnId: string) => void;
  onDragOver?: (columnId: string) => void;
  onDragEnd?: () => void;
  onContextMenu?: (column: Column<TData, unknown>, e: React.MouseEvent) => void;
}

export function HeaderCell<TData>({
  header,
  alignment,
  onDragStart,
  onDragOver,
  onDragEnd,
  onContextMenu,
}: HeaderCellProps<TData>) {
  const resizeRef = useRef<HTMLDivElement>(null);
  const column = header.column;
  const meta = column.columnDef.meta as any;
  const canSort = column.getCanSort();
  const sorted = column.getIsSorted();
  const canGroup = column.getCanGroup();
  const isGrouped = column.getIsGrouped();
  const isPinned = column.getIsPinned();

  const handleSort = useCallback(
    (_e: React.MouseEvent) => {
      if (!canSort) return;
      // Single column sort only: toggle asc <-> desc
      const currentSort = column.getIsSorted();
      const nextDesc = currentSort === 'asc'; // asc -> desc, anything else -> asc
      column.toggleSorting(nextDesc, false);
    },
    [canSort, column]
  );

  const sortIcon = sorted
    ? sorted === 'asc'
      ? '\u25B2'
      : '\u25BC'
    : '';

  const sortIndex = column.getSortIndex();

  return (
    <th
      className={clsx(
        'jt-header-cell',
        'relative select-none border-r border-grid-border bg-grid-header-bg px-3 py-2 text-left text-grid-sm font-semibold text-grid-header-text',
        canSort && 'cursor-pointer hover:bg-grid-accent-light',
        isPinned && 'sticky z-10',
        isPinned === 'left' && 'left-0',
        isPinned === 'right' && 'right-0',
        isGrouped && 'bg-grid-accent-light'
      )}
      style={{
        width: header.getSize(),
        minWidth: column.columnDef.minSize,
        maxWidth: column.columnDef.maxSize,
        textAlign: alignment || (() => {
          if (meta?.cellStyle && typeof meta.cellStyle === 'function') {
            const s = meta.cellStyle({});
            return s?.textAlign;
          }
          return meta?.cellStyle?.textAlign;
        })(),
      }}
      title={meta?.headerTooltip}
      draggable={!meta?.colDef?.suppressMovable}
      onContextMenu={(e) => onContextMenu?.(column, e)}
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
    >
      <div className={clsx(
        'flex items-center gap-1',
        alignment === 'right' && 'justify-end',
        alignment === 'center' && 'justify-center',
      )} onClick={handleSort}>
        {/* Group indicator */}
        {canGroup && (
          <button
            className={clsx(
              'mr-1 flex h-4 w-4 items-center justify-center rounded text-[10px] leading-none',
              isGrouped
                ? 'bg-grid-accent text-white'
                : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
            )}
            onClick={(e) => {
              e.stopPropagation();
              column.toggleGrouping();
            }}
            title={isGrouped ? 'Ungroup' : 'Group by this column'}
          >
            G
          </button>
        )}

        {/* Header text */}
        <span className="flex-1 truncate">
          {header.isPlaceholder
            ? null
            : flexRender(column.columnDef.header, header.getContext())}
        </span>

        {/* Sort indicator */}
        {sortIcon && (
          <span className="ml-1 text-grid-accent text-[10px]">
            {sortIcon}
            {sortIndex !== undefined && sortIndex > 0 && (
              <sup className="text-[8px] ml-0.5">{sortIndex + 1}</sup>
            )}
          </span>
        )}
      </div>

      {/* Resize handle — wide hit area, narrow visible line */}
      {column.getCanResize() && (
        <div
          ref={resizeRef}
          className={clsx(
            'absolute right-0 top-0 h-full w-3 -mr-1.5 cursor-col-resize select-none touch-none group/resize z-10',
          )}
          onMouseDown={header.getResizeHandler()}
          onTouchStart={header.getResizeHandler()}
          onDoubleClick={() => {
            column.resetSize();
          }}
        >
          <div
            className={clsx(
              'absolute right-[5px] top-1 bottom-1 w-[3px] rounded-full transition-opacity',
              header.column.getIsResizing()
                ? 'bg-grid-accent opacity-100'
                : 'bg-gray-300 opacity-0 group-hover/resize:opacity-100'
            )}
          />
        </div>
      )}
    </th>
  );
}
