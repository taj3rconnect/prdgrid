import { default as React } from 'react';
import { ColumnDataType, SparklineType } from '../types';
export declare function FieldTypeIcon({ dataType }: {
    dataType?: ColumnDataType;
}): React.JSX.Element | null;
export declare function chipColor(value: string): {
    bg: string;
    text: string;
};
export declare function Chip({ value }: {
    value: string;
}): React.JSX.Element;
/**
 * Built-in renderer for typed columns. Returns null when the value should
 * fall through to default text rendering. Custom cellRenderer always wins upstream.
 */
export declare function renderTypedCell(dataType: ColumnDataType, value: any, formattedValue: string): React.ReactNode | null;
export { formatTypedValue } from '../core/dataTypeRegistry';
export declare function Sparkline({ type, values, width, height }: {
    type: SparklineType;
    values: number[];
    width?: number;
    height?: number;
}): React.JSX.Element | null;
/** Subtle accent bar drawn behind a numeric value, proportional to columnMax */
export declare function DataBar({ value, columnMax, children }: {
    value: number;
    columnMax: number;
    children: React.ReactNode;
}): React.JSX.Element;
//# sourceMappingURL=renderers.d.ts.map