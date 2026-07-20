import type { AccentTheme, GridDensity, GridLook, GridThemeTokens } from '../types';

// Base (light / "airtable") token values live in datagrid.css on .jt-datagrid.
// Each look preset is a diff against that base; accents compose on top.

type TokenMap = Record<string, string>;

export const LOOK_PRESETS: Record<GridLook, TokenMap> = {
  airtable: {},
  quartz: {
    '--jt-grid-col-border-width': '0px',
    '--jt-grid-border': '#e8e9ec',
    '--jt-grid-header-bg': '#ffffff',
    '--jt-grid-header-weight': '600',
    '--jt-grid-font-base': '0.875rem',
    '--jt-grid-shadow': '0 1px 2px rgb(0 0 0 / 0.04)',
  },
  minimal: {
    '--jt-grid-col-border-width': '0px',
    '--jt-grid-row-border-width': '0px',
    '--jt-grid-header-bg': 'transparent',
    '--jt-grid-header-text': '#6b7280',
    '--jt-grid-header-weight': '600',
    '--jt-grid-font-sm': '0.6875rem',
    '--jt-grid-outer-radius': '0px',
    '--jt-grid-shadow': 'none',
    '--jt-grid-border-strong': '#e0e6ed',
    '--jt-grid-row-hover': '#f5f6f8',
  },
  striped: {
    '--jt-grid-col-border-width': '0px',
    '--jt-grid-row-border-width': '0px',
    '--jt-grid-stripe-bg': '#f8fafc',
    '--jt-grid-header-bg': '#f3f4f6',
  },
  dense: {
    '--jt-grid-cell-px': '6px',
    '--jt-grid-font-base': '0.75rem',
    '--jt-grid-font-sm': '0.6875rem',
    '--jt-grid-outer-radius': '4px',
    '--jt-grid-header-height': '30px',
    '--jt-grid-density-scale': '0.82',
  },
  midnight: {
    '--jt-grid-bg': '#0d1117',
    '--jt-grid-bg-alt': '#151b23',
    '--jt-grid-border': '#21262d',
    '--jt-grid-border-strong': '#30363d',
    '--jt-grid-header-bg': '#161b22',
    '--jt-grid-header-text': '#e6edf3',
    '--jt-grid-header-icon': '#6e7681',
    '--jt-grid-text': '#d1d5db',
    '--jt-grid-text-secondary': '#8b949e',
    '--jt-grid-row-hover': '#1c2431',
    '--jt-grid-stripe-bg': '#11161d',
    '--jt-grid-cell-edit': '#3b2f11',
    '--jt-grid-toolbar-bg': '#0d1117',
    '--jt-grid-menu-bg': '#1c2128',
    '--jt-grid-menu-shadow': '0 4px 16px rgb(0 0 0 / 0.5)',
    '--jt-grid-input-bg': '#161b22',
    '--jt-grid-input-border': '#30363d',
    '--jt-grid-scrollbar': '#30363d',
    '--jt-grid-scrollbar-hover': '#484f58',
    '--jt-grid-chart-grid': '#21262d',
    '--jt-grid-chart-card-bg': '#161b22',
    '--jt-grid-shadow': '0 1px 3px rgb(0 0 0 / 0.4)',
  },
};

interface AccentSpec {
  accent: string;
  hover: string;
  light: string;
  rowSelected: string;
  chipBg: string;
  chipText: string;
}

const ACCENT_SPECS: Record<AccentTheme, AccentSpec> = {
  blue:   { accent: '#2f6fe0', hover: '#2560c8', light: '#dbe7fd', rowSelected: '#e8f0fe', chipBg: '#dbe7fd', chipText: '#1e429f' },
  violet: { accent: '#7a5af8', hover: '#6941c6', light: '#ebe5ff', rowSelected: '#f2eeff', chipBg: '#ebe5ff', chipText: '#5925dc' },
  teal:   { accent: '#0e9384', hover: '#107569', light: '#d5f5f0', rowSelected: '#e8faf7', chipBg: '#d5f5f0', chipText: '#125d56' },
  green:  { accent: '#129d5a', hover: '#0e7c47', light: '#d9f4e4', rowSelected: '#eafaf1', chipBg: '#d9f4e4', chipText: '#085d3a' },
  amber:  { accent: '#dc8a06', hover: '#b96a02', light: '#fdeccb', rowSelected: '#fef6e6', chipBg: '#fdeccb', chipText: '#93470c' },
  rose:   { accent: '#e0426f', hover: '#c22557', light: '#fbe1ea', rowSelected: '#fdf0f5', chipBg: '#fbe1ea', chipText: '#a11043' },
  slate:  { accent: '#475467', hover: '#344054', light: '#e6e9ee', rowSelected: '#f0f2f5', chipBg: '#e6e9ee', chipText: '#344054' },
  orange: { accent: '#ec5f2a', hover: '#cf4a1c', light: '#fde5d8', rowSelected: '#fef3ec', chipBg: '#fde5d8', chipText: '#932f19' },
};

