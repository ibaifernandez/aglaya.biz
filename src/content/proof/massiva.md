---
title:
  en: "AGLAYA Pulse · Commercial Intelligence"
  es: "AGLAYA Pulse · Inteligencia Comercial"
  pt: "AGLAYA Pulse · Inteligência Comercial"
client: "Massiva Chile"
client_logo: "../src/assets/images/logo-massiva-cuadrado.svg"
industry:
  en: "Outdoor Advertising / OOH"
  es: "Publicidad Exterior / OOH"
  pt: "Publicidade Exterior / OOH"
challenge:
  en: "5,154 Mailchimp contacts, zero systematic criterion for prioritizing who to call. Commercial team operated on intuition, memory, and relationship age."
  es: "5.154 contactos en Mailchimp, cero criterio sistemático para priorizar a quién llamar. El equipo comercial operaba por intuición, memoria y antigüedad de la relación."
  pt: "5.154 contatos no Mailchimp, zero critério sistemático para priorizar quem ligar. A equipe comercial operava por intuição, memória e antiguidade do relacionamento."
summary:
  en: "Massiva Chile accumulated 5,154 commercial contacts in Mailchimp and a commercial team that decided who to call by intuition. The data existed. The commercial action lived in a different language. AGLAYA built Pulse: a system that translates email engagement into a daily commercial agenda with objective attribution — without manual reports."
  es: "Massiva Chile acumuló 5.154 contactos comerciales en Mailchimp y un equipo comercial que decidía a quién llamar por intuición. Los datos existían. La acción comercial vivía en otro idioma. AGLAYA construyó Pulse: un sistema que traduce el engagement de email en una agenda comercial diaria con atribución objetiva — sin reportes manuales."
  pt: "A Massiva Chile acumulou 5.154 contatos comerciais no Mailchimp e uma equipe comercial que decidia quem ligar por intuição. Os dados existiam. A ação comercial vivia em outro idioma. A AGLAYA construiu o Pulse: um sistema que traduz o engajamento de email em uma agenda comercial diária com atribuição objetiva — sem relatórios manuais."
strategy:
  en: "Mailchimp API engagement scoring (0–100) → inventory affinity classification by campaign type (Airports, Metro, Malls, OOH, Programmatic) → daily 'Today' view with priority calls + suggested pitch → 8am Santiago briefing email → one-click contact logging → ROI attribution without manual reports."
  es: "Scoring de engagement vía Mailchimp API (0–100) → clasificación de afinidad por tipo de inventario (Aeropuertos, Metro, Malls, Vía Pública, Programmatic) → vista 'Hoy' con llamadas prioritarias + pitch sugerido → briefing por email 8am Santiago → registro de contacto en un click → atribución de ROI sin reportes manuales."
  pt: "Pontuação de engajamento via Mailchimp API (0–100) → classificação de afinidade por tipo de inventário (Aeroportos, Metrô, Shoppings, OOH, Programmatic) → view 'Hoje' com chamadas prioritárias + pitch sugerido → briefing por email 8h Santiago → registro de contato em um clique → atribuição de ROI sem relatórios manuais."
vision:
  en: "Commercial intelligence with objective attribution. No manual reports, no CRM dependency, no vendor lock-in. The client owns the system — if AGLAYA disappears tomorrow, Pulse keeps running."
  es: "Inteligencia comercial con atribución objetiva. Sin reportes manuales, sin dependencia de CRM, sin vendor lock-in. El cliente es dueño del sistema — si AGLAYA desaparece mañana, Pulse sigue funcionando."
  pt: "Inteligência comercial com atribuição objetiva. Sem relatórios manuais, sem dependência de CRM, sem vendor lock-in. O cliente é dono do sistema — se a AGLAYA desaparecer amanhã, o Pulse continua funcionando."
solution_systems:
  - "Narrative Delivery"
results:
  - metric: "5,154"
    label:
      en: "Contacts scored automatically"
      es: "Contactos puntuados automáticamente"
      pt: "Contatos pontuados automaticamente"
  - metric: "Daily"
    label:
      en: "Commercial briefing · no manual reports"
      es: "Briefing comercial · sin reportes manuales"
      pt: "Briefing comercial · sem relatórios manuais"
  - metric: "Live"
    label:
      en: "In production · 2026-Q2"
      es: "En producción · 2026-Q2"
      pt: "Em produção · 2026-Q2"
