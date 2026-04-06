import { useEffect, useRef } from 'react';
import { Column } from '@tanstack/react-table';
import { clsx } from 'clsx';

interface MenuPosition {
  x: number;
  y: number;
}

interface HeaderContextMenuProps<TData> {
  column: Column<TData, unknown> | null;
  position: MenuPosition | null;
  onClose: () => void;
  onFitToHeader?: () => void;
  onFitToContent?: () => void;
}

export function HeaderContextMenu<TData>({
  column,
  position,
  onClose,
  onFitToHeader,
  onFitToContent,
}: HeaderContextMenuProps<TData>) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (position) {
      document.addEventListener('mousedown', handler);
      return () => document.removeEventListener('mousedown', handler);
    }
  }, [position, onClose]);

  // Adjust position to keep menu in viewport
  useEffect(() => {
    if (!menuRef.current || !position) return;
    const rect = menuRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    if (rect.right > vw) {
      menuRef.current.style.left = `${position.x - rect.width}px`;
    }
    if (rect.bottom > vh) {
      menuRef.current.style.top = `${position.y - rect.height}px`;
    }
  }, [position]);

  if (!column || !position) return null;

  const canSort = column.getCanSort();
  const sorted = column.getIsSorted();
  const isPinned = column.getIsPinned();
  const canHide = column.getCanHide();
  const canResize = column.getCanResize();

  const items: { label: string; icon: string; action: () => void; active?: boolean; disabled?: boolean; divider?: boolean }[] = [];

  if (canSort) {
    items.push({
      label: 'Sort Ascending',
      icon: '\u25B2',
      action: () => { column.toggleSorting(false, false); onClose(); },
      active: sorted === 'asc',
    });
    items.push({
      label: 'Sort Descending',
      icon: '\u25BC',
      action: () => { column.toggleSorting(true, false); onClose(); },
      active: sorted === 'desc',
    });
    if (sorted) {
      items.push({
        label: 'Clear Sort',
        icon: '\u2715',
        action: () => { column.clearSorting(); onClose(); },
      });
    }
    items.push({ label: '', icon: '', action: () => {}, divider: true });
  }

  items.push({
    label: 'Pin Left',
    icon: '\u25C0',
    action: () => { column.pin(isPinned === 'left' ? false : 'left'); onClose(); },
    active: isPinned === 'left',
  });
  items.push({
    label: 'Pin Right',
    icon: '\u25B6',
    action: () => { column.pin(isPinned === 'right' ? false : 'right'); onClose(); },
    active: isPinned === 'right',
  });
  if (isPinned) {
    items.push({
      label: 'Unpin',
      icon: '\u2716',
      action: () => { column.pin(false); onClose(); },
    });
  }

  items.push({ label: '', icon: '', action: () => {}, divider: true });

  if (canHide) {
    items.push({
      label: 'Hide Column',
      icon: '\u2298',
      action: () => { column.toggleVisibility(false); onClose(); },
    });
  }

  if (canResize) {
    if (onFitToHeader) {
      items.push({
        label: 'Fit to Header',
        icon: '\u2194',
        action: () => { onFitToHeader(); onClose(); },
      });
    }
    if (onFitToContent) {
      items.push({
        label: 'Fit to Content',
        icon: '\u21C4',
        action: () => { onFitToContent(); onClose(); },
      });
    }
    items.push({
      label: 'Reset Column Width',
      icon: '\u21A9',
      action: () => { column.resetSize(); onClose(); },
    });
  }

  return (
    <div
      ref={menuRef}
      className="fixed z-[100] min-w-[180px] rounded-md border border-gray-200 bg-white py-1 shadow-lg"
      style={{ left: position.x, top: position.y }}
    >
      {items.map((item, i) =>
        item.divider ? (
          <hr key={`d-${i}`} className="my-1 border-gray-100" />
        ) : (
          <button
            key={item.label}
            className={clsx(
              'flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs',
              item.active
                ? 'bg-grid-accent-light text-grid-accent font-medium'
                : 'text-grid-text hover:bg-gray-50',
              item.disabled && 'opacity-40 cursor-not-allowed'
            )}
            onClick={item.disabled ? undefined : item.action}
            disabled={item.disabled}
          >
            <span className="w-4 text-center text-[10px]">{item.icon}</span>
            {item.label}
          </button>
        )
      )}
    </div>
  );
}
