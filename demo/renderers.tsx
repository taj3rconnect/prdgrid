import type { CellRendererParams } from '../src';
import type { HREmployee, FinanceRow, GameRow, Candidate, Product } from './sampleData';

// ─── HR Renderers ───

export function EmployeeCell({ data }: CellRendererParams<HREmployee>) {
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

export function DeptChip({ value }: CellRendererParams<HREmployee>) {
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

export function LocationCell({ data }: CellRendererParams<HREmployee>) {
  const d = data as HREmployee;
  return (
    <span className="flex items-center gap-2">
      <span className="text-base">{d.flag}</span>
      <span>{d.location}</span>
    </span>
  );
}

export function PaymentStatusBadge({ value }: CellRendererParams<HREmployee>) {
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

export function ContactCell() {
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

export function TickerCell({ data }: CellRendererParams<FinanceRow>) {
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

export function SparklineBar({ value }: CellRendererParams<FinanceRow>) {
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

export function DeltaValueCell({ value, data, colDef }: CellRendererParams<FinanceRow>) {
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

export function StarRating({ value }: CellRendererParams<GameRow>) {
  const n = Number(value) || 0;
  return (
    <span className="text-amber-400 tracking-wider text-sm">
      {'★'.repeat(n)}{'☆'.repeat(5 - n)}
    </span>
  );
}

export function CountryCell({ data }: CellRendererParams<GameRow>) {
  const d = data as GameRow;
  return (
    <span className="flex items-center gap-2">
      <span className="text-base">{d.countryFlag}</span>
      <span>{d.country}</span>
    </span>
  );
}

export function BoughtCell({ value }: CellRendererParams<GameRow>) {
  return value ? (
    <span className="text-green-600 text-sm">✓</span>
  ) : (
    <span className="text-gray-300 text-sm">✗</span>
  );
}

// ─── Staffing Renderers ───

export function StageBadge({ value }: CellRendererParams<any>) {
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

export function PriorityCell({ value }: CellRendererParams<Candidate>) {
  const cfg: Record<string, { color: string; icon: string }> = {
    Hot: { color: 'bg-red-100 text-red-700', icon: '🔥' },
    Warm: { color: 'bg-amber-100 text-amber-700', icon: '🟡' },
    Cold: { color: 'bg-blue-100 text-blue-700', icon: '🔵' },
  };
  const c = cfg[value] || cfg['Cold']!;
  return <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-medium ${c.color}`}>{c.icon} {value}</span>;
}

export function InStockCell({ value }: CellRendererParams<Product>) {
  return value
    ? <span className="text-green-600 font-medium text-[11px]">● In Stock</span>
    : <span className="text-red-500 font-medium text-[11px]">● Out of Stock</span>;
}
