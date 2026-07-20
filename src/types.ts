import type { CSSProperties, ComponentType } from 'react';
import type { Column } from '@tanstack/react-table';

// ─── Column Definition ───────────────────────────────────────────────

export type FilterType = 'text' | 'number' | 'date' | 'set' | boolean;
export type EditorType = 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'largeText';
export type PinDirection = 'left' | 'right' | false;

/** Airtable-style field type — drives header icon, default formatter/filter/alignment and built-in renderer */
export type ColumnDataType =
  | 'text'
  | 'number'
  | 'currency'
  | 'percent'
  | 'date'
  | 'select'
  | 'multiSelect'
  | 'checkbox'
  | 'rating'
  | 'progress'
  | 'link'
  | 'user';

export type SparklineType = 'line' | 'bar' | 'winloss';

/** Declarative conditional cell coloring */
export interface CellColorRule<TData = any> {
  when: (value: any, data: TData) => boolean;
  /** CSS color or accent palette name (adapts to dark looks) */
  color: string;
}

export interface ColumnDef<TData = any> {
  /** Unique column identifier. Defaults to `field` if not provided */
  colId?: string;
  /** Dot-notation path into row data object */
  field?: string;
  /** Display name in header. Defaults to field name */
  headerName?: string;
  /** Tooltip shown on header hover */
  headerTooltip?: string;
  /** Field type — drives header icon, default formatter/filter/alignment and built-in renderer */
  dataType?: ColumnDataType;
  /** Render array values as an inline SVG sparkline */
  sparkline?: SparklineType;
  /** Render a subtle accent bar behind numeric values (proportional to column max) */
  dataBar?: boolean;
  /** Declarative conditional cell coloring rules (first match wins) */
  cellColorRules?: CellColorRule<TData>[];

  // ─── Value Processing ───
  /** Custom value accessor */
  valueGetter?: (params: ValueGetterParams<TData>) => any;
  /** Custom value setter for editing */
  valueSetter?: (params: ValueSetterParams<TData>) => boolean;
  /** Format value for display */
  valueFormatter?: (params: ValueFormatterParams<TData>) => string;
  /** Parse edited value before saving */
  valueParser?: (params: ValueParserParams<TData>) => any;

  // ─── Rendering ───
  /** Custom cell renderer component */
  cellRenderer?: ComponentType<CellRendererParams<TData>>;
  /** Props passed to cellRenderer */
  cellRendererParams?: Record<string, any>;
  /** Custom header renderer component */
  headerRenderer?: ComponentType<HeaderRendererParams<TData>>;
  /** Cell CSS class */
  cellClass?: string | ((params: CellClassParams<TData>) => string);
  /** Cell inline styles */
  cellStyle?: CSSProperties | ((params: CellStyleParams<TData>) => CSSProperties);

  // ─── Sizing ───
  /** Fixed width in pixels */
  width?: number;
  /** Minimum width */
  minWidth?: number;
  /** Maximum width */
  maxWidth?: number;
  /** Flex grow factor */
  flex?: number;
  /** Allow user to resize */
  resizable?: boolean;

  // ─── Sorting ───
  /** Enable sorting on this column */
  sortable?: boolean;
  /** Custom sort comparator */
  comparator?: (a: any, b: any, rowA: any, rowB: any) => number;
  /** Default sort direction */
  sort?: 'asc' | 'desc';
  /** Sort priority for multi-sort */
  sortIndex?: number;

  // ─── Filtering ───
  /** Filter type or false to disable */
  filter?: FilterType;
  /** Filter params (varies by filter type) */
  filterParams?: TextFilterParams | NumberFilterParams | DateFilterParams | SetFilterParams;
  /** Show floating filter below header */
  floatingFilter?: boolean;

  // ─── Editing ───
  /** Enable cell editing */
  editable?: boolean | ((params: EditableParams<TData>) => boolean);
  /** Editor type to use */
  cellEditor?: EditorType | ComponentType<CellEditorParams<TData>>;
  /** Props passed to cellEditor */
  cellEditorParams?: Record<string, any>;
  /** Validate before accepting edit */
  cellValidator?: (params: CellValidatorParams<TData>) => boolean | string;

