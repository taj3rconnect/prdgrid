import React, { useState, useCallback, useEffect } from 'react';
import { DataGrid } from '../../src';
import type { ColumnDef, CellRendererParams } from '../../src';
import { generateHREmployees, type HREmployee } from '../sampleData';
import { useSeedData } from '../useSeedData';
import { Section } from '../Section';
import { DeptChip, LocationCell, PaymentStatusBadge, ContactCell } from '../renderers';

function TreeEmployeeCell({ data: rawData }: CellRendererParams<HREmployee>) {
  const d = rawData as HREmployee & { _expanded?: boolean; _onToggle?: () => void };
  const hasChildren = d.childCount > 0;
  const indent = d.level * 28;

  return (
    <div className="flex items-center gap-2" style={{ height: '100%', paddingLeft: indent }}>
      {hasChildren ? (
        <button
          className="flex-shrink-0 flex items-center justify-center rounded-md text-[11px] hover:bg-gray-100"
          style={{
            width: 22, height: 22,
            color: 'rgb(116,134,215)',
            boxShadow: 'rgba(0,0,0,0.07) 0px 2px 1px',
            border: '1px solid rgba(0,0,0,0.08)',
          }}
          onClick={(e) => { e.stopPropagation(); d._onToggle?.(); }}
        >
          {d._expanded ? '▼' : '▶'}
        </button>
      ) : (
        <span style={{ width: 22 }} />
      )}
      <div
        className="flex-shrink-0 flex items-center justify-center rounded-full text-white text-xs font-bold"
        style={{ width: 36, height: 36, backgroundColor: d.avatarColor }}
      >
        {d.initials}
      </div>
      <div className="flex flex-col leading-tight min-w-0">
        <span className="font-semibold text-[13px] text-gray-900 truncate">{d.name}</span>
        <span className="text-[11px] text-gray-400 truncate">{d.jobTitle}</span>
      </div>
    </div>
  );
}

export function HRDemo() {
  const allData = useSeedData('employees', generateHREmployees);
  const [expanded, setExpanded] = useState<Set<number>>(() => {
    // Start with level 0 expanded
    return new Set(allData.filter(e => e.level === 0).map(e => e.id));
  });
  useEffect(() => {
    setExpanded(new Set(allData.filter(e => e.level === 0).map(e => e.id)));
  }, [allData]);

  const toggleExpand = useCallback((id: number) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        // Collapse: remove this id and all descendants
        next.delete(id);
        const removeChildren = (parentId: number) => {
          for (const emp of allData) {
            if (emp.managerId === parentId) {
              next.delete(emp.id);
              removeChildren(emp.id);
            }
          }
        };
        removeChildren(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, [allData]);

  // Build visible rows: show root nodes + children of expanded nodes
  const visibleData = React.useMemo(() => {
    const result: (HREmployee & { _expanded?: boolean; _onToggle?: () => void })[] = [];
    const addChildren = (parentId: number | null) => {
      const children = allData.filter(e => e.managerId === parentId);
      for (const child of children) {
        const isExpanded = expanded.has(child.id);
        result.push({
          ...child,
          _expanded: isExpanded,
          _onToggle: () => toggleExpand(child.id),
        });
        if (isExpanded) {
          addChildren(child.id);
        }
      }
    };
    addChildren(null);
    return result;
  }, [allData, expanded, toggleExpand]);

  const cols: ColumnDef<HREmployee>[] = [
    {
      field: 'name', headerName: 'EMPLOYEE', width: 350, pinned: 'left', sortable: true, filter: 'text',
      cellRenderer: TreeEmployeeCell,
    },
    { field: 'id', headerName: 'ID', width: 100,
      cellStyle: () => ({ fontFamily: 'var(--mono)', fontSize: '12px', color: '#9ca3af' }) },
    { field: 'department', headerName: 'DEPARTMENT', width: 220, sortable: true, filter: 'set',
      cellRenderer: DeptChip },
    { field: 'employmentType', headerName: 'EMPLOYMENT TYPE', width: 160, sortable: true, filter: 'set' },
    { field: 'location', headerName: 'LOCATION', width: 200, sortable: true, filter: 'set',
      cellRenderer: LocationCell },
    { field: 'joinDate', headerName: 'JOIN DATE', width: 120, sortable: true, filter: 'date' },
    { field: 'salary', headerName: 'SALARY', width: 150, sortable: true, filter: 'number',
      valueFormatter: ({ value, data: d }) => {
        const sym = { USD: '$', EUR: '€', GBP: '£' }[(d as HREmployee)?.currency] || '$';
        return `${sym}${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
      },
      cellStyle: () => ({ fontFamily: 'var(--mono)', textAlign: 'right' }) },
    { field: 'paymentMethod', headerName: 'PAYMENT METHOD', width: 160, sortable: true, filter: 'set' },
    { field: 'paymentStatus', headerName: 'STATUS', width: 120, sortable: true, filter: 'set',
      cellRenderer: PaymentStatusBadge },
    { colId: 'contact', headerName: 'CONTACT', width: 120,
      cellRenderer: ContactCell },
  ];

  return (
    <Section title="HR Employee Directory"
      subtitle="Hierarchical employee data with tree drill-down — click arrows to expand/collapse direct reports"
      tags={['Tree Hierarchy', 'Drill-down', 'Avatars', 'Department Tags', 'Flags', 'Status Badges', 'Contact Icons']}>
      <DataGrid<HREmployee>
        gridId="hr-demo" rowData={visibleData} columnDefs={cols}
        defaultColDef={{ sortable: true, resizable: true, minWidth: 60 }}
        getRowId={d => String(d.id)}
        floatingFilters={false} statusBar height={650}
        rowHeight={65}
        toolbar={{ search: true, columnManager: true, export: { csv: true, excel: true }, density: false }}
      />
    </Section>
  );
}
