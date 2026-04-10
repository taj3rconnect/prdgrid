import { useState, useRef, useEffect } from 'react';
import { Table, SortingState, ColumnFiltersState } from '@tanstack/react-table';
import { clsx } from 'clsx';
import type { ToolbarConfig, GridDensity } from '../types';
import { SortPanel } from './SortPanel';
import { FilterPanel } from './FilterPanel';

interface GridToolbarProps<TData> {
  table: Table<TData>;
  config: ToolbarConfig;
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  density: GridDensity;
  onDensityChange: (density: GridDensity) => void;
  sorting: SortingState;
  onSortingChange: (sorting: SortingState) => void;
  columnFilters: ColumnFiltersState;
  onColumnFiltersChange: (filters: ColumnFiltersState) => void;
  onResetState: () => void;
  onToggleColumnManager: () => void;
  columnPresets?: { label: string; columns: string[] }[];
  activePreset?: string | null;
  onPresetChange?: (preset: string | null) => void;
  showFloatingFilters?: boolean;
  onToggleFloatingFilters?: () => void;
  onToggleStylePanel?: () => void;
  onOpenExportModal?: () => void;
  onRefresh?: () => void | Promise<void>;
}

export function GridToolbar<TData>({
  table,
  config,
  globalFilter,
  onGlobalFilterChange,
  density,
  onDensityChange,
  sorting,
  onSortingChange,
  columnFilters,
  onColumnFiltersChange,
  onResetState,
  onToggleColumnManager,
  columnPresets,
  activePreset,
  onPresetChange,
  showFloatingFilters,
  onToggleFloatingFilters,
  onToggleStylePanel,
  onOpenExportModal,
  onRefresh,
}: GridToolbarProps<TData>) {
  const [showDensityMenu, setShowDensityMenu] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const densityRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (densityRef.current && !densityRef.current.contains(e.target as Node)) {
        setShowDensityMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const totalRows = table.getPreFilteredRowModel().rows.length;
  const filteredRows = table.getFilteredRowModel().rows.length;
  const hasFilters = totalRows !== filteredRows;

  return (
    <div className="jt-toolbar flex items-center gap-2 border-b border-grid-border bg-grid-bg px-3 py-2 overflow-x-auto">
      {/* Search */}
      {config.search && (
        <div className="relative flex-1 max-w-sm">
          <svg
            className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search all columns..."
            className="w-full rounded-md border border-gray-300 bg-white py-1.5 pl-8 pr-3 text-grid-sm text-grid-text placeholder-gray-400 focus:border-grid-accent focus:outline-none focus:ring-1 focus:ring-grid-accent"
            value={globalFilter}
            onChange={(e) => onGlobalFilterChange(e.target.value)}
          />
          {globalFilter && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => onGlobalFilterChange('')}
            >
              &times;
            </button>
          )}
        </div>
      )}

      {/* Column Presets */}
      {columnPresets && columnPresets.length > 0 && (
        <div className="flex items-center gap-1">
          <button
            className={clsx(
              'rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors',
              !activePreset
                ? 'bg-grid-accent text-white'
                : 'bg-gray-100 text-grid-text-secondary hover:bg-gray-200'
            )}
            onClick={() => onPresetChange?.(null)}
          >
            All
          </button>
          {columnPresets.map((p) => (
            <button
              key={p.label}
              className={clsx(
                'rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors',
                activePreset === p.label
                  ? 'bg-grid-accent text-white'
                  : 'bg-gray-100 text-grid-text-secondary hover:bg-gray-200'
              )}
              onClick={() => onPresetChange?.(p.label)}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}

      {/* Row count indicator */}
      <span className="text-grid-sm text-grid-text-secondary whitespace-nowrap">
        {hasFilters ? `${filteredRows} of ${totalRows}` : totalRows} rows
      </span>

      <div className="flex-1" />

      {/* Sort Panel */}
      <SortPanel
        table={table}
        sorting={sorting}
        onSortingChange={onSortingChange}
      />

      {/* Filter Panel */}
      <FilterPanel
        table={table}
        columnFilters={columnFilters}
        onColumnFiltersChange={onColumnFiltersChange}
      />

      {/* Toggle floating filters row */}
      {onToggleFloatingFilters && (
        <button
          className={clsx(
            'jt-tip shrink-0 rounded px-2 py-1 text-grid-sm hover:bg-gray-100',
            showFloatingFilters
              ? 'text-grid-accent font-medium'
              : 'text-grid-text-secondary hover:text-grid-text'
          )}
          onClick={onToggleFloatingFilters}
          data-tip={showFloatingFilters ? 'Hide column filters' : 'Show column filters'}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" d="M3 5h18M3 10h18M3 15h18M3 20h18" />
            <rect x="13" y="12" width="9" height="7" rx="1" fill="currentColor" stroke="currentColor" strokeWidth={1.5} opacity={showFloatingFilters ? 1 : 0.4} />
            <path d="M15.5 14v1.5l1 1v1m3-3.5v1.5l-1 1v1" stroke={showFloatingFilters ? 'white' : 'currentColor'} strokeWidth={1.2} strokeLinecap="round" />
          </svg>
        </button>
      )}

      {/* Divider */}
      <div className="shrink-0 h-4 w-px bg-gray-200" />

      {/* Reset button */}
      <button
        className="jt-tip shrink-0 rounded px-2 py-1 text-grid-sm text-grid-text-secondary hover:bg-gray-100 hover:text-grid-text"
        onClick={onResetState}
        data-tip="Reset grid settings"
      >
        Reset
      </button>

      {/* Column Manager */}
      {config.columnManager && (
        <button
          className="jt-tip shrink-0 rounded px-2 py-1 text-grid-sm text-grid-text-secondary hover:bg-gray-100 hover:text-grid-text"
          onClick={onToggleColumnManager}
          data-tip="Manage columns"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
          </svg>
        </button>
      )}

      {/* Style Panel */}
      {onToggleStylePanel && (
        <button
          className="jt-tip shrink-0 rounded px-2 py-1 text-grid-sm text-grid-text-secondary hover:bg-gray-100 hover:text-grid-text"
          onClick={onToggleStylePanel}
          data-tip="Style settings"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        </button>
      )}

      {/* Density */}
      {config.density && (
        <div ref={densityRef} className="relative shrink-0">
          <button
            className="jt-tip shrink-0 rounded px-2 py-1 text-grid-sm text-grid-text-secondary hover:bg-gray-100 hover:text-grid-text"
            onClick={() => setShowDensityMenu(!showDensityMenu)}
            data-tip="Row density"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {showDensityMenu && (
            <div className="absolute right-0 top-full mt-1 z-50 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
              {(['compact', 'normal', 'comfortable'] as GridDensity[]).map((d) => (
                <button
                  key={d}
                  className={clsx(
                    'block w-full px-4 py-1.5 text-left text-grid-sm capitalize',
                    density === d ? 'bg-grid-accent-light text-grid-accent font-medium' : 'text-grid-text hover:bg-gray-50'
                  )}
                  onClick={() => {
                    onDensityChange(d);
                    setShowDensityMenu(false);
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Refresh */}
      {onRefresh && (
        <button
          className="jt-tip shrink-0 rounded px-2 py-1 text-grid-sm text-grid-text-secondary hover:bg-gray-100 hover:text-grid-text disabled:opacity-40 disabled:cursor-default"
          disabled={refreshing}
          onClick={async () => {
            if (refreshing) return;
            setRefreshing(true);
            try { await onRefresh(); } finally { setRefreshing(false); }
          }}
          data-tip="Refresh data"
        >
          <svg
            className="h-4 w-4"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            style={refreshing ? { animation: 'jt-spin 0.7s linear infinite' } : undefined}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      )}

      {/* Export — opens full Export Modal */}
      {config.export && (
        <button
          className="jt-tip shrink-0 rounded px-2 py-1 text-grid-sm text-grid-text-secondary hover:bg-gray-100 hover:text-grid-text"
          onClick={onOpenExportModal}
          data-tip="Export (PDF / CSV / Excel)"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </button>
      )}
    </div>
  );
}