  // ─── Grouping & Aggregation ───
  /** Enable grouping by this column */
  enableRowGroup?: boolean;
  /** Auto-group by this column on init */
  rowGroup?: boolean;
  /** Group priority index */
  rowGroupIndex?: number;
  /** Aggregation function: 'sum' | 'avg' | 'count' | 'min' | 'max' | custom */
  aggFunc?: string | ((values: any[]) => any);

  // ─── Pinning ───
  /** Pin column to left or right */
  pinned?: PinDirection;
  /** Prevent user from changing pin */
  lockPinned?: boolean;

  // ─── Visibility ───
  /** Hide column initially */
  hide?: boolean;
  /** Prevent user from hiding */
  lockVisible?: boolean;
  /** Prevent user from moving */
  suppressMovable?: boolean;

  // ─── Column Groups ───
  /** Child columns (makes this a group header) */
  children?: ColumnDef<TData>[];
}

// ─── Callback Params ─────────────────────────────────────────────────

export interface ValueGetterParams<TData = any> {
  data: TData;
  field?: string;
  colDef: ColumnDef<TData>;
  rowIndex: number;
}

export interface ValueSetterParams<TData = any> {
  data: TData;
  field?: string;
  colDef: ColumnDef<TData>;
  oldValue: any;
  newValue: any;
}

export interface ValueFormatterParams<TData = any> {
  value: any;
  data: TData;
  colDef: ColumnDef<TData>;
  rowIndex: number;
}

export interface ValueParserParams<TData = any> {
  newValue: any;
  oldValue: any;
  data: TData;
  colDef: ColumnDef<TData>;
}

export interface CellRendererParams<TData = any> {
  value: any;
  formattedValue: string;
  data: TData;
  colDef: ColumnDef<TData>;
  rowIndex: number;
  isGroupRow: boolean;
  isExpanded: boolean;
  node: GridRowNode<TData>;
}

export interface HeaderRendererParams<TData = any> {
  colDef: ColumnDef<TData>;
  displayName: string;
  column: Column<TData, unknown>;
  sortDirection: 'asc' | 'desc' | false;
  sortIndex: number | undefined;
}

export interface CellClassParams<TData = any> {
  value: any;
  data: TData;
  colDef: ColumnDef<TData>;
  rowIndex: number;
}

export interface CellStyleParams<TData = any> extends CellClassParams<TData> {}

export interface EditableParams<TData = any> {
  data: TData;
  colDef: ColumnDef<TData>;
  rowIndex: number;
}

export interface CellEditorParams<TData = any> {
  value: any;
  data: TData;
  colDef: ColumnDef<TData>;
  rowIndex: number;
  onValueChange: (newValue: any) => void;
  onEditComplete: () => void;
  onEditCancel: () => void;
  /** Select options for select editor */
  options?: SelectOption[];
}

export interface CellValidatorParams<TData = any> {
  value: any;
  oldValue: any;
  data: TData;
  colDef: ColumnDef<TData>;
}

export interface SelectOption {
  label: string;
  value: any;
}

// ─── Filter Params ───────────────────────────────────────────────────

export interface TextFilterParams {
  /** Default filter operator */
  defaultOption?: 'contains' | 'equals' | 'startsWith' | 'endsWith' | 'notContains';
  /** Case sensitive matching */
  caseSensitive?: boolean;
}

export interface NumberFilterParams {
  defaultOption?: 'equals' | 'greaterThan' | 'lessThan' | 'greaterThanOrEqual' | 'lessThanOrEqual' | 'inRange';
}

export interface DateFilterParams {
  defaultOption?: 'equals' | 'before' | 'after' | 'inRange';
  /** Date format string */
  dateFormat?: string;
}

export interface SetFilterParams {
  /** Predefined values (if not provided, extracted from data) */
  values?: any[];
  /** Custom value formatter for display */
  valueFormatter?: (value: any) => string;
}

// ─── Grid Events ─────────────────────────────────────────────────────

export interface CellClickedEvent<TData = any> {
  data: TData;
  value: any;
  colDef: ColumnDef<TData>;
  rowIndex: number;
  event: React.MouseEvent;
}

export interface CellValueChangedEvent<TData = any> {
  data: TData;
  colDef: ColumnDef<TData>;
  oldValue: any;
  newValue: any;
  rowIndex: number;
}

export interface SelectionChangedEvent<TData = any> {
  selectedRows: TData[];
  selectedRowIds: string[];
}

