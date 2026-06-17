// ROI diagnostic — trilingual copy (EN/ES/PT).
// Voice: plain, human, honest. Hard numbers, no fluff. NOT the rejected
// "surgical/sovereign/operational-bleeding" register. See docs §8 (2026-06-17).
// Kept in a dedicated module (not translations.ts) because the volume is large
// and the strings are colocated with the engine they describe.

import type { Pain } from './types';

export type DiagnosticLang = 'en' | 'es' | 'pt';

export interface DiagnosticCopy {
  meta: { title: string; description: string };
  intro: {
    eyebrow: string;
    headline: string;
    sub: string;
    start: string;
    trust: string;
  };
  email: {
    title: string;
    sub: string;
    placeholder: string;
    button: string;
    consent: string;
    error: string;
  };
  nav: { back: string; progress: string }; // progress uses {n} / {total}
  questions: {
    pain: { q: string; help: string; options: Record<Pain, string> };
    people: { q: string; options: Record<string, string> };
    hours: { q: string; options: Record<string, string> };
    tool: { q: string; options: Record<string, string> };
    team: { q: string; options: Record<string, string> };
    spend: { q: string; options: Record<string, string> };
  };
  computing: string;
  report: {
    label: string;
    perYear: string;
    range: string; // {low} {high}
    stickyPatchwork: string;
    stickyGeneric: string;
    mathTitle: string;
    mathLine: string; // {people} {hours} {rate}
    assumptions: string;
    saas: string; // {low} {high}
    emotional: string;
    rxTitle: string;
    prescriptions: Record<Pain, string>;
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
      'A free 2-minute check. Answer 6 questions, get a real number on what manual work costs your business each year — and see what would stop it.',
  },
  intro: {
    eyebrow: 'Free · 2 minutes · 6 questions',
    headline: "What's your manual work actually costing you?",
    sub: 'Answer 6 quick questions. Get a real number — and see what it would take to stop the bleed.',
    start: "See what it's costing me",
    trust: 'No account. No sales call to get your number. Unsubscribe anytime.',
  },
  email: {
    title: 'Where should we send your number?',
    sub: 'We’ll show it on the next screen and email you the full breakdown.',
    placeholder: 'you@company.com',
    button: 'Get my number',
    consent:
      'By continuing you agree we may email you about your result. No spam, unsubscribe anytime.',
    error: 'Enter a valid work email so we can send your breakdown.',
  },
  nav: { back: 'Back', progress: 'Question {n} of {total}' },
  questions: {
    pain: {
      q: "What's eating the most time right now?",
      help: 'Pick the one that hurts most.',
      options: {
        reports: 'Building reports by hand',
        leads: 'Leads slipping through the cracks',
        invoices: 'Chasing invoices / getting paid late',
        copypaste: 'Copy-pasting data between tools',
        admin: 'Drowning in repetitive admin',
        data: 'Data scattered across spreadsheets',
      },
    },
    people: {
      q: 'How many people touch this every week?',
      options: { p1: 'Just one', p2_3: '2–3', p4_10: '4–10', p10plus: '10+' },
    },
    hours: {
      q: 'On average, how many hours a week does each of them spend on it?',
      options: { h_lt5: 'Under 5', h5_15: '5–15', h15_40: '15–40', h40plus: '40+' },
    },
    tool: {
      q: 'What runs it today?',
      options: {
        none: 'Nothing — all by hand',
        spreadsheet: 'Spreadsheets',
        offshelf: 'An off-the-shelf tool',
        patchwork: 'A patchwork I babysit (Zapier/Make)',
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
  },
  computing: 'Crunching your number…',
  report: {
    label: 'Your manual work is quietly bleeding about',
    perYear: 'a year',
    range: 'Give or take — roughly {low}–{high}, depending on the details.',
    stickyPatchwork:
      '…and the patchwork holding it together breaks the moment you get busy.',
    stickyGeneric: '…and it only grows as you do.',
    mathTitle: "Here's the math",
    mathLine: '{people} × {hours} hrs/week each × ${rate}/hr (loaded) × 52 weeks',
    assumptions:
      'Ranges, not guesses — based on US BLS labor rates plus a standard benefits load. The exact figure is what the paid audit nails down.',
    saas: "You're also paying about {low}–{high} a year for tools in this area.",
    emotional:
      "That's not just money. It's the Fridays you never get back and the headspace it quietly eats.",
    rxTitle: 'The good news: this is fixable.',
    prescriptions: {
      reports:
        'An automated reporting pipeline. Your numbers pull, assemble, and send themselves on schedule — nobody builds a deck by hand again.',
      leads:
        'A lead engine that captures every inquiry, routes it, and follows up on its own — your CRM finally doing its job instead of sitting empty.',
      invoices:
        'Automated invoicing and payment reminders that go out on their own — you get paid without chasing anyone.',
      copypaste:
        'A sync layer between your tools, so data moves itself. The copy-paste disappears.',
      admin:
        'The repetitive admin runs itself — intake, handoffs, status updates, all automated. Your team stops being the glue.',
      data: 'One source of truth. Your scattered spreadsheets pulled into a single live system everyone trusts.',
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
    sent: "Sent. Check your inbox for the full breakdown.",
    sendError:
      "We showed your number above, but the email didn't go through. Try again or reach us directly.",
  },
};

const es: DiagnosticCopy = {
  meta: {
    title: '¿Cuánto te cuesta el trabajo manual? — AGLAYA',
    description:
      'Test gratis de 2 minutos. Responde 6 preguntas y descubre, con un número real, cuánto te cuesta al año el trabajo manual — y qué haría falta para pararlo.',
  },
  intro: {
    eyebrow: 'Gratis · 2 minutos · 6 preguntas',
    headline: '¿Cuánto te cuesta de verdad el trabajo manual?',
    sub: 'Responde 6 preguntas rápidas. Te damos un número real — y lo que se necesita para parar la fuga.',
    start: 'Ver cuánto me cuesta',
    trust: 'Sin cuenta. Sin llamada de ventas para ver tu número. Te das de baja cuando quieras.',
  },
  email: {
    title: '¿A dónde te enviamos tu número?',
    sub: 'Lo verás en la siguiente pantalla y te mandamos el desglose completo por email.',
    placeholder: 'tu@empresa.com',
    button: 'Ver mi número',
    consent:
      'Al continuar aceptas que te escribamos sobre tu resultado. Sin spam, te das de baja cuando quieras.',
    error: 'Pon un email válido para enviarte el desglose.',
  },
  nav: { back: 'Atrás', progress: 'Pregunta {n} de {total}' },
  questions: {
    pain: {
      q: '¿Qué te come más tiempo ahora mismo?',
      help: 'Elige lo que más te duele.',
      options: {
        reports: 'Armar informes a mano',
        leads: 'Leads que se escapan por las grietas',
        invoices: 'Perseguir facturas / cobrar tarde',
        copypaste: 'Copiar y pegar datos entre herramientas',
        admin: 'Ahogado en tareas repetitivas',
        data: 'Datos dispersos en hojas de cálculo',
      },
    },
    people: {
      q: '¿Cuántas personas tocan esto cada semana?',
      options: { p1: 'Solo una', p2_3: '2–3', p4_10: '4–10', p10plus: '10+' },
    },
    hours: {
      q: 'De media, ¿cuántas horas a la semana le dedica cada una?',
      options: { h_lt5: 'Menos de 5', h5_15: '5–15', h15_40: '15–40', h40plus: '40+' },
    },
    tool: {
      q: '¿Con qué lo haces hoy?',
      options: {
        none: 'Con nada — todo a mano',
        spreadsheet: 'Hojas de cálculo',
        offshelf: 'Una herramienta de las de siempre',
        patchwork: 'Un parche que tengo que vigilar (Zapier/Make)',
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
  },
  computing: 'Calculando tu número…',
  report: {
    label: 'Tu trabajo manual te está costando, en silencio, unos',
    perYear: 'al año',
    range: 'Más o menos — entre {low} y {high}, según los detalles.',
    stickyPatchwork:
      '…y el parche que lo mantiene en pie se rompe justo cuando más liado estás.',
    stickyGeneric: '…y solo crece a medida que creces tú.',
    mathTitle: 'Así sale la cuenta',
    mathLine: '{people} × {hours} h/semana cada una × ${rate}/h (con cargas) × 52 semanas',
    assumptions:
      'Son rangos, no inventos — basados en tarifas laborales del BLS de EE.UU. más las cargas habituales. El número exacto lo da el audit de pago.',
    saas: 'Además pagas unos {low}–{high} al año en herramientas para esto.',
    emotional:
      'Y no es solo dinero. Son los viernes que no recuperas y la cabeza que te come sin que lo notes.',
    rxTitle: 'La buena noticia: esto tiene arreglo.',
    prescriptions: {
      reports:
        'Un sistema de informes automático. Tus números se recogen, se montan y se envían solos en su horario — nadie vuelve a armar un informe a mano.',
      leads:
        'Un motor de leads que captura cada consulta, la reparte y hace el seguimiento solo — tu CRM por fin haciendo su trabajo en vez de estar vacío.',
      invoices:
        'Facturación y recordatorios de cobro que salen solos — cobras sin perseguir a nadie.',
      copypaste:
        'Una capa que conecta tus herramientas para que los datos se muevan solos. El copia-pega desaparece.',
      admin:
        'Las tareas repetitivas se hacen solas — entradas, traspasos, actualizaciones de estado, todo automatizado. Tu equipo deja de ser el pegamento.',
      data: 'Una sola fuente de verdad. Tus hojas dispersas unidas en un sistema vivo en el que todos confían.',
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
    sendError:
      'Te mostramos tu número arriba, pero el email no salió. Inténtalo de nuevo o escríbenos directamente.',
  },
};

const pt: DiagnosticCopy = {
  meta: {
    title: 'Quanto o trabalho manual te custa? — AGLAYA',
    description:
      'Teste grátis de 2 minutos. Responda 6 perguntas e descubra, com um número real, quanto o trabalho manual custa ao seu negócio por ano — e o que seria preciso para parar.',
  },
  intro: {
    eyebrow: 'Grátis · 2 minutos · 6 perguntas',
    headline: 'Quanto o trabalho manual te custa de verdade?',
    sub: 'Responda 6 perguntas rápidas. Damos um número real — e o que é preciso para estancar a perda.',
    start: 'Ver quanto me custa',
    trust: 'Sem conta. Sem ligação de vendas para ver seu número. Cancele quando quiser.',
  },
  email: {
    title: 'Para onde enviamos o seu número?',
    sub: 'Você vê na próxima tela e enviamos o detalhamento completo por email.',
    placeholder: 'voce@empresa.com',
    button: 'Ver meu número',
    consent:
      'Ao continuar, você concorda que podemos escrever sobre o seu resultado. Sem spam, cancele quando quiser.',
    error: 'Coloque um email válido para enviarmos o detalhamento.',
  },
  nav: { back: 'Voltar', progress: 'Pergunta {n} de {total}' },
  questions: {
    pain: {
      q: 'O que mais consome tempo agora?',
      help: 'Escolha o que mais dói.',
      options: {
        reports: 'Montar relatórios à mão',
        leads: 'Leads escapando pelas frestas',
        invoices: 'Correr atrás de faturas / receber atrasado',
        copypaste: 'Copiar e colar dados entre ferramentas',
        admin: 'Afogado em tarefas repetitivas',
        data: 'Dados espalhados em planilhas',
      },
    },
    people: {
      q: 'Quantas pessoas mexem nisso toda semana?',
      options: { p1: 'Só uma', p2_3: '2–3', p4_10: '4–10', p10plus: '10+' },
    },
    hours: {
      q: 'Em média, quantas horas por semana cada uma gasta nisso?',
      options: { h_lt5: 'Menos de 5', h5_15: '5–15', h15_40: '15–40', h40plus: '40+' },
    },
    tool: {
      q: 'Com o que você faz isso hoje?',
      options: {
        none: 'Com nada — tudo à mão',
        spreadsheet: 'Planilhas',
        offshelf: 'Uma ferramenta de prateleira',
        patchwork: 'Uma gambiarra que preciso vigiar (Zapier/Make)',
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
  },
  computing: 'Calculando o seu número…',
  report: {
    label: 'O seu trabalho manual está drenando, em silêncio, cerca de',
    perYear: 'por ano',
    range: 'Mais ou menos — entre {low} e {high}, conforme os detalhes.',
    stickyPatchwork:
      '…e a gambiarra que segura tudo quebra bem na hora em que você está mais ocupado.',
    stickyGeneric: '…e só cresce conforme você cresce.',
    mathTitle: 'A conta é esta',
    mathLine: '{people} × {hours} h/semana cada × ${rate}/h (com encargos) × 52 semanas',
    assumptions:
      'São faixas, não chutes — baseadas nas tarifas de trabalho do BLS dos EUA mais os encargos habituais. O número exato é o que o audit pago define.',
    saas: 'Você ainda paga cerca de {low}–{high} por ano em ferramentas para isso.',
    emotional:
      'E não é só dinheiro. São as sextas que você não recupera e a cabeça que isso consome sem você perceber.',
    rxTitle: 'A boa notícia: isso tem conserto.',
    prescriptions: {
      reports:
        'Um sistema de relatórios automático. Seus números se reúnem, se montam e se enviam sozinhos no horário — ninguém monta relatório à mão de novo.',
      leads:
        'Um motor de leads que captura cada contato, encaminha e faz o follow-up sozinho — seu CRM enfim fazendo o trabalho dele em vez de ficar vazio.',
      invoices:
        'Faturamento e lembretes de cobrança que saem sozinhos — você recebe sem correr atrás de ninguém.',
      copypaste:
        'Uma camada que conecta suas ferramentas para os dados andarem sozinhos. O copia-e-cola some.',
      admin:
        'As tarefas repetitivas se fazem sozinhas — entradas, repasses, atualizações de status, tudo automatizado. Sua equipe deixa de ser a cola.',
      data: 'Uma única fonte de verdade. Suas planilhas espalhadas reunidas num único sistema vivo em que todos confiam.',
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
    sendError:
      'Mostramos seu número acima, mas o email não saiu. Tente de novo ou fale com a gente direto.',
  },
};

const COPY: Record<DiagnosticLang, DiagnosticCopy> = { en, es, pt };

export function getCopy(lang: string): DiagnosticCopy {
  return COPY[(lang as DiagnosticLang) in COPY ? (lang as DiagnosticLang) : 'en'];
}
