import { Table } from '@tanstack/react-table';
import { TotalsRowConfig } from '../types';
interface TotalsRowProps<TData> {
    table: Table<TData>;
    config: TotalsRowConfig;
    columnAlignment?: Record<string, 'left' | 'center' | 'right'>;
    columnDecimals?: Record<string, number>;
}
export declare function TotalsRow<TData>({ table, config, columnAlignment, columnDecimals }: TotalsRowProps<TData>): import("react").JSX.Element;
export {};
//# sourceMappingURL=TotalsRow.d.ts.map