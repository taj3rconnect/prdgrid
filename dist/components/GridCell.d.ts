import { default as React } from 'react';
import { Cell } from '@tanstack/react-table';
interface GridCellProps<TData> {
    cell: Cell<TData, unknown>;
    rowIndex: number;
    alignment?: 'left' | 'center' | 'right';
    decimals?: number;
    /** Indent (px) applied to the first data cell of nested rows */
    indent?: number;
    /** Column max for dataBar columns */
    columnMax?: number;
    onCellClick?: (cell: Cell<TData, unknown>, event: React.MouseEvent) => void;
    onCellDoubleClick?: (cell: Cell<TData, unknown>, event: React.MouseEvent) => void;
    onCellValueChanged?: (cell: Cell<TData, unknown>, oldValue: any, newValue: any) => void;
    onExpandRecord?: (rowId: string) => void;
}
export declare const GridCell: <TData>(props: GridCellProps<TData>) => React.ReactElement;
export {};
//# sourceMappingURL=GridCell.d.ts.map