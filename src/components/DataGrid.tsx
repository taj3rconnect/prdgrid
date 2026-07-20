import React, { useRef, useState, useCallback, useEffect, useImperativeHandle, forwardRef, useMemo } from 'react';
import { clsx } from 'clsx';
import { useGridEngine } from '../core/useGridEngine';
import { loadUiState, saveUiState } from '../core/persistence';
import { sortingToEntries, entriesToSorting, filtersToRecord, recordToFilters } from '../core/gridUtils';
import { resolveAppearance } from '../styles/themes';
import { GridToolbar } from './GridToolbar';
import { GridHeader } from './GridHeader';
import { GridBody } from './GridBody';
import { FloatingFilter } from './FloatingFilter';
import { GroupPanel } from './GroupPanel';
import { ColumnManager } from './ColumnManager';
import { ChartPanel } from './ChartPanel';
import { RecordPanel } from './RecordPanel';
import { TotalsRow } from './TotalsRow';
import { StylePanel } from './StylePanel';
import { ExportModal } from './ExportModal';
import { HeaderContextMenu } from './HeaderContextMenu';
import { getColumnHeader } from '../core/gridUtils';
import { Pagination } from './Pagination';
import { StatusBar } from './StatusBar';
import { Overlay } from './Overlay';
import { exportToCsv } from '../export/csvExport';
import type {
  DataGridProps,
  GridStyleSettings,
  GridType,
  GridView,
  GridAppearance,
  GridLook,
  ChartConfig,
  ToolbarConfig,
  GridApi,
  GridThemeTokens,
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
    gridLook: 'dense',
    toolbar: { search: true, columnManager: true, export: { csv: true, excel: true }, density: true, charts: true, themeSwitcher: true },
  },
  editable: {
    pagination: true,
    paginationPageSize: 50,
    rowSelection: 'single',
    floatingFilters: false,
    statusBar: true,
    toolbar: { search: true, columnManager: true, export: { csv: true }, density: true, charts: true, themeSwitcher: true },
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

function DataGridInner<TData = any>(
  props: DataGridProps<TData>,
  ref: React.Ref<GridApi<TData>>
) {
  // Merge gridType preset defaults with explicit props (explicit wins)
  const { gridType = 'regular', enableRowGroup, ...restProps } = props;
  const preset = GRID_TYPE_DEFAULTS[gridType];
  const merged = { ...preset, ...restProps };

  // Only an EXPLICIT enableRowGroup forces the group panel on
  if (enableRowGroup === true) {
    merged.groupPanel = true;
  }

  const {
    rowSelection = false,
    pagination = false,
    paginationPageSizeOptions = [25, 50, 100, 250, 500, 1000],
    groupPanel = false,
    groupDefaultExpanded,
    floatingFilters = false,
    statusBar: showStatusBar = true,
    toolbar: toolbarProp = true,
    theme = 'light',
    gridLook: gridLookProp,
    accentTheme: accentThemeProp,
    showThemeSwitcher = true,
    onAppearanceChange,
    charts: chartsEnabled = true,
    defaultCharts,
    rowColorRules,
    recordPanel = true,
    totalsRow,
    onRefresh,
    defaultStyleSettings,
    emailExportEndpoint,
    scheduleExportEndpoint,
    fetchHeaders,
    className,
    gridId,
    persistSettings = false,
    rowHeight,
    headerHeight,
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
  } = merged;

  const mergedProps = useMemo<DataGridProps<TData>>(() => ({
    ...merged,
    enableRowGroup: enableRowGroup ?? true,
    rowSelection,
    pagination,
    paginationPageSizeOptions,
    groupPanel,
    groupDefaultExpanded,
    floatingFilters,
    statusBar: showStatusBar,
    toolbar: toolbarProp,
    theme,
    height,
    loading,
  } as DataGridProps<TData>), [merged]);

  const persistedUi = useMemo(() => (persistSettings ? loadUiState(gridId) : null), [persistSettings, gridId]);
  const [styleSettings, setStyleSettings] = useState<GridStyleSettings>(
    persistedUi?.styleSettings ?? defaultStyleSettings ?? {}
  );

  const engine = useGridEngine(mergedProps, { hideSelectColumn: styleSettings.showCheckboxColumn === false });
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
    resetState,
  } = engine;

  const containerRef = useRef<HTMLDivElement>(null);
  const [showColumnManager, setShowColumnManager] = useState(false);
  const [view, setView] = useState<GridView>('grid');
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const mountedRef = useRef(false);

  // ─── Appearance (look + accent) ───
  const defaultLook: GridLook = gridLookProp ?? (theme === 'dark' ? 'midnight' : 'airtable');
  const [appearance, setAppearance] = useState<GridAppearance>({
    look: persistedUi?.look ?? defaultLook,
    accent: persistedUi?.accent ?? accentThemeProp ?? 'blue',
  });

  const [chartConfigs, setChartConfigs] = useState<ChartConfig[]>(persistedUi?.charts ?? defaultCharts ?? []);
  const [showStylePanel, setShowStylePanel] = useState(false);
  const [showFloatingFilters, setShowFloatingFilters] = useState<boolean>(
    persistedUi?.showFloatingFilters ?? true
  );
  const [exportModalTab, setExportModalTab] = useState<'email' | 'schedule' | null>(null);
  const [headerMenu, setHeaderMenu] = useState<{ columnId: string; x: number; y: number } | null>(null);

  // Persist appearance + chart configs (debounced)
  useEffect(() => {
    if (!persistSettings || !gridId) return;
    const timer = setTimeout(() => {
      saveUiState(gridId, {
        look: appearance.look,
        accent: appearance.accent,
        charts: chartConfigs,
        styleSettings,
        showFloatingFilters,
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [persistSettings, gridId, appearance, chartConfigs, styleSettings, showFloatingFilters]);

  const handleAppearanceChange = useCallback(
    (next: GridAppearance) => {
      setAppearance(next);
      onAppearanceChange?.(next);
    },
    [onAppearanceChange]
  );

  const themeTokens = typeof theme === 'object' ? (theme as GridThemeTokens) : undefined;
  const { style: appearanceStyle, isDark } = useMemo(() => {
    const resolved = resolveAppearance({
      look: appearance.look,
      accent: appearance.accent,
      density,
      themeTokens,
      rowHeight,
      headerHeight,
    });
    const st = styleSettings;
    const style = resolved.style;
    if (st.headerFontFamily) style['--jt-grid-header-font-family'] = st.headerFontFamily;
    if (st.headerFontSize) style['--jt-grid-header-font-size'] = st.headerFontSize;
    if (st.headerFontStyle === 'italic') style['--jt-grid-header-font-style'] = 'italic';
    if (st.headerFontStyle === 'bold') style['--jt-grid-header-weight'] = '700';
    if (st.headerFontStyle === 'normal') style['--jt-grid-header-weight'] = '400';
    if (st.headerFontColor) style['--jt-grid-header-text'] = st.headerFontColor;
    if (st.rowFontFamily) style['--jt-grid-font-family'] = st.rowFontFamily;
    if (st.rowFontSize) style['--jt-grid-font-base'] = st.rowFontSize;
    if (st.altRowBgColor) style['--jt-grid-stripe-bg'] = st.altRowBgColor;
    return resolved;
  }, [appearance, density, themeTokens, rowHeight, headerHeight, styleSettings]);

  const toolbarConfig: ToolbarConfig = useMemo(() => {
    const base: ToolbarConfig =
      typeof toolbarProp === 'boolean'
        ? toolbarProp
          ? { search: true, columnManager: true, export: { csv: true }, density: true }
          : {}
        : { ...toolbarProp };
    if (Object.keys(base).length === 0) return base;
    if (base.charts === undefined) base.charts = chartsEnabled;
    if (base.themeSwitcher === undefined) base.themeSwitcher = showThemeSwitcher;
    return base;
  }, [toolbarProp, chartsEnabled, showThemeSwitcher]);

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
    startEditingCell: () => { /* Deprecated stub — editing state lives in cells; see docs */ },
    stopEditing: () => { /* Deprecated stub */ },
    exportCsv: (params) => exportToCsv(table, params),
    exportExcel: async (params) => {
      const { exportToExcel } = await import('../export/excelExport');
      exportToExcel(table, params);
    },
    exportImage: async (params) => {
      const { exportToImage } = await import('../export/psdExport');
      exportToImage(containerRef.current!, params);
    },
    exportPdf: async (params) => {
      const { exportToPdf } = await import('../export/pdfExport');
      exportToPdf(table, params);
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
    applyState: (state) => {
      if (state.columnOrder) engine.setColumnOrder(state.columnOrder);
      if (state.columnSizing) engine.setColumnSizing(state.columnSizing);
      if (state.columnVisibility) engine.setColumnVisibility(state.columnVisibility);
      if (state.sorting) engine.setSorting(entriesToSorting(state.sorting));
      if (state.columnFilters) engine.setColumnFilters(recordToFilters(state.columnFilters));
      if (state.grouping) engine.setGrouping(state.grouping);
      if (state.expanded) engine.setExpanded(state.expanded);
      if (state.columnPinning) engine.setColumnPinning(state.columnPinning);
      if (state.pageSize) table.setPageSize(state.pageSize);
    },
    resetState,
    refreshCells: () => {},
    ensureRowVisible: (rowIndex) => {
      containerRef.current
        ?.querySelector(`[data-row-index="${rowIndex}"]`)
        ?.scrollIntoView({ block: 'nearest' });
    },
  }), [table, engine.sorting, engine.columnFilters, engine.grouping, engine.expanded, resetState, setGlobalFilter]);

  useImperativeHandle(ref, () => gridApi, [gridApi]);

  // Stable API proxy so onGridReady consumers never hold a stale closure
  const gridApiRef = useRef(gridApi);
  gridApiRef.current = gridApi;
  const stableApi = useMemo<GridApi<TData>>(
    () => new Proxy({} as GridApi<TData>, { get: (_t, prop) => (gridApiRef.current as any)[prop] }),
    []
  );

  // Fire onGridReady
  useEffect(() => {
    onGridReady?.({ api: stableApi });
    mountedRef.current = true;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fire events (skip initial mount)
  useEffect(() => {
    if (!mountedRef.current) return;
    onSortChanged?.({ sortModel: sortingToEntries(engine.sorting) });
  }, [engine.sorting]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!mountedRef.current) return;
    onFilterChanged?.({ filterModel: filtersToRecord(engine.columnFilters) });
  }, [engine.columnFilters]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!mountedRef.current) return;
    onSelectionChanged?.({
      selectedRows: table.getSelectedRowModel().rows.map((r) => r.original),
      selectedRowIds: Object.keys(engine.rowSelectionState),
    });
  }, [engine.rowSelectionState]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const handleExpandRecord = useCallback((rowId: string) => setExpandedRowId(rowId), []);

  // Ctrl/Cmd+C: copy selected rows as TSV, else the focused cell's text
  const handleCopyKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey) || e.key !== 'c') return;
      if (window.getSelection()?.toString()) return;
      const selected = table.getSelectedRowModel().rows;
      if (selected.length > 0) {
        const visibleCols = table
          .getVisibleLeafColumns()
          .filter((c) => !(c.columnDef.meta as any)?.isSelectColumn);
        const headers = visibleCols.map((c) => getColumnHeader(c));
        const lines = selected.map((row) =>
          visibleCols
            .map((col) => {
              const val = row.getValue(col.id);
              return val == null ? '' : Array.isArray(val) ? val.join(', ') : String(val);
            })
            .join('\t')
        );
        navigator.clipboard?.writeText([headers.join('\t'), ...lines].join('\n'));
        e.preventDefault();
        return;
      }
      const active = document.activeElement as HTMLElement | null;
      if (active?.classList.contains('jt-cell')) {
        navigator.clipboard?.writeText((active.textContent || '').trim());
        e.preventDefault();
      }
    },
    [table]
  );

  const heightStyle = typeof height === 'number' ? `${height}px` : height;
  const anySelected = Object.keys(engine.rowSelectionState).length > 0;

  return (
    <div
      ref={containerRef}
      className={clsx('jt-datagrid', 'flex flex-col overflow-hidden', isDark && 'dark', className)}
      style={{ height: heightStyle, ...(appearanceStyle as React.CSSProperties) }}
      data-look={appearance.look}
      data-accent={appearance.accent}
      data-anyselected={anySelected}
      onKeyDown={handleCopyKeyDown}
    >
      {Object.keys(toolbarConfig).length > 0 && (
        <GridToolbar
          table={table}
          config={toolbarConfig}
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          density={density}
          onDensityChange={setDensity}
          onResetState={resetState}
          onToggleColumnManager={() => setShowColumnManager(!showColumnManager)}
          onExportCsv={() => gridApi.exportCsv()}
          onExportExcel={() => gridApi.exportExcel()}
          onExportImage={() => gridApi.exportImage()}
          view={view}
          onViewChange={setView}
          appearance={appearance}
          onAppearanceChange={handleAppearanceChange}
          onExportPdf={() => gridApi.exportPdf()}
          onExportEmail={() => setExportModalTab('email')}
          onExportSchedule={() => setExportModalTab('schedule')}
          onRefresh={onRefresh}
          onToggleStylePanel={() => setShowStylePanel(true)}
          showFloatingFilters={floatingFilters && showFloatingFilters}
          onToggleFloatingFilters={floatingFilters ? () => setShowFloatingFilters((v) => !v) : undefined}
        />
      )}

      {groupPanel && view === 'grid' && (
        <GroupPanel
          table={table}
          grouping={grouping}
          onGroupingChange={setGrouping}
        />
      )}

      {view === 'charts' ? (
        <ChartPanel table={table} charts={chartConfigs} onChartsChange={setChartConfigs} />
      ) : (
        <div className="flex-1 overflow-auto">
          <table className="jt-table w-full border-collapse text-grid-base">
            <GridHeader
              table={table}
              columnAlignment={columnAlignment}
              onHeaderContextMenu={(columnId, x, y) => setHeaderMenu({ columnId, x, y })}
            />
            {floatingFilters && showFloatingFilters && <FloatingFilter table={table} />}
            <GridBody
              table={table}
              columnAlignment={columnAlignment}
              columnDecimals={columnDecimals}
              rowColorRules={rowColorRules}
              noRowsComponent={noRowsComponent}
              noRowsMessage={noRowsMessage}
              onCellClick={handleCellClick}
              onCellDoubleClick={handleCellDoubleClick}
              onCellValueChanged={handleCellValueChanged}
              onExpandRecord={recordPanel && rowSelection !== false ? handleExpandRecord : undefined}
            />
            {totalsRow && (
              <TotalsRow
                table={table}
                config={typeof totalsRow === 'object' ? totalsRow : {}}
                columnAlignment={columnAlignment}
                columnDecimals={columnDecimals}
              />
            )}
          </table>
        </div>
      )}

      <Overlay loading={loading} loadingComponent={loadingComponent} />

      {pagination && view === 'grid' && (
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

      <RecordPanel
        table={table}
        rowId={expandedRowId}
        onClose={() => setExpandedRowId(null)}
        onNavigate={setExpandedRowId}
      />

      <StylePanel
        isOpen={showStylePanel}
        onClose={() => setShowStylePanel(false)}
        styles={styleSettings}
        onStylesChange={setStyleSettings}
        showSelectionToggle={rowSelection !== false}
      />

      <ExportModal
        isOpen={exportModalTab !== null}
        initialTab={exportModalTab ?? 'email'}
        onClose={() => setExportModalTab(null)}
        table={table}
        emailEndpoint={emailExportEndpoint}
        scheduleEndpoint={scheduleExportEndpoint}
        fetchHeaders={fetchHeaders}
      />

      <HeaderContextMenu
        column={headerMenu ? table.getColumn(headerMenu.columnId) ?? null : null}
        position={headerMenu}
        onClose={() => setHeaderMenu(null)}
        themeStyle={appearanceStyle as React.CSSProperties}
      />
    </div>
  );
}

export const DataGrid = forwardRef(DataGridInner) as <TData = any>(
  props: DataGridProps<TData> & { ref?: React.Ref<GridApi<TData>> }
) => React.ReactElement;
