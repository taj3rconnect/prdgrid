import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        grid: {
          bg: 'var(--jt-grid-bg, #ffffff)',
          'bg-alt': 'var(--jt-grid-bg-alt, #f9fafb)',
          border: 'var(--jt-grid-border, #e5e7eb)',
          'header-bg': 'var(--jt-grid-header-bg, #f3f4f6)',
          'header-text': 'var(--jt-grid-header-text, #111827)',
          text: 'var(--jt-grid-text, #374151)',
          'text-secondary': 'var(--jt-grid-text-secondary, #6b7280)',
          accent: 'var(--jt-grid-accent, #3b82f6)',
          'accent-light': 'var(--jt-grid-accent-light, #dbeafe)',
          'row-hover': 'var(--jt-grid-row-hover, #f3f4f6)',
          'row-selected': 'var(--jt-grid-row-selected, #eff6ff)',
          'cell-edit': 'var(--jt-grid-cell-edit, #fef3c7)',
          success: 'var(--jt-grid-success, #10b981)',
          warning: 'var(--jt-grid-warning, #f59e0b)',
          error: 'var(--jt-grid-error, #ef4444)',
        },
      },
      fontSize: {
        'grid-sm': 'var(--jt-grid-font-sm, 0.75rem)',
        'grid-base': 'var(--jt-grid-font-base, 0.8125rem)',
        'grid-lg': 'var(--jt-grid-font-lg, 0.875rem)',
      },
    },
  },
  plugins: [],
} satisfies Config;
