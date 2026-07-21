import { RefObject } from 'react';
/**
 * Invoke `onOutside` on any mousedown outside `ref` (and optionally Escape).
 * Shared by the toolbar popovers, header context menu, and typeahead dropdown.
 */
export declare function useClickOutside(ref: RefObject<HTMLElement | null>, onOutside: () => void, options?: {
    enabled?: boolean;
    escape?: boolean;
}): void;
//# sourceMappingURL=useClickOutside.d.ts.map