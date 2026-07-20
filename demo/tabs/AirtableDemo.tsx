import { useState } from 'react';
import { DataGrid } from '../../src';
import type { ColumnDef } from '../../src';
import { generateCandidates, type Candidate } from '../sampleData';
import { useSeedData } from '../useSeedData';
import { Section } from '../Section';

export function AirtableDemo() {
  const [refreshKey, setRefreshKey] = useState(0);
  const data = useSeedData('candidates', () => generateCandidates(150), refreshKey);

  const cols: ColumnDef<Candidate>[] = [
    { field: 'name', headerName: 'Candidate', dataType: 'text', width: 170, pinned: 'left',
      cellStyle: () => ({ fontWeight: 600 }) },
    { field: 'recruiter', headerName: 'Recruiter', dataType: 'user', width: 160 },
    { field: 'stage', headerName: 'Stage', dataType: 'select', width: 130 },
    { field: 'priority', headerName: 'Priority', dataType: 'select', width: 110 },
    { field: 'skills', headerName: 'Skills', dataType: 'multiSelect', width: 260 },
    { field: 'role', headerName: 'Role', dataType: 'select', width: 190 },
    { field: 'client', headerName: 'Client', dataType: 'select', width: 150 },
    { field: 'salary', headerName: 'Salary', dataType: 'currency', width: 130 },
    { field: 'margin', headerName: 'Margin', dataType: 'percent', width: 110, dataBar: true },
    { colId: 'rating', headerName: 'Rating', dataType: 'rating', width: 130,
      valueGetter: ({ data: d }) => Math.min(5, Math.max(1, Math.round((d as Candidate).yearsExp / 4))) },
    { colId: 'placed', headerName: 'Placed', dataType: 'checkbox', width: 90,
      valueGetter: ({ data: d }) => (d as Candidate).stage === 'Placed' },
    { field: 'email', headerName: 'Email', dataType: 'link', width: 210,
      valueFormatter: ({ value }) => String(value ?? '') },
    { field: 'submitDate', headerName: 'Submitted', dataType: 'date', width: 120 },
  ];

  return (
    <Section title="Airtable-Style Grid"
      subtitle="Typed columns with field icons, colored chips, ratings, progress bars, avatars, conditional row coloring, and record expand — hover a row number and click the expand icon"
      tags={['Field Types', 'Chips', 'Ratings', 'Data Bars', 'Avatars', 'Row Color Rules', 'Record Expand', 'Theme Switcher']}>
      <DataGrid<Candidate>
        gridId="airtable-demo" rowData={data} columnDefs={cols}
        defaultColDef={{ sortable: true, resizable: true, minWidth: 60 }}
        getRowId={d => String(d.id)} rowSelection="multiple"
        pagination paginationPageSize={50} floatingFilters statusBar height={640}
        persistSettings totalsRow
        onRefresh={() => {
          setRefreshKey((k) => k + 1);
          return new Promise((r) => setTimeout(r, 600));
        }}
        rowColorRules={[
          { when: (d) => d.stage === 'Rejected', color: 'color-mix(in srgb, var(--jt-grid-error) 7%, transparent)', target: 'row' },
          { when: (d) => d.priority === 'Hot', color: 'var(--jt-grid-warning)', target: 'leftBar' },
          { when: (d) => d.stage === 'Placed', color: 'var(--jt-grid-success)', target: 'leftBar' },
        ]}
      />
    </Section>
  );
}
