import { Column } from '@tanstack/react-table';
export interface HeaderMenuState {
    columnId: string;
    x: number;
    y: number;
}
interface HeaderContextMenuProps<TData> {
    column: Column<TData, unknown> | null;
    position: {
        x: number;
        y: number;
    } | null;
    onClose: () => void;
    /** Style token container — menu portal inherits grid CSS vars from it */
    themeStyle?: React.CSSProperties;
}
export declare function HeaderContextMenu<TData>({ column, position, onClose, themeStyle }: HeaderContextMenuProps<TData>): import('react').ReactPortal | null;
export {};
//# sourceMappingURL=HeaderContextMenu.d.ts.map