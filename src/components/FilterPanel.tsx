import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import { Table, ColumnFiltersState } from '@tanstack/react-table';
import { clsx } from 'clsx';
import { getColumnHeader } from '../core/gridUtils';

type Operator =
  | 'contains' | 'notContains' | 'equals' | 'notEquals' | 'startsWith' | 'endsWith' | 'isEmpty' | 'isNotEmpty'
  | 'gt' | 'gte' | 'lt' | 'lte' | 'between'
  | 'before' | 'after' | 'dateRange';

interface FilterRule {
  id: string;
  columnId: string;
  operator: Operator;
  value: string;
  value2?: string;
}

const TEXT_OPERATORS: { value: Operator; label: string }[] = [
  { value: 'contains', label: 'Contains' },
  { value: 'notContains', label: 'Does not contain' },
  { value: 'equals', label: 'Equals' },
  { value: 'notEquals', label: 'Not equals' },
  { value: 'startsWith', label: 'Starts with' },
  { value: 'endsWith', label: 'Ends with' },
  { value: 'isEmpty', label: 'Is empty' },
  { value: 'isNotEmpty', label: 'Is not empty' },
];

const NUMBER_OPERATORS: { value: Operator; label: string }[] = [
  { value: 'equals', label: '=' },
  { value: 'notEquals', label: '!=' },
  { value: 'gt', label: '>' },
  { value: 'gte', label: '>=' },
  { value: 'lt', label: '<' },
  { value: 'lte', label: '<=' },
  { value: 'between', label: 'Between' },
  { value: 'isEmpty', label: 'Is empty' },
];

const DATE_OPERATORS: { value: Operator; label: string }[] = [
  { value: 'equals', label: 'Equals' },
  { value: 'before', label: 'Before' },
  { value: 'after', label: 'After' },
  { value: 'dateRange', label: 'Between' },
  { value: 'isEmpty', label: 'Is empty' },
];

function getOperators(filterType: string | undefined) {
  switch (filterType) {
    case 'number': return NUMBER_OPERATORS;
    case 'date': return DATE_OPERATORS;
    default: return TEXT_OPERATORS;
  }
}

function getDefaultOperator(filterType: string | undefined): Operator {
  switch (filterType) {
    case 'number': return 'equals';
    case 'date': return 'equals';
    default: return 'contains';
  }
}

// ruleCounter moved to useRef inside component

// ─── Check if a filter value is a FilterRule[] from this panel ───
function isRuleArray(val: unknown): val is FilterRule[] {
  return Array.isArray(val) && val.length > 0 && typeof val[0] === 'object' && val[0] !== null && 'operator' in val[0];
}

// ─── Convert columnFilters → rules (handles both panel rules and plain values) ───
function columnFiltersToRules(
  columnFilters: ColumnFiltersState,
  columnMeta: Map<string, string | undefined>,
): FilterRule[] {
  const rules: FilterRule[] = [];
  for (const cf of columnFilters) {
    if (isRuleArray(cf.value)) {
      // Already FilterRule[] from this panel
      rules.push(...cf.value);
    } else if (Array.isArray(cf.value)) {
      // Set filter (string[]) — skip, managed by floating filter only
      continue;
    } else if (cf.value != null && cf.value !== '') {
      // Plain value from floating filter — convert to a rule
      const filterType = columnMeta.get(cf.id);
      rules.push({
        id: `ff_${cf.id}`,
        columnId: cf.id,
        operator: filterType === 'number' ? 'equals' : 'contains',
        value: String(cf.value),
      });
    }
  }
  return rules;
}

// ─── Convert rules → columnFilters ───
// Preserves non-panel filters (set filters from floating filter) untouched
function rulesToColumnFilters(
  rules: FilterRule[],
  existingFilters: ColumnFiltersState,
): ColumnFiltersState {
  // Columns managed by rules
  const ruleColumnIds = new Set(rules.map((r) => r.columnId));

  // Group rules by column
  const grouped = new Map<string, FilterRule[]>();
  for (const rule of rules) {
    if (!grouped.has(rule.columnId)) grouped.set(rule.columnId, []);
    grouped.get(rule.columnId)!.push(rule);
  }

  // Keep existing filters that aren't managed by rules (e.g. set filters)
  const kept = existingFilters.filter(
    (cf) => !ruleColumnIds.has(cf.id) && !(isRuleArray(cf.value)) && !(typeof cf.value === 'string' || typeof cf.value === 'number')
  );

  // Add rule-based filters
  const result: ColumnFiltersState = [...kept];
  for (const [columnId, colRules] of grouped) {
    result.push({ id: columnId, value: colRules });
  }

  return result;
}