export interface SortChangedEvent {
  sortModel: SortEntry[];
}

export interface FilterChangedEvent {
  filterModel: Record<string, any>;
}

export interface ColumnMovedEvent {
  columnId: string;
  fromIndex: number;
  toIndex: number;
}

export interface ColumnResizedEvent {
  columnId: string;
  width: number;
}

export interface GridReadyEvent<TData = any> {
  api: GridApi<TData>;
}

export interface GridStateChangedEvent {
  state: PersistedGridState;
}

// ─── Sort & Filter Models ────────────────────────────────────────────

export interface SortEntry {
  colId: string;
  sort: 'asc' | 'desc';
}

// ─── Row Node ────────────────────────────────────────────────────────

export interface GridRowNode<TData = any> {
  id: string;
  data: TData;
  rowIndex: number;
  isSelected: boolean;
  isExpanded: boolean;
  isGroupRow: boolean;
  groupField?: string;
  groupValue?: any;
  depth: number;
  childCount?: number;
}

// ─── Grid API (Imperative) ──────────────────────────────────────────

export interface GridApi<TData = any> {
  // Data
  getRowData(): TData[];
  getDisplayedRowCount(): number;
  getSelectedRows(): TData[];

  // Columns
  autoSizeAllColumns(): void;
  setColumnVisible(colId: string, visible: boolean): void;
  moveColumn(colId: string, toIndex: number): void;
  setColumnPinned(colId: string, pinned: PinDirection): void;

  // Sort & Filter
  setSortModel(model: SortEntry[]): void;
  getSortModel(): SortEntry[];
  setFilterModel(model: Record<string, any>): void;
  getFilterModel(): Record<string, any>;
  setQuickFilter(text: string): void;

  // Selection
  selectAll(): void;
  deselectAll(): void;

  // Editing
  startEditingCell(rowIndex: number, colId: string): void;
  stopEditing(cancel?: boolean): void;

  // Export
  exportCsv(params?: CsvExportParams): void;
  exportExcel(params?: ExcelExportParams): void;
  exportImage(params?: ImageExportParams): void;

  // State
  getState(): PersistedGridState;
  applyState(state: Partial<PersistedGridState>): void;
  resetState(): void;

  // Misc
  refreshCells(): void;
  ensureRowVisible(rowIndex: number): void;
}

// ─── Export Params ───────────────────────────────────────────────────

export interface CsvExportParams {
  fileName?: string;
  includeHeaders?: boolean;
  onlySelected?: boolean;
  columnIds?: string[];
}

export interface ExcelExportParams extends CsvExportParams {
  sheetName?: string;
}

export interface ImageExportParams {
  fileName?: string;
  format?: 'png' | 'jpeg';
  quality?: number;
}

export interface EmailExportParams {
  to: string[];
  subject?: string;
  body?: string;
  format?: 'csv' | 'excel';
  /** API endpoint to send email */
  endpoint: string;
}

export interface ScheduleExportParams extends EmailExportParams {
  schedule: 'daily' | 'weekly' | 'monthly';
  time?: string;
  dayOfWeek?: number;
  dayOfMonth?: number;
}

// ─── Persisted State ─────────────────────────────────────────────────

export interface PersistedGridState {
  /** Schema version (2 = current; absent = legacy v1, accepted and upgraded on next save) */
  version?: number;
  /** Persisted density */
  density?: GridDensity;
  columnOrder: string[];
  columnSizing: Record<string, number>;
  columnVisibility: Record<string, boolean>;
  sorting: SortEntry[];
  columnFilters: Record<string, any>;
  grouping: string[];
  expanded: Record<string, boolean>;
  pageSize: number;
  columnPinning: { left: string[]; right: string[] };
  /** User-configured decimal places per column (for number/amount columns) */
  columnDecimals?: Record<string, number>;
  /** User-configured column alignment overrides */
  columnAlignment?: Record<string, 'left' | 'center' | 'right'>;
}

// ─── Toolbar Config ──────────────────────────────────────────────────

export interface ToolbarConfig {
  search?: boolean;
  columnManager?: boolean;
  export?: ExportToolbarConfig | boolean;
  density?: boolean;
  fullscreen?: boolean;
  /** Show the Grid | Charts view toggle */
  charts?: boolean;
  /** Show the look/accent theme switcher */
  themeSwitcher?: boolean;
}

