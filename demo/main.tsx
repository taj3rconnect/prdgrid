import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { DataGrid } from '../src';
import type { ColumnDef, GridApi, CellRendererParams } from '../src';
import {
  generateHREmployees, type HREmployee,
  generateFinanceData, tickFinanceData, type FinanceRow,
  generateCandidates, type Candidate,
  generateProducts, type Product,
  generateGameData, type GameRow,
} from './sampleData';
import '../src/styles/datagrid.css';

// ═══════════════════════════════════════════════════════════════════════
// SHARED CELL RENDERERS
// ═══════════════════════════════════════════════════════════════════════

// ─── HR Renderers ───

function EmployeeCell({ data }: CellRendererParams<HREmployee>) {
  const d = data as HREmployee;
  return (
    <div className="flex items-center gap-3" style={{ height: '100%' }}>
      <div
        className="flex-shrink-0 flex items-center justify-center rounded-full text-white text-xs font-bold"
        style={{ width: 36, height: 36, backgroundColor: d.avatarColor }}
      >
        {d.initials}
      </div>
      <div className="flex flex-col leading-tight min-w-0">
        <span className="font-semibold text-[13px] text-gray-900 truncate">{d.name}</span>
        <span className="text-[11px] text-gray-400 truncate">{d.jobTitle}</span>
      </div>
    </div>
  );
}

const deptColors: Record<string, { border: string; dot: string }> = {
  'Executive Management': { border: 'rgba(71,168,248,0.42)', dot: 'rgb(71,168,248)' },
  'Engineering': { border: 'rgba(243,163,58,0.33)', dot: 'rgb(243,162,58)' },
  'Product': { border: 'rgba(136,207,43,0.33)', dot: 'rgb(135,207,43)' },
  'Design': { border: 'rgba(126,128,231,0.32)', dot: 'rgb(126,128,231)' },
  'Customer Support': { border: 'rgba(140,140,140,0.25)', dot: 'rgb(180,180,180)' },
  'Legal': { border: 'rgba(140,140,140,0.25)', dot: 'rgb(180,180,180)' },
  'Finance': { border: 'rgba(76,175,80,0.3)', dot: 'rgb(76,175,80)' },
  'Marketing': { border: 'rgba(255,152,0,0.3)', dot: 'rgb(255,152,0)' },
  'Human Resources': { border: 'rgba(233,30,99,0.3)', dot: 'rgb(233,30,99)' },
  'Operations': { border: 'rgba(0,188,212,0.3)', dot: 'rgb(0,188,212)' },
};

function DeptChip({ value }: CellRendererParams<HREmployee>) {
  const c = deptColors[value] || { border: '#ccc', dot: '#ccc' };
  return (
    <span
      className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-[12px] font-medium"
      style={{ border: `1px solid ${c.border}`, boxShadow: 'rgba(0,0,0,0.05) 0px 1px 2px' }}
    >
      <span className="rounded-full" style={{ width: 8, height: 8, backgroundColor: c.dot }} />
      {value}
    </span>
  );
}

function LocationCell({ data }: CellRendererParams<HREmployee>) {
  const d = data as HREmployee;
  return (
    <span className="flex items-center gap-2">
      <span className="text-base">{d.flag}</span>
      <span>{d.location}</span>
    </span>
  );
}

