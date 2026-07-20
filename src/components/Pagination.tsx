import { Table } from '@tanstack/react-table';
import { clsx } from 'clsx';

interface PaginationProps<TData> {
  table: Table<TData>;
  pageSizeOptions: number[];
}

function NavButton({ disabled, onClick, title, children }: { disabled: boolean; onClick: () => void; title: string; children: React.ReactNode }) {
  return (
    <button
      className={clsx('flex h-[26px] min-w-[26px] items-center justify-center rounded-md px-1 text-grid-sm transition-colors duration-100', !disabled && 'text-grid-text hover:bg-grid-row-hover')}
      style={disabled ? { color: 'var(--jt-grid-border-strong)', cursor: 'default' } : undefined}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {children}
    </button>
  );
}

export function Pagination<TData>({ table, pageSizeOptions }: PaginationProps<TData>) {
  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const totalRows = table.getFilteredRowModel().rows.length;

  const startRow = totalRows === 0 ? 0 : currentPage * pageSize + 1;
  const endRow = Math.min((currentPage + 1) * pageSize, totalRows);

  return (
    <div
      className="jt-pagination flex h-9 items-center justify-between px-2.5"
      style={{ backgroundColor: 'var(--jt-grid-toolbar-bg)', borderTop: '1px solid var(--jt-grid-border)' }}
    >
      {/* Page size selector */}
      <div className="flex items-center gap-2 text-grid-sm text-grid-text-secondary">
        <span>Rows per page:</span>
        <select
          className="jt-input h-6 px-1.5 text-grid-sm"
          value={pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {/* Row range */}
      <span className="text-grid-sm text-grid-text-secondary tabular-nums">
        {startRow.toLocaleString()}-{endRow.toLocaleString()} of {totalRows.toLocaleString()}
      </span>

      {/* Navigation */}
      <div className="flex items-center gap-0.5">
        <NavButton disabled={!table.getCanPreviousPage()} onClick={() => table.setPageIndex(0)} title="First page">&#171;</NavButton>
        <NavButton disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()} title="Previous page">&#8249;</NavButton>

        {/* Page numbers */}
        {Array.from({ length: Math.min(pageCount, 7) }, (_, i) => {
          let pageNum: number;
          if (pageCount <= 7) {
            pageNum = i;
          } else if (currentPage < 3) {
            pageNum = i;
          } else if (currentPage > pageCount - 4) {
            pageNum = pageCount - 7 + i;
          } else {
            pageNum = currentPage - 3 + i;
          }
          const active = pageNum === currentPage;
          return (
            <button
              key={pageNum}
              className={clsx('h-[26px] min-w-[26px] rounded-md px-1 text-grid-sm tabular-nums transition-colors duration-100', !active && 'text-grid-text hover:bg-grid-row-hover')}
              style={active ? { backgroundColor: 'var(--jt-grid-accent-light)', color: 'var(--jt-grid-accent)', fontWeight: 600 } : undefined}
              onClick={() => table.setPageIndex(pageNum)}
            >
              {pageNum + 1}
            </button>
          );
        })}

        <NavButton disabled={!table.getCanNextPage()} onClick={() => table.nextPage()} title="Next page">&#8250;</NavButton>
        <NavButton disabled={!table.getCanNextPage()} onClick={() => table.setPageIndex(pageCount - 1)} title="Last page">&#187;</NavButton>
      </div>
    </div>
  );
}
