import { Table } from '@tanstack/react-table';
import { ChartConfig } from '../types';
interface ChartPanelProps<TData> {
    table: Table<TData>;
    charts: ChartConfig[];
    onChartsChange: (charts: ChartConfig[]) => void;
}
export declare function ChartPanel<TData>({ table, charts, onChartsChange }: ChartPanelProps<TData>): import("react").JSX.Element;
export {};
//# sourceMappingURL=ChartPanel.d.ts.map