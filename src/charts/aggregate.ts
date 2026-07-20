import type { ChartAggregation, ChartConfig } from '../types';

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

export function aggregate(agg: ChartAggregation, values: number[]): number {
  if (agg === 'count') return values.length;
  if (values.length === 0) return 0;
  switch (agg) {
    case 'sum':
      return values.reduce((a, b) => a + b, 0);
    case 'avg':
      return values.reduce((a, b) => a + b, 0) / values.length;
    case 'min':
      return Math.min(...values);
    case 'max':
      return Math.max(...values);
  }
}

const DEFAULT_TOP_N = 12;

/**
 * Group filtered leaf rows by the category column and aggregate each series.
 * Input must be pre-pagination leaf rows so charts reflect all filtered data.
 * Categories beyond topN (ranked by first-series magnitude) collapse into "Other".
 */
export function buildChartData(
  rows: ChartRowLike[],
  config: ChartConfig,
  seriesLabels: Record<string, string>
): ChartData {
  const { categoryColId, seriesColIds, aggregation } = config;
  const topN = config.topN ?? DEFAULT_TOP_N;
  const isCount = aggregation === 'count' || seriesColIds.length === 0;

  const groups = new Map<string, Record<string, number[]>>();
  for (const row of rows) {
    const rawCat = row.getValue(categoryColId);
    const cat = rawCat == null || rawCat === '' ? '(empty)' : String(rawCat);
    let group = groups.get(cat);
    if (!group) {
      group = {};
      groups.set(cat, group);
    }
    if (isCount) {
      (group.__count__ ||= []).push(1);
    } else {
      for (const colId of seriesColIds) {
        const v = Number(row.getValue(colId));
        if (!isNaN(v)) (group[colId] ||= []).push(v);
      }
    }
  }

  const seriesIds = isCount ? ['__count__'] : seriesColIds;
  let entries = Array.from(groups.entries()).map(([cat, group]) => ({
    cat,
    values: seriesIds.map((colId) => aggregate(isCount ? 'count' : aggregation, group[colId] || [])),
  }));

  entries.sort((a, b) => Math.abs(b.values[0] ?? 0) - Math.abs(a.values[0] ?? 0));

  let truncated = false;
  if (entries.length > topN) {
    truncated = true;
    const kept = entries.slice(0, topN);
    // Only additive aggregations can collapse the remainder into "Other";
    // avg/min/max are non-additive, so the tail is truncated instead.
    const effectiveAgg = isCount ? 'count' : aggregation;
    if (effectiveAgg === 'count' || effectiveAgg === 'sum') {
      const rest = entries.slice(topN);
      kept.push({
        cat: 'Other',
        values: seriesIds.map((_, si) => rest.reduce((acc, e) => acc + (e.values[si] ?? 0), 0)),
      });
    }
    entries = kept;
  }

  return {
    categories: entries.map((e) => e.cat),
    series: seriesIds.map((colId, si) => ({
      colId,
      label: colId === '__count__' ? 'Count' : seriesLabels[colId] || colId,
      values: entries.map((e) => e.values[si] ?? 0),
    })),
    truncated,
  };
}