function accentTokens(name: AccentTheme, dark: boolean): TokenMap {
  const a = ACCENT_SPECS[name];
  if (!dark) {
    return {
      '--jt-grid-accent': a.accent,
      '--jt-grid-accent-hover': a.hover,
      '--jt-grid-accent-light': a.light,
      '--jt-grid-row-selected': a.rowSelected,
      '--jt-grid-chip-bg': a.chipBg,
      '--jt-grid-chip-text': a.chipText,
    };
  }
  // Dark looks: washes become alpha overlays of the accent over the dark bg
  return {
    '--jt-grid-accent': a.accent,
    '--jt-grid-accent-hover': a.hover,
    '--jt-grid-accent-light': `color-mix(in srgb, ${a.accent} 22%, transparent)`,
    '--jt-grid-row-selected': `color-mix(in srgb, ${a.accent} 16%, transparent)`,
    '--jt-grid-chip-bg': `color-mix(in srgb, ${a.accent} 28%, transparent)`,
    '--jt-grid-chip-text': '#e6edf3',
  };
}

export const LOOKS: { value: GridLook; label: string }[] = [
  { value: 'airtable', label: 'Airtable' },
  { value: 'quartz', label: 'Quartz' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'striped', label: 'Striped' },
  { value: 'dense', label: 'Dense' },
  { value: 'midnight', label: 'Midnight' },
];

export const ACCENTS: { value: AccentTheme; label: string; color: string }[] = (
  Object.keys(ACCENT_SPECS) as AccentTheme[]
).map((value) => ({ value, label: value[0]!.toUpperCase() + value.slice(1), color: ACCENT_SPECS[value].accent }));

export const DARK_LOOKS: GridLook[] = ['midnight'];

const DENSITY_ROW_HEIGHT: Record<GridDensity, number> = {
  compact: 30,
  normal: 36,
  comfortable: 44,
};

export interface ResolveAppearanceInput {
  look: GridLook;
  accent: AccentTheme;
  density: GridDensity;
  /** Custom token overrides (highest precedence) */
  themeTokens?: GridThemeTokens;
  /** Explicit numeric row height prop — overrides density/look */
  rowHeight?: number;
  /** Explicit numeric header height prop — overrides look */
  headerHeight?: number;
}

export interface ResolvedAppearance {
  style: Record<string, string>;
  isDark: boolean;
}

/**
 * Pure appearance resolver. Precedence (low → high):
 * look preset → accent → density row-height → rowHeight/headerHeight props → custom theme tokens.
 */
export function resolveAppearance(input: ResolveAppearanceInput): ResolvedAppearance {
  const { look, accent, density, themeTokens, rowHeight, headerHeight } = input;
  const isDark = DARK_LOOKS.includes(look);
  const style: Record<string, string> = {
    ...LOOK_PRESETS[look],
    ...accentTokens(accent, isDark),
  };

  const scale = parseFloat(style['--jt-grid-density-scale'] || '1');
  style['--jt-grid-row-height'] = `${rowHeight ?? Math.round(DENSITY_ROW_HEIGHT[density] * scale)}px`;
  if (headerHeight) style['--jt-grid-header-height'] = `${headerHeight}px`;

  if (themeTokens && typeof themeTokens === 'object') {
    for (const [k, v] of Object.entries(themeTokens)) {
      if (v != null) style[k] = v;
    }
  }
  return { style, isDark };
}
