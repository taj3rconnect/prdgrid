import { useState } from 'react';
import { Table } from '@tanstack/react-table';
import { clsx } from 'clsx';
import { generateCsvString } from '../export/csvExport';
import { generatePdfBase64, generateHtmlTable } from '../export/pdfExport';
import { TypeaheadSelect } from './TypeaheadSelect';

type Tab = 'email' | 'schedule';
type ExportFormat = 'html' | 'pdf' | 'csv';
type Frequency = 'daily' | 'weekly' | 'monthly';

interface ExportModalProps<TData> {
  isOpen: boolean;
  initialTab?: Tab;
  onClose: () => void;
  table: Table<TData>;
  title?: string;
  emailEndpoint?: string;
  scheduleEndpoint?: string;
  fetchHeaders?: Record<string, string>;
}

const FORMAT_LABELS: Record<ExportFormat, string> = {
  html: 'HTML table (inline)',
  pdf: 'PDF attachment',
  csv: 'CSV attachment',
};

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

async function buildPayload<TData>(table: Table<TData>, format: ExportFormat, title: string) {
  if (format === 'html') return { bodyHtml: generateHtmlTable(table, title) };
  if (format === 'csv') return { attachment: { type: 'csv', content: generateCsvString(table) } };
  return { attachment: { type: 'pdf', contentBase64: await generatePdfBase64(table, { title }) } };
}

