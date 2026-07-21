import { Table } from '@tanstack/react-table';
import { PdfExportParams } from '../types';
export declare function exportToPdf<TData>(table: Table<TData>, params?: PdfExportParams): Promise<void>;
export declare function generatePdfBase64<TData>(table: Table<TData>, params?: Omit<PdfExportParams, 'fileName'>): Promise<string>;
/** Inline HTML table for email bodies */
export declare function generateHtmlTable<TData>(table: Table<TData>, title?: string, subtitle?: string): string;
//# sourceMappingURL=pdfExport.d.ts.map