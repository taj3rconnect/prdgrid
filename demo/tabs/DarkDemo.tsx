import { DataGrid } from '../../src';
import type { ColumnDef } from '../../src';
import { generateHREmployees, type HREmployee } from '../sampleData';
import { useSeedData } from '../useSeedData';
import { Section } from '../Section';
import { EmployeeCell, DeptChip, LocationCell, PaymentStatusBadge } from '../renderers';

export function DarkDemo() {
  const data = useSeedData('employees', generateHREmployees);
  const cols: ColumnDef<HREmployee>[] = [
    { field: 'name', headerName: 'Employee', width: 280, sortable: true, filter: 'text',
      cellRenderer: EmployeeCell },
    { field: 'department', headerName: 'Department', width: 200, sortable: true, filter: 'set', enableRowGroup: true,
      cellRenderer: DeptChip },
    { field: 'location', headerName: 'Location', width: 200, sortable: true, filter: 'set',
      cellRenderer: LocationCell },
    { field: 'salary', headerName: 'Salary', width: 140, sortable: true,
      valueFormatter: ({ value }) => `$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      cellStyle: () => ({ fontFamily: 'var(--mono)', textAlign: 'right' }) },
    { field: 'paymentStatus', headerName: 'Status', width: 120,
      cellRenderer: PaymentStatusBadge },
  ];

  return (
    <Section title="Dark Theme" subtitle={'One prop: theme="dark". CSS custom properties power the entire theme system.'}
      tags={['Dark Mode', 'CSS Variables', 'Zero Config']}>
      <div className="rounded-xl bg-gray-950 p-5">
        <DataGrid<HREmployee>
          gridId="dark-demo" rowData={data} columnDefs={cols}
          defaultColDef={{ sortable: true, resizable: true }}
          getRowId={d => String(d.id)} rowSelection="multiple"
          pagination paginationPageSize={15} statusBar
          theme="dark" height={460} rowHeight={65}
          toolbar={{ search: true, columnManager: true, export: { csv: true }, density: true }}
        />
      </div>
    </Section>
  );
}
