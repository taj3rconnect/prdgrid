import { ChartAggregation, ChartConfig } from '../types';
export interface ChartSeries {
    colId: string;
    label: string;
    values: number[];
}
export interface ChartData {
    categories: string[];
    series: ChartSeries[];
    /** True when categories beyond topN were collapsed into "Other" */
    truncated: boolean;
}
export interface ChartRowLike {
    getValue(colId: string): any;
}
export declare function aggregate(agg: ChartAggregation, values: number[]): number;
/**
 * Group filtered leaf rows by the category column and aggregate each series.
 * Input must be pre-pagination leaf rows so charts reflect all filtered data.
 * Categories beyond topN (ranked by first-series magnitude) collapse into "Other".
 */
export declare function buildChartData(rows: ChartRowLike[], config: ChartConfig, seriesLabels: Record<string, string>): ChartData;
//# sourceMappingURL=aggregate.d.ts.map