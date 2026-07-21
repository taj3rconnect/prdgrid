import { default as React } from 'react';
import { Table } from '@tanstack/react-table';
import { RowColorRule } from '../types';
interface GridBodyProps<TData> {
    table: Table<TData>;
    columnAlignment?: Record<string, 'left' | 'center' | 'right'>;
    columnDecimals?: Record<string, number>;
    rowColorRules?: RowColorRule<TData>[];
    noRowsComponent?: React.ComponentType;
    noRowsMessage?: string;
    onCellClick?: (cell: any, event: React.MouseEvent) => void;
    onCellDoubleClick?: (cell: any, event: React.MouseEvent) => void;
    onCellValueChanged?: (cell: any, oldValue: any, newValue: any) => void;
    onExpandRecord?: (rowId: string) => void;
}
export declare function GridBody<TData>({ table, columnAlignment, columnDecimals, rowColorRules, noRowsComponent: NoRowsComp, noRowsMessage, onCellClick, onCellDoubleClick, onCellValueChanged, onExpandRecord, }: GridBodyProps<TData>): React.JSX.Element;
export {};
//# sourceMappingURL=GridBody.d.ts.map