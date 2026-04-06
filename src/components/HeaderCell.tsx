import React, { useCallback, useRef, useMemo } from 'react';
import { flexRender, Header, Column, Table } from '@tanstack/react-table';
import { clsx } from 'clsx';

interface HeaderCellProps<TData> {
  header: Header<TData, unknown>;
  alignment?: 'left' | 'center' | 'right';
  onDragStart?: (columnId: string) => void;
  onDragOver?: (columnId: string) => void;
  onDragEnd?: () => void;
  onContextMenu?: (column: Column<TData, unknown>, e: React.MouseEvent) => void;
}

// ─── Pinning offset helpers ─────────────────────────────────────────
export function getLeftPinOffset<TData>(table: Table<TData>, columnId: string): number {
  const left = table.getState().columnPinning.left ?? [];
  let offset = 0;
  for (const id of left) {
    if (id === columnId) break;
    const col = table.getColumn(id);
    if (col) offset += col.getSize();
  }
  return offset;
}

export function getRightPinOffset<TData>(table: Table<TData>, columnId: string): number {
  const right = table.getState().columnPinning.right ?? [];
  let offset = 0;
  for (let i = right.length - 1; i >= 0; i--) {
    if (right[i] === columnId) break;
    const col = table.getColumn(right[i]!);
    if (col) offset += col.getSize();
  }
  return offset;
}

// ─── Text measurement helper ────────────────────────────────────────
function measureText(el: Element, container: Element): number {
  const text = (el.textContent || '').trim();
  if (!text) return 0;
  const m = document.createElement('span');
  m.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;font:inherit;font-size:inherit;pointer-events:none;';
  m.textContent = text;
  container.appendChild(m);
  const w = m.offsetWidth;
  container.removeChild(m);
  return w;
}

// ─── Auto-size (used by double-click on resize handle) ──────────────
export function autoSizeColumn(
  header: Header<any, unknown>,
  resizeRef: React.RefObject<HTMLDivElement | null>,
  mode: 'header' | 'content'
) {
  const column = header.column;
  const headerEl = resizeRef.current?.closest('th');
  const tableEl = headerEl?.closest('table');
  if (!tableEl || !headerEl) { column.resetSize(); return; }

  const colIndex = Array.from(headerEl.parentElement!.children).indexOf(headerEl);
  const rows = tableEl.querySelectorAll('tbody tr');

  let headerWidth = 40;
  headerEl.querySelectorAll('span').forEach((s) => {
    const w = measureText(s, headerEl);
    if (w > 0) headerWidth = Math.max(headerWidth, w + 24);
  });

  const table = header.getContext().table;

  if (mode === 'header') {
    table.setColumnSizing((old: any) => ({ ...old, [column.id]: headerWidth }));
    return;
  }

  let maxWidth = headerWidth;
  rows.forEach((row) => {
    const cell = row.children[colIndex] as HTMLElement | undefined;
    if (cell) {
      const content = cell.querySelector('span') || cell;
      const w = measureText(content, cell);
      if (w > 0) maxWidth = Math.max(maxWidth, w + 20);
    }
  });

  table.setColumnSizing((old: any) => ({ ...old, [column.id]: maxWidth }));
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
  const table = header.getContext().table;
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

  // Compute text alignment from alignment prop or cellStyle (without calling cellStyle with empty args)
  const textAlign = useMemo(() => {
    if (alignment) return alignment;
    if (meta?.cellStyle && typeof meta.cellStyle !== 'function') {
      return meta.cellStyle?.textAlign;
    }
    return undefined;
  }, [alignment, meta?.cellStyle]);

  // Compute pinning offset
  const pinStyle = useMemo(() => {
    if (isPinned === 'left') return { left: getLeftPinOffset(table, column.id) };
    if (isPinned === 'right') return { right: getRightPinOffset(table, column.id) };
    return {};
  }, [isPinned, table, column.id]);

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
        isGrouped && 'bg-grid-accent-light'
      )}
      style={{
        width: header.getSize(),
        textAlign,
        ...pinStyle,
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

        <span className="flex-1 truncate">
          {header.isPlaceholder
            ? null
            : flexRender(column.columnDef.header, header.getContext())}
        </span>

        {sortIcon && (
          <span className="ml-1 text-grid-accent text-[10px]">
            {sortIcon}
            {sortIndex !== undefined && sortIndex >= 0 && (
              <sup className="text-[8px] ml-0.5">{sortIndex + 1}</sup>
            )}
          </span>
        )}
      </div>

      {/* Resize handle — pass reference, not invocation */}
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
