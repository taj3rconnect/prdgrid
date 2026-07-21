import { default as React } from 'react';
import { Header } from '@tanstack/react-table';
interface HeaderCellProps<TData> {
    header: Header<TData, unknown>;
    alignment?: 'left' | 'center' | 'right';
    onDragStart?: (columnId: string) => void;
    onDragOver?: (columnId: string) => void;
    onDragEnd?: () => void;
    isDragTarget?: boolean;
    onHeaderContextMenu?: (columnId: string, x: number, y: number) => void;
}
export declare function HeaderCell<TData>({ header, alignment, onDragStart, onDragOver, onDragEnd, isDragTarget, onHeaderContextMenu, }: HeaderCellProps<TData>): React.JSX.Element;
export {};
//# sourceMappingURL=HeaderCell.d.ts.map