import { useState } from 'react';
import { Table, Header } from '@tanstack/react-table';
import { clsx } from 'clsx';

interface FloatingFilterProps<TData> {
  table: Table<TData>;
}

export function FloatingFilter<TData>({ table }: FloatingFilterProps<TData>) {
  return (
    <thead className="jt-floating-filters">
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={`ff-${headerGroup.id}`}>
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
    return <th style={{ width: header.getSize() }} />;
  }

  if (filterType === 'number') {
    return (
      <th style={{ width: header.getSize() }}>
        <input
          type="number"
          className="jt-input w-full px-1.5 py-0.5 text-xs"
          placeholder="Filter..."
          value={(filterValue as string) ?? ''}
          onChange={(e) => column.setFilterValue(e.target.value ? Number(e.target.value) : undefined)}
        />
      </th>
    );
  }

  if (filterType === 'date') {
    return (
      <th style={{ width: header.getSize() }}>
        <input
          type="date"
          className="jt-input w-full px-1.5 py-0.5 text-xs"
          value={(filterValue as string) ?? ''}
          onChange={(e) => column.setFilterValue(e.target.value || undefined)}
        />
      </th>
    );
  }

  if (filterType === 'set') {
    return (
      <th style={{ width: header.getSize() }}>
        <SetFilterDropdown column={column} />
      </th>
    );
  }

  // Default: text filter
  return (
    <th style={{ width: header.getSize() }}>
      <input
        type="text"
        className="jt-input w-full px-1.5 py-0.5 text-xs"
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
          'w-full rounded-md border px-1.5 py-0.5 text-left text-xs',
          filterValue.length > 0
            ? 'border-grid-accent text-grid-accent bg-grid-accent-light'
            : 'jt-input text-grid-text-secondary'
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {filterValue.length > 0 ? `${filterValue.length} selected` : 'All'}
      </button>
      {isOpen && (
        <div className="jt-menu absolute left-0 top-full z-50 mt-1 max-h-48 w-48 overflow-y-auto">
          <div className="px-2 py-1" style={{ borderBottom: '1px solid var(--jt-grid-border)' }}>
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
              className="jt-menu-item !h-6 cursor-pointer text-xs"
            >
              <input
                type="checkbox"
                className="h-3 w-3 rounded accent-[var(--jt-grid-accent)]"
                checked={filterValue.includes(String(val))}
                onChange={() => toggleValue(String(val))}
              />
              <span className="truncate">{String(val)}</span>
              {facetedValues && (
                <span className="ml-auto text-grid-text-secondary">{facetedValues.get(val)}</span>
              )}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
