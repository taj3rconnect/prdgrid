import { useState, useRef, useEffect } from 'react';
import { Table, SortingState, ColumnSort } from '@tanstack/react-table';
import { clsx } from 'clsx';

interface SortPanelProps<TData> {
  table: Table<TData>;
  sorting: SortingState;
  onSortingChange: (sorting: SortingState) => void;
}

export function SortPanel<TData>({ table, sorting, onSortingChange }: SortPanelProps<TData>) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const sortableColumns = table
    .getAllLeafColumns()
    .filter((c) => c.getCanSort())
    .map((c) => ({
      id: c.id,
      name: (typeof c.columnDef.header === 'string' ? c.columnDef.header : c.id) as string,
    }));

  const usedIds = new Set(sorting.map((s) => s.id));
  const availableColumns = sortableColumns.filter((c) => !usedIds.has(c.id));

  const addSort = () => {
    if (availableColumns.length === 0) return;
    const first = availableColumns[0]!;
    onSortingChange([...sorting, { id: first.id, desc: false }]);
  };

  const removeSort = (index: number) => {
    const next: ColumnSort[] = [...sorting];
    next.splice(index, 1);
    onSortingChange(next);
  };

  const updateSortColumn = (index: number, colId: string) => {
    const next: ColumnSort[] = sorting.map((s, i) =>
      i === index ? { id: colId, desc: s.desc } : s
    );
    onSortingChange(next);
  };

  const toggleDirection = (index: number) => {
    const next: ColumnSort[] = sorting.map((s, i) =>
      i === index ? { id: s.id, desc: !s.desc } : s
    );
    onSortingChange(next);
  };

  const moveSort = (index: number, direction: -1 | 1) => {
    const next: ColumnSort[] = [...sorting];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    const a = next[index]!;
    const b = next[target]!;
    next[index] = b;
    next[target] = a;
    onSortingChange(next);
  };

  const clearAll = () => onSortingChange([]);

  return (
    <div ref={panelRef} className="relative">
      <button
        className={clsx(
          'rounded px-2 py-1 text-grid-sm hover:bg-gray-100',
          sorting.length > 0
            ? 'text-grid-accent font-medium'
            : 'text-grid-text-secondary hover:text-grid-text'
        )}
        onClick={() => setIsOpen(!isOpen)}
        title="Multi-column sort"
      >
        <span className="flex items-center gap-1">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          </svg>
          {sorting.length > 0 && (
            <span className="inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-grid-accent text-[10px] text-white px-1">
              {sorting.length}
            </span>
          )}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 z-50 w-80 rounded-md border border-gray-200 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2">
            <span className="text-xs font-semibold text-grid-text">Sort</span>
            {sorting.length > 0 && (
              <button
                className="text-xs text-grid-accent hover:underline"
                onClick={clearAll}
              >
                Clear all
              </button>
            )}
          </div>

          <div className="max-h-64 overflow-y-auto p-2 space-y-1">
            {sorting.length === 0 && (
              <div className="py-3 text-center text-xs text-gray-400">
                No sort applied. Click + to add.
              </div>
            )}

            {sorting.map((s, i) => {
              // Available for this row = unused + current
              const rowOptions = sortableColumns.filter(
                (c) => c.id === s.id || !usedIds.has(c.id)
              );

              return (
                <div
                  key={`${s.id}-${i}`}
                  className="flex items-center gap-1.5 rounded bg-gray-50 px-2 py-1.5"
                >
                  {/* Priority */}
                  <span className="text-[10px] text-gray-400 w-3 text-center">{i + 1}</span>

                  {/* Move arrows */}
                  <div className="flex flex-col gap-0">
                    <button
                      className="text-gray-400 hover:text-gray-600 leading-none text-[10px] disabled:opacity-30"
                      onClick={() => moveSort(i, -1)}
                      disabled={i === 0}
                    >
                      ▲
                    </button>
                    <button
                      className="text-gray-400 hover:text-gray-600 leading-none text-[10px] disabled:opacity-30"
                      onClick={() => moveSort(i, 1)}
                      disabled={i === sorting.length - 1}
                    >
                      ▼
                    </button>
                  </div>

                  {/* Column select */}
                  <select
                    className="flex-1 rounded border border-gray-200 bg-white px-1.5 py-0.5 text-xs text-grid-text"
                    value={s.id}
                    onChange={(e) => updateSortColumn(i, e.target.value)}
                  >
                    {rowOptions.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>

                  {/* Direction toggle */}
                  <button
                    className={clsx(
                      'rounded border px-2 py-0.5 text-xs font-medium',
                      s.desc
                        ? 'border-red-200 bg-red-50 text-red-600'
                        : 'border-blue-200 bg-blue-50 text-blue-600'
                    )}
                    onClick={() => toggleDirection(i)}
                    title={s.desc ? 'Descending' : 'Ascending'}
                  >
                    {s.desc ? 'DESC' : 'ASC'}
                  </button>

                  {/* Remove */}
                  <button
                    className="text-gray-400 hover:text-red-500 text-sm leading-none"
                    onClick={() => removeSort(i)}
                    title="Remove sort"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>

          {/* Add sort */}
          {availableColumns.length > 0 && (
            <div className="border-t border-gray-100 px-3 py-2">
              <button
                className="flex items-center gap-1 text-xs text-grid-accent hover:underline"
                onClick={addSort}
              >
                <span className="text-sm leading-none">+</span> Add sort level
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
