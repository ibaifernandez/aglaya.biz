// Single source of truth for the privacy-policy version identifier.
//
// The public forms embed PRIVACY_POLICY_VERSION as a hidden field so every
// submission carries a record of WHICH privacy-policy text was live when the
// user submitted. This is an accountability record (GDPR Art. 5(2)) and is
// basis-neutral: aglaya.biz processes contact/ROI/quote leads under legitimate
// interest, NOT consent, so this is evidence of "what notice was shown", not
// proof of consent.
//
// This constant MUST equal the "Last updated" date rendered on the privacy
// pages (they import PRIVACY_POLICY_VERSION_DISPLAY below, so they cannot
// drift). Bump both whenever the privacy policy text changes.
export const PRIVACY_POLICY_VERSION = '2026-06-13';

// Localized display of the same version, rendered on each privacy page.
export const PRIVACY_POLICY_VERSION_DISPLAY: Record<'en' | 'es' | 'pt', string> = {
  en: 'June 13, 2026',
  es: '13 de junio de 2026',
  pt: '13 de junho de 2026',
};
