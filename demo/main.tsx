import React, { useState, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { DataGrid } from '../src';
import type { ColumnDef, GridApi, CellRendererParams } from '../src';
import {
  generateHREmployees, type HREmployee,
  generateFinanceData, type FinanceRow,
  generateCandidates, type Candidate,
  generateProducts, type Product,
} from './sampleData';
import '../src/styles/datagrid.css';

// ═══════════════════════════════════════════════════════════════════════
// CUSTOM CELL RENDERERS
// ═══════════════════════════════════════════════════════════════════════

function StatusBadge({ value }: CellRendererParams<any>) {
  const colors: Record<string, string> = {
    Paid: 'bg-green-100 text-green-700 border-green-200',
    Pending: 'bg-amber-100 text-amber-700 border-amber-200',
    Permanent: 'bg-blue-100 text-blue-700 border-blue-200',
    Contract: 'bg-purple-100 text-purple-700 border-purple-200',
    // Pipeline stages
    New: 'bg-slate-100 text-slate-700 border-slate-200',
    Screening: 'bg-cyan-100 text-cyan-700 border-cyan-200',
    Submitted: 'bg-blue-100 text-blue-700 border-blue-200',
    Interview: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    Offer: 'bg-amber-100 text-amber-700 border-amber-200',
    Placed: 'bg-green-100 text-green-700 border-green-200',
    Rejected: 'bg-red-100 text-red-700 border-red-200',
  };
  const dotColors: Record<string, string> = {
    Paid: 'bg-green-500', Pending: 'bg-amber-500', Permanent: 'bg-blue-500',
    Contract: 'bg-purple-500', New: 'bg-slate-400', Screening: 'bg-cyan-500',
    Submitted: 'bg-blue-500', Interview: 'bg-indigo-500', Offer: 'bg-amber-500',
    Placed: 'bg-green-500', Rejected: 'bg-red-500',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${colors[value] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dotColors[value] || 'bg-gray-400'}`} />
      {value}
    </span>
  );
}

function DeptTag({ value }: CellRendererParams<HREmployee>) {
  const labels: Record<string, string> = {
    executiveManagement: 'Executive', engineering: 'Engineering', product: 'Product',
    design: 'Design', customerSupport: 'Support', legal: 'Legal',
    finance: 'Finance', marketing: 'Marketing', hr: 'HR', operations: 'Operations',
  };
  const colors: Record<string, string> = {
    executiveManagement: 'bg-amber-100 text-amber-800', engineering: 'bg-blue-100 text-blue-800',
    product: 'bg-purple-100 text-purple-800', design: 'bg-pink-100 text-pink-800',
    customerSupport: 'bg-teal-100 text-teal-800', legal: 'bg-gray-100 text-gray-800',
    finance: 'bg-green-100 text-green-800', marketing: 'bg-orange-100 text-orange-800',
    hr: 'bg-rose-100 text-rose-800', operations: 'bg-cyan-100 text-cyan-800',
  };
  return (
    <span className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold ${colors[value] || 'bg-gray-100 text-gray-800'}`}>
      {labels[value] || value}
    </span>
  );
}

function FlagCell({ value, data }: CellRendererParams<HREmployee>) {
  const flags: Record<string, string> = {
    us: '🇺🇸', gb: '🇬🇧', fr: '🇫🇷', de: '🇩🇪', es: '🇪🇸', nl: '🇳🇱',
    pt: '🇵🇹', ie: '🇮🇪', in: '🇮🇳', jp: '🇯🇵', ca: '🇨🇦', au: '🇦🇺',
  };
  return (
    <span className="flex items-center gap-2">
      <span className="text-base">{flags[(data as HREmployee).flag] || '🏳️'}</span>
      <span>{value}</span>
    </span>
  );
}

function TickerCell({ value, data }: CellRendererParams<FinanceRow>) {
  const d = data as FinanceRow;
  return (
    <div className="flex flex-col leading-tight">
      <span className="font-bold text-[13px]" style={{ fontFamily: 'monospace' }}>{d.ticker}</span>
      <span className="text-[10px] text-gray-400 truncate">{d.name}</span>
    </div>
  );
}

