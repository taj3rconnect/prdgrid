import { useState, useRef, useEffect } from 'react';
import { Table } from '@tanstack/react-table';
import { clsx } from 'clsx';
import { LOOKS, ACCENTS, LOOK_PRESETS } from '../styles/themes';
import type { ToolbarConfig, GridDensity, ExportToolbarConfig, GridAppearance, GridView } from '../types';

interface GridToolbarProps<TData> {
  table: Table<TData>;
  config: ToolbarConfig;
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  density: GridDensity;
  onDensityChange: (density: GridDensity) => void;
  onResetState: () => void;
  onToggleColumnManager: () => void;
  onExportCsv?: () => void;
  onExportExcel?: () => void;
  onExportImage?: () => void;
  onExportEmail?: () => void;
  onExportSchedule?: () => void;
  view?: GridView;
  onViewChange?: (view: GridView) => void;
  appearance?: GridAppearance;
  onAppearanceChange?: (appearance: GridAppearance) => void;
}

function useClickOutside(onOutside: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onOutside]);
  return ref;
}

/** Mini 3-row grid thumbnail rendered with the preset's actual tokens */
function LookSwatch({ look }: { look: string }) {
  const t = (token: string, fallback: string) => (LOOK_PRESETS[look as keyof typeof LOOK_PRESETS] as Record<string, string>)[token] || fallback;
  const bg = t('--jt-grid-bg', '#ffffff');
  const headerBg = t('--jt-grid-header-bg', '#f7f8fa');
  const border = t('--jt-grid-border', '#e0e6ed');
  const stripe = t('--jt-grid-stripe-bg', 'transparent');
  const rowBorder = t('--jt-grid-row-border-width', '1px');
  return (
    <span
      className="block h-[38px] w-full overflow-hidden rounded"
      style={{ backgroundColor: bg, border: `1px solid ${t('--jt-grid-border-strong', '#d0d7de')}` }}
      aria-hidden
    >
      <span className="block h-[10px]" style={{ backgroundColor: headerBg === 'transparent' ? bg : headerBg, borderBottom: `1px solid ${border}` }} />
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="block h-[9px]"
          style={{
            backgroundColor: i === 1 && stripe !== 'transparent' ? stripe : 'transparent',
            borderBottom: rowBorder === '0px' ? 'none' : `1px solid ${border}`,
          }}
        />
      ))}
    </span>
  );
}

