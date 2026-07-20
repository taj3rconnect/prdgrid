import { describe, it, expect } from 'vitest';
import { resolveAppearance, LOOK_PRESETS, ACCENTS, LOOKS } from './themes';

describe('resolveAppearance', () => {
  it('applies look preset tokens', () => {
    const { style, isDark } = resolveAppearance({ look: 'quartz', accent: 'blue', density: 'normal' });
    expect(style['--jt-grid-col-border-width']).toBe('0px');
    expect(isDark).toBe(false);
  });

  it('marks midnight as dark and applies dark chrome tokens', () => {
    const { style, isDark } = resolveAppearance({ look: 'midnight', accent: 'blue', density: 'normal' });
    expect(isDark).toBe(true);
    expect(style['--jt-grid-bg']).toBe('#0d1117');
    expect(style['--jt-grid-menu-bg']).toBe('#1c2128');
  });

  it('accent tokens compose with any look', () => {
    const { style } = resolveAppearance({ look: 'airtable', accent: 'violet', density: 'normal' });
    expect(style['--jt-grid-accent']).toBe('#7a5af8');
    expect(style['--jt-grid-row-selected']).toBe('#f2eeff');
  });

  it('dark looks derive accent washes as alpha overlays', () => {
    const { style } = resolveAppearance({ look: 'midnight', accent: 'teal', density: 'normal' });
    expect(style['--jt-grid-row-selected']).toContain('color-mix');
    expect(style['--jt-grid-accent']).toBe('#0e9384');
  });

  it('density maps to row height (30/36/44)', () => {
    expect(resolveAppearance({ look: 'airtable', accent: 'blue', density: 'compact' }).style['--jt-grid-row-height']).toBe('30px');
    expect(resolveAppearance({ look: 'airtable', accent: 'blue', density: 'normal' }).style['--jt-grid-row-height']).toBe('36px');
    expect(resolveAppearance({ look: 'airtable', accent: 'blue', density: 'comfortable' }).style['--jt-grid-row-height']).toBe('44px');
  });

  it('dense look scales density row height down', () => {
    const { style } = resolveAppearance({ look: 'dense', accent: 'blue', density: 'compact' });
    expect(style['--jt-grid-row-height']).toBe(`${Math.round(30 * 0.82)}px`);
  });

  it('explicit rowHeight prop overrides density and look', () => {
    const { style } = resolveAppearance({ look: 'dense', accent: 'blue', density: 'comfortable', rowHeight: 65 });
    expect(style['--jt-grid-row-height']).toBe('65px');
  });

  it('custom theme tokens have highest precedence', () => {
    const { style } = resolveAppearance({
      look: 'quartz',
      accent: 'blue',
      density: 'normal',
      themeTokens: { '--jt-grid-accent': '#123456', '--jt-grid-header-bg': '#abcdef' },
    });
    expect(style['--jt-grid-accent']).toBe('#123456');
    expect(style['--jt-grid-header-bg']).toBe('#abcdef');
  });

  it('exposes 6 looks and 8 accents for the switcher', () => {
    expect(LOOKS).toHaveLength(6);
    expect(ACCENTS).toHaveLength(8);
    expect(Object.keys(LOOK_PRESETS)).toHaveLength(6);
  });
});
