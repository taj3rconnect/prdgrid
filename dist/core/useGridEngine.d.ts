import { SortingState, ColumnFiltersState, VisibilityState, ColumnOrderState, ColumnSizingState, GroupingState, ExpandedState, RowSelectionState, ColumnPinningState } from '@tanstack/react-table';
import { DataGridProps, GridDensity } from '../types';
export { isNumericDataType, isAmountField, defaultFilterForDataType, AMOUNT_FIELD_PATTERN } from './columnMapping';
export { validatePersistedState, PERSIST_VERSION } from './persistence';
export declare const SELECT_COLUMN_ID = "__select__";
export interface GridEngineOptions {
    /** Hide the row-number/selection display column (style-panel toggle) */
    hideSelectColumn?: boolean;
}
export declare function useGridEngine<TData>(props: DataGridProps<TData>, options?: GridEngineOptions): {
    table: import('@tanstack/table-core').Table<TData>;
    sorting: SortingState;
    columnFilters: ColumnFiltersState;
    globalFilter: string;
    columnVisibility: VisibilityState;
    columnOrder: ColumnOrderState;
    columnSizing: ColumnSizingState;
    grouping: GroupingState;
    expanded: ExpandedState;
    rowSelectionState: RowSelectionState;
    columnPinning: ColumnPinningState;
    density: GridDensity;
    columnAlignment: {
        [x: string]: "left" | "right" | "center";
    };
    setSorting: import('react').Dispatch<import('react').SetStateAction<SortingState>>;
    setColumnFilters: import('react').Dispatch<import('react').SetStateAction<ColumnFiltersState>>;
    setGlobalFilter: import('react').Dispatch<import('react').SetStateAction<string>>;
    setColumnVisibility: import('react').Dispatch<import('react').SetStateAction<VisibilityState>>;
    setColumnOrder: import('react').Dispatch<import('react').SetStateAction<ColumnOrderState>>;
    setColumnSizing: import('react').Dispatch<import('react').SetStateAction<ColumnSizingState>>;
    setGrouping: import('react').Dispatch<import('react').SetStateAction<GroupingState>>;
    setExpanded: import('react').Dispatch<import('react').SetStateAction<ExpandedState>>;
    setRowSelectionState: import('react').Dispatch<import('react').SetStateAction<RowSelectionState>>;
    setColumnPinning: import('react').Dispatch<import('react').SetStateAction<ColumnPinningState>>;
    setDensity: import('react').Dispatch<import('react').SetStateAction<GridDensity>>;
    setColumnAlignment: import('react').Dispatch<import('react').SetStateAction<Record<string, "left" | "right" | "center">>>;
    columnDecimals: Record<string, number>;
    setColumnDecimals: import('react').Dispatch<import('react').SetStateAction<Record<string, number>>>;
    resetState: () => void;
};
//# sourceMappingURL=useGridEngine.d.ts.map