// ROI diagnostic — trilingual copy (EN/ES/PT).
// Voice: plain, human, honest. Hard numbers, no fluff. NOT the rejected
// "surgical/sovereign/operational-bleeding" register. See docs §8 (2026-06-17).

import type { Pain, FreqBucket, TriedBucket } from './types';

export type DiagnosticLang = 'en' | 'es' | 'pt';

interface VolumeUnit {
  noun: string; // inline noun, e.g. "invoices"
  options: [string, string, string, string]; // v1..v4 full phrases
}

export interface DiagnosticCopy {
  meta: { title: string; description: string };
  intro: { eyebrow: string; headline: string; sub: string; start: string; trust: string };
  email: { title: string; sub: string; placeholder: string; button: string; consent: string; error: string };
  nav: { back: string; progress: string; continue: string; multiHint: string };
  painShort: Record<Pain, string>;
  questions: {
    areas: { q: string; help: string; options: Record<Pain, string> };
    worst: { q: string };
    people: { q: string; options: Record<string, string> };
    hours: { q: string; options: Record<string, string> };
    tool: { q: string; options: Record<string, string> };
    frequency: { q: string; options: Record<FreqBucket, string> };
    team: { q: string; options: Record<string, string> };
    spend: { q: string; options: Record<string, string> };
    tried: { q: string; options: Record<TriedBucket, string> };
    volume: { q: string; units: Record<Pain, VolumeUnit> };
  };
  computing: string;
  report: {
    label: string;
    perYear: string;
    range: string; // {low} {high}
    equivFull: string; // {hours} {fte}
    equivHours: string; // {hours}
    stickyPatchwork: string;
    stickyGeneric: string;
    splitsTitle: string;
    splitLine: string; // {area} {amount}
    priorityTitle: string;
    mathTitle: string;
    mathLine: string; // {people} {hours} {rate}
    assumptions: string;
    saas: string; // {low} {high}
    volumeLine: string; // {area} {vol}
    fragility: Record<FreqBucket, string>;
    emotional: string;
    rxTitle: string;
    prescriptions: Record<Pain, string>;
    triedContext: Record<TriedBucket, string>;
    receipts: string;
    guarantee: string;
    scarcity: string;
    restart: string;
    tier: {
      qualified: { title: string; body: string; cta: string; note: string };
      borderline: { title: string; body: string; cta: string };
      not_yet: { title: string; body: string; cta: string };
    };
    sending: string;
    sent: string;
    sendError: string;
  };
}

