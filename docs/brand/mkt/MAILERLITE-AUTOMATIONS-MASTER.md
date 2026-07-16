---
status: active
domain: marketing
owner: marketing
source_of_truth: true
supersedes: [DISPATCH-ENTRY-PROTOCOL-v2.md]
superseded_by: []
last_reviewed: 2026-07-15
consumable_by_agents: true
---

# MAILERLITE AUTOMATIONS — MASTER DOCUMENT

> Fuente de verdad única para todas las automations de MailerLite de AGLAYA.
> Incluye arquitectura, configuración exacta en UI e íntegro del contenido de cada correo.

---

## ARQUITECTURA GLOBAL

### Grupos → Automations

| Grupo MailerLite | Quién entra | Automation | Emails |
|---|---|---|---|
| SUSCRIPCIONES | Footer dispatch signup | Dispatch Entry Protocol | 4 (Day 0/2/5/9) |
| CUALIFICADOS | Contact form — ICP qualified | Contacto Cualificado | 1 (inmediato) |
| BORDERLINE | Contact form — ICP borderline | Contacto Borderline | 1 (inmediato) |
| NO_CUALIFICADOS | Contact form — open channel / blocked | Contacto No Cualificado | 1 (inmediato) |
| COTIZACIONES | Quote calculator | Cotización Recibida | 1 (inmediato) |
| CONTACTO (general) | Simple `/contact` — `GENERAL_LEAD` | Variante Contacto General (Email 0) | 1 (inmediato) |

> **Nota (2026-07-15):** el formulario simple `/contact` postea `inquiry_type=GENERAL_LEAD`, que `contact.ts` enruta vía `getGeneralContactGroupId()` → `MAILERLITE_CONTACTO_GROUP_ID` (grupo distinto de CUALIFICADOS). Si esa env-var no está seteada, esos leads **no** reciben email de MailerLite (el grupo filtra a vacío).

### Custom fields en uso

| Campo | Tipo | Valores | Quién lo setea |
|---|---|---|---|
| `language` | text | `en` / `es` / `pt` | `_mailerlite.ts` en todos los upserts |
| `entry_point` | text | `dispatch_footer`, `roi_audit`, `quote_calculator`, etc. | `_mailerlite.ts` en todos los upserts |
| `service_interest` | text | `roi_audit`, `landing`, `corporate`, `product`, `ecommerce`, etc. | `_mailerlite.ts` en todos los upserts |
| `onboarding_active` | number | `1` / `0` | Automation SUSCRIPCIONES (set/reset) |

### FROM en todos los correos

- **From name:** AGLAYA
- **From email:** info@aglaya.biz

### Nota arquitectónica
Con la migración de mayo 2026, Resend ya no envía correos a usuarios finales. MailerLite gestiona 100% de las comunicaciones con suscriptores. Resend queda exclusivamente para notificaciones internas a NOTIFY_EMAIL.

---

## AUTOMATION 1 — DISPATCH ENTRY PROTOCOL

**Trigger:** Subscriber joins group → SUSCRIPCIONES
**Nombre en MailerLite:** `Dispatch Entry Protocol`

### Flujo de configuración

```
[TRIGGER] Joins group: SUSCRIPCIONES
    ↓
[ACTION] Update field: onboarding_active = 1
    ↓
[EMAIL] Email 0 — inmediato
    ↓ branch por campo language
    ├─ language = en → Email 0 EN
    ├─ language = es → Email 0 ES
    └─ language = pt → Email 0 PT
    ↓
[WAIT] 2 days
    ↓
[EMAIL] Email 1
    ↓ branch por campo language
    ├─ language = en → Email 1 EN
    ├─ language = es → Email 1 ES
    └─ language = pt → Email 1 PT
    ↓
[WAIT] 3 days  (total: Day 5 desde suscripción)
    ↓
[EMAIL] Email 2
    ↓ branch por campo language
    ├─ language = en → Email 2 EN
    ├─ language = es → Email 2 ES
    └─ language = pt → Email 2 PT
    ↓
[WAIT] 4 days  (total: Day 9 desde suscripción)
    ↓
[EMAIL] Email 3
    ↓ branch por campo language
    ├─ language = en → Email 3 EN
    ├─ language = es → Email 3 ES
    └─ language = pt → Email 3 PT
    ↓
[ACTION] Update field: onboarding_active = 0
    ↓
[END]
```

