export const languages = {
  en: 'English',
  es: 'Español',
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'en';

/* -------------------------------------------------------
   Translation strings
   ------------------------------------------------------- */
export const ui = {
  en: {
    /* Meta */
    'meta.title': 'AGLAYA — The Uncomfortable AI·gency',
    'meta.description':
      'AI·gency: AI-powered marketing for SMBs and entrepreneurs. Enterprise results at startup prices. Coming soon.',

    /* Nav */
    'nav.contact': 'Contact',

    /* Hero */
    'hero.label': 'COMING SOON',
    'hero.eyebrow': 'Introducing AI·gency',
    'hero.heading': 'The uncomfortable\nagency.',
    'hero.subtext':
      'AI executes. Humans strategize. Enterprise-quality marketing at a fraction of the price — without the BS.',

    /* Contact section */
    'contact.section.eyebrow': 'Early Access',
    'contact.section.heading': 'Be the first to know.',
    'contact.section.body':
      'We\'re rebuilding AGLAYA from the ground up as an AI·gency. Leave your email and we\'ll reach out before anyone else.',

    /* Form */
    'form.label': 'Get early access',
    'form.name': 'Your name',
    'form.placeholder': 'your@email.com',
    'form.message': 'What do you need? (optional)',
    'form.submit': 'Notify me',
    'form.success': "You're in. We'll be in touch within 24 hours.",
    'form.error': 'Something went wrong. Try again.',

    /* Direct contact */
    'contact.label': 'Or reach us directly',
    'contact.whatsapp': 'WhatsApp',

    /* Marquee */
    'marquee.items': [
      'AI Brand Strategy',
      'AI Content Engine',
      'AI-Powered Ads',
      'Web Design & Dev',
      'Marketing Intelligence',
      'AI Visual Identity',
      'WhatsApp Automation',
      'AI SEO',
    ],
  },

  es: {
    /* Meta */
    'meta.title': 'AGLAYA — La Agenc·IA Incómoda',
    'meta.description':
      'Agenc·IA de marketing impulsada por IA para PYMEs y emprendedores. Resultados de gran empresa a precio de startup. Próximamente.',

    /* Nav */
    'nav.contact': 'Contacto',

    /* Hero */
    'hero.label': 'PRÓXIMAMENTE',
    'hero.eyebrow': 'Presentamos la Agenc·IA',
    'hero.heading': 'La agencia\nincómoda.',
    'hero.subtext':
      'La IA ejecuta. El humano estrategiza. Marketing de calidad boutique a precio de herramienta — sin rodeos.',

    /* Contact section */
    'contact.section.eyebrow': 'Acceso Anticipado',
    'contact.section.heading': 'Sé el primero en saberlo.',
    'contact.section.body':
      'Estamos reconstruyendo AGLAYA desde cero como una Agenc·IA. Déjanos tu email y te contactamos antes que a nadie.',

    /* Form */
    'form.label': 'Acceso anticipado',
    'form.name': 'Tu nombre',
    'form.placeholder': 'tu@email.com',
    'form.message': '¿Qué necesitas? (opcional)',
    'form.submit': 'Avísame',
    'form.success': 'Perfecto. Te contactamos en menos de 24 horas.',
    'form.error': 'Algo salió mal. Inténtalo de nuevo.',

    /* Direct contact */
    'contact.label': 'O contáctanos directamente',
    'contact.whatsapp': 'WhatsApp',

    /* Marquee */
    'marquee.items': [
      'AI Brand Strategy',
      'AI Content Engine',
      'Publicidad con IA',
      'Diseño Web & Dev',
      'Inteligencia de Marketing',
      'Identidad Visual con IA',
      'Automatización WhatsApp',
      'AI SEO',
    ],
  },
} as const;

export function useTranslations(lang: Lang) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (ui[lang] as any)[key] ?? (ui[defaultLang] as any)[key] ?? key;
  };
}
