// ─── Main Component ───
export { DataGrid } from './components/DataGrid';
export { ExportModal } from './components/ExportModal';
export { SortPanel } from './components/SortPanel';
export { FilterPanel } from './components/FilterPanel';

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
  GridStyleSettings,

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

// ─── Export utilities (for programmatic use) ───
export { exportToCsv } from './export/csvExport';
export { exportToExcel } from './export/excelExport';
export { exportToImage } from './export/psdExport';
export { emailExport } from './export/emailExport';
export { scheduleExport } from './export/scheduleExport';

// ─── Styles ───
import './styles/datagrid.css';