### Exclusion rule (para envíos manuales del Dispatch)
En cualquier campaña manual de Dispatch: excluir el segmento **«En entrada»** (donde `onboarding_active = 1`).

---

### EMAIL 0 — Day 0 (inmediato al subscribirse)

**Purpose:** Confirmar suscripción. Establecer expectativas sobre qué es el Dispatch y qué viene.

---

#### EN

**Subject:** You're in.
**Preheader:** Signal confirmed. Three more messages coming over the next nine days.

---

The AGLAYA Dispatch.

No editorial calendar. No content for content's sake. No weekly performance theatre.

Only documented systems, field observations, and case breakdowns with real numbers.

When there's something worth saying, it lands here.

Over the next nine days, you'll receive three more messages. They're part of the same sequence. Read them in order.

After that: only when there's signal.

AGLAYA

---

#### ES

**Asunto:** Ya estás dentro.
**Preheader:** Señal confirmada. Tres mensajes más en los próximos nueve días.

---

El AGLAYA Dispatch.

Sin calendario editorial. Sin contenido por contenido. Sin teatro de performance semanal.

Solo sistemas documentados, observaciones de campo y análisis de casos con números reales.

Cuando hay algo que vale la pena decir, llega aquí.

En los próximos nueve días recibirás tres mensajes más. Son parte de la misma secuencia. Léelos en orden.

Después de eso: solo cuando haya señal.

AGLAYA

---

#### PT

**Assunto:** Você está dentro.
**Preheader:** Sinal confirmado. Mais três mensagens nos próximos nove dias.

---

O AGLAYA Dispatch.

Sem calendário editorial. Sem conteúdo pelo conteúdo. Sem teatro de performance semanal.

Apenas sistemas documentados, observações de campo e análises de casos com números reais.

Quando há algo que vale a pena dizer, chega aqui.

Nos próximos nove dias você receberá mais três mensagens. Elas fazem parte da mesma sequência. Leia-as em ordem.

Depois disso: apenas quando houver sinal.

AGLAYA

---

### EMAIL 1 — Day 2

**Purpose:** Establecer el marco intelectual. Qué es AGLAYA, qué no es, por qué existe el Dispatch.

#### EN

**Subject:** The agency model has a design flaw.
**Preheader:** Most agencies are built to produce. Not to last.

Most agencies are built to produce.

Deliverables. Campaigns. Reports. Hours invoiced. Projects closed.

What they're not built to produce: systems that operate after the invoice is paid.

You hire an agency. They build something. They leave. You're responsible for keeping it alive. That's not a service model. That's a rental with extra steps.

AGLAYA was built around a different architectural premise.

We don't produce outputs. We build infrastructure — systems that absorb manual work, execute narrative, and convert operational truth into measurable output without constant supervision.

When we leave an engagement, the system stays. That's the design principle. The only design principle that matters.

The Dispatch exists because the frameworks behind this model deserve to live outside of client work. You'll see them here: documented systems, field observations, case breakdowns with real numbers.

No editorial calendar. No content for content's sake.

Only when there's something worth saying.

AGLAYA

---

#### ES

**Asunto:** El modelo de agencia tiene un fallo de diseño.
**Preheader:** La mayoría de las agencias están construidas para producir. No para durar.

La mayoría de las agencias están construidas para producir.

Entregables. Campañas. Informes. Horas facturadas. Proyectos cerrados.

Lo que no están construidas para producir: sistemas que funcionen después de que se pague la factura.

Contratas una agencia. Construyen algo. Se van. Tú eres responsable de mantenerlo con vida. Eso no es un modelo de servicio. Es un alquiler con pasos adicionales.

AGLAYA se construyó sobre una premisa arquitectónica diferente.

No producimos outputs. Construimos infraestructura — sistemas que absorben trabajo manual, ejecutan narrativa y convierten verdad operativa en output medible sin supervisión constante.

