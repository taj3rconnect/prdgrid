import { default as React } from 'react';
import { Table } from '@tanstack/react-table';
interface GroupPanelProps<TData> {
    table: Table<TData>;
    grouping: string[];
    onGroupingChange: (grouping: string[]) => void;
}
export declare function GroupPanel<TData>({ table, grouping, onGroupingChange }: GroupPanelProps<TData>): React.JSX.Element;
export {};
//# sourceMappingURL=GroupPanel.d.ts.map