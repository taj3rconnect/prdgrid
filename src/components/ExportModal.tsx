import React, { useState, useEffect, useCallback } from 'react';
import { Table } from '@tanstack/react-table';
import { clsx } from 'clsx';
import { exportToCsv } from '../export/csvExport';
import { exportToExcel } from '../export/excelExport';
import { exportToPdf, generatePdfBase64, generateHtmlTable } from '../export/pdfExport';
import { generateCsvString } from '../export/csvExport';

type Tab = 'download' | 'email' | 'schedule';
type ExportFormat = 'html' | 'pdf' | 'csv' | 'excel';
type Frequency = 'daily' | 'weekly' | 'monthly';

interface ScheduleEntry {
  id: string | number;
  frequency: Frequency;
  dayOfWeek?: number;
  dayOfMonth?: number;
  timeHour: number;
  timeMinute: number;
  format: ExportFormat;
  toEmails: string;
  ccEmails?: string;
  reportType?: string;
}

interface ExportModalProps<TData> {
  isOpen: boolean;
  onClose: () => void;
  table: Table<TData>;
  title?: string;
  reportType?: string;
  emailEndpoint?: string;
  scheduleEndpoint?: string;
  fetchHeaders?: Record<string, string>;
}

const FORMAT_LABELS: Record<ExportFormat, string> = {
  html: 'HTML Table (inline)',
  pdf: 'PDF Attachment',
  csv: 'CSV Attachment',
  excel: 'Excel Attachment',
};

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = [0, 15, 30, 45];

