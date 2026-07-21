import { Table } from '@tanstack/react-table';
interface GridHeaderProps<TData> {
    table: Table<TData>;
    columnAlignment?: Record<string, 'left' | 'center' | 'right'>;
    onHeaderContextMenu?: (columnId: string, x: number, y: number) => void;
}
export declare function GridHeader<TData>({ table, columnAlignment, onHeaderContextMenu }: GridHeaderProps<TData>): import("react").JSX.Element;
export {};
//# sourceMappingURL=GridHeader.d.ts.map