---
title:
  en: "AGLAYA Outreach · Zero-Budget Precision"
  es: "AGLAYA Outreach · Precisión con Presupuesto Cero"
  pt: "AGLAYA Outreach · Precisão com Orçamento Zero"
client: "Bill Capital"
industry:
  en: "Fintech / Factoring"
  es: "Fintech / Factoring"
  pt: "Fintech / Factoring"
challenge:
  en: "1,155 raw records, no segmentation, no strategy. Build an acquisition campaign from scratch — with zero budget on external tools."
  es: "1.155 registros en bruto, sin segmentación, sin estrategia. Construir una campaña de adquisición desde cero — con presupuesto cero en herramientas externas."
  pt: "1.155 registros brutos, sem segmentação, sem estratégia. Construir uma campanha de aquisição do zero — com orçamento zero em ferramentas externas."
summary:
  en: "AGLAYA Outreach turns raw contact databases into precision acquisition campaigns. For Bill Capital's first MIC acquisition drive, AGLAYA deployed a proprietary BBDD Cleaner, Python-based AI scoring with no external APIs, and produced 4 segmented campaigns, 11 emails, and 4 HubSpot automation flows — at zero external tool cost. The second client costs a tenth of the first."
  es: "AGLAYA Outreach convierte bases de datos crudas en campañas de adquisición de precisión. En la primera campaña de captación de MICs de Bill Capital, AGLAYA desplegó un BBDD Cleaner propio, scoring IA en Python sin APIs externas, y produjo 4 campañas segmentadas, 11 emails y 4 flujos HubSpot — con coste cero en herramientas externas. El segundo cliente cuesta una décima parte del primero."
  pt: "AGLAYA Outreach converte bancos de dados brutos em campanhas de aquisição de precisão. Na primeira campanha de captação de MICs da Bill Capital, a AGLAYA implementou um BBDD Cleaner proprietário, scoring IA em Python sem APIs externas, e produziu 4 campanhas segmentadas, 11 emails e 4 fluxos HubSpot — com custo zero em ferramentas externas. O segundo cliente custa um décimo do primeiro."
strategy:
  en: "Proprietary BBDD Cleaner (duplicate detection + DNS validation) → Python AI classifier (function, seniority, company type, MIC score A/B/C/D) → 4 campaign segments → 11 emails + pre-headers → 4 HubSpot automation flows."
  es: "BBDD Cleaner propio (detección de duplicados + validación DNS) → clasificador IA en Python (función, seniority, tipo de empresa, score MIC A/B/C/D) → 4 segmentos de campaña → 11 emails + pre-headers → 4 flujos de automatización HubSpot."
  pt: "BBDD Cleaner proprietário (detecção de duplicatas + validação DNS) → classificador IA em Python (função, seniority, tipo de empresa, score MIC A/B/C/D) → 4 segmentos de campanha → 11 emails + pré-headers → 4 fluxos de automação HubSpot."
vision:
  en: "Enterprise intelligence pipeline — no external APIs, no SaaS spend, full data sovereignty."
  es: "Pipeline de inteligencia enterprise — sin APIs externas, sin gasto en SaaS, soberanía total de datos."
  pt: "Pipeline de inteligência enterprise — sem APIs externas, sem gasto em SaaS, soberania total dos dados."
solution_systems:
  - Zero-Filter Diagnostics
  - Algorithmic Sovereignty
results:
  - metric: "$0"
    label:
      en: "Budget on external tools"
      es: "Presupuesto en herramientas externas"
      pt: "Orçamento em ferramentas externas"
  - metric: "838"
    label:
      en: "Actionable contacts from 1,155 raw"
      es: "Contactos accionables desde 1.155 en bruto"
      pt: "Contatos acionáveis de 1.155 brutos"
  - metric: "11"
    label:
      en: "Emails · 4 HubSpot automation flows"
      es: "Emails · 4 flujos de automatización HubSpot"
      pt: "Emails · 4 fluxos de automação HubSpot"
