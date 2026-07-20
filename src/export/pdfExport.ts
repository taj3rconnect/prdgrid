import { Table } from '@tanstack/react-table';
import { getColumnHeader } from '../core/gridUtils';
import { downloadBlob } from './exportUtils';
import type { ColumnMeta, PdfExportParams } from '../types';

function formatCellValue<TData>(col: any, row: any): string {
  const value = row.getValue(col.id);
  const meta = col.columnDef.meta as ColumnMeta<TData> | undefined;
  if (meta?.valueFormatter && value !== undefined && value !== null) {
    return meta.valueFormatter({
      value,
      data: row.original,
      colDef: meta.colDef || ({} as any),
      rowIndex: row.index,
    });
  }
  if (meta?.autoNumeric && value != null && !isNaN(Number(value))) {
    return Number(value).toLocaleString('en-US');
  }
  if (Array.isArray(value)) return value.join(', ');
  return value == null ? '' : String(value);
}

function exportColumns<TData>(table: Table<TData>, columnIds?: string[]) {
  return table.getAllLeafColumns().filter((col) => {
    if (!col.getIsVisible()) return false;
    if ((col.columnDef.meta as ColumnMeta | undefined)?.isSelectColumn) return false;
    if (columnIds && !columnIds.includes(col.id)) return false;
    return true;
  });
}

export async function exportToPdf<TData>(table: Table<TData>, params?: PdfExportParams): Promise<void> {
  const { fileName = 'export.pdf', ...rest } = params || {};
  const base64 = await generatePdfBase64(table, rest);
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  downloadBlob(new Blob([bytes], { type: 'application/pdf' }), fileName);
}

export async function generatePdfBase64<TData>(
  table: Table<TData>,
  params?: Omit<PdfExportParams, 'fileName'>
): Promise<string> {
  const { title, subtitle, onlySelected = false, columnIds } = params || {};

  const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ]);

  const columns = exportColumns(table, columnIds);
  const rows = (onlySelected ? table.getSelectedRowModel().rows : table.getFilteredRowModel().rows).filter(
    (row) => !row.getIsGrouped()
  );

  const headers = columns.map((col) => getColumnHeader(col));
  const body = rows.map((row) => columns.map((col) => formatCellValue(col, row)));

  const orientation = columns.length > 6 ? 'landscape' : 'portrait';
  const doc = new jsPDF({ orientation, unit: 'mm', format: 'a4' });

  let startY = 15;
  if (title) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 14, startY);
    startY += 8;
  }
  if (subtitle) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(subtitle, 14, startY);
    startY += 6;
  }

  autoTable(doc, {
    head: [headers],
    body,
    startY,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [47, 111, 224], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    margin: { left: 14, right: 14 },
  });

  return doc.output('datauristring').split(',')[1]!;
}

/** Inline HTML table for email bodies */
export function generateHtmlTable<TData>(table: Table<TData>, title?: string, subtitle?: string): string {
  const columns = exportColumns(table);
  const rows = table.getFilteredRowModel().rows.filter((r) => !r.getIsGrouped());

  const thStyle = `padding: 8px 12px; text-align: left; background: #2f6fe0; color: #fff; font-size: 12px; font-weight: 600;`;
  const tdStyle = `padding: 6px 12px; font-size: 11px; border-bottom: 1px solid #e5e7eb;`;

  const headers = columns.map((c) => `<th style="${thStyle}">${getColumnHeader(c)}</th>`).join('');
  const bodyRows = rows
    .map((row, i) => {
      const bg = i % 2 === 0 ? '#ffffff' : '#f9fafb';
      const cells = columns.map((col) => `<td style="${tdStyle}">${formatCellValue(col, row)}</td>`).join('');
      return `<tr style="background:${bg}">${cells}</tr>`;
    })
    .join('');

  const headerHtml = title
    ? `<h2 style="font-family:sans-serif;margin:0 0 4px;font-size:16px;color:#111827">${title}</h2>${subtitle ? `<p style="font-family:sans-serif;margin:0 0 12px;font-size:12px;color:#6b7280">${subtitle}</p>` : ''}`
    : '';

  return `${headerHtml}<table style="border-collapse:collapse;width:100%;font-family:-apple-system,sans-serif"><thead><tr>${headers}</tr></thead><tbody>${bodyRows}</tbody></table>`;
}
