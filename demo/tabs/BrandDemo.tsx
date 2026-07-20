import { DataGrid } from '../../src';
import type { ColumnDef } from '../../src';
import { generateProducts, type Product } from '../sampleData';
import { useSeedData } from '../useSeedData';
import { Section } from '../Section';
import { InStockCell } from '../renderers';

export function BrandDemo() {
  const data = useSeedData('products', () => generateProducts(20));
  const cols: ColumnDef<Product>[] = [
    { field: 'sku', headerName: 'SKU', width: 110 },
    { field: 'name', headerName: 'Product', width: 200, sortable: true },
    { field: 'category', headerName: 'Category', width: 140, sortable: true, filter: 'set' },
    { field: 'price', headerName: 'Price', width: 100, sortable: true, valueFormatter: ({ value }) => `$${Number(value).toFixed(2)}` },
    { field: 'stock', headerName: 'Stock', width: 90, sortable: true },
    { field: 'inStock', headerName: 'Status', width: 110, cellRenderer: InStockCell },
  ];

  return (
    <Section title="Custom Brand Theme" subtitle="Override any color via GridThemeTokens prop. Indigo/purple palette."
      tags={['Custom Colors', 'Brand Palette', 'GridThemeTokens']}>
      <DataGrid<Product>
        gridId="brand-demo" rowData={data} columnDefs={cols}
        defaultColDef={{ sortable: true, resizable: true }}
        getRowId={d => String(d.id)} height={360} statusBar toolbar={{ search: true }}
        theme={{
          '--jt-grid-bg': '#faf5ff', '--jt-grid-bg-alt': '#f3e8ff', '--jt-grid-border': '#c4b5fd',
          '--jt-grid-header-bg': '#7c3aed', '--jt-grid-header-text': '#ffffff',
          '--jt-grid-text': '#4c1d95', '--jt-grid-text-secondary': '#7c3aed',
          '--jt-grid-accent': '#8b5cf6', '--jt-grid-accent-light': '#ede9fe',
          '--jt-grid-row-hover': '#f3e8ff', '--jt-grid-row-selected': '#ede9fe',
        }}
      />
    </Section>
  );
}
