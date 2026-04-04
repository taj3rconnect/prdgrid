import { Table } from '@tanstack/react-table';
import { clsx } from 'clsx';

interface PaginationProps<TData> {
  table: Table<TData>;
  pageSizeOptions: number[];
}

export function Pagination<TData>({ table, pageSizeOptions }: PaginationProps<TData>) {
  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const totalRows = table.getFilteredRowModel().rows.length;

  const startRow = currentPage * pageSize + 1;
  const endRow = Math.min((currentPage + 1) * pageSize, totalRows);

  return (
    <div className="jt-pagination flex items-center justify-between border-t border-grid-border bg-grid-bg px-3 py-2">
      {/* Page size selector */}
      <div className="flex items-center gap-2 text-grid-sm text-grid-text-secondary">
        <span>Rows per page:</span>
        <select
          className="rounded border border-gray-300 bg-white px-2 py-0.5 text-grid-sm text-grid-text focus:border-grid-accent focus:outline-none"
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
      <span className="text-grid-sm text-grid-text-secondary">
        {startRow}-{endRow} of {totalRows}
      </span>

      {/* Navigation */}
      <div className="flex items-center gap-1">
        <button
          className={clsx(
            'rounded px-2 py-1 text-grid-sm',
            table.getCanPreviousPage()
              ? 'text-grid-text hover:bg-gray-100'
              : 'text-gray-300 cursor-not-allowed'
          )}
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          title="First page"
        >
          &#171;
        </button>
        <button
          className={clsx(
            'rounded px-2 py-1 text-grid-sm',
            table.getCanPreviousPage()
              ? 'text-grid-text hover:bg-gray-100'
              : 'text-gray-300 cursor-not-allowed'
          )}
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          title="Previous page"
        >
          &#8249;
        </button>

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
          return (
            <button
              key={pageNum}
              className={clsx(
                'min-w-[28px] rounded px-1.5 py-1 text-grid-sm',
                pageNum === currentPage
                  ? 'bg-grid-accent text-white font-medium'
                  : 'text-grid-text hover:bg-gray-100'
              )}
              onClick={() => table.setPageIndex(pageNum)}
            >
              {pageNum + 1}
            </button>
          );
        })}

        <button
          className={clsx(
            'rounded px-2 py-1 text-grid-sm',
            table.getCanNextPage()
              ? 'text-grid-text hover:bg-gray-100'
              : 'text-gray-300 cursor-not-allowed'
          )}
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          title="Next page"
        >
          &#8250;
        </button>
        <button
          className={clsx(
            'rounded px-2 py-1 text-grid-sm',
            table.getCanNextPage()
              ? 'text-grid-text hover:bg-gray-100'
              : 'text-gray-300 cursor-not-allowed'
          )}
          onClick={() => table.setPageIndex(pageCount - 1)}
          disabled={!table.getCanNextPage()}
          title="Last page"
        >
          &#187;
        </button>
      </div>
    </div>
  );
}