// ─── Match a cell value against a filter rule ───
function matchesRule(cellValue: any, rule: FilterRule): boolean {
  const op = rule.operator;

  if (op === 'isEmpty') return cellValue == null || String(cellValue).trim() === '';
  if (op === 'isNotEmpty') return cellValue != null && String(cellValue).trim() !== '';

  const val = rule.value;
  const cellStr = String(cellValue ?? '').toLowerCase();
  const valStr = val.toLowerCase();

  switch (op) {
    case 'contains': return cellStr.includes(valStr);
    case 'notContains': return !cellStr.includes(valStr);
    case 'equals': {
      const numCell = Number(cellValue);
      const numVal = Number(val);
      if (!isNaN(numCell) && !isNaN(numVal) && val !== '') return numCell === numVal;
      return cellStr === valStr;
    }
    case 'notEquals': {
      const numCell = Number(cellValue);
      const numVal = Number(val);
      if (!isNaN(numCell) && !isNaN(numVal) && val !== '') return numCell !== numVal;
      return cellStr !== valStr;
    }
    case 'startsWith': return cellStr.startsWith(valStr);
    case 'endsWith': return cellStr.endsWith(valStr);
    case 'gt': return Number(cellValue) > Number(val);
    case 'gte': return Number(cellValue) >= Number(val);
    case 'lt': return Number(cellValue) < Number(val);
    case 'lte': return Number(cellValue) <= Number(val);
    case 'between': {
      const n = Number(cellValue);
      return n >= Number(val) && n <= Number(rule.value2 ?? val);
    }
    case 'before': return new Date(cellValue) < new Date(val);
    case 'after': return new Date(cellValue) > new Date(val);
    case 'dateRange': {
      const d = new Date(cellValue);
      return d >= new Date(val) && d <= new Date(rule.value2 ?? val);
    }
    default: return true;
  }
}

// ─── Custom filter function for TanStack table ───
// Handles both FilterRule[] (from panel) and plain values (from floating filters)
export function filterPanelFilterFn(row: any, columnId: string, filterValue: any) {
  if (filterValue == null || filterValue === '') return true;

  const cellValue = row.getValue(columnId);

  // FilterRule[] from panel
  if (isRuleArray(filterValue)) {
    return filterValue.every((rule: FilterRule) => matchesRule(cellValue, rule));
  }

  // Set filter (string[]) from floating filter
  if (Array.isArray(filterValue)) {
    return filterValue.includes(String(cellValue));
  }

  // Plain string/number from floating filter
  return String(cellValue ?? '').toLowerCase().includes(String(filterValue).toLowerCase());
}

// ─── FilterPanel Component ───

interface FilterPanelProps<TData> {
  table: Table<TData>;
  columnFilters: ColumnFiltersState;
  onColumnFiltersChange: (filters: ColumnFiltersState) => void;
}

