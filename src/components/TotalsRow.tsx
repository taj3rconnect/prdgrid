import { useMemo } from 'react';
import { Table } from '@tanstack/react-table';
import { aggregate } from '../charts/aggregate';
import { isNumericDataType } from '../core/useGridEngine';
import type { ColumnMeta, TotalsRowConfig } from '../types';

interface TotalsRowProps<TData> {
  table: Table<TData>;
  config: TotalsRowConfig;
  columnAlignment?: Record<string, 'left' | 'center' | 'right'>;
  columnDecimals?: Record<string, number>;
}

export function TotalsRow<TData>({ table, config, columnAlignment, columnDecimals }: TotalsRowProps<TData>) {
  const aggFunc = config.aggFunc || 'sum';
  const label = config.label || 'Total';

  const visibleColumns = table.getVisibleLeafColumns();
  const rows = table.getFilteredRowModel().rows;

  const totals = useMemo(() => {
    const result = new Map<string, number>();
    for (const col of visibleColumns) {
      const meta = col.columnDef.meta as ColumnMeta | undefined;
      const isNumeric = meta?.autoNumeric || isNumericDataType(meta?.dataType) || meta?.filterType === 'number';
      if (!isNumeric || meta?.isSelectColumn) continue;
      const values: number[] = [];
      for (const row of rows) {
        if (row.getIsGrouped()) continue;
        const val = Number(row.getValue(col.id));
        if (!isNaN(val)) values.push(val);
      }
      if (values.length > 0) result.set(col.id, aggregate(aggFunc, values));
    }
    return result;
  }, [visibleColumns, rows, aggFunc]);

  const firstDataColId = visibleColumns.find(
    (c) => !(c.columnDef.meta as ColumnMeta | undefined)?.isSelectColumn
  )?.id;

  return (
    <tfoot className="jt-totals sticky bottom-0 z-20">
      <tr>
        {visibleColumns.map((col) => {
          const meta = col.columnDef.meta as ColumnMeta | undefined;
          const isPinned = col.getIsPinned();
          const pinStyle: React.CSSProperties = {};
          if (isPinned === 'left') pinStyle.left = col.getStart('left');
          if (isPinned === 'right') pinStyle.right = col.getAfter('right');
          const total = totals.get(col.id);
          const decimals = columnDecimals?.[col.id];
          return (
            <td
              key={col.id}
              className={isPinned ? 'jt-totals-cell sticky z-10' : 'jt-totals-cell'}
              style={{
                width: col.getSize(),
                textAlign: columnAlignment?.[col.id] || (total !== undefined ? 'right' : 'left'),
                ...pinStyle,
              }}
              title={total !== undefined ? `${aggFunc} of ${rows.length.toLocaleString()} rows` : undefined}
            >
              {meta?.isSelectColumn ? (
                ''
              ) : total !== undefined ? (
                total.toLocaleString('en-US', {
                  minimumFractionDigits: decimals ?? 0,
                  maximumFractionDigits: decimals ?? 2,
                })
              ) : col.id === firstDataColId ? (
                <span className="uppercase tracking-wide text-[10px]">{label} ({aggFunc})</span>
              ) : (
                ''
              )}
            </td>
          );
        })}
      </tr>
    </tfoot>
  );
}
