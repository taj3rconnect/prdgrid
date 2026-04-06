import { Table } from '@tanstack/react-table';
import { downloadBlob } from './exportUtils';
import { getColumnHeader } from '../core/gridUtils';
import type { CsvExportParams, ColumnMeta } from '../types';

export function exportToCsv<TData>(
  table: Table<TData>,
  params?: CsvExportParams
): void {
  const { fileName = 'export.csv', ...rest } = params || {};
  const csv = generateCsvString(table, rest);
  downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8;' }), fileName);
}

export function generateCsvString<TData>(
  table: Table<TData>,
  params?: Omit<CsvExportParams, 'fileName'>
): string {
  const {
    includeHeaders = true,
    onlySelected = false,
    columnIds,
  } = params || {};

  const columns = table.getAllLeafColumns().filter((col) => {
    if (!col.getIsVisible()) return false;
    if (columnIds && !columnIds.includes(col.id)) return false;
    return true;
  });

  const rows = onlySelected
    ? table.getSelectedRowModel().rows
    : table.getFilteredRowModel().rows;

  const lines: string[] = [];

  if (includeHeaders) {
    lines.push(columns.map((col) => escapeCsvField(getColumnHeader(col))).join(','));
  }

  for (const row of rows) {
    if (row.getIsGrouped()) continue;
    const line = columns
      .map((col) => {
        const value = row.getValue(col.id);
        const meta = col.columnDef.meta as ColumnMeta<TData> | undefined;
        let displayValue = value;

        if (meta?.valueFormatter && value !== undefined && value !== null) {
          displayValue = meta.valueFormatter({
            value,
            data: row.original,
            colDef: meta.colDef || ({} as any),
            rowIndex: row.index,
          });
        } else if (meta?.autoNumeric && value != null && !isNaN(Number(value))) {
          displayValue = Number(value).toLocaleString('en-US');
        }

        return escapeCsvField(displayValue);
      })
      .join(',');
    lines.push(line);
  }

  return lines.join('\n');
}

function escapeCsvField(value: any): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}
