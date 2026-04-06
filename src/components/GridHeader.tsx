import { useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Table, Column } from '@tanstack/react-table';
import { HeaderCell } from './HeaderCell';
import { HeaderContextMenu } from './HeaderContextMenu';
import { reorderColumn } from '../core/gridUtils';

interface GridHeaderProps<TData> {
  table: Table<TData>;
  showSelectionColumn: boolean;
  columnAlignment?: Record<string, 'left' | 'center' | 'right'>;
}

export function GridHeader<TData>({ table, showSelectionColumn, columnAlignment }: GridHeaderProps<TData>) {
  const [dragColumnId, setDragColumnId] = useState<string | null>(null);
  const [dropColumnId, setDropColumnId] = useState<string | null>(null);
  const theadRef = useRef<HTMLTableSectionElement>(null);

  // Context menu state
  const [ctxColumn, setCtxColumn] = useState<Column<TData, unknown> | null>(null);
  const [ctxPosition, setCtxPosition] = useState<{ x: number; y: number } | null>(null);

  const handleDragStart = useCallback((columnId: string) => {
    setDragColumnId(columnId);
  }, []);

  const handleDragOver = useCallback((columnId: string) => {
    setDropColumnId(columnId);
  }, []);

  const handleDragEnd = useCallback(() => {
    if (dragColumnId && dropColumnId && dragColumnId !== dropColumnId) {
      reorderColumn(table, dragColumnId, dropColumnId);
    }
    setDragColumnId(null);
    setDropColumnId(null);
  }, [dragColumnId, dropColumnId, table]);

  const handleContextMenu = useCallback((column: Column<TData, unknown>, e: React.MouseEvent) => {
    e.preventDefault();
    setCtxColumn(column);
    setCtxPosition({ x: e.clientX, y: e.clientY });
  }, []);

  const handleCloseContextMenu = useCallback(() => {
    setCtxColumn(null);
    setCtxPosition(null);
  }, []);

  // Auto-size helpers that measure DOM directly
  const autoSize = useCallback((mode: 'header' | 'content') => {
    if (!ctxColumn || !theadRef.current) return;
    const tableEl = theadRef.current.closest('table');
    if (!tableEl) return;

    // Find the th index for this column
    const allHeaders = theadRef.current.querySelectorAll('th');
    let colIndex = -1;
    allHeaders.forEach((th, i) => {
      if (th.classList.contains('jt-header-cell')) {
        const span = th.querySelector('span');
        const header = typeof ctxColumn.columnDef.header === 'string' ? ctxColumn.columnDef.header : ctxColumn.id;
        if (span && span.textContent?.trim() === header) {
          colIndex = i;
        }
      }
    });
    // Fallback: find by visible column order
    if (colIndex === -1) {
      const visibleCols = table.getVisibleLeafColumns();
      const visIdx = visibleCols.findIndex((c) => c.id === ctxColumn.id);
      if (visIdx !== -1) {
        colIndex = visIdx + (showSelectionColumn ? 1 : 0);
      }
    }
    if (colIndex === -1) return;

    const headerTh = allHeaders[colIndex];

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

    // Measure header text — find any span inside the header cell
    const headerSpans = headerTh?.querySelectorAll('span');
    let headerWidth = 40;
    if (headerSpans) {
      headerSpans.forEach((s) => {
        const w = measureText(s, headerTh!);
        if (w > 0) headerWidth = Math.max(headerWidth, w + 24);
      });
    }

    if (mode === 'header') {
      table.setColumnSizing((prev) => ({ ...prev, [ctxColumn.id]: headerWidth }));
      return;
    }

    // Fit to content: find widest trimmed cell content
    const rows = tableEl.querySelectorAll('tbody tr');
    let maxWidth = headerWidth;
    rows.forEach((row) => {
      const cell = row.children[colIndex] as HTMLElement | undefined;
      if (cell) {
        const content = cell.querySelector('span') || cell;
        const w = measureText(content, cell);
        if (w > 0) maxWidth = Math.max(maxWidth, w + 20);
      }
    });

    table.setColumnSizing((prev) => ({ ...prev, [ctxColumn.id]: maxWidth }));
  }, [ctxColumn, table, showSelectionColumn]);

  const handleFitToHeader = useCallback(() => autoSize('header'), [autoSize]);
  const handleFitToContent = useCallback(() => autoSize('content'), [autoSize]);

  return (
    <>
      <thead ref={theadRef} className="jt-header sticky top-0 z-20">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id} className="border-b-2 border-grid-border">
            {showSelectionColumn && (
              <th className="w-10 border-r border-grid-border bg-grid-header-bg px-2 py-2 text-center">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded border-gray-300 text-grid-accent focus:ring-grid-accent"
                  checked={table.getIsAllRowsSelected()}
                  ref={(input) => {
                    if (input) {
                      input.indeterminate = table.getIsSomeRowsSelected();
                    }
                  }}
                  onChange={table.getToggleAllRowsSelectedHandler()}
                />
              </th>
            )}

            {headerGroup.headers.map((header) => (
              <HeaderCell
                key={header.id}
                header={header}
                alignment={columnAlignment?.[header.column.id]}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
                onContextMenu={handleContextMenu}
              />
            ))}
          </tr>
        ))}
      </thead>

      {createPortal(
        <HeaderContextMenu
          column={ctxColumn}
          position={ctxPosition}
          onClose={handleCloseContextMenu}
          onFitToHeader={handleFitToHeader}
          onFitToContent={handleFitToContent}
        />,
        document.body
      )}
    </>
  );
}