const en: DiagnosticCopy = {
  meta: {
    title: 'What is your manual work costing you? — AGLAYA',
    description:
      'A free 2-minute check. Answer a few questions, get a real number on what manual work costs your business each year — and see what would stop it.',
  },
  intro: {
    eyebrow: 'Free · ~3 minutes · no sales call',
    headline: "What's your manual work actually costing you?",
    sub: 'A handful of quick questions. A real number — and a clear picture of where the time goes and what would stop it.',
    start: "See what it's costing me",
    trust: 'No account. You see your number before we ever talk. Unsubscribe anytime.',
  },
  email: {
    title: 'Where should we send your number?',
    sub: 'You see it on the next screen — we also email you the full breakdown.',
    placeholder: 'you@company.com',
    button: 'Show me my number',
    consent: 'By continuing you agree we may email you about your result. No spam, unsubscribe anytime.',
    error: 'Enter a valid work email so we can send your breakdown.',
  },
  nav: { back: 'Back', progress: 'Question {n} of {total}', continue: 'Continue', multiHint: 'Pick all that apply.' },
  painShort: {
    reports: 'reports',
    leads: 'leads',
    invoices: 'invoices',
    copypaste: 'copy-paste',
    admin: 'admin',
    data: 'scattered data',
  },
  questions: {
    areas: {
      q: 'Where is the time going?',
      help: 'Pick every area that bleeds you.',
      options: {
        reports: 'Building reports by hand',
        leads: 'Leads slipping through the cracks',
        invoices: 'Chasing invoices / getting paid late',
        copypaste: 'Copy-pasting data between tools',
        admin: 'Repetitive admin',
        data: 'Data scattered across spreadsheets',
      },
    },
    worst: { q: 'Of those, which one hurts most?' },
    people: {
      q: 'How many people touch this work every week?',
      options: { p1: 'Just one', p2_3: '2–3', p4_10: '4–10', p10plus: '10+' },
    },
    hours: {
      q: 'On average, how many hours a week does each of them spend on it?',
      options: { h_lt5: 'Under 5', h5_15: '5–15', h15_40: '15–40', h40plus: '40+' },
    },
    tool: {
      q: 'What runs most of it today?',
      options: {
        none: 'Nothing — all by hand',
        spreadsheet: 'Spreadsheets',
        offshelf: 'An off-the-shelf tool',
        patchwork: 'A patchwork I babysit (Zapier/Make)',
      },
    },
    frequency: {
      q: 'When you get slammed, how often does something break or slip?',
      options: {
        rarely: 'Almost never',
        monthly: 'Once in a while',
        weekly: 'Most weeks',
        constantly: 'Constantly',
      },
    },
    team: {
      q: 'How big is your team?',
      options: { t_solo: 'Just me', t2_10: '2–10', t11_50: '11–50', t50plus: '50+' },
    },
    spend: {
      q: 'Roughly what do you pay monthly for tools in this area?',
      options: { s_lt100: 'Under $100', s100_500: '$100–500', s500_2k: '$500–2K', s2kplus: '$2K+' },
    },
    tried: {
      q: 'What have you already tried to fix it?',
      options: {
        nothing: 'Nothing yet',
        hired: 'Hired someone for it',
        zapier: 'Built a Zapier/Make setup',
        tool: 'Bought a tool',
      },
    },
    volume: {
      q: 'Your worst area is {area}. Roughly how much of it?',
      units: {
        reports: { noun: 'reports', options: ['Under 5 a month', '5–20 a month', '20–50 a month', '50+ a month'] },
        leads: { noun: 'leads', options: ['Under 20 a month', '20–100 a month', '100–500 a month', '500+ a month'] },
        invoices: { noun: 'invoices', options: ['Under 20 a month', '20–100 a month', '100–500 a month', '500+ a month'] },
        copypaste: { noun: 'hand-offs', options: ['Under 10 a week', '10–50 a week', '50–200 a week', '200+ a week'] },
        admin: { noun: 'tasks', options: ['Under 10 a week', '10–50 a week', '50–200 a week', '200+ a week'] },
        data: { noun: 'spreadsheets', options: ['1–3', '4–10', '11–25', '25+'] },
      },
    },
  },
  computing: 'Crunching your number…',
  report: {
    label: 'Your manual work is quietly bleeding about',
    perYear: 'a year',
    range: 'Give or take — roughly {low}–{high}, depending on the details.',
    equivFull: '≈ {hours} hours a year — like paying ~{fte} full-time people to produce nothing.',
    equivHours: '≈ {hours} hours a year, gone.',
    stickyPatchwork: '…and the patchwork holding it together breaks the moment you get busy.',
    stickyGeneric: '…and it only grows as you do.',
    splitsTitle: 'Where it goes',
    splitLine: '{area} — about {amount}/yr',
    priorityTitle: 'Where to start (biggest first)',
    mathTitle: "Here's the math",
    mathLine: '{people} × {hours} hrs/week each × ${rate}/hr (blended, loaded) × 52 weeks',
    assumptions:
      'Ranges, not guesses — US BLS labor rates plus a standard benefits load. The exact figure is what the paid audit nails down.',
    saas: "You're also paying about {low}–{high} a year for tools in this area.",
    volumeLine: 'And {area}? Roughly {vol} — all by hand.',
    fragility: {
      rarely: 'It holds — for now. But a manual patchwork breaks right as you grow.',
      monthly: 'And once in a while something drops or slips — usually at the worst moment.',
      weekly: 'And most weeks something breaks or slips. That isn’t slow — it’s fragile.',
      constantly: 'And it breaks constantly. You’re firefighting instead of growing.',
    },
    emotional:
      "That's not just money. It's the Fridays you never get back and the headspace it quietly eats.",
    rxTitle: 'The good news: this is fixable.',
    prescriptions: {
      reports:
        'An automated reporting pipeline — your numbers pull, assemble, and send themselves on schedule.',
      leads:
        'A lead engine that captures every inquiry, routes it, and follows up on its own.',
      invoices:
        'Automated invoicing and reminders that go out on their own — you get paid without chasing.',
      copypaste: 'A sync layer between your tools, so data moves itself. The copy-paste disappears.',
      admin: 'The repetitive admin runs itself — intake, handoffs, status updates, all automated.',
      data: 'One source of truth — your scattered spreadsheets pulled into a single live system.',
    },
    triedContext: {
      nothing: "You haven't tried to automate it yet — so we start clean, no mess to undo.",
      hired: 'You threw a person at it. That scales the cost — it doesn’t remove it.',
      zapier:
        'You built a Zapier you now babysit. That’s exactly what breaks when you’re slammed — we replace it with something that doesn’t fall over.',
      tool: 'You bought a tool, but the manual work around it never went away. We make it actually work.',
    },
    receipts:
      "We've built this across 4 production systems — websites, dashboards, outreach engines, and ops boards. We'd assemble yours from parts we've already proven.",
    guarantee:
      "The Honesty Clause: if the audit doesn't find at least $10K a year in automatable waste, you don't pay.",
    scarcity: 'We take a limited number of audits each month.',
    restart: 'Start over',
    tier: {
      qualified: {
        title: 'This looks like a strong fit.',
        body: 'Your bleed is big enough — and your setup ready enough — that a build would pay for itself fast.',
        cta: 'Book your ROI Audit',
        note: 'The audit fee comes off your build, 100%.',
      },
      borderline: {
        title: 'This could be a fit.',
        body: "There's real money on the table. A short conversation will tell us whether a build makes sense now or later.",
        cta: "Let's talk it through",
      },
      not_yet: {
        title: 'Honestly? Not yet.',
        body: "At your scale, a custom build would cost more than it saves right now. Here's what we'd fix first — no charge, no pitch.",
        cta: 'Send me the quick-wins guide',
      },
    },
    sending: 'Sending your breakdown…',
    sent: 'Sent. Check your inbox for the full breakdown.',
    sendError: "We showed your number above, but the email didn't go through. Try again or reach us directly.",
  },
};

