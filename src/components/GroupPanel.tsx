import React from 'react';
import { Table } from '@tanstack/react-table';
import { clsx } from 'clsx';
import { getColumnHeader } from '../core/gridUtils';

interface GroupPanelProps<TData> {
  table: Table<TData>;
  grouping: string[];
  onGroupingChange: (grouping: string[]) => void;
}

export function GroupPanel<TData>({ table, grouping, onGroupingChange }: GroupPanelProps<TData>) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const columnId = e.dataTransfer.getData('text/plain');
    if (columnId && !grouping.includes(columnId)) {
      const column = table.getColumn(columnId);
      if (column?.getCanGroup()) {
        onGroupingChange([...grouping, columnId]);
      }
    }
  };

  const removeGroup = (columnId: string) => {
    onGroupingChange(grouping.filter((g) => g !== columnId));
  };

  const getColumnName = (colId: string) => {
    const col = table.getColumn(colId);
    if (!col) return colId;
    return getColumnHeader(col);
  };

  return (
    <div
      className={clsx(
        'jt-group-panel',
        'flex min-h-[40px] items-center gap-2 border-b border-grid-border bg-gray-50 px-3 py-1.5',
      )}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {grouping.length === 0 ? (
        <span className="text-grid-sm text-grid-text-secondary italic">
          Drag column headers here to group rows
        </span>
      ) : (
        <>
          <span className="text-grid-sm text-grid-text-secondary mr-1">Grouped by:</span>
          {grouping.map((colId, index) => (
            <React.Fragment key={colId}>
              {index > 0 && (
                <span className="text-grid-text-secondary text-xs">→</span>
              )}
              <span className="inline-flex items-center gap-1 rounded-full bg-grid-accent-light px-2.5 py-0.5 text-grid-sm font-medium text-grid-accent">
                {getColumnName(colId)}
                <button
                  className="ml-0.5 text-grid-accent hover:text-blue-800"
                  onClick={() => removeGroup(colId)}
                >
                  &times;
                </button>
              </span>
            </React.Fragment>
          ))}
          <button
            className="ml-2 text-grid-sm text-grid-text-secondary hover:text-grid-text"
            onClick={() => onGroupingChange([])}
          >
            Clear all
          </button>
        </>
      )}
    </div>
  );
}