function PaymentStatusBadge({ value }: CellRendererParams<HREmployee>) {
  if (value === 'Paid') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[12px] font-medium capitalize"
        style={{ border: '1px solid rgba(70,227,114,0.2)', color: 'rgb(62,184,97)' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        paid
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-md px-2 py-0.5 text-[12px] font-medium capitalize"
      style={{ border: '1px solid #ccc', color: '#999' }}>
      pending
    </span>
  );
}

function ContactCell() {
  return (
    <div className="flex items-center gap-2">
      <button className="flex items-center justify-center rounded-md border border-gray-200 bg-white shadow-sm"
        style={{ width: 30, height: 30 }} title="LinkedIn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#0A66C2">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      </button>
      <button className="flex items-center justify-center rounded-md border border-gray-200 bg-white shadow-sm"
        style={{ width: 30, height: 30 }} title="Email">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M22 4L12 13L2 4" />
        </svg>
      </button>
    </div>
  );
}

// ─── Finance Renderers ───

function TickerCell({ data }: CellRendererParams<FinanceRow>) {
  const d = data as FinanceRow;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-shrink-0 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
        style={{ width: 24, height: 24, backgroundColor: d.color }}>
        {d.ticker.slice(0, 2)}
      </div>
      <span className="font-bold text-[13px]" style={{ fontFamily: 'monospace' }}>{d.ticker}</span>
      <span className="text-[11px] text-gray-400 truncate">{d.name}</span>
    </div>
  );
}

function SparklineBar({ value }: CellRendererParams<FinanceRow>) {
  const data = (value as number[]) || [];
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 180;
  const h = 30;
  const barW = w / data.length - 1;

  return (
    <svg width={w} height={h} className="block">
      {data.map((v, i) => {
        const barH = Math.max(2, ((v - min) / range) * (h - 2));
        return (
          <rect
            key={i}
            x={i * (barW + 1)}
            y={h - barH}
            width={barW}
            height={barH}
            fill="#2196f3"
            opacity={0.7}
            rx={1}
          />
        );
      })}
    </svg>
  );
}

function DeltaValueCell({ value, data, colDef }: CellRendererParams<FinanceRow>) {
  const d = data as FinanceRow;
  const field = colDef?.field;
  const delta = field === 'pnl' ? d.pnlDelta : d.totalValueDelta;
  const isUp = delta >= 0;
  const arrow = isUp ? '↑' : '↓';
  const deltaColor = isUp ? 'rgb(53,182,90)' : 'rgb(255,0,92)';
  const num = Number(value) || 0;
  const formatted = field === 'totalValue'
    ? num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : num.toFixed(2);
  const deltaFormatted = Math.abs(delta).toFixed(2);

  return (
    <div className="flex items-center justify-end gap-2 font-mono text-[13px]">
      {delta !== 0 && (
        <span style={{ color: deltaColor, fontSize: '11px', fontWeight: 500 }}>
          {arrow}{deltaFormatted}
        </span>
      )}
      <span className="font-medium">{formatted}</span>
    </div>
  );
}

// ─── Performance Renderers ───

function StarRating({ value }: CellRendererParams<GameRow>) {
  const n = Number(value) || 0;
  return (
    <span className="text-amber-400 tracking-wider text-sm">
      {'★'.repeat(n)}{'☆'.repeat(5 - n)}
    </span>
  );
}

function CountryCell({ data }: CellRendererParams<GameRow>) {
  const d = data as GameRow;
  return (
    <span className="flex items-center gap-2">
      <span className="text-base">{d.countryFlag}</span>
      <span>{d.country}</span>
    </span>
  );
}

function BoughtCell({ value }: CellRendererParams<GameRow>) {
  return value ? (
    <span className="text-green-600 text-sm">✓</span>
  ) : (
    <span className="text-gray-300 text-sm">✗</span>
  );
}

// ─── Staffing Renderers ───

