import { Table } from '@tanstack/react-table';
import { downloadBlob } from './exportUtils';
import { getColumnHeader } from '../core/gridUtils';
import type { ExcelExportParams } from '../types';

export async function exportToExcel<TData>(
  table: Table<TData>,
  params?: ExcelExportParams
): Promise<void> {
  const {
    fileName = 'export.xlsx',
    sheetName = 'Sheet1',
    includeHeaders = true,
    onlySelected = false,
    columnIds,
  } = params || {};

  const ExcelJS = await import('exceljs');
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  const columns = table.getAllLeafColumns().filter((col) => {
    if (!col.getIsVisible()) return false;
    if (columnIds && !columnIds.includes(col.id)) return false;
    return true;
  });

  const maxLengths = columns.map(() => 0);

  if (includeHeaders) {
    const headers = columns.map((col) => getColumnHeader(col));
    const headerRow = worksheet.addRow(headers);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE5E7EB' },
    };
    headerRow.border = {
      bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } },
    };
    headers.forEach((h, i) => { maxLengths[i] = h.length; });
  }

  const rows = onlySelected
    ? table.getSelectedRowModel().rows
    : table.getFilteredRowModel().rows;

  for (const row of rows) {
    if (row.getIsGrouped()) continue;
    const values = columns.map((col, i) => {
      const value = row.getValue(col.id);
      const val = value ?? '';
      const len = String(val).length;
      if (len > (maxLengths[i] ?? 0)) maxLengths[i] = len;
      return val;
    });
    worksheet.addRow(values);
  }

  columns.forEach((_, index) => {
    worksheet.getColumn(index + 1).width = Math.min((maxLengths[index] ?? 0) + 4, 50);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  downloadBlob(
    new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
    fileName
  );
}
