import { useState, useCallback } from 'react';
import { Table } from '@tanstack/react-table';
import { HeaderCell } from './HeaderCell';
import { reorderColumn } from '../core/gridUtils';
import { SELECT_COLUMN_ID } from '../core/useGridEngine';

interface GridHeaderProps<TData> {
  table: Table<TData>;
  columnAlignment?: Record<string, 'left' | 'center' | 'right'>;
  onHeaderContextMenu?: (columnId: string, x: number, y: number) => void;
}

export function GridHeader<TData>({ table, columnAlignment, onHeaderContextMenu }: GridHeaderProps<TData>) {
  const [dragColumnId, setDragColumnId] = useState<string | null>(null);
  const [dropColumnId, setDropColumnId] = useState<string | null>(null);

  const handleDragStart = useCallback((columnId: string) => {
    setDragColumnId(columnId);
  }, []);

  const handleDragOver = useCallback((columnId: string) => {
    setDropColumnId(columnId);
  }, []);

  const handleDragEnd = useCallback(() => {
    if (dragColumnId && dropColumnId && dragColumnId !== dropColumnId && dropColumnId !== SELECT_COLUMN_ID) {
      reorderColumn(table, dragColumnId, dropColumnId);
    }
    setDragColumnId(null);
    setDropColumnId(null);
  }, [dragColumnId, dropColumnId, table]);

  return (
    <thead className="jt-header sticky top-0 z-20">
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            if (header.column.id === SELECT_COLUMN_ID) {
              return (
                <th
                  key={header.id}
                  className="jt-header-cell jt-cell-pinned sticky left-0 z-10 !p-0 text-center"
                  style={{ width: header.getSize() }}
                >
                  <input
                    type="checkbox"
                    className="h-[15px] w-[15px] rounded accent-[var(--jt-grid-accent)] align-middle cursor-pointer"
                    checked={table.getIsAllRowsSelected()}
                    ref={(input) => {
                      if (input) {
                        input.indeterminate = table.getIsSomeRowsSelected();
                      }
                    }}
                    onChange={table.getToggleAllRowsSelectedHandler()}
                  />
                </th>
              );
            }
            return (
              <HeaderCell
                key={header.id}
                header={header}
                alignment={columnAlignment?.[header.column.id]}
                isDragTarget={dropColumnId === header.column.id && dragColumnId !== null && dragColumnId !== header.column.id}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
                onHeaderContextMenu={onHeaderContextMenu}
              />
            );
          })}
        </tr>
      ))}
    </thead>
  );
}
