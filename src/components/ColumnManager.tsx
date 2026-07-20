import { useState } from 'react';
import { Table } from '@tanstack/react-table';
import { clsx } from 'clsx';
import { reorderColumn, getColumnHeader } from '../core/gridUtils';
import { FieldTypeIcon } from './renderers';
import type { ColumnMeta } from '../types';

type Alignment = 'left' | 'center' | 'right';

interface ColumnManagerProps<TData> {
  table: Table<TData>;
  isOpen: boolean;
  onClose: () => void;
  columnAlignment: Record<string, Alignment>;
  onColumnAlignmentChange: (colId: string, align: Alignment) => void;
  columnDecimals: Record<string, number>;
  onColumnDecimalsChange: (colId: string, decimals: number) => void;
}

const decimalOptions = [0, 1, 2, 3, 4];

const alignOptions: { value: Alignment; title: string }[] = [
  { value: 'left', title: 'Align left' },
  { value: 'center', title: 'Align center' },
  { value: 'right', title: 'Align right' },
];

export function ColumnManager<TData>({
  table, isOpen, onClose, columnAlignment, onColumnAlignmentChange, columnDecimals, onColumnDecimalsChange,
}: ColumnManagerProps<TData>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [dragItem, setDragItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);

  if (!isOpen) return null;

  const allColumns = table.getAllLeafColumns().filter(
    (c) => !(c.columnDef.meta as ColumnMeta | undefined)?.isSelectColumn
  );
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
    <div
      className="fixed inset-0 z-50 flex items-start justify-end"
      style={{ backgroundColor: 'rgb(16 24 40 / 0.2)' }}
      onClick={onClose}
    >
      <div
        className="mr-4 mt-12 flex max-h-[70vh] w-[320px] flex-col overflow-hidden rounded-xl"
        style={{
          backgroundColor: 'var(--jt-grid-menu-bg)',
          border: '1px solid var(--jt-grid-border)',
          boxShadow: 'var(--jt-grid-menu-shadow)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--jt-grid-border)' }}>
          <h3 className="text-grid-lg font-semibold text-grid-text">Manage Columns</h3>
          <button className="jt-btn !px-1.5" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 4l8 8M12 4l-8 8" /></svg>
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-2" style={{ borderBottom: '1px solid var(--jt-grid-border)' }}>
          <input
            type="text"
            placeholder="Search columns..."
            className="jt-input h-7 w-full px-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Toggle all */}
        <div className="flex items-center gap-2 px-4 py-2" style={{ borderBottom: '1px solid var(--jt-grid-border)' }}>
          <input
            type="checkbox"
            className="h-3.5 w-3.5 rounded accent-[var(--jt-grid-accent)]"
            checked={table.getIsAllColumnsVisible()}
            onChange={table.getToggleAllColumnsVisibilityHandler()}
          />
          <span className="text-grid-sm font-medium text-grid-text-secondary">Toggle All</span>
        </div>

        {/* Column list */}
        <div className="flex-1 overflow-y-auto px-2 py-1">
          {filteredColumns.map((column) => {
            const meta = column.columnDef.meta as ColumnMeta | undefined;
            if (meta?.colDef?.lockVisible) return null;

            const header = getColumnHeader(column);
            const currentAlign = columnAlignment[column.id] || 'left';

            return (
              <div
                key={column.id}
                className={clsx(
                  'flex h-8 cursor-grab items-center gap-2 rounded-md px-2 text-grid-base transition-colors duration-100',
                  dragOverItem === column.id && 'bg-grid-accent-light',
                  dragOverItem !== column.id && 'hover:bg-grid-row-hover'
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
                {/* Drag grip */}
                <svg width="10" height="12" viewBox="0 0 8 12" className="shrink-0" style={{ color: 'var(--jt-grid-header-icon)' }} fill="currentColor" aria-hidden>
                  <circle cx="2" cy="2" r="1" /><circle cx="6" cy="2" r="1" />
                  <circle cx="2" cy="6" r="1" /><circle cx="6" cy="6" r="1" />
                  <circle cx="2" cy="10" r="1" /><circle cx="6" cy="10" r="1" />
                </svg>

                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded accent-[var(--jt-grid-accent)]"
                  checked={column.getIsVisible()}
                  onChange={column.getToggleVisibilityHandler()}
                />
                <FieldTypeIcon dataType={meta?.dataType} />
                <span className="flex-1 truncate text-grid-text">{header}</span>

                {/* Alignment controls */}
                <div className="flex items-center overflow-hidden rounded" style={{ border: '1px solid var(--jt-grid-border)' }}>
                  {alignOptions.map((opt) => (
                    <button
                      key={opt.value}
                      className={clsx('px-1.5 py-0.5 leading-none transition-colors duration-100')}
                      style={
                        currentAlign === opt.value
                          ? { backgroundColor: 'var(--jt-grid-accent)', color: 'var(--jt-grid-accent-text)' }
                          : { color: 'var(--jt-grid-header-icon)' }
                      }
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

                {/* Decimal places (numeric columns only) */}
                {meta?.autoNumeric && (
                  <select
                    className="jt-input h-5 w-10 text-[10px]"
                    value={columnDecimals[column.id] ?? 0}
                    onChange={(e) => onColumnDecimalsChange(column.id, Number(e.target.value))}
                    title="Decimal places"
                  >
                    {decimalOptions.map((d) => (
                      <option key={d} value={d}>.{d}</option>
                    ))}
                  </select>
                )}

                {/* Pin controls */}
                <button
                  className={clsx('rounded px-1 text-xs', column.getIsPinned() === 'left' ? 'bg-grid-accent-light text-grid-accent' : 'text-grid-header-icon hover:text-grid-text')}
                  onClick={() => column.pin(column.getIsPinned() === 'left' ? false : 'left')}
                  title="Pin left"
                >
                  ◀
                </button>
                <button
                  className={clsx('rounded px-1 text-xs', column.getIsPinned() === 'right' ? 'bg-grid-accent-light text-grid-accent' : 'text-grid-header-icon hover:text-grid-text')}
                  onClick={() => column.pin(column.getIsPinned() === 'right' ? false : 'right')}
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
