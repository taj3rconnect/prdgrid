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
    <div className="jt-status-bar flex items-center gap-4 border-t border-grid-border bg-gray-50 px-3 py-1.5 text-grid-sm text-grid-text-secondary">
      <span>
        Total: <strong className="text-grid-text">{totalRows}</strong>
      </span>
      {hasFilters && (
        <span>
          Showing: <strong className="text-grid-text">{filteredRows}</strong>
        </span>
      )}
      {selectedRows > 0 && (
        <span>
          Selected: <strong className="text-grid-accent">{selectedRows}</strong>
        </span>
      )}
    </div>
  );
}
