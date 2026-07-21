import { Table } from '@tanstack/react-table';
import { CsvExportParams } from '../types';
export declare function exportToCsv<TData>(table: Table<TData>, params?: CsvExportParams): void;
export declare function generateCsvString<TData>(table: Table<TData>, params?: Omit<CsvExportParams, 'fileName'>): string;
//# sourceMappingURL=csvExport.d.ts.map