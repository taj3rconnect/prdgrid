import React, { useRef, useState, useCallback, useEffect, useImperativeHandle, forwardRef, useMemo } from 'react';
import { clsx } from 'clsx';
import { useGridEngine } from '../core/useGridEngine';
import { sortingToEntries, entriesToSorting, filtersToRecord, recordToFilters, getColumnHeader } from '../core/gridUtils';
import { GridToolbar } from './GridToolbar';
import { GridHeader } from './GridHeader';
import { GridBody } from './GridBody';
import { GroupPanel } from './GroupPanel';
import { ColumnManager } from './ColumnManager';
import { StylePanel } from './StylePanel';
import { Pagination } from './Pagination';
import { StatusBar } from './StatusBar';
import { Overlay } from './Overlay';
import { TotalsRow } from './TotalsRow';
import { exportToCsv } from '../export/csvExport';
import type {
  DataGridProps,
  GridType,
  ToolbarConfig,
  GridApi,
} from '../types';

// ─── Grid Type Presets ──────────────────────────────────────────────
const REGULAR_DEFAULTS: Partial<DataGridProps<any>> = {
  pagination: true,
  paginationPageSize: 100,
  rowSelection: 'multiple',
  floatingFilters: true,
  statusBar: true,
  toolbar: true,
};

const GRID_TYPE_DEFAULTS: Record<GridType, Partial<DataGridProps<any>>> = {
  regular: REGULAR_DEFAULTS,
  normal: REGULAR_DEFAULTS,
  drilldown: {
    groupPanel: true,
    groupDefaultExpanded: 1,
    rowSelection: 'multiple',
    floatingFilters: true,
    statusBar: true,
    toolbar: true,
  },
  finance: {
    pagination: false,
    density: 'compact',
    rowSelection: false,
    floatingFilters: true,
    statusBar: true,
    toolbar: { search: true, columnManager: true, export: { csv: true, excel: true }, density: true },
  },
  editable: {
    pagination: true,
    paginationPageSize: 50,
    rowSelection: 'single',
    floatingFilters: false,
    statusBar: true,
    toolbar: { search: true, columnManager: true, export: { csv: true }, density: true },
  },
  highvol: {
    pagination: true,
    paginationPageSize: 500,
    paginationPageSizeOptions: [100, 250, 500, 1000, 5000],
    density: 'compact',
    rowSelection: 'multiple',
    floatingFilters: true,
    statusBar: true,
    toolbar: true,
  },
};

const darkThemeVars: Record<string, string> = {
  '--jt-grid-bg': '#1f2937',
  '--jt-grid-bg-alt': '#263040',
  '--jt-grid-border': '#374151',
  '--jt-grid-header-bg': '#111827',
  '--jt-grid-header-text': '#f3f4f6',
  '--jt-grid-text': '#d1d5db',
  '--jt-grid-text-secondary': '#9ca3af',
  '--jt-grid-accent': '#60a5fa',
  '--jt-grid-accent-light': '#1e3a5f',
  '--jt-grid-row-hover': '#2d3748',
  '--jt-grid-row-selected': '#1e3a5f',
  '--jt-grid-cell-edit': '#422006',
};

