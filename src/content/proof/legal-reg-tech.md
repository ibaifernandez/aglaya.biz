---
title:
  en: "Regulatory Intelligence · Ley 21.719"
  es: "Inteligencia Regulatoria · Ley 21.719"
  pt: "Inteligência Regulatória · Lei 21.719"
client: "AGLAYA"
industry:
  en: "RegTech / Legal Compliance"
  es: "RegTech / Compliance Legal"
  pt: "RegTech / Compliance Legal"
challenge:
  en: "Chilean companies face mandatory compliance with Ley 21.719 but have no affordable way to audit their public digital exposure before hiring legal counsel."
  es: "Las empresas chilenas enfrentan el cumplimiento obligatorio de la Ley 21.719 pero no tienen una forma asequible de auditar su exposición digital pública antes de contratar asesoría legal."
  pt: "As empresas chilenas enfrentam conformidade obrigatória com a Lei 21.719, mas não têm uma forma acessível de auditar sua exposição digital pública antes de contratar consultoria jurídica."
summary:
  en: "AGLAYA built and deployed its own RegTech product: an automated scanner that visits any Chilean website, detects visible regulatory risk signals under Ley 21.719, and delivers a free structured compliance audit. No legal opinion. No manual review. A machine that sees what anyone can see — and turns it into an actionable technical report."
  es: "AGLAYA construyó y desplegó su propio producto RegTech: un scanner automatizado que visita cualquier sitio web chileno, detecta señales visibles de riesgo regulatorio bajo la Ley 21.719 y entrega una auditoría de compliance estructurada y gratuita. Sin opinión legal. Sin revisión manual. Una máquina que ve lo que cualquiera puede ver — y lo convierte en un informe técnico accionable."
  pt: "A AGLAYA construiu e implantou seu próprio produto RegTech: um scanner automatizado que visita qualquer site chileno, detecta sinais visíveis de risco regulatório sob a Lei 21.719 e entrega uma auditoria de compliance estruturada e gratuita. Sem parecer jurídico. Sem revisão manual. Uma máquina que vê o que qualquer um pode ver — e transforma isso em um relatório técnico acionável."
strategy:
  en: "Eligibility pre-flight + five-scan consensus engine + deterministic rule matrix for the compliance verdict — no LLM in scoring; Claude Haiku assists semantic-check rescue + editorial polish. Deployed on Railway + Netlify. Free diagnostic — no payment gate."
  es: "Pre-flight de elegibilidad + motor de consenso de 5 escaneos + matriz de reglas determinista para el veredicto — sin LLM en la puntuación; Claude Haiku asiste en el rescate por chequeo semántico y el pulido editorial. Desplegado en Railway + Netlify. Diagnóstico gratis — sin pasarela de pago."
  pt: "Pre-flight de elegibilidade + motor de consenso de 5 varreduras + matriz de regras determinista para o veredito — sem LLM na pontuação; Claude Haiku auxilia no resgate por verificação semântica e no polimento editorial. Implantado no Railway + Netlify. Diagnóstico grátis — sem gateway de pagamento."
vision:
  en: "Compliance intelligence that any company can access — before the lawyer, before the fine."
  es: "Inteligencia de compliance que cualquier empresa puede acceder — antes del abogado, antes de la multa."
  pt: "Inteligência de compliance que qualquer empresa pode acessar — antes do advogado, antes da multa."
solution_systems:
  - Zero-Filter Diagnostics
  - Systemic Alchemy
  - Algorithmic Sovereignty
results:
  - metric: "96%"
    label:
      en: "Reach rate in eligible Chilean domains"
      es: "Tasa de alcance en dominios chilenos elegibles"
      pt: "Taxa de alcance em domínios chilenos elegíveis"
  - metric: "100%"
    label:
      en: "Traceable evidence per audit finding"
      es: "Evidencia trazable por hallazgo de auditoría"
      pt: "Evidência rastreável por achado de auditoria"
  - metric: "$0"
    label:
      en: "Per compliance audit — no card, no registration"
      es: "Por auditoría de compliance — sin tarjeta, sin registro"
      pt: "Por auditoria de compliance — sem cartão, sem cadastro"
