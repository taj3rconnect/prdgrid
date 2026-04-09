import React from 'react';
import type { GridStyleSettings } from '../types';

interface StylePanelProps {
  isOpen: boolean;
  onClose: () => void;
  styles: GridStyleSettings;
  onStylesChange: (styles: GridStyleSettings) => void;
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

export function StylePanel({ isOpen, onClose, styles, onStylesChange }: StylePanelProps) {
  if (!isOpen) return null;

  const set = <K extends keyof GridStyleSettings>(key: K, value: GridStyleSettings[K]) => {
    onStylesChange({ ...styles, [key]: value || undefined });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end" onClick={onClose}>
      <div
        className="mt-10 mr-4 w-80 max-h-[80vh] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <h3 className="text-sm font-semibold text-gray-900">Style Settings</h3>
          <button className="text-gray-400 hover:text-gray-600 text-xl leading-none" onClick={onClose}>&times;</button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-5">

          {/* Header Row */}
          <section>
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 pb-1 border-b border-gray-100">
              Header Row
            </div>
            <div className="space-y-3">
              <FieldRow label="Font Family">
                <select
                  className="w-full rounded border border-gray-200 px-2 py-1 text-xs text-gray-700 focus:border-blue-400 focus:outline-none"
                  value={styles.headerFontFamily || ''}
                  onChange={(e) => set('headerFontFamily', e.target.value || undefined)}
                >
                  {FONT_FAMILIES.map((f) => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </FieldRow>
              <FieldRow label="Font Size">
                <select
                  className="w-full rounded border border-gray-200 px-2 py-1 text-xs text-gray-700 focus:border-blue-400 focus:outline-none"
                  value={styles.headerFontSize || ''}
                  onChange={(e) => set('headerFontSize', e.target.value || undefined)}
                >
                  <option value="">Default</option>
                  {FONT_SIZES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </FieldRow>
              <FieldRow label="Font Color">
                <ColorInput
                  value={styles.headerFontColor}
                  placeholder="Default"
                  onChange={(v) => set('headerFontColor', v)}
                />
              </FieldRow>
            </div>
          </section>

          {/* Data Rows */}
          <section>
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 pb-1 border-b border-gray-100">
              Data Rows
            </div>
            <div className="space-y-3">
              <FieldRow label="Font Family">
                <select
                  className="w-full rounded border border-gray-200 px-2 py-1 text-xs text-gray-700 focus:border-blue-400 focus:outline-none"
                  value={styles.rowFontFamily || ''}
                  onChange={(e) => set('rowFontFamily', e.target.value || undefined)}
                >
                  {FONT_FAMILIES.map((f) => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </FieldRow>
              <FieldRow label="Font Size">
                <select
                  className="w-full rounded border border-gray-200 px-2 py-1 text-xs text-gray-700 focus:border-blue-400 focus:outline-none"
                  value={styles.rowFontSize || ''}
                  onChange={(e) => set('rowFontSize', e.target.value || undefined)}
                >
                  <option value="">Default</option>
                  {FONT_SIZES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </FieldRow>
            </div>
          </section>

          {/* Alternating Rows */}
          <section>
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 pb-1 border-b border-gray-100">
              Alternating Rows
            </div>
            <div className="space-y-3">
              <FieldRow label="Alt Row Color">
                <ColorInput
                  value={styles.altRowBgColor}
                  placeholder="Default (#f9fafb)"
                  onChange={(v) => set('altRowBgColor', v)}
                />
              </FieldRow>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-4 py-2 flex justify-end">
          <button
            className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100"
            onClick={() => onStylesChange({})}
          >
            Reset to defaults
          </button>
        </div>
      </div>
    </div>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-24 shrink-0 text-xs text-gray-600">{label}</span>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function ColorInput({
  value,
  placeholder,
  onChange,
}: {
  value?: string;
  placeholder: string;
  onChange: (v: string | undefined) => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <input
        type="color"
        className="h-6 w-8 shrink-0 cursor-pointer rounded border border-gray-200 p-0"
        value={value || '#111827'}
        onChange={(e) => onChange(e.target.value)}
      />
      <input
        type="text"
        className="min-w-0 flex-1 rounded border border-gray-200 px-2 py-1 text-xs text-gray-700 focus:border-blue-400 focus:outline-none"
        value={value || ''}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value || undefined)}
      />
      {value && (
        <button
          className="shrink-0 text-xs text-gray-400 hover:text-gray-600"
          onClick={() => onChange(undefined)}
          title="Clear"
        >
          ✕
        </button>
      )}
    </div>
  );
}
