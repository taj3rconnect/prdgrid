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

// Shared auto-size helpers used by both resize handle and context menu
function measureColumnWidths(resizeRef: React.RefObject<HTMLDivElement | null>, _column: any) {
  const headerEl = resizeRef.current?.closest('th');
  const tableEl = headerEl?.closest('table');
  if (!tableEl || !headerEl) return null;

  const colIndex = Array.from(headerEl.parentElement!.children).indexOf(headerEl);
  const rows = tableEl.querySelectorAll('tbody tr');

  // Helper: measure trimmed text width using off-screen element
  const measureText = (el: Element, container: Element): number => {
    const text = (el.textContent || '').trim();
    if (!text) return 0;
    const m = document.createElement('span');
    m.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;font:inherit;pointer-events:none;';
    m.textContent = text;
    container.appendChild(m);
    const w = m.offsetWidth;
    container.removeChild(m);
    return w;
  };

  // Measure header text
  let headerWidth = 40;
  const headerSpans = headerEl.querySelectorAll('span');
  headerSpans.forEach((s) => {
    const w = measureText(s, headerEl);
    if (w > 0) headerWidth = Math.max(headerWidth, w + 24);
  });

  // Measure widest cell content (trimmed)
  let contentWidth = 0;
  rows.forEach((row) => {
    const cell = row.children[colIndex] as HTMLElement | undefined;
    if (cell) {
      const content = cell.querySelector('span') || cell;
      const w = measureText(content, cell);
      if (w > 0) contentWidth = Math.max(contentWidth, w + 20);
    }
  });

  return {
    headerWidth,
    contentWidth: Math.max(headerWidth, contentWidth),
  };
}

export function autoSizeColumn(
  header: Header<any, unknown>,
  resizeRef: React.RefObject<HTMLDivElement | null>,
  mode: 'header' | 'content'
) {
  const table = header.getContext().table;
  const column = header.column;
  const widths = measureColumnWidths(resizeRef, column);
  if (!widths) { column.resetSize(); return; }
  const size = mode === 'header' ? widths.headerWidth : widths.contentWidth;
  table.setColumnSizing((prev: any) => ({ ...prev, [column.id]: size }));
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
      const currentSort = column.getIsSorted();
      const nextDesc = currentSort === 'asc';
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
        'jt-header-cell group/header',
        'relative select-none border-r border-grid-border bg-grid-header-bg px-3 py-2 text-left text-grid-sm font-semibold text-grid-header-text',
        canSort && 'cursor-pointer hover:bg-grid-accent-light',
        isPinned && 'sticky z-10',
        isPinned === 'left' && 'left-0',
        isPinned === 'right' && 'right-0',
        isGrouped && 'bg-grid-accent-light'
      )}
      style={{
        width: header.getSize(),
        textAlign: alignment || (() => {
          if (meta?.cellStyle && typeof meta.cellStyle === 'function') {
            const s = meta.cellStyle({});
            return s?.textAlign;
          }
          return meta?.cellStyle?.textAlign;
        })(),
      }}
      title={meta?.headerTooltip}
      onContextMenu={(e) => onContextMenu?.(column, e)}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver?.(column.id);
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDragEnd?.();
      }}
    >
      <div
        className={clsx(
          'flex items-center gap-1',
          alignment === 'right' && 'justify-end',
          alignment === 'center' && 'justify-center',
        )}
        draggable={!meta?.colDef?.suppressMovable}
        onDragStart={(e) => {
          e.dataTransfer.setData('text/plain', column.id);
          onDragStart?.(column.id);
        }}
        onClick={handleSort}
      >
        {/* Group indicator — visible on hover or when actively grouped */}
        {canGroup && (
          <button
            className={clsx(
              'mr-1 flex h-4 w-4 items-center justify-center rounded text-[10px] leading-none transition-opacity',
              isGrouped
                ? 'bg-grid-accent text-white opacity-100'
                : 'bg-gray-200 text-gray-500 hover:bg-gray-300 opacity-0 group-hover/header:opacity-100'
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

      {/* Resize handle */}
      {column.getCanResize() && (
        <div
          ref={resizeRef}
          className="absolute right-0 top-0 h-full w-4 -mr-2 cursor-col-resize select-none touch-none group/resize z-20"
          onMouseDown={header.getResizeHandler()}
          onTouchStart={header.getResizeHandler()}
          onDoubleClick={() => autoSizeColumn(header, resizeRef, 'content')}
          draggable={false}
        >
          <div
            className={clsx(
              'absolute right-[6px] top-1 bottom-1 rounded-full transition-all',
              header.column.getIsResizing()
                ? 'w-[3px] bg-grid-accent opacity-100'
                : 'w-[2px] bg-gray-300 opacity-40 group-hover/resize:w-[3px] group-hover/resize:bg-grid-accent group-hover/resize:opacity-100'
            )}
          />
        </div>
      )}
    </th>
  );
}