featured: true
date: "2026-04"
client_logo: "../src/assets/images/chile-flag-round-circle-icon.svg"
body_en: |
  ## What We Built

  Every Chilean company with a website acquired a regulatory obligation the day Ley 21.719 took effect. Most of them have no idea what that obligation looks like on their own domain — because the diagnosis costs more than they're willing to pay before they even know if there's a problem.

  AGLAYA built the machine that changes that equation. A **free compliance audit** that sees exactly what a regulator would see: the public surface. Nothing more. Nothing less.

  <img src="/infographic-legal-reg-tech.jpg" alt="Ley 21.719 — System architecture and benchmark data" style="width:100%;margin:2.5rem 0;border:1px solid rgba(255,255,255,0.08);" />

  ### Step 1 — Eligibility Pre-Flight

  The system validates URL resolution and domain state before initiating any scan. Domains with no active web presence, invalid certificates, or blocked crawl paths are filtered before compute is spent. No false positives from targets that aren't in scope. No wasted cycles. No inflated risk reports.

  ### Step 2 — Five-Scan Consensus Engine

  Each eligible domain is scanned five times independently. Results are compared and reconciled across all five passes before any alert is triggered. A signal that appears in one scan but not four others is not a finding — it's noise. The consensus engine eliminates noise at the architecture level, not the interpretation level.

  | Signal | Baseline | Optimized |
  |---|---|---|
  | Scan Completion | 49.1% | 95.2% |
  | Evidence Stability | 88.5% | 99.2% |
  | Target Reach | 96.1% | 99.2% |

  *Over panel of domains post-eligibility pre-flight.*

  ```mermaid
  flowchart TD
    A["URL input"] --> B["Eligibility pre-flight\nURL resolution · domain state"]
    B --> C["Consensus engine · 5 scans\nIndependent passes + Claude semantic-check rescue"]
    C --> D["Control matrix\nDeterministic rules · Ley 21.719 · no LLM in scoring"]
    D --> E["Regulatory alerts\nLinked to article · control · requirement"]
    E --> F["Editorial polish · Claude Haiku\nWording only — deterministic report structure"]
    F --> G["Audit report · Free\n100% traceable · Captured HTML evidence"]
  ```

  ### Step 3 — Rules First. Claude Second.

  Regulatory alerts are triggered by deterministic rule logic applied against a control matrix derived from Ley 21.719. The system does not guess. It checks. Every alert maps to a specific article, a specific control, a specific requirement — and the pass/fail logic that turns findings into alerts is a fixed, auditable matrix, with no LLM in the scoring.

  Claude Haiku assists at two points, neither of which owns the verdict. A **semantic-check rescue** re-reads the criteria the keyword pass marked as missing, cutting false negatives. An **editorial polish** refines the wording of the already-built deterministic report for the PDF. The report is not generated by an LLM — its structure and the scoring rules are deterministic; the model only sharpens detection and phrasing.

  ### Step 4 — Traceable Evidence

  Every alert is linked to the specific HTML fragment captured during the scan. The client receives the finding *and* the evidence. They can verify every item without trusting the system blindly. An audit trail built for the moment someone decides to challenge a finding.

  ## The Results

  - **96%** reach rate across eligible Chilean domains
  - **100%** traceable evidence — every finding linked to a captured HTML fragment
  - **Free** — full compliance audit, no card, no registration — before the lawyer, before the fine
  - Live in production · Free · no registration · [Run a scan →](https://ley-21719-chile.aglaya.biz/)
body_es: |
  ## Qué Construimos

  Cada empresa chilena con sitio web adquirió una obligación regulatoria el día en que entró en vigor la Ley 21.719. La mayoría no sabe cómo se ve esa obligación en su propio dominio — porque el diagnóstico cuesta más de lo que están dispuestas a pagar antes de saber siquiera si hay un problema.

  AGLAYA construyó la máquina que cambia esa ecuación. Una **auditoría de compliance gratuita** que ve exactamente lo que vería un regulador: la superficie pública. Nada más. Nada menos.

  <img src="/infographic-legal-reg-tech.jpg" alt="Ley 21.719 — Arquitectura del sistema y datos del benchmark" style="width:100%;margin:2.5rem 0;border:1px solid rgba(255,255,255,0.08);" />

  ### Paso 1 — Pre-Flight de Elegibilidad

  El sistema valida la resolución de URL y el estado del dominio antes de iniciar cualquier escaneo. Los dominios sin presencia web activa, con certificados inválidos o rutas de crawl bloqueadas se filtran antes de gastar cómputo. Ningún falso positivo de objetivos fuera de alcance. Ningún ciclo desperdiciado. Ningún informe de riesgo inflado.

  ### Paso 2 — Motor de Consenso de 5 Escaneos

  Cada dominio elegible se escanea cinco veces de forma independiente. Los resultados se comparan y reconcilian entre las cinco pasadas antes de activar cualquier alerta. Una señal que aparece en un escaneo pero no en los otros cuatro no es un hallazgo — es ruido. El motor de consenso elimina el ruido en el nivel arquitectónico, no en el de la interpretación.

  | Señal | Línea base | Optimizado |
  |---|---|---|
  | Finalización del escaneo | 49,1% | 95,2% |
  | Estabilidad de la evidencia | 88,5% | 99,2% |
  | Alcance del objetivo | 96,1% | 99,2% |

  *Sobre panel de dominios tras filtro de elegibilidad pre-flight.*

  ```mermaid
  flowchart TD
    A["URL de entrada"] --> B["Pre-flight de elegibilidad\nValidación URL · estado de dominio"]
    B --> C["Motor de consenso · 5 escaneos\nPasadas independientes + rescate por chequeo semántico (Claude)"]
    C --> D["Matriz de controles\nReglas deterministas · Ley 21.719 · sin LLM en la puntuación"]
    D --> E["Alertas regulatorias\nVinculadas a artículo · control · requisito"]
    E --> F["Pulido editorial · Claude Haiku\nSolo redacción — estructura del informe determinista"]
    F --> G["Informe de auditoría · Gratis\n100% trazable · Evidencia HTML capturada"]
  ```

  ### Paso 3 — Reglas Primero. Claude Después.

  Las alertas regulatorias se disparan mediante lógica de reglas deterministas aplicada sobre una matriz de controles derivada de la Ley 21.719. El sistema no adivina. Verifica. Cada alerta mapea a un artículo específico, un control específico, un requisito específico — y la lógica de aprobado/rechazado que convierte los hallazgos en alertas es una matriz fija y auditable, sin LLM en la puntuación.

  Claude Haiku asiste en dos puntos, y ninguno decide el veredicto. Un **rescate por chequeo semántico** vuelve a leer los criterios que el paso por palabras clave marcó como ausentes, recortando los falsos negativos. Un **pulido editorial** refina la redacción del informe determinista ya construido para el PDF. El informe no lo genera un LLM — su estructura y las reglas de puntuación son deterministas; el modelo solo afina la detección y la redacción.

  ### Paso 4 — Evidencia Trazable

  Cada alerta está vinculada al fragmento HTML específico capturado durante el escaneo. El cliente recibe el hallazgo *y* la evidencia. Puede verificar cada ítem sin confiar ciegamente en el sistema. Un rastro de auditoría construido para el momento en que alguien decida cuestionar un hallazgo.

  ## Los Resultados

  - **96%** tasa de alcance en dominios chilenos elegibles
  - **100%** evidencia trazable — cada hallazgo vinculado a un fragmento HTML capturado
  - **Gratis** — auditoría de compliance completa, sin tarjeta, sin registro — antes del abogado, antes de la multa
  - En producción · Gratis · sin registro · [Ejecutar un escaneo →](https://ley-21719-chile.aglaya.biz/)
body_pt: |
  ## O Que Construímos

  Cada empresa chilena com um site adquiriu uma obrigação regulatória no dia em que a Lei 21.719 entrou em vigor. A maioria não sabe como essa obrigação se parece em seu próprio domínio — porque o diagnóstico custa mais do que estão dispostas a pagar antes mesmo de saber se há um problema.

  A AGLAYA construiu a máquina que muda essa equação. Uma **auditoria de compliance gratuita** que vê exatamente o que um regulador veria: a superfície pública. Nada mais. Nada menos.

  <img src="/infographic-legal-reg-tech.jpg" alt="Lei 21.719 — Arquitetura do sistema e dados do benchmark" style="width:100%;margin:2.5rem 0;border:1px solid rgba(255,255,255,0.08);" />

  ### Passo 1 — Pre-Flight de Elegibilidade

  O sistema valida a resolução de URL e o estado do domínio antes de iniciar qualquer varredura. Domínios sem presença web ativa, com certificados inválidos ou caminhos de crawl bloqueados são filtrados antes de gastar processamento. Nenhum falso positivo de alvos fora de escopo. Nenhum ciclo desperdiçado. Nenhum relatório de risco inflado.

  ### Passo 2 — Motor de Consenso de 5 Varreduras

  Cada domínio elegível é varrido cinco vezes de forma independente. Os resultados são comparados e reconciliados entre as cinco passagens antes de qualquer alerta ser disparado. Um sinal que aparece em uma varredura mas não nas outras quatro não é um achado — é ruído. O motor de consenso elimina o ruído no nível arquitetônico, não no nível da interpretação.

  | Sinal | Linha de Base | Otimizado |
  |---|---|---|
  | Conclusão da Varredura | 49,1% | 95,2% |
  | Estabilidade da Evidência | 88,5% | 99,2% |
  | Alcance do Alvo | 96,1% | 99,2% |

  *Sobre painel de domínios após filtro de elegibilidade pre-flight.*

  ```mermaid
  flowchart TD
    A["URL de entrada"] --> B["Pre-flight de elegibilidade\nResolução URL · estado do domínio"]
    B --> C["Motor de consenso · 5 varreduras\nPassagens independentes + resgate por verificação semântica (Claude)"]
    C --> D["Matriz de controles\nRegras deterministas · Lei 21.719 · sem LLM na pontuação"]
    D --> E["Alertas regulatórios\nVinculados a artigo · controle · requisito"]
    E --> F["Polimento editorial · Claude Haiku\nApenas redação — estrutura do relatório determinista"]
    F --> G["Relatório de auditoria · Grátis\n100% rastreável · Evidência HTML capturada"]
  ```

  ### Passo 3 — Regras Primeiro. Claude Depois.

  Os alertas regulatórios são disparados por lógica de regras deterministas aplicada contra uma matriz de controles derivada da Lei 21.719. O sistema não adivinha. Verifica. Cada alerta mapeia para um artigo específico, um controle específico, um requisito específico — e a lógica de aprovado/reprovado que converte os achados em alertas é uma matriz fixa e auditável, sem LLM na pontuação.

  A Claude Haiku auxilia em dois pontos, e nenhum decide o veredito. Um **resgate por verificação semântica** relê os critérios que a passagem por palavras-chave marcou como ausentes, cortando falsos negativos. Um **polimento editorial** refina a redação do relatório determinista já construído para o PDF. O relatório não é gerado por um LLM — sua estrutura e as regras de pontuação são deterministas; o modelo apenas apura a detecção e a redação.

  ### Passo 4 — Evidência Rastreável

  Cada alerta está vinculado ao fragmento HTML específico capturado durante a varredura. O cliente recebe o achado *e* a evidência. Pode verificar cada item sem confiar cegamente no sistema. Uma trilha de auditoria construída para o momento em que alguém decidir questionar um achado.

  ## Os Resultados

  - **96%** taxa de alcance em domínios chilenos elegíveis
  - **100%** evidência rastreável — cada achado vinculado a um fragmento HTML capturado
  - **Grátis** — auditoria de compliance completa, sem cartão, sem cadastro — antes do advogado, antes da multa
  - Em produção · Grátis · sem cadastro · [Executar uma varredura →](https://ley-21719-chile.aglaya.biz/)
---
