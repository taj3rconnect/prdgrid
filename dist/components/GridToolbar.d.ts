import { Table } from '@tanstack/react-table';
import { ToolbarConfig, GridDensity, GridAppearance, GridView } from '../types';
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
    onExportPdf?: () => void;
    onRefresh?: () => void | Promise<unknown>;
    onToggleStylePanel?: () => void;
    showFloatingFilters?: boolean;
    onToggleFloatingFilters?: () => void;
}
export declare function GridToolbar<TData>({ table, config, globalFilter, onGlobalFilterChange, density, onDensityChange, onResetState, onToggleColumnManager, onExportCsv, onExportExcel, onExportImage, onExportEmail, onExportSchedule, view, onViewChange, appearance, onAppearanceChange, onExportPdf, onRefresh, onToggleStylePanel, showFloatingFilters, onToggleFloatingFilters, }: GridToolbarProps<TData>): import("react").JSX.Element;
export {};
//# sourceMappingURL=GridToolbar.d.ts.map