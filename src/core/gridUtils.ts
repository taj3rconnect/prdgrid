import { Table, ColumnDef as TanStackColumnDef } from '@tanstack/react-table';
import type { SortEntry, GridDensity } from '../types';
import type { SortingState, ColumnFiltersState } from '@tanstack/react-table';

// ─── Sort mapping ───────────────────────────────────────────────────

export function sortingToEntries(sorting: SortingState): SortEntry[] {
  return sorting.map((s) => ({ colId: s.id, sort: s.desc ? 'desc' as const : 'asc' as const }));
}

export function entriesToSorting(entries: SortEntry[]): SortingState {
  return entries.map((s) => ({ id: s.colId, desc: s.sort === 'desc' }));
}

// ─── Filter mapping ─────────────────────────────────────────────────

export function filtersToRecord(filters: ColumnFiltersState): Record<string, any> {
  return Object.fromEntries(filters.map((f) => [f.id, f.value]));
}

export function recordToFilters(record: Record<string, any>): ColumnFiltersState {
  return Object.entries(record).map(([id, value]) => ({ id, value }));
}

// ─── Column header name ─────────────────────────────────────────────

export function getColumnHeader<TData>(col: { columnDef: TanStackColumnDef<TData, any>; id: string }): string {
  const header = col.columnDef.header;
  return typeof header === 'string' ? header : col.id;
}

// ─── Column reorder ─────────────────────────────────────────────────

export function reorderColumn<TData>(table: Table<TData>, fromId: string, toId: string): void {
  const currentOrder = table.getState().columnOrder;
  const allIds = table.getAllLeafColumns().map((c) => c.id);
  const order = currentOrder.length > 0 ? [...currentOrder] : [...allIds];
  const fromIndex = order.indexOf(fromId);
  const toIndex = order.indexOf(toId);
  if (fromIndex !== -1 && toIndex !== -1) {
    order.splice(fromIndex, 1);
    order.splice(toIndex, 0, fromId);
    table.setColumnOrder(order);
  }
}

// ─── Density padding class ──────────────────────────────────────────

const DENSITY_PADDING: Record<GridDensity, string> = {
  compact: 'py-1',
  normal: 'py-2',
  comfortable: 'py-3',
};

export function densityPadding(density: GridDensity): string {
  return DENSITY_PADDING[density];
}
