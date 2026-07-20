import { describe, it, expect } from 'vitest';
import { aggregate, buildChartData, type ChartRowLike } from './aggregate';
import type { ChartConfig } from '../types';

function rows(data: Record<string, any>[]): ChartRowLike[] {
  return data.map((d) => ({ getValue: (colId: string) => d[colId] }));
}

describe('aggregate', () => {
  it('computes count/sum/avg/min/max', () => {
    const values = [10, 20, 30];
    expect(aggregate('count', values)).toBe(3);
    expect(aggregate('sum', values)).toBe(60);
    expect(aggregate('avg', values)).toBe(20);
    expect(aggregate('min', values)).toBe(10);
    expect(aggregate('max', values)).toBe(30);
  });

  it('returns 0 for empty non-count aggregations', () => {
    expect(aggregate('sum', [])).toBe(0);
    expect(aggregate('count', [])).toBe(0);
  });
});

describe('buildChartData', () => {
  const config: ChartConfig = {
    id: 'c1',
    type: 'bar',
    categoryColId: 'stage',
    seriesColIds: ['salary'],
    aggregation: 'sum',
  };

  it('groups by category and sums series', () => {
    const data = buildChartData(
      rows([
        { stage: 'New', salary: 100 },
        { stage: 'New', salary: 200 },
        { stage: 'Placed', salary: 500 },
      ]),
      config,
      { salary: 'Salary' }
    );
    expect(data.categories).toEqual(['Placed', 'New']); // sorted by magnitude
    expect(data.series[0]!.label).toBe('Salary');
    expect(data.series[0]!.values).toEqual([500, 300]);
    expect(data.truncated).toBe(false);
  });

  it('count aggregation needs no series columns', () => {
    const data = buildChartData(
      rows([{ stage: 'A' }, { stage: 'A' }, { stage: 'B' }]),
      { ...config, seriesColIds: [], aggregation: 'count' },
      {}
    );
    expect(data.series[0]!.label).toBe('Count');
    expect(data.series[0]!.values).toEqual([2, 1]);
  });

  it('collapses categories beyond topN into Other', () => {
    const many = Array.from({ length: 20 }, (_, i) => ({ stage: `S${i}`, salary: (20 - i) * 10 }));
    const data = buildChartData(rows(many), { ...config, topN: 5 }, {});
    expect(data.categories).toHaveLength(6);
    expect(data.categories[5]).toBe('Other');
    expect(data.truncated).toBe(true);
    // Other = sum of the 15 dropped categories
    const expectedOther = many.slice(5).reduce((acc, r) => acc + r.salary, 0);
    expect(data.series[0]!.values[5]).toBe(expectedOther);
  });

  it('truncates without an Other bucket for non-additive aggregations (avg)', () => {
    const many = Array.from({ length: 10 }, (_, i) => ({ stage: `S${i}`, salary: (10 - i) * 100 }));
    const data = buildChartData(rows(many), { ...config, aggregation: 'avg', topN: 4 }, {});
    expect(data.categories).toHaveLength(4);
    expect(data.categories).not.toContain('Other');
    expect(data.truncated).toBe(true);
  });

  it('labels empty categories and ignores non-numeric series values', () => {
    const data = buildChartData(
      rows([
        { stage: null, salary: 50 },
        { stage: 'A', salary: 'not-a-number' },
        { stage: 'A', salary: 25 },
      ]),
      config,
      {}
    );
    expect(data.categories).toContain('(empty)');
    const aIdx = data.categories.indexOf('A');
    expect(data.series[0]!.values[aIdx]).toBe(25);
  });
});
