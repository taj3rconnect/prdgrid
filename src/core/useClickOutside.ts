import { useEffect, type RefObject } from 'react';

/**
 * Invoke `onOutside` on any mousedown outside `ref` (and optionally Escape).
 * Shared by the toolbar popovers, header context menu, and typeahead dropdown.
 */
export function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  onOutside: () => void,
  options?: { enabled?: boolean; escape?: boolean }
) {
  const enabled = options?.enabled ?? true;
  const escape = options?.escape ?? false;
  useEffect(() => {
    if (!enabled) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside();
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOutside();
    };
    document.addEventListener('mousedown', handler);
    if (escape) document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', handler);
      if (escape) document.removeEventListener('keydown', esc);
    };
  }, [enabled, escape, onOutside, ref]);
}
