import { useMemo, useState } from 'react';
import { Table } from '@tanstack/react-table';
import { clsx } from 'clsx';
import { buildChartData } from '../charts/aggregate';
import { ChartSvg, seriesColor } from '../charts/ChartSvg';
import { getColumnHeader } from '../core/gridUtils';
import { isNumericDataType } from '../core/useGridEngine';
import type { ChartAggregation, ChartConfig, ChartType, ColumnMeta } from '../types';
import { TypeaheadSelect } from './TypeaheadSelect';

const MAX_CHARTS = 8;
const CHART_TYPES: { value: ChartType; label: string }[] = [
  { value: 'bar', label: 'Bar' },
  { value: 'stackedBar', label: 'Stacked bar' },
  { value: 'line', label: 'Line' },
  { value: 'area', label: 'Area' },
  { value: 'donut', label: 'Donut' },
];
const AGGREGATIONS: ChartAggregation[] = ['count', 'sum', 'avg', 'min', 'max'];

interface ChartPanelProps<TData> {
  table: Table<TData>;
  charts: ChartConfig[];
  onChartsChange: (charts: ChartConfig[]) => void;
}

interface EditorState {
  config: ChartConfig;
  isNew: boolean;
}

export function ChartPanel<TData>({ table, charts, onChartsChange }: ChartPanelProps<TData>) {
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [menuFor, setMenuFor] = useState<string | null>(null);

  const leafColumns = table.getAllLeafColumns().filter((c) => {
    const meta = c.columnDef.meta as ColumnMeta | undefined;
    return !meta?.isSelectColumn;
  });
  const numericColumns = leafColumns.filter((c) => {
    const meta = c.columnDef.meta as ColumnMeta | undefined;
    return meta?.autoNumeric || isNumericDataType(meta?.dataType);
  });

  const seriesLabels = useMemo(() => {
    const labels: Record<string, string> = {};
    for (const c of leafColumns) labels[c.id] = getColumnHeader(c);
    return labels;
  }, [leafColumns]);

  // Filtered leaf rows BEFORE grouping/pagination — charts reflect all filtered data
  const filteredRows = table.getFilteredRowModel().rows;

  const chartDataById = useMemo(
    () =>
      new Map(
        charts.map((cfg) => [
          cfg.id,
          buildChartData(filteredRows, { ...cfg, topN: cfg.topN ?? (cfg.type === 'donut' ? 6 : 12) }, seriesLabels),
        ])
      ),
    [charts, filteredRows, seriesLabels]
  );

  const newChart = () => {
    const category = leafColumns.find((c) => !numericColumns.includes(c)) || leafColumns[0];
    setEditor({
      isNew: true,
      config: {
        id: `chart_${Math.random().toString(36).slice(2, 9)}`,
        type: 'bar',
        categoryColId: category?.id || '',
        seriesColIds: numericColumns[0] ? [numericColumns[0].id] : [],
        aggregation: numericColumns[0] ? 'sum' : 'count',
      },
    });
  };

  const saveEditor = () => {
    if (!editor) return;
    const cfg = editor.config;
    onChartsChange(editor.isNew ? [...charts, cfg] : charts.map((c) => (c.id === cfg.id ? cfg : c)));
    setEditor(null);
  };

  const removeChart = (id: string) => {
    onChartsChange(charts.filter((c) => c.id !== id));
    setMenuFor(null);
  };

  const downloadPng = async (id: string) => {
    setMenuFor(null);
    const card = document.getElementById(`jt-chart-${id}`);
    if (!card) return;
    const { default: html2canvas } = await import('html2canvas');
    const canvas = await html2canvas(card, {
      backgroundColor: getComputedStyle(card).backgroundColor || '#ffffff',
      scale: 2,
    });
    const link = document.createElement('a');
    link.download = `${charts.find((c) => c.id === id)?.title || 'chart'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="flex-1 overflow-auto p-4" onClick={() => setMenuFor(null)}>
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
        {charts.map((cfg) => {
          const data = chartDataById.get(cfg.id)!;
          const title = cfg.title || `${cfg.aggregation === 'count' ? 'Count' : `${cfg.aggregation} of ${cfg.seriesColIds.map((id) => seriesLabels[id] || id).join(', ')}`} by ${seriesLabels[cfg.categoryColId] || cfg.categoryColId}`;
          return (
            <div key={cfg.id} id={`jt-chart-${cfg.id}`} className="jt-chart-card relative">
              <div className="mb-2 flex items-center justify-between gap-2">
                <h4 className="truncate text-grid-base font-semibold text-grid-text capitalize" title={title}>
                  {title}
                </h4>
                <div className="relative shrink-0">
                  <button
                    className="jt-btn !h-6 !px-1.5"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuFor(menuFor === cfg.id ? null : cfg.id);
                    }}
                    title="Chart options" aria-label="Chart options"
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                      <circle cx="8" cy="3" r="1.4" /><circle cx="8" cy="8" r="1.4" /><circle cx="8" cy="13" r="1.4" />
                    </svg>
                  </button>
                  {menuFor === cfg.id && (
                    <div className="jt-menu absolute right-0 top-full mt-1 w-40" onClick={(e) => e.stopPropagation()}>
                      <button className="jt-menu-item" onClick={() => { setEditor({ config: { ...cfg }, isNew: false }); setMenuFor(null); }}>Edit</button>
                      <button className="jt-menu-item" onClick={() => downloadPng(cfg.id)}>Download PNG</button>
                      <button className="jt-menu-item" style={{ color: 'var(--jt-grid-error)' }} onClick={() => removeChart(cfg.id)}>Remove</button>
                    </div>
                  )}
                </div>
              </div>
              <ChartSvg type={cfg.type} data={data} />
              {(cfg.type !== 'donut' && data.series.length > 1) && (
                <div className="mt-2 flex flex-wrap gap-3">
                  {data.series.map((s, si) => (
                    <span key={s.colId} className="inline-flex items-center gap-1.5 text-grid-sm text-grid-text-secondary">
                      <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: seriesColor(si) }} />
                      {s.label}
                    </span>
                  ))}
                </div>
              )}
              {data.truncated && (
                <div className="mt-1 text-grid-sm text-grid-text-secondary">
                  Top {(cfg.topN ?? (cfg.type === 'donut' ? 6 : 12))} shown
                  {data.categories.includes('Other') ? '; remainder grouped as “Other”.' : ' by magnitude.'}
                </div>
              )}
            </div>
          );
        })}

        {charts.length < MAX_CHARTS && (
          <button
            className="flex min-h-[220px] flex-col items-center justify-center gap-2 rounded-[10px] border-2 border-dashed border-grid-border text-grid-text-secondary transition-colors hover:border-grid-accent hover:text-grid-accent"
            onClick={newChart}
          >
            <svg width="22" height="22" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" aria-hidden>
              <path d="M8 3v10M3 8h10" />
            </svg>
            <span className="text-grid-base font-medium">Add chart</span>
          </button>
        )}
      </div>

      {editor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgb(16 24 40 / 0.25)' }} onClick={() => setEditor(null)}>
          <div className="jt-menu w-[340px] !p-4" onClick={(e) => e.stopPropagation()}>
            <h4 className="mb-3 text-grid-lg font-semibold text-grid-text">{editor.isNew ? 'Add chart' : 'Edit chart'}</h4>

            <label className="mb-1 block text-grid-sm font-medium text-grid-text-secondary">Chart type</label>
            <div className="mb-3 flex flex-wrap gap-1">
              {CHART_TYPES.map((t) => (
                <button
                  key={t.value}
                  className={clsx('jt-btn !h-7', editor.config.type === t.value && 'jt-btn-active')}
                  onClick={() => setEditor({ ...editor, config: { ...editor.config, type: t.value } })}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <label className="mb-1 block text-grid-sm font-medium text-grid-text-secondary">Category (X axis)</label>
            <div className="mb-3">
              <TypeaheadSelect
                className="w-full px-2 py-1.5"
                ariaLabel="Category (X axis)"
                value={editor.config.categoryColId}
                options={leafColumns.map((c) => ({ value: c.id, label: String(seriesLabels[c.id] ?? c.id) }))}
                onChange={(v) => setEditor({ ...editor, config: { ...editor.config, categoryColId: v } })}
              />
            </div>

            <label className="mb-1 block text-grid-sm font-medium text-grid-text-secondary">Aggregation</label>
            <div className="mb-3">
              <TypeaheadSelect
                className="w-full px-2 py-1.5 capitalize"
                ariaLabel="Aggregation"
                value={editor.config.aggregation}
                options={AGGREGATIONS.map((a) => ({ value: a, label: a }))}
                onChange={(v) => setEditor({ ...editor, config: { ...editor.config, aggregation: v as ChartAggregation } })}
              />
            </div>

            {editor.config.aggregation !== 'count' && (
              <>
                <label className="mb-1 block text-grid-sm font-medium text-grid-text-secondary">Value columns (up to 3)</label>
                <div className="mb-3 max-h-32 overflow-y-auto rounded-md border border-grid-border p-1">
                  {numericColumns.map((c) => {
                    const checked = editor.config.seriesColIds.includes(c.id);
                    return (
                      <label key={c.id} className="jt-menu-item !h-7 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={!checked && editor.config.seriesColIds.length >= 3}
                          onChange={() =>
                            setEditor({
                              ...editor,
                              config: {
                                ...editor.config,
                                seriesColIds: checked
                                  ? editor.config.seriesColIds.filter((id) => id !== c.id)
                                  : [...editor.config.seriesColIds, c.id],
                              },
                            })
                          }
                        />
                        <span className="truncate">{seriesLabels[c.id]}</span>
                      </label>
                    );
                  })}
                  {numericColumns.length === 0 && (
                    <div className="px-2 py-1 text-grid-sm text-grid-text-secondary">No numeric columns — use count</div>
                  )}
                </div>
              </>
            )}

            <div className="flex justify-end gap-2">
              <button className="jt-btn" onClick={() => setEditor(null)}>Cancel</button>
              <button
                className="jt-btn !text-white"
                style={{ backgroundColor: 'var(--jt-grid-accent)' }}
                disabled={!editor.config.categoryColId || (editor.config.aggregation !== 'count' && editor.config.seriesColIds.length === 0)}
                onClick={saveEditor}
              >
                {editor.isNew ? 'Add chart' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
