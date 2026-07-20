import { Table } from '@tanstack/react-table';

interface StatusBarProps<TData> {
  table: Table<TData>;
}

export function StatusBar<TData>({ table }: StatusBarProps<TData>) {
  const totalRows = table.getPreFilteredRowModel().rows.length;
  const filteredRows = table.getFilteredRowModel().rows.length;
  const selectedRows = table.getSelectedRowModel().rows.length;
  const hasFilters = totalRows !== filteredRows;

  return (
    <div
      className="jt-status-bar flex items-center gap-4 px-3 py-1.5 text-grid-sm text-grid-text-secondary tabular-nums"
      style={{ backgroundColor: 'var(--jt-grid-header-bg)', borderTop: '1px solid var(--jt-grid-border)' }}
    >
      <span>
        Total: <strong className="text-grid-text">{totalRows.toLocaleString()}</strong>
      </span>
      {hasFilters && (
        <span>
          Showing: <strong className="text-grid-text">{filteredRows.toLocaleString()}</strong>
        </span>
      )}
      {selectedRows > 0 && (
        <span>
          Selected: <strong className="text-grid-accent">{selectedRows.toLocaleString()}</strong>
        </span>
      )}
    </div>
  );
}
