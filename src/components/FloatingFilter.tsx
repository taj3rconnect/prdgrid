import { useState } from 'react';
import { Table, Header } from '@tanstack/react-table';
import { clsx } from 'clsx';

interface FloatingFilterProps<TData> {
  table: Table<TData>;
  showSelectionColumn: boolean;
}

export function FloatingFilter<TData>({ table, showSelectionColumn }: FloatingFilterProps<TData>) {
  return (
    <thead className="jt-floating-filters">
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={`ff-${headerGroup.id}`} className="border-b border-grid-border bg-white">
          {showSelectionColumn && (
            <th className="w-10 border-r border-grid-border px-1 py-1" />
          )}
          {headerGroup.headers.map((header) => (
            <FloatingFilterCell key={header.id} header={header} />
          ))}
        </tr>
      ))}
    </thead>
  );
}

function FloatingFilterCell<TData>({ header }: { header: Header<TData, unknown> }) {
  const column = header.column;
  const meta = column.columnDef.meta as any;
  const filterType = meta?.filterType;
  const canFilter = column.getCanFilter() && filterType;
  const filterValue = column.getFilterValue();

  if (!canFilter || header.isPlaceholder) {
    return <th className="border-r border-grid-border px-1 py-1" style={{ width: header.getSize() }} />;
  }

  if (filterType === 'number') {
    return (
      <th className="border-r border-grid-border px-1 py-1" style={{ width: header.getSize() }}>
        <input
          type="number"
          className="w-full rounded border border-gray-300 px-1.5 py-0.5 text-xs focus:border-grid-accent focus:outline-none"
          placeholder="Filter..."
          value={(filterValue as string) ?? ''}
          onChange={(e) => column.setFilterValue(e.target.value ? Number(e.target.value) : undefined)}
        />
      </th>
    );
  }

  if (filterType === 'date') {
    return (
      <th className="border-r border-grid-border px-1 py-1" style={{ width: header.getSize() }}>
        <input
          type="date"
          className="w-full rounded border border-gray-300 px-1.5 py-0.5 text-xs focus:border-grid-accent focus:outline-none"
          value={(filterValue as string) ?? ''}
          onChange={(e) => column.setFilterValue(e.target.value || undefined)}
        />
      </th>
    );
  }

  if (filterType === 'set') {
    return (
      <th className="border-r border-grid-border px-1 py-1" style={{ width: header.getSize() }}>
        <SetFilterDropdown column={column} />
      </th>
    );
  }

  // Default: text filter
  return (
    <th className="border-r border-grid-border px-1 py-1" style={{ width: header.getSize() }}>
      <input
        type="text"
        className="w-full rounded border border-gray-300 px-1.5 py-0.5 text-xs focus:border-grid-accent focus:outline-none"
        placeholder="Filter..."
        value={(filterValue as string) ?? ''}
        onChange={(e) => column.setFilterValue(e.target.value || undefined)}
      />
    </th>
  );
}

function SetFilterDropdown({ column }: { column: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const filterValue = (column.getFilterValue() as string[] | undefined) ?? [];

  // Get unique values from column
  const facetedValues = column.getFacetedUniqueValues?.() as Map<any, number> | undefined;
  const uniqueValues = facetedValues
    ? Array.from(facetedValues.keys()).sort()
    : [];

  const toggleValue = (val: string) => {
    const current = [...filterValue];
    const idx = current.indexOf(val);
    if (idx >= 0) {
      current.splice(idx, 1);
    } else {
      current.push(val);
    }
    column.setFilterValue(current.length > 0 ? current : undefined);
  };

  return (
    <div className="relative">
      <button
        className={clsx(
          'w-full rounded border px-1.5 py-0.5 text-left text-xs',
          filterValue.length > 0
            ? 'border-grid-accent text-grid-accent bg-grid-accent-light'
            : 'border-gray-300 text-gray-500'
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {filterValue.length > 0 ? `${filterValue.length} selected` : 'All'}
      </button>
      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1 max-h-48 w-48 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
          <div className="border-b border-gray-100 px-2 py-1">
            <button
              className="text-xs text-grid-accent hover:underline"
              onClick={() => column.setFilterValue(undefined)}
            >
              Clear all
            </button>
          </div>
          {uniqueValues.map((val) => (
            <label
              key={String(val)}
              className="flex items-center gap-2 px-2 py-1 text-xs hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                className="h-3 w-3 rounded border-gray-300 text-grid-accent"
                checked={filterValue.includes(String(val))}
                onChange={() => toggleValue(String(val))}
              />
              <span className="truncate">{String(val)}</span>
              {facetedValues && (
                <span className="ml-auto text-gray-400">{facetedValues.get(val)}</span>
              )}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
