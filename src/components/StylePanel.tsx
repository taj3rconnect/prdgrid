import React from 'react';
import type { GridStyleSettings } from '../types';

interface StylePanelProps {
  isOpen: boolean;
  onClose: () => void;
  styles: GridStyleSettings;
  onStylesChange: (styles: GridStyleSettings) => void;
  showSelectionToggle: boolean;
}

const FONT_FAMILIES: { label: string; value: string }[] = [
  { label: 'System Default', value: '' },
  { label: 'Arial / Helvetica', value: 'Arial, Helvetica, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Trebuchet MS', value: "'Trebuchet MS', Helvetica, sans-serif" },
  { label: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
  { label: 'Courier New', value: "'Courier New', Courier, monospace" },
  { label: 'Times New Roman', value: "'Times New Roman', Times, serif" },
  { label: 'Tahoma', value: 'Tahoma, Geneva, sans-serif' },
  { label: 'Lucida Console', value: "'Lucida Console', Monaco, monospace" },
];

const FONT_SIZES = ['10px', '11px', '12px', '13px', '14px', '15px', '16px', '18px', '20px'];

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-24 shrink-0 text-grid-sm text-grid-text-secondary">{label}</span>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

function ColorInput({ value, onChange }: { value?: string; onChange: (v: string | undefined) => void }) {
  return (
    <div className="flex items-center gap-1.5">
      <input
        type="color"
        className="h-6 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
        value={value || '#000000'}
        onChange={(e) => onChange(e.target.value)}
      />
      <input
        type="text"
        className="jt-input h-6 w-full px-1.5 text-xs"
        placeholder="Default"
        value={value || ''}
        onChange={(e) => onChange(e.target.value || undefined)}
      />
      {value && (
        <button className="jt-btn !h-6 !px-1.5 text-xs" onClick={() => onChange(undefined)} title="Reset">
          ✕
        </button>
      )}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mb-2.5 pb-1 text-[11px] font-semibold uppercase tracking-wider text-grid-text-secondary"
      style={{ borderBottom: '1px solid var(--jt-grid-border)' }}
    >
      {children}
    </div>
  );
}

export function StylePanel({ isOpen, onClose, styles, onStylesChange, showSelectionToggle }: StylePanelProps) {
  if (!isOpen) return null;

  const set = <K extends keyof GridStyleSettings>(key: K, value: GridStyleSettings[K]) => {
    onStylesChange({ ...styles, [key]: value === '' ? undefined : value });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end"
      style={{ backgroundColor: 'rgb(16 24 40 / 0.2)' }}
      onClick={onClose}
    >
      <div
        className="mr-4 mt-12 flex max-h-[78vh] w-[320px] flex-col overflow-hidden rounded-xl"
        style={{
          backgroundColor: 'var(--jt-grid-menu-bg)',
          border: '1px solid var(--jt-grid-border)',
          boxShadow: 'var(--jt-grid-menu-shadow)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--jt-grid-border)' }}>
          <h3 className="text-grid-lg font-semibold text-grid-text">Style Settings</h3>
          <button className="jt-btn !px-1.5" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 4l8 8M12 4l-8 8" /></svg>
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-4 py-3">
          {/* Header row */}
          <section>
            <SectionTitle>Header Row</SectionTitle>
            <div className="space-y-2.5">
              <FieldRow label="Font family">
                <select className="jt-input h-7 w-full px-1.5 text-xs" value={styles.headerFontFamily || ''} onChange={(e) => set('headerFontFamily', e.target.value)}>
                  {FONT_FAMILIES.map((f) => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </FieldRow>
              <FieldRow label="Font size">
                <select className="jt-input h-7 w-full px-1.5 text-xs" value={styles.headerFontSize || ''} onChange={(e) => set('headerFontSize', e.target.value)}>
                  <option value="">Default</option>
                  {FONT_SIZES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </FieldRow>
              <FieldRow label="Font style">
                <div className="flex gap-1">
                  {(['normal', 'bold', 'italic'] as const).map((s) => (
                    <button
                      key={s}
                      className="flex-1 rounded-md px-2 py-1 text-xs capitalize transition-colors"
                      style={{
                        border: '1px solid var(--jt-grid-border)',
                        ...(s === 'bold' ? { fontWeight: 700 } : s === 'italic' ? { fontStyle: 'italic' } : {}),
                        ...((styles.headerFontStyle || 'normal') === s
                          ? { borderColor: 'var(--jt-grid-accent)', backgroundColor: 'var(--jt-grid-accent-light)', color: 'var(--jt-grid-accent)' }
                          : { color: 'var(--jt-grid-text-secondary)' }),
                      }}
                      onClick={() => set('headerFontStyle', s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </FieldRow>
              <FieldRow label="Font color">
                <ColorInput value={styles.headerFontColor} onChange={(v) => set('headerFontColor', v)} />
              </FieldRow>
            </div>
          </section>

          {/* Data rows */}
          <section>
            <SectionTitle>Data Rows</SectionTitle>
            <div className="space-y-2.5">
              <FieldRow label="Font family">
                <select className="jt-input h-7 w-full px-1.5 text-xs" value={styles.rowFontFamily || ''} onChange={(e) => set('rowFontFamily', e.target.value)}>
                  {FONT_FAMILIES.map((f) => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </FieldRow>
              <FieldRow label="Font size">
                <select className="jt-input h-7 w-full px-1.5 text-xs" value={styles.rowFontSize || ''} onChange={(e) => set('rowFontSize', e.target.value)}>
                  <option value="">Default</option>
                  {FONT_SIZES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </FieldRow>
              <FieldRow label="Alt-row color">
                <ColorInput value={styles.altRowBgColor} onChange={(v) => set('altRowBgColor', v)} />
              </FieldRow>
            </div>
          </section>

          {/* Layout */}
          {showSelectionToggle && (
            <section>
              <SectionTitle>Layout</SectionTitle>
              <label className="flex cursor-pointer items-center gap-2 text-grid-base text-grid-text">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded accent-[var(--jt-grid-accent)]"
                  checked={styles.showCheckboxColumn !== false}
                  onChange={(e) => set('showCheckboxColumn', e.target.checked)}
                />
                Show row-number / selection column
              </label>
            </section>
          )}

          <button
            className="jt-btn w-full justify-center"
            style={{ border: '1px solid var(--jt-grid-border)' }}
            onClick={() => onStylesChange({})}
          >
            Reset all styles
          </button>
        </div>
      </div>
    </div>
  );
}