export interface ExportToolbarConfig {
  csv?: boolean;
  excel?: boolean;
  psd?: boolean;
  email?: boolean;
  scheduleEmail?: boolean;
}

// ─── Theme ───────────────────────────────────────────────────────────

export type GridTheme = 'light' | 'dark' | GridThemeTokens;

/** Any --jt-grid-* CSS custom property. Well-known tokens listed for discoverability. */
export interface GridThemeTokens {
  '--jt-grid-bg'?: string;
  '--jt-grid-bg-alt'?: string;
  '--jt-grid-border'?: string;
  '--jt-grid-border-strong'?: string;
  '--jt-grid-header-bg'?: string;
  '--jt-grid-header-text'?: string;
  '--jt-grid-text'?: string;
  '--jt-grid-text-secondary'?: string;
  '--jt-grid-accent'?: string;
  '--jt-grid-accent-hover'?: string;
  '--jt-grid-accent-light'?: string;
  '--jt-grid-row-hover'?: string;
  '--jt-grid-row-selected'?: string;
  '--jt-grid-cell-edit'?: string;
  '--jt-grid-font-sm'?: string;
  '--jt-grid-font-base'?: string;
  '--jt-grid-font-lg'?: string;
  [token: `--jt-grid-${string}`]: string | undefined;
}

/** Named grid-look preset — border treatment, header style, spacing, radii */
export type GridLook = 'airtable' | 'quartz' | 'minimal' | 'striped' | 'dense' | 'midnight';

/** Named accent color theme — composes with any look */
export type AccentTheme = 'blue' | 'violet' | 'teal' | 'green' | 'amber' | 'rose' | 'slate' | 'orange';

export interface GridAppearance {
  look: GridLook;
  accent: AccentTheme;
}

// ─── Conditional Row Coloring ────────────────────────────────────────

export interface RowColorRule<TData = any> {
  when: (data: TData) => boolean;
  /** CSS color string */
  color: string;
  /** 'row' tints the whole row; 'leftBar' draws an Airtable-style 3px edge strip */
  target?: 'row' | 'leftBar';
}

// ─── Charts ──────────────────────────────────────────────────────────

export type ChartType = 'bar' | 'stackedBar' | 'line' | 'area' | 'donut';
export type ChartAggregation = 'count' | 'sum' | 'avg' | 'min' | 'max';

export interface ChartConfig {
  id: string;
  title?: string;
  type: ChartType;
  /** Column whose values form the category axis / slices */
  categoryColId: string;
  /** Numeric value columns (ignored for count aggregation) */
  seriesColIds: string[];
  aggregation: ChartAggregation;
  /** Max categories before collapsing into "Other" (default 12) */
  topN?: number;
}

export type GridView = 'grid' | 'charts';

// ─── Column Meta (passed via TanStack column.columnDef.meta) ────────

export interface ColumnMeta<TData = any> {
  colDef: ColumnDef<TData>;
  mergedColDef: ColumnDef<TData> & Partial<ColumnDef<TData>>;
  filterType?: FilterType;
  editorType?: EditorType | ComponentType<CellEditorParams<TData>>;
  editable?: boolean | ((params: EditableParams<TData>) => boolean);
  pinned?: PinDirection;
  cellRenderer?: ComponentType<CellRendererParams<TData>>;
  cellRendererParams?: Record<string, any>;
  headerRenderer?: ComponentType<HeaderRendererParams<TData>>;
  cellClass?: string | ((params: CellClassParams<TData>) => string);
  cellStyle?: CSSProperties | ((params: CellStyleParams<TData>) => CSSProperties);
  valueFormatter?: (params: ValueFormatterParams<TData>) => string;
  valueParser?: (params: ValueParserParams<TData>) => any;
  valueSetter?: (params: ValueSetterParams<TData>) => boolean;
  cellValidator?: (params: CellValidatorParams<TData>) => boolean | string;
  aggFunc?: string | ((values: any[]) => any);
  floatingFilter?: boolean;
  headerTooltip?: string;
  /** Auto-detected numeric column (no custom valueFormatter) — formatted by grid */
  autoNumeric?: boolean;
  /** Airtable-style field type (normalized) */
  dataType?: ColumnDataType;
  /** Inline sparkline rendering for array values */
  sparkline?: SparklineType;
  /** Accent data-bar behind numeric values */
  dataBar?: boolean;
  /** Conditional cell coloring rules */
  cellColorRules?: CellColorRule<TData>[];
  /** Internal: row-number/selection display column */
  isSelectColumn?: boolean;
}

