import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { clsx } from 'clsx';
import { useClickOutside } from '../core/useClickOutside';

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

// House standard: every dropdown is a typeahead combobox — filter-as-you-type,
// keyboard navigable, Escape closes.
export function TypeaheadSelect({
  value,
  options,
  onChange,
  className,
  ariaLabel,
  title,
  placeholder = 'Search...',
}: TypeaheadSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlight, setHighlight] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = options.find((o) => o.value === value);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  useEffect(() => {
    if (!isOpen) return;
    setQuery('');
    setHighlight(Math.max(0, options.findIndex((o) => o.value === value)));
    const t = setTimeout(() => searchRef.current?.focus(), 0);
    return () => clearTimeout(t);
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  useClickOutside(rootRef, useCallback(() => setIsOpen(false), []), { enabled: isOpen });

  useEffect(() => setHighlight(0), [query]);

  const pick = (opt: TypeaheadOption) => {
    onChange(opt.value);
    setIsOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      setIsOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight((h) => Math.min(filtered.length - 1, h + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => Math.max(0, h - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const opt = filtered[highlight];
      if (opt) pick(opt);
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        title={title}
        className={clsx('jt-input flex items-center justify-between gap-1 text-left', className)}
        onClick={() => setIsOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' && !isOpen) {
            e.preventDefault();
            setIsOpen(true);
          }
        }}
      >
        <span className="truncate">{selected?.label ?? ''}</span>
        <svg className="h-3 w-3 flex-shrink-0 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {isOpen && (
        <div
          className="absolute left-0 top-full z-50 mt-1 min-w-full overflow-hidden rounded-md shadow-lg"
          style={{
            backgroundColor: 'var(--jt-grid-menu-bg)',
            border: '1px solid var(--jt-grid-border)',
          }}
        >
          <input
            ref={searchRef}
            type="text"
            className="jt-input m-1.5 w-[calc(100%-12px)] px-1.5 py-1 text-xs"
            placeholder={placeholder}
            aria-label={`${ariaLabel || 'Options'} search`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <div role="listbox" className="max-h-52 overflow-y-auto pb-1">
            {filtered.length === 0 ? (
              <div className="px-2.5 py-1.5 text-xs text-grid-text-secondary">No matches</div>
            ) : (
              filtered.map((opt, i) => (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={opt.value === value}
                  className={clsx(
                    'block w-full px-2.5 py-1.5 text-left text-xs text-grid-text',
                    i === highlight && 'bg-grid-row-hover',
                    opt.value === value && 'font-semibold text-grid-accent'
                  )}
                  onMouseEnter={() => setHighlight(i)}
                  onClick={() => pick(opt)}
                >
                  {opt.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
