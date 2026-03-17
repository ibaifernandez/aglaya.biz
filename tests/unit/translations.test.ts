import { describe, it, expect } from 'vitest';
import { useTranslations } from '../../src/i18n/translations';

// ──────────────────────────────────────────────
//  Unit tests — i18n / translations
// ──────────────────────────────────────────────

const REQUIRED_KEYS = [
  'meta.title',
  'meta.description',
  'hero.label',
  'hero.subtext',
  'nav.contact',
  'contact.label',
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

describe('translations — parity check (no missing keys)', () => {
  const en = useTranslations('en');
  const es = useTranslations('es');

  it.each(REQUIRED_KEYS)('ES has same key "%s" as EN', (key) => {
    const enVal = en(key as Parameters<typeof en>[0]);
    const esVal = es(key as Parameters<typeof es>[0]);
    // Both should be non-empty strings
    expect(enVal).toBeTruthy();
    expect(esVal).toBeTruthy();
    // They should be different (i.e. actually translated, not same fallback)
    // Except for keys that are intentionally the same (e.g. brand names)
    if (!['meta.title'].includes(key)) {
      expect(enVal.toLowerCase()).not.toBe(esVal.toLowerCase());
    }
  });
});
