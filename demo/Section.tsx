import React from 'react';

export function Section({ title, subtitle, tags, children }: {
  title: string; subtitle: string; tags: string[]; children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <div className="mb-4">
        <h2 className="text-[22px] font-bold tracking-[-0.01em] text-[#101828]">{title}</h2>
        <p className="text-sm text-[#475467] mt-1">{subtitle}</p>
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {tags.map(t => (
            <span key={t} className="rounded-md border border-[#eaecf0] bg-[#f9fafb] px-2 py-0.5 text-[11px] font-medium text-[#475467]">{t}</span>
          ))}
        </div>
      </div>
      {children}
    </section>
  );
}

// Explains drag-to-group for demos that enable the group panel
export function GroupingHint({ examples }: { examples: string }) {
  return (
    <div className="mb-3 flex gap-3 rounded-lg border border-[#d4e3f8] bg-[#f4f8ff] px-4 py-3">
      <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#0e4491]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
      </svg>
      <div className="text-[13px] leading-relaxed text-[#344054]">
        <span className="font-semibold text-[#101828]">Row grouping:</span>{' '}
        drag a column header (try {examples}) into the band above the grid that reads
        “Drag column headers here to group rows”. Rows collapse into expandable groups — click a
        group row to open it — and numeric columns roll up (sum / avg) per group. Remove a group
        by clicking the × on its chip, or “Clear all” to reset.
      </div>
    </div>
  );
}
