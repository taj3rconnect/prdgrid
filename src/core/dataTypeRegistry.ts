import type { ColumnDataType, FilterType } from '../types';

/**
 * Single authority for per-dataType data semantics: numeric-ness, the default
 * filter, and plain-text formatting. Component-level concerns (header icon,
 * typed cell renderer) live in components/renderers.tsx keyed by the same
 * ColumnDataType — add new types in BOTH places.
 */
export interface DataTypeTraits {
  /** Numeric types get right alignment, number filters, decimal controls */
  numeric: boolean;
  /** Filter used when the column doesn't set one explicitly */
  defaultFilter?: FilterType;
  /** Plain-text formatter (currency/percent prefixes); undefined = raw value */
  format?: (n: number, decimals?: number) => string;
}

export const DATA_TYPE_REGISTRY: Record<ColumnDataType, DataTypeTraits> = {
  text: { numeric: false, defaultFilter: 'text' },
  number: { numeric: true, defaultFilter: 'number' },
  currency: {
    numeric: true,
    defaultFilter: 'number',
    format: (n, decimals) =>
      `$${n.toLocaleString('en-US', { minimumFractionDigits: decimals ?? 2, maximumFractionDigits: decimals ?? 2 })}`,
  },
  percent: {
    numeric: true,
    defaultFilter: 'number',
    format: (n, decimals) =>
      `${n.toLocaleString('en-US', { minimumFractionDigits: decimals ?? 0, maximumFractionDigits: decimals ?? 1 })}%`,
  },
  progress: { numeric: true, defaultFilter: 'number' },
  rating: { numeric: true, defaultFilter: 'number' },
  date: { numeric: false, defaultFilter: 'date' },
  select: { numeric: false, defaultFilter: 'set' },
  multiSelect: { numeric: false, defaultFilter: 'set' },
  user: { numeric: false, defaultFilter: 'set' },
  link: { numeric: false, defaultFilter: 'text' },
  checkbox: { numeric: false },
};

export function isNumericDataType(dataType?: ColumnDataType): boolean {
  return dataType != null && DATA_TYPE_REGISTRY[dataType]?.numeric === true;
}

/** Default filter type inferred from a column's dataType (explicit `filter` always wins) */
export function defaultFilterForDataType(dataType?: ColumnDataType): FilterType | undefined {
  return dataType != null ? DATA_TYPE_REGISTRY[dataType]?.defaultFilter : undefined;
}

/** Format a typed value for plain-text display (currency/percent prefixes etc.) */
export function formatTypedValue(dataType: ColumnDataType | undefined, value: any, decimals?: number): string | null {
  if (dataType == null || value == null || value === '' || isNaN(Number(value))) return null;
  return DATA_TYPE_REGISTRY[dataType]?.format?.(Number(value), decimals) ?? null;
}