// ─── Density ─────────────────────────────────────────────────────────

export type GridDensity = 'compact' | 'normal' | 'comfortable';

// ─── Grid Type Presets ───────────────────────────────────────────────

export type GridType = 'regular' | 'normal' | 'drilldown' | 'finance' | 'editable' | 'highvol';

// ─── Main Grid Props ─────────────────────────────────────────────────

export interface DataGridProps<TData = any> {
  /** Grid type preset — sets sensible defaults for common use cases */
  gridType?: GridType;
  /** Enable row grouping (available for all grid types) */
  enableRowGroup?: boolean;
  /** Unique grid ID for state persistence */
  gridId?: string;
  /** Row data array */
  rowData: TData[];
  /** Column definitions */
  columnDefs: ColumnDef<TData>[];
  /** Default column properties applied to all columns */
  defaultColDef?: Partial<ColumnDef<TData>>;
  /** Function to extract unique row ID from data */
  getRowId?: (data: TData, index: number) => string;

  // ─── Features ───
  /** Row selection mode */
  rowSelection?: 'single' | 'multiple' | false;
  /** Enable pagination */
  pagination?: boolean;
  /** Rows per page */
  paginationPageSize?: number;
  /** Available page size options */
  paginationPageSizeOptions?: number[];
  /** Show group panel above headers */
  groupPanel?: boolean;
  /** Number of group levels to expand by default (-1 = all) */
  groupDefaultExpanded?: number;
  /** Auto-save/restore grid state from localStorage */
  persistSettings?: boolean;
  /** Grid density */
  density?: GridDensity;
  /** Enable floating filters */
  floatingFilters?: boolean;
  /** Show status bar */
  statusBar?: boolean;

  // ─── Toolbar ───
  toolbar?: ToolbarConfig | boolean;

  // ─── Theme / Appearance ───
  theme?: GridTheme;
  /** Grid-look preset (default 'airtable'; theme='dark' maps to 'midnight') */
  gridLook?: GridLook;
  /** Accent color theme (default 'blue') */
  accentTheme?: AccentTheme;
  /** Show the toolbar theme switcher (default true when toolbar enabled) */
  showThemeSwitcher?: boolean;
  /** Fired when the user changes look/accent via the switcher */
  onAppearanceChange?: (appearance: GridAppearance) => void;
  className?: string;

  // ─── Charts ───
  /** Enable the Grid | Charts view toggle (default true when toolbar enabled) */
  charts?: boolean;
  /** Initial chart configurations */
  defaultCharts?: ChartConfig[];

  // ─── Conditional coloring ───
  /** Declarative row coloring rules (first match wins) */
  rowColorRules?: RowColorRule<TData>[];

  // ─── Record panel ───
  /** Show hover expand icon on rows opening a record detail slide-over (default true) */
  recordPanel?: boolean;

  // ─── Sizing ───
  /** Default row height in px */
  rowHeight?: number;
  /** Header row height in px */
  headerHeight?: number;
  /** Max grid height. 'auto' sizes to content. */
  height?: number | string;

  // ─── Overlays ───
  loading?: boolean;
  loadingComponent?: ComponentType;
  noRowsComponent?: ComponentType;
  noRowsMessage?: string;

  // ─── Export config ───
  /** API endpoint for email/schedule export */
  emailExportEndpoint?: string;

  // ─── Events ───
  onGridReady?: (event: GridReadyEvent<TData>) => void;
  onCellClicked?: (event: CellClickedEvent<TData>) => void;
  onCellDoubleClicked?: (event: CellClickedEvent<TData>) => void;
  onCellValueChanged?: (event: CellValueChangedEvent<TData>) => void;
  onSelectionChanged?: (event: SelectionChangedEvent<TData>) => void;
  onSortChanged?: (event: SortChangedEvent) => void;
  onFilterChanged?: (event: FilterChangedEvent) => void;
  onColumnMoved?: (event: ColumnMovedEvent) => void;
  onColumnResized?: (event: ColumnResizedEvent) => void;
  onGridStateChanged?: (event: GridStateChangedEvent) => void;
}
