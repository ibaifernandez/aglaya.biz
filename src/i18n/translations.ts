export const languages = {
  en: 'English',
  es: 'Español',
  pt: 'Português',
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'en';

export const ui = {
  en: {
    /* Global */
    'nav.proof': 'Proof',
    'nav.systems': 'Systems',
    'nav.economics': 'Economics',
    'nav.services': 'Services',
    'nav.roi_audit': 'ROI Audit',
    'nav.contact': 'Request Proposal',
    'nav.legal': 'Legal',
    'nav.privacy': 'Privacy',
    'nav.resources': 'Resources',
    'nav.terms': 'Terms',
    'nav.cookies': 'Cookies',

    /* Meta */
    'meta.title': 'AGLAYA — The Uncomfortable Agency',
    'meta.description': 'We build high-performance AI systems that replace manual chaos with automated certainty. Recover your operational sovereignty.',

    /* Cookie Banner */
    'cookie.message': 'We use cookies to maintain system integrity and analyze traffic patterns.',
    'cookie.accept': 'Accept All',
    'cookie.essential': 'Essential Only',
    'cookie.reject': 'Decline',
    'cookie.policy_link': 'Cookie Policy',
    'cookie.privacy_link': 'Privacy Policy',

    /* Hero */
    'hero.eyebrow': 'We build systems that empower your business while you sleep',
    'hero.heading': 'The agency is dead.\nLong live the system.',
    'hero.subtext': 'Most teams don\'t need an agency. They need their own infrastructure. We build it. You own it. The system keeps running when we\'re not in the room.',
    'hero.cta': 'Request Proposal →',
    'hero.secondary': 'See the proof →',
    'hero.label': 'COMING SOON',

    /* Problem */
    'problem.eyebrow': 'Not your typical agency',
    'problem.heading1': 'Agencies sell hours.',
    'problem.heading2': 'We sell sovereignty.',
    'problem.body': "When you leave an agency, you lose everything they built — the accounts, the automations, the knowledge. With AGLAYA, you own the infrastructure. The system keeps running when we're not in the room.",

    /* Systems */
    'systems.heading': 'Our Architecture',
    'systems.eyebrow': 'Engineering principles guiding our system design',

    'systems.1.title': 'Systemic Alchemy',
    'systems.1.tagline': 'Transforming operational chaos into autonomous digital assets.',
    'systems.1.cases': 'Autonomous opportunity validation, Operational truth visualization, Automated consensus protocols',
    
    'systems.2.title': 'Inevitable Logical Flow',
    'systems.2.tagline': 'Systems that execute the precise action based on user behavior.',
    'systems.2.cases': 'Purchase intent synchronization, Reactive authority deployment, Progressive credibility assets',
    
    'systems.3.title': 'Zero-Leak Architecture',
    'systems.3.tagline': 'Infrastructure where data integrity and performance are non-negotiable.',
    'systems.3.cases': 'Performance capture interfaces, Digital asset shielding, Real-time data consistency',
    
    'systems.4.title': 'Algorithmic Sovereignty',
    'systems.4.tagline': 'Autonomous intelligence integrated into the core of business execution.',
    'systems.4.cases': 'Corporate memory deployment, Critical intelligence extraction, Cognitive load distribution',
    
    'systems.5.title': 'Zero-Filter Diagnostics',
    'systems.5.tagline': 'Eliminating operational lies to find the shortest path to profitability.',
    'systems.5.cases': 'Market authority mapping, Operational leak deconstruction, Command and control structuring',

    /* How it Works */
    'how.heading': 'The Engagement Protocol',
    
    'how.1.title': 'Operational Truth Audit',
    'how.1.description': "We deconstruct every operational inefficiency costing you time and capital. Exact numbers, no guesswork. If we don't find ROI, we don't sell.",
    
    'how.2.title': 'Sovereign Architecture Design',
    'how.2.description': 'We engineer your proprietary automation architecture. You’re involved, not managed. We build for sovereignty, not dependency.',
    
    'how.3.title': 'System Execution & Evolution',
    'how.3.description': "We ensure, evolve, and intensify the system's performance. Weekly syncs. You own everything — we're the architects on retainer.",
    /* Proof */
    'proof.heading': 'Proof, not promises.',
    'proof.eyebrow': 'The evidence that endorses our practice',

    'proof.cta': 'Request the same ROI →',

    /* Anti-Client */
    'anti.eyebrow': 'The Filter',
    'anti.heading': 'We are not for everyone.',
    'anti.body': 'AGLAYA is built for those who value operational integrity over aesthetic comfort. If you want a mirror, buy one. If you want a system, talk to us.',
    'anti.list.1': 'Budget < $8,000 / month',
    'anti.list.2': 'Seeking validation, not challenge',
    'anti.list.3': 'Manual-first mindset',

    /* Economics */
    'eco.eyebrow': 'The ROI Math',
    'eco.heading': 'Marketing is an expense.\nSystems are assets.',
    'eco.body': "A system that recovers 30 hours of your sales team's weekly capacity isn't a cost. It's a permanent increase in your enterprise value.",

    /* Contact / ICP */
    'contact.heading': 'Before we talk — a few honest questions.',
    'contact.description': 'We don\'t do proposals. We do audits. Identify your leaks and discover the exact systemic infrastructure needed to bridge the gap between chaos and clockwork.',
    'contact.quote': 'Systems are not rented. They are owned.',
    'contact.eyebrow': 'The Protocol',
    'contact.label': 'REQUEST PROPOSAL',
    'contact.qualify.eyebrow': 'Qualification Protocol',
    'contact.qualify.heading': 'DATA_CALIBRATION',
    'contact.qualify.button': 'EXECUTE_VALUATION',
    'contact.qualify.emp_label': 'TEAM_SIZE',
    'contact.qualify.spend_label': 'MONTHLY_OPERATIONAL_WASTE',
    'contact.qualify.emp_range_1': '1_SOLO',
    'contact.qualify.emp_range_2': '150_MID',
    'contact.qualify.emp_range_3': '300+_CORP',
    'contact.qualify.spend_range_1': '$0_MIN',
    'contact.qualify.spend_range_2': '$25K_MID',
    'contact.qualify.spend_range_3': '$50K+_MAX',
    'contact.disqualified.title': 'OPERATIONAL_MISMATCH',
    'contact.disqualified.msg': 'Your current operational scale does not yet warrant the AGLAYA system build. We recommend stabilizing your manual flow before introducing automation. This is the honest answer.',
    'contact.disqualified.message': 'We\'re probably not your agency — yet. When your team hits 20+ people and you\'re spending >$5K/month on manual work, come back.',
    'contact.borderline.title': 'PROVISIONAL_ALIGNMENT',
    'contact.borderline.msg': 'You are at a transitional scale. We capture your signal now to coordinate a future deployment sequence when your complexity increases.',
    'contact.borderline.message': 'You might be a fit in the future. Leave your details and we\'ll follow up when the time is right.',
    'contact.qualified.title': 'SYSTEM_MATCH_CONFIRMED',
    'contact.qualified.submit': 'Schedule ROI Audit',
    'contact.qualified.heading': 'Let\'s Build Your System',

    'contact.form.name': 'Full Name',
    'contact.form.email': 'Corporate Email',
    'contact.form.company': 'Company Name',
    'contact.form.website': 'Company Website',
    'contact.form.message': 'Operational Bottlenecks',
    'contact.form.submit': 'Transmit Signal →',
    'contact.success': 'Signal received and decrypted. Our architects are reviewing your operational data. Expect a response within one business cycle.',

    /* Proof Details */
    'proof.detail.systems': 'SYSTEMS_DEPLOYED',
    'proof.detail.client': 'CLIENT',
    'proof.detail.industry': 'INDUSTRY',
    'status.system_ok': 'SYSTEM_INTEGRITY_OK',
    'proof.detail.challenge': 'CHALLENGE',
    'proof.detail.strategy': 'STRATEGY',
    'proof.detail.vision': 'VISION',
    'proof.detail.check': 'SOVEREIGNTY_CHECK',
    'proof.detail.quote': "The system keeps running when we're not in the room.",
    'proof.detail.cta': 'REPLICATE RESULTS',
    'proof.featured': 'PRIORITY CASE',
    'final.heading': 'System Entry Protocol',
    'final.subtext': 'Start the qualification sequence to determine compatibility with our architectural standards.',
    'mission.statement': 'The agency is dead. Long live the system. We build high-performance AI architectures for leaders who demand sovereignty over their operations.',
  },

  es: {
    /* Global */
    'nav.proof': 'Evidencia',
    'nav.systems': 'Sistemas',
    'nav.economics': 'Economía',
    'nav.services': 'Servicios',
    'nav.roi_audit': 'ROI Audit',
    'nav.contact': 'Solicitar Propuesta',
    'nav.legal': 'Legal',
    'nav.privacy': 'Privacidad',
    'nav.resources': 'Recursos',
    'nav.terms': 'Términos',
    'nav.cookies': 'Cookies',

    /* Meta */
    'meta.title': 'AGLAYA — La Agencia Incómoda',
    'meta.description': 'Construimos sistemas de IA de alto rendimiento que reemplazan el caos manual con certidumbre automatizada. Recupera tu soberanía operativa.',

    /* Cookie Banner */
    'cookie.message': 'Utilizamos cookies para mantener la integridad del sistema y analizar patrones de tráfico.',
    'cookie.accept': 'Aceptar Todo',
    'cookie.essential': 'Solo Esenciales',
    'cookie.reject': 'Rechazar',
    'cookie.policy_link': 'Política de Cookies',
    'cookie.privacy_link': 'Política de Privacidad',

    /* Hero */
    'hero.eyebrow': 'Construimos sistemas que empoderan tu negocio mientras duermes',
    'hero.heading': 'La agencia murió.\nQue viva el sistema.',
    'hero.subtext': 'La mayoría de equipos no necesitan una agencia. Necesitan su propia infraestructura. Nosotros la construimos. Tú la posees. El sistema sigue funcionando cuando no estamos.',
    'hero.cta': 'Solicitar propuesta',
    'hero.secondary': 'Ver la evidencia →',
    'hero.label': 'PRÓXIMAMENTE',

    /* Problem */
    'problem.eyebrow': 'No somos tu típica agencia',
    'problem.heading1': 'Las agencias venden horas.',
    'problem.heading2': 'Nosotros vendemos soberanía.',
    'problem.body': 'Cuando dejas una agencia, pierdes todo lo que construyeron: las cuentas, las automatizaciones, el conocimiento. Con AGLAYA, tú eres el dueño de la infraestructura. El sistema sigue funcionando aunque no estemos presentes.',

    /* Systems */
    'systems.heading': 'Nuestra Arquitectura',
    'systems.eyebrow': 'Conoce los principios que guían nuestra ingeniería',
    'systems.1.title': 'Alquimia sistémica',
    'systems.1.tagline': 'Transformamos el caos operativo en activos digitales que trabajan solos.',
    'systems.1.cases': 'Validación autónoma de oportunidades, Visualización de realidades operativas, Protocolos de consenso automatizado',
    'systems.2.title': 'Flujo Lógico Inevitable',
    'systems.2.tagline': 'Sistemas que ejecutan la acción correcta siempre según el comportamiento del cliente.',
    'systems.2.cases': 'Sincronización de intención de compra, Despliegue de autoridad de marca, Creación de activos de credibilidad progresiva',
    'systems.3.title': 'Arquitectura sin goteras',
    'systems.3.tagline': 'Infraestructura donde hay dos máximas no negociables: la integridad de los datos y el rendimiento.',
    'systems.3.cases': 'Interfaces de captura de rendimiento, Sistemas de identidad inmutable, Blindaje y consistencia de activos',
    'systems.4.title': 'Soberanía algorítmica',
    'systems.4.tagline': 'Inteligencia autónoma integrada en el núcleo de ejecución.',
    'systems.4.cases': 'Despliegue de memoria corporativa, Extracción de inteligencia crítica, Distribución de carga cognitiva',
    'systems.5.title': 'Diagnóstico sin filtro',
    'systems.5.tagline': 'Eliminamos las mentiras operativas para encontrar el camino más corto hacia la rentabilidad.',
    'systems.5.cases': 'Mapeo de autoridad de mercado, Deconstrucción de fugas operativas, Estructuración de mando y control',

    /* How it Works */
    'how.heading': 'Protocolo de Ejecución',
    
    'how.1.title': 'Auditoría de Verdad Operativa',
    'how.1.description': "Deconstruimos cada ineficiencia manual que consume capital y tiempo. Datos exactos, sin suposiciones. Si no detectamos ROI, no vendemos.",
    
    'how.2.title': 'Diseño de Arquitectura Soberana',
    'how.2.description': 'Ingeniería de automatización propietaria. Estás involucrado, no gestionado. Construimos para tu soberanía, no para tu dependencia.',
    
    'how.3.title': 'Ejecución y Evolución del Sistema',
    'how.3.description': "Aseguramos, evolucionamos e intensificamos el rendimiento de la arquitectura. Sincronización semanal. Tú eres el dueño de cada activo.",
    /* Proof */
    'proof.heading': 'Evidencia, no promesas.',
    'proof.eyebrow': 'La evidencia que ampara nuestra praxis',
    'proof.cta': 'Solicitar el mismo ROI →',

    /* Anti-Client */
    'anti.eyebrow': 'El Filtro',
    'anti.heading': 'No somos para todos.',
    'anti.body': 'AGLAYA está hecho para quienes valoran la integridad operativa por encima de la comodidad estética. Si quieres un espejo, compra uno. Si quieres un sistema, hablemos.',
    'anti.list.1': 'Presupuesto < $8,000 / mes',
    'anti.list.2': 'Buscas validación, no desafío',
    'anti.list.3': 'Mentalidad manual-primero',

    /* Economics */
    'eco.eyebrow': 'La Matemática del ROI',
    'eco.heading': 'El marketing es un gasto.\nLos sistemas son activos.',
    'eco.body': 'Un sistema que recupera 30 horas de capacidad semanal de tu equipo no es un costo. Es un aumento permanente en el valor de tu empresa.',

    /* Contact / ICP */
    'contact.heading': 'Antes de hablar — algunas preguntas honestas.',
    'contact.description': 'No hacemos propuestas. Hacemos auditorías. Identificamos tus fugas y descubrimos la infraestructura sistémica exacta para cerrar la brecha entre el caos y la certidumbre automatizada.',
    'contact.quote': 'Los sistemas no se alquilan. Se poseen.',
    'contact.eyebrow': 'El Protocolo',
    'contact.label': 'SOLICITAR PROPUESTA',
    'contact.qualify.eyebrow': 'Protocolo de Calificación',
    'contact.qualify.heading': 'CALIBRACIÓN_DE_DATOS',
    'contact.qualify.button': 'EJECUTAR_VALORACIÓN',
    'contact.qualify.emp_label': 'TAMAÑO_DEL_EQUIPO',
    'contact.qualify.spend_label': 'GASTO_OPERATIVO_MENSUAL',
    'contact.qualify.emp_range_1': '1_SOLO',
    'contact.qualify.emp_range_2': '150_MED',
    'contact.qualify.emp_range_3': '300+_CORP',
    'contact.qualify.spend_range_1': '$0_MÍN',
    'contact.qualify.spend_range_2': '$25K_MED',
    'contact.qualify.spend_range_3': '$50K+_MÁX',
    'contact.disqualified.title': 'DESAJUSTE_OPERATIVO',
    'contact.disqualified.msg': 'Tu escala operativa actual aún no requiere la construcción del sistema AGLAYA. Recomendamos estabilizar tu flujo manual antes de introducir automatización. Es la respuesta honesta.',
    'contact.disqualified.message': 'Probablemente no somos tu agencia — todavía. Cuando tu equipo alcance 20+ personas y gastes >$5K/mes en trabajo manual, vuelve.',
    'contact.borderline.title': 'ALINEACIÓN_PROVISIONAL',
    'contact.borderline.msg': 'Te encuentras en una escala de transición. Capturamos tu señal ahora para coordinar una secuencia de despliegue futuro cuando tu complejidad aumente.',
    'contact.borderline.message': 'Puede que encajes en el futuro. Deja tus datos y haremos seguimiento cuando llegue el momento.',
    'contact.qualified.title': 'SISTEMA_COMPATIBLE_CONFIRMADO',
    'contact.qualified.submit': 'Agendar Auditoría ROI',
    'contact.qualified.heading': 'Construyamos Tu Sistema',

    'contact.form.name': 'Nombre Completo',
    'contact.form.email': 'Email Corporativo',
    'contact.form.company': 'Nombre de la Empresa',
    'contact.form.website': 'Sitio Web de la Empresa',
    'contact.form.message': 'Cuellos de Botella Operativos',
    'contact.form.submit': 'Transmitir Señal →',
    'contact.success': 'Señal recibida y desencriptada. Nuestros arquitectos están revisando sus datos operativos. Espere una respuesta dentro de un ciclo comercial.',

    /* Proof Details */
    'proof.detail.systems': 'SISTEMAS_DESPLEGADOS',
    'proof.detail.client': 'CLIENTE',
    'proof.detail.industry': 'INDUSTRIA',
    'status.system_ok': 'INTEGRIDAD_SISTEMA_OK',
    'proof.detail.challenge': 'RETO',
    'proof.detail.strategy': 'ESTRATEGIA',
    'proof.detail.vision': 'VISIÓN',
    'proof.detail.check': 'CONTROL_DE_SOBERANÍA',
    'proof.detail.quote': 'El sistema sigue funcionando aunque no estemos en la sala.',
    'proof.detail.cta': 'REPLICAR RESULTADOS',
    'proof.featured': 'CASO PRIORITARIO',
    'final.heading': 'Protocolo de Entrada al Sistema',
    'final.subtext': 'Inicia la secuencia de calificación para determinar la compatibilidad con nuestros estándares arquitectónicos.',
    'mission.statement': 'La agencia murió. Que viva el sistema. Construimos arquitecturas de IA de alto rendimiento para líderes que exigen soberanía sobre sus operaciones.',
  },
  pt: {
    /* Global */
    'nav.proof': 'Evidência',
    'nav.systems': 'Sistemas',
    'nav.economics': 'Economia',
    'nav.services': 'Serviços',
    'nav.roi_audit': 'ROI Audit',
    'nav.contact': 'Solicitar Proposta',
    'nav.legal': 'Legal',
    'nav.privacy': 'Privacidade',
    'nav.resources': 'Recursos',
    'nav.terms': 'Termos',
    'nav.cookies': 'Cookies',

    /* Meta */
    'meta.title': 'AGLAYA — A Agência Desconfortável',
    'meta.description': 'Construímos sistemas de IA de alto desempenho que substituem o caos manual por certeza automatizada. Recupere sua soberania operacional.',

    /* Cookie Banner */
    'cookie.message': 'Utilizamos cookies para manter a integridade do sistema e analisar padrões de tráfego.',
    'cookie.accept': 'Aceitar Tudo',
    'cookie.essential': 'Apenas Essenciais',
    'cookie.reject': 'Recusar',
    'cookie.policy_link': 'Política de Cookies',
    'cookie.privacy_link': 'Política de Privacidade',

    /* Hero */
    'hero.eyebrow': 'Construímos sistemas que potencializam seu negócio enquanto você dorme',
    'hero.heading': 'A agência morreu.\nViva o sistema.',
    'hero.subtext': 'A maioria das equipes não precisa de uma agência. Precisa de sua própria infraestrutura. Nós construímos. Você possui. O sistema continua funcionando quando não estamos.',
    'hero.cta': 'Solicitar proposta',
    'hero.secondary': 'Ver a evidência →',
    'hero.label': 'EM BREVE',

    /* Problem */
    'problem.eyebrow': 'Não somos sua agência típica',
    'problem.heading1': 'Agências vendem horas.',
    'problem.heading2': 'Nós vendemos soberania.',
    'problem.body': 'Quando você sai de uma agência, perde tudo que construíram — as contas, as automações, o conhecimento. Com a AGLAYA, você é o dono da infraestrutura. O sistema continua funcionando mesmo quando não estamos presentes.',

    /* Systems */
    'systems.heading': 'Nossa Arquitetura',
    'systems.eyebrow': 'Princípios de engenharia que guiam o design dos nossos sistemas',

    'systems.1.title': 'Alquimia Sistêmica',
    'systems.1.tagline': 'Transformando o caos operacional em ativos digitais autônomos.',
    'systems.1.cases': 'Validação autônoma de oportunidades, Visualização da verdade operacional, Protocolos de consenso automatizado',

    'systems.2.title': 'Fluxo Lógico Inevitável',
    'systems.2.tagline': 'Sistemas que executam a ação precisa com base no comportamento do usuário.',
    'systems.2.cases': 'Sincronização de intenção de compra, Implantação de autoridade reativa, Ativos progressivos de credibilidade',

    'systems.3.title': 'Arquitetura Sem Vazamentos',
    'systems.3.tagline': 'Infraestrutura onde integridade de dados e desempenho são inegociáveis.',
    'systems.3.cases': 'Interfaces de captura de desempenho, Blindagem de ativos digitais, Consistência de dados em tempo real',

    'systems.4.title': 'Soberania Algorítmica',
    'systems.4.tagline': 'Inteligência autônoma integrada ao núcleo da execução empresarial.',
    'systems.4.cases': 'Implantação de memória corporativa, Extração de inteligência crítica, Distribuição de carga cognitiva',

    'systems.5.title': 'Diagnóstico Sem Filtros',
    'systems.5.tagline': 'Eliminando as mentiras operacionais para encontrar o caminho mais curto para a lucratividade.',
    'systems.5.cases': 'Mapeamento de autoridade de mercado, Desconstrução de vazamentos operacionais, Estruturação de comando e controle',

    /* How it Works */
    'how.heading': 'O Protocolo de Engajamento',

    'how.1.title': 'Auditoria da Verdade Operacional',
    'how.1.description': 'Desconstruímos cada ineficiência operacional que custa tempo e capital. Números exatos, sem suposições. Se não encontrarmos ROI, não vendemos.',

    'how.2.title': 'Design de Arquitetura Soberana',
    'how.2.description': 'Projetamos sua arquitetura de automação proprietária. Você está envolvido, não gerenciado. Construímos para soberania, não dependência.',

    'how.3.title': 'Execução e Evolução do Sistema',
    'how.3.description': 'Garantimos, evoluímos e intensificamos o desempenho do sistema. Sincronizações semanais. Você possui tudo — somos os arquitetos em retenção.',

    /* Proof */
    'proof.heading': 'Evidência, não promessas.',
    'proof.eyebrow': 'A evidência que valida nossa prática',
    'proof.cta': 'Solicitar o mesmo ROI →',

    /* Anti-Client */
    'anti.eyebrow': 'O Filtro',
    'anti.heading': 'Não somos para todos.',
    'anti.body': 'A AGLAYA foi construída para quem valoriza a integridade operacional acima do conforto estético. Se quer um espelho, compre um. Se quer um sistema, fale conosco.',
    'anti.list.1': 'Orçamento < $8.000 / mês',
    'anti.list.2': 'Buscando validação, não desafio',
    'anti.list.3': 'Mentalidade manual-primeiro',

    /* Economics */
    'eco.eyebrow': 'A Matemática do ROI',
    'eco.heading': 'Marketing é um gasto.\nSistemas são ativos.',
    'eco.body': 'Um sistema que recupera 30 horas da capacidade semanal da sua equipe de vendas não é um custo. É um aumento permanente no valor da sua empresa.',

    /* Contact / ICP */
    'contact.heading': 'Antes de conversar — algumas perguntas honestas.',
    'contact.description': 'Não fazemos propostas. Fazemos auditorias. Identificamos seus vazamentos e descobrimos a infraestrutura sistêmica exata para fechar a lacuna entre o caos e a certeza automatizada.',
    'contact.quote': 'Sistemas não se alugam. Possuem-se.',
    'contact.eyebrow': 'O Protocolo',
    'contact.label': 'SOLICITAR PROPOSTA',
    'contact.qualify.eyebrow': 'Protocolo de Qualificação',
    'contact.qualify.heading': 'CALIBRAÇÃO_DE_DADOS',
    'contact.qualify.button': 'EXECUTAR_AVALIAÇÃO',
    'contact.qualify.emp_label': 'TAMANHO_DA_EQUIPE',
    'contact.qualify.spend_label': 'DESPESA_OPERACIONAL_MENSAL',
    'contact.qualify.emp_range_1': '1_SOLO',
    'contact.qualify.emp_range_2': '150_MED',
    'contact.qualify.emp_range_3': '300+_CORP',
    'contact.qualify.spend_range_1': '$0_MÍN',
    'contact.qualify.spend_range_2': '$25K_MED',
    'contact.qualify.spend_range_3': '$50K+_MÁX',
    'contact.disqualified.title': 'INCOMPATIBILIDADE_OPERACIONAL',
    'contact.disqualified.msg': 'Sua escala operacional atual ainda não justifica a construção do sistema AGLAYA. Recomendamos estabilizar seu fluxo manual antes de introduzir automação. Esta é a resposta honesta.',
    'contact.disqualified.message': 'Provavelmente não somos sua agência — ainda. Quando sua equipe atingir 20+ pessoas e você gastar >$5K/mês em trabalho manual, volte.',
    'contact.borderline.title': 'ALINHAMENTO_PROVISIONAL',
    'contact.borderline.msg': 'Você está em uma escala de transição. Capturamos seu sinal agora para coordenar uma sequência de implantação futura quando sua complexidade aumentar.',
    'contact.borderline.message': 'Você pode ser um match no futuro. Deixe seus dados e entraremos em contato quando o momento for certo.',
    'contact.qualified.title': 'COMPATIBILIDADE_CONFIRMADA',
    'contact.qualified.submit': 'Agendar Auditoria ROI',
    'contact.qualified.heading': 'Vamos Construir Seu Sistema',

    'contact.form.name': 'Nome Completo',
    'contact.form.email': 'E-mail Corporativo',
    'contact.form.company': 'Nome da Empresa',
    'contact.form.website': 'Site da Empresa',
    'contact.form.message': 'Gargalos Operacionais',
    'contact.form.submit': 'Transmitir Sinal →',
    'contact.success': 'Sinal recebido e decifrado. Nossos arquitetos estão analisando seus dados operacionais. Aguarde uma resposta em um ciclo comercial.',

    /* Proof Details */
    'proof.detail.systems': 'SISTEMAS_IMPLANTADOS',
    'proof.detail.client': 'CLIENTE',
    'proof.detail.industry': 'INDÚSTRIA',
    'status.system_ok': 'INTEGRIDADE_SISTEMA_OK',
    'proof.detail.challenge': 'DESAFIO',
    'proof.detail.strategy': 'ESTRATÉGIA',
    'proof.detail.vision': 'VISÃO',
    'proof.detail.check': 'VERIFICAÇÃO_DE_SOBERANIA',
    'proof.detail.quote': 'O sistema continua funcionando quando não estamos na sala.',
    'proof.detail.cta': 'REPLICAR RESULTADOS',
    'proof.featured': 'CASO PRIORITÁRIO',
    'final.heading': 'Protocolo de Entrada no Sistema',
    'final.subtext': 'Inicie a sequência de qualificação para determinar a compatibilidade com nossos padrões arquitetônicos.',
    'mission.statement': 'A agência morreu. Viva o sistema. Construímos arquiteturas de IA de alto desempenho para líderes que exigem soberania sobre suas operações.',
  },
} as const;

export function useTranslations(lang: Lang) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (ui[lang] as any)[key] ?? (ui[defaultLang] as any)[key] ?? key;
  };
}