function PnLCell({ value }: CellRendererParams<FinanceRow>) {
  const n = Number(value) || 0;
  return (
    <span className={`font-semibold ${n >= 0 ? 'text-green-600' : 'text-red-600'}`} style={{ fontFamily: 'monospace' }}>
      {n >= 0 ? '+' : ''}{n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </span>
  );
}

function PctCell({ value }: CellRendererParams<FinanceRow>) {
  const n = Number(value) || 0;
  return (
    <span className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[11px] font-bold ${
      n >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
    }`}>
      {n >= 0 ? '▲' : '▼'} {Math.abs(n).toFixed(2)}%
    </span>
  );
}

function MiniChart({ value }: CellRendererParams<FinanceRow>) {
  const data = value as number[] || [];
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 120;
  const h = 28;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');
  const isUp = data[data.length - 1]! >= data[0]!;
  return (
    <svg width={w} height={h} className="block">
      <polyline points={points} fill="none" stroke={isUp ? '#22c55e' : '#ef4444'} strokeWidth="1.5" />
    </svg>
  );
}

function PriorityCell({ value }: CellRendererParams<Candidate>) {
  const cfg: Record<string, { color: string; icon: string }> = {
    Hot: { color: 'bg-red-100 text-red-700', icon: '🔥' },
    Warm: { color: 'bg-amber-100 text-amber-700', icon: '🟡' },
    Cold: { color: 'bg-blue-100 text-blue-700', icon: '🔵' },
  };
  const c = cfg[value] || cfg['Cold']!;
  return <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-medium ${c.color}`}>{c.icon} {value}</span>;
}

function InStockCell({ value }: CellRendererParams<Product>) {
  return value
    ? <span className="text-green-600 font-medium text-[11px]">● In Stock</span>
    : <span className="text-red-500 font-medium text-[11px]">● Out of Stock</span>;
}

// ═══════════════════════════════════════════════════════════════════════
// SECTION WRAPPER
// ═══════════════════════════════════════════════════════════════════════

function Section({ id, title, subtitle, tags, children }: {
  id: string; title: string; subtitle: string; tags: string[]; children: React.ReactNode;
}) {
  return (
    <section id={id} className="mb-14 scroll-mt-20">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {tags.map(t => (
            <span key={t} className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 ring-1 ring-inset ring-blue-600/10">{t}</span>
          ))}
        </div>
      </div>
      {children}
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// DEMO 1: HR EMPLOYEE DIRECTORY
// ═══════════════════════════════════════════════════════════════════════

function HRDemo() {
  const [data] = useState(() => generateHREmployees(56));
  const gridRef = useRef<GridApi<HREmployee>>(null);
  const [log, setLog] = useState<string[]>([]);
  const addLog = useCallback((msg: string) => setLog(p => [`${new Date().toLocaleTimeString()} — ${msg}`, ...p].slice(0, 12)), []);

  const cols: ColumnDef<HREmployee>[] = [
    { field: 'id', headerName: 'Employee ID', width: 115, pinned: 'left',
      cellStyle: () => ({ fontFamily: 'monospace', fontSize: '11px', color: '#6b7280' }) },
    { field: 'name', headerName: 'Employee', width: 175, sortable: true, filter: 'text', floatingFilter: true, pinned: 'left',
      cellStyle: () => ({ fontWeight: 600 }) },
    { field: 'department', headerName: 'Department', width: 140, sortable: true, filter: 'set', floatingFilter: true,
      enableRowGroup: true, cellRenderer: DeptTag },
    { field: 'jobTitle', headerName: 'Job Title', width: 180, sortable: true, filter: 'text', floatingFilter: true },
    { field: 'employmentType', headerName: 'Type', width: 120, sortable: true, filter: 'set', floatingFilter: true,
      cellRenderer: StatusBadge, enableRowGroup: true },
    { field: 'location', headerName: 'Location', width: 170, sortable: true, filter: 'set', floatingFilter: true,
      enableRowGroup: true, cellRenderer: FlagCell },
    { field: 'joinDate', headerName: 'Join Date', width: 115, sortable: true, filter: 'date' },
    { field: 'salary', headerName: 'Monthly Salary', width: 135, sortable: true, filter: 'number', aggFunc: 'sum',
      valueFormatter: ({ value, data: d }) => {
        const sym = { USD: '$', EUR: '€', GBP: '£' }[(d as HREmployee)?.currency] || '$';
        return `${sym}${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
      },
      cellStyle: () => ({ fontFamily: 'monospace', textAlign: 'right' }) },
    { field: 'currency', headerName: 'CCY', width: 70, sortable: true, filter: 'set' },
    { field: 'paymentMethod', headerName: 'Payment', width: 130, sortable: true, filter: 'set', editable: true },
    { field: 'paymentStatus', headerName: 'Status', width: 110, sortable: true, filter: 'set', floatingFilter: true,
      cellRenderer: StatusBadge, enableRowGroup: true },
    { field: 'manager', headerName: 'Reports To', width: 155, sortable: true, filter: 'set', enableRowGroup: true },
    { field: 'contact', headerName: 'Contact', width: 120, pinned: 'right',
      cellStyle: () => ({ color: '#3b82f6', cursor: 'pointer' }) },
  ];

  return (
    <Section id="hr" title="HR Employee Directory" subtitle="56 employees with org hierarchy, departments, multi-currency salaries, and payment tracking"
      tags={['Tree Hierarchy', 'Department Tags', 'Flag Renderer', 'Multi-Currency', 'Payment Status', 'Column Pinning', 'Grouping', 'Editable']}>
      <div className="flex gap-2 mb-3 flex-wrap">
        {[
          ['Select All', () => { gridRef.current?.selectAll(); addLog('Selected all'); }],
          ['Deselect', () => { gridRef.current?.deselectAll(); addLog('Deselected all'); }],
          ['Get Selected', () => { const r = gridRef.current?.getSelectedRows(); addLog(`${r?.length || 0} selected: ${r?.slice(0, 3).map(x => x.name).join(', ') || 'none'}`); }],
          ['Export CSV', () => { gridRef.current?.exportCsv({ fileName: 'employees.csv' }); addLog('CSV exported'); }],
          ['Export Excel', () => { gridRef.current?.exportExcel({ fileName: 'employees.xlsx' }); addLog('Excel exported'); }],
        ].map(([label, fn]) => (
          <button key={label as string} className="rounded-md bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            onClick={fn as () => void}>{label as string}</button>
        ))}
      </div>
      <DataGrid<HREmployee>
        ref={gridRef} gridId="gallery-hr" rowData={data} columnDefs={cols}
        defaultColDef={{ sortable: true, resizable: true, minWidth: 60 }}
        getRowId={d => String(d.id)} rowSelection="multiple"
        groupPanel floatingFilters persistSettings statusBar height={580}
        toolbar={{ search: true, columnManager: true, export: { csv: true, excel: true, psd: true }, density: true }}
        onCellValueChanged={e => addLog(`Edit: ${e.colDef.field} "${e.oldValue}" → "${e.newValue}"`)}
        onSortChanged={e => addLog(`Sort: ${e.sortModel.map(s => `${s.colId} ${s.sort}`).join(', ') || 'cleared'}`)}
        onFilterChanged={e => addLog(`Filters: ${Object.keys(e.filterModel).length} active`)}
        onSelectionChanged={e => addLog(`Selected: ${e.selectedRows.length} rows`)}
      />
      <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 p-3 max-h-36 overflow-y-auto">
        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Event Log</h4>
        <div className="space-y-0.5 font-mono text-[11px] text-gray-500">
          {log.length === 0 ? <p className="italic text-gray-300">Interact with the grid...</p> : log.map((m, i) => <div key={i}>{m}</div>)}
        </div>
      </div>
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// DEMO 2: FINANCE PORTFOLIO
// ═══════════════════════════════════════════════════════════════════════

function FinanceDemo() {
  const [data] = useState(generateFinanceData);

  const cols: ColumnDef<FinanceRow>[] = [
    { field: 'ticker', headerName: 'Instrument', width: 200, pinned: 'left', sortable: true, filter: 'text', cellRenderer: TickerCell },
    { field: 'timeline', headerName: 'Timeline', width: 140, cellRenderer: MiniChart },
    { field: 'instrument', headerName: 'Type', width: 100, sortable: true, filter: 'set', floatingFilter: true, enableRowGroup: true,
      cellStyle: () => ({ textAlign: 'right', fontSize: '11px' }) },
    { field: 'sector', headerName: 'Sector', width: 130, sortable: true, filter: 'set', floatingFilter: true, enableRowGroup: true },
    { field: 'currentPrice', headerName: 'Price', width: 110, sortable: true, filter: 'number',
      valueFormatter: ({ value }) => `$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      cellStyle: () => ({ fontFamily: 'monospace', fontWeight: 600, textAlign: 'right' }) },
    { field: 'changePct', headerName: 'Change %', width: 110, sortable: true, cellRenderer: PctCell },
    { field: 'pnl', headerName: 'P&L', width: 130, sortable: true, filter: 'number', aggFunc: 'sum', cellRenderer: PnLCell },
    { field: 'totalValue', headerName: 'Total Value', width: 140, sortable: true, filter: 'number', aggFunc: 'sum',
      valueFormatter: ({ value }) => `$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      cellStyle: () => ({ fontFamily: 'monospace', textAlign: 'right' }) },
    { field: 'quantity', headerName: 'Qty', width: 75, sortable: true,
      cellStyle: () => ({ fontFamily: 'monospace', textAlign: 'right' }) },
    { field: 'purchasePrice', headerName: 'Cost Basis', width: 110, sortable: true,
      valueFormatter: ({ value }) => `$${Number(value).toFixed(2)}`,
      cellStyle: () => ({ fontFamily: 'monospace', textAlign: 'right', color: '#6b7280' }) },
    { field: 'volume', headerName: 'Volume', width: 120, sortable: true, filter: 'number',
      valueFormatter: ({ value }) => Number(value).toLocaleString(),
      cellStyle: () => ({ fontFamily: 'monospace', textAlign: 'right', fontSize: '11px', color: '#6b7280' }) },
    { field: 'peRatio', headerName: 'P/E', width: 75, sortable: true,
      valueFormatter: ({ value }) => value != null ? String(value) : '—',
      cellStyle: ({ value }) => ({ fontFamily: 'monospace', textAlign: 'right', color: Number(value) > 30 ? '#dc2626' : Number(value) < 15 ? '#059669' : '#374151' }) },
    { field: 'dividend', headerName: 'Div %', width: 80, sortable: true,
      valueFormatter: ({ value }) => Number(value) > 0 ? `${value}%` : '—',
      cellStyle: () => ({ fontFamily: 'monospace', textAlign: 'right' }) },
  ];

  return (
    <Section id="finance" title="Finance Portfolio" subtitle="34 instruments — stocks, bonds, ETFs, crypto, commodities with P&L tracking and sparkline charts"
      tags={['Sparkline Charts', 'P&L Coloring', 'Sector Grouping', 'Aggregation', 'Monospace Numbers', 'Ticker Renderer', 'Multi-instrument']}>
      <DataGrid<FinanceRow>
        gridId="gallery-finance" rowData={data} columnDefs={cols}
        defaultColDef={{ sortable: true, resizable: true }}
        getRowId={d => d.ticker} groupPanel floatingFilters statusBar height={550}
        toolbar={{ search: true, columnManager: true, export: { csv: true, excel: true }, density: true }}
      />
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// DEMO 3: STAFFING PIPELINE
// ═══════════════════════════════════════════════════════════════════════

function StaffingDemo() {
  const [data] = useState(() => generateCandidates(250));

  const cols: ColumnDef<Candidate>[] = [
    { field: 'id', headerName: '#', width: 65, pinned: 'left', cellStyle: () => ({ fontFamily: 'monospace', fontSize: '11px', color: '#9ca3af' }) },
    { field: 'name', headerName: 'Candidate', width: 165, sortable: true, filter: 'text', floatingFilter: true, cellStyle: () => ({ fontWeight: 600 }) },
    { field: 'role', headerName: 'Role', width: 190, sortable: true, filter: 'set', floatingFilter: true, enableRowGroup: true },
    { field: 'client', headerName: 'Client', width: 145, sortable: true, filter: 'set', floatingFilter: true, enableRowGroup: true },
    { field: 'stage', headerName: 'Stage', width: 120, sortable: true, filter: 'set', floatingFilter: true, cellRenderer: StatusBadge, enableRowGroup: true },
    { field: 'priority', headerName: 'Priority', width: 100, sortable: true, filter: 'set', floatingFilter: true, cellRenderer: PriorityCell },
    { field: 'source', headerName: 'Source', width: 110, sortable: true, filter: 'set', enableRowGroup: true },
    { field: 'recruiter', headerName: 'Recruiter', width: 130, sortable: true, filter: 'set', floatingFilter: true, enableRowGroup: true },
    { field: 'salary', headerName: 'Salary', width: 115, sortable: true, filter: 'number', aggFunc: 'avg',
      valueFormatter: ({ value }) => `$${Number(value).toLocaleString()}`,
      cellStyle: () => ({ fontFamily: 'monospace', textAlign: 'right' }) },
    { field: 'billRate', headerName: 'Bill Rate', width: 95, sortable: true, filter: 'number', aggFunc: 'avg',
      valueFormatter: ({ value }) => `$${value}/hr`,
      cellStyle: () => ({ fontFamily: 'monospace', textAlign: 'right' }) },
    { field: 'margin', headerName: 'Margin', width: 85, sortable: true,
      valueFormatter: ({ value }) => `${value}%`,
      cellStyle: ({ value }) => ({
        fontFamily: 'monospace', textAlign: 'right', fontWeight: 600,
        color: Number(value) >= 35 ? '#059669' : Number(value) >= 25 ? '#d97706' : '#dc2626',
      }) },
    { field: 'yearsExp', headerName: 'Yrs Exp', width: 80, sortable: true, filter: 'number',
      cellStyle: () => ({ textAlign: 'center' }) },
    { field: 'skills', headerName: 'Skills', width: 200, filter: 'text' },
    { field: 'submitDate', headerName: 'Submitted', width: 110, sortable: true, filter: 'date' },
    { field: 'email', headerName: 'Email', width: 210, hide: true },
    { field: 'phone', headerName: 'Phone', width: 140, hide: true },
    { field: 'notes', headerName: 'Notes', width: 250, editable: true },
  ];

  return (
    <Section id="staffing" title="Staffing Pipeline" subtitle="250 candidates — the core JobTalk.ai use case with pipeline stages, bill rates, and recruiter tracking"
      tags={['Pipeline Stages', 'Priority Heat', 'Margin Coloring', 'Bill Rate', 'Skills', 'Client Grouping', 'Recruiter View', 'Editable Notes']}>
      <DataGrid<Candidate>
        gridId="gallery-staffing" rowData={data} columnDefs={cols}
        defaultColDef={{ sortable: true, resizable: true, minWidth: 55 }}
        getRowId={d => String(d.id)} rowSelection="multiple"
        pagination paginationPageSize={50} groupPanel floatingFilters persistSettings statusBar height={580}
        toolbar={{ search: true, columnManager: true, export: { csv: true, excel: true, psd: true, email: true, scheduleEmail: true }, density: true }}
      />
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// DEMO 4: SIMPLE TABLE
// ═══════════════════════════════════════════════════════════════════════

function SimpleDemo() {
  const [data] = useState(() => generateProducts(30));
  const cols: ColumnDef<Product>[] = [
    { field: 'sku', headerName: 'SKU', width: 110, cellStyle: () => ({ fontFamily: 'monospace', fontSize: '11px' }) },
    { field: 'name', headerName: 'Product', width: 200, sortable: true, filter: 'text' },
    { field: 'category', headerName: 'Category', width: 140, sortable: true, filter: 'set' },
    { field: 'price', headerName: 'Price', width: 100, sortable: true, filter: 'number',
      valueFormatter: ({ value }) => `$${Number(value).toFixed(2)}`,
      cellStyle: () => ({ fontFamily: 'monospace', textAlign: 'right' }) },
    { field: 'stock', headerName: 'Stock', width: 90, sortable: true, filter: 'number', editable: true, cellEditor: 'number',
      cellStyle: () => ({ textAlign: 'right' }) },
    { field: 'inStock', headerName: 'Availability', width: 120, cellRenderer: InStockCell },
  ];

  return (
    <Section id="simple" title="Simple Product Table" subtitle="Minimal configuration — 30 rows, no pagination, no grouping. Proof the grid scales down gracefully."
      tags={['Minimal Config', 'No Pagination', 'Inline Edit', 'Basic Filters']}>
      <DataGrid<Product>
        gridId="gallery-simple" rowData={data} columnDefs={cols}
        defaultColDef={{ sortable: true, resizable: true }}
        getRowId={d => String(d.id)} height={400} statusBar
        toolbar={{ search: true, export: { csv: true } }}
      />
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// DEMO 5: DARK THEME
// ═══════════════════════════════════════════════════════════════════════

function DarkDemo() {
  const [data] = useState(() => generateHREmployees(30));
  const cols: ColumnDef<HREmployee>[] = [
    { field: 'name', headerName: 'Employee', width: 170, sortable: true, filter: 'text', floatingFilter: true, cellStyle: () => ({ fontWeight: 600 }) },
    { field: 'department', headerName: 'Department', width: 140, sortable: true, filter: 'set', floatingFilter: true, enableRowGroup: true, cellRenderer: DeptTag },
    { field: 'jobTitle', headerName: 'Title', width: 170, sortable: true },
    { field: 'location', headerName: 'Location', width: 160, sortable: true, filter: 'set', cellRenderer: FlagCell },
    { field: 'salary', headerName: 'Salary', width: 120, sortable: true,
      valueFormatter: ({ value }) => `$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      cellStyle: () => ({ fontFamily: 'monospace', textAlign: 'right' }) },
    { field: 'paymentStatus', headerName: 'Status', width: 110, cellRenderer: StatusBadge },
    { field: 'employmentType', headerName: 'Type', width: 120, cellRenderer: StatusBadge },
  ];

  return (
    <Section id="dark" title="Dark Theme" subtitle="Identical component, one prop change. CSS custom properties power the entire theme system."
      tags={['Dark Mode', 'theme=\"dark\"', 'CSS Variables', 'Zero Config']}>
      <div className="rounded-xl bg-gray-950 p-5">
        <DataGrid<HREmployee>
          gridId="gallery-dark" rowData={data} columnDefs={cols}
          defaultColDef={{ sortable: true, resizable: true }}
          getRowId={d => String(d.id)} rowSelection="multiple"
          pagination paginationPageSize={15} groupPanel floatingFilters statusBar
          theme="dark" height={460}
          toolbar={{ search: true, columnManager: true, export: { csv: true }, density: true }}
        />
      </div>
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// DEMO 6: CUSTOM BRAND THEME
// ═══════════════════════════════════════════════════════════════════════

function BrandDemo() {
  const [data] = useState(() => generateProducts(20));
  const cols: ColumnDef<Product>[] = [
    { field: 'sku', headerName: 'SKU', width: 110 },
    { field: 'name', headerName: 'Product', width: 200, sortable: true },
    { field: 'category', headerName: 'Category', width: 140, sortable: true, filter: 'set' },
    { field: 'price', headerName: 'Price', width: 100, sortable: true, valueFormatter: ({ value }) => `$${Number(value).toFixed(2)}` },
    { field: 'stock', headerName: 'Stock', width: 90, sortable: true },
    { field: 'inStock', headerName: 'Status', width: 110, cellRenderer: InStockCell },
  ];

  return (
    <Section id="brand" title="Custom Brand Theme" subtitle="Override any color via GridThemeTokens prop. This uses an indigo/purple palette."
      tags={['Custom Colors', 'Brand Palette', 'GridThemeTokens', 'No CSS Override Needed']}>
      <DataGrid<Product>
        gridId="gallery-brand" rowData={data} columnDefs={cols}
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

// ═══════════════════════════════════════════════════════════════════════
// DEMO 7: STATES
// ═══════════════════════════════════════════════════════════════════════

function StatesDemo() {
  const [loading, setLoading] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [data] = useState(() => generateProducts(8));
  const cols: ColumnDef<Product>[] = [
    { field: 'name', headerName: 'Product', width: 200 },
    { field: 'category', headerName: 'Category', width: 140 },
    { field: 'price', headerName: 'Price', width: 100, valueFormatter: ({ value }) => `$${Number(value).toFixed(2)}` },
  ];

  return (
    <Section id="states" title="Loading & Empty States" subtitle="Built-in overlays for loading spinners and empty data."
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

// ═══════════════════════════════════════════════════════════════════════
// DEMO 8: API PLAYGROUND
// ═══════════════════════════════════════════════════════════════════════

function APIDemo() {
  const [data] = useState(() => generateHREmployees(40));
  const gridRef = useRef<GridApi<HREmployee>>(null);
  const [output, setOutput] = useState('Click any button to call the Grid API...');

  const cols: ColumnDef<HREmployee>[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Name', width: 160 },
    { field: 'department', headerName: 'Dept', width: 130, filter: 'set' },
    { field: 'salary', headerName: 'Salary', width: 120, valueFormatter: ({ value }) => `$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
    { field: 'paymentStatus', headerName: 'Status', width: 100, cellRenderer: StatusBadge },
  ];

  const btn = (label: string, fn: () => void, color = 'blue') => (
    <button key={label} className={`rounded-md bg-${color}-50 px-2.5 py-1.5 text-[11px] font-semibold text-${color}-700 ring-1 ring-inset ring-${color}-600/20 hover:bg-${color}-100`}
      onClick={fn}>{label}</button>
  );

  return (
    <Section id="api" title="Programmatic API" subtitle="Full imperative control via GridApi ref — sorting, filtering, selection, export, state management."
      tags={['GridApi', 'useRef', 'Imperative', 'selectAll()', 'setSortModel()', 'exportCsv()', 'getState()']}>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-1.5 mb-3">
        {btn('selectAll()', () => { gridRef.current?.selectAll(); setOutput('api.selectAll() — all rows selected'); })}
        {btn('deselectAll()', () => { gridRef.current?.deselectAll(); setOutput('api.deselectAll()'); })}
        {btn('getSelectedRows()', () => {
          const r = gridRef.current?.getSelectedRows() || [];
          setOutput(`api.getSelectedRows() → ${r.length} rows [${r.slice(0, 2).map(x => x.name).join(', ')}${r.length > 2 ? '...' : ''}]`);
        })}
        {btn('Sort: Salary ↓', () => { gridRef.current?.setSortModel([{ colId: 'salary', sort: 'desc' }]); setOutput('api.setSortModel([{colId:"salary", sort:"desc"}])'); })}
        {btn('Filter: "Paid"', () => { gridRef.current?.setQuickFilter('Paid'); setOutput('api.setQuickFilter("Paid")'); })}
        {btn('Clear Filter', () => { gridRef.current?.setQuickFilter(''); setOutput('api.setQuickFilter("")'); })}
        {btn('Hide Salary', () => { gridRef.current?.setColumnVisible('salary', false); setOutput('api.setColumnVisible("salary", false)'); })}
        {btn('Show Salary', () => { gridRef.current?.setColumnVisible('salary', true); setOutput('api.setColumnVisible("salary", true)'); })}
        {btn('exportCsv()', () => { gridRef.current?.exportCsv(); setOutput('api.exportCsv() → downloading...'); }, 'green')}
        {btn('getState()', () => {
          const s = gridRef.current?.getState();
          setOutput(`api.getState() → ${JSON.stringify(s?.sorting)} sorts, ${Object.keys(s?.columnVisibility || {}).length} hidden`);
        }, 'purple')}
        {btn('resetState()', () => { gridRef.current?.resetState(); setOutput('api.resetState() → defaults restored'); }, 'red')}
        {btn('getRowCount()', () => { setOutput(`api.getDisplayedRowCount() → ${gridRef.current?.getDisplayedRowCount()}`); })}
      </div>
      <div className="mb-3 rounded-lg bg-gray-900 px-4 py-2.5 font-mono text-[12px] text-green-400 shadow-inner">
        <span className="text-gray-500">❯ </span>{output}
      </div>
      <DataGrid<HREmployee>
        ref={gridRef} gridId="gallery-api" rowData={data} columnDefs={cols}
        defaultColDef={{ sortable: true, resizable: true }}
        getRowId={d => String(d.id)} rowSelection="multiple" height={340} statusBar
      />
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════════════════

const navItems = [
  { id: 'hr', label: 'HR Directory', icon: '👥', component: HRDemo },
  { id: 'finance', label: 'Finance', icon: '📈', component: FinanceDemo },
  { id: 'staffing', label: 'Staffing', icon: '🎯', component: StaffingDemo },
  { id: 'simple', label: 'Simple', icon: '📋', component: SimpleDemo },
  { id: 'dark', label: 'Dark Theme', icon: '🌙', component: DarkDemo },
  { id: 'brand', label: 'Brand Theme', icon: '🎨', component: BrandDemo },
  { id: 'states', label: 'States', icon: '⏳', component: StatesDemo },
  { id: 'api', label: 'API', icon: '⚡', component: APIDemo },
];

// ═══════════════════════════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════════════════════════

function App() {
  const [activeTab, setActiveTab] = useState('hr');
  const ActiveDemo = navItems.find(n => n.id === activeTab)?.component || HRDemo;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="mx-auto max-w-[1440px] px-6 flex items-center h-12 gap-5">
          <div className="flex items-center gap-2.5 mr-3">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-[11px]">JT</div>
            <span className="font-bold text-gray-900 text-sm">@jobtalk/datagrid</span>
            <span className="rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 px-2 py-0.5 text-[9px] font-bold text-blue-700">v0.1.0</span>
          </div>
          <div className="h-4 w-px bg-gray-200" />
          <div className="flex items-center gap-0.5 overflow-x-auto">
            {navItems.map(n => (
              <button key={n.id}
                onClick={() => setActiveTab(n.id)}
                className={`flex items-center gap-1 whitespace-nowrap rounded-md px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
                  activeTab === n.id
                    ? 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }`}>
                <span>{n.icon}</span> {n.label}
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <a href="https://github.com/taj3rconnect/prdgrid" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            GitHub
          </a>
        </div>
      </nav>

      {/* Hero - compact */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 text-white py-6 px-6">
        <div className="mx-auto max-w-[1440px] flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black tracking-tight">Enterprise React Data Grid</h1>
            <p className="text-blue-200 text-sm mt-0.5">AG Grid-level features. Zero license fees. MIT open source.</p>
          </div>
          <div className="hidden md:flex flex-wrap gap-1.5 text-[10px] font-medium max-w-xl justify-end">
            {['Sorting', 'Filtering', 'Grouping', 'Cell Editing', 'Export',
              'Dark Mode', 'Themes', 'Pagination', 'Custom Renderers', 'API Control'].map(f => (
              <span key={f} className="rounded-full bg-white/15 backdrop-blur-sm px-2 py-0.5 border border-white/10">{f}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Active Demo */}
      <div className="mx-auto max-w-[1440px] px-6 py-8">
        <ActiveDemo />

        <footer className="mt-16 border-t border-gray-200 pt-6 pb-10 text-center">
          <p className="text-sm text-gray-400">@jobtalk/datagrid v0.1.0 — Built by <a href="https://github.com/taj3rconnect" className="text-blue-500 hover:underline">Taj Haslani</a></p>
          <p className="text-xs text-gray-300 mt-1">TanStack Table v8 + Tailwind CSS — MIT Licensed</p>
          <p className="text-xs text-gray-300 mt-1">Built with assistance from <a href="https://claude.ai" className="text-blue-400 hover:underline">Claude</a> by Anthropic</p>
        </footer>
      </div>
    </div>
  );
}

// ─── Mount ───
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