export function FilterPanel<TData>({ table, columnFilters, onColumnFiltersChange }: FilterPanelProps<TData>) {
  const [isOpen, setIsOpen] = React.useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const ruleCounterRef = useRef(0);

  const filterableColumns = useMemo(
    () =>
      table
        .getAllLeafColumns()
        .filter((c) => c.getCanFilter())
        .map((c) => {
          const meta = c.columnDef.meta as any;
          return {
            id: c.id,
            name: getColumnHeader(c),
            filterType: meta?.filterType as string | undefined,
          };
        }),
    [table]
  );

  // Build a map of columnId → filterType for rule conversion
  const columnMeta = useMemo(() => {
    const m = new Map<string, string | undefined>();
    for (const c of filterableColumns) m.set(c.id, c.filterType);
    return m;
  }, [filterableColumns]);

  // Derive rules from columnFilters (reactive — syncs with floating filters)
  const rules = useMemo(
    () => columnFiltersToRules(columnFilters, columnMeta),
    [columnFilters, columnMeta]
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const applyRules = useCallback(
    (nextRules: FilterRule[]) => {
      onColumnFiltersChange(rulesToColumnFilters(nextRules, columnFilters));
    },
    [onColumnFiltersChange, columnFilters]
  );

  const addRule = useCallback(() => {
    if (filterableColumns.length === 0) return;
    const col = filterableColumns[0]!;
    const newRule: FilterRule = {
      id: `rule_${++ruleCounterRef.current}`,
      columnId: col.id,
      operator: getDefaultOperator(col.filterType),
      value: '',
    };
    applyRules([...rules, newRule]);
  }, [filterableColumns, rules, applyRules]);

  const removeRule = useCallback(
    (ruleId: string) => {
      const next = rules.filter((r) => r.id !== ruleId);
      // If removing a floating-filter-originated rule, also clear that column filter
      const removed = rules.find((r) => r.id === ruleId);
      if (removed && removed.id.startsWith('ff_')) {
        // Clear the plain column filter too
        const cleaned = columnFilters.filter((cf) => cf.id !== removed.columnId);
        onColumnFiltersChange(rulesToColumnFilters(next, cleaned));
        return;
      }
      applyRules(next);
    },
    [rules, applyRules, columnFilters, onColumnFiltersChange]
  );

  const updateRule = useCallback(
    (ruleId: string, updates: Partial<FilterRule>) => {
      const nextRules = rules.map((r) => {
        if (r.id !== ruleId) return r;
        const updated = { ...r, ...updates };
        // If column changed, reset operator + value
        if (updates.columnId && updates.columnId !== r.columnId) {
          const col = filterableColumns.find((c) => c.id === updates.columnId);
          updated.operator = getDefaultOperator(col?.filterType);
          updated.value = '';
          updated.value2 = undefined;
        }
        // Re-id if it was a floating filter rule (now user-owned)
        if (updated.id.startsWith('ff_')) {
          updated.id = `rule_${++ruleCounterRef.current}`;
        }
        return updated;
      });
      applyRules(nextRules);
    },
    [rules, filterableColumns, applyRules]
  );

  const clearAll = useCallback(() => {
    // Clear all column filters (including floating filter values)
    onColumnFiltersChange([]);
  }, [onColumnFiltersChange]);

  const activeCount = rules.filter(
    (r) => r.operator === 'isEmpty' || r.operator === 'isNotEmpty' || r.value.trim() !== ''
  ).length;

  const isRangeOp = (op: Operator) => op === 'between' || op === 'dateRange';
  const isNoValueOp = (op: Operator) => op === 'isEmpty' || op === 'isNotEmpty';

  return (
    <div ref={panelRef} className="relative">
      <button
        className={clsx(
          'rounded px-2 py-1 text-grid-sm hover:bg-gray-100',
          activeCount > 0
            ? 'text-grid-accent font-medium'
            : 'text-grid-text-secondary hover:text-grid-text'
        )}
        onClick={() => setIsOpen(!isOpen)}
        title="Filter"
      >
        <span className="flex items-center gap-1">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          {activeCount > 0 && (
            <span className="inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-grid-accent text-[10px] text-white px-1">
              {activeCount}
            </span>
          )}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 z-50 w-[420px] rounded-md border border-gray-200 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2">
            <span className="text-xs font-semibold text-grid-text">Filter</span>
            {rules.length > 0 && (
              <button
                className="text-xs text-grid-accent hover:underline"
                onClick={clearAll}
              >
                Clear all
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto p-2 space-y-1">
            {rules.length === 0 && (
              <div className="py-3 text-center text-xs text-gray-400">
                No filters applied. Click + to add.
              </div>
            )}

            {rules.map((rule, i) => {
              const col = filterableColumns.find((c) => c.id === rule.columnId);
              const colFilterType = col?.filterType;
              const operators = getOperators(colFilterType);
              const inputType = colFilterType === 'number' ? 'number' : colFilterType === 'date' ? 'date' : 'text';

              return (
                <div
                  key={rule.id}
                  className="flex items-center gap-1.5 rounded bg-gray-50 px-2 py-1.5"
                >
                  <span className="text-[10px] text-gray-400 w-6 text-center">
                    {i === 0 ? 'Where' : 'AND'}
                  </span>

                  <select
                    className="w-24 rounded border border-gray-200 bg-white px-1 py-0.5 text-xs text-grid-text truncate"
                    value={rule.columnId}
                    onChange={(e) => updateRule(rule.id, { columnId: e.target.value })}
                  >
                    {filterableColumns.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>

                  <select
                    className="w-24 rounded border border-gray-200 bg-white px-1 py-0.5 text-xs text-grid-text"
                    value={rule.operator}
                    onChange={(e) => updateRule(rule.id, { operator: e.target.value as Operator })}
                  >
                    {operators.map((op) => (
                      <option key={op.value} value={op.value}>{op.label}</option>
                    ))}
                  </select>

                  {!isNoValueOp(rule.operator) && (
                    <>
                      <input
                        type={inputType}
                        className="w-20 rounded border border-gray-200 bg-white px-1.5 py-0.5 text-xs text-grid-text focus:border-grid-accent focus:outline-none"
                        placeholder="Value"
                        value={rule.value}
                        onChange={(e) => updateRule(rule.id, { value: e.target.value })}
                      />
                      {isRangeOp(rule.operator) && (
                        <>
                          <span className="text-[10px] text-gray-400">to</span>
                          <input
                            type={inputType}
                            className="w-20 rounded border border-gray-200 bg-white px-1.5 py-0.5 text-xs text-grid-text focus:border-grid-accent focus:outline-none"
                            placeholder="Value"
                            value={rule.value2 ?? ''}
                            onChange={(e) => updateRule(rule.id, { value2: e.target.value })}
                          />
                        </>
                      )}
                    </>
                  )}

                  <button
                    className="ml-auto text-gray-400 hover:text-red-500 text-sm leading-none flex-shrink-0"
                    onClick={() => removeRule(rule.id)}
                    title="Remove filter"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>

          <div className="border-t border-gray-100 px-3 py-2">
            <button
              className="flex items-center gap-1 text-xs text-grid-accent hover:underline"
              onClick={addRule}
            >
              <span className="text-sm leading-none">+</span> Add filter condition
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
