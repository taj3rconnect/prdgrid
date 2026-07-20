import { useState, useEffect } from 'react';
import { DataGrid } from '../../src';
import type { ColumnDef, CellRendererParams } from '../../src';
import { Section } from '../Section';

interface SysinfoRow {
  package: string;
  area: string;
  type: string;
  inUse: string;
  latest: string;
  status: 'up-to-date' | 'patch' | 'minor' | 'major' | 'unknown';
}

const SYS_STATUS_STYLE: Record<string, string> = {
  'up-to-date': 'bg-green-100 text-green-700 border-green-200',
  patch: 'bg-slate-100 text-slate-600 border-slate-200',
  minor: 'bg-amber-100 text-amber-700 border-amber-200',
  major: 'bg-red-100 text-red-700 border-red-200',
  unknown: 'bg-gray-100 text-gray-500 border-gray-200',
};

function SysStatusBadge({ value }: CellRendererParams<SysinfoRow>) {
  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-medium ${SYS_STATUS_STYLE[value] || SYS_STATUS_STYLE.unknown}`}>
      {value}
    </span>
  );
}

export function SysinfoView() {
  const [rows, setRows] = useState<SysinfoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/v1/sysinfo')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((j) => {
        if (!cancelled) setRows(Array.isArray(j.rows) ? j.rows : []);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const counts = {
    total: rows.length,
    ok: rows.filter((r) => r.status === 'up-to-date').length,
    patch: rows.filter((r) => r.status === 'patch').length,
    minor: rows.filter((r) => r.status === 'minor').length,
    major: rows.filter((r) => r.status === 'major').length,
  };

  const cols: ColumnDef<SysinfoRow>[] = [
    { field: 'package', headerName: 'Package', width: 240, sortable: true, filter: 'text',
      cellStyle: () => ({ fontFamily: 'var(--mono)', fontSize: '12px', fontWeight: 600 }) },
    { field: 'area', headerName: 'Area', width: 110, sortable: true, filter: 'set' },
    { field: 'type', headerName: 'Type', width: 150, sortable: true, filter: 'set' },
    { field: 'inUse', headerName: 'In use', width: 120, sortable: true,
      cellStyle: () => ({ fontFamily: 'var(--mono)', textAlign: 'right' }) },
    { field: 'latest', headerName: 'Latest', width: 120, sortable: true,
      cellStyle: () => ({ fontFamily: 'var(--mono)', textAlign: 'right' }) },
    { field: 'status', headerName: 'Status', width: 130, sortable: true, filter: 'set',
      cellRenderer: SysStatusBadge },
  ];

  const tiles: [string, number][] = [
    ['Packages', counts.total],
    ['Up to date', counts.ok],
    ['Patch behind', counts.patch],
    ['Minor behind', counts.minor],
    ['Major behind', counts.major],
  ];

  return (
    <Section title="System Info"
      subtitle="Live tech stack of this deployment — version in use vs latest on the npm registry. Read-only: this is a public demo, so the standard Upgrade/Restart admin actions are intentionally omitted."
      tags={['Live Registry Lookup', 'Drift KPIs', 'Read-only']}>
      {error && (
        <div className="mb-3 rounded-lg border border-[#eaecf0] bg-white px-4 py-3 text-[13px] text-[#475467]">
          The sysinfo API is not reachable from this hosting mode (static preview). Deployed
          instances serve it at <code className="rounded bg-gray-100 px-1" style={{ fontFamily: 'var(--mono)' }}>/api/v1/sysinfo</code>.
        </div>
      )}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {tiles.map(([label, n]) => (
          <div key={label} className="rounded-lg border border-[#eaecf0] bg-white px-4 py-3">
            <div className="text-right text-[22px] font-bold tabular-nums text-[#101828]" style={{ fontFamily: 'var(--mono)' }}>{n}</div>
            <div className="mt-0.5 text-right text-[11px] font-medium text-[#667085]">{label}</div>
          </div>
        ))}
      </div>
      <DataGrid<SysinfoRow>
        gridId="sysinfo" rowData={rows} columnDefs={cols}
        defaultColDef={{ sortable: true, resizable: true }}
        getRowId={(d) => `${d.area}:${d.package}`}
        loading={loading} height={520} statusBar
        toolbar={{ search: true, export: { csv: true } }}
        noRowsMessage="Zero rows — sysinfo data unavailable in this hosting mode"
      />
    </Section>
  );
}