featured: false
date: "2026-04"
noindex: false
body_en: |
  ## The Problem

  Massiva Chile is an outdoor advertising (OOH/DOOH) company with over 5,000 commercial contacts accumulated in Mailchimp. Their commercial team decided who to call based on intuition, memory, and relationship age.

  The data existed. The commercial action lived in a different language.

  | Symptom | Real cost |
  |---------|-----------|
  | Team opened Mailchimp but didn't know what to do with reports | Manual analysis time every Monday |
  | Leads who clicked campaigns weren't automatically prioritized | Opportunities cooling without contact |
  | Contact logs weren't recorded | Impossible to measure whether calls worked |
  | Salesforce managed deals but didn't understand email engagement | Two systems that didn't talk to each other |
  | Each inventory type (Airports, Metro, Malls, OOH…) required context | Pitch depended on salesperson remembering who saw which campaign |

  **Diagnosis:** Massiva didn't have a data problem. They had a translation problem — from the language of "email engagement" to the language of "actionable commercial agenda." Nothing in their stack made that translation automatically.

  ## The System

  AGLAYA built and installed **Pulse** — a commercial intelligence system designed specifically for Massiva's commercial team workflow.

  **1. Continuous contact scoring (0–100)**
  Each Mailchimp contact receives a score combining recent opens, historical clicks, profile completeness, and subscription status. No manual intervention required.

  **2. Inventory affinity**
  The system classifies each campaign by OOH inventory type (Airports, Metro, Malls, OOH, Programmatic, etc.) and derives which inventory interests each contact based on what they clicked.

  **3. "Today" view — the question answered every Monday**
  Each user lands on a screen with the day's priority calls: name, company, score, inventory affinity, and a suggested pitch derived from the contact's actual behavior. Without opening Mailchimp.

  **4. Daily briefing by email**
  Monday through Friday at 8:00am (Santiago time), the team receives the 3 most prioritized calls of the day in their inbox. No dashboard needed to extract value.

  **5. One-click contact logging**
  When the salesperson calls, they log the outcome in Pulse (contacted / meeting / proposal / closed / lost) in 5 seconds. One entry in a protected Postgres table.

  **6. Objective attribution — the ROI a CFO can audit**
  Pulse automatically compares the lead's score at the moment of contact against their current score. If the lead opened 3 more emails after the call, the score rises on its own — without the salesperson reporting it. That's attribution without theater.

  ## Architecture

  ```mermaid
  flowchart TD
    A["Mailchimp API\n5,154 contacts"] --> B["Pulse Engine · Flask\nScoring + Affinity"]
    C["Supabase Postgres\ncontact_log"] --> B
    D["GitHub Actions\ndaily crons"] --> B
    B --> E["Dashboard · Today View"]
    B --> F["Daily briefing · Resend\n8am Santiago"]
    B --> G["ROI Report"]
  ```

  Stack: **Flask · Mailchimp API v3 · Supabase Postgres · Resend · GitHub Actions**
  Deploy: Railway · TLS/CDN via Cloudflare · Magic-link auth via Supabase OTP

  **Operational sovereignty:** Massiva owns the system. The code lives in the client's repo. No vendor lock-in with AGLAYA — if AGLAYA disappears tomorrow, Pulse keeps running.

  ## Results

  Pulse has been in production since Q2 2026. Attribution is measured in real-time from the first logged contact.

  What the system measures automatically, every week:

  - **Pulse Lift:** net score points generated by the commercial team
  - **Leads crossing "hot" threshold** (score ≥70 after contact)
  - **Outcome breakdown:** meetings scheduled, proposals sent, closed, lost
  - **Top movers:** the 5 leads with the highest score change

  Specific metrics for the current period are available on demand — they are sensitive commercial data shared in sales conversations where the context justifies it.

  > *"The difference is that now we don't have to ask the team to update a spreadsheet to know if the call moved the needle. The lead's behavior says it on its own."*
  > — [Testimonial pending · Talía Toledo, Massiva Chile]

  ## The System Live

  Pulse for Massiva is accessible at [**pulse.aglaya.biz**](https://pulse.aglaya.biz/).

  It's a restricted-access system for Massiva's commercial team. To see a live walkthrough during a conversation with AGLAYA, [book a ROI Audit](/roi-audit/).

  ## Does Your Company Have This Same Problem?

  If your commercial team is:

  - Looking at email marketing reports without knowing what to do with them
  - Calling leads by intuition instead of evidence
  - Paying a CRM that doesn't understand your specific vertical
  - Unable to show the CFO that the team is moving the portfolio

  Then the system we built for Massiva likely fits your vertical. The difference is a configuration file, not a rewrite.

  [**Start with a ROI Audit →**](/roi-audit/)
body_es: |
  ## El problema operacional

  Massiva Chile es una empresa de publicidad exterior (OOH/DOOH) con más de 5.000 contactos comerciales acumulados en Mailchimp. El equipo comercial decidía a quién llamar por intuición, memoria y antigüedad de la relación.

  Los datos existían. La acción comercial vivía en otro idioma.

  | Síntoma | Coste real |
  |---------|-----------|
  | El equipo abría Mailchimp pero no sabía qué hacer con los reportes | Tiempo de análisis manual cada lunes |
  | Los leads que clicaban campañas no se priorizaban automáticamente | Oportunidades enfriándose sin contacto |
  | Los contactos al equipo comercial no quedaban registrados | Imposible medir si las llamadas funcionaban |
  | Salesforce gestionaba deals, pero no entendía el engagement de email | Dos sistemas que no se hablaban entre sí |
  | Cada inventario (Aeropuertos, Metro, Malls, Vía Pública…) requería contexto | El pitch dependía del vendedor recordando qué campaña vio quién |

  **Diagnóstico:** Massiva no tenía un problema de datos. Tenía un problema de traducción — del idioma "engagement de email" al idioma "agenda comercial accionable". Ninguna herramienta del stack hacía esa traducción automáticamente.

  ## El sistema instalado

  AGLAYA construyó e instaló **Pulse** — un sistema de inteligencia comercial diseñado específicamente para el flujo de trabajo del equipo comercial de Massiva.

  **1. Scoring continuo de contactos (0–100)**
  Cada contacto en Mailchimp recibe una puntuación que combina aperturas recientes, clics históricos, completitud del perfil y estado de suscripción. Sin intervención manual del equipo.

  **2. Afinidad por tipo de inventario**
  El sistema clasifica cada campaña por tipo de inventario OOH (Aeropuertos, Metro, Malls, Vía Pública, Programmatic, etc.) y deriva qué inventario interesa más a cada contacto en función de qué clicó.

  **3. Vista "Hoy" — la pregunta resuelta cada lunes**
  Cada usuario aterriza en una pantalla con las llamadas prioritarias del día: nombre, empresa, score, afinidad y un pitch sugerido derivado del comportamiento real del contacto. Sin abrir Mailchimp.

  **4. Briefing diario por email**
  De lunes a viernes a las 8:00 (hora de Santiago), el equipo recibe en su inbox las 3 llamadas más prioritarias del día. No requiere abrir el dashboard para obtener el valor.

  **5. Registro de contacto con un click**
  Cuando el vendedor llama, registra el outcome en Pulse (contactado / reunión / propuesta / cerrada / perdida) en 5 segundos. Una entrada en una tabla Postgres protegida.

  **6. Atribución objetiva — el ROI que un CFO puede auditar**
  Pulse compara automáticamente el score del lead en el momento del contacto contra su score actual. Si el lead abrió 3 emails más después de la llamada, el score sube solo — sin que el vendedor lo reporte. Eso es atribución sin teatro.

  ## Arquitectura

  ```mermaid
  flowchart TD
    A["Mailchimp API\n5.154 contactos"] --> B["Pulse Engine · Flask\nScoring + Afinidad"]
    C["Supabase Postgres\ncontact_log"] --> B
    D["GitHub Actions\ncrons diarios"] --> B
    B --> E["Dashboard · Vista Hoy"]
    B --> F["Briefing diario · Resend\n8am Santiago"]
    B --> G["Reporte ROI"]
  ```

  Stack: **Flask · Mailchimp API v3 · Supabase Postgres · Resend · GitHub Actions**
  Deploy: Railway · TLS/CDN via Cloudflare · Auth magic-link via Supabase OTP

  **Soberanía operacional:** Massiva es dueño del sistema. El código vive en el repo del cliente. No hay vendor lock-in con AGLAYA — si AGLAYA desaparece mañana, Pulse sigue funcionando.

  ## Resultados

  Pulse lleva en producción desde el segundo trimestre de 2026. La atribución se mide en tiempo real desde el primer contacto registrado.

  Lo que mide el sistema, automáticamente, cada semana:

  - **Pulse Lift:** puntos de score netos generados por el equipo
  - **Leads cruzando umbral de caliente** (score ≥70 tras el contacto)
  - **Outcome breakdown:** reuniones agendadas, propuestas enviadas, cerradas, perdidas
  - **Top movers individuales:** los 5 leads con mayor cambio de score

  Los números específicos del periodo en curso están disponibles bajo demanda — son datos comerciales sensibles del cliente y se comparten en conversaciones de venta donde el contexto lo justifica.

  > *"La diferencia es que ahora no tenemos que pedirle al equipo que actualice una hoja de cálculo para saber si la llamada movió la aguja. El comportamiento del lead lo dice solo."*
  > — [Testimonial pendiente · Talía Toledo, Massiva Chile]

  ## El sistema en vivo

  Pulse para Massiva está accesible en [**pulse.aglaya.biz**](https://pulse.aglaya.biz/).

  Es un sistema de uso restringido para el equipo comercial de Massiva. Si quieres ver un walk-through en vivo durante una conversación con AGLAYA, [reserva un ROI Audit](/es/roi-audit/).

  ## ¿Tu empresa tiene este mismo problema?

  Si tu equipo comercial está:

  - Mirando reportes de email marketing sin saber qué hacer con ellos
  - Llamando a leads por intuición en lugar de por evidencia
  - Pagando un CRM que no entiende tu vertical específico
  - Sin manera de demostrarle al CFO que el equipo está moviendo cartera

  Entonces el sistema que construimos para Massiva probablemente encaja con su variación para tu vertical. La diferencia es un archivo de configuración, no una reescritura.

  [**Empezar con un ROI Audit →**](/es/roi-audit/)
body_pt: |
  ## O problema operacional

  A Massiva Chile é uma empresa de publicidade exterior (OOH/DOOH) com mais de 5.000 contatos comerciais acumulados no Mailchimp. A equipe comercial decidia quem ligar por intuição, memória e antiguidade do relacionamento.

  Os dados existiam. A ação comercial vivia em outro idioma.

  | Sintoma | Custo real |
  |---------|-----------|
  | A equipe abria o Mailchimp mas não sabia o que fazer com os relatórios | Tempo de análise manual toda segunda-feira |
  | Leads que clicavam em campanhas não eram priorizados automaticamente | Oportunidades esfriando sem contato |
  | Os contatos da equipe comercial não ficavam registrados | Impossível medir se as ligações funcionavam |
  | O Salesforce gerenciava deals, mas não entendia o engajamento de email | Dois sistemas que não se falavam |
  | Cada inventário (Aeroportos, Metrô, Shoppings, OOH…) exigia contexto | O pitch dependia do vendedor lembrar qual campanha quem viu |

  **Diagnóstico:** A Massiva não tinha um problema de dados. Tinha um problema de tradução — do idioma "engajamento de email" para o idioma "agenda comercial acionável". Nenhuma ferramenta do stack fazia essa tradução automaticamente.

  ## O sistema instalado

  A AGLAYA construiu e instalou o **Pulse** — um sistema de inteligência comercial projetado especificamente para o fluxo de trabalho da equipe comercial da Massiva.

  **1. Pontuação contínua de contatos (0–100)**
  Cada contato no Mailchimp recebe uma pontuação que combina aberturas recentes, cliques históricos, completude do perfil e status de inscrição. Sem intervenção manual da equipe.

  **2. Afinidade por tipo de inventário**
  O sistema classifica cada campanha por tipo de inventário OOH (Aeroportos, Metrô, Shoppings, OOH, Programmatic, etc.) e deriva qual inventário interessa mais a cada contato com base no que clicou.

  **3. View "Hoje" — a pergunta respondida toda segunda-feira**
  Cada usuário chega a uma tela com as ligações prioritárias do dia: nome, empresa, score, afinidade e um pitch sugerido derivado do comportamento real do contato. Sem abrir o Mailchimp.

  **4. Briefing diário por email**
  De segunda a sexta às 8h (horário de Santiago), a equipe recebe na caixa de entrada as 3 ligações mais prioritárias do dia. Não é necessário abrir o dashboard para extrair valor.

  **5. Registro de contato em um clique**
  Quando o vendedor liga, registra o resultado no Pulse (contatado / reunião / proposta / fechado / perdido) em 5 segundos. Uma entrada em uma tabela Postgres protegida.

  **6. Atribuição objetiva — o ROI que um CFO pode auditar**
  O Pulse compara automaticamente o score do lead no momento do contato com seu score atual. Se o lead abriu 3 emails a mais depois da ligação, o score sobe sozinho — sem que o vendedor reporte. Isso é atribuição sem teatro.

  ## Arquitetura

  ```mermaid
  flowchart TD
    A["Mailchimp API\n5.154 contatos"] --> B["Pulse Engine · Flask\nPontuação + Afinidade"]
    C["Supabase Postgres\ncontact_log"] --> B
    D["GitHub Actions\ncrons diários"] --> B
    B --> E["Dashboard · View Hoje"]
    B --> F["Briefing diário · Resend\n8h Santiago"]
    B --> G["Relatório ROI"]
  ```

  Stack: **Flask · Mailchimp API v3 · Supabase Postgres · Resend · GitHub Actions**
  Deploy: Railway · TLS/CDN via Cloudflare · Auth magic-link via Supabase OTP

  **Soberania operacional:** A Massiva é dona do sistema. O código vive no repositório do cliente. Sem vendor lock-in com a AGLAYA — se a AGLAYA desaparecer amanhã, o Pulse continua funcionando.

  ## Resultados

  O Pulse está em produção desde o segundo trimestre de 2026. A atribuição é medida em tempo real desde o primeiro contato registrado.

  O que o sistema mede automaticamente, toda semana:

  - **Pulse Lift:** pontos de score líquidos gerados pela equipe
  - **Leads cruzando o limiar de "quente"** (score ≥70 após o contato)
  - **Breakdown de resultados:** reuniões agendadas, propostas enviadas, fechados, perdidos
  - **Top movers individuais:** os 5 leads com maior variação de score

  Os números específicos do período em curso estão disponíveis sob demanda — são dados comerciais sensíveis do cliente compartilhados em conversas de venda onde o contexto justifica.

  > *"A diferença é que agora não precisamos pedir à equipe para atualizar uma planilha para saber se a ligação moveu a agulha. O comportamento do lead diz por si só."*
  > — [Depoimento pendente · Talía Toledo, Massiva Chile]

  ## O sistema ao vivo

  O Pulse para Massiva está acessível em [**pulse.aglaya.biz**](https://pulse.aglaya.biz/).

  É um sistema de acesso restrito para a equipe comercial da Massiva. Para ver um walk-through ao vivo durante uma conversa com a AGLAYA, [reserve um ROI Audit](/pt/roi-audit/).

  ## Sua empresa tem o mesmo problema?

  Se sua equipe comercial está:

  - Olhando relatórios de email marketing sem saber o que fazer com eles
  - Ligando para leads por intuição em vez de evidência
  - Pagando um CRM que não entende seu vertical específico
  - Sem como mostrar ao CFO que a equipe está movimentando a carteira

  Então o sistema que construímos para a Massiva provavelmente se adapta ao seu vertical. A diferença é um arquivo de configuração, não uma reescrita.

  [**Começar com um ROI Audit →**](/pt/roi-audit/)
---