const es: DiagnosticCopy = {
  meta: {
    title: '¿Cuánto te cuesta el trabajo manual? — AGLAYA',
    description:
      'Test gratis de 2 minutos. Responde unas preguntas y descubre, con un número real, cuánto te cuesta al año el trabajo manual — y qué haría falta para pararlo.',
  },
  intro: {
    eyebrow: 'Gratis · ~3 minutos · sin llamada de ventas',
    headline: '¿Cuánto te cuesta de verdad el trabajo manual?',
    sub: 'Unas preguntas rápidas. Un número real — y un mapa claro de dónde se va el tiempo y qué lo pararía.',
    start: 'Ver cuánto me cuesta',
    trust: 'Sin cuenta. Ves tu número antes de que hablemos siquiera. Te das de baja cuando quieras.',
  },
  email: {
    title: '¿A dónde te enviamos tu número?',
    sub: 'Lo ves en la siguiente pantalla — y te mandamos el desglose completo por email.',
    placeholder: 'tu@empresa.com',
    button: 'Enséñame mi número',
    consent: 'Al continuar aceptas que te escribamos sobre tu resultado. Sin spam, te das de baja cuando quieras.',
    error: 'Pon un email válido para enviarte el desglose.',
  },
  nav: { back: 'Atrás', progress: 'Pregunta {n} de {total}', continue: 'Continuar', multiHint: 'Marca todas las que apliquen.' },
  painShort: {
    reports: 'informes',
    leads: 'leads',
    invoices: 'facturas',
    copypaste: 'copia-pega',
    admin: 'tareas admin',
    data: 'datos dispersos',
  },
  questions: {
    areas: {
      q: '¿Dónde se va el tiempo?',
      help: 'Marca cada área que te sangra.',
      options: {
        reports: 'Armar informes a mano',
        leads: 'Leads que se escapan por las grietas',
        invoices: 'Perseguir facturas / cobrar tarde',
        copypaste: 'Copiar y pegar datos entre herramientas',
        admin: 'Tareas repetitivas',
        data: 'Datos dispersos en hojas de cálculo',
      },
    },
    worst: { q: 'De esas, ¿cuál te duele más?' },
    people: {
      q: '¿Cuántas personas tocan este trabajo cada semana?',
      options: { p1: 'Solo una', p2_3: '2–3', p4_10: '4–10', p10plus: '10+' },
    },
    hours: {
      q: 'De media, ¿cuántas horas a la semana le dedica cada una?',
      options: { h_lt5: 'Menos de 5', h5_15: '5–15', h15_40: '15–40', h40plus: '40+' },
    },
    tool: {
      q: '¿Con qué lo haces hoy, en general?',
      options: {
        none: 'Con nada — todo a mano',
        spreadsheet: 'Hojas de cálculo',
        offshelf: 'Una herramienta de las de siempre',
        patchwork: 'Un parche que tengo que vigilar (Zapier/Make)',
      },
    },
    frequency: {
      q: 'Cuando estás hasta arriba, ¿cada cuánto se rompe o se escapa algo?',
      options: {
        rarely: 'Casi nunca',
        monthly: 'Alguna vez al mes',
        weekly: 'Casi cada semana',
        constantly: 'Constantemente',
      },
    },
    team: {
      q: '¿De qué tamaño es tu equipo?',
      options: { t_solo: 'Solo yo', t2_10: '2–10', t11_50: '11–50', t50plus: '50+' },
    },
    spend: {
      q: '¿Más o menos cuánto pagas al mes en herramientas para esto?',
      options: { s_lt100: 'Menos de $100', s100_500: '$100–500', s500_2k: '$500–2K', s2kplus: '$2K+' },
    },
    tried: {
      q: '¿Qué has intentado ya para arreglarlo?',
      options: {
        nothing: 'Nada aún',
        hired: 'Contratar a alguien',
        zapier: 'Montar un Zapier/Make',
        tool: 'Comprar una herramienta',
      },
    },
    volume: {
      q: 'Tu peor área son {area}. ¿Más o menos cuántas?',
      units: {
        reports: { noun: 'informes', options: ['Menos de 5 al mes', '5–20 al mes', '20–50 al mes', '50+ al mes'] },
        leads: { noun: 'leads', options: ['Menos de 20 al mes', '20–100 al mes', '100–500 al mes', '500+ al mes'] },
        invoices: { noun: 'facturas', options: ['Menos de 20 al mes', '20–100 al mes', '100–500 al mes', '500+ al mes'] },
        copypaste: { noun: 'traspasos', options: ['Menos de 10 a la semana', '10–50 a la semana', '50–200 a la semana', '200+ a la semana'] },
        admin: { noun: 'tareas', options: ['Menos de 10 a la semana', '10–50 a la semana', '50–200 a la semana', '200+ a la semana'] },
        data: { noun: 'hojas', options: ['1–3', '4–10', '11–25', '25+'] },
      },
    },
  },
  computing: 'Calculando tu número…',
  report: {
    label: 'Tu trabajo manual te está costando, en silencio, unos',
    perYear: 'al año',
    range: 'Más o menos — entre {low} y {high}, según los detalles.',
    equivFull: '≈ {hours} horas al año — como pagar a ~{fte} personas a jornada completa para que no produzcan nada.',
    equivHours: '≈ {hours} horas al año, a la basura.',
    stickyPatchwork: '…y el parche que lo mantiene en pie se rompe justo cuando más liado estás.',
    stickyGeneric: '…y solo crece a medida que creces tú.',
    splitsTitle: 'Dónde se va',
    splitLine: '{area} — unos {amount}/año',
    priorityTitle: 'Por dónde empezar (lo más gordo primero)',
    mathTitle: 'Así sale la cuenta',
    mathLine: '{people} × {hours} h/semana cada una × ${rate}/h (mezclado, con cargas) × 52 semanas',
    assumptions:
      'Son rangos, no inventos — tarifas laborales del BLS de EE.UU. más las cargas habituales. El número exacto lo da el audit de pago.',
    saas: 'Además pagas unos {low}–{high} al año en herramientas para esto.',
    volumeLine: '¿Y {area}? Unas {vol} — todo a mano.',
    fragility: {
      rarely: 'Aguanta… por ahora. Pero un montaje manual se rompe justo cuando creces.',
      monthly: 'Y alguna vez al mes algo se cae o se escapa — normalmente en el peor momento.',
      weekly: 'Y casi cada semana algo se rompe o se escapa. Eso no es lento: es frágil.',
      constantly: 'Y se rompe constantemente. Estás apagando fuegos en vez de crecer.',
    },
    emotional: 'Y no es solo dinero. Son los viernes que no recuperas y la cabeza que te come sin que lo notes.',
    rxTitle: 'La buena noticia: esto tiene arreglo.',
    prescriptions: {
      reports: 'Un sistema de informes automático — tus números se recogen, se montan y se envían solos en su horario.',
      leads: 'Un motor de leads que captura cada consulta, la reparte y hace el seguimiento solo.',
      invoices: 'Facturación y recordatorios que salen solos — cobras sin perseguir a nadie.',
      copypaste: 'Una capa que conecta tus herramientas para que los datos se muevan solos. El copia-pega desaparece.',
      admin: 'Las tareas repetitivas se hacen solas — entradas, traspasos, actualizaciones de estado, todo automatizado.',
      data: 'Una sola fuente de verdad — tus hojas dispersas unidas en un sistema vivo.',
    },
    triedContext: {
      nothing: 'Aún no lo has intentado automatizar — empezamos limpio, sin nada que deshacer.',
      hired: 'Le echaste una persona encima. Eso escala el coste, no lo elimina.',
      zapier:
        'Montaste un Zapier que ahora tienes que vigilar. Eso es justo lo que se rompe cuando estás a tope — lo reemplazamos por algo que no se cae.',
      tool: 'Compraste una herramienta, pero el trabajo manual a su alrededor sigue ahí. La hacemos trabajar de verdad.',
    },
    receipts:
      'Lo hemos construido en 4 sistemas en producción — webs, dashboards, motores de captación y tableros de operaciones. El tuyo lo montamos con piezas que ya tenemos probadas.',
    guarantee:
      'La Cláusula de Honestidad: si el audit no encuentra al menos $10K al año en trabajo automatizable, no pagas.',
    scarcity: 'Aceptamos un número limitado de audits cada mes.',
    restart: 'Empezar de nuevo',
    tier: {
      qualified: {
        title: 'Esto pinta a buen encaje.',
        body: 'Lo que pierdes es suficiente — y tu montaje está listo — como para que un desarrollo se pague solo, y rápido.',
        cta: 'Reserva tu ROI Audit',
        note: 'Lo que pagas por el audit se descuenta del desarrollo, al 100%.',
      },
      borderline: {
        title: 'Esto podría encajar.',
        body: 'Hay dinero real sobre la mesa. Una conversación corta nos dirá si conviene construir ya o más adelante.',
        cta: 'Hablémoslo',
      },
      not_yet: {
        title: '¿Con honestidad? Todavía no.',
        body: 'A tu tamaño, un desarrollo a medida costaría más de lo que ahorra ahora mismo. Esto es lo que arreglaríamos primero — gratis y sin venderte nada.',
        cta: 'Envíame la guía de mejoras rápidas',
      },
    },
    sending: 'Enviando tu desglose…',
    sent: 'Enviado. Mira tu bandeja para el desglose completo.',
    sendError: 'Te mostramos tu número arriba, pero el email no salió. Inténtalo de nuevo o escríbenos directamente.',
  },
};

