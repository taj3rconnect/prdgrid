import { DataGrid } from '../../src';
import type { ColumnDef } from '../../src';
import { generateGameData, type GameRow } from '../sampleData';
import { useSeedData } from '../useSeedData';
import { Section, GroupingHint } from '../Section';
import { StarRating, CountryCell, BoughtCell } from '../renderers';

const monthCol = (field: string, headerName: string): ColumnDef<GameRow> => ({
  field, headerName, width: 100, sortable: true,
  valueFormatter: ({ value }) => `$${Number(value).toLocaleString()}`,
  cellStyle: () => ({ fontFamily: 'var(--mono)', textAlign: 'right', fontSize: '12px', color: '#6b7280' }),
});

export function PerformanceDemo() {
  const data = useSeedData('games', () => generateGameData(1000));

  const cols: ColumnDef<GameRow>[] = [
    // Participant group
    { field: 'name', headerName: 'NAME', width: 180, sortable: true, filter: 'text',
      cellStyle: () => ({ fontWeight: 600 }) },
    { field: 'language', headerName: 'LANGUAGE', width: 130, sortable: true, filter: 'set', enableRowGroup: true },
    { field: 'country', headerName: 'COUNTRY', width: 200, sortable: true, filter: 'set', enableRowGroup: true,
      cellRenderer: CountryCell },
    // Game of Choice group
    { field: 'gameName', headerName: 'GAME', width: 140, sortable: true, filter: 'set', enableRowGroup: true },
    { field: 'bought', headerName: 'BOUGHT', width: 90, sortable: true,
      cellRenderer: BoughtCell, cellStyle: () => ({ textAlign: 'center' }) },
    // Performance group
    { field: 'bankBalance', headerName: 'BANK BALANCE', width: 150, sortable: true, filter: 'number', aggFunc: 'avg',
      valueFormatter: ({ value }) => `$${Number(value).toLocaleString()}`,
      cellStyle: ({ value }) => ({
        fontFamily: 'var(--mono)', textAlign: 'right',
        color: Number(value) > 25000 ? '#2563eb' : undefined,
        fontWeight: Number(value) > 25000 ? 600 : undefined,
      }) },
    { field: 'rating', headerName: 'RATING', width: 140, sortable: true, filter: 'number', aggFunc: 'avg',
      cellRenderer: StarRating },
    { field: 'totalWinnings', headerName: 'TOTAL WINNINGS', width: 170, sortable: true, filter: 'number', aggFunc: 'sum',
      valueFormatter: ({ value }) => `$${Number(value).toLocaleString()}`,
      cellStyle: () => ({ fontFamily: 'var(--mono)', textAlign: 'right', fontWeight: 600 }) },
    // Monthly Breakdown
    monthCol('jan', 'JAN'),
    monthCol('feb', 'FEB'),
    monthCol('mar', 'MAR'),
    monthCol('apr', 'APR'),
    monthCol('may', 'MAY'),
    monthCol('jun', 'JUN'),
  ];

  return (
    <Section title="Performance" subtitle="1,000 rows, 14 columns — gaming tournament data with star ratings, country flags, monthly breakdown, and drag-to-group rows"
      tags={['1000 Rows', 'Star Ratings', 'Country Flags', 'Dollar Formatting', 'Aggregation', 'Row Grouping']}>
      <GroupingHint examples="Language, Country, or Game" />
      <DataGrid<GameRow>
        gridId="perf-demo" rowData={data} columnDefs={cols}
        defaultColDef={{ sortable: true, resizable: true, minWidth: 60 }}
        getRowId={d => String(d.id)} rowSelection="multiple"
        pagination paginationPageSize={100} groupPanel floatingFilters statusBar height={620}
        toolbar={{ search: true, columnManager: true, export: { csv: true, excel: true }, density: true }}
      />
    </Section>
  );
}
