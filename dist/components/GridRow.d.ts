import { default as React } from 'react';
import { Row } from '@tanstack/react-table';
import { RowColorRule } from '../types';
interface GridRowProps<TData> {
    row: Row<TData>;
    rowIndex: number;
    columnAlignment?: Record<string, 'left' | 'center' | 'right'>;
    columnDecimals?: Record<string, number>;
    rowColorRules?: RowColorRule<TData>[];
    /** Precomputed max per dataBar column */
    columnMaxes?: Record<string, number>;
    onCellClick?: (cell: any, event: React.MouseEvent) => void;
    onCellDoubleClick?: (cell: any, event: React.MouseEvent) => void;
    onCellValueChanged?: (cell: any, oldValue: any, newValue: any) => void;
    onExpandRecord?: (rowId: string) => void;
}
export declare const GridRow: <TData>(props: GridRowProps<TData>) => React.ReactElement;
export {};
//# sourceMappingURL=GridRow.d.ts.map