const pt: DiagnosticCopy = {
  meta: {
    title: 'Quanto o trabalho manual te custa? — AGLAYA',
    description:
      'Teste grátis de 2 minutos. Responda algumas perguntas e descubra, com um número real, quanto o trabalho manual custa ao seu negócio por ano — e o que seria preciso para parar.',
  },
  intro: {
    eyebrow: 'Grátis · ~3 minutos · sem ligação de vendas',
    headline: 'Quanto o trabalho manual te custa de verdade?',
    sub: 'Algumas perguntas rápidas. Um número real — e um mapa claro de onde o tempo vai e o que o pararia.',
    start: 'Ver quanto me custa',
    trust: 'Sem conta. Você vê seu número antes de a gente conversar. Cancele quando quiser.',
  },
  email: {
    title: 'Para onde enviamos o seu número?',
    sub: 'Você vê na próxima tela — e enviamos o detalhamento completo por email.',
    placeholder: 'voce@empresa.com',
    button: 'Mostre meu número',
    consent: 'Ao continuar, você concorda que podemos escrever sobre o seu resultado. Sem spam, cancele quando quiser.',
    error: 'Coloque um email válido para enviarmos o detalhamento.',
  },
  nav: { back: 'Voltar', progress: 'Pergunta {n} de {total}', continue: 'Continuar', multiHint: 'Marque todas que se aplicam.' },
  painShort: {
    reports: 'relatórios',
    leads: 'leads',
    invoices: 'faturas',
    copypaste: 'copia-cola',
    admin: 'tarefas admin',
    data: 'dados espalhados',
  },
  questions: {
    areas: {
      q: 'Para onde vai o tempo?',
      help: 'Marque cada área que te drena.',
      options: {
        reports: 'Montar relatórios à mão',
        leads: 'Leads escapando pelas frestas',
        invoices: 'Correr atrás de faturas / receber atrasado',
        copypaste: 'Copiar e colar dados entre ferramentas',
        admin: 'Tarefas repetitivas',
        data: 'Dados espalhados em planilhas',
      },
    },
    worst: { q: 'Dessas, qual mais dói?' },
    people: {
      q: 'Quantas pessoas mexem nesse trabalho toda semana?',
      options: { p1: 'Só uma', p2_3: '2–3', p4_10: '4–10', p10plus: '10+' },
    },
    hours: {
      q: 'Em média, quantas horas por semana cada uma gasta nisso?',
      options: { h_lt5: 'Menos de 5', h5_15: '5–15', h15_40: '15–40', h40plus: '40+' },
    },
    tool: {
      q: 'Com o que você faz isso hoje, em geral?',
      options: {
        none: 'Com nada — tudo à mão',
        spreadsheet: 'Planilhas',
        offshelf: 'Uma ferramenta de prateleira',
        patchwork: 'Uma gambiarra que preciso vigiar (Zapier/Make)',
      },
    },
    frequency: {
      q: 'Quando você está sobrecarregado, com que frequência algo quebra ou escapa?',
      options: {
        rarely: 'Quase nunca',
        monthly: 'De vez em quando',
        weekly: 'Quase toda semana',
        constantly: 'Constantemente',
      },
    },
    team: {
      q: 'Qual o tamanho da sua equipe?',
      options: { t_solo: 'Só eu', t2_10: '2–10', t11_50: '11–50', t50plus: '50+' },
    },
    spend: {
      q: 'Mais ou menos quanto você paga por mês em ferramentas para isso?',
      options: { s_lt100: 'Menos de $100', s100_500: '$100–500', s500_2k: '$500–2K', s2kplus: '$2K+' },
    },
    tried: {
      q: 'O que você já tentou para resolver?',
      options: {
        nothing: 'Nada ainda',
        hired: 'Contratar alguém',
        zapier: 'Montar um Zapier/Make',
        tool: 'Comprar uma ferramenta',
      },
    },
    volume: {
      q: 'Sua pior área são {area}. Mais ou menos quantas?',
      units: {
        reports: { noun: 'relatórios', options: ['Menos de 5 por mês', '5–20 por mês', '20–50 por mês', '50+ por mês'] },
        leads: { noun: 'leads', options: ['Menos de 20 por mês', '20–100 por mês', '100–500 por mês', '500+ por mês'] },
        invoices: { noun: 'faturas', options: ['Menos de 20 por mês', '20–100 por mês', '100–500 por mês', '500+ por mês'] },
        copypaste: { noun: 'repasses', options: ['Menos de 10 por semana', '10–50 por semana', '50–200 por semana', '200+ por semana'] },
        admin: { noun: 'tarefas', options: ['Menos de 10 por semana', '10–50 por semana', '50–200 por semana', '200+ por semana'] },
        data: { noun: 'planilhas', options: ['1–3', '4–10', '11–25', '25+'] },
      },
    },
  },
  computing: 'Calculando o seu número…',
  report: {
    label: 'O seu trabalho manual está drenando, em silêncio, cerca de',
    perYear: 'por ano',
    range: 'Mais ou menos — entre {low} e {high}, conforme os detalhes.',
    equivFull: '≈ {hours} horas por ano — como pagar ~{fte} pessoas em tempo integral para não produzir nada.',
    equivHours: '≈ {hours} horas por ano, jogadas fora.',
    stickyPatchwork: '…e a gambiarra que segura tudo quebra bem na hora em que você está mais ocupado.',
    stickyGeneric: '…e só cresce conforme você cresce.',
    splitsTitle: 'Para onde vai',
    splitLine: '{area} — cerca de {amount}/ano',
    priorityTitle: 'Por onde começar (o maior primeiro)',
    mathTitle: 'A conta é esta',
    mathLine: '{people} × {hours} h/semana cada × ${rate}/h (combinado, com encargos) × 52 semanas',
    assumptions:
      'São faixas, não chutes — tarifas do BLS dos EUA mais os encargos habituais. O número exato é o que o audit pago define.',
    saas: 'Você ainda paga cerca de {low}–{high} por ano em ferramentas para isso.',
    volumeLine: 'E {area}? Cerca de {vol} — tudo à mão.',
    fragility: {
      rarely: 'Aguenta… por enquanto. Mas uma montagem manual quebra bem quando você cresce.',
      monthly: 'E de vez em quando algo cai ou escapa — normalmente na pior hora.',
      weekly: 'E quase toda semana algo quebra ou escapa. Isso não é lento: é frágil.',
      constantly: 'E quebra constantemente. Você está apagando incêndio em vez de crescer.',
    },
    emotional: 'E não é só dinheiro. São as sextas que você não recupera e a cabeça que isso consome sem você perceber.',
    rxTitle: 'A boa notícia: isso tem conserto.',
    prescriptions: {
      reports: 'Um sistema de relatórios automático — seus números se reúnem, se montam e se enviam sozinhos no horário.',
      leads: 'Um motor de leads que captura cada contato, encaminha e faz o follow-up sozinho.',
      invoices: 'Faturamento e lembretes que saem sozinhos — você recebe sem correr atrás de ninguém.',
      copypaste: 'Uma camada que conecta suas ferramentas para os dados andarem sozinhos. O copia-e-cola some.',
      admin: 'As tarefas repetitivas se fazem sozinhas — entradas, repasses, atualizações de status, tudo automatizado.',
      data: 'Uma única fonte de verdade — suas planilhas espalhadas reunidas num único sistema vivo.',
    },
    triedContext: {
      nothing: 'Você ainda não tentou automatizar — então começamos limpo, sem nada para desfazer.',
      hired: 'Você jogou uma pessoa no problema. Isso escala o custo, não o elimina.',
      zapier:
        'Você montou um Zapier que agora precisa vigiar. É justo isso que quebra quando você está sobrecarregado — substituímos por algo que não cai.',
      tool: 'Você comprou uma ferramenta, mas o trabalho manual ao redor continua. A gente faz ela funcionar de verdade.',
    },
    receipts:
      'Já construímos isso em 4 sistemas em produção — sites, dashboards, motores de captação e quadros de operações. O seu a gente monta com peças que já provamos.',
    guarantee:
      'A Cláusula de Honestidade: se o audit não achar pelo menos $10K por ano em trabalho automatizável, você não paga.',
    scarcity: 'Aceitamos um número limitado de audits por mês.',
    restart: 'Começar de novo',
    tier: {
      qualified: {
        title: 'Isso parece um bom encaixe.',
        body: 'O que você perde é grande o bastante — e o seu setup está pronto — para um desenvolvimento se pagar rápido.',
        cta: 'Reserve seu ROI Audit',
        note: 'O valor do audit é abatido do desenvolvimento, 100%.',
      },
      borderline: {
        title: 'Isso pode encaixar.',
        body: 'Há dinheiro real na mesa. Uma conversa curta dirá se faz sentido construir agora ou mais adiante.',
        cta: 'Vamos conversar',
      },
      not_yet: {
        title: 'Com honestidade? Ainda não.',
        body: 'No seu tamanho, um desenvolvimento sob medida custaria mais do que economiza agora. Isto é o que arrumaríamos primeiro — de graça e sem vender nada.',
        cta: 'Me envie o guia de ganhos rápidos',
      },
    },
    sending: 'Enviando o seu detalhamento…',
    sent: 'Enviado. Veja sua caixa de entrada para o detalhamento completo.',
    sendError: 'Mostramos seu número acima, mas o email não saiu. Tente de novo ou fale com a gente direto.',
  },
};

const COPY: Record<DiagnosticLang, DiagnosticCopy> = { en, es, pt };

export function getCopy(lang: string): DiagnosticCopy {
  return COPY[(lang as DiagnosticLang) in COPY ? (lang as DiagnosticLang) : 'en'];
}
