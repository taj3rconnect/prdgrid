import { useState, useRef, useEffect, useMemo } from 'react';
import { Table, ColumnFiltersState } from '@tanstack/react-table';
import { clsx } from 'clsx';

type Operator =
  | 'contains' | 'notContains' | 'equals' | 'notEquals' | 'startsWith' | 'endsWith' | 'isEmpty' | 'isNotEmpty'
  | 'gt' | 'gte' | 'lt' | 'lte' | 'between'
  | 'before' | 'after' | 'dateRange';

interface FilterRule {
  id: string; // unique rule id
  columnId: string;
  operator: Operator;
  value: string;
  value2?: string; // for range operators
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

let ruleCounter = 0;

// Apply filter rules to column filters
function rulesToColumnFilters(rules: FilterRule[]): ColumnFiltersState {
  // Group by column
  const grouped = new Map<string, FilterRule[]>();
  for (const rule of rules) {
    if (!grouped.has(rule.columnId)) grouped.set(rule.columnId, []);
    grouped.get(rule.columnId)!.push(rule);
  }

  const filters: ColumnFiltersState = [];
  for (const [columnId, colRules] of grouped) {
    // For simplicity, use the first rule's logic
    // We pass the full rules as the value so our custom filter fn can handle them
    filters.push({ id: columnId, value: colRules });
  }
  return filters;
}

// Check if a value matches a filter rule
function matchesRule(cellValue: any, rule: FilterRule): boolean {
  const op = rule.operator;
  const val = rule.value;

  if (op === 'isEmpty') return cellValue == null || String(cellValue).trim() === '';
  if (op === 'isNotEmpty') return cellValue != null && String(cellValue).trim() !== '';

  const cellStr = String(cellValue ?? '').toLowerCase();
  const valStr = val.toLowerCase();

  switch (op) {
    case 'contains': return cellStr.includes(valStr);
    case 'notContains': return !cellStr.includes(valStr);
    case 'equals': {
      const numCell = Number(cellValue);
      const numVal = Number(val);
      if (!isNaN(numCell) && !isNaN(numVal)) return numCell === numVal;
      return cellStr === valStr;
    }
    case 'notEquals': {
      const numCell = Number(cellValue);
      const numVal = Number(val);
      if (!isNaN(numCell) && !isNaN(numVal)) return numCell !== numVal;
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

// Custom filter function for TanStack table
export function filterPanelFilterFn(row: any, columnId: string, filterValue: any) {
  // If filterValue is an array of FilterRules (from our panel)
  if (Array.isArray(filterValue) && filterValue.length > 0 && filterValue[0]?.operator) {
    const cellValue = row.getValue(columnId);
    // All rules for same column must match (AND)
    return (filterValue as FilterRule[]).every((rule) => matchesRule(cellValue, rule));
  }
  // Fallback: existing filter behavior (string/number from floating filter)
  if (filterValue == null || filterValue === '') return true;
  const cellValue = row.getValue(columnId);
  if (Array.isArray(filterValue)) {
    // Set filter
    return filterValue.includes(String(cellValue));
  }
  // Simple text/number match
  return String(cellValue ?? '').toLowerCase().includes(String(filterValue).toLowerCase());
}

interface FilterPanelProps<TData> {
  table: Table<TData>;
  columnFilters: ColumnFiltersState;
  onColumnFiltersChange: (filters: ColumnFiltersState) => void;
}

export function FilterPanel<TData>({ table, columnFilters, onColumnFiltersChange }: FilterPanelProps<TData>) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Convert current column filters back to rules (for initialization)
  const [rules, setRules] = useState<FilterRule[]>(() => {
    const r: FilterRule[] = [];
    for (const cf of columnFilters) {
      if (Array.isArray(cf.value) && cf.value.length > 0 && cf.value[0]?.operator) {
        r.push(...(cf.value as FilterRule[]));
      }
    }
    return r;
  });

  const filterableColumns = useMemo(
    () =>
      table
        .getAllLeafColumns()
        .filter((c) => c.getCanFilter())
        .map((c) => {
          const meta = c.columnDef.meta as any;
          return {
            id: c.id,
            name: typeof c.columnDef.header === 'string' ? c.columnDef.header : c.id,
            filterType: meta?.filterType as string | undefined,
          };
        }),
    [table]
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

  // Sync rules -> columnFilters
  const applyRules = (nextRules: FilterRule[]) => {
    setRules(nextRules);
    const validRules = nextRules.filter(
      (r) => r.operator === 'isEmpty' || r.operator === 'isNotEmpty' || r.value.trim() !== ''
    );
    onColumnFiltersChange(rulesToColumnFilters(validRules));
  };

  const addRule = () => {
    if (filterableColumns.length === 0) return;
    const col = filterableColumns[0]!;
    const newRule: FilterRule = {
      id: `rule_${++ruleCounter}`,
      columnId: col.id,
      operator: getDefaultOperator(col.filterType),
      value: '',
    };
    applyRules([...rules, newRule]);
  };

  const removeRule = (ruleId: string) => {
    applyRules(rules.filter((r) => r.id !== ruleId));
  };

  const updateRule = (ruleId: string, updates: Partial<FilterRule>) => {
    applyRules(
      rules.map((r) => {
        if (r.id !== ruleId) return r;
        const updated = { ...r, ...updates };
        // If column changed, reset operator to default for that column type
        if (updates.columnId && updates.columnId !== r.columnId) {
          const col = filterableColumns.find((c) => c.id === updates.columnId);
          updated.operator = getDefaultOperator(col?.filterType);
          updated.value = '';
          updated.value2 = undefined;
        }
        return updated;
      })
    );
  };

  const clearAll = () => applyRules([]);

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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
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
                  {/* AND label (for 2nd+ rules) */}
                  <span className="text-[10px] text-gray-400 w-6 text-center">
                    {i === 0 ? 'Where' : 'AND'}
                  </span>

                  {/* Column select */}
                  <select
                    className="w-24 rounded border border-gray-200 bg-white px-1 py-0.5 text-xs text-grid-text truncate"
                    value={rule.columnId}
                    onChange={(e) => updateRule(rule.id, { columnId: e.target.value })}
                  >
                    {filterableColumns.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>

                  {/* Operator select */}
                  <select
                    className="w-24 rounded border border-gray-200 bg-white px-1 py-0.5 text-xs text-grid-text"
                    value={rule.operator}
                    onChange={(e) => updateRule(rule.id, { operator: e.target.value as Operator })}
                  >
                    {operators.map((op) => (
                      <option key={op.value} value={op.value}>{op.label}</option>
                    ))}
                  </select>

                  {/* Value input(s) */}
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

                  {/* Remove */}
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

          {/* Add filter */}
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
