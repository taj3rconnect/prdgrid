# @jobtalk/datagrid

**Enterprise-grade React data grid. AG Grid-level features. Zero license fees.**

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue.svg)]()
[![React 18+](https://img.shields.io/badge/React-18%2B-61dafb.svg)]()
[![TanStack Table v8](https://img.shields.io/badge/TanStack_Table-v8-orange.svg)]()

A full-featured, open-source React data grid built on [TanStack Table v8](https://tanstack.com/table/v8) and [Tailwind CSS](https://tailwindcss.com). Sorting, filtering, grouping, cell editing, multi-format export, theming, and a complete imperative API — all in one component.

Built by [Taj Haslani](https://github.com/taj3rconnect) for [JobTalk.ai](https://jobtalk.ai) recruiting platform. Designed for any React application that needs a powerful, production-ready data grid without enterprise license costs.

## Features

| Category | Features |
|----------|----------|
| **Data Display** | Sorting (single & multi), column pinning (left/right), column reordering (drag & drop), column resizing, alternating row stripes |
| **Filtering** | Global search, per-column filters (text, number, date, set), floating filter row |
| **Grouping** | Row grouping with drag-drop group panel, nested expand/collapse, aggregation functions (sum, avg, count, min, max, custom) |
| **Editing** | Inline cell editing (text, number), keyboard navigation (Enter, Escape, F2), cell validation |
| **Selection** | Single and multi-row selection with checkboxes, select all / deselect all |
| **Export** | CSV download, Excel (.xlsx) with formatting, image screenshot (PNG/JPEG), email report via API, scheduled exports |
| **Theming** | Light mode, dark mode, fully custom themes via CSS variable tokens |
| **UI Controls** | Toolbar with search, column manager panel, density toggle (compact/normal/comfortable), pagination with page size options |
| **State** | Persist/restore grid state to localStorage, full imperative API via React ref |
| **Performance** | React.memo on rows and cells, memoized computations, lazy-loaded export libraries |

## Quick Start

### Install

```bash
npm install @jobtalk/datagrid
```

Peer dependencies: `react >= 18`, `react-dom >= 18`

### Basic Usage

```tsx
import { DataGrid } from '@jobtalk/datagrid';
import '@jobtalk/datagrid/styles.css';
import type { ColumnDef } from '@jobtalk/datagrid';

interface Employee {
  id: number;
  name: string;
  department: string;
  salary: number;
}

const columnDefs: ColumnDef<Employee>[] = [
  { field: 'name', headerName: 'Name', sortable: true, filter: 'text' },
  { field: 'department', headerName: 'Department', sortable: true, filter: 'set' },
  {
    field: 'salary',
    headerName: 'Salary',
    sortable: true,
    filter: 'number',
    valueFormatter: ({ value }) => `$${Number(value).toLocaleString()}`,
  },
];

const data: Employee[] = [
  { id: 1, name: 'Alice', department: 'Engineering', salary: 120000 },
  { id: 2, name: 'Bob', department: 'Marketing', salary: 95000 },
  { id: 3, name: 'Carol', department: 'Engineering', salary: 135000 },
];

function App() {
  return (
    <DataGrid<Employee>
      rowData={data}
      columnDefs={columnDefs}
      getRowId={(d) => String(d.id)}
      height={400}
    />
  );
}
```

## Props Reference

### DataGridProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `rowData` | `TData[]` | *required* | Array of row data objects |
| `columnDefs` | `ColumnDef<TData>[]` | *required* | Column definitions array |
| `defaultColDef` | `Partial<ColumnDef>` | `{}` | Default properties applied to all columns |
| `getRowId` | `(data, index) => string` | auto | Extract unique row ID from data |
| `gridId` | `string` | — | Unique ID for state persistence |
| `rowSelection` | `'single' \| 'multiple' \| false` | `false` | Row selection mode |
| `pagination` | `boolean` | `false` | Enable pagination |
| `paginationPageSize` | `number` | `50` | Default rows per page |
| `paginationPageSizeOptions` | `number[]` | `[25,50,100,250,500,1000]` | Page size dropdown options |
| `groupPanel` | `boolean` | `false` | Show drag-drop group panel |
| `groupDefaultExpanded` | `number` | `0` | Group levels to expand (-1 = all) |
| `floatingFilters` | `boolean` | `false` | Show per-column filter inputs below headers |
| `statusBar` | `boolean` | `true` | Show status bar with row counts |
| `toolbar` | `ToolbarConfig \| boolean` | `true` | Toolbar configuration |
| `persistSettings` | `boolean` | `false` | Auto-save/restore state to localStorage |
| `density` | `'compact' \| 'normal' \| 'comfortable'` | `'normal'` | Row density |
| `theme` | `'light' \| 'dark' \| GridThemeTokens` | `'light'` | Theme |
| `height` | `number \| string` | `600` | Grid height in px or CSS value |
| `loading` | `boolean` | `false` | Show loading overlay |
| `loadingComponent` | `React.ComponentType` | — | Custom loading spinner |
| `noRowsComponent` | `React.ComponentType` | — | Custom empty state component |
| `noRowsMessage` | `string` | `'No data to display'` | Empty state message |
| `className` | `string` | — | Additional CSS class on container |

### ColumnDef

| Property | Type | Description |
|----------|------|-------------|
| `field` | `string` | Dot-notation path into row data (e.g. `'address.city'`) |
| `colId` | `string` | Unique column ID (defaults to `field`) |
| `headerName` | `string` | Display name in header |
| `width` | `number` | Fixed width in pixels |
| `minWidth` / `maxWidth` | `number` | Size constraints |
| `sortable` | `boolean` | Enable sorting |
| `sort` | `'asc' \| 'desc'` | Default sort direction |
| `filter` | `'text' \| 'number' \| 'date' \| 'set' \| false` | Filter type |
| `floatingFilter` | `boolean` | Show floating filter for this column |
| `editable` | `boolean \| (params) => boolean` | Enable cell editing |
| `cellEditor` | `'text' \| 'number' \| 'date' \| 'select' \| Component` | Editor type |
| `cellRenderer` | `React.ComponentType` | Custom cell renderer |
| `cellRendererParams` | `Record<string, any>` | Extra props for cell renderer |
| `headerRenderer` | `React.ComponentType` | Custom header renderer |
| `valueGetter` | `(params) => any` | Custom value accessor |
| `valueFormatter` | `(params) => string` | Format value for display |
| `cellClass` | `string \| (params) => string` | CSS class for cells |
| `cellStyle` | `CSSProperties \| (params) => CSSProperties` | Inline styles for cells |
| `pinned` | `'left' \| 'right' \| false` | Pin column |
| `hide` | `boolean` | Hide column initially |
| `enableRowGroup` | `boolean` | Allow grouping by this column |
| `rowGroup` | `boolean` | Auto-group by this column on init |
| `aggFunc` | `'sum' \| 'avg' \| 'count' \| 'min' \| 'max' \| Function` | Aggregation function |
| `resizable` | `boolean` | Allow column resizing |
| `children` | `ColumnDef[]` | Nested column groups |

### Grid API (via ref)

Access the imperative API using a React ref:

```tsx
const gridRef = useRef<GridApi<Employee>>(null);

// Then use:
gridRef.current?.selectAll();
gridRef.current?.exportCsv({ fileName: 'report.csv' });
```

| Method | Description |
|--------|-------------|
| `getRowData()` | Get all row data |
| `getDisplayedRowCount()` | Get visible row count |
| `getSelectedRows()` | Get selected row data |
| `selectAll()` / `deselectAll()` | Toggle selection |
| `setSortModel(model)` | Set sort programmatically |
| `getSortModel()` | Get current sort state |
| `setFilterModel(model)` | Set filters programmatically |
| `getFilterModel()` | Get current filter state |
| `setQuickFilter(text)` | Set global search filter |
| `setColumnVisible(colId, visible)` | Show/hide a column |
| `moveColumn(colId, toIndex)` | Reorder a column |
| `setColumnPinned(colId, pinned)` | Pin/unpin a column |
| `autoSizeAllColumns()` | Reset column sizing |
| `exportCsv(params?)` | Download as CSV |
| `exportExcel(params?)` | Download as Excel (.xlsx) |
| `exportImage(params?)` | Download as PNG/JPEG screenshot |
| `getState()` | Get full persisted state |
| `resetState()` | Reset to defaults |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `onGridReady` | `{ api }` | Grid initialized |
| `onCellClicked` | `{ data, value, colDef, rowIndex, event }` | Cell clicked |
| `onCellDoubleClicked` | `{ data, value, colDef, rowIndex, event }` | Cell double-clicked |
| `onCellValueChanged` | `{ data, colDef, oldValue, newValue, rowIndex }` | Cell edit committed |
| `onSelectionChanged` | `{ selectedRows, selectedRowIds }` | Selection changed |
| `onSortChanged` | `{ sortModel }` | Sort state changed |
| `onFilterChanged` | `{ filterModel }` | Filter state changed |

## Theming

### Built-in Themes

```tsx
<DataGrid theme="light" ... />  // Default
<DataGrid theme="dark" ... />   // Dark mode
```

### Custom Theme

Pass a `GridThemeTokens` object to override any CSS variable:

```tsx
<DataGrid
  theme={{
    '--jt-grid-bg': '#faf5ff',
    '--jt-grid-header-bg': '#7c3aed',
    '--jt-grid-header-text': '#ffffff',
    '--jt-grid-accent': '#8b5cf6',
    '--jt-grid-accent-light': '#ede9fe',
    '--jt-grid-text': '#4c1d95',
    '--jt-grid-border': '#c4b5fd',
    '--jt-grid-row-hover': '#f3e8ff',
    '--jt-grid-row-selected': '#ede9fe',
  }}
/>
```

Available tokens: `--jt-grid-bg`, `--jt-grid-bg-alt`, `--jt-grid-border`, `--jt-grid-header-bg`, `--jt-grid-header-text`, `--jt-grid-text`, `--jt-grid-text-secondary`, `--jt-grid-accent`, `--jt-grid-accent-light`, `--jt-grid-row-hover`, `--jt-grid-row-selected`, `--jt-grid-cell-edit`.

## Custom Cell Renderers

Create any React component as a cell renderer:

```tsx
function StatusBadge({ value }: CellRendererParams) {
  const color = value === 'Active' ? 'green' : 'red';
  return (
    <span className={`badge badge-${color}`}>
      {value}
    </span>
  );
}

const cols: ColumnDef[] = [
  {
    field: 'status',
    headerName: 'Status',
    cellRenderer: StatusBadge,
  },
];
```

The renderer receives: `value`, `formattedValue`, `data`, `colDef`, `rowIndex`, `isGroupRow`, `isExpanded`, `node`.

## Export

### CSV

```tsx
// Via toolbar button (built-in)
toolbar={{ export: { csv: true } }}

// Via API
gridRef.current?.exportCsv({
  fileName: 'employees.csv',
  includeHeaders: true,
  onlySelected: false,
  columnIds: ['name', 'salary'],  // optional subset
});
```

### Excel

```tsx
// Via toolbar
toolbar={{ export: { excel: true } }}

// Via API
gridRef.current?.exportExcel({
  fileName: 'report.xlsx',
  sheetName: 'Employees',
});
```

ExcelJS is lazy-loaded — only downloaded when the user actually exports.

### Image

```tsx
toolbar={{ export: { psd: true } }}

// Via API
gridRef.current?.exportImage({
  fileName: 'grid-screenshot.png',
  format: 'png',  // or 'jpeg'
});
```

## Running the Demo

```bash
git clone https://github.com/taj3rconnect/prdgrid.git
cd prdgrid
npm install
npm run dev
```

Open http://localhost:5173 to see 8 interactive demos:

1. **HR Employee Directory** — 56 employees with grouping, flags, department tags, multi-currency salaries
2. **Finance Portfolio** — 34 instruments with sparkline charts, P&L coloring, ticker renderers
3. **Staffing Pipeline** — 250 candidates with pipeline stages, priority heat, margin coloring, pagination
4. **Simple Product Table** — Minimal configuration, 30 rows
5. **Dark Theme** — One prop change: `theme="dark"`
6. **Custom Brand Theme** — Indigo/purple palette via `GridThemeTokens`
7. **Loading & Empty States** — Toggle loading spinner and empty state
8. **API Playground** — Call every GridApi method interactively

## Tech Stack

- **[TanStack Table v8](https://tanstack.com/table/v8)** — Headless table engine
- **[Tailwind CSS v3](https://tailwindcss.com)** — Utility-first styling
- **[ExcelJS](https://github.com/exceljs/exceljs)** — Excel export (lazy-loaded)
- **[html2canvas](https://html2canvas.hertzen.com)** — Image export (lazy-loaded)
- **TypeScript** — Full type safety with generics
- **Vite** — Build tooling

## Contributing

Contributions are welcome and encouraged! Whether it's a bug fix, new feature, documentation improvement, or performance optimization — all PRs are appreciated.

See [CONTRIBUTING.md](CONTRIBUTING.md) for setup instructions, project structure, code style guidelines, and a list of areas where help is especially welcome.

### High-Impact Contribution Ideas

- Virtual scrolling for 100k+ rows
- Date picker, select dropdown, and rich cell editors
- Clipboard copy/paste support
- Server-side sorting/filtering/pagination
- Row drag & drop reordering
- Right-click context menu
- Accessibility improvements (ARIA, keyboard nav)
- Storybook stories and test coverage

## Roadmap

- [ ] Virtual scrolling (react-virtual)
- [ ] Full cell editor suite (date, select, checkbox, large text)
- [ ] Clipboard support (copy/paste)
- [ ] Column auto-sizing from content
- [ ] Server-side data model
- [ ] Row drag & drop
- [ ] Context menu
- [ ] Accessibility audit
- [ ] npm package publish

## Acknowledgments

This project was built with significant assistance from [Claude](https://claude.ai) by Anthropic — from architecture design and code generation to code review and optimization. Claude helped implement the core grid engine, export system, theming architecture, and the comprehensive demo gallery. A genuine thank-you to the team at Anthropic for building a tool that makes ambitious solo projects like this possible.

## License

MIT &mdash; see [LICENSE](LICENSE) for details.

---

**Star this repo** if you find it useful. Open an issue if something's broken. Submit a PR if you want to make it better. Let's build the best free React data grid together.
