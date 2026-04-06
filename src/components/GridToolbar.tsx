import { useState, useRef, useEffect } from 'react';
import { Table, SortingState, ColumnFiltersState } from '@tanstack/react-table';
import { clsx } from 'clsx';
import type { ToolbarConfig, GridDensity, ExportToolbarConfig } from '../types';
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
  onExportCsv?: () => void;
  onExportExcel?: () => void;
  onExportImage?: () => void;
  onExportEmail?: () => void;
  onExportSchedule?: () => void;
  columnPresets?: { label: string; columns: string[] }[];
  activePreset?: string | null;
  onPresetChange?: (preset: string | null) => void;
  showFloatingFilters?: boolean;
  onToggleFloatingFilters?: () => void;
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
  onExportCsv,
  onExportExcel,
  onExportImage,
  onExportEmail,
  onExportSchedule,
  columnPresets,
  activePreset,
  onPresetChange,
  showFloatingFilters,
  onToggleFloatingFilters,
}: GridToolbarProps<TData>) {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showDensityMenu, setShowDensityMenu] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);
  const densityRef = useRef<HTMLDivElement>(null);

  const exportConfig: ExportToolbarConfig =
    typeof config.export === 'object' ? config.export : {};

  // Close dropdowns on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setShowExportMenu(false);
      }
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
    <div className="jt-toolbar flex items-center gap-2 border-b border-grid-border bg-grid-bg px-3 py-2">
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
            'rounded px-2 py-1 text-grid-sm hover:bg-gray-100',
            showFloatingFilters
              ? 'text-grid-accent font-medium'
              : 'text-grid-text-secondary hover:text-grid-text'
          )}
          onClick={onToggleFloatingFilters}
          title={showFloatingFilters ? 'Hide column filters' : 'Show column filters'}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" d="M3 5h18M3 10h18M3 15h18M3 20h18" />
            <rect x="13" y="12" width="9" height="7" rx="1" fill="currentColor" stroke="currentColor" strokeWidth={1.5} opacity={showFloatingFilters ? 1 : 0.4} />
            <path d="M15.5 14v1.5l1 1v1m3-3.5v1.5l-1 1v1" stroke={showFloatingFilters ? 'white' : 'currentColor'} strokeWidth={1.2} strokeLinecap="round" />
          </svg>
        </button>
      )}

      {/* Reset button */}
      <button
        className="rounded px-2 py-1 text-grid-sm text-grid-text-secondary hover:bg-gray-100 hover:text-grid-text"
        onClick={onResetState}
        title="Reset all settings"
      >
        Reset
      </button>

      {/* Column Manager */}
      {config.columnManager && (
        <button
          className="rounded px-2 py-1 text-grid-sm text-grid-text-secondary hover:bg-gray-100 hover:text-grid-text"
          onClick={onToggleColumnManager}
          title="Manage columns"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
          </svg>
        </button>
      )}

      {/* Density */}
      {config.density && (
        <div ref={densityRef} className="relative">
          <button
            className="rounded px-2 py-1 text-grid-sm text-grid-text-secondary hover:bg-gray-100 hover:text-grid-text"
            onClick={() => setShowDensityMenu(!showDensityMenu)}
            title="Row density"
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

      {/* Export */}
      {config.export && (
        <div ref={exportRef} className="relative">
          <button
            className="rounded px-2 py-1 text-grid-sm text-grid-text-secondary hover:bg-gray-100 hover:text-grid-text"
            onClick={() => setShowExportMenu(!showExportMenu)}
            title="Export"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
          {showExportMenu && (
            <div className="absolute right-0 top-full mt-1 z-50 min-w-[180px] rounded-md border border-gray-200 bg-white py-1 shadow-lg">
              {(exportConfig.csv !== false) && (
                <button
                  className="flex w-full items-center gap-2 px-4 py-1.5 text-left text-grid-sm text-grid-text hover:bg-gray-50"
                  onClick={() => { onExportCsv?.(); setShowExportMenu(false); }}
                >
                  <span>📄</span> Download CSV
                </button>
              )}
              {exportConfig.excel && (
                <button
                  className="flex w-full items-center gap-2 px-4 py-1.5 text-left text-grid-sm text-grid-text hover:bg-gray-50"
                  onClick={() => { onExportExcel?.(); setShowExportMenu(false); }}
                >
                  <span>📊</span> Download Excel
                </button>
              )}
              {exportConfig.psd && (
                <button
                  className="flex w-full items-center gap-2 px-4 py-1.5 text-left text-grid-sm text-grid-text hover:bg-gray-50"
                  onClick={() => { onExportImage?.(); setShowExportMenu(false); }}
                >
                  <span>🖼️</span> Export as Image
                </button>
              )}
              {exportConfig.email && (
                <hr className="my-1 border-gray-200" />
              )}
              {exportConfig.email && (
                <button
                  className="flex w-full items-center gap-2 px-4 py-1.5 text-left text-grid-sm text-grid-text hover:bg-gray-50"
                  onClick={() => { onExportEmail?.(); setShowExportMenu(false); }}
                >
                  <span>📧</span> Email Report
                </button>
              )}
              {exportConfig.scheduleEmail && (
                <button
                  className="flex w-full items-center gap-2 px-4 py-1.5 text-left text-grid-sm text-grid-text hover:bg-gray-50"
                  onClick={() => { onExportSchedule?.(); setShowExportMenu(false); }}
                >
                  <span>🕐</span> Schedule Email
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
