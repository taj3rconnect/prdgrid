import { Table, ColumnDef as TanStackColumnDef, SortingState, ColumnFiltersState } from '@tanstack/react-table';
import { SortEntry, GridDensity } from '../types';
export declare function sortingToEntries(sorting: SortingState): SortEntry[];
export declare function entriesToSorting(entries: SortEntry[]): SortingState;
export declare function filtersToRecord(filters: ColumnFiltersState): Record<string, any>;
export declare function recordToFilters(record: Record<string, any>): ColumnFiltersState;
export declare function getColumnHeader<TData>(col: {
    columnDef: TanStackColumnDef<TData, any>;
    id: string;
}): string;
export declare function reorderColumn<TData>(table: Table<TData>, fromId: string, toId: string): void;
export declare const DENSITY_ROW_HEIGHT: Record<GridDensity, number>;
//# sourceMappingURL=gridUtils.d.ts.map