function StageBadge({ value }: CellRendererParams<any>) {
  const colors: Record<string, string> = {
    Paid: 'bg-green-100 text-green-700 border-green-200',
    Pending: 'bg-amber-100 text-amber-700 border-amber-200',
    New: 'bg-slate-100 text-slate-700 border-slate-200',
    Screening: 'bg-cyan-100 text-cyan-700 border-cyan-200',
    Submitted: 'bg-blue-100 text-blue-700 border-blue-200',
    Interview: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    Offer: 'bg-amber-100 text-amber-700 border-amber-200',
    Placed: 'bg-green-100 text-green-700 border-green-200',
    Rejected: 'bg-red-100 text-red-700 border-red-200',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${colors[value] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
      {value}
    </span>
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

function Section({ title, subtitle, tags, children }: {
  title: string; subtitle: string; tags: string[]; children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
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
// DEMO 1: HR EMPLOYEE DIRECTORY (AG Grid style)
// ═══════════════════════════════════════════════════════════════════════

function HRDemo() {
  const [data] = useState(() => generateHREmployees(56));
  const gridRef = useRef<GridApi<HREmployee>>(null);

  const cols: ColumnDef<HREmployee>[] = [
    {
      field: 'name', headerName: 'EMPLOYEE', width: 300, pinned: 'left', sortable: true, filter: 'text',
      cellRenderer: EmployeeCell,
    },
    { field: 'id', headerName: 'ID', width: 100,
      cellStyle: () => ({ fontFamily: 'monospace', fontSize: '12px', color: '#9ca3af' }) },
    { field: 'department', headerName: 'DEPARTMENT', width: 220, sortable: true, filter: 'set', enableRowGroup: true,
      cellRenderer: DeptChip },
    { field: 'employmentType', headerName: 'EMPLOYMENT TYPE', width: 160, sortable: true, filter: 'set' },
    { field: 'location', headerName: 'LOCATION', width: 200, sortable: true, filter: 'set', enableRowGroup: true,
      cellRenderer: LocationCell },
    { field: 'joinDate', headerName: 'JOIN DATE', width: 120, sortable: true, filter: 'date' },
    { field: 'salary', headerName: 'SALARY', width: 150, sortable: true, filter: 'number', aggFunc: 'sum',
      valueFormatter: ({ value, data: d }) => {
        const sym = { USD: '$', EUR: '€', GBP: '£' }[(d as HREmployee)?.currency] || '$';
        return `${sym}${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
      },
      cellStyle: () => ({ fontFamily: 'monospace', textAlign: 'right' }) },
    { field: 'paymentMethod', headerName: 'PAYMENT METHOD', width: 160, sortable: true, filter: 'set' },
    { field: 'paymentStatus', headerName: 'STATUS', width: 120, sortable: true, filter: 'set',
      cellRenderer: PaymentStatusBadge },
    { colId: 'contact', headerName: 'CONTACT', width: 120,
      cellRenderer: ContactCell },
  ];

  return (
    <Section title="HR Employee Directory" subtitle="56 employees with department chips, location flags, payment status badges, and contact actions"
      tags={['Avatars', 'Department Tags', 'Flag Renderer', 'Status Badges', 'Contact Icons', 'Column Pinning', 'Grouping']}>
      <DataGrid<HREmployee>
        ref={gridRef} gridId="hr-demo" rowData={data} columnDefs={cols}
        defaultColDef={{ sortable: true, resizable: true, minWidth: 60 }}
        getRowId={d => String(d.id)} rowSelection="multiple"
        groupPanel floatingFilters={false} statusBar height={620}
        rowHeight={65}
        toolbar={{ search: true, columnManager: true, export: { csv: true, excel: true }, density: false }}
      />
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// DEMO 2: FINANCE — LIVE TICKING (AG Grid style)
// ═══════════════════════════════════════════════════════════════════════

function FinanceDemo() {
  const [data, setData] = useState(generateFinanceData);

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
      cellStyle: () => ({ fontFamily: 'monospace', textAlign: 'right' }) },
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

// ═══════════════════════════════════════════════════════════════════════
// DEMO 3: PERFORMANCE — 1000 ROWS (AG Grid style)
// ═══════════════════════════════════════════════════════════════════════

function PerformanceDemo() {
  const [data] = useState(() => generateGameData(1000));

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
        fontFamily: 'monospace', textAlign: 'right',
        color: Number(value) > 25000 ? '#2563eb' : undefined,
        fontWeight: Number(value) > 25000 ? 600 : undefined,
      }) },
    { field: 'rating', headerName: 'RATING', width: 140, sortable: true, filter: 'number', aggFunc: 'avg',
      cellRenderer: StarRating },
    { field: 'totalWinnings', headerName: 'TOTAL WINNINGS', width: 170, sortable: true, filter: 'number', aggFunc: 'sum',
      valueFormatter: ({ value }) => `$${Number(value).toLocaleString()}`,
      cellStyle: () => ({ fontFamily: 'monospace', textAlign: 'right', fontWeight: 600 }) },
    // Monthly Breakdown
    { field: 'jan', headerName: 'JAN', width: 100, sortable: true,
      valueFormatter: ({ value }) => `$${Number(value).toLocaleString()}`,
      cellStyle: () => ({ fontFamily: 'monospace', textAlign: 'right', fontSize: '12px', color: '#6b7280' }) },
    { field: 'feb', headerName: 'FEB', width: 100, sortable: true,
      valueFormatter: ({ value }) => `$${Number(value).toLocaleString()}`,
      cellStyle: () => ({ fontFamily: 'monospace', textAlign: 'right', fontSize: '12px', color: '#6b7280' }) },
    { field: 'mar', headerName: 'MAR', width: 100, sortable: true,
      valueFormatter: ({ value }) => `$${Number(value).toLocaleString()}`,
      cellStyle: () => ({ fontFamily: 'monospace', textAlign: 'right', fontSize: '12px', color: '#6b7280' }) },
    { field: 'apr', headerName: 'APR', width: 100, sortable: true,
      valueFormatter: ({ value }) => `$${Number(value).toLocaleString()}`,
      cellStyle: () => ({ fontFamily: 'monospace', textAlign: 'right', fontSize: '12px', color: '#6b7280' }) },
    { field: 'may', headerName: 'MAY', width: 100, sortable: true,
      valueFormatter: ({ value }) => `$${Number(value).toLocaleString()}`,
      cellStyle: () => ({ fontFamily: 'monospace', textAlign: 'right', fontSize: '12px', color: '#6b7280' }) },
    { field: 'jun', headerName: 'JUN', width: 100, sortable: true,
      valueFormatter: ({ value }) => `$${Number(value).toLocaleString()}`,
      cellStyle: () => ({ fontFamily: 'monospace', textAlign: 'right', fontSize: '12px', color: '#6b7280' }) },
  ];

  return (
    <Section title="Performance" subtitle="1,000 rows, 14 columns — gaming tournament data with star ratings, country flags, and monthly breakdown"
      tags={['1000 Rows', 'Star Ratings', 'Country Flags', 'Dollar Formatting', 'Aggregation', 'Grouping']}>
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

// ═══════════════════════════════════════════════════════════════════════
// DEMO 4: STAFFING PIPELINE
// ═══════════════════════════════════════════════════════════════════════

function StaffingDemo() {
  const [data] = useState(() => generateCandidates(250));

  const cols: ColumnDef<Candidate>[] = [
    { field: 'id', headerName: '#', width: 65, pinned: 'left', cellStyle: () => ({ fontFamily: 'monospace', fontSize: '11px', color: '#9ca3af' }) },
    { field: 'name', headerName: 'Candidate', width: 165, sortable: true, filter: 'text', floatingFilter: true, cellStyle: () => ({ fontWeight: 600 }) },
    { field: 'role', headerName: 'Role', width: 190, sortable: true, filter: 'set', floatingFilter: true, enableRowGroup: true },
    { field: 'client', headerName: 'Client', width: 145, sortable: true, filter: 'set', floatingFilter: true, enableRowGroup: true },
    { field: 'stage', headerName: 'Stage', width: 120, sortable: true, filter: 'set', floatingFilter: true, cellRenderer: StageBadge, enableRowGroup: true },
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
    { field: 'yearsExp', headerName: 'Yrs Exp', width: 80, sortable: true, filter: 'number', cellStyle: () => ({ textAlign: 'center' }) },
    { field: 'skills', headerName: 'Skills', width: 200, filter: 'text' },
    { field: 'submitDate', headerName: 'Submitted', width: 110, sortable: true, filter: 'date' },
    { field: 'notes', headerName: 'Notes', width: 250, editable: true },
  ];

  return (
    <Section title="Staffing Pipeline" subtitle="250 candidates — pipeline stages, bill rates, margin coloring, and recruiter tracking"
      tags={['Pipeline Stages', 'Priority Heat', 'Margin Coloring', 'Bill Rate', 'Client Grouping', 'Pagination']}>
      <DataGrid<Candidate>
        gridId="staffing-demo" rowData={data} columnDefs={cols}
        defaultColDef={{ sortable: true, resizable: true, minWidth: 55 }}
        getRowId={d => String(d.id)} rowSelection="multiple"
        pagination paginationPageSize={50} groupPanel floatingFilters statusBar height={600}
        toolbar={{ search: true, columnManager: true, export: { csv: true, excel: true }, density: true }}
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
    { field: 'name', headerName: 'Employee', width: 280, sortable: true, filter: 'text',
      cellRenderer: EmployeeCell },
    { field: 'department', headerName: 'Department', width: 200, sortable: true, filter: 'set', enableRowGroup: true,
      cellRenderer: DeptChip },
    { field: 'location', headerName: 'Location', width: 200, sortable: true, filter: 'set',
      cellRenderer: LocationCell },
    { field: 'salary', headerName: 'Salary', width: 140, sortable: true,
      valueFormatter: ({ value }) => `$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      cellStyle: () => ({ fontFamily: 'monospace', textAlign: 'right' }) },
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

// ═══════════════════════════════════════════════════════════════════════
// DEMO 7: LOADING & EMPTY STATES
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

// ═══════════════════════════════════════════════════════════════════════
// APP — TABBED NAVIGATION
// ═══════════════════════════════════════════════════════════════════════

const navItems = [
  { id: 'hr', label: 'HR Directory', icon: '👥', component: HRDemo },
  { id: 'finance', label: 'Finance', icon: '📈', component: FinanceDemo },
  { id: 'performance', label: 'Performance', icon: '🏆', component: PerformanceDemo },
  { id: 'staffing', label: 'Staffing', icon: '🎯', component: StaffingDemo },
  { id: 'dark', label: 'Dark Theme', icon: '🌙', component: DarkDemo },
  { id: 'brand', label: 'Brand Theme', icon: '🎨', component: BrandDemo },
  { id: 'states', label: 'States', icon: '⏳', component: StatesDemo },
  { id: 'api', label: 'API', icon: '⚡', component: APIDemo },
];

function App() {
  const [activeTab, setActiveTab] = useState('hr');
  const ActiveDemo = navItems.find(n => n.id === activeTab)?.component || HRDemo;

  return (
    <div className="min-h-screen bg-gray-50">
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

      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 text-white py-6 px-6">
        <div className="mx-auto max-w-[1440px] flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black tracking-tight">Enterprise React Data Grid</h1>
            <p className="text-blue-200 text-sm mt-0.5">AG Grid-level features. Zero license fees. MIT open source.</p>
          </div>
          <div className="hidden md:flex flex-wrap gap-1.5 text-[10px] font-medium max-w-xl justify-end">
            {['Sorting', 'Filtering', 'Grouping', 'Cell Editing', 'Live Updates',
              'Dark Mode', 'Themes', 'Pagination', 'Custom Renderers', 'Sparklines'].map(f => (
              <span key={f} className="rounded-full bg-white/15 backdrop-blur-sm px-2 py-0.5 border border-white/10">{f}</span>
            ))}
          </div>
        </div>
      </div>

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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
