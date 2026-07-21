import { AccentTheme, GridDensity, GridLook, GridThemeTokens } from '../types';
type TokenMap = Record<string, string>;
export declare const LOOK_PRESETS: Record<GridLook, TokenMap>;
export declare const LOOKS: {
    value: GridLook;
    label: string;
}[];
export declare const ACCENTS: {
    value: AccentTheme;
    label: string;
    color: string;
}[];
export declare const DARK_LOOKS: GridLook[];
export interface ResolveAppearanceInput {
    look: GridLook;
    accent: AccentTheme;
    density: GridDensity;
    /** Custom token overrides (highest precedence) */
    themeTokens?: GridThemeTokens;
    /** Explicit numeric row height prop — overrides density/look */
    rowHeight?: number;
    /** Explicit numeric header height prop — overrides look */
    headerHeight?: number;
}
export interface ResolvedAppearance {
    style: Record<string, string>;
    isDark: boolean;
}
/**
 * Pure appearance resolver. Precedence (low → high):
 * look preset → accent → density row-height → rowHeight/headerHeight props → custom theme tokens.
 */
export declare function resolveAppearance(input: ResolveAppearanceInput): ResolvedAppearance;
export {};
//# sourceMappingURL=themes.d.ts.map