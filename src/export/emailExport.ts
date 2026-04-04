import { Table } from '@tanstack/react-table';
import { generateCsvString } from './csvExport';
import type { EmailExportParams } from '../types';

export async function emailExport<TData>(
  table: Table<TData>,
  params: EmailExportParams
): Promise<void> {
  const { to, subject = 'Grid Report', body = '', endpoint } = params;

  const csv = generateCsvString(table);
  const fileContent = new Blob([csv], { type: 'text/csv' });

  const formData = new FormData();
  formData.append('to', JSON.stringify(to));
  formData.append('subject', subject);
  formData.append('body', body);
  formData.append('file', fileContent, 'report.csv');

  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Email export failed: ${response.statusText}`);
  }
}