Cuando salimos de un proyecto, el sistema se queda. Ese es el principio de diseño. El único principio de diseño que importa.

El Dispatch existe porque los frameworks detrás de este modelo merecen vivir fuera del trabajo de cliente. Los verás aquí: sistemas documentados, observaciones de campo, análisis de casos con números reales.

Sin calendario editorial. Sin contenido por contenido.

Solo cuando hay algo que vale la pena decir.

AGLAYA

---

#### PT

**Assunto:** O modelo de agência tem uma falha de design.
**Preheader:** A maioria das agências é construída para produzir. Não para durar.

A maioria das agências é construída para produzir.

Entregáveis. Campanhas. Relatórios. Horas faturadas. Projetos fechados.

O que elas não são construídas para produzir: sistemas que operam depois que a fatura é paga.

Você contrata uma agência. Eles constroem algo. Eles vão embora. Você é responsável por manter isso vivo. Isso não é um modelo de serviço. É um aluguel com etapas extras.

A AGLAYA foi construída sobre uma premissa arquitetônica diferente.

Não produzimos outputs. Construímos infraestrutura — sistemas que absorvem trabalho manual, executam narrativa e convertem verdade operacional em output mensurável sem supervisão constante.

Quando saímos de um projeto, o sistema fica. Esse é o princípio de design. O único princípio de design que importa.

O Dispatch existe porque os frameworks por trás deste modelo merecem viver além do trabalho de clientes. Você vai vê-los aqui: sistemas documentados, observações de campo, análises de casos com números reais.

Sem calendário editorial. Sem conteúdo pelo conteúdo.

Apenas quando há algo que vale a pena dizer.

AGLAYA

---

### EMAIL 2 — Day 5

**Purpose:** Thought leadership. El insight que el lector reconoce en su propia operación pero nunca había visto nombrado. No vende nada. Diagnostica.

#### EN

**Subject:** The tax that doesn't appear on your P&L.
**Preheader:** Your finance team can't see this cost. But it's there.

There's a cost your finance team can't see.

It's not in the salary line. Not in tools. Not in agency fees.

It's in the hours your team spends doing work that a system should already be doing.

The weekly report assembled by hand from four different platforms. The onboarding process that lives in someone's head. The campaign that requires three rounds of internal coordination before it can go live. The client data copied from one spreadsheet to another because no one has built the bridge yet.

None of this is dramatic. None of it feels urgent on any given Tuesday.

But calculate it across twelve months, across a team of twenty, across a company that's trying to scale:

You're not looking at inefficiency. You're looking at converted revenue that disappeared into process friction.

The companies that fix this don't hire more people to manage the load.

They build systems that eliminate the load.

There's a material difference between those two decisions. One scales. The other compounds the problem with a larger payroll.

If any of this is specific — not abstract, but something you recognized in your own operation — you already know what the next question is.

AGLAYA

---

#### ES

**Asunto:** El impuesto que no aparece en tu P&L.
**Preheader:** Tu equipo financiero no puede ver este coste. Pero existe.

Hay un coste que tu equipo financiero no puede ver.

No está en la línea de salarios. No está en herramientas. No está en honorarios de agencias.

Está en las horas que tu equipo dedica a hacer trabajo que un sistema ya debería estar haciendo.

El informe semanal ensamblado a mano desde cuatro plataformas distintas. El proceso de onboarding que vive en la cabeza de alguien. La campaña que requiere tres rondas de coordinación interna antes de salir. Los datos de cliente copiados de una hoja de cálculo a otra porque nadie ha construido el puente.

Nada de esto es dramático. Nada parece urgente un martes cualquiera.

Pero calcúlalo a lo largo de doce meses, a lo largo de un equipo de veinte personas, a lo largo de una empresa que intenta escalar:

No estás mirando ineficiencia. Estás mirando ingresos convertidos que desaparecieron en fricción de proceso.

Las empresas que resuelven esto no contratan más gente para gestionar la carga.

Construyen sistemas que eliminan la carga.

Hay una diferencia material entre esas dos decisiones. Una escala. La otra compone el problema con una nómina mayor.

