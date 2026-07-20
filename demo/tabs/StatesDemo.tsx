import { useState } from 'react';
import { DataGrid } from '../../src';
import type { ColumnDef } from '../../src';
import { generateProducts, type Product } from '../sampleData';
import { Section } from '../Section';

export function StatesDemo() {
  const [loading, setLoading] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [data] = useState(() => generateProducts(8));
  const cols: ColumnDef<Product>[] = [
    { field: 'name', headerName: 'Product', width: 200 },
    { field: 'category', headerName: 'Category', width: 140 },
    { field: 'price', headerName: 'Price', width: 100, valueFormatter: ({ value }) => `$${Number(value).toFixed(2)}` },
  ];

  return (
    <Section title="Loading & Empty States" subtitle="Built-in overlays for loading spinners and empty data."
      tags={['Loading Overlay', 'Empty State', 'Prop Driven']}>
      <div className="flex gap-2 mb-3">
        <button className={`rounded-md px-3 py-1.5 text-xs font-medium ${loading ? 'bg-red-600 text-white' : 'bg-white text-gray-700 ring-1 ring-gray-300'}`}
          onClick={() => setLoading(!loading)}>{loading ? 'Stop Loading' : 'Show Loading'}</button>
        <button className={`rounded-md px-3 py-1.5 text-xs font-medium ${empty ? 'bg-red-600 text-white' : 'bg-white text-gray-700 ring-1 ring-gray-300'}`}
          onClick={() => setEmpty(!empty)}>{empty ? 'Show Data' : 'Show Empty'}</button>
      </div>
      <DataGrid<Product> rowData={empty ? [] : data} columnDefs={cols}
        defaultColDef={{ sortable: true, resizable: true }} loading={loading} height={280} />
    </Section>
  );
}
