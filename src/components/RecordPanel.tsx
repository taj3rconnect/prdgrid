import { useEffect, useMemo } from 'react';
import { Row, Table } from '@tanstack/react-table';
import { FieldTypeIcon, renderTypedCell, formatTypedValue } from './renderers';
import type { ColumnMeta } from '../types';

interface RecordPanelProps<TData> {
  table: Table<TData>;
  rowId: string | null;
  onClose: () => void;
  onNavigate: (rowId: string) => void;
}

export function RecordPanel<TData>({ table, rowId, onClose, onNavigate }: RecordPanelProps<TData>) {
  // Leaf rows in current sort/filter order
  const leafRows = useMemo(
    () => table.getSortedRowModel().rows.flatMap((r) => (r.getIsGrouped() ? r.getLeafRows() : [r])).filter((r) => !r.getIsGrouped()),
    [table.getSortedRowModel().rows]
  );
  const rowIndex = leafRows.findIndex((r) => r.id === rowId);
  const row: Row<TData> | undefined = rowIndex >= 0 ? leafRows[rowIndex] : undefined;

  useEffect(() => {
    if (!rowId) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowUp' && rowIndex > 0) onNavigate(leafRows[rowIndex - 1]!.id);
      if (e.key === 'ArrowDown' && rowIndex < leafRows.length - 1) onNavigate(leafRows[rowIndex + 1]!.id);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [rowId, rowIndex, leafRows, onClose, onNavigate]);

  if (!rowId || !row) return null;

  const columns = table.getAllLeafColumns().filter((c) => {
    const meta = c.columnDef.meta as ColumnMeta | undefined;
    return !meta?.isSelectColumn;
  });

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      style={{ backgroundColor: 'rgb(16 24 40 / 0.2)' }}
      onClick={onClose}
    >
      <div
        className="jt-datagrid-panel flex h-full w-[380px] flex-col overflow-hidden"
        style={{
          backgroundColor: 'var(--jt-grid-menu-bg)',
          boxShadow: 'var(--jt-grid-menu-shadow)',
          borderLeft: '1px solid var(--jt-grid-border)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-2 px-4 py-3" style={{ borderBottom: '1px solid var(--jt-grid-border)' }}>
          <h3 className="text-grid-lg font-semibold text-grid-text">
            Record {rowIndex + 1} <span className="font-normal text-grid-text-secondary">of {leafRows.length}</span>
          </h3>
          <div className="flex items-center gap-1">
            <button
              className="jt-btn !px-1.5"
              disabled={rowIndex <= 0}
              style={rowIndex <= 0 ? { opacity: 0.4, cursor: 'default' } : undefined}
              onClick={() => rowIndex > 0 && onNavigate(leafRows[rowIndex - 1]!.id)}
              title="Previous record (↑)" aria-label="Previous record"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10l4-4 4 4" /></svg>
            </button>
            <button
              className="jt-btn !px-1.5"
              disabled={rowIndex >= leafRows.length - 1}
              style={rowIndex >= leafRows.length - 1 ? { opacity: 0.4, cursor: 'default' } : undefined}
              onClick={() => rowIndex < leafRows.length - 1 && onNavigate(leafRows[rowIndex + 1]!.id)}
              title="Next record (↓)" aria-label="Next record"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6l4 4 4-4" /></svg>
            </button>
            <button className="jt-btn !px-1.5" onClick={onClose} title="Close (Esc)" aria-label="Close record panel">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 4l8 8M12 4l-8 8" /></svg>
            </button>
          </div>
        </div>

        {/* Fields — all columns, including hidden ones */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {columns.map((col) => {
            const meta = col.columnDef.meta as ColumnMeta<TData> | undefined;
            const header = typeof col.columnDef.header === 'string' ? col.columnDef.header : col.id;
            let value: any;
            try {
              value = row.getValue(col.id);
            } catch {
              value = undefined;
            }
            const formatted =
              meta?.valueFormatter && value != null
                ? meta.valueFormatter({ value, data: row.original, colDef: meta.colDef, rowIndex })
                : formatTypedValue(meta?.dataType, value) ??
                  (value == null ? '' : Array.isArray(value) ? value.join(', ') : String(value));
            const typed = meta?.dataType ? renderTypedCell(meta.dataType, value, formatted) : null;
            return (
              <div key={col.id} className="mb-3.5">
                <div className="mb-1 flex items-center gap-1.5 text-grid-sm font-medium text-grid-text-secondary">
                  <FieldTypeIcon dataType={meta?.dataType} />
                  <span className="truncate">{header}</span>
                  {!col.getIsVisible() && <span className="text-[10px] uppercase tracking-wide opacity-60">hidden</span>}
                </div>
                <div className="min-h-[20px] text-grid-base text-grid-text break-words whitespace-pre-wrap">
                  {typed ?? (formatted === '' ? <span className="text-grid-text-secondary">—</span> : formatted)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
