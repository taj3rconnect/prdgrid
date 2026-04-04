# Contributing to @jobtalk/datagrid

Thanks for your interest in contributing! This project is open to everyone — whether you're fixing a typo, adding a feature, or improving performance.

## Getting Started

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/prdgrid.git
cd prdgrid

# Install dependencies
npm install

# Start dev server with live demo
npm run dev

# Run tests
npm test

# Type check
npx tsc --noEmit

# Build the library
npm run build
```

## Project Structure

```
src/
  components/       # React components
    DataGrid.tsx    # Main component (entry point)
    GridBody.tsx    # Table body with rows
    GridCell.tsx    # Individual cell with editing
    GridRow.tsx     # Row with selection, grouping
    GridHeader.tsx  # Header with sorting, drag reorder
    HeaderCell.tsx  # Individual header cell
    GridToolbar.tsx # Search, export, density controls
    FloatingFilter.tsx  # Per-column filter inputs
    ColumnManager.tsx   # Column visibility/reorder panel
    GroupPanel.tsx      # Drag-drop grouping panel
    Pagination.tsx     # Page navigation
    StatusBar.tsx      # Row count display
    Overlay.tsx        # Loading spinner
  core/
    useGridEngine.ts   # Main hook (TanStack Table wrapper)
    gridUtils.ts       # Shared utilities
  export/
    csvExport.ts       # CSV generation and download
    excelExport.ts     # Excel export (lazy-loaded ExcelJS)
    psdExport.ts       # Image export (lazy-loaded html2canvas)
    emailExport.ts     # Email report via API
    scheduleExport.ts  # Scheduled email exports
    exportUtils.ts     # Shared download helpers
  types.ts           # All TypeScript interfaces
  index.ts           # Public API exports
  styles/
    datagrid.css     # Base CSS + Tailwind

demo/
  main.tsx           # 8 interactive demo grids
  sampleData.ts      # Realistic sample data generators
```

## How to Contribute

### Reporting Bugs

Open an issue with:
- What you expected vs. what happened
- Steps to reproduce
- Browser and React version

### Suggesting Features

Open an issue tagged `enhancement` with:
- The use case (what are you trying to do?)
- Your proposed solution
- Any alternatives you considered

### Submitting Code

1. **Fork** the repo and create a feature branch: `feat/your-feature` or `fix/your-fix`
2. **Make your changes** — keep PRs focused on one thing
3. **Test** — make sure `npm run build` and `npx tsc --noEmit` pass
4. **Open a PR** with a clear description of what changed and why

### Code Style

- TypeScript strict mode — no `any` unless absolutely necessary
- Use existing patterns: check `gridUtils.ts` for shared helpers
- Components: functional with hooks, use `React.memo` for hot-path components (rows, cells)
- Exports: lazy-load heavy libraries (ExcelJS, html2canvas) via dynamic `import()`
- CSS: Tailwind utilities + CSS custom properties for theming

### Areas Where Help is Welcome

- **Virtual scrolling** — handle 100k+ rows efficiently
- **Cell editors** — date picker, select dropdown, large text area
- **Clipboard** — copy/paste support
- **Column auto-sizing** — calculate width from content
- **Accessibility** — ARIA roles, keyboard navigation improvements
- **Server-side** — sorting, filtering, pagination via API
- **Row drag & drop** — reorder rows
- **Context menu** — right-click actions
- **Storybook stories** — component documentation
- **Tests** — unit and integration tests with Vitest

## Code of Conduct

Be respectful. Be constructive. We're all here to build something useful.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
