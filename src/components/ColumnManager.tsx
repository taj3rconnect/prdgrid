import { useState } from 'react';
import { Table } from '@tanstack/react-table';
import { clsx } from 'clsx';
import { reorderColumn, getColumnHeader } from '../core/gridUtils';

type Alignment = 'left' | 'center' | 'right';

interface ColumnManagerProps<TData> {
  table: Table<TData>;
  isOpen: boolean;
  onClose: () => void;
  columnAlignment: Record<string, Alignment>;
  onColumnAlignmentChange: (colId: string, align: Alignment) => void;
}

const alignOptions: { value: Alignment; icon: string; title: string }[] = [
  { value: 'left', icon: '≡', title: 'Align left' },
  { value: 'center', icon: '≡', title: 'Align center' },
  { value: 'right', icon: '≡', title: 'Align right' },
];

export function ColumnManager<TData>({
  table, isOpen, onClose, columnAlignment, onColumnAlignmentChange,
}: ColumnManagerProps<TData>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [dragItem, setDragItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);

  if (!isOpen) return null;

  const allColumns = table.getAllLeafColumns();
  const filteredColumns = searchTerm
    ? allColumns.filter((col) => {
        return getColumnHeader(col).toLowerCase().includes(searchTerm.toLowerCase());
      })
    : allColumns;

  const handleDragEnd = () => {
    if (dragItem && dragOverItem && dragItem !== dragOverItem) {
      reorderColumn(table, dragItem, dragOverItem);
    }
    setDragItem(null);
    setDragOverItem(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end" onClick={onClose}>
      <div
        className="mt-12 mr-4 w-80 max-h-[70vh] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <h3 className="text-sm font-semibold text-gray-900">Manage Columns</h3>
          <button
            className="text-gray-400 hover:text-gray-600"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        {/* Search */}
        <div className="border-b border-gray-200 px-4 py-2">
          <input
            type="text"
            placeholder="Search columns..."
            className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-grid-accent focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Toggle all */}
        <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-2">
          <input
            type="checkbox"
            className="h-3.5 w-3.5 rounded border-gray-300 text-grid-accent"
            checked={table.getIsAllColumnsVisible()}
            onChange={table.getToggleAllColumnsVisibilityHandler()}
          />
          <span className="text-xs font-medium text-gray-600">Toggle All</span>
        </div>

        {/* Column list */}
        <div className="flex-1 overflow-y-auto px-2 py-1">
          {filteredColumns.map((column) => {
            const meta = column.columnDef.meta as any;
            if (meta?.colDef?.lockVisible) return null;

            const header = getColumnHeader(column);
            const currentAlign = columnAlignment[column.id] || 'left';

            return (
              <div
                key={column.id}
                className={clsx(
                  'flex items-center gap-2 rounded px-2 py-1.5 text-sm',
                  dragOverItem === column.id && 'bg-grid-accent-light',
                  'hover:bg-gray-50 cursor-grab'
                )}
                draggable
                onDragStart={() => setDragItem(column.id)}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverItem(column.id);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  handleDragEnd();
                }}
                onDragEnd={handleDragEnd}
              >
                {/* Drag handle */}
                <span className="text-gray-400 text-xs cursor-grab">::</span>

                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded border-gray-300 text-grid-accent"
                  checked={column.getIsVisible()}
                  onChange={column.getToggleVisibilityHandler()}
                />
                <span className="flex-1 truncate text-grid-text">{header}</span>

                {/* Alignment controls */}
                <div className="flex items-center border border-gray-200 rounded overflow-hidden">
                  {alignOptions.map((opt) => (
                    <button
                      key={opt.value}
                      className={clsx(
                        'px-1.5 py-0.5 text-[10px] leading-none',
                        currentAlign === opt.value
                          ? 'bg-grid-accent text-white'
                          : 'text-gray-400 hover:bg-gray-100'
                      )}
                      onClick={() => onColumnAlignmentChange(column.id, opt.value)}
                      title={opt.title}
                    >
                      {opt.value === 'left' ? (
                        <svg width="10" height="10" viewBox="0 0 10 10"><rect x="0" y="1" width="10" height="1.5" fill="currentColor" rx="0.5"/><rect x="0" y="4.5" width="7" height="1.5" fill="currentColor" rx="0.5"/><rect x="0" y="8" width="9" height="1.5" fill="currentColor" rx="0.5"/></svg>
                      ) : opt.value === 'center' ? (
                        <svg width="10" height="10" viewBox="0 0 10 10"><rect x="0" y="1" width="10" height="1.5" fill="currentColor" rx="0.5"/><rect x="1.5" y="4.5" width="7" height="1.5" fill="currentColor" rx="0.5"/><rect x="0.5" y="8" width="9" height="1.5" fill="currentColor" rx="0.5"/></svg>
                      ) : (
                        <svg width="10" height="10" viewBox="0 0 10 10"><rect x="0" y="1" width="10" height="1.5" fill="currentColor" rx="0.5"/><rect x="3" y="4.5" width="7" height="1.5" fill="currentColor" rx="0.5"/><rect x="1" y="8" width="9" height="1.5" fill="currentColor" rx="0.5"/></svg>
                      )}
                    </button>
                  ))}
                </div>

                {/* Pin controls */}
                <button
                  className={clsx(
                    'text-xs px-1 rounded',
                    column.getIsPinned() === 'left'
                      ? 'text-grid-accent bg-grid-accent-light'
                      : 'text-gray-400 hover:text-gray-600'
                  )}
                  onClick={() =>
                    column.pin(column.getIsPinned() === 'left' ? false : 'left')
                  }
                  title="Pin left"
                >
                  ◀
                </button>
                <button
                  className={clsx(
                    'text-xs px-1 rounded',
                    column.getIsPinned() === 'right'
                      ? 'text-grid-accent bg-grid-accent-light'
                      : 'text-gray-400 hover:text-gray-600'
                  )}
                  onClick={() =>
                    column.pin(column.getIsPinned() === 'right' ? false : 'right')
                  }
                  title="Pin right"
                >
                  ▶
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
