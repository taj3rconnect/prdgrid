import { DataGrid } from '../../src';
import type { ColumnDef } from '../../src';
import { generateCandidates, type Candidate } from '../sampleData';
import { useSeedData } from '../useSeedData';
import { Section, GroupingHint } from '../Section';
import { StageBadge, PriorityCell } from '../renderers';

export function StaffingDemo() {
  const data = useSeedData('candidates', () => generateCandidates(250));

  const cols: ColumnDef<Candidate>[] = [
    { field: 'id', headerName: '#', width: 65, pinned: 'left', cellStyle: () => ({ fontFamily: 'var(--mono)', fontSize: '11px', color: '#9ca3af' }) },
    { field: 'name', headerName: 'Candidate', width: 165, sortable: true, filter: 'text', floatingFilter: true, cellStyle: () => ({ fontWeight: 600 }) },
    { field: 'role', headerName: 'Role', width: 190, sortable: true, filter: 'set', floatingFilter: true, enableRowGroup: true },
    { field: 'client', headerName: 'Client', width: 145, sortable: true, filter: 'set', floatingFilter: true, enableRowGroup: true },
    { field: 'stage', headerName: 'Stage', width: 120, sortable: true, filter: 'set', floatingFilter: true, cellRenderer: StageBadge, enableRowGroup: true },
    { field: 'priority', headerName: 'Priority', width: 100, sortable: true, filter: 'set', floatingFilter: true, cellRenderer: PriorityCell },
    { field: 'source', headerName: 'Source', width: 110, sortable: true, filter: 'set', enableRowGroup: true },
    { field: 'recruiter', headerName: 'Recruiter', width: 130, sortable: true, filter: 'set', floatingFilter: true, enableRowGroup: true },
    { field: 'salary', headerName: 'Salary', width: 115, sortable: true, filter: 'number', aggFunc: 'avg',
      valueFormatter: ({ value }) => `$${Number(value).toLocaleString()}`,
      cellStyle: () => ({ fontFamily: 'var(--mono)', textAlign: 'right' }) },
    { field: 'billRate', headerName: 'Bill Rate', width: 95, sortable: true, filter: 'number', aggFunc: 'avg',
      valueFormatter: ({ value }) => `$${value}/hr`,
      cellStyle: () => ({ fontFamily: 'var(--mono)', textAlign: 'right' }) },
    { field: 'margin', headerName: 'Margin', width: 85, sortable: true,
      valueFormatter: ({ value }) => `${value}%`,
      cellStyle: ({ value }) => ({
        fontFamily: 'var(--mono)', textAlign: 'right', fontWeight: 600,
        color: Number(value) >= 35 ? '#059669' : Number(value) >= 25 ? '#d97706' : '#dc2626',
      }) },
    { field: 'yearsExp', headerName: 'Yrs Exp', width: 80, sortable: true, filter: 'number', cellStyle: () => ({ textAlign: 'center' }) },
    { field: 'skills', headerName: 'Skills', width: 200, filter: 'text' },
    { field: 'submitDate', headerName: 'Submitted', width: 110, sortable: true, filter: 'date' },
    { field: 'notes', headerName: 'Notes', width: 250, editable: true },
  ];

  return (
    <Section title="Staffing Pipeline" subtitle="250 candidates — pipeline stages, bill rates, margin coloring, recruiter tracking, and drag-to-group rows"
      tags={['Pipeline Stages', 'Priority Heat', 'Margin Coloring', 'Bill Rate', 'Row Grouping', 'Pagination']}>
      <GroupingHint examples="Role, Client, Stage, or Recruiter" />
      <DataGrid<Candidate>
        gridId="staffing-demo" rowData={data} columnDefs={cols}
        defaultColDef={{ sortable: true, resizable: true, minWidth: 55 }}
        getRowId={d => String(d.id)} rowSelection="multiple"
        pagination paginationPageSize={50} groupPanel floatingFilters statusBar height={600}
        totalsRow={{ aggFunc: 'sum', label: 'Total' }}
        emailExportEndpoint="/api/report/email"
        scheduleExportEndpoint="/api/report/schedule"
        toolbar={{ search: true, columnManager: true, density: true, export: { csv: true, excel: true, pdf: true, email: true, scheduleEmail: true } }}
      />
    </Section>
  );
}