featured: false
date: "2026-02"
client_logo: "../src/assets/images/logo-bill-capital.png"
heroImage: "/bill-capital/preview.jpeg"
body_en: |
  ## What We Built

  Bill Capital needed to convert financial executives into MICs (Micro Commercial Investors) — professionals who operate factoring using Bill Capital's platform and capital, building their own client portfolio and earning direct commission per closed deal.

  They delivered 1,155 raw contacts. No segmentation. No context. No strategy. External tools budget: **$0**.

  ```mermaid
  flowchart TD
    A["1,155 raw records"] --> B["BBDD Cleaner\n−314 duplicates · −1 syntax · −2 DNS"]
    B --> C["838 valid contacts"]
    C --> D["AI Classification · Python\nScore A / B / C / D"]
    D --> E1["326 · Score A\nIndependent factoring"] & E2["246 · Score B\nCommercial banking"] & E3["142 · Score C\nOps & risk"] & E4["124 · Score D\nReferral channel"]
  ```

  ### Step 1 — Database Audit (Proprietary BBDD Cleaner)

  Before writing a single line of copy, the raw database went through a proprietary audit tool:

  - **314 duplicates** eliminated (by email and by name + company)
  - **1 syntax error** corrected
  - **2 domains with invalid DNS** removed (no active mail server)
  - **Output:** 838 actionable contacts in clean UTF-8, plus a full audit report

  ### Step 2 — The Central Insight

  A frequency analysis of job titles changed the entire campaign direction: **85% of the database were active factoring professionals**. They already knew the product. They already sold it. They already had client portfolios.

  This made any educational pitch useless and condescending. The argument became something else entirely: **economic independence**. *"You already have the hardest part. You just need to keep what you produce."*

  ### Step 3 — AI Classification (Python · $0 in external APIs)

  Each contact was classified across 5 dimensions with no paid external API:

  | Score | Profile | Logic |
  |---|---|---|
  | **A** | Independent factoring exec | Already sells factoring. Already has a portfolio. Zero knowledge gap — just needs the decision. |
  | **B** | Commercial banking exec | Institutional knowledge, high potential, friction from corporate culture. |
  | **C** | Operations & risk | Technical depth that's commercially undervalued. The least obvious, most interesting segment. |
  | **D** | Adjacent (legal, tech, admin) | Not a candidate. A referral channel. 30 seconds to ask for a name. |

  ### Step 4 — Campaign Architecture

  - **4 segments** · 4 distinct arguments · 4 emotional registers
  - **11 emails** with individual pre-headers optimized for open rate
  - **Progressive spacing** per segment — matched to each profile's decision velocity
  - **4 HubSpot automation flows** ready to activate
  - **1 dedicated sub-campaign** for Primus Capital Chile: 51 Score A contacts in the same company, addressed with their employer named in the subject line

  ### Step 5 — Interactive Showcase

  A self-contained HTML showcase (~225KB) generated by a proprietary Python script: animated KPI counters, filterable database of all 838 contacts, Chart.js analytics, top-10 company concentration chart, full HubSpot email copies, and methodology walkthrough. Plus a native 11-page PDF report (~127KB) generated via reportlab, downloadable directly from the showcase.

  ## The Results

  A precision acquisition campaign built from raw data in one working day, with zero spend on external tools. Full data sovereignty — the entire classified dataset belongs to the client. A system that can be replicated for any similar campaign.

  [View client showcase →](/bill-capital/)
body_es: |
  ## Qué Construimos

  Bill Capital necesitaba convertir ejecutivos financieros en MICs (Micro Inversores Comerciales) — profesionales que operan factoring usando la plataforma y el capital de Bill Capital, construyendo su propia cartera de clientes y ganando comisión directa por cada operación cerrada.

  Entregaron 1.155 contactos en bruto. Sin segmentación. Sin contexto. Sin estrategia. Presupuesto en herramientas externas: **$0**.

  ```mermaid
  flowchart TD
    A["1.155 registros brutos"] --> B["BBDD Cleaner\n−314 duplicados · −1 sintaxis · −2 DNS"]
    B --> C["838 contactos válidos"]
    C --> D["Clasificación IA · Python\nScore A / B / C / D"]
    D --> E1["326 · Score A\nFactoring independiente"] & E2["246 · Score B\nBanca comercial"] & E3["142 · Score C\nOperaciones y riesgo"] & E4["124 · Score D\nCanal referidos"]
  ```

  ### Paso 1 — Auditoría de la Base de Datos (BBDD Cleaner propio)

  Antes de escribir una sola línea de copy, la base cruda pasó por una herramienta de auditoría propia:

  - **314 duplicados** eliminados (por email y por nombre + empresa)
  - **1 error de sintaxis** corregido
  - **2 dominios con DNS inválido** eliminados (sin servidor de correo activo)
  - **Output:** 838 contactos accionables en UTF-8 limpio, más un informe completo de auditoría

  ### Paso 2 — El Insight Central

  Un análisis de frecuencia de cargos cambió toda la dirección de la campaña: **el 85% de la base eran profesionales activos del factoring**. Ya conocían el producto. Ya lo vendían. Ya tenían cartera de clientes.

  Eso hacía inútil y condescendiente cualquier pitch educativo. El argumento se convirtió en otra cosa: **independencia económica**. *"Ya tienes lo más difícil. Te falta quedarte con lo que produces."*

  ### Paso 3 — Clasificación con IA (Python · $0 en APIs externas)

  Cada contacto fue clasificado en 5 dimensiones sin API externa de pago:

  | Score | Perfil | Lógica |
  |---|---|---|
  | **A** | Ejecutivo en factoring independiente | Ya vende factoring. Ya tiene cartera. Cero brecha de conocimiento — solo necesita la decisión. |
  | **B** | Ejecutivo en banca comercial | Conocimiento institucional, alto potencial, fricción de cultura corporativa. |
  | **C** | Operaciones y riesgo | Profundidad técnica comercialmente infravalorada. El segmento menos obvio y más interesante. |
  | **D** | Perfil adyacente (legal, tech, admin) | No es candidato. Es canal de referidos. 30 segundos para pedir un nombre. |

  ### Paso 4 — Arquitectura de Campaña

  - **4 segmentos** · 4 argumentos distintos · 4 registros emocionales
  - **11 emails** con pre-headers individuales optimizados para open rate
  - **Espaciado progresivo** por segmento — ajustado a la velocidad de decisión de cada perfil
  - **4 flujos de automatización HubSpot** listos para activar
  - **1 sub-campaña dedicada** para Primus Capital Chile: 51 contactos Score A en la misma empresa, con el nombre del empleador en el asunto

  ### Paso 5 — Showcase Interactivo

  Un showcase HTML autocontenido (~225KB) generado por un script Python propio: contadores KPI animados, base de datos filtrable de los 838 contactos, analytics Chart.js, gráfico de concentración por empresa Top 10, copies completos de los emails HubSpot y walkthrough de metodología. Más un PDF nativo de 11 páginas (~127KB) generado con reportlab, descargable directamente desde el showcase.

  ## Los Resultados

  Una campaña de adquisición de precisión construida desde datos en bruto en un día de trabajo, con cero gasto en herramientas externas. Soberanía total de datos — el dataset clasificado completo pertenece al cliente. Un sistema replicable para cualquier campaña similar.

  [Ver showcase de cliente →](/bill-capital/)
