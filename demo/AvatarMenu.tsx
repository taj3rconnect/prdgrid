import { useState, useRef, useEffect } from 'react';

export function AvatarMenu({ responsive, onResponsiveChange, onSysinfo }: {
  responsive: boolean;
  onResponsiveChange: (v: boolean) => void;
  onSysinfo: () => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        aria-label="User menu"
        aria-expanded={open}
        title="User menu"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-[12px] font-semibold text-white transition-colors hover:bg-white/25"
        style={{ border: 'none', cursor: 'pointer' }}
        onClick={() => setOpen((o) => !o)}
      >
        TH
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-lg border border-[#eaecf0] bg-white py-1 shadow-lg">
          <div className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wide text-[#98a2b3]">Layout</div>
          <button
            className="flex w-full items-center justify-between bg-transparent px-3 py-2 text-left text-[13px] text-[#344054] hover:bg-[#f9fafb]"
            style={{ border: 'none', font: 'inherit', cursor: 'pointer' }}
            role="switch"
            aria-checked={responsive}
            onClick={() => onResponsiveChange(!responsive)}
          >
            <span>Responsive (full width)</span>
            <span
              className="relative inline-block h-4 w-8 rounded-full transition-colors"
              style={{ backgroundColor: responsive ? '#0e4491' : '#d0d5dd' }}
            >
              <span
                className="absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all"
                style={{ left: responsive ? 18 : 2 }}
              />
            </span>
          </button>
          <div className="my-1 border-t border-[#f2f4f7]" />
          <button
            className="flex w-full items-center gap-2 bg-transparent px-3 py-2 text-left text-[13px] text-[#344054] hover:bg-[#f9fafb]"
            style={{ border: 'none', font: 'inherit', cursor: 'pointer' }}
            onClick={() => {
              setOpen(false);
              onSysinfo();
            }}
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
            </svg>
            System Info
          </button>
        </div>
      )}
    </div>
  );
}
