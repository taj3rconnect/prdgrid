import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { clsx } from 'clsx';
import { Column } from '@tanstack/react-table';
import { useClickOutside } from '../core/useClickOutside';

export interface HeaderMenuState {
  columnId: string;
  x: number;
  y: number;
}

interface HeaderContextMenuProps<TData> {
  column: Column<TData, unknown> | null;
  position: { x: number; y: number } | null;
  onClose: () => void;
  /** Style token container — menu portal inherits grid CSS vars from it */
  themeStyle?: React.CSSProperties;
}

interface Item {
  label: string;
  action: () => void;
  active?: boolean;
  divider?: boolean;
}

export function HeaderContextMenu<TData>({ column, position, onClose, themeStyle }: HeaderContextMenuProps<TData>) {
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, onClose, { enabled: !!position, escape: true });

  // Keep menu inside the viewport
  useEffect(() => {
    if (!menuRef.current || !position) return;
    const rect = menuRef.current.getBoundingClientRect();
    if (rect.right > window.innerWidth) menuRef.current.style.left = `${position.x - rect.width}px`;
    if (rect.bottom > window.innerHeight) menuRef.current.style.top = `${position.y - rect.height}px`;
  }, [position]);

  if (!column || !position) return null;

  const sorted = column.getIsSorted();
  const isPinned = column.getIsPinned();
  const isGrouped = column.getIsGrouped();

  const items: Item[] = [];
  if (column.getCanSort()) {
    items.push(
      { label: 'Sort ascending', active: sorted === 'asc', action: () => column.toggleSorting(false, false) },
      { label: 'Sort descending', active: sorted === 'desc', action: () => column.toggleSorting(true, false) }
    );
    if (sorted) items.push({ label: 'Clear sort', action: () => column.clearSorting() });
    items.push({ label: '', action: () => {}, divider: true });
  }
  if (column.getCanPin()) {
    items.push(
      { label: isPinned === 'left' ? 'Unpin' : 'Pin left', active: isPinned === 'left', action: () => column.pin(isPinned === 'left' ? false : 'left') },
      { label: isPinned === 'right' ? 'Unpin' : 'Pin right', active: isPinned === 'right', action: () => column.pin(isPinned === 'right' ? false : 'right') }
    );
  }
  if (column.getCanGroup()) {
    items.push({ label: isGrouped ? 'Ungroup' : 'Group by this column', active: isGrouped, action: () => column.toggleGrouping() });
  }
  if (column.getCanResize()) {
    items.push({ label: 'Reset column width', action: () => column.resetSize() });
  }
  if (column.getCanHide()) {
    items.push({ label: '', action: () => {}, divider: true });
    items.push({ label: 'Hide column', action: () => column.toggleVisibility(false) });
  }

  return createPortal(
    <div
      ref={menuRef}
      className="jt-datagrid jt-context-menu jt-menu fixed z-[70] min-w-[190px]"
      style={{ left: position.x, top: position.y, ...themeStyle, boxShadow: 'var(--jt-grid-menu-shadow)' }}
    >
      {items.map((item, i) =>
        item.divider ? (
          <hr key={i} className="my-1" style={{ borderColor: 'var(--jt-grid-border)' }} />
        ) : (
          <button
            key={i}
            className={clsx('jt-menu-item', item.active && 'jt-menu-item-active')}
            onClick={() => {
              item.action();
              onClose();
            }}
          >
            {item.label}
          </button>
        )
      )}
    </div>,
    document.body
  );
}
