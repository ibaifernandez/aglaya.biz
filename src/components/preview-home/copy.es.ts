/**
 * Words of the Spanish preview (`/es/preview/home/`) — the twin of ./copy.ts,
 * key for key (the `Copy` type there makes a missing key a build error).
 *
 * Translated by the delineante with Ibai's go-ahead, WORD FOR WORD from card
 * 26bcd318 (2026-10-06); the words inside T3's little drawings (decorative,
 * `aria-hidden`) are the delineante's too, set on card 82868b81.
 * Kept here, inside the preview folder, for the same reason as ./copy.ts.
 */
import type { Copy } from './copy';

export const es: Copy = {
  meta: {
    title: 'AGLAYA — vista previa',
    description: 'Vista previa de la nueva portada de AGLAYA.',
  },
  nav: {
    logo: 'AGLAYA',
    label: 'Principal',
    links: [
      { href: '#built', text: 'Lo que hemos construido' },
      { href: '#orchestrator', text: 'El Orchestrator' },
      { href: '#work', text: 'Cómo trabajamos' },
    ],
    langCurrent: 'ES',
    langOther: 'EN',
    langOtherHref: '/preview/home/',
    langOtherName: 'English',
    langOtherCode: 'en',
    cta: { href: '#contact', text: 'Hablemos' },
  },
  hook: {
    eyebrow: 'IA para empresas que quieren seguir siendo independientes',
    title: 'La agencia ha muerto. Larga vida al sistema.',
    lines: [
      { text: 'La agencia', red: false },
      { text: 'ha muerto.', red: false },
      { text: 'Larga vida', red: true },
      { text: 'al sistema.', red: true },
    ],
    sub: 'Llevamos la IA a tu empresa: unas horas para una tarea puntual, un proyecto cuando necesitas un sistema concreto o un stack completo cuando tu empresa está lista para su próximo gran paso. Trabajamos con un equipo de agentes de IA sujeto a reglas, auditorías y control humano. Todo lo que construimos es tuyo, y está diseñado para seguir funcionando sin nosotros.',
    ctas: [
      { href: '#contact', text: 'Hablemos', primary: true },
      { href: '#built', text: 'Mira lo que hemos construido', primary: false },
    ],
  },
  footer: {
    brand: 'AGLAYA',
    year: '© 2026',
    links: [
      { href: '/es/privacidad/', text: 'Privacidad' },
      { href: '/es/aviso-legal/', text: 'Aviso legal' },
      { href: '/es/cookies/', text: 'Cookies' },
    ],
  },
  problem: {
    eyebrow: 'Donde se atasca la mayoría de las empresas',
    title: 'Todos te venden herramientas de IA.',
    titleEm: 'Nadie empieza por tu empresa.',
    tabsLabel: 'Donde se atascan las empresas',
    tetrisLabel:
      'Antes: las herramientas de IA caen cada vez más rápido sobre tu empresa y se amontonan dejando huecos hasta desbordarla. Después: empezamos por tus necesidades reales, los huecos, y cada una recibe un sistema hecho para ella que encaja en su sitio. Los sistemas adecuados, hechos para ti. Empieza por tus necesidades reales y deja que tu empresa crezca sólida.',
    heatmapLabel:
      'Antes: la factura mensual de IA no para de crecer, la mayoría de las licencias no se usan y la confianza del equipo en la IA cae. Después: las horas perdidas de la semana por departamento; un sistema de IA en cada punto caliente hasta que se enfría, las licencias sin uso bajan a cero y la confianza sube. Empieza donde rinde y crece desde lo que funciona.',
    plugsLabel:
      'Antes: cada proceso de tu empresa funciona enchufado a un proveedor externo al que alquilas; uno a uno, al proveedor lo compran, cierra, cambia sus condiciones o su plan, tira del cable y el proceso se para. Después: tu empresa lo trae dentro y construye un sistema por proceso, un activo digital propio; los mismos avisos caen sobre el techo y nada se para. Hecho para ti, y es tuyo. Se acabó el alquiler: lo que construimos pasa a ser un activo de tu empresa.',
    pairs: [
      {
        n: 'Problema 1 de 3',
        problem: 'Una herramienta de IA nueva cada semana',
        problemText: 'Chatbots, copilotos, agentes, automatizaciones. Cada uno promete ser _el que_ importa. Pero lo que **de verdad** importa es tu empresa.',
        solution: 'Hacemos que el sistema encaje con la necesidad',
        solutionText:
          'Deja de forzar herramientas genéricas para que encajen en tu empresa. Nos sentamos con cada departamento, vemos qué hay que resolver y construimos para cada necesidad un sistema hecho a su medida.',
      },
      {
        n: 'Problema 2 de 3',
        problem: 'Comprar a ciegas',
        problemText: 'Licencias que nadie usa, una factura que crece cada mes y un equipo que deja de confiar en la IA antes de que sirva para algo.',
        solution: 'Empieza donde rinde',
        solutionText: 'Buscamos dónde pierde más horas tu equipo y ponemos la IA justo ahí primero. Las licencias que nadie usa, fuera. Después crecemos desde lo que funciona.',
      },
      {
        n: 'Problema 3 de 3',
        problem: 'Herramientas alquiladas',
        problemText: 'Tu empresa funciona con herramientas que alquilas. Si al proveedor lo compran, cierra o cambia sus condiciones, el trabajo que hacían por ti se para con ellas.',
        solution: 'Hecho para ti, y es tuyo',
        solutionText: 'Lo que construimos funciona sobre infraestructura que controla tu empresa. No nos pagas alquiler por ello: es un activo tuyo.',
      },
    ],
  },
  built: {
    eyebrow: 'Lo que hemos construido',
    title: 'Hecho para nosotros.',
    titleEm: 'El siguiente, el tuyo.',
    lede: 'Cada sistema que construimos para hacer funcionar AGLAYA, contado como lo que haría por tu empresa.',
    depthWord: 'CAPACIDADES',
    more: 'Mira cómo funciona',
    oursPrefix: 'Nuestro',
    wide: {
      title: 'Orchestrator',
      text: 'Nuestra sala de control. Mantiene un mapa vivo de cada sistema que usamos y de las reglas entre ellos, y dirige a los agentes de IA que trabajan en ellos: cada uno con su papel, sus permisos y sus auditorías, y una persona que aprueba. Cualquiera puede usar la IA. Así es como se dirige una empresa con ella.',
      mini: { kind: 'fleet' },
    },
    rows: [
      [
        {
          ours: 'Scanner 21.719',
          title: 'Una boca de leads que funciona',
          text: 'Algo gratuito que resuelve un problema pequeño y real a tus visitantes. Ellos se llevan algo útil. Tú, un lead que ya ha visto en qué eres bueno.',
          mini: { kind: 'flow', steps: [{ text: 'Gratis' }, { text: 'Resultado real' }, { text: 'Lead cualificado', red: true }] },
        },
        {
          ours: 'Outreach',
          title: 'Prospección con IA',
          text: 'Lee tus fuentes de datos y le dice a tu equipo comercial a quién escribir, cómo, por qué y cuándo, y si uno a uno o en campaña.',
          mini: { kind: 'rows', rows: [{ text: 'escribir hoy' }, { text: 'escribir hoy' }, { text: 'campaña', green: true }, { text: 'campaña', green: true }] },
        },
      ],
      [
        {
          ours: 'CRM + consent log',
          title: 'Un CRM propio',
          text: 'Tu base de clientes en infraestructura que controlas, sin pagar por usuario. Y cada contacto lleva el registro de cómo y cuándo aceptó saber de ti.',
          mini: { kind: 'rows', rows: [{ text: 'consiente 12:04', green: true }, { text: 'consiente 12:31', green: true }, { text: 'sin consentimiento' }, { text: 'consiente 13:02', green: true }] },
        },
        {
          ours: 'Automation panel',
          title: 'Automatizaciones en orden',
          text: 'Toda tu maquinaria de email en un solo sitio: por dónde entra cada contacto, qué automatización activa y un aviso cuando tu plataforma y tu web dejan de cuadrar. Se acabó rebuscar en tu plataforma de email para averiguarlo.',
          mini: { kind: 'flow', steps: [{ text: 'Alta' }, { text: 'Esperar 2 d', red: true }, { text: 'Email' }] },
        },
      ],
      [
        {
          ours: 'Kanban Desk',
          title: 'Un tablero para personas y agentes de IA',
          text: 'Cada tarea se convierte en una tarjeta en la que trabajan personas y agentes: organizar, construir, revisar, decidir. Cada paso queda escrito en la tarjeta, así que siempre sabes quién hizo qué y por qué.',
          mini: { kind: 'cols' },
        },
        {
          ours: 'Design System',
          title: 'Una sola fuente para tu marca',
          text: 'Tus colores, tu tipografía y tu voz en un solo sitio, que leen todas tus plataformas y los agentes de IA que escriben por ti. Lo cambias una vez y todas las páginas lo siguen.',
          mini: { kind: 'swatches' },
        },
      ],
    ],
  },
};
