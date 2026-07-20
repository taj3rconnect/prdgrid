import { useState, useEffect } from 'react';
import { DataGrid } from '../../src';
import type { ColumnDef } from '../../src';
import { generateFinanceData, tickFinanceData, type FinanceRow } from '../sampleData';
import { useSeedData } from '../useSeedData';
import { Section } from '../Section';
import { TickerCell, SparklineBar, DeltaValueCell } from '../renderers';

export function FinanceDemo() {
  const seed = useSeedData('finance', generateFinanceData);
  const [data, setData] = useState(seed);
  useEffect(() => setData(seed), [seed]);

  // Real-time ticking every 1.5s
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => tickFinanceData(prev));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const cols: ColumnDef<FinanceRow>[] = [
    { field: 'ticker', headerName: 'TICKER', width: 300, sortable: true, filter: 'text',
      cellRenderer: TickerCell },
    { field: 'timeline', headerName: 'TIMELINE', width: 200,
      cellRenderer: SparklineBar },
    { field: 'instrument', headerName: 'INSTRUMENT', width: 150, sortable: true, filter: 'set',
      cellStyle: () => ({ textAlign: 'right', fontSize: '13px' }) },
    { field: 'pnl', headerName: 'P&L', width: 220, sortable: true, filter: 'number',
      cellRenderer: DeltaValueCell },
    { field: 'totalValue', headerName: 'TOTAL VALUE', width: 250, sortable: true, filter: 'number',
      cellRenderer: DeltaValueCell },
    { field: 'quantity', headerName: 'QUANTITY', width: 150, sortable: true,
      valueFormatter: ({ value }) => Number(value).toLocaleString(),
      cellStyle: () => ({ fontFamily: 'var(--mono)', textAlign: 'right' }) },
  ];

  return (
    <Section title="Finance Portfolio" subtitle="34 instruments with live ticking prices, SVG bar sparklines, and animated P&L delta arrows"
      tags={['Live Updates', 'Bar Sparklines', 'P&L Arrows', 'Delta Coloring', 'Real-time Ticking']}>
      <DataGrid<FinanceRow>
        gridId="finance-demo" rowData={data} columnDefs={cols}
        defaultColDef={{ sortable: true, resizable: true }}
        getRowId={d => d.ticker} statusBar height={600}
        toolbar={{ search: true, export: { csv: true }, density: false }}
      />
    </Section>
  );
}