Si algo de esto es específico — no abstracto, sino algo que reconociste en tu propia operación — ya sabes cuál es la siguiente pregunta.

AGLAYA

---

#### PT

**Assunto:** O imposto que não aparece no seu P&L.
**Preheader:** Sua equipe financeira não consegue ver esse custo. Mas ele existe.

Existe um custo que sua equipe financeira não consegue ver.

Não está na linha de salários. Não está em ferramentas. Não está em honorários de agências.

Está nas horas que sua equipe passa fazendo trabalho que um sistema já deveria estar fazendo.

O relatório semanal montado à mão a partir de quatro plataformas diferentes. O processo de onboarding que vive na cabeça de alguém. A campanha que exige três rodadas de coordenação interna antes de ir ao ar. Os dados de cliente copiados de uma planilha para outra porque ninguém ainda construiu a ponte.

Nada disso é dramático. Nada parece urgente em uma terça-feira qualquer.

Mas calcule ao longo de doze meses, ao longo de um time de vinte pessoas, ao longo de uma empresa tentando escalar:

Você não está olhando para ineficiência. Você está olhando para receita convertida que desapareceu em atrito de processo.

As empresas que resolvem isso não contratam mais gente para gerenciar a carga.

Elas constroem sistemas que eliminam a carga.

Existe uma diferença material entre essas duas decisões. Uma escala. A outra compõe o problema com uma folha de pagamento maior.

Se algo disso é específico — não abstrato, mas algo que você reconheceu na sua própria operação — você já sabe qual é a próxima pergunta.

AGLAYA

---

### EMAIL 3 — Day 9

**Purpose:** Abrir la puerta una vez. Sin presión. ROI Audit presentado como lo que es.

#### EN

**Subject:** When you're ready.
**Preheader:** One door. Open once. No pitch, no deadline, no script.

You've been in the Dispatch for nine days.

You read how we see the agency model. You read about the operational tax.

Here's what we're not going to do: pitch you. Send you a limited-time offer. Ask for fifteen minutes of your time.

That's not the model.

But here's what we will say, once:

If the last two emails described something real in your operation — not a vague aspiration, but a specific problem you can point to — there's a structured process to determine whether AGLAYA can fix it, and what that fix is worth.

It's called the ROI Audit.

It's a two-week working engagement. Not a call. Not a presentation. Not free. We integrate with your team, map your operational surface, and deliver a system architecture and a business case built on real numbers.

The investment is scoped and quoted manually after we review your request. We set the number before you commit to anything. If the math doesn't justify the audit, we'll tell you before you spend a dollar.

If it does, we discuss what comes next.

No sales script. No discovery call theatre.

→ https://aglaya.biz/roi-audit/

The door is open.

AGLAYA

---

#### ES

**Asunto:** Cuando estés listo.
**Preheader:** Una puerta. Abierta una vez. Sin pitch, sin fecha límite, sin guión.

Llevas nueve días en el Dispatch.

Leíste cómo vemos el modelo de agencia. Leíste sobre el impuesto operativo.

Esto es lo que no vamos a hacer: hacerte un pitch. Enviarte una oferta por tiempo limitado. Pedirte quince minutos de tu tiempo.

Ese no es el modelo.

Pero esto sí lo vamos a decir, una vez:

Si los dos últimos correos describían algo real en tu operación — no una aspiración vaga, sino un problema específico que puedes señalar — existe un proceso estructurado para determinar si AGLAYA puede resolverlo, y cuánto vale esa resolución.

Se llama ROI Audit.

Es un proyecto de trabajo de dos semanas. No una llamada. No una presentación. No es gratuito. Nos integramos con tu equipo, mapeamos tu superficie operativa y entregamos una arquitectura de sistema y un business case construido sobre números reales.

La inversión se define y cotiza manualmente después de revisar tu solicitud. Fijamos el número antes de que te comprometas a nada. Si los números no justifican el audit, te lo decimos antes de que gastes un euro.

Si lo justifican, hablamos de lo que viene después.

Sin guión de ventas. Sin teatro de discovery call.

