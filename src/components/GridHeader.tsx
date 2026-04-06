import { useState, useCallback } from 'react';
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

  return (
    <>
      <thead className="jt-header sticky top-0 z-20">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id} className="border-b-2 border-grid-border">
            {/* Select all checkbox */}
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

      <HeaderContextMenu
        column={ctxColumn}
        position={ctxPosition}
        onClose={handleCloseContextMenu}
      />
    </>
  );
}
