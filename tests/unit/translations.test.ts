import { describe, it, expect } from 'vitest';
import { ui, useTranslations } from '../../src/i18n/translations';

const REQUIRED_KEYS = [
  'meta.title',
  'meta.description',
  'hero.label',
  'hero.subtext',
  'nav.contact',
  'contact.label',
  'footer.dispatch.heading',
  'footer.dispatch.submit',
] as const;

describe('useTranslations — EN', () => {
  const t = useTranslations('en');

  it.each(REQUIRED_KEYS)('key "%s" exists and is non-empty', (key) => {
    const val = t(key as Parameters<typeof t>[0]);
    expect(typeof val).toBe('string');
    expect(val.length).toBeGreaterThan(0);
  });

  it('meta.title contains AGLAYA', () => {
    expect(t('meta.title')).toContain('AGLAYA');
  });

  it('hero.label is "COMING SOON" (case-insensitive)', () => {
    expect(t('hero.label').toLowerCase()).toContain('coming soon');
  });
});

describe('useTranslations — ES', () => {
  const t = useTranslations('es');

  it.each(REQUIRED_KEYS)('key "%s" exists and is non-empty', (key) => {
    const val = t(key as Parameters<typeof t>[0]);
    expect(typeof val).toBe('string');
    expect(val.length).toBeGreaterThan(0);
  });

  it('meta.title contains AGLAYA', () => {
    expect(t('meta.title')).toContain('AGLAYA');
  });

  it('hero.label is "PRÓXIMAMENTE" (case-insensitive)', () => {
    expect(t('hero.label').toLowerCase()).toContain('próximamente');
  });
});

describe('useTranslations — PT', () => {
  const t = useTranslations('pt');

  it.each(REQUIRED_KEYS)('key "%s" exists and is non-empty', (key) => {
    const val = t(key as Parameters<typeof t>[0]);
    expect(typeof val).toBe('string');
    expect(val.length).toBeGreaterThan(0);
  });

  it('meta.title contains AGLAYA', () => {
    expect(t('meta.title')).toContain('AGLAYA');
  });
});

describe('translations — full parity check (all keys × 3 languages)', () => {
  const allEnKeys = Object.keys(ui.en) as Array<keyof typeof ui.en>;

  it('ES has every key that EN has', () => {
    const esKeys = new Set(Object.keys(ui.es));
    const missing = allEnKeys.filter(k => !esKeys.has(k));
    expect(missing, `ES missing keys: ${missing.join(', ')}`).toHaveLength(0);
  });

  it('PT has every key that EN has', () => {
    const ptKeys = new Set(Object.keys(ui.pt));
    const missing = allEnKeys.filter(k => !ptKeys.has(k));
    expect(missing, `PT missing keys: ${missing.join(', ')}`).toHaveLength(0);
  });

  it('EN has every key that ES has (no ES-only orphans)', () => {
    const enKeys = new Set(Object.keys(ui.en));
    const missing = (Object.keys(ui.es) as Array<keyof typeof ui.es>).filter(k => !enKeys.has(k));
    expect(missing, `EN missing keys present in ES: ${missing.join(', ')}`).toHaveLength(0);
  });

  it('EN has every key that PT has (no PT-only orphans)', () => {
    const enKeys = new Set(Object.keys(ui.en));
    const missing = (Object.keys(ui.pt) as Array<keyof typeof ui.pt>).filter(k => !enKeys.has(k));
    expect(missing, `EN missing keys present in PT: ${missing.join(', ')}`).toHaveLength(0);
  });

  it('all values are non-empty strings across all 3 languages', () => {
    const langs = ['en', 'es', 'pt'] as const;
    for (const lang of langs) {
      for (const key of allEnKeys) {
        const val = (ui[lang] as Record<string, unknown>)[key];
        expect(typeof val, `${lang}.${key} is not a string`).toBe('string');
        expect((val as string).length, `${lang}.${key} is empty`).toBeGreaterThan(0);
      }
    }
  });
});