→ https://aglaya.biz/es/roi-audit/

La puerta está abierta.

AGLAYA

---

#### PT

**Assunto:** Quando você estiver pronto.
**Preheader:** Uma porta. Aberta uma vez. Sem pitch, sem prazo, sem roteiro.

Você está no Dispatch há nove dias.

Você leu como enxergamos o modelo de agência. Você leu sobre o imposto operacional.

Aqui está o que não vamos fazer: te dar um pitch. Te enviar uma oferta por tempo limitado. Pedir quinze minutos do seu tempo.

Esse não é o modelo.

Mas aqui está o que vamos dizer, uma vez:

Se os dois últimos e-mails descreveram algo real na sua operação — não uma aspiração vaga, mas um problema específico que você consegue apontar — existe um processo estruturado para determinar se a AGLAYA pode resolvê-lo, e quanto essa resolução vale.

Chama-se ROI Audit.

É um projeto de trabalho de duas semanas. Não uma call. Não uma apresentação. Não é gratuito. Nos integramos com sua equipe, mapeamos sua superfície operacional e entregamos uma arquitetura de sistema e um business case construído sobre números reais.

O investimento é definido e cotado manualmente após revisarmos sua solicitação. Definimos o valor antes de você se comprometer com qualquer coisa. Se os números não justificarem o audit, dizemos isso antes de você gastar um real.

Se justificarem, conversamos sobre o que vem a seguir.

Sem roteiro de vendas. Sem teatro de discovery call.

→ https://aglaya.biz/pt/roi-audit/

A porta está aberta.

AGLAYA

---

---

## AUTOMATION 2 — CONTACTO CUALIFICADO

**Trigger:** Subscriber joins group → CUALIFICADOS
**Nombre en MailerLite:** `Contacto Cualificado`

### Flujo de configuración

```
[TRIGGER] Joins group: CUALIFICADOS
    ↓
[EMAIL] Email 0 — inmediato
    ↓ branch por campo entry_point
    ├─ entry_point = roi_audit → Variante ROI Audit
    │       ↓ branch por campo language
    │       ├─ language = en → Email 0 ROI EN
    │       ├─ language = es → Email 0 ROI ES
    │       └─ language = pt → Email 0 ROI PT
    └─ (else) → Variante Contacto General
            ↓ branch por campo language
            ├─ language = en → Email 0 General EN
            ├─ language = es → Email 0 General ES
            └─ language = pt → Email 0 General PT
    ↓
[END]
```

---

### EMAIL 0 — Variante Contacto General (inmediato)

**Purpose:** Confirmar recepción. Establecer expectativa: respuesta humana en 24h. Sin eco del mensaje (MailerLite no puede acceder al texto del form), sin artificios.

#### EN

**Subject:** Signal received.
**Preheader:** A human will read it, think about it, and reply within 24 hours.

---

Your message is with us.

A human — not a bot — will read it, think about it, and get back to you within 24 hours.

No templates. No auto-replies. Just real thinking.

AGLAYA

---

#### ES

**Asunto:** Señal recibida.
**Preheader:** Una persona lo leerá, lo pensará y te responderá en menos de 24 horas.

---

Tu mensaje está en nuestras manos.

Una persona —no un bot— lo leerá, lo pensará y te responderá en menos de 24 horas.

Sin plantillas. Sin respuestas automáticas. Solo pensamiento real.

AGLAYA

---

#### PT

**Assunto:** Sinal recebido.
**Preheader:** Uma pessoa vai ler, pensar e responder em menos de 24 horas.

---

Sua mensagem está com a gente.

Uma pessoa — não um bot — vai ler, pensar e responder em menos de 24 horas.

Sem modelos. Sem respostas automáticas. Só pensamento real.

AGLAYA

---

### EMAIL 0 — Variante ROI Audit (inmediato)

**Condición de disparo:** `entry_point = roi_audit`
**Purpose:** Confirmar recepción de solicitud de ROI Audit. Aclarar que el scope y precio se definen manualmente. Sin precio inventado, sin promesas.

#### EN

