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
    'meta.title': 'AGLAYA — The Uncomfortable Agency',
    'meta.description':
      'Digital marketing and brand strategy agency. We build brands that convert. Something better is coming.',

    /* Nav */
    'nav.contact': 'Contact',

    /* Hero */
    'hero.label': 'COMING SOON',
    'hero.heading': 'The uncomfortable\nagency.',
    'hero.subtext':
      'We build brands that convert. No fluff, no excuses — just results. Something better is coming.',

    /* Form */
    'form.label': 'Get early access',
    'form.placeholder': 'your@email.com',
    'form.submit': 'Notify me',
    'form.success': "You're in. We'll be in touch.",
    'form.error': 'Something went wrong. Try again.',

    /* Direct contact */
    'contact.label': 'Or reach us directly',
    'contact.whatsapp': 'WhatsApp',

    /* Marquee */
    'marquee.items': [
      'Brand Strategy',
      'Digital Marketing',
      'Visual Identity',
      'Web Design',
      'Growth Hacking',
      'Content Creation',
      'Marketing Intelligence',
      'Design Thinking',
    ],
  },

  es: {
    /* Meta */
    'meta.title': 'AGLAYA — La Agencia Incómoda',
    'meta.description':
      'Agencia de marketing digital y estrategia de marca. Construimos marcas que convierten. Algo mejor está en camino.',

    /* Nav */
    'nav.contact': 'Contacto',

    /* Hero */
    'hero.label': 'PRÓXIMAMENTE',
    'hero.heading': 'La agencia\nincómoda.',
    'hero.subtext':
      'Construimos marcas que convierten. Sin rellenos, sin excusas — solo resultados. Algo mejor está en camino.',

    /* Form */
    'form.label': 'Acceso anticipado',
    'form.placeholder': 'tu@email.com',
    'form.submit': 'Avísame',
    'form.success': 'Perfecto. Te contactaremos pronto.',
    'form.error': 'Algo salió mal. Inténtalo de nuevo.',

    /* Direct contact */
    'contact.label': 'O contáctanos directamente',
    'contact.whatsapp': 'WhatsApp',

    /* Marquee */
    'marquee.items': [
      'Estrategia de Marca',
      'Marketing Digital',
      'Identidad Visual',
      'Diseño Web',
      'Growth Hacking',
      'Creación de Contenido',
      'Inteligencia de Marketing',
      'Design Thinking',
    ],
  },
} as const;

export function useTranslations(lang: Lang) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (ui[lang] as any)[key] ?? (ui[defaultLang] as any)[key] ?? key;
  };
}
