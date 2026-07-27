// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { DataGrid } from './DataGrid';
import type { ColumnDef } from '../types';

/**
 * House rule: number / amount / percent columns right-align by DEFAULT on BOTH
 * the data rows AND the header row. A left-aligned header sitting over
 * right-aligned numbers is the exact defect this file guards against.
 *
 * The subtle failure mode is NOT the `text-align` value — `useGridEngine`
 * already seeds `right` for numeric columns. It is that the header's inner flex
 * row contained a `flex-1` spacer, which grows to eat all free space and so
 * leaves `justify-end` nothing to distribute, pinning the label left while the
 * values below it sat right.
 */

interface Row {
  ticker: string;
  company: string;
  price: number;
  rsi: number;
  pos52w: number;
  mktCap: number;
}

const rows: Row[] = [
  { ticker: 'ORCL', company: 'Oracle Corporation', price: 120.12, rsi: 26, pos52w: 2, mktCap: 404_000_000_000 },
  { ticker: 'APP', company: 'Applovin Corporation', price: 391.98, rsi: 8, pos52w: 8, mktCap: 177_100_000_000 },
];

// Mirrors the Screener grid: text columns + numerics declared several ways —
// amount-name heuristic (Price), explicit numeric dataType (RSI, Mkt Cap),
// and percent (52W Pos). All of the numerics must right-align their header.
const columns: ColumnDef<Row>[] = [
  { field: 'ticker', headerName: 'Ticker' },
  { field: 'company', headerName: 'Company' },
  { field: 'price', headerName: 'Price' },
  { field: 'rsi', headerName: 'RSI', dataType: 'number' },
  { field: 'pos52w', headerName: '52W Pos', dataType: 'percent' },
  { field: 'mktCap', headerName: 'Mkt Cap', dataType: 'number' },
];

const NUMERIC_HEADERS = ['Price', 'RSI', '52W Pos', 'Mkt Cap'];
const TEXT_HEADERS = ['Ticker', 'Company'];

// Scope to <thead>: the same labels also appear in the Column Manager panel.
function headerCell(name: string): HTMLTableCellElement {
  const head = document.querySelector('thead');
  if (!head) throw new Error('grid rendered without a <thead>');
  // Match the label span, not the whole cell: typed columns also render a
  // field-type icon and a sort indicator inside the same <th>.
  const th = Array.from(head.querySelectorAll('th')).find((cell) =>
    Array.from(cell.querySelectorAll('span')).some((s) => s.textContent?.trim() === name)
  );
  if (!th) throw new Error(`no <th> found for header "${name}"`);
  return th as HTMLTableCellElement;
}

/** The flex row inside the <th> that actually positions the label. */
function headerRow(name: string): HTMLElement {
  const row = headerCell(name).querySelector('div');
  if (!row) throw new Error(`no flex row inside header "${name}"`);
  return row as HTMLElement;
}

beforeEach(() => localStorage.clear());

describe('numeric column headers right-align by default', () => {
  it('sets text-align:right on every numeric/amount/percent header cell', () => {
    render(<DataGrid rowData={rows} columnDefs={columns} />);
    for (const name of NUMERIC_HEADERS) {
      expect(headerCell(name).style.textAlign, `${name} header text-align`).toBe('right');
    }
  });

  it('leaves text columns left-aligned', () => {
    render(<DataGrid rowData={rows} columnDefs={columns} />);
    for (const name of TEXT_HEADERS) {
      expect(headerCell(name).style.textAlign, `${name} header text-align`).not.toBe('right');
    }
  });

  it('justifies the numeric header label to the end', () => {
    render(<DataGrid rowData={rows} columnDefs={columns} />);
    for (const name of NUMERIC_HEADERS) {
      expect(headerRow(name).className, `${name} header flex row`).toContain('justify-end');
    }
  });

  // The regression that produced the reported screenshot.
  it('has no growing flex spacer in a right-aligned header (it defeats justify-end)', () => {
    render(<DataGrid rowData={rows} columnDefs={columns} />);
    for (const name of NUMERIC_HEADERS) {
      const spacers = headerRow(name).querySelectorAll(':scope > .flex-1');
      expect(spacers.length, `${name} header must not contain a flex-1 spacer`).toBe(0);
    }
  });

  /**
   * The second half of the same defect: the group-toggle button trails the label
   * in DOM order and is only `opacity-0` when idle — it still occupies ~27px of
   * layout, so `justify-end` ends the ROW at the content edge while the LABEL
   * stops 27px short of it. Measured in a real browser before the fix:
   * data text right = 1914.96, header label right = 1888.34.
   *
   * Nothing may be laid out after the label in a right-aligned header, so every
   * following sibling must be pulled ahead of it with a negative flex `order`.
   */
  it('lays nothing out after the label in a right-aligned header', () => {
    render(<DataGrid rowData={rows} columnDefs={columns} />);
    for (const name of NUMERIC_HEADERS) {
      const row = headerRow(name);
      const label = Array.from(row.children).find((el) => el.textContent?.trim() === name);
      expect(label, `${name} label span`).toBeTruthy();
      const trailing = Array.from(row.children).slice(Array.from(row.children).indexOf(label!) + 1);
      for (const el of trailing) {
        const order = Number((el as HTMLElement).style.order);
        expect(order, `${name}: <${el.tagName.toLowerCase()}> after the label must have a negative order`)
          .toBeLessThan(0);
      }
    }
  });

  it('keeps the trailing decorations after the label in a LEFT-aligned header', () => {
    render(<DataGrid rowData={rows} columnDefs={columns} />);
    for (const name of TEXT_HEADERS) {
      const row = headerRow(name);
      for (const el of Array.from(row.children)) {
        expect((el as HTMLElement).style.order, `${name} must not re-order`).toBe('');
      }
    }
  });
});
