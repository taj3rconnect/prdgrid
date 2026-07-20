import { useState, useRef } from 'react';
import { DataGrid } from '../../src';
import type { ColumnDef, GridApi } from '../../src';
import { generateHREmployees, type HREmployee } from '../sampleData';
import { useSeedData } from '../useSeedData';
import { Section } from '../Section';
import { DeptChip, PaymentStatusBadge } from '../renderers';

export function APIDemo() {
  const data = useSeedData('employees', generateHREmployees);
  const gridRef = useRef<GridApi<HREmployee>>(null);
  const [output, setOutput] = useState('Click any button to call the Grid API...');

  const cols: ColumnDef<HREmployee>[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Name', width: 160 },
    { field: 'department', headerName: 'Dept', width: 180, filter: 'set', cellRenderer: DeptChip },
    { field: 'salary', headerName: 'Salary', width: 120, valueFormatter: ({ value }) => `$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
    { field: 'paymentStatus', headerName: 'Status', width: 120, cellRenderer: PaymentStatusBadge },
  ];

  return (
    <Section title="Programmatic API" subtitle="Full imperative control via GridApi ref — sorting, filtering, selection, export, state management."
      tags={['GridApi', 'useRef', 'Imperative', 'selectAll()', 'exportCsv()', 'getState()']}>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-1.5 mb-3">
        {[
          ['selectAll()', () => { gridRef.current?.selectAll(); setOutput('api.selectAll() — all rows selected'); }],
          ['deselectAll()', () => { gridRef.current?.deselectAll(); setOutput('api.deselectAll()'); }],
          ['getSelectedRows()', () => { const r = gridRef.current?.getSelectedRows() || []; setOutput(`→ ${r.length} rows [${r.slice(0, 2).map(x => x.name).join(', ')}${r.length > 2 ? '...' : ''}]`); }],
          ['Sort: Salary ↓', () => { gridRef.current?.setSortModel([{ colId: 'salary', sort: 'desc' }]); setOutput('api.setSortModel([{colId:"salary", sort:"desc"}])'); }],
          ['Quick Filter', () => { gridRef.current?.setQuickFilter('Paid'); setOutput('api.setQuickFilter("Paid")'); }],
          ['Clear Filter', () => { gridRef.current?.setQuickFilter(''); setOutput('api.setQuickFilter("")'); }],
          ['Export CSV', () => { gridRef.current?.exportCsv(); setOutput('api.exportCsv() → downloading...'); }],
          ['getState()', () => { const s = gridRef.current?.getState(); setOutput(`sorting: ${JSON.stringify(s?.sorting)}`); }],
          ['resetState()', () => { gridRef.current?.resetState(); setOutput('api.resetState() → defaults restored'); }],
        ].map(([label, fn]) => (
          <button key={label as string}
            className="rounded-md bg-blue-50 px-2.5 py-1.5 text-[11px] font-semibold text-blue-700 ring-1 ring-inset ring-blue-600/20 hover:bg-blue-100"
            onClick={fn as () => void}>{label as string}</button>
        ))}
      </div>
      <div className="mb-3 rounded-lg bg-gray-900 px-4 py-2.5 font-mono text-[12px] text-green-400 shadow-inner">
        <span className="text-gray-500">❯ </span>{output}
      </div>
      <DataGrid<HREmployee>
        ref={gridRef} gridId="api-demo" rowData={data} columnDefs={cols}
        defaultColDef={{ sortable: true, resizable: true }}
        getRowId={d => String(d.id)} rowSelection="multiple" height={340} statusBar
      />
    </Section>
  );
}
