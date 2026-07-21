import { ColumnDataType, FilterType } from '../types';
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
export declare const DATA_TYPE_REGISTRY: Record<ColumnDataType, DataTypeTraits>;
export declare function isNumericDataType(dataType?: ColumnDataType): boolean;
/** Default filter type inferred from a column's dataType (explicit `filter` always wins) */
export declare function defaultFilterForDataType(dataType?: ColumnDataType): FilterType | undefined;
/** Format a typed value for plain-text display (currency/percent prefixes etc.) */
export declare function formatTypedValue(dataType: ColumnDataType | undefined, value: any, decimals?: number): string | null;
//# sourceMappingURL=dataTypeRegistry.d.ts.map