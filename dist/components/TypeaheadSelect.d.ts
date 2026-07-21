import { default as React } from 'react';
export interface TypeaheadOption {
    value: string;
    label: string;
}
interface TypeaheadSelectProps {
    value: string;
    options: TypeaheadOption[];
    onChange: (value: string) => void;
    className?: string;
    ariaLabel?: string;
    title?: string;
    placeholder?: string;
}
export declare function TypeaheadSelect({ value, options, onChange, className, ariaLabel, title, placeholder, }: TypeaheadSelectProps): React.JSX.Element;
export {};
//# sourceMappingURL=TypeaheadSelect.d.ts.map