export function ExportModal<TData>({
  isOpen,
  initialTab = 'email',
  onClose,
  table,
  title = 'Report',
  emailEndpoint,
  scheduleEndpoint,
  fetchHeaders,
}: ExportModalProps<TData>) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [to, setTo] = useState('');
  const [cc, setCc] = useState('');
  const [subject, setSubject] = useState(title);
  const [message, setMessage] = useState('');
  const [format, setFormat] = useState<ExportFormat>('html');
  const [freq, setFreq] = useState<Frequency>('weekly');
  const [dow, setDow] = useState(1);
  const [dom, setDom] = useState(1);
  const [time, setTime] = useState('09:00');
  const [status, setStatus] = useState<'idle' | 'busy' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const endpoint = tab === 'email' ? emailEndpoint : scheduleEndpoint || emailEndpoint;

  const submit = async () => {
    if (!endpoint) return;
    setStatus('busy');
    setError('');
    try {
      const base = {
        to: to.split(/[,;\s]+/).filter(Boolean),
        cc: cc.split(/[,;\s]+/).filter(Boolean),
        subject,
        message,
        format,
        ...(await buildPayload(table, format, subject)),
      };
      const body =
        tab === 'email'
          ? base
          : { ...base, schedule: { frequency: freq, dayOfWeek: dow, dayOfMonth: dom, time } };
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...fetchHeaders },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      setStatus('done');
    } catch (e: any) {
      setStatus('error');
      setError(e?.message || 'Request failed');
    }
  };

  const inputCls = 'jt-input h-7 w-full px-2';
  const labelCls = 'mb-1 block text-grid-sm font-medium text-grid-text-secondary';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgb(16 24 40 / 0.25)' }}
      onClick={onClose}
    >
      <div
        className="w-[400px] max-w-[92vw] rounded-xl p-4"
        style={{ backgroundColor: 'var(--jt-grid-menu-bg)', border: '1px solid var(--jt-grid-border)', boxShadow: 'var(--jt-grid-menu-shadow)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-grid-lg font-semibold text-grid-text">Send Report</h3>
          <button className="jt-btn !px-1.5" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 4l8 8M12 4l-8 8" /></svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-3 flex items-center rounded-md p-0.5" style={{ backgroundColor: 'var(--jt-grid-row-hover)' }}>
          {(['email', 'schedule'] as Tab[]).map((t) => (
            <button
              key={t}
              className="flex h-6 flex-1 items-center justify-center rounded text-grid-sm font-medium capitalize transition-colors"
              style={
                tab === t
                  ? { backgroundColor: 'var(--jt-grid-bg)', color: 'var(--jt-grid-accent)', boxShadow: '0 1px 2px rgb(16 24 40 / 0.08)' }
                  : { color: 'var(--jt-grid-text-secondary)' }
              }
              onClick={() => {
                setTab(t);
                setStatus('idle');
              }}
            >
              {t === 'email' ? 'Email now' : 'Schedule'}
            </button>
          ))}
        </div>

        {!endpoint ? (
          <p className="py-4 text-center text-grid-sm text-grid-text-secondary">
            No {tab} endpoint configured — set <code>emailExportEndpoint</code> on the grid.
          </p>
        ) : (
          <div className="space-y-2.5">
            <div>
              <label className={labelCls}>To (comma-separated)</label>
              <input className={inputCls} value={to} onChange={(e) => setTo(e.target.value)} placeholder="alice@company.com, bob@company.com" />
            </div>
            <div>
              <label className={labelCls}>CC</label>
              <input className={inputCls} value={cc} onChange={(e) => setCc(e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Subject</label>
              <input className={inputCls} value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Message</label>
              <textarea className="jt-input w-full px-2 py-1" rows={2} value={message} onChange={(e) => setMessage(e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Format</label>
              <div className="flex gap-1">
                {(Object.keys(FORMAT_LABELS) as ExportFormat[]).map((f) => (
                  <button
                    key={f}
                    className={clsx('jt-btn flex-1 justify-center !h-7', format === f && 'jt-btn-active')}
                    style={{ border: '1px solid var(--jt-grid-border)' }}
                    onClick={() => setFormat(f)}
                  >
                    {FORMAT_LABELS[f]}
                  </button>
                ))}
              </div>
            </div>

            {tab === 'schedule' && (
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className={labelCls}>Frequency</label>
                  <TypeaheadSelect className="w-full" ariaLabel="Frequency" value={freq}
                    options={[{ value: 'daily', label: 'Daily' }, { value: 'weekly', label: 'Weekly' }, { value: 'monthly', label: 'Monthly' }]}
                    onChange={(v) => setFreq(v as Frequency)} />
                </div>
                {freq === 'weekly' && (
                  <div className="flex-1">
                    <label className={labelCls}>Day</label>
                    <TypeaheadSelect className="w-full" ariaLabel="Day of week" value={String(dow)}
                      options={DAY_NAMES.map((d, i) => ({ value: String(i), label: d }))}
                      onChange={(v) => setDow(Number(v))} />
                  </div>
                )}
                {freq === 'monthly' && (
                  <div className="flex-1">
                    <label className={labelCls}>Day of month</label>
                    <TypeaheadSelect className="w-full" ariaLabel="Day of month" value={String(dom)}
                      options={Array.from({ length: 28 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }))}
                      onChange={(v) => setDom(Number(v))} />
                  </div>
                )}
                <div className="flex-1">
                  <label className={labelCls}>Time</label>
                  <input type="time" className={inputCls} value={time} onChange={(e) => setTime(e.target.value)} />
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="flex items-center justify-between rounded-md px-2 py-1.5 text-grid-sm" style={{ backgroundColor: 'color-mix(in srgb, var(--jt-grid-error) 10%, transparent)', color: 'var(--jt-grid-error)' }}>
                <span className="truncate">{error}</span>
                <button className="underline" onClick={() => navigator.clipboard?.writeText(error)}>copy</button>
              </div>
            )}
            {status === 'done' && (
              <div className="rounded-md px-2 py-1.5 text-grid-sm" style={{ backgroundColor: 'color-mix(in srgb, var(--jt-grid-success) 12%, transparent)', color: 'var(--jt-grid-success)' }}>
                {tab === 'email' ? 'Report sent.' : 'Schedule saved.'}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-1">
              <button className="jt-btn" onClick={onClose}>Close</button>
              <button
                className="jt-btn !text-white"
                style={{ backgroundColor: 'var(--jt-grid-accent)', opacity: status === 'busy' || !to ? 0.6 : 1 }}
                disabled={status === 'busy' || !to}
                onClick={submit}
              >
                {status === 'busy' ? 'Sending…' : tab === 'email' ? 'Send now' : 'Save schedule'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
