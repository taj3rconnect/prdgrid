import { Table } from '@tanstack/react-table';
interface RecordPanelProps<TData> {
    table: Table<TData>;
    rowId: string | null;
    onClose: () => void;
    onNavigate: (rowId: string) => void;
}
export declare function RecordPanel<TData>({ table, rowId, onClose, onNavigate }: RecordPanelProps<TData>): import("react").JSX.Element | null;
export {};
//# sourceMappingURL=RecordPanel.d.ts.map