export function ExportModal<TData>({
  isOpen,
  onClose,
  table,
  title = 'Report',
  reportType = 'generic',
  emailEndpoint,
  scheduleEndpoint,
  fetchHeaders,
}: ExportModalProps<TData>) {
  const [tab, setTab] = useState<Tab>('download');

  // Email state
  const [emailTo, setEmailTo] = useState('');
  const [emailCc, setEmailCc] = useState('');
  const [emailSubject, setEmailSubject] = useState(title);
  const [emailMessage, setEmailMessage] = useState('');
  const [emailFormat, setEmailFormat] = useState<ExportFormat>('html');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [emailError, setEmailError] = useState('');

  // Schedule state
  const [schedFreq, setSchedFreq] = useState<Frequency>('weekly');
  const [schedDow, setSchedDow] = useState(1);
  const [schedDom, setSchedDom] = useState(1);
  const [schedHour, setSchedHour] = useState(9);
  const [schedMin, setSchedMin] = useState(0);
  const [schedFormat, setSchedFormat] = useState<ExportFormat>('html');
  const [schedTo, setSchedTo] = useState('');
  const [schedCc, setSchedCc] = useState('');
  const [schedStatus, setSchedStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [schedError, setSchedError] = useState('');
  const [schedules, setSchedules] = useState<ScheduleEntry[]>([]);
  const [loadingSchedules, setLoadingSchedules] = useState(false);

  const rowCount = table.getFilteredRowModel().rows.filter((r) => !r.getIsGrouped()).length;

  const loadSchedules = useCallback(async () => {
    if (!scheduleEndpoint) return;
    setLoadingSchedules(true);
    try {
      const res = await fetch(scheduleEndpoint, { credentials: 'include', headers: fetchHeaders });
      if (res.ok) setSchedules(await res.json());
    } catch { /* ignore */ }
    finally { setLoadingSchedules(false); }
  }, [scheduleEndpoint]);

  useEffect(() => {
    if (isOpen && tab === 'schedule') loadSchedules();
  }, [isOpen, tab, loadSchedules]);

  if (!isOpen) return null;

  // ─── Download handlers ───
  const handleDownloadCsv = () => exportToCsv(table, { fileName: `${reportType}-export.csv` });
  const handleDownloadExcel = () => exportToExcel(table, { fileName: `${reportType}-export.xlsx`, sheetName: title });
  const handleDownloadPdf = () => exportToPdf(table, { fileName: `${reportType}-export.pdf`, title });

  // ─── Email send ───
  const handleSendEmail = async () => {
    if (!emailTo.trim() || !emailEndpoint) return;
    setEmailStatus('sending');
    setEmailError('');
    try {
      const toList = emailTo.split(',').map((e) => e.trim()).filter(Boolean);
      const ccList = emailCc.split(',').map((e) => e.trim()).filter(Boolean);

      let html = '';
      const attachments: any[] = [];

      if (emailFormat === 'html') {
        html = generateHtmlTable(table, title);
      } else if (emailFormat === 'pdf') {
        const b64 = await generatePdfBase64(table, { title });
        attachments.push({ content: b64, filename: `${reportType}-report.pdf`, type: 'application/pdf', disposition: 'attachment' });
        html = `<p>Please find the ${title} PDF attached.</p>`;
      } else if (emailFormat === 'csv') {
        const csv = generateCsvString(table);
        attachments.push({
          content: btoa(unescape(encodeURIComponent(csv))),
          filename: `${reportType}-report.csv`,
          type: 'text/csv',
          disposition: 'attachment',
        });
        html = `<p>Please find the ${title} CSV attached.</p>`;
      } else if (emailFormat === 'excel') {
        // For Excel we'd need to generate the buffer — send CSV as fallback
        const csv = generateCsvString(table);
        attachments.push({
          content: btoa(unescape(encodeURIComponent(csv))),
          filename: `${reportType}-report.csv`,
          type: 'text/csv',
          disposition: 'attachment',
        });
        html = `<p>Please find the ${title} export attached.</p>`;
      }

      const res = await fetch(emailEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...fetchHeaders },
        credentials: 'include',
        body: JSON.stringify({
          to: toList,
          cc: ccList.length ? ccList : undefined,
          subject: emailSubject || title,
          message: emailMessage,
          periodLabel: '',
          reportType,
          html,
          attachments: attachments.length ? attachments : undefined,
        }),
      });

      if (!res.ok) throw new Error(await res.text());
      setEmailStatus('sent');
      setTimeout(() => setEmailStatus('idle'), 3000);
    } catch (err: any) {
      setEmailStatus('error');
      setEmailError(err?.message || 'Failed to send email');
    }
  };

  // ─── Schedule save ───
  const handleSaveSchedule = async () => {
    if (!schedTo.trim() || !scheduleEndpoint) return;
    setSchedStatus('saving');
    setSchedError('');
    try {
      const res = await fetch(scheduleEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...fetchHeaders },
        credentials: 'include',
        body: JSON.stringify({
          reportType,
          frequency: schedFreq,
          dayOfWeek: schedFreq === 'weekly' ? schedDow : undefined,
          dayOfMonth: schedFreq === 'monthly' ? schedDom : undefined,
          timeHour: schedHour,
          timeMinute: schedMin,
          period: 'TM',
          format: schedFormat,
          toEmails: schedTo,
          ccEmails: schedCc || undefined,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setSchedStatus('saved');
      setSchedTo('');
      setSchedCc('');
      await loadSchedules();
      setTimeout(() => setSchedStatus('idle'), 2000);
    } catch (err: any) {
      setSchedStatus('error');
      setSchedError(err?.message || 'Failed to save schedule');
    }
  };

  const handleDeleteSchedule = async (id: string | number) => {
    if (!scheduleEndpoint) return;
    try {
      await fetch(`${scheduleEndpoint}/${id}`, { method: 'DELETE', credentials: 'include', headers: fetchHeaders });
      setSchedules((prev) => prev.filter((s) => s.id !== id));
    } catch { /* ignore */ }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end pt-10 pr-4" onClick={onClose}>
      <div
        className="w-[480px] max-h-[80vh] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Export Report</h3>
            <p className="text-xs text-gray-500 mt-0.5">{rowCount.toLocaleString()} rows · {title}</p>
          </div>
          <button className="text-gray-400 hover:text-gray-600 text-xl leading-none" onClick={onClose}>&times;</button>
        </div>

        {/* Tabs — always show all 3 */}
        <div className="flex border-b border-gray-200">
          {([['download', 'Download'], ['email', 'Email Now'], ['schedule', 'Schedule']] as [Tab, string][]).map(([key, label]) => (
            <button
              key={key}
              className={clsx(
                'flex-1 py-2 text-xs font-medium transition-colors',
                tab === key
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              )}
              onClick={() => setTab(key)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {/* ── Download Tab ── */}
          {tab === 'download' && (
            <div className="space-y-2">
              <DownloadButton icon="📄" label="Download PDF" sublabel="Formatted table with headers" onClick={handleDownloadPdf} />
              <DownloadButton icon="📊" label="Download Excel" sublabel=".xlsx with auto column widths" onClick={handleDownloadExcel} />
              <DownloadButton icon="📋" label="Download CSV" sublabel="Comma-separated values" onClick={handleDownloadCsv} />
            </div>
          )}

          {/* ── Email Tab ── */}
          {tab === 'email' && (
            <div className="space-y-3">
              {!emailEndpoint && (
                <div className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                  Pass <code className="font-mono">emailExportEndpoint</code> prop to enable sending.
                </div>
              )}
              <Field label="To *">
                <input
                  type="text"
                  className="field-input"
                  placeholder="email@example.com, another@example.com"
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                />
              </Field>
              <Field label="CC">
                <input
                  type="text"
                  className="field-input"
                  placeholder="cc@example.com"
                  value={emailCc}
                  onChange={(e) => setEmailCc(e.target.value)}
                />
              </Field>
              <Field label="Subject">
                <input
                  type="text"
                  className="field-input"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                />
              </Field>
              <Field label="Message">
                <textarea
                  className="field-input resize-none"
                  rows={2}
                  placeholder="Optional message..."
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                />
              </Field>
              <Field label="Format">
                <select className="field-input" value={emailFormat} onChange={(e) => setEmailFormat(e.target.value as ExportFormat)}>
                  {(Object.entries(FORMAT_LABELS) as [ExportFormat, string][]).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </Field>

              {emailStatus === 'error' && <p className="text-xs text-red-600">{emailError}</p>}
              {emailStatus === 'sent' && <p className="text-xs text-green-600">Email sent successfully.</p>}

              <button
                className={clsx(
                  'w-full rounded py-2 text-sm font-medium text-white transition-colors',
                  emailStatus === 'sending' ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                )}
                disabled={!emailTo.trim() || emailStatus === 'sending' || !emailEndpoint}
                onClick={handleSendEmail}
              >
                {emailStatus === 'sending' ? 'Sending...' : 'Send Email'}
              </button>
            </div>
          )}

          {/* ── Schedule Tab ── */}
          {tab === 'schedule' && (
            <div className="space-y-4">
              {!scheduleEndpoint && (
                <div className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                  Pass <code className="font-mono">scheduleExportEndpoint</code> prop to enable scheduling.
                </div>
              )}
              {/* Existing schedules */}
              {scheduleEndpoint && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Active Schedules</p>
                  {loadingSchedules ? (
                    <p className="text-xs text-gray-400">Loading...</p>
                  ) : schedules.length === 0 ? (
                    <p className="text-xs text-gray-400">No active schedules.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {schedules.map((s) => (
                        <div key={s.id} className="flex items-center justify-between rounded border border-gray-100 bg-gray-50 px-3 py-2">
                          <div>
                            <p className="text-xs font-medium text-gray-700 capitalize">{s.frequency} · {s.timeHour.toString().padStart(2,'0')}:{s.timeMinute.toString().padStart(2,'0')} UTC</p>
                            <p className="text-[11px] text-gray-500">{FORMAT_LABELS[s.format]} → {s.toEmails}</p>
                          </div>
                          <button
                            className="text-xs text-red-400 hover:text-red-600 px-1"
                            onClick={() => handleDeleteSchedule(s.id)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* New schedule form */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">New Schedule</p>
                <div className="space-y-3">
                  <Field label="Frequency">
                    <div className="flex gap-1">
                      {(['daily', 'weekly', 'monthly'] as Frequency[]).map((f) => (
                        <button
                          key={f}
                          className={clsx(
                            'flex-1 rounded border py-1 text-xs capitalize transition-colors',
                            schedFreq === f ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                          )}
                          onClick={() => setSchedFreq(f)}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </Field>

                  {schedFreq === 'weekly' && (
                    <Field label="Day of week">
                      <select className="field-input" value={schedDow} onChange={(e) => setSchedDow(Number(e.target.value))}>
                        {DAY_NAMES.map((d, i) => <option key={i} value={i}>{d}</option>)}
                      </select>
                    </Field>
                  )}
                  {schedFreq === 'monthly' && (
                    <Field label="Day of month">
                      <select className="field-input" value={schedDom} onChange={(e) => setSchedDom(Number(e.target.value))}>
                        {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </Field>
                  )}

                  <Field label="Time (UTC)">
                    <div className="flex gap-2">
                      <select className="field-input" value={schedHour} onChange={(e) => setSchedHour(Number(e.target.value))}>
                        {HOURS.map((h) => <option key={h} value={h}>{h.toString().padStart(2, '0')}:00</option>)}
                      </select>
                      <select className="field-input" value={schedMin} onChange={(e) => setSchedMin(Number(e.target.value))}>
                        {MINUTES.map((m) => <option key={m} value={m}>:{m.toString().padStart(2, '0')}</option>)}
                      </select>
                    </div>
                  </Field>

                  <Field label="Format">
                    <select className="field-input" value={schedFormat} onChange={(e) => setSchedFormat(e.target.value as ExportFormat)}>
                      {(Object.entries(FORMAT_LABELS) as [ExportFormat, string][]).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="To *">
                    <input
                      type="text"
                      className="field-input"
                      placeholder="email@example.com"
                      value={schedTo}
                      onChange={(e) => setSchedTo(e.target.value)}
                    />
                  </Field>
                  <Field label="CC">
                    <input
                      type="text"
                      className="field-input"
                      placeholder="cc@example.com"
                      value={schedCc}
                      onChange={(e) => setSchedCc(e.target.value)}
                    />
                  </Field>

                  {schedStatus === 'error' && <p className="text-xs text-red-600">{schedError}</p>}
                  {schedStatus === 'saved' && <p className="text-xs text-green-600">Schedule saved.</p>}

                  <button
                    className={clsx(
                      'w-full rounded py-2 text-sm font-medium text-white transition-colors',
                      schedStatus === 'saving' ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                    )}
                    disabled={!schedTo.trim() || schedStatus === 'saving'}
                    onClick={handleSaveSchedule}
                  >
                    {schedStatus === 'saving' ? 'Saving...' : 'Save Schedule'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .field-input {
          width: 100%;
          border-radius: 0.25rem;
          border: 1px solid #e5e7eb;
          padding: 4px 8px;
          font-size: 12px;
          color: #374151;
          outline: none;
          background: white;
        }
        .field-input:focus { border-color: #60a5fa; }
      `}</style>
    </div>
  );
}

function DownloadButton({ icon, label, sublabel, onClick }: { icon: string; label: string; sublabel: string; onClick: () => void }) {
  return (
    <button
      className="flex w-full items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
      onClick={onClick}
    >
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        <p className="text-xs text-gray-500">{sublabel}</p>
      </div>
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <span className="w-20 shrink-0 pt-1 text-xs text-gray-600">{label}</span>
      <div className="flex-1">{children}</div>
    </div>
  );
}