**Subject:** ROI Audit request received.
**Preheader:** Manually scoped. Honestly priced. You'll hear from us within 24 hours.

---

Your audit request is in.

This engagement is scoped manually — the investment varies according to the operational surface we need to inspect.

Our team will review your request, determine whether the audit is justified given what you've shared, and come back within 24 hours with the next step.

No fixed-price theatre. No generic proposal. Just a scoped diagnosis if the math supports it.

AGLAYA

---

#### ES

**Asunto:** Solicitud de ROI Audit recibida.
**Preheader:** Alcance manual. Precio honesto. Respuesta en menos de 24 horas.

---

Tu solicitud de auditoría ha llegado.

Este engagement se calibra manualmente — la inversión varía según la superficie operativa que haya que auditar.

Nuestro equipo revisará tu solicitud, determinará si la auditoría está justificada según lo que has compartido, y volverá a ti en menos de 24 horas con el siguiente paso.

Sin teatro de precio fijo. Sin propuesta genérica. Solo un diagnóstico acotado si la matemática lo justifica.

AGLAYA

---

#### PT

**Assunto:** Solicitação de ROI Audit recebida.
**Preheader:** Escopo manual. Preço honesto. Resposta em até 24 horas.

---

Sua solicitação de auditoria chegou.

Esse engagement é calibrado manualmente — o investimento varia de acordo com a superfície operacional que precisa ser auditada.

Nossa equipe vai revisar sua solicitação, definir se a auditoria se justifica com base no que você compartilhou, e voltar em menos de 24 horas com o próximo passo.

Sem teatro de preço fixo. Sem proposta genérica. Apenas um diagnóstico delimitado se a matemática sustentar.

AGLAYA

---

---

## AUTOMATION 3 — CONTACTO BORDERLINE

**Trigger:** Subscriber joins group → BORDERLINE
**Nombre en MailerLite:** `Contacto Borderline`

### Flujo de configuración

```
[TRIGGER] Joins group: BORDERLINE
    ↓
[EMAIL] Email 0 — inmediato
    ↓ branch por campo language
    ├─ language = en → Email 0 EN
    ├─ language = es → Email 0 ES
    └─ language = pt → Email 0 PT
    ↓
[END]
```

---

### EMAIL 0 — inmediato

**Purpose:** Confirmar recepción. Expectativa real: revisamos encaje antes de responder. Redirige hacia Dispatch como canal de relación a largo plazo.

#### EN

**Subject:** Your inquiry is with us.
**Preheader:** You'll hear from us within 48 hours — fit or no fit.

---

We received your message.

We review every inquiry thoroughly before responding.

We'll get back to you within 48 hours to let you know whether there's a fit.

In the meantime, the AGLAYA Dispatch is where our thinking lives — documented systems, operational frameworks, and case breakdowns. If the reasoning resonates over time, you'll know when the moment is right.

Subscribe → https://aglaya.biz

AGLAYA

---

#### ES

**Asunto:** Tu consulta está con nosotros.
**Preheader:** En menos de 48 horas te decimos lo que hay. Cuadre o no cuadre.

---

Hemos recibido tu mensaje.

Revisamos minuciosamente cada consulta antes de responder.

Te contactaremos en menos de 48 horas para decirte si encaja con nuestra filosofía o no.

Mientras tanto, el AGLAYA Dispatch es donde vive nuestro pensamiento: sistemas documentados, frameworks operativos y análisis de casos. Si el razonamiento resuena con el tiempo, sabrás cuándo es el momento.

Suscríbete → https://aglaya.biz/es/

AGLAYA

---

#### PT

**Assunto:** Sua consulta está conosco.
**Preheader:** Em até 48 horas você sabe. Haja fit ou não, a gente te avisa.

---

Recebemos sua mensagem.

Revisamos cada consulta com muito cuidado antes de responder.

Entraremos em contato em até 48 horas para te dizer se há fit com a gente.

Enquanto isso, o AGLAYA Dispatch é onde nosso pensamento vive — sistemas documentados, frameworks operacionais e análises de casos. Se o raciocínio ressoar com o tempo, você saberá quando o momento for certo.

