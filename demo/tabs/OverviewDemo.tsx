interface Capability {
  icon: string;
  title: string;
  points: string[];
  demo: string;
  demoLabel: string;
}

const CAPABILITIES: Capability[] = [
  {
    icon: '🗂️', title: 'Airtable-Style Typed Columns', demo: 'airtable', demoLabel: 'Airtable demo',
    points: [
      '12 field types via one dataType prop: text, number, currency, percent, date, select, multiSelect, checkbox, rating, progress, link, user',
      'Each type drives its header icon, default formatter, filter type, alignment, and a built-in renderer — colored chips, star ratings, progress bars, initials avatars — no custom code needed',
      'Inline sparkline columns (line / bar / win-loss) and accent data-bars behind numeric values',
    ],
  },
  {
    icon: '🎨', title: 'Theme System — Looks × Accents', demo: 'airtable', demoLabel: 'theme switcher (any tab)',
    points: [
      '6 grid looks: Airtable (default), Quartz, Minimal, Striped, Dense, Midnight (dark) — switchable live from the toolbar palette, no remount, state preserved',
      '8 accent color themes compose with any look; user choices persist per grid in localStorage',
      'Style panel for end users (fonts, sizes, colors, alt-row bg) plus GridThemeTokens for a fully custom brand theme — all CSS-token driven',
    ],
  },
  {
    icon: '📊', title: 'Integrated Charts', demo: 'charts', demoLabel: 'Charts demo',
    points: [
      'Grid | Charts view toggle in the toolbar — bar, stacked bar, line, area, and donut chart cards',
      'Charts aggregate the currently filtered rows and update live as you search, filter, or group',
      'Add / edit / remove charts in-app, download any card as PNG — hand-rolled SVG, zero chart dependencies',
    ],
  },
  {
    icon: '⚙️', title: 'Data Operations', demo: 'performance', demoLabel: 'Performance demo',
    points: [
      'Multi-column sorting (shift-click), per-column filters (text / number / date / set) plus global quick search and floating filter row',
      'Drag-to-group rows with sum / avg / count / min / max aggregations and expandable group rows',
      'Pagination, inline editing, totals row, right-click header context menu, Ctrl+C copy-as-TSV, refresh button with spinner',
    ],
  },
  {
    icon: '📐', title: 'Column Control', demo: 'hr', demoLabel: 'HR demo',
    points: [
      'Resize (drag or double-click), drag-reorder with accent insertion indicator, pin left/right with correct sticky offsets',
      'Column manager panel: show/hide, reorder, per-column alignment and decimal places — all persisted',
      'Row-number column that swaps to selection checkboxes on hover, Airtable style',
    ],
  },
  {
    icon: '🎯', title: 'Rows & Records', demo: 'airtable', demoLabel: 'Airtable demo',
    points: [
      'Declarative conditional coloring: rowColorRules / cellColorRules — full-row tints or 3px left edge bars',
      'Record expand: hover a row number and open the full record in a slide-over with typed fields and ↑/↓ navigation',
      'Single or multi row selection with accent wash + left bar; live status bar counts',
    ],
  },
  {
    icon: '📤', title: 'Export Suite', demo: 'staffing', demoLabel: 'Staffing demo',
    points: [
      'CSV, Excel, and PDF downloads (lazy-loaded libs), grid-to-image PNG capture',
      'In-app Send Report modal: email now or schedule daily/weekly/monthly — HTML, PDF, or CSV — POSTed to your endpoint with auth headers',
      'Heavy libraries load on demand only: core bundle stays ~46 KB gzip',
    ],
  },
  {
    icon: '⚡', title: 'API, Events & Persistence', demo: 'api', demoLabel: 'API playground',
    points: [
      'Imperative GridApi via ref: sorting, filtering, selection, export, getState / applyState / resetState',
      'Events for cell clicks, edits, selection, sort and filter changes',
      'Versioned localStorage persistence (column order, sizes, visibility, sorts, filters, grouping, density, theme, charts) with legacy-state migration',
    ],
  },
  {
    icon: '🧩', title: 'Grid Type Presets', demo: 'finance', demoLabel: 'Finance demo',
    points: [
      "One gridType prop applies a tuned preset: regular, drilldown, finance (dense, live-tick friendly), editable, highvol (500-row pages)",
      'Custom cell renderers and header renderers slot in anywhere — see the live-ticking finance P&L and tree drill-down demos',
      'React 18/19 + TanStack Table v8 + Tailwind; MIT licensed, no runtime fees',
    ],
  },
];

export function OverviewDemo({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <section className="mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Everything the grid can do</h2>
        <p className="text-sm text-gray-500 mt-1 max-w-3xl">
          prdgrid is an MIT-licensed React data grid with AG-Grid-class data operations and an Airtable-class look.
          This site is served by the <code className="rounded bg-gray-100 px-1">prd-demo</code> container — every demo
          tab pulls its rows from a seeded SQLite database over a REST API. Pick any capability below to jump to the
          demo that shows it.
        </p>
      </div>
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
        {CAPABILITIES.map((c) => (
          <div key={c.title} className="flex flex-col rounded-lg border border-[#eaecf0] bg-white p-5 shadow-sm">
            <div className="mb-2 flex items-center gap-2.5">
              <span className="text-xl">{c.icon}</span>
              <h3 className="text-[15px] font-semibold text-[#101828]">{c.title}</h3>
            </div>
            <ul className="mb-4 flex-1 space-y-1.5">
              {c.points.map((p, i) => (
                <li key={i} className="flex gap-2 text-[12.5px] leading-snug text-[#475467]">
                  <span className="mt-0.5" style={{ color: '#3d7acd' }}>•</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <button
              className="self-start rounded-md border border-[#d4e3f8] bg-[#f4f8ff] px-3 py-1.5 text-[12px] font-semibold hover:bg-[#e5effd]"
              style={{ color: '#0e4491' }}
              onClick={() => onNavigate(c.demo)}
            >
              See it live → {c.demoLabel}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
