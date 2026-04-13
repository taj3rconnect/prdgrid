import { useMemo, useState, useCallback, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getGroupedRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  ColumnDef as TanStackColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  ColumnOrderState,
  ColumnSizingState,
  GroupingState,
  ExpandedState,
  RowSelectionState,
  ColumnPinningState,
} from '@tanstack/react-table';
import { entriesToSorting, sortingToEntries, filtersToRecord, recordToFilters } from './gridUtils';
import { filterPanelFilterFn } from '../components/FilterPanel';
import type {
  DataGridProps,
  ColumnDef,
  PersistedGridState,
  GridDensity,
  GridStyleSettings,
} from '../types';

// ─── Helpers ─────────────────────────────────────────────────────────

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
}

const AMOUNT_FIELD_PATTERN = /\b(amount|price|cost|total|salary|revenue|balance|fee|budget|income|profit|margin|tax|discount|spend|expense|pnl|winnings|billRate|bankBalance|gp|gross|net|rate|percent|pct|markup|inv|pay)\b|%/i;

function formatWithDecimals(value: any, decimals: number): string {
  if (value == null || isNaN(value)) return value;
  return Number(value).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function isAmountField(field?: string, headerName?: string): boolean {
  if (field && AMOUNT_FIELD_PATTERN.test(field)) return true;
  if (headerName && AMOUNT_FIELD_PATTERN.test(headerName)) return true;
  return false;
}


// ─── Column Mapping ──────────────────────────────────────────────────

function mapColumnDef<TData>(
  col: ColumnDef<TData>,
  defaultColDef?: Partial<ColumnDef<TData>>,
  gridEnableRowGroup?: boolean,
  index?: number
): TanStackColumnDef<TData, any> {
  const merged = { ...defaultColDef, ...col };
  const id = col.colId || col.field || `col_${index ?? 0}`;

  const tanstackCol: TanStackColumnDef<TData, any> = {
    id,
    header: merged.headerName || col.field || id,
    accessorFn: merged.valueGetter
      ? (row: TData, index: number) =>
          merged.valueGetter!({ data: row, field: merged.field, colDef: col, rowIndex: index })
      : merged.field
        ? (row: TData) => getNestedValue(row, merged.field!)
        : undefined,
    enableSorting: merged.sortable !== false,
    enableColumnFilter: merged.filter !== false && merged.filter !== undefined,
    filterFn: merged.filter ? filterPanelFilterFn as any : undefined,
    enableGrouping: merged.enableRowGroup === true || gridEnableRowGroup === true,
    enableResizing: merged.resizable !== false,
    enableHiding: merged.lockVisible !== true,
    size: merged.width || 150,
    minSize: merged.minWidth ?? 1,
    maxSize: merged.maxWidth || 1000,
    meta: {
      colDef: col,
      mergedColDef: merged,
      filterType: merged.filter,
      editorType: merged.cellEditor,
      editable: merged.editable,
      pinned: merged.pinned,
      cellRenderer: merged.cellRenderer,
      cellRendererParams: merged.cellRendererParams,
      headerRenderer: merged.headerRenderer,
      cellClass: merged.cellClass,
      cellStyle: merged.cellStyle,
      valueFormatter: merged.valueFormatter || undefined,
      autoNumeric: !merged.valueFormatter && (merged.filter === 'number' || isAmountField(merged.field, merged.headerName)),
      isNumericColumn: merged.filter === 'number' || isAmountField(merged.field, merged.headerName),
      valueParser: merged.valueParser,
      valueSetter: merged.valueSetter,
      cellValidator: merged.cellValidator,
      aggFunc: merged.aggFunc,
      floatingFilter: merged.floatingFilter,
      headerTooltip: merged.headerTooltip,
    },
  };

  if (merged.aggFunc) {
    if (typeof merged.aggFunc === 'string') {
      tanstackCol.aggregationFn = merged.aggFunc as any;
    } else {
      tanstackCol.aggregationFn = (_columnId, _leafRows, childRows) => {
        const values = childRows.map((row) => row.getValue(_columnId));
        return (merged.aggFunc as Function)(values);
      };
    }
    tanstackCol.aggregatedCell = ({ getValue }) => {
      const val = getValue();
      if (merged.valueFormatter) {
        return merged.valueFormatter({
          value: val,
          data: {} as TData,
          colDef: col,
          rowIndex: -1,
        });
      }
      if (!merged.valueFormatter && (isAmountField(merged.field, merged.headerName) || merged.filter === 'number')) {
        return formatWithDecimals(val, 0);
      }
      return val;
    };
  }

  if (col.children && col.children.length > 0) {
    (tanstackCol as any).columns = col.children.map((child) =>
      mapColumnDef(child, defaultColDef, gridEnableRowGroup)
    );
  }

  return tanstackCol;
}

// ─── Persistence ─────────────────────────────────────────────────────

function loadPersistedState(gridId: string): Partial<PersistedGridState> | null {
  try {
    const raw = localStorage.getItem(`jt-grid-${gridId}`);
    if (raw) return JSON.parse(raw);
  } catch {
    // Ignore corrupted state
  }
  return null;
}

function savePersistedState(gridId: string, state: PersistedGridState): void {
  try {
    localStorage.setItem(`jt-grid-${gridId}`, JSON.stringify(state));
  } catch {
    // localStorage full or unavailable
  }
}

// ─── Main Hook ───────────────────────────────────────────────────────

export function useGridEngine<TData>(props: DataGridProps<TData>) {
  const {
    rowData,
    columnDefs,
    defaultColDef,
    getRowId,
    rowSelection = false,
    pagination = false,
    paginationPageSize = 50,
    groupDefaultExpanded = 0,
    persistSettings = false,
    density: propDensity = 'normal',
    gridId,
    enableRowGroup: gridEnableRowGroup = true,
  } = props;

  const persisted = useMemo(
    () => (persistSettings && gridId ? loadPersistedState(gridId) : null),
    [persistSettings, gridId]
  );

  // ─── State ───
  const [sorting, setSorting] = useState<SortingState>(() => {
    if (persisted?.sorting) return entriesToSorting(persisted.sorting);
    return columnDefs
      .filter((c) => c.sort)
      .sort((a, b) => (a.sortIndex ?? 99) - (b.sortIndex ?? 99))
      .map((c) => ({ id: c.colId || c.field || '', desc: c.sort === 'desc' }));
  });

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    persisted?.columnFilters ? recordToFilters(persisted.columnFilters) : []
  );

  const [globalFilter, setGlobalFilter] = useState('');

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() => {
    if (persisted?.columnVisibility) return persisted.columnVisibility;
    const vis: VisibilityState = {};
    columnDefs.forEach((c) => {
      const id = c.colId || c.field;
      if (id && c.hide) vis[id] = false;
    });
    return vis;
  });

  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    persisted?.columnOrder || []
  );

  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>(
    persisted?.columnSizing || {}
  );

  const [grouping, setGrouping] = useState<GroupingState>(() => {
    if (persisted?.grouping) return persisted.grouping;
    return columnDefs
      .filter((c) => c.rowGroup)
      .sort((a, b) => (a.rowGroupIndex ?? 99) - (b.rowGroupIndex ?? 99))
      .map((c) => c.colId || c.field || '');
  });

  const [expanded, setExpanded] = useState<ExpandedState>(() => {
    if (persisted?.expanded) return persisted.expanded;
    if (groupDefaultExpanded === -1) return true;
    return {};
  });

  const [rowSelectionState, setRowSelectionState] = useState<RowSelectionState>({});

  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>(() => {
    if (persisted?.columnPinning) return persisted.columnPinning;
    const left: string[] = [];
    const right: string[] = [];
    columnDefs.forEach((c) => {
      const id = c.colId || c.field;
      if (id && c.pinned === 'left') left.push(id);
      if (id && c.pinned === 'right') right.push(id);
    });
    return { left, right };
  });

  const [density, setDensity] = useState<GridDensity>(propDensity);
  const defaultAlignment = useMemo(() => {
    const align: Record<string, 'left' | 'center' | 'right'> = {};
    const applyDefaults = (cols: ColumnDef<TData>[]) => {
      for (const col of cols) {
        const merged = { ...defaultColDef, ...col };
        const id = col.colId || col.field;
        if (id && (merged.filter === 'number' || isAmountField(merged.field, merged.headerName))) {
          align[id] = 'right';
        }
        if (col.children) applyDefaults(col.children);
      }
    };
    applyDefaults(columnDefs);
    return align;
  }, [columnDefs, defaultColDef]);

  const [userAlignment, setUserAlignment] = useState<Record<string, 'left' | 'center' | 'right'>>(
    () => persisted?.columnAlignment || {}
  );
  const columnAlignment = useMemo(() => ({ ...defaultAlignment, ...userAlignment }), [defaultAlignment, userAlignment]);
  const setColumnAlignment = setUserAlignment;

  const [columnDecimals, setColumnDecimals] = useState<Record<string, number>>(
    () => persisted?.columnDecimals || {}
  );

  const [gridStyles, setGridStyles] = useState<GridStyleSettings>(
    () => persisted?.gridStyles || {}
  );

  const pageSize = persisted?.pageSize || paginationPageSize;

  // ─── Map columns ───
  const tanstackColumns = useMemo(
    () => columnDefs.map((c, i) => mapColumnDef(c, defaultColDef, gridEnableRowGroup, i)),
    [columnDefs, defaultColDef, gridEnableRowGroup]
  );

  // ─── Table instance ───
  const table = useReactTable<TData>({
    data: rowData,
    columns: tanstackColumns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      columnOrder,
      columnSizing,
      grouping,
      expanded,
      rowSelection: rowSelectionState,
      columnPinning,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onColumnSizingChange: setColumnSizing,
    onGroupingChange: setGrouping,
    onExpandedChange: setExpanded,
    onRowSelectionChange: setRowSelectionState,
    onColumnPinningChange: setColumnPinning,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: pagination ? getPaginationRowModel() : undefined,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    autoResetPageIndex: false,
    enableRowSelection: rowSelection !== false,
    enableMultiRowSelection: rowSelection === 'multiple',
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    enableGrouping: true,
    enableSorting: true,
    enableFilters: true,
    enableMultiSort: true,
    getRowId: getRowId ? (row, index) => getRowId(row, index) : undefined,
    initialState: {
      pagination: { pageSize },
    },
  });

  // ─── Persist state on changes (debounced to avoid hammering localStorage during resize drag) ───
  useEffect(() => {
    if (!persistSettings || !gridId) return;

    const timer = setTimeout(() => {
      const state: PersistedGridState = {
        columnOrder,
        columnSizing,
        columnVisibility,
        sorting: sortingToEntries(sorting),
        columnFilters: filtersToRecord(columnFilters),
        grouping,
        expanded: typeof expanded === 'boolean' ? {} : expanded,
        pageSize: table.getState().pagination.pageSize,
        columnPinning: {
          left: columnPinning.left || [],
          right: columnPinning.right || [],
        },
        columnDecimals,
        columnAlignment: userAlignment,
        gridStyles,
      };
      savePersistedState(gridId, state);
    }, 300);

    return () => clearTimeout(timer);
  }, [
    persistSettings, gridId, columnOrder, columnSizing, columnVisibility,
    sorting, columnFilters, grouping, expanded, columnPinning, columnDecimals, userAlignment, gridStyles,
  ]);

  // ─── Reset state ───
  const resetState = useCallback(() => {
    if (gridId) {
      localStorage.removeItem(`jt-grid-${gridId}`);
    }
    setSorting([]);
    setColumnFilters([]);
    setGlobalFilter('');
    setColumnVisibility({});
    setColumnOrder([]);
    setColumnSizing({});
    setGrouping([]);
    setExpanded({});
    setRowSelectionState({});
    setColumnPinning({ left: [], right: [] });
    setColumnDecimals({});
    setUserAlignment({});
    setGridStyles({});
  }, [gridId]);

  return {
    table,
    sorting,
    columnFilters,
    globalFilter,
    columnVisibility,
    columnOrder,
    columnSizing,
    grouping,
    expanded,
    rowSelectionState,
    columnPinning,
    density,
    columnAlignment,
    setSorting,
    setColumnFilters,
    setGlobalFilter,
    setColumnVisibility,
    setColumnOrder,
    setColumnSizing,
    setGrouping,
    setExpanded,
    setRowSelectionState,
    setColumnPinning,
    setDensity,
    setColumnAlignment,
    columnDecimals,
    setColumnDecimals,
    gridStyles,
    setGridStyles,
    resetState,
  };
}
