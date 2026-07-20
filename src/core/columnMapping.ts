import type { ColumnDef as TanStackColumnDef } from '@tanstack/react-table';
import type { ColumnDef } from '../types';

// ─── Value access ────────────────────────────────────────────────────

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
}

let columnCounter = 0;

// ─── Numeric / amount heuristics ─────────────────────────────────────

/**
 * Default heuristic for "this column holds money/amounts" (auto right-align +
 * numeric formatting). Consumers with different domain vocabularies override it
 * per grid via the `amountFieldPattern` prop instead of editing this regex.
 */
export const AMOUNT_FIELD_PATTERN = /\b(amount|price|cost|total|salary|revenue|balance|fee|budget|income|profit|margin|tax|discount|spend|expense|pnl|winnings|billRate|bankBalance|gp|gross|net)\b/i;

export function formatWithDecimals(value: any, decimals: number): string {
  if (value == null || isNaN(value)) return value;
  return Number(value).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function isAmountField(field?: string, headerName?: string, pattern: RegExp = AMOUNT_FIELD_PATTERN): boolean {
  if (field && pattern.test(field)) return true;
  if (headerName && pattern.test(headerName)) return true;
  return false;
}

export { isNumericDataType, defaultFilterForDataType } from './dataTypeRegistry';
import { defaultFilterForDataType, isNumericDataType } from './dataTypeRegistry';

// ─── Column Mapping ──────────────────────────────────────────────────

export function mapColumnDef<TData>(
  col: ColumnDef<TData>,
  defaultColDef?: Partial<ColumnDef<TData>>,
  gridEnableRowGroup?: boolean,
  amountPattern: RegExp = AMOUNT_FIELD_PATTERN
): TanStackColumnDef<TData, any> {
  const merged = { ...defaultColDef, ...col };
  const id = col.colId || col.field || `col_${++columnCounter}`;
  const effectiveFilter = merged.filter !== undefined ? merged.filter : defaultFilterForDataType(merged.dataType);

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
    enableColumnFilter: effectiveFilter !== false && effectiveFilter !== undefined,
    enableGrouping: merged.enableRowGroup === true || gridEnableRowGroup === true,
    enableResizing: merged.resizable !== false,
    enableHiding: merged.lockVisible !== true,
    size: merged.width || 150,
    minSize: merged.minWidth || 50,
    maxSize: merged.maxWidth || 1000,
    meta: {
      colDef: col,
      mergedColDef: merged,
      filterType: effectiveFilter,
      dataType: merged.dataType,
      sparkline: merged.sparkline,
      dataBar: merged.dataBar,
      cellColorRules: merged.cellColorRules,
      editorType: merged.cellEditor,
      editable: merged.editable,
      pinned: merged.pinned,
      cellRenderer: merged.cellRenderer,
      cellRendererParams: merged.cellRendererParams,
      headerRenderer: merged.headerRenderer,
      cellClass: merged.cellClass,
      cellStyle: merged.cellStyle,
      valueFormatter: merged.valueFormatter || undefined,
      autoNumeric:
        !merged.valueFormatter &&
        (effectiveFilter === 'number' ||
          isNumericDataType(merged.dataType) ||
          isAmountField(merged.field, merged.headerName, amountPattern)),
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
      if (!merged.valueFormatter && (isAmountField(merged.field, merged.headerName, amountPattern) || merged.filter === 'number')) {
        return formatWithDecimals(val, 0);
      }
      return val;
    };
  }

  if (col.children && col.children.length > 0) {
    (tanstackCol as any).columns = col.children.map((child) =>
      mapColumnDef(child, defaultColDef, gridEnableRowGroup, amountPattern)
    );
  }

  return tanstackCol;
}