export function GridToolbar<TData>({
  table,
  config,
  globalFilter,
  onGlobalFilterChange,
  density,
  onDensityChange,
  onResetState,
  onToggleColumnManager,
  onExportCsv,
  onExportExcel,
  onExportImage,
  onExportEmail,
  onExportSchedule,
  view = 'grid',
  onViewChange,
  appearance,
  onAppearanceChange,
}: GridToolbarProps<TData>) {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showDensityMenu, setShowDensityMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const exportRef = useClickOutside(() => setShowExportMenu(false));
  const densityRef = useClickOutside(() => setShowDensityMenu(false));
  const themeRef = useClickOutside(() => setShowThemeMenu(false));

  const exportConfig: ExportToolbarConfig =
    typeof config.export === 'object' ? config.export : {};

  const totalRows = table.getPreFilteredRowModel().rows.length;
  const filteredRows = table.getFilteredRowModel().rows.length;
  const hasFilters = totalRows !== filteredRows;

  const showViews = config.charts && onViewChange;
  const showTheme = config.themeSwitcher !== false && appearance && onAppearanceChange;

  return (
    <div
      className="jt-toolbar flex h-11 items-center gap-1.5 px-2.5"
      style={{ backgroundColor: 'var(--jt-grid-toolbar-bg)', borderBottom: '1px solid var(--jt-grid-border)' }}
    >
      {/* Search */}
      {config.search && (
        <div className="relative w-60 max-w-full shrink">
          <svg
            className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2"
            style={{ color: 'var(--jt-grid-text-secondary)' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search all columns..."
            className="jt-input h-7 w-full pl-8 pr-6"
            value={globalFilter}
            onChange={(e) => onGlobalFilterChange(e.target.value)}
          />
          {globalFilter && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 text-grid-text-secondary hover:text-grid-text"
              onClick={() => onGlobalFilterChange('')}
            >
              &times;
            </button>
          )}
        </div>
      )}

      {/* Row count */}
      <span className="whitespace-nowrap px-1 text-grid-sm text-grid-text-secondary">
        {hasFilters ? `${filteredRows.toLocaleString()} of ${totalRows.toLocaleString()}` : totalRows.toLocaleString()} rows
      </span>

      {/* Views segmented control */}
      {showViews && (
        <div
          className="ml-1 flex items-center rounded-md p-0.5"
          style={{ backgroundColor: 'var(--jt-grid-row-hover)' }}
          role="tablist"
        >
          {(['grid', 'charts'] as GridView[]).map((v) => (
            <button
              key={v}
              role="tab"
              aria-selected={view === v}
              className={clsx('flex h-6 items-center gap-1.5 rounded px-2.5 text-grid-sm font-medium capitalize transition-colors duration-100')}
              style={
                view === v
                  ? { backgroundColor: 'var(--jt-grid-bg)', color: 'var(--jt-grid-accent)', boxShadow: '0 1px 2px rgb(16 24 40 / 0.08)' }
                  : { color: 'var(--jt-grid-text-secondary)' }
              }
              onClick={() => onViewChange!(v)}
            >
              {v === 'grid' ? (
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
                  <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" /><path d="M1.5 6h13M6 6v7.5M10.5 6v7.5" />
                </svg>
              ) : (
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden>
                  <path d="M2 14h12M3.5 14V9M7 14V4.5M10.5 14V7M14 14V2.5" />
                </svg>
              )}
              {v}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1" />

      {/* Reset */}
      <button className="jt-btn" onClick={onResetState} title="Reset all settings">
        Reset
      </button>

      {/* Column Manager */}
      {config.columnManager && (
        <button className="jt-btn" onClick={onToggleColumnManager} title="Manage columns">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
          </svg>
        </button>
      )}

      {/* Density */}
      {config.density && (
        <div ref={densityRef} className="relative">
          <button
            className={clsx('jt-btn', showDensityMenu && 'jt-btn-active')}
            onClick={() => setShowDensityMenu(!showDensityMenu)}
            title="Row height"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {showDensityMenu && (
            <div className="jt-menu absolute right-0 top-full mt-1 w-36">
              {(['compact', 'normal', 'comfortable'] as GridDensity[]).map((d) => (
                <button
                  key={d}
                  className={clsx('jt-menu-item capitalize', density === d && 'jt-menu-item-active')}
                  onClick={() => {
                    onDensityChange(d);
                    setShowDensityMenu(false);
                  }}
                >
                  {density === d && (
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M3 8.5l3.5 3.5L13 5" /></svg>
                  )}
                  <span className={density !== d ? 'ml-[21px]' : ''}>{d}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Export */}
      {config.export && (
        <div ref={exportRef} className="relative">
          <button
            className={clsx('jt-btn', showExportMenu && 'jt-btn-active')}
            onClick={() => setShowExportMenu(!showExportMenu)}
            title="Export"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
          {showExportMenu && (
            <div className="jt-menu absolute right-0 top-full mt-1 min-w-[180px]">
              {(exportConfig.csv !== false) && (
                <button className="jt-menu-item" onClick={() => { onExportCsv?.(); setShowExportMenu(false); }}>
                  <span>📄</span> Download CSV
                </button>
              )}
              {exportConfig.excel && (
                <button className="jt-menu-item" onClick={() => { onExportExcel?.(); setShowExportMenu(false); }}>
                  <span>📊</span> Download Excel
                </button>
              )}
              {exportConfig.psd && (
                <button className="jt-menu-item" onClick={() => { onExportImage?.(); setShowExportMenu(false); }}>
                  <span>🖼️</span> Export as Image
                </button>
              )}
              {exportConfig.email && <hr className="my-1" style={{ borderColor: 'var(--jt-grid-border)' }} />}
              {exportConfig.email && (
                <button className="jt-menu-item" onClick={() => { onExportEmail?.(); setShowExportMenu(false); }}>
                  <span>📧</span> Email Report
                </button>
              )}
              {exportConfig.scheduleEmail && (
                <button className="jt-menu-item" onClick={() => { onExportSchedule?.(); setShowExportMenu(false); }}>
                  <span>🕐</span> Schedule Email
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Theme switcher */}
      {showTheme && (
        <div ref={themeRef} className="relative">
          <button
            className={clsx('jt-btn', showThemeMenu && 'jt-btn-active')}
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            title="Grid appearance"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 21a9 9 0 110-18c4.97 0 9 3.58 9 8 0 2.76-2.24 5-5 5h-1.77c-.84 0-1.52.68-1.52 1.52 0 .36.13.7.35.97.24.29.44.65.44 1.01A1.5 1.5 0 0112 21z" />
              <circle cx="7.5" cy="10.5" r="1" fill="currentColor" stroke="none" />
              <circle cx="12" cy="7.5" r="1" fill="currentColor" stroke="none" />
              <circle cx="16.5" cy="10.5" r="1" fill="currentColor" stroke="none" />
            </svg>
          </button>
          {showThemeMenu && (
            <div className="jt-menu absolute right-0 top-full z-50 mt-1 w-[248px] !p-3">
              <div className="mb-1.5 text-grid-sm font-semibold text-grid-text">Look</div>
              <div className="mb-3 grid grid-cols-3 gap-1.5">
                {LOOKS.map((l) => (
                  <button
                    key={l.value}
                    className="group/look rounded-md p-0.5 text-left transition-shadow"
                    style={appearance!.look === l.value ? { boxShadow: '0 0 0 2px var(--jt-grid-accent)' } : undefined}
                    onClick={() => onAppearanceChange!({ ...appearance!, look: l.value })}
                  >
                    <LookSwatch look={l.value} />
                    <span className="mt-0.5 block truncate text-center text-[10px] text-grid-text-secondary">{l.label}</span>
                  </button>
                ))}
              </div>
              <div className="mb-1.5 text-grid-sm font-semibold text-grid-text">Accent</div>
              <div className="flex items-center gap-1.5">
                {ACCENTS.map((a) => (
                  <button
                    key={a.value}
                    className="relative flex h-5 w-5 items-center justify-center rounded-full transition-transform hover:scale-110"
                    style={{
                      backgroundColor: a.color,
                      boxShadow: appearance!.accent === a.value ? `0 0 0 2px var(--jt-grid-menu-bg), 0 0 0 3.5px ${a.color}` : undefined,
                    }}
                    title={a.label}
                    onClick={() => onAppearanceChange!({ ...appearance!, accent: a.value })}
                  >
                    {appearance!.accent === a.value && (
                      <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M3 8.5l3.5 3.5L13 5" /></svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
