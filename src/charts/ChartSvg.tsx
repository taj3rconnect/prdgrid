import type { ChartType } from '../types';
import type { ChartData } from './aggregate';

const SERIES_COLORS = [
  'var(--jt-grid-chart-1)',
  'var(--jt-grid-chart-2)',
  'var(--jt-grid-chart-3)',
  'var(--jt-grid-chart-4)',
  'var(--jt-grid-chart-5)',
  'var(--jt-grid-chart-6)',
];

export function seriesColor(index: number): string {
  return SERIES_COLORS[index % SERIES_COLORS.length]!;
}

const W = 480;
const H = 240;
const M = { top: 12, right: 12, bottom: 34, left: 48 };
const PW = W - M.left - M.right;
const PH = H - M.top - M.bottom;

function niceMax(v: number): number {
  if (v <= 0) return 1;
  const exp = Math.pow(10, Math.floor(Math.log10(v)));
  const f = v / exp;
  const nice = f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10;
  return nice * exp;
}

function fmt(v: number): string {
  if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (Math.abs(v) >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
  return Number.isInteger(v) ? String(v) : v.toFixed(1);
}

function truncateLabel(s: string, max = 9): string {
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}

function Axes({ max, categories }: { max: number; categories: string[] }) {
  const ticks = [0, 0.25, 0.5, 0.75, 1];
  const step = PW / categories.length;
  return (
    <>
      {ticks.map((t) => {
        const y = M.top + PH - t * PH;
        return (
          <g key={t}>
            <line x1={M.left} y1={y} x2={M.left + PW} y2={y} stroke="var(--jt-grid-chart-grid)" strokeWidth="1" />
            <text x={M.left - 6} y={y + 3.5} textAnchor="end" fontSize="10" fill="var(--jt-grid-text-secondary)">
              {fmt(max * t)}
            </text>
          </g>
        );
      })}
      {categories.map((c, i) => (
        <text
          key={i}
          x={M.left + step * i + step / 2}
          y={H - M.bottom + 14}
          textAnchor="middle"
          fontSize="10"
          fill="var(--jt-grid-text-secondary)"
        >
          <title>{c}</title>
          {truncateLabel(c)}
        </text>
      ))}
    </>
  );
}

function BarChartSvg({ data, stacked }: { data: ChartData; stacked: boolean }) {
  const { categories, series } = data;
  const totals = categories.map((_, ci) =>
    stacked ? series.reduce((acc, s) => acc + Math.max(0, s.values[ci] ?? 0), 0) : Math.max(...series.map((s) => s.values[ci] ?? 0))
  );
  const max = niceMax(Math.max(...totals, 0));
  const step = PW / categories.length;
  const groupW = step * 0.68;
  const barW = stacked ? groupW : groupW / series.length;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img">
      <Axes max={max} categories={categories} />
      {categories.map((cat, ci) => {
        let stackY = M.top + PH;
        return (
          <g key={ci}>
            {series.map((s, si) => {
              const v = Math.max(0, s.values[ci] ?? 0);
              const h = (v / max) * PH;
              const x = stacked
                ? M.left + step * ci + (step - groupW) / 2
                : M.left + step * ci + (step - groupW) / 2 + si * barW;
              const y = stacked ? stackY - h : M.top + PH - h;
              if (stacked) stackY -= h;
              return (
                <rect key={si} x={x + 0.5} y={y} width={Math.max(barW - 1, 1)} height={h} rx="3" fill={seriesColor(si)}>
                  <title>{`${cat} · ${s.label}: ${(s.values[ci] ?? 0).toLocaleString()}`}</title>
                </rect>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

function LineChartSvg({ data, area }: { data: ChartData; area: boolean }) {
  const { categories, series } = data;
  const max = niceMax(Math.max(...series.flatMap((s) => s.values), 0));
  const step = PW / categories.length;
  const px = (ci: number) => M.left + step * ci + step / 2;
  const py = (v: number) => M.top + PH - (Math.max(0, v) / max) * PH;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img">
      <Axes max={max} categories={categories} />
      {series.map((s, si) => {
        const pts = s.values.map((v, ci) => `${px(ci).toFixed(1)},${py(v).toFixed(1)}`);
        const color = seriesColor(si);
        return (
          <g key={si}>
            {area && (
              <polygon
                points={`${M.left + step / 2},${M.top + PH} ${pts.join(' ')} ${px(categories.length - 1)},${M.top + PH}`}
                fill={color}
                opacity="0.14"
              />
            )}
            <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
            {s.values.map((v, ci) => (
              <circle key={ci} cx={px(ci)} cy={py(v)} r="2.5" fill={color}>
                <title>{`${categories[ci]} · ${s.label}: ${v.toLocaleString()}`}</title>
              </circle>
            ))}
          </g>
        );
      })}
    </svg>
  );
}

function DonutChartSvg({ data }: { data: ChartData }) {
  const values = data.series[0]?.values || [];
  const total = values.reduce((a, b) => a + Math.max(0, b), 0) || 1;
  const cx = W / 2 - 70;
  const cy = H / 2;
  const r = 82;
  const inner = 48;
  let angle = -Math.PI / 2;

  const arcs = values.map((v, i) => {
    const frac = Math.max(0, v) / total;
    const a0 = angle;
    const a1 = angle + frac * Math.PI * 2;
    angle = a1;
    return { i, v, frac, a0, a1 };
  });

  const point = (a: number, radius: number) => `${cx + Math.cos(a) * radius},${cy + Math.sin(a) * radius}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img">
      {arcs.map(({ i, v, frac, a0, a1 }) => {
        if (frac <= 0) return null;
        const large = a1 - a0 > Math.PI ? 1 : 0;
        const d =
          frac >= 0.999
            ? `M ${point(0, r)} A ${r} ${r} 0 1 1 ${point(Math.PI, r)} A ${r} ${r} 0 1 1 ${point(0, r)} M ${point(0, inner)} A ${inner} ${inner} 0 1 0 ${point(Math.PI, inner)} A ${inner} ${inner} 0 1 0 ${point(0, inner)}`
            : `M ${point(a0, inner)} L ${point(a0, r)} A ${r} ${r} 0 ${large} 1 ${point(a1, r)} L ${point(a1, inner)} A ${inner} ${inner} 0 ${large} 0 ${point(a0, inner)} Z`;
        return (
          <path key={i} d={d} fill={seriesColor(i)} fillRule="evenodd" stroke="var(--jt-grid-chart-card-bg)" strokeWidth="1.5">
            <title>{`${data.categories[i]}: ${v.toLocaleString()} (${(frac * 100).toFixed(1)}%)`}</title>
          </path>
        );
      })}
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--jt-grid-text)">
        {fmt(total)}
      </text>
      {data.categories.slice(0, 8).map((c, i) => (
        <g key={i} transform={`translate(${W / 2 + 40}, ${M.top + 14 + i * 22})`}>
          <rect width="10" height="10" rx="2" fill={seriesColor(i)} />
          <text x="16" y="9" fontSize="11" fill="var(--jt-grid-text)">
            <title>{c}</title>
            {truncateLabel(c, 18)}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function ChartSvg({ type, data }: { type: ChartType; data: ChartData }) {
  if (data.categories.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-grid-sm text-grid-text-secondary">No data for this chart</div>
    );
  }
  switch (type) {
    case 'bar':
      return <BarChartSvg data={data} stacked={false} />;
    case 'stackedBar':
      return <BarChartSvg data={data} stacked />;
    case 'line':
      return <LineChartSvg data={data} area={false} />;
    case 'area':
      return <LineChartSvg data={data} area />;
    case 'donut':
      return <DonutChartSvg data={data} />;
  }
}
