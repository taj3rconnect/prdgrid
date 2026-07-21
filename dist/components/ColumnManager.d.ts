import { Table } from '@tanstack/react-table';
type Alignment = 'left' | 'center' | 'right';
interface ColumnManagerProps<TData> {
    table: Table<TData>;
    isOpen: boolean;
    onClose: () => void;
    columnAlignment: Record<string, Alignment>;
    onColumnAlignmentChange: (colId: string, align: Alignment) => void;
    columnDecimals: Record<string, number>;
    onColumnDecimalsChange: (colId: string, decimals: number) => void;
}
export declare function ColumnManager<TData>({ table, isOpen, onClose, columnAlignment, onColumnAlignmentChange, columnDecimals, onColumnDecimalsChange, }: ColumnManagerProps<TData>): import("react").JSX.Element | null;
export {};
//# sourceMappingURL=ColumnManager.d.ts.map