import { useMemo } from 'react';
import { Table } from '@tanstack/react-table';
import type { ColumnMeta, GridDensity } from '../types';
import { densityPadding } from '../core/gridUtils';

export type TotalsAggFunc = 'sum' | 'avg' | 'count' | 'min' | 'max';

export interface TotalsRowConfig {
  /** Which aggregation to show. Default: 'sum' */
  aggFunc?: TotalsAggFunc;
  /** Label in the first column. Default: 'Total' */
  label?: string;
}

interface TotalsRowProps<TData> {
  table: Table<TData>;
  config: TotalsRowConfig;
  showSelectionColumn: boolean;
  density: GridDensity;
  columnAlignment?: Record<string, 'left' | 'center' | 'right'>;
}

function computeAgg(values: number[], func: TotalsAggFunc): number | null {
  if (values.length === 0) return null;
  switch (func) {
    case 'sum': return values.reduce((a, b) => a + b, 0);
    case 'avg': return values.reduce((a, b) => a + b, 0) / values.length;
    case 'count': return values.length;
    case 'min': return Math.min(...values);
    case 'max': return Math.max(...values);
  }
}

function fmt(n: number): string {
  return n.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

export function TotalsRow<TData>({
  table,
  config,
  showSelectionColumn,
  density,
  columnAlignment,
}: TotalsRowProps<TData>) {
  const aggFunc = config.aggFunc || 'sum';
  const label = config.label || 'Total';
  const padClass = densityPadding(density);

  const visibleColumns = table.getVisibleLeafColumns();
  const rows = table.getFilteredRowModel().rows;

  const totals = useMemo(() => {
    const result = new Map<string, number | null>();

    for (const col of visibleColumns) {
      const meta = col.columnDef.meta as ColumnMeta | undefined;
      const isNumeric = meta?.autoNumeric || meta?.filterType === 'number';

      if (!isNumeric) {
        result.set(col.id, null);
        continue;
      }

      const values: number[] = [];
      for (const row of rows) {
        const val = Number(row.getValue(col.id));
        if (!isNaN(val)) values.push(val);
      }
      result.set(col.id, computeAgg(values, aggFunc));
    }

    return result;
  }, [visibleColumns, rows, aggFunc]);

  return (
    <tfoot className="jt-totals sticky bottom-0 z-10">
      <tr className="border-t-2 border-grid-border bg-gray-100 font-semibold text-grid-sm">
        {showSelectionColumn && (
          <td className={`w-10 border-r border-grid-border px-2 text-center ${padClass}`} />
        )}
        {visibleColumns.map((col, i) => {
          const val = totals.get(col.id) ?? null;
          const align = columnAlignment?.[col.id];

          // First non-null column shows the label
          if (i === 0 && val === null) {
            return (
              <td
                key={col.id}
                className={`border-r border-grid-border px-3 text-grid-text ${padClass}`}
                style={{ width: col.getSize() }}
              >
                {label}
              </td>
            );
          }

          return (
            <td
              key={col.id}
              className={`border-r border-grid-border px-3 text-grid-text ${padClass}`}
              style={{
                width: col.getSize(),
                textAlign: align || (val !== null ? 'right' : undefined),
                fontFamily: val !== null ? 'monospace' : undefined,
              }}
            >
              {val !== null ? fmt(val) : ''}
            </td>
          );
        })}
      </tr>
    </tfoot>
  );
}
