import type { CSSProperties, ComponentType } from 'react';
import type { Column } from '@tanstack/react-table';

// ─── Column Definition ───────────────────────────────────────────────

export type FilterType = 'text' | 'number' | 'date' | 'set' | boolean;
export type EditorType = 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'largeText';
export type PinDirection = 'left' | 'right' | false;

export interface ColumnDef<TData = any> {
  /** Unique column identifier. Defaults to `field` if not provided */
  colId?: string;
  /** Dot-notation path into row data object */
  field?: string;
  /** Display name in header. Defaults to field name */
  headerName?: string;
  /** Tooltip shown on header hover */
  headerTooltip?: string;

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
  /** User-configured grid style overrides (fonts, colors) */
  gridStyles?: GridStyleSettings;
}

// ─── Toolbar Config ──────────────────────────────────────────────────

export interface ToolbarConfig {
  search?: boolean;
  columnManager?: boolean;
  export?: ExportToolbarConfig | boolean;
  density?: boolean;
  fullscreen?: boolean;
}

export interface ExportToolbarConfig {
  csv?: boolean;
  excel?: boolean;
  psd?: boolean;
  email?: boolean;
  scheduleEmail?: boolean;
}

// ─── Style Settings ──────────────────────────────────────────────────

export interface GridStyleSettings {
  headerFontFamily?: string;
  headerFontSize?: string;
  headerFontStyle?: 'normal' | 'bold' | 'italic';
  headerFontColor?: string;
  rowFontFamily?: string;
  rowFontSize?: string;
  altRowBgColor?: string;
  showCheckboxColumn?: boolean;
}

// ─── Theme ───────────────────────────────────────────────────────────

export type GridTheme = 'light' | 'dark' | GridThemeTokens;

export interface GridThemeTokens {
  '--jt-grid-bg'?: string;
  '--jt-grid-bg-alt'?: string;
  '--jt-grid-border'?: string;
  '--jt-grid-header-bg'?: string;
  '--jt-grid-header-text'?: string;
  '--jt-grid-text'?: string;
  '--jt-grid-text-secondary'?: string;
  '--jt-grid-accent'?: string;
  '--jt-grid-accent-light'?: string;
  '--jt-grid-row-hover'?: string;
  '--jt-grid-row-selected'?: string;
  '--jt-grid-cell-edit'?: string;
  '--jt-grid-font-sm'?: string;
  '--jt-grid-font-base'?: string;
  '--jt-grid-font-lg'?: string;
}

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
  /** True for any numeric column (including those with custom valueFormatter) */
  isNumericColumn?: boolean;
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
  /** Show totals footer row. true = sum, or pass config object */
  totalsRow?: boolean | { aggFunc?: 'sum' | 'avg' | 'count' | 'min' | 'max'; label?: string };
  /** Row-level style function for conditional row highlighting */
  rowStyle?: (data: TData) => import('react').CSSProperties | undefined;
  /** Column view presets for quick toggling */
  columnPresets?: { label: string; columns: string[] }[];

  // ─── Toolbar ───
  toolbar?: ToolbarConfig | boolean;

  // ─── Theme ───
  theme?: GridTheme;
  className?: string;

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
  /** API endpoint for email export */
  emailExportEndpoint?: string;
  /** API endpoint for scheduled reports (GET list, POST create, DELETE/:id) */
  scheduleExportEndpoint?: string;
  /** Extra headers to include in all export API calls (e.g. Authorization) */
  exportFetchHeaders?: Record<string, string>;

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
  /** Called when user clicks the refresh button in the toolbar */
  onRefresh?: () => void | Promise<void>;
}
