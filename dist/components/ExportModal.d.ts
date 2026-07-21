import { Table } from '@tanstack/react-table';
type Tab = 'email' | 'schedule';
interface ExportModalProps<TData> {
    isOpen: boolean;
    initialTab?: Tab;
    onClose: () => void;
    table: Table<TData>;
    title?: string;
    emailEndpoint?: string;
    scheduleEndpoint?: string;
    fetchHeaders?: Record<string, string>;
}
export declare function ExportModal<TData>({ isOpen, initialTab, onClose, table, title, emailEndpoint, scheduleEndpoint, fetchHeaders, }: ExportModalProps<TData>): import("react").JSX.Element | null;
export {};
//# sourceMappingURL=ExportModal.d.ts.map