import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,tsx}', './demo/**/*.{ts,tsx}', './index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        grid: {
          bg: 'var(--jt-grid-bg, #ffffff)',
          'bg-alt': 'var(--jt-grid-bg-alt, #f9fafb)',
          border: 'var(--jt-grid-border, #e5e7eb)',
          'border-strong': 'var(--jt-grid-border-strong, #d0d7de)',
          'toolbar-bg': 'var(--jt-grid-toolbar-bg, #ffffff)',
          'menu-bg': 'var(--jt-grid-menu-bg, #ffffff)',
          'input-bg': 'var(--jt-grid-input-bg, #ffffff)',
          'header-icon': 'var(--jt-grid-header-icon, #9aa4af)',
          'accent-hover': 'var(--jt-grid-accent-hover, #2560c8)',
          'chip-bg': 'var(--jt-grid-chip-bg, #dbe7fd)',
          'chip-text': 'var(--jt-grid-chip-text, #1e429f)',
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
