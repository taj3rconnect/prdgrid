// ─── Main Component ───
export { DataGrid } from './components/DataGrid';

// ─── Types ───
export type {
  // Column & Grid Props
  DataGridProps,
  GridType,
  ColumnDef,
  ToolbarConfig,
  ExportToolbarConfig,
  GridTheme,
  GridThemeTokens,
  GridDensity,
  GridLook,
  AccentTheme,
  GridAppearance,
  GridView,
  ColumnDataType,
  SparklineType,
  RowColorRule,
  CellColorRule,
  GridStyleSettings,
  TotalsRowConfig,
  PdfExportParams,
  ChartType,
  ChartAggregation,
  ChartConfig,

  // Filter types
  FilterType,
  EditorType,
  PinDirection,
  TextFilterParams,
  NumberFilterParams,
  DateFilterParams,
  SetFilterParams,
  SelectOption,

  // Callback params
  ValueGetterParams,
  ValueSetterParams,
  ValueFormatterParams,
  ValueParserParams,
  CellRendererParams,
  HeaderRendererParams,
  CellClassParams,
  CellStyleParams,
  EditableParams,
  CellEditorParams,
  CellValidatorParams,

  // Events
  CellClickedEvent,
  CellValueChangedEvent,
  SelectionChangedEvent,
  SortChangedEvent,
  FilterChangedEvent,
  ColumnMovedEvent,
  ColumnResizedEvent,
  GridReadyEvent,
  GridStateChangedEvent,
  SortEntry,

  // API & State
  GridApi,
  GridRowNode,
  PersistedGridState,
  ColumnMeta,

  // Export
  CsvExportParams,
  ExcelExportParams,
  ImageExportParams,
  EmailExportParams,
  ScheduleExportParams,
} from './types';

// ─── Theming ───
export { LOOK_PRESETS, LOOKS, ACCENTS, resolveAppearance } from './styles/themes';

// ─── Charts & renderers (for programmatic use) ───
export { buildChartData, aggregate } from './charts/aggregate';
export { Sparkline, Chip, FieldTypeIcon } from './components/renderers';
export { TypeaheadSelect } from './components/TypeaheadSelect';
export type { TypeaheadOption } from './components/TypeaheadSelect';

// ─── Export utilities (for programmatic use) ───
export { exportToCsv } from './export/csvExport';
export { exportToExcel } from './export/excelExport';
export { exportToImage } from './export/psdExport';
export { exportToPdf, generatePdfBase64, generateHtmlTable } from './export/pdfExport';
export { emailExport } from './export/emailExport';
export { scheduleExport } from './export/scheduleExport';

// ─── Styles ───
import './styles/datagrid.css';
