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
import { mapColumnDef, isAmountField, isNumericDataType } from './columnMapping';
import { loadPersistedState, saveGridState, clearGridState, PERSIST_VERSION } from './persistence';

// Re-exports kept for compatibility — these lived here before the split
export { isNumericDataType, isAmountField, defaultFilterForDataType, AMOUNT_FIELD_PATTERN } from './columnMapping';
export { validatePersistedState, PERSIST_VERSION } from './persistence';
import type {
  DataGridProps,
  ColumnDef,
  PersistedGridState,
  GridDensity,
} from '../types';

export const SELECT_COLUMN_ID = '__select__';

// ─── Main Hook ───────────────────────────────────────────────────────

export interface GridEngineOptions {
  /** Hide the row-number/selection display column (style-panel toggle) */
  hideSelectColumn?: boolean;
}

export function useGridEngine<TData>(props: DataGridProps<TData>, options?: GridEngineOptions) {
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
    const withSelect = (pinning: { left: string[]; right: string[] }) => {
      if (rowSelection !== false && !pinning.left.includes(SELECT_COLUMN_ID)) {
        return { ...pinning, left: [SELECT_COLUMN_ID, ...pinning.left] };
      }
      return pinning;
    };
    if (persisted?.columnPinning) return withSelect(persisted.columnPinning);
    const left: string[] = [];
    const right: string[] = [];
    columnDefs.forEach((c) => {
      const id = c.colId || c.field;
      if (id && c.pinned === 'left') left.push(id);
      if (id && c.pinned === 'right') right.push(id);
    });
    return withSelect({ left, right });
  });

  const [density, setDensity] = useState<GridDensity>(persisted?.density || propDensity);
  const defaultAlignment = useMemo(() => {
    const align: Record<string, 'left' | 'center' | 'right'> = {};
    const applyDefaults = (cols: ColumnDef<TData>[]) => {
      for (const col of cols) {
        const merged = { ...defaultColDef, ...col };
        const id = col.colId || col.field;
        if (
          id &&
          (merged.filter === 'number' ||
            isNumericDataType(merged.dataType) ||
            isAmountField(merged.field, merged.headerName))
        ) {
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

  const pageSize = persisted?.pageSize || paginationPageSize;

  // ─── Map columns ───
  const showSelectColumn = rowSelection !== false && !options?.hideSelectColumn;
  const tanstackColumns = useMemo(() => {
    const cols = columnDefs.map((c) => mapColumnDef(c, defaultColDef, gridEnableRowGroup));
    if (showSelectColumn) {
      const selectCol: TanStackColumnDef<TData, any> = {
        id: SELECT_COLUMN_ID,
        header: '',
        size: 44,
        minSize: 44,
        maxSize: 44,
        enableSorting: false,
        enableColumnFilter: false,
        enableGrouping: false,
        enableResizing: false,
        enableHiding: false,
        meta: { isSelectColumn: true } as any,
      };
      cols.unshift(selectCol);
    }
    return cols;
  }, [columnDefs, defaultColDef, gridEnableRowGroup, showSelectColumn]);

  // Dev aid: generated column IDs orphan persisted settings across remounts
  useEffect(() => {
    if (persistSettings && columnDefs.some((c) => !c.colId && !c.field)) {
      console.warn(
        '[prdgrid] persistSettings is on but some columns have neither colId nor field — their generated IDs are unstable and persisted settings for them will be lost. Add explicit colId.'
      );
    }
  }, [persistSettings, columnDefs]);

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

  // ─── Persist state on changes (debounced — resize/sort emit rapid updates) ───
  useEffect(() => {
    if (!persistSettings || !gridId) return;

    const timer = setTimeout(() => {
      const state: PersistedGridState = {
        version: PERSIST_VERSION,
        density,
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
      };
      saveGridState(gridId, state);
    }, 300);

    return () => clearTimeout(timer);
  }, [
    persistSettings, gridId, columnOrder, columnSizing, columnVisibility, density,
    sorting, columnFilters, grouping, expanded, columnPinning, columnDecimals, userAlignment,
  ]);

  // ─── Reset state ───
  const resetState = useCallback(() => {
    if (gridId) {
      clearGridState(gridId);
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
    setColumnPinning({ left: rowSelection !== false ? [SELECT_COLUMN_ID] : [], right: [] });
    setColumnDecimals({});
    setUserAlignment({});
  }, [gridId, rowSelection]);

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
    resetState,
  };
}