function DataGridInner<TData = any>(
  props: DataGridProps<TData>,
  ref: React.Ref<GridApi<TData>>
) {
  // Merge gridType preset defaults with explicit props (explicit wins)
  const { gridType = 'regular', enableRowGroup = true, ...restProps } = props;
  const preset = GRID_TYPE_DEFAULTS[gridType];
  const merged = { ...preset, ...restProps };

  // If enableRowGroup is set, force groupPanel on
  if (enableRowGroup) {
    merged.groupPanel = true;
  }

  const {
    rowSelection = false,
    pagination = false,
    paginationPageSizeOptions = [25, 50, 100, 250, 500, 1000],
    groupPanel = false,
    floatingFilters = false,
    statusBar: showStatusBar = true,
    toolbar: toolbarProp = true,
    theme = 'light',
    className,
    height = 600,
    loading = false,
    loadingComponent,
    noRowsComponent,
    noRowsMessage,
    onGridReady,
    onCellClicked,
    onCellDoubleClicked,
    onCellValueChanged,
    onSelectionChanged,
    onSortChanged,
    onFilterChanged,
    totalsRow: totalsRowProp,
    rowStyle,
    columnPresets,
  } = merged;

  const engine = useGridEngine(merged as DataGridProps<TData>);
  const {
    table,
    globalFilter,
    setGlobalFilter,
    grouping,
    setGrouping,
    density,
    setDensity,
    columnAlignment,
    setColumnAlignment,
    columnDecimals,
    setColumnDecimals,
    gridStyles,
    setGridStyles,
    resetState,
  } = engine;

  const containerRef = useRef<HTMLDivElement>(null);
  const [showColumnManager, setShowColumnManager] = useState(false);
  const [showStylePanel, setShowStylePanel] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [showFloatingFilters, setShowFloatingFilters] = useState<boolean>(() => {
    if (props.gridId) {
      const stored = localStorage.getItem(`jt-grid-${props.gridId}-ff`);
      if (stored !== null) return stored === '1';
    }
    return floatingFilters;
  });
  const mountedRef = useRef(false);

  const toolbarConfig: ToolbarConfig = useMemo(() =>
    typeof toolbarProp === 'boolean'
      ? toolbarProp
        ? { search: true, columnManager: true, export: { csv: true }, density: true }
        : {}
      : toolbarProp,
    [toolbarProp]
  );

  const themeStyle = useMemo(() =>
    (typeof theme === 'object'
      ? theme
      : theme === 'dark'
        ? darkThemeVars
        : {}) as React.CSSProperties,
    [theme]
  );

  const styleVars = useMemo(() => {
    const vars: Record<string, string> = {};
    if (gridStyles.headerFontFamily) vars['--jt-grid-header-font-family'] = gridStyles.headerFontFamily;
    if (gridStyles.headerFontSize) vars['--jt-grid-header-font-size'] = gridStyles.headerFontSize;
    if (gridStyles.headerFontColor) vars['--jt-grid-header-text'] = gridStyles.headerFontColor;
    if (gridStyles.rowFontFamily) vars['--jt-grid-row-font-family'] = gridStyles.rowFontFamily;
    if (gridStyles.rowFontSize) vars['--jt-grid-row-font-size'] = gridStyles.rowFontSize;
    if (gridStyles.altRowBgColor) vars['--jt-grid-bg-alt'] = gridStyles.altRowBgColor;
    return vars as React.CSSProperties;
  }, [gridStyles]);

  const showSelectionColumn = rowSelection !== false;

  // ─── Grid API ───
  const gridApi = useMemo<GridApi<TData>>(() => ({
    getRowData: () => table.getCoreRowModel().rows.map((r) => r.original),
    getDisplayedRowCount: () => table.getRowModel().rows.length,
    getSelectedRows: () => table.getSelectedRowModel().rows.map((r) => r.original),
    autoSizeAllColumns: () => table.resetColumnSizing(),
    setColumnVisible: (colId, visible) => {
      table.getColumn(colId)?.toggleVisibility(visible);
    },
    moveColumn: (colId, toIndex) => {
      const order = table.getState().columnOrder;
      const allIds = table.getAllLeafColumns().map((c) => c.id);
      const currentOrder = order.length ? [...order] : [...allIds];
      const fromIndex = currentOrder.indexOf(colId);
      if (fromIndex !== -1) {
        currentOrder.splice(fromIndex, 1);
        currentOrder.splice(toIndex, 0, colId);
        table.setColumnOrder(currentOrder);
      }
    },
    setColumnPinned: (colId, pinned) => {
      table.getColumn(colId)?.pin(pinned);
    },
    setSortModel: (model) => engine.setSorting(entriesToSorting(model)),
    getSortModel: () => sortingToEntries(engine.sorting),
    setFilterModel: (model) => engine.setColumnFilters(recordToFilters(model)),
    getFilterModel: () => filtersToRecord(engine.columnFilters),
    setQuickFilter: (text) => setGlobalFilter(text),
    selectAll: () => table.toggleAllRowsSelected(true),
    deselectAll: () => table.toggleAllRowsSelected(false),
    startEditingCell: () => { /* TODO: implement in Phase 4 */ },
    stopEditing: () => { /* TODO: implement in Phase 4 */ },
    exportCsv: (params) => exportToCsv(table, params),
    exportExcel: async (params) => {
      const { exportToExcel } = await import('../export/excelExport');
      exportToExcel(table, params);
    },
    exportImage: async (params) => {
      const { exportToImage } = await import('../export/psdExport');
      exportToImage(containerRef.current!, params);
    },
    getState: () => ({
      columnOrder: table.getState().columnOrder,
      columnSizing: table.getState().columnSizing,
      columnVisibility: table.getState().columnVisibility,
      sorting: sortingToEntries(engine.sorting),
      columnFilters: filtersToRecord(engine.columnFilters),
      grouping: engine.grouping,
      expanded: typeof engine.expanded === 'boolean' ? {} : engine.expanded,
      pageSize: table.getState().pagination.pageSize,
      columnPinning: table.getState().columnPinning as { left: string[]; right: string[] },
    }),
    applyState: () => { /* TODO */ },
    resetState,
    refreshCells: () => {},
    ensureRowVisible: () => {},
  }), [table, engine.sorting, engine.columnFilters, engine.grouping, engine.expanded, resetState, setGlobalFilter]);

  useImperativeHandle(ref, () => gridApi, [gridApi]);

  // Keep latest callbacks in refs to avoid stale closures
  const onSortChangedRef = useRef(onSortChanged);
  const onFilterChangedRef = useRef(onFilterChanged);
  const onSelectionChangedRef = useRef(onSelectionChanged);
  onSortChangedRef.current = onSortChanged;
  onFilterChangedRef.current = onFilterChanged;
  onSelectionChangedRef.current = onSelectionChanged;

  // Fire onGridReady
  useEffect(() => {
    onGridReady?.({ api: gridApi });
    mountedRef.current = true;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fire events (skip initial mount, use refs for latest callback)
  useEffect(() => {
    if (!mountedRef.current) return;
    onSortChangedRef.current?.({ sortModel: sortingToEntries(engine.sorting) });
  }, [engine.sorting]);

  useEffect(() => {
    if (!mountedRef.current) return;
    onFilterChangedRef.current?.({ filterModel: filtersToRecord(engine.columnFilters) });
  }, [engine.columnFilters]);

  useEffect(() => {
    if (!mountedRef.current) return;
    onSelectionChangedRef.current?.({
      selectedRows: table.getSelectedRowModel().rows.map((r) => r.original),
      selectedRowIds: Object.keys(engine.rowSelectionState),
    });
  }, [engine.rowSelectionState, table]);

  const handleCellClick = useCallback(
    (cell: any, event: React.MouseEvent) => {
      const colMeta = cell.column.columnDef.meta as any;
      onCellClicked?.({
        data: cell.row.original,
        value: cell.getValue(),
        colDef: colMeta?.colDef || {},
        rowIndex: cell.row.index,
        event,
      });
    },
    [onCellClicked]
  );

  const handleCellDoubleClick = useCallback(
    (cell: any, event: React.MouseEvent) => {
      const colMeta = cell.column.columnDef.meta as any;
      onCellDoubleClicked?.({
        data: cell.row.original,
        value: cell.getValue(),
        colDef: colMeta?.colDef || {},
        rowIndex: cell.row.index,
        event,
      });
    },
    [onCellDoubleClicked]
  );

  const handleCellValueChanged = useCallback(
    (cell: any, oldValue: any, newValue: any) => {
      const colMeta = cell.column.columnDef.meta as any;
      onCellValueChanged?.({
        data: cell.row.original,
        colDef: colMeta?.colDef || {},
        oldValue,
        newValue,
        rowIndex: cell.row.index,
      });
    },
    [onCellValueChanged]
  );

  const heightStyle = typeof height === 'number' ? `${height}px` : height;

  // ─── Ctrl+C copy handler ───
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!(e.ctrlKey || e.metaKey) || e.key !== 'c') return;

    // If selected rows exist, copy them as tab-delimited
    const selected = table.getSelectedRowModel().rows;
    if (selected.length > 0) {
      const visibleCols = table.getVisibleLeafColumns();
      const headers = visibleCols.map(c => getColumnHeader(c));
      const lines = selected.map(row =>
        visibleCols.map(col => {
          const val = row.getValue(col.id);
          return val == null ? '' : String(val);
        }).join('\t')
      );
      const text = [headers.join('\t'), ...lines].join('\n');
      navigator.clipboard?.writeText(text);
      e.preventDefault();
      return;
    }

    // Otherwise copy focused cell value
    const active = document.activeElement;
    if (active?.classList.contains('jt-cell')) {
      const cellText = active.textContent || '';
      navigator.clipboard?.writeText(cellText.trim());
      e.preventDefault();
    }
  }, [table]);

  const handleToggleFloatingFilters = useCallback(() => {
    setShowFloatingFilters((prev) => {
      const next = !prev;
      if (props.gridId) {
        localStorage.setItem(`jt-grid-${props.gridId}-ff`, next ? '1' : '0');
      }
      return next;
    });
  }, [props.gridId]);

  const hasActiveFilters = engine.columnFilters.length > 0 || globalFilter !== '';

  const handlePresetChange = useCallback((presetLabel: string | null) => {
    setActivePreset(presetLabel);
    if (!presetLabel) {
      // "All" — show all columns
      const vis: Record<string, boolean> = {};
      table.getAllLeafColumns().forEach((c) => { vis[c.id] = true; });
      table.setColumnVisibility(vis);
    } else {
      const preset = columnPresets?.find((p) => p.label === presetLabel);
      if (!preset) return;
      const allowedSet = new Set(preset.columns);
      const vis: Record<string, boolean> = {};
      table.getAllLeafColumns().forEach((c) => {
        vis[c.id] = allowedSet.has(c.id);
      });
      table.setColumnVisibility(vis);
    }
  }, [table, columnPresets]);

  const handleClearFilters = useCallback(() => {
    engine.setColumnFilters([]);
    setGlobalFilter('');
  }, [engine, setGlobalFilter]);

  return (
    <div
      ref={containerRef}
      className={clsx(
        'jt-datagrid',
        'flex flex-col overflow-hidden rounded-lg border border-grid-border bg-grid-bg shadow-sm',
        theme === 'dark' && 'dark',
        className
      )}
      style={{ height: heightStyle, ...themeStyle, ...styleVars }}
      onKeyDown={handleKeyDown}
    >
      {Object.keys(toolbarConfig).length > 0 && (
        <GridToolbar
          table={table}
          config={toolbarConfig}
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          density={density}
          onDensityChange={setDensity}
          sorting={engine.sorting}
          onSortingChange={engine.setSorting}
          columnFilters={engine.columnFilters}
          onColumnFiltersChange={engine.setColumnFilters}
          onResetState={resetState}
          onToggleColumnManager={() => setShowColumnManager(!showColumnManager)}
          onExportCsv={() => gridApi.exportCsv()}
          onExportExcel={() => gridApi.exportExcel()}
          onExportImage={() => gridApi.exportImage()}
          columnPresets={columnPresets}
          activePreset={activePreset}
          onPresetChange={handlePresetChange}
          showFloatingFilters={showFloatingFilters}
          onToggleFloatingFilters={handleToggleFloatingFilters}
          onToggleStylePanel={() => setShowStylePanel((p) => !p)}
        />
      )}

      {groupPanel && (
        <GroupPanel
          table={table}
          grouping={grouping}
          onGroupingChange={setGrouping}
        />
      )}

      <div className="flex-1 overflow-auto">
        <table className="jt-table w-full border-collapse text-grid-base">
          <GridHeader table={table} showSelectionColumn={showSelectionColumn} columnAlignment={columnAlignment} showFloatingFilters={showFloatingFilters} />
          <GridBody
            table={table}
            density={density}
            columnAlignment={columnAlignment}
            columnDecimals={columnDecimals}
            noRowsComponent={noRowsComponent}
            noRowsMessage={noRowsMessage}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={handleClearFilters}
            onCellClick={handleCellClick}
            onCellDoubleClick={handleCellDoubleClick}
            onCellValueChanged={handleCellValueChanged}
            rowStyle={rowStyle}
          />
          {totalsRowProp && (
            <TotalsRow
              table={table}
              config={typeof totalsRowProp === 'object' ? totalsRowProp : {}}
              showSelectionColumn={showSelectionColumn}
              density={density}
              columnAlignment={columnAlignment}
            />
          )}
        </table>
      </div>

      <Overlay loading={loading} loadingComponent={loadingComponent} />

      {pagination && (
        <Pagination table={table} pageSizeOptions={paginationPageSizeOptions} />
      )}

      {showStatusBar && <StatusBar table={table} />}

      <ColumnManager
        table={table}
        isOpen={showColumnManager}
        onClose={() => setShowColumnManager(false)}
        columnAlignment={columnAlignment}
        onColumnAlignmentChange={(colId, align) =>
          setColumnAlignment(prev => ({ ...prev, [colId]: align }))
        }
        columnDecimals={columnDecimals}
        onColumnDecimalsChange={(colId, decimals) =>
          setColumnDecimals(prev => ({ ...prev, [colId]: decimals }))
        }
      />

      <StylePanel
        isOpen={showStylePanel}
        onClose={() => setShowStylePanel(false)}
        styles={gridStyles}
        onStylesChange={setGridStyles}
      />
    </div>
  );
}

export const DataGrid = forwardRef(DataGridInner) as <TData = any>(
  props: DataGridProps<TData> & { ref?: React.Ref<GridApi<TData>> }
) => React.ReactElement;
