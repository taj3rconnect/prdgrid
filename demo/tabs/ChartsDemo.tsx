import { DataGrid } from '../../src';
import type { ColumnDef } from '../../src';
import { generateCandidates, type Candidate } from '../sampleData';
import { useSeedData } from '../useSeedData';
import { Section } from '../Section';

export function ChartsDemo() {
  const data = useSeedData('candidates', () => generateCandidates(300));

  const cols: ColumnDef<Candidate>[] = [
    { field: 'name', headerName: 'Candidate', dataType: 'text', width: 170 },
    { field: 'stage', headerName: 'Stage', dataType: 'select', width: 130 },
    { field: 'client', headerName: 'Client', dataType: 'select', width: 150 },
    { field: 'role', headerName: 'Role', dataType: 'select', width: 190 },
    { field: 'recruiter', headerName: 'Recruiter', dataType: 'user', width: 160 },
    { field: 'salary', headerName: 'Salary', dataType: 'currency', width: 130 },
    { field: 'billRate', headerName: 'Bill Rate', dataType: 'currency', width: 110 },
    { field: 'margin', headerName: 'Margin', dataType: 'percent', width: 110, dataBar: true },
    { field: 'yearsExp', headerName: 'Yrs Exp', dataType: 'number', width: 90 },
  ];

  return (
    <Section title="Charts View"
      subtitle="Toggle Grid | Charts in the toolbar. Charts aggregate the currently filtered rows live — type in the search box and watch them update. Add your own with '+ Add chart'."
      tags={['Grid ↔ Charts Toggle', 'Bar / Line / Area / Donut', 'Live Filter-Driven', 'PNG Download', 'SVG — No Dependencies']}>
      <DataGrid<Candidate>
        gridId="charts-demo" rowData={data} columnDefs={cols}
        defaultColDef={{ sortable: true, resizable: true, minWidth: 60 }}
        getRowId={d => String(d.id)} rowSelection="multiple"
        pagination paginationPageSize={50} floatingFilters statusBar height={640}
        defaultCharts={[
          { id: 'by-stage', type: 'bar', categoryColId: 'stage', seriesColIds: [], aggregation: 'count' },
          { id: 'salary-by-role', type: 'bar', categoryColId: 'role', seriesColIds: ['salary'], aggregation: 'avg' },
          { id: 'by-client', type: 'donut', categoryColId: 'client', seriesColIds: [], aggregation: 'count' },
          { id: 'margin-by-recruiter', type: 'line', categoryColId: 'recruiter', seriesColIds: ['margin'], aggregation: 'avg' },
        ]}
      />
    </Section>
  );
}