Inscreva-se → https://aglaya.biz/pt/

AGLAYA

---

---

## AUTOMATION 4 — CONTACTO NO CUALIFICADO

**Trigger:** Subscriber joins group → NO_CUALIFICADOS
**Nombre en MailerLite:** `Contacto No Cualificado`

### Flujo de configuración

```
[TRIGGER] Joins group: NO_CUALIFICADOS
    ↓
[EMAIL] Email 0 — inmediato
    ↓ branch por campo language
    ├─ language = en → Email 0 EN
    ├─ language = es → Email 0 ES
    └─ language = pt → Email 0 PT
    ↓
[END]
```

---

### EMAIL 0 — inmediato

**Purpose:** Acuse de recibo breve y honesto. No cierra la puerta. No promete nada que no se pueda cumplir. Ofrece el Dispatch como recurso sin presión.

#### EN

**Subject:** Message received.
**Preheader:** We'll be in touch if there's a path forward.

---

We got your message.

We'll be in touch if there's a path forward.

If you're curious about how we think — without the engagement — the Dispatch is the right place:

→ https://aglaya.biz

AGLAYA

---

#### ES

**Asunto:** Mensaje recibido.
**Preheader:** Nos pondremos en contacto si hay un camino a seguir.

---

Hemos recibido tu mensaje.

Nos pondremos en contacto si hay un camino a seguir.

Si tienes curiosidad sobre cómo pensamos —sin necesidad de un proyecto— el Dispatch es el lugar correcto:

→ https://aglaya.biz/es/

AGLAYA

---

#### PT

**Assunto:** Mensagem recebida.
**Preheader:** Entraremos em contato se houver um caminho a seguir.

---

Recebemos sua mensagem.

Entraremos em contato se houver um caminho a seguir.

Se você tem curiosidade sobre como pensamos — sem necessidade de um projeto — o Dispatch é o lugar certo:

→ https://aglaya.biz/pt/

AGLAYA

---

---

## AUTOMATION 5 — COTIZACIÓN RECIBIDA

**Trigger:** Subscriber joins group → COTIZACIONES
**Nombre en MailerLite:** `Cotización Recibida`

### Flujo de configuración

```
[TRIGGER] Joins group: COTIZACIONES
    ↓
[EMAIL] Email 0 — inmediato
    ↓ branch por campo language
    ├─ language = en → Email 0 EN
    ├─ language = es → Email 0 ES
    └─ language = pt → Email 0 PT
    ↓
[END]
```

**Nota:** El PDF generado va a NOTIFY_EMAIL (info@aglaya.biz) vía Resend para revisión humana. El equipo reenvía manualmente al cliente una vez verificado. Este correo confirma la recepción al cliente y gestiona la espera.

---

### EMAIL 0 — inmediato

**Purpose:** Confirmar recepción de solicitud de cotización. Gestionar expectativa: PDF bajo revisión, llega en 72h (coherente con el copy). No enviar PDF automáticamente — revisión humana primero.

#### EN

**Subject:** Your quote request is with us.
**Preheader:** Under review. You'll receive the full PDF breakdown within 72 hours.

---

We received your project configuration.

Our team is reviewing it and will send you the detailed proposal — including the full PDF breakdown — within 72 hours.

If anything needs clarifying before then, reply directly to this email.

AGLAYA

---

#### ES

**Asunto:** Tu solicitud de cotización está con nosotros.
**Preheader:** En revisión. Recibirás el PDF completo en menos de 72 horas.

---

Hemos recibido la configuración de tu proyecto.

Nuestro equipo la está revisando y te enviará la propuesta detallada —incluyendo el PDF con el desglose completo— en menos de 72 horas.

Si necesitas aclarar algo antes, responde directamente a este correo.

AGLAYA

---

#### PT

**Assunto:** Sua solicitação de orçamento está conosco.
**Preheader:** Em revisão. Você receberá o PDF completo em até 72 horas.

---

Recebemos a configuração do seu projeto.

Nossa equipe está revisando e enviará a proposta detalhada — incluindo o PDF com o detalhamento completo — em até 72 horas.

