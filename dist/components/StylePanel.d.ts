import { default as React } from 'react';
import { GridStyleSettings } from '../types';
interface StylePanelProps {
    isOpen: boolean;
    onClose: () => void;
    styles: GridStyleSettings;
    onStylesChange: (styles: GridStyleSettings) => void;
    showSelectionToggle: boolean;
}
export declare function StylePanel({ isOpen, onClose, styles, onStylesChange, showSelectionToggle }: StylePanelProps): React.JSX.Element | null;
export {};
//# sourceMappingURL=StylePanel.d.ts.map