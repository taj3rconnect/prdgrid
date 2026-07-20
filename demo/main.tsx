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
// SEED DATA — served from the prd-demo SQLite API when hosted;
// falls back to in-browser generators for local dev / static hosting.
// ═══════════════════════════════════════════════════════════════════════

function useSeedData<T>(table: string, fallback: () => T[], refreshKey = 0): T[] {
  const [data, setData] = useState<T[]>(fallback);
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/data/${table}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((j) => {
        if (!cancelled && Array.isArray(j.rows) && j.rows.length > 0) setData(j.rows);
      })
      .catch(() => {}); // no API (static hosting / local vite) — keep generated fallback
    return () => {
      cancelled = true;
    };
  }, [table, refreshKey]);
  return data;
}

// ═══════════════════════════════════════════════════════════════════════
// SHARED CELL RENDERERS
// ═══════════════════════════════════════════════════════════════════════

// ─── HR Renderers ───

function EmployeeCell({ data, value }: CellRendererParams<HREmployee>) {
  const d = data as HREmployee;
  // value is the name; the tree toggle is handled in the HRDemo component
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
      <span className="font-bold text-[13px]" style={{ fontFamily: 'var(--mono)' }}>{d.ticker}</span>
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
    <section className="mb-10">
      <div className="mb-4">
        <h2 className="text-[22px] font-bold tracking-[-0.01em] text-[#101828]">{title}</h2>
        <p className="text-sm text-[#475467] mt-1">{subtitle}</p>
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {tags.map(t => (
            <span key={t} className="rounded-md border border-[#eaecf0] bg-[#f9fafb] px-2 py-0.5 text-[11px] font-medium text-[#475467]">{t}</span>
          ))}
        </div>
      </div>
      {children}
    </section>
  );
}

// Explains drag-to-group for demos that enable the group panel
function GroupingHint({ examples }: { examples: string }) {
  return (
    <div className="mb-3 flex gap-3 rounded-lg border border-[#d4e3f8] bg-[#f4f8ff] px-4 py-3">
      <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#0e4491]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
      </svg>
      <div className="text-[13px] leading-relaxed text-[#344054]">
        <span className="font-semibold text-[#101828]">Row grouping:</span>{' '}
        drag a column header (try {examples}) into the band above the grid that reads
        “Drag column headers here to group rows”. Rows collapse into expandable groups — click a
        group row to open it — and numeric columns roll up (sum / avg) per group. Remove a group
        by clicking the × on its chip, or “Clear all” to reset.
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// DEMO 1: HR EMPLOYEE DIRECTORY (AG Grid style)
// ═══════════════════════════════════════════════════════════════════════

function TreeEmployeeCell({ data: rawData }: CellRendererParams<HREmployee>) {
  const d = rawData as HREmployee & { _expanded?: boolean; _onToggle?: () => void };
  const hasChildren = d.childCount > 0;
  const indent = d.level * 28;

  return (
    <div className="flex items-center gap-2" style={{ height: '100%', paddingLeft: indent }}>
      {hasChildren ? (
        <button
          className="flex-shrink-0 flex items-center justify-center rounded-md text-[11px] hover:bg-gray-100"
          style={{
            width: 22, height: 22,
            color: 'rgb(116,134,215)',
            boxShadow: 'rgba(0,0,0,0.07) 0px 2px 1px',
            border: '1px solid rgba(0,0,0,0.08)',
          }}
          onClick={(e) => { e.stopPropagation(); d._onToggle?.(); }}
        >
          {d._expanded ? '▼' : '▶'}
        </button>
      ) : (
        <span style={{ width: 22 }} />
      )}
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

function HRDemo() {
  const allData = useSeedData('employees', generateHREmployees);
  const [expanded, setExpanded] = useState<Set<number>>(() => {
    // Start with level 0 expanded
    return new Set(allData.filter(e => e.level === 0).map(e => e.id));
  });
  useEffect(() => {
    setExpanded(new Set(allData.filter(e => e.level === 0).map(e => e.id)));
  }, [allData]);

  const toggleExpand = useCallback((id: number) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        // Collapse: remove this id and all descendants
        next.delete(id);
        const removeChildren = (parentId: number) => {
          for (const emp of allData) {
            if (emp.managerId === parentId) {
              next.delete(emp.id);
              removeChildren(emp.id);
            }
          }
        };
        removeChildren(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, [allData]);

  // Build visible rows: show root nodes + children of expanded nodes
  const visibleData = React.useMemo(() => {
    const result: (HREmployee & { _expanded?: boolean; _onToggle?: () => void })[] = [];
    const addChildren = (parentId: number | null) => {
      const children = allData.filter(e => e.managerId === parentId);
      for (const child of children) {
        const isExpanded = expanded.has(child.id);
        result.push({
          ...child,
          _expanded: isExpanded,
          _onToggle: () => toggleExpand(child.id),
        });
        if (isExpanded) {
          addChildren(child.id);
        }
      }
    };
    addChildren(null);
    return result;
  }, [allData, expanded, toggleExpand]);

  const cols: ColumnDef<HREmployee>[] = [
    {
      field: 'name', headerName: 'EMPLOYEE', width: 350, pinned: 'left', sortable: true, filter: 'text',
      cellRenderer: TreeEmployeeCell,
    },
    { field: 'id', headerName: 'ID', width: 100,
      cellStyle: () => ({ fontFamily: 'var(--mono)', fontSize: '12px', color: '#9ca3af' }) },
    { field: 'department', headerName: 'DEPARTMENT', width: 220, sortable: true, filter: 'set',
      cellRenderer: DeptChip },
    { field: 'employmentType', headerName: 'EMPLOYMENT TYPE', width: 160, sortable: true, filter: 'set' },
    { field: 'location', headerName: 'LOCATION', width: 200, sortable: true, filter: 'set',
      cellRenderer: LocationCell },
    { field: 'joinDate', headerName: 'JOIN DATE', width: 120, sortable: true, filter: 'date' },
    { field: 'salary', headerName: 'SALARY', width: 150, sortable: true, filter: 'number',
      valueFormatter: ({ value, data: d }) => {
        const sym = { USD: '$', EUR: '€', GBP: '£' }[(d as HREmployee)?.currency] || '$';
        return `${sym}${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
      },
      cellStyle: () => ({ fontFamily: 'var(--mono)', textAlign: 'right' }) },
    { field: 'paymentMethod', headerName: 'PAYMENT METHOD', width: 160, sortable: true, filter: 'set' },
    { field: 'paymentStatus', headerName: 'STATUS', width: 120, sortable: true, filter: 'set',
      cellRenderer: PaymentStatusBadge },
    { colId: 'contact', headerName: 'CONTACT', width: 120,
      cellRenderer: ContactCell },
  ];

  return (
    <Section title="HR Employee Directory"
      subtitle="Hierarchical employee data with tree drill-down — click arrows to expand/collapse direct reports"
      tags={['Tree Hierarchy', 'Drill-down', 'Avatars', 'Department Tags', 'Flags', 'Status Badges', 'Contact Icons']}>
      <DataGrid<HREmployee>
        gridId="hr-demo" rowData={visibleData} columnDefs={cols}
        defaultColDef={{ sortable: true, resizable: true, minWidth: 60 }}
        getRowId={d => String(d.id)}
        floatingFilters={false} statusBar height={650}
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

// ═══════════════════════════════════════════════════════════════════════
// DEMO 3: PERFORMANCE — 1000 ROWS (AG Grid style)
// ═══════════════════════════════════════════════════════════════════════

function PerformanceDemo() {
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
    { field: 'jan', headerName: 'JAN', width: 100, sortable: true,
      valueFormatter: ({ value }) => `$${Number(value).toLocaleString()}`,
      cellStyle: () => ({ fontFamily: 'var(--mono)', textAlign: 'right', fontSize: '12px', color: '#6b7280' }) },
    { field: 'feb', headerName: 'FEB', width: 100, sortable: true,
      valueFormatter: ({ value }) => `$${Number(value).toLocaleString()}`,
      cellStyle: () => ({ fontFamily: 'var(--mono)', textAlign: 'right', fontSize: '12px', color: '#6b7280' }) },
    { field: 'mar', headerName: 'MAR', width: 100, sortable: true,
      valueFormatter: ({ value }) => `$${Number(value).toLocaleString()}`,
      cellStyle: () => ({ fontFamily: 'var(--mono)', textAlign: 'right', fontSize: '12px', color: '#6b7280' }) },
    { field: 'apr', headerName: 'APR', width: 100, sortable: true,
      valueFormatter: ({ value }) => `$${Number(value).toLocaleString()}`,
      cellStyle: () => ({ fontFamily: 'var(--mono)', textAlign: 'right', fontSize: '12px', color: '#6b7280' }) },
    { field: 'may', headerName: 'MAY', width: 100, sortable: true,
      valueFormatter: ({ value }) => `$${Number(value).toLocaleString()}`,
      cellStyle: () => ({ fontFamily: 'var(--mono)', textAlign: 'right', fontSize: '12px', color: '#6b7280' }) },
    { field: 'jun', headerName: 'JUN', width: 100, sortable: true,
      valueFormatter: ({ value }) => `$${Number(value).toLocaleString()}`,
      cellStyle: () => ({ fontFamily: 'var(--mono)', textAlign: 'right', fontSize: '12px', color: '#6b7280' }) },
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

// ═══════════════════════════════════════════════════════════════════════
// DEMO 4: STAFFING PIPELINE
// ═══════════════════════════════════════════════════════════════════════

function StaffingDemo() {
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

// ═══════════════════════════════════════════════════════════════════════
// DEMO 5: DARK THEME
// ═══════════════════════════════════════════════════════════════════════

function DarkDemo() {
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

// ═══════════════════════════════════════════════════════════════════════
// DEMO 6: CUSTOM BRAND THEME
// ═══════════════════════════════════════════════════════════════════════

function BrandDemo() {
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
  const data = useSeedData('employees', generateHREmployees);
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
// DEMO 9: AIRTABLE-STYLE TYPED GRID
// ═══════════════════════════════════════════════════════════════════════

function AirtableDemo() {
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

// ═══════════════════════════════════════════════════════════════════════
// DEMO 10: CHARTS VIEW
// ═══════════════════════════════════════════════════════════════════════

function ChartsDemo() {
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

// ═══════════════════════════════════════════════════════════════════════
// DEMO 0: OVERVIEW — full capability tour
// ═══════════════════════════════════════════════════════════════════════

interface Capability {
  icon: string;
  title: string;
  points: string[];
  demo: string;
  demoLabel: string;
}

const CAPABILITIES: Capability[] = [
  {
    icon: '🗂️', title: 'Airtable-Style Typed Columns', demo: 'airtable', demoLabel: 'Airtable demo',
    points: [
      '12 field types via one dataType prop: text, number, currency, percent, date, select, multiSelect, checkbox, rating, progress, link, user',
      'Each type drives its header icon, default formatter, filter type, alignment, and a built-in renderer — colored chips, star ratings, progress bars, initials avatars — no custom code needed',
      'Inline sparkline columns (line / bar / win-loss) and accent data-bars behind numeric values',
    ],
  },
  {
    icon: '🎨', title: 'Theme System — Looks × Accents', demo: 'airtable', demoLabel: 'theme switcher (any tab)',
    points: [
      '6 grid looks: Airtable (default), Quartz, Minimal, Striped, Dense, Midnight (dark) — switchable live from the toolbar palette, no remount, state preserved',
      '8 accent color themes compose with any look; user choices persist per grid in localStorage',
      'Style panel for end users (fonts, sizes, colors, alt-row bg) plus GridThemeTokens for a fully custom brand theme — all CSS-token driven',
    ],
  },
  {
    icon: '📊', title: 'Integrated Charts', demo: 'charts', demoLabel: 'Charts demo',
    points: [
      'Grid | Charts view toggle in the toolbar — bar, stacked bar, line, area, and donut chart cards',
      'Charts aggregate the currently filtered rows and update live as you search, filter, or group',
      'Add / edit / remove charts in-app, download any card as PNG — hand-rolled SVG, zero chart dependencies',
    ],
  },
  {
    icon: '⚙️', title: 'Data Operations', demo: 'performance', demoLabel: 'Performance demo',
    points: [
      'Multi-column sorting (shift-click), per-column filters (text / number / date / set) plus global quick search and floating filter row',
      'Drag-to-group rows with sum / avg / count / min / max aggregations and expandable group rows',
      'Pagination, inline editing, totals row, right-click header context menu, Ctrl+C copy-as-TSV, refresh button with spinner',
    ],
  },
  {
    icon: '📐', title: 'Column Control', demo: 'hr', demoLabel: 'HR demo',
    points: [
      'Resize (drag or double-click), drag-reorder with accent insertion indicator, pin left/right with correct sticky offsets',
      'Column manager panel: show/hide, reorder, per-column alignment and decimal places — all persisted',
      'Row-number column that swaps to selection checkboxes on hover, Airtable style',
    ],
  },
  {
    icon: '🎯', title: 'Rows & Records', demo: 'airtable', demoLabel: 'Airtable demo',
    points: [
      'Declarative conditional coloring: rowColorRules / cellColorRules — full-row tints or 3px left edge bars',
      'Record expand: hover a row number and open the full record in a slide-over with typed fields and ↑/↓ navigation',
      'Single or multi row selection with accent wash + left bar; live status bar counts',
    ],
  },
  {
    icon: '📤', title: 'Export Suite', demo: 'staffing', demoLabel: 'Staffing demo',
    points: [
      'CSV, Excel, and PDF downloads (lazy-loaded libs), grid-to-image PNG capture',
      'In-app Send Report modal: email now or schedule daily/weekly/monthly — HTML, PDF, or CSV — POSTed to your endpoint with auth headers',
      'Heavy libraries load on demand only: core bundle stays ~46 KB gzip',
    ],
  },
  {
    icon: '⚡', title: 'API, Events & Persistence', demo: 'api', demoLabel: 'API playground',
    points: [
      'Imperative GridApi via ref: sorting, filtering, selection, export, getState / applyState / resetState',
      'Events for cell clicks, edits, selection, sort and filter changes',
      'Versioned localStorage persistence (column order, sizes, visibility, sorts, filters, grouping, density, theme, charts) with legacy-state migration',
    ],
  },
  {
    icon: '🧩', title: 'Grid Type Presets', demo: 'finance', demoLabel: 'Finance demo',
    points: [
      "One gridType prop applies a tuned preset: regular, drilldown, finance (dense, live-tick friendly), editable, highvol (500-row pages)",
      'Custom cell renderers and header renderers slot in anywhere — see the live-ticking finance P&L and tree drill-down demos',
      'React 18/19 + TanStack Table v8 + Tailwind; MIT licensed, no runtime fees',
    ],
  },
];

function OverviewDemo({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <section className="mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Everything the grid can do</h2>
        <p className="text-sm text-gray-500 mt-1 max-w-3xl">
          prdgrid is an MIT-licensed React data grid with AG-Grid-class data operations and an Airtable-class look.
          This site is served by the <code className="rounded bg-gray-100 px-1">prd-demo</code> container — every demo
          tab pulls its rows from a seeded SQLite database over a REST API. Pick any capability below to jump to the
          demo that shows it.
        </p>
      </div>
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
        {CAPABILITIES.map((c) => (
          <div key={c.title} className="flex flex-col rounded-lg border border-[#eaecf0] bg-white p-5 shadow-sm">
            <div className="mb-2 flex items-center gap-2.5">
              <span className="text-xl">{c.icon}</span>
              <h3 className="text-[15px] font-semibold text-[#101828]">{c.title}</h3>
            </div>
            <ul className="mb-4 flex-1 space-y-1.5">
              {c.points.map((p, i) => (
                <li key={i} className="flex gap-2 text-[12.5px] leading-snug text-[#475467]">
                  <span className="mt-0.5" style={{ color: '#3d7acd' }}>•</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <button
              className="self-start rounded-md border border-[#d4e3f8] bg-[#f4f8ff] px-3 py-1.5 text-[12px] font-semibold hover:bg-[#e5effd]"
              style={{ color: '#0e4491' }}
              onClick={() => onNavigate(c.demo)}
            >
              See it live → {c.demoLabel}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// APP — TABBED NAVIGATION
// ═══════════════════════════════════════════════════════════════════════

const navItems = [
  { id: 'overview', label: 'Overview', icon: '✨', component: null as any },
  { id: 'airtable', label: 'Airtable', icon: '🗂️', component: AirtableDemo },
  { id: 'charts', label: 'Charts', icon: '📊', component: ChartsDemo },
  { id: 'hr', label: 'HR', icon: '👥', component: HRDemo },
  { id: 'finance', label: 'Finance', icon: '📈', component: FinanceDemo },
  { id: 'performance', label: 'Performance', icon: '🏆', component: PerformanceDemo },
  { id: 'staffing', label: 'Staffing', icon: '🎯', component: StaffingDemo },
  { id: 'dark', label: 'Dark', icon: '🌙', component: DarkDemo },
  { id: 'brand', label: 'Brand', icon: '🎨', component: BrandDemo },
  { id: 'states', label: 'States', icon: '⏳', component: StatesDemo },
  { id: 'api', label: 'API', icon: '⚡', component: APIDemo },
];

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const ActiveDemo = navItems.find(n => n.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <nav className="sticky top-0 z-50" style={{ backgroundColor: '#0e4491' }}>
        <div className="mx-auto max-w-[1152px] px-6 flex items-center h-14 gap-4">
          <div className="flex items-center gap-2.5 mr-2">
            <div className="h-7 w-7 rounded-md bg-white flex items-center justify-center font-bold text-[11px]" style={{ color: '#0e4491' }}>pg</div>
            <span className="font-semibold text-white text-[15px] tracking-[-0.01em]">prdgrid</span>
            <span className="rounded border border-white/25 px-1.5 py-px text-[10px] font-medium text-white/70" style={{ fontFamily: 'var(--mono)' }}>v0.1.0</span>
          </div>
          <div className="h-4 w-px bg-white/20" />
          <div className="flex items-center gap-0.5 overflow-x-auto">
            {navItems.map(n => (
              <button key={n.id}
                onClick={() => setActiveTab(n.id)}
                style={{ border: 'none', font: 'inherit', cursor: 'pointer' }}
                className={`whitespace-nowrap rounded-md px-2 py-1.5 text-[12px] font-medium transition-colors ${
                  activeTab === n.id
                    ? 'bg-white/15 text-white'
                    : 'bg-transparent text-white/65 hover:bg-white/10 hover:text-white'
                }`}>
                {n.label}
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <a href="https://github.com/taj3rconnect/prdgrid" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12.5px] font-medium text-white/65 hover:bg-white/10 hover:text-white transition-colors">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            GitHub
          </a>
        </div>
      </nav>

      {activeTab === 'overview' && (
      <header className="border-b border-[#eaecf0] bg-white">
        <div className="mx-auto max-w-[1152px] px-6 py-10">
          <h1 className="text-[32px] font-bold leading-tight tracking-[-0.02em] text-[#101828]">
            The enterprise React data grid.
            <br />
            <span style={{ color: '#0e4491' }}>Zero license fees.</span>
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[#475467]">
            Sorting, filtering, row grouping, live updates, editing, charts, and exports — the
            feature set of a commercial grid, MIT-licensed and built on TanStack Table.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={() => setActiveTab('airtable')}
              className="rounded-md px-4 py-2 text-[13.5px] font-semibold text-white transition-colors"
              style={{ backgroundColor: '#0e4491', border: 'none', font: 'inherit', fontWeight: 600, cursor: 'pointer' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#00388f')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0e4491')}
            >
              Explore the demos
            </button>
            <a
              href="https://github.com/taj3rconnect/prdgrid" target="_blank" rel="noopener noreferrer"
              className="rounded-md border border-[#d0d5dd] bg-white px-4 py-2 text-[13.5px] font-semibold text-[#344054] transition-colors hover:bg-[#f9fafb]"
            >
              View on GitHub
            </a>
          </div>
          <div className="mt-6 flex flex-wrap gap-1.5">
            {['Sorting', 'Filtering', 'Row Grouping', 'Cell Editing', 'Live Updates',
              'Dark Mode', 'Themes', 'Pagination', 'Custom Renderers', 'Charts'].map(f => (
              <span key={f} className="rounded-md border border-[#eaecf0] bg-[#f9fafb] px-2 py-0.5 text-[11px] font-medium text-[#475467]">{f}</span>
            ))}
          </div>
        </div>
      </header>
      )}

      <div className="mx-auto max-w-[1152px] px-6 py-10">
        {ActiveDemo ? <ActiveDemo /> : <OverviewDemo onNavigate={setActiveTab} />}
        <footer className="mt-16 border-t border-[#eaecf0] pt-6 pb-10 text-center">
          <p className="text-sm text-[#667085]">prdgrid v0.1.0 — Built by <a href="https://github.com/taj3rconnect" className="hover:underline" style={{ color: '#0e4491' }}>Taj Haslani</a></p>
          <p className="text-xs text-[#98a2b3] mt-1">TanStack Table v8 + Tailwind CSS — MIT Licensed</p>
          <p className="text-xs text-[#98a2b3] mt-1">Built with assistance from <a href="https://claude.ai" className="hover:underline" style={{ color: '#3d7acd' }}>Claude</a> by Anthropic</p>
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