Se precisar esclarecer algo antes disso, responda diretamente a este e-mail.

AGLAYA

---

---

## CHECKLIST DE IMPLEMENTACIÓN EN MAILERLITE UI

### Antes de empezar
- [ ] Confirmar que `language`, `entry_point`, `service_interest`, `onboarding_active` existen como campos en MailerLite (Settings → Fields)
- [ ] Confirmar que los 5 grupos existen: SUSCRIPCIONES, CUALIFICADOS, BORDERLINE, NO_CUALIFICADOS, COTIZACIONES
- [ ] Confirmar que el dominio `aglaya.biz` está autenticado (Settings → Domains)

### Automation 1: Dispatch Entry Protocol
- [ ] Crear automation "Dispatch Entry Protocol"
- [ ] Trigger: Subscriber joins group → SUSCRIPCIONES
- [ ] Step 1: Update subscriber field → `onboarding_active` = `1`
- [ ] Step 2: Send email → Email 0 (crear 3 versiones: EN/ES/PT)
  - [ ] Condition: language = en → Email 0 EN
  - [ ] Condition: language = es → Email 0 ES
  - [ ] Condition: language = pt → Email 0 PT
- [ ] Step 3: Wait → 2 days
- [ ] Step 4: Send email → Email 1 (3 versiones: EN/ES/PT)
- [ ] Step 5: Wait → 3 days
- [ ] Step 6: Send email → Email 2 (3 versiones: EN/ES/PT)
- [ ] Step 7: Wait → 4 days
- [ ] Step 8: Send email → Email 3 (3 versiones: EN/ES/PT)
- [ ] Step 9: Update subscriber field → `onboarding_active` = `0`
- [ ] Activar automation
- [ ] Probar con email real (unirse al grupo manualmente → verificar que llegan los correos)

### Automation 2: Contacto Cualificado
- [ ] Crear automation "Contacto Cualificado"
- [ ] Trigger: Subscriber joins group → CUALIFICADOS
- [ ] Branch: entry_point = roi_audit → Variante ROI (3 idiomas)
- [ ] Branch: (else) → Variante General (3 idiomas)
- [ ] Activar automation
- [ ] Probar: submit qualified contact form → verificar email recibido

### Automation 3: Contacto Borderline
- [ ] Crear automation "Contacto Borderline"
- [ ] Trigger: Subscriber joins group → BORDERLINE
- [ ] Branch por language (3 versiones)
- [ ] Activar automation

### Automation 4: Contacto No Cualificado
- [ ] Crear automation "Contacto No Cualificado"
- [ ] Trigger: Subscriber joins group → NO_CUALIFICADOS
- [ ] Branch por language (3 versiones)
- [ ] Activar automation

### Automation 5: Cotización Recibida
- [ ] Crear automation "Cotización Recibida"
- [ ] Trigger: Subscriber joins group → COTIZACIONES
- [ ] Branch por language (3 versiones)
- [ ] Activar automation
- [ ] Probar: submit quote form → verificar email recibido en cliente + PDF en NOTIFY_EMAIL

### Post-implementación
- [ ] Hacer end-to-end test con mail-tester.com en cada automation
- [ ] Verificar que `onboarding_active` se setea y resetea correctamente en SUSCRIPCIONES
- [ ] Verificar que envíos manuales del Dispatch excluyen `onboarding_active = 1`
- [ ] Eliminar `RESEND_API_KEY` de Netlify env vars SOLO cuando todas las automations estén activas y testeadas

---

## REFERENCIA RÁPIDA — CAMPOS CUSTOM MAILERLITE

| Campo | ID MailerLite | Tipo | Notas |
|---|---|---|---|
| `language` | (confirmar en UI) | text | `en` / `es` / `pt` |
| `entry_point` | (confirmar en UI) | text | `dispatch_footer`, `roi_audit`, `quote_calculator`, etc. |
| `service_interest` | (confirmar en UI) | text | `roi_audit`, `landing`, `corporate`, `product`, `ecommerce` |
| `onboarding_active` | 1248508 | number | `1` activo, `0` completado |

---

*Última actualización: 2026-05-04*
