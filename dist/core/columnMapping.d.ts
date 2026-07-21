import { ColumnDef as TanStackColumnDef } from '@tanstack/react-table';
import { ColumnDef } from '../types';
/**
 * Default heuristic for "this column holds money/amounts" (auto right-align +
 * numeric formatting). Consumers with different domain vocabularies override it
 * per grid via the `amountFieldPattern` prop instead of editing this regex.
 */
export declare const AMOUNT_FIELD_PATTERN: RegExp;
export declare function formatWithDecimals(value: any, decimals: number): string;
export declare function isAmountField(field?: string, headerName?: string, pattern?: RegExp): boolean;
export { isNumericDataType, defaultFilterForDataType } from './dataTypeRegistry';
export declare function mapColumnDef<TData>(col: ColumnDef<TData>, defaultColDef?: Partial<ColumnDef<TData>>, gridEnableRowGroup?: boolean, amountPattern?: RegExp): TanStackColumnDef<TData, any>;
//# sourceMappingURL=columnMapping.d.ts.map