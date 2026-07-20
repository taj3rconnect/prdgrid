import React from 'react';
import type { ColumnDataType, SparklineType } from '../types';

// ─── Field-type header icons (14px, monochrome via currentColor) ─────

const ICON_PROPS = { width: 14, height: 14, viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

export function FieldTypeIcon({ dataType }: { dataType?: ColumnDataType }) {
  if (!dataType) return null;
  const icon = (() => {
    switch (dataType) {
      case 'text':
        return <text x="8" y="12" textAnchor="middle" fontSize="11" fontWeight="600" fill="currentColor" stroke="none">A</text>;
      case 'number':
        return <text x="8" y="12" textAnchor="middle" fontSize="11" fontWeight="600" fill="currentColor" stroke="none">#</text>;
      case 'currency':
        return <text x="8" y="12" textAnchor="middle" fontSize="11" fontWeight="600" fill="currentColor" stroke="none">$</text>;
      case 'percent':
        return <text x="8" y="12" textAnchor="middle" fontSize="11" fontWeight="600" fill="currentColor" stroke="none">%</text>;
      case 'date':
        return (
          <>
            <rect x="2" y="3" width="12" height="11" rx="1.5" />
            <path d="M2 6.5h12M5.5 1.5v3M10.5 1.5v3" />
          </>
        );
      case 'select':
        return (
          <>
            <circle cx="8" cy="8" r="6" />
            <path d="M5.5 7l2.5 2.5L10.5 7" />
          </>
        );
      case 'multiSelect':
        return <path d="M2 4h8M2 8h12M2 12h6" />;
      case 'checkbox':
        return (
          <>
            <rect x="2.5" y="2.5" width="11" height="11" rx="2" />
            <path d="M5.5 8l2 2 3.5-4" />
          </>
        );
      case 'rating':
        return <path d="M8 1.8l1.9 3.9 4.3.6-3.1 3 .7 4.2L8 11.5l-3.8 2 .7-4.2-3.1-3 4.3-.6L8 1.8z" />;
      case 'progress':
        return (
          <>
            <rect x="2" y="6" width="12" height="4" rx="2" />
            <rect x="2" y="6" width="7" height="4" rx="2" fill="currentColor" stroke="none" />
          </>
        );
      case 'link':
        return <path d="M6.5 9.5l3-3M5 11l-1.2 1.2a2.5 2.5 0 01-3.5-3.5L3.5 5.5M12.5 10.5L14 9a2.5 2.5 0 00-3.5-3.5L9 7" transform="translate(0.5 -0.5)" />;
      case 'user':
        return (
          <>
            <circle cx="8" cy="5.5" r="3" />
            <path d="M2.5 14a5.5 5.5 0 0111 0" />
          </>
        );
      default:
        return null;
    }
  })();
  if (!icon) return null;
  return (
    <svg {...ICON_PROPS} className="jt-field-icon shrink-0" style={{ color: 'var(--jt-grid-header-icon)' }} aria-hidden>
      {icon}
    </svg>
  );
}

// ─── Deterministic chip colors ───────────────────────────────────────

const CHIP_PALETTE: { bg: string; text: string }[] = [
  { bg: '#dbe7fd', text: '#1e429f' },
  { bg: '#d9f4e4', text: '#085d3a' },
  { bg: '#fdeccb', text: '#93470c' },
  { bg: '#fbe1ea', text: '#a11043' },
  { bg: '#ebe5ff', text: '#5925dc' },
  { bg: '#d5f5f0', text: '#125d56' },
  { bg: '#fde5d8', text: '#932f19' },
  { bg: '#e6e9ee', text: '#344054' },
  { bg: '#d8f0fd', text: '#0b5394' },
  { bg: '#f2e8d5', text: '#6b4e16' },
];

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function chipColor(value: string): { bg: string; text: string } {
  return CHIP_PALETTE[hashString(value) % CHIP_PALETTE.length]!;
}

export function Chip({ value }: { value: string }) {
  const { bg, text } = chipColor(value);
  return (
    <span className="jt-chip" style={{ backgroundColor: bg, color: text }}>
      {value}
    </span>
  );
}

// ─── Built-in typed cell renderers ───────────────────────────────────

function RatingStars({ value }: { value: number }) {
  const rating = Math.max(0, Math.min(5, Math.round(Number(value) || 0)));
  return (
    <span className="inline-flex items-center gap-0.5" title={`${value} / 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 16 16" aria-hidden>
          <path
            d="M8 1.8l1.9 3.9 4.3.6-3.1 3 .7 4.2L8 11.5l-3.8 2 .7-4.2-3.1-3 4.3-.6L8 1.8z"
            fill={i < rating ? '#f7b32b' : 'none'}
            stroke={i < rating ? '#f7b32b' : 'var(--jt-grid-border-strong)'}
            strokeWidth="1.2"
          />
        </svg>
      ))}
    </span>
  );
}

function ProgressBar({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <span className="flex items-center gap-2 w-full min-w-0">
      <span className="h-1.5 flex-1 min-w-[36px] rounded-full overflow-hidden" style={{ backgroundColor: 'var(--jt-grid-accent-light)' }}>
        <span className="block h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: 'var(--jt-grid-accent)' }} />
      </span>
      <span className="text-grid-sm text-grid-text-secondary tabular-nums shrink-0">{Math.round(pct)}%</span>
    </span>
  );
}

function UserAvatar({ value }: { value: string }) {
  const name = String(value);
  const initials = name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const { bg, text } = chipColor(name);
  return (
    <span className="inline-flex items-center gap-2 min-w-0">
      <span
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold"
        style={{ backgroundColor: bg, color: text }}
      >
        {initials}
      </span>
      <span className="truncate">{name}</span>
    </span>
  );
}

function CheckboxCell({ value }: { value: any }) {
  const checked = value === true || value === 'true' || value === 1;
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden>
      <rect
        x="1.5" y="1.5" width="13" height="13" rx="3.5"
        fill={checked ? 'var(--jt-grid-accent)' : 'transparent'}
        stroke={checked ? 'var(--jt-grid-accent)' : 'var(--jt-grid-border-strong)'}
        strokeWidth="1.4"
      />
      {checked && <path d="M4.5 8.2l2.3 2.3 4.7-5" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  );
}

/**
 * Built-in renderer for typed columns. Returns null when the value should
 * fall through to default text rendering. Custom cellRenderer always wins upstream.
 */
export function renderTypedCell(dataType: ColumnDataType, value: any, formattedValue: string): React.ReactNode | null {
  if (value == null || value === '') return null;
  switch (dataType) {
    case 'select':
      return <Chip value={String(value)} />;
    case 'multiSelect': {
      const values = Array.isArray(value) ? value : String(value).split(',').map((v) => v.trim());
      return (
        <span className="inline-flex items-center gap-1 min-w-0 overflow-hidden">
          {values.filter(Boolean).map((v, i) => (
            <Chip key={`${v}-${i}`} value={String(v)} />
          ))}
        </span>
      );
    }
    case 'checkbox':
      return <CheckboxCell value={value} />;
    case 'rating':
      return <RatingStars value={Number(value)} />;
    case 'progress':
      return <ProgressBar value={Number(value)} />;
    case 'user':
      return <UserAvatar value={String(value)} />;
    case 'link': {
      const href = String(value);
      const display = formattedValue || href.replace(/^https?:\/\//, '');
      return (
        <a
          href={href.startsWith('http') ? href : `https://${href}`}
          target="_blank"
          rel="noreferrer"
          className="truncate underline-offset-2 hover:underline"
          style={{ color: 'var(--jt-grid-accent)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {display}
        </a>
      );
    }
    default:
      return null;
  }
}

// Plain-text typed formatting now lives in the dataType registry
export { formatTypedValue } from '../core/dataTypeRegistry';

// ─── Sparklines (inline SVG for array values) ────────────────────────

export function Sparkline({ type, values, width = 96, height = 22 }: { type: SparklineType; values: number[]; width?: number; height?: number }) {
  const nums = (values || []).map(Number).filter((v) => !isNaN(v));
  if (nums.length === 0) return null;
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  const range = max - min || 1;
  const pad = 2;

  if (type === 'line') {
    const pts = nums.map((v, i) => {
      const x = pad + (i / Math.max(nums.length - 1, 1)) * (width - pad * 2);
      const y = height - pad - ((v - min) / range) * (height - pad * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    const up = (nums[nums.length - 1] ?? 0) >= (nums[0] ?? 0);
    return (
      <svg width={width} height={height} className="inline-block align-middle" aria-hidden>
        <polyline
          points={pts.join(' ')}
          fill="none"
          stroke={up ? 'var(--jt-grid-success)' : 'var(--jt-grid-error)'}
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  const barW = Math.max(2, (width - pad * 2) / nums.length - 1.5);
  return (
    <svg width={width} height={height} className="inline-block align-middle" aria-hidden>
      {nums.map((v, i) => {
        const x = pad + (i * (width - pad * 2)) / nums.length;
        if (type === 'winloss') {
          const mid = height / 2;
          const h = Math.max(2, (Math.abs(v) / Math.max(Math.abs(min), Math.abs(max), 1)) * (height / 2 - pad));
          return (
            <rect
              key={i}
              x={x}
              y={v >= 0 ? mid - h : mid}
              width={barW}
              height={h}
              rx="1"
              fill={v >= 0 ? 'var(--jt-grid-success)' : 'var(--jt-grid-error)'}
            />
          );
        }
        const h = Math.max(2, ((v - min) / range) * (height - pad * 2));
        return <rect key={i} x={x} y={height - pad - h} width={barW} height={h} rx="1" fill="var(--jt-grid-accent)" />;
      })}
    </svg>
  );
}

/** Subtle accent bar drawn behind a numeric value, proportional to columnMax */
export function DataBar({ value, columnMax, children }: { value: number; columnMax: number; children: React.ReactNode }) {
  const pct = columnMax > 0 ? Math.max(0, Math.min(100, (Number(value) / columnMax) * 100)) : 0;
  return (
    <span className="relative block w-full">
      <span
        className="absolute inset-y-0.5 left-0 rounded-sm"
        style={{ width: `${pct}%`, backgroundColor: 'color-mix(in srgb, var(--jt-grid-accent) 18%, transparent)' }}
        aria-hidden
      />
      <span className="relative block truncate">{children}</span>
    </span>
  );
}