body_pt: |
  ## O Que Construímos

  A Bill Capital precisava converter executivos financeiros em MICs (Micro Investidores Comerciais) — profissionais que operam factoring usando a plataforma e o capital da Bill Capital, construindo sua própria carteira de clientes e ganhando comissão direta por operação fechada.

  Entregaram 1.155 contatos brutos. Sem segmentação. Sem contexto. Sem estratégia. Orçamento em ferramentas externas: **$0**.

  ```mermaid
  flowchart TD
    A["1.155 registros brutos"] --> B["BBDD Cleaner\n−314 duplicatas · −1 sintaxe · −2 DNS"]
    B --> C["838 contatos válidos"]
    C --> D["Classificação IA · Python\nScore A / B / C / D"]
    D --> E1["326 · Score A\nFactoring independente"] & E2["246 · Score B\nBanca comercial"] & E3["142 · Score C\nOperações e risco"] & E4["124 · Score D\nCanal de indicações"]
  ```

  ### Passo 1 — Auditoria do Banco de Dados (BBDD Cleaner proprietário)

  Antes de escrever uma única linha de copy, o banco bruto passou por uma ferramenta de auditoria proprietária:

  - **314 duplicatas** eliminadas (por email e por nome + empresa)
  - **1 erro de sintaxe** corrigido
  - **2 domínios com DNS inválido** removidos (sem servidor de e-mail ativo)
  - **Output:** 838 contatos acionáveis em UTF-8 limpo, mais um relatório completo de auditoria

  ### Passo 2 — O Insight Central

  Uma análise de frequência de cargos mudou toda a direção da campanha: **85% do banco eram profissionais ativos de factoring**. Já conheciam o produto. Já o vendiam. Já tinham carteira de clientes.

  Isso tornava qualquer pitch educacional inútil e condescendente. O argumento se tornou outra coisa: **independência econômica**. *"Você já tem a parte mais difícil. Falta ficar com o que você produz."*

  ### Passo 3 — Classificação com IA (Python · $0 em APIs externas)

  Cada contato foi classificado em 5 dimensões sem API externa paga:

  | Score | Perfil | Lógica |
  |---|---|---|
  | **A** | Executivo em factoring independente | Já vende factoring. Já tem carteira. Zero lacuna de conhecimento — só precisa da decisão. |
  | **B** | Executivo em banco comercial | Conhecimento institucional, alto potencial, fricção de cultura corporativa. |
  | **C** | Operações e risco | Profundidade técnica comercialmente subvalorizada. O segmento menos óbvio e mais interessante. |
  | **D** | Perfil adjacente (jurídico, tech, admin) | Não é candidato. É canal de indicação. 30 segundos para pedir um nome. |

  ### Passo 4 — Arquitetura de Campanha

  - **4 segmentos** · 4 argumentos distintos · 4 registros emocionais
  - **11 emails** com pré-headers individuais otimizados para open rate
  - **Espaçamento progressivo** por segmento — ajustado à velocidade de decisão de cada perfil
  - **4 fluxos de automação HubSpot** prontos para ativar
  - **1 sub-campanha dedicada** para Primus Capital Chile: 51 contatos Score A na mesma empresa, com o nome do empregador no assunto

  ### Passo 5 — Showcase Interativo

  Um showcase HTML autocontido (~225KB) gerado por um script Python proprietário: contadores KPI animados, banco de dados filtrável dos 838 contatos, analytics Chart.js, gráfico de concentração por empresa Top 10, copies completos dos emails HubSpot e walkthrough de metodologia. Mais um PDF nativo de 11 páginas (~127KB) gerado com reportlab, baixável diretamente do showcase.

  ## Os Resultados

  Uma campanha de aquisição de precisão construída a partir de dados brutos em um dia de trabalho, com gasto zero em ferramentas externas. Soberania total de dados — o dataset classificado completo pertence ao cliente. Um sistema replicável para qualquer campanha similar.

  [Ver showcase do cliente →](/bill-capital/)
---
