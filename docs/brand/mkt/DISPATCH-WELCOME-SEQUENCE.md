---
status: active
domain: marketing
owner: marketing
source_of_truth: true
supersedes: []
superseded_by: []
last_reviewed: 2026-04-28
consumable_by_agents: true
---

# AGLAYA DISPATCH — Welcome Sequence

> Secuencia de bienvenida para nuevos suscriptores del AGLAYA Dispatch.
> Se ejecuta en MailerLite como automation disparada por "subscriber joins group: Suscripciones".

---

## Architecture

- **Email 0 (Day 0, Resend — ya existe):** Confirmación transaccional inmediata. "You're in." No se toca.
- **Email 1 (Day 2, MailerLite):** El marco intelectual. Qué es AGLAYA y qué no es.
- **Email 2 (Day 5, MailerLite):** Thought leadership. El impuesto operativo.
- **Email 3 (Day 9, MailerLite):** La puerta abierta. Soft CTA al ROI Audit.

## Exclusion Rule

Mientras un suscriptor esté en la secuencia de bienvenida (días 0–9), debe quedar excluido de cualquier envío de Dispatch que salga durante ese período.

En MailerLite: al crear un envío de Dispatch, excluir el segmento `En bienvenida` (subscribers que entraron en los últimos 10 días o que tienen el campo `onboarding_active = true`).

## Language Routing

El campo `language` (en | es | pt) está escrito en cada suscriptor al momento de la suscripción. Las automations de MailerLite deben ramificarse por ese campo para enviar cada email en el idioma correcto.

## CTA URLs

- EN → `https://aglaya.biz/roi-audit/`
- ES → `https://aglaya.biz/es/roi-audit/`
- PT → `https://aglaya.biz/pt/roi-audit/`

---

## EMAIL 1 — Day 2

> **Purpose:** Establecer el marco intelectual. Qué es AGLAYA, qué no es, por qué existe el Dispatch.

---

### EN

**Subject:** The agency model has a design flaw.

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

### ES

**Asunto:** El modelo de agencia tiene un fallo de diseño.

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

### PT

**Assunto:** O modelo de agência tem uma falha de design.

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

## EMAIL 2 — Day 5

> **Purpose:** Thought leadership. El insight que el lector reconoce en su propia operación pero nunca había visto nombrado. No vende nada. Diagnostica.

---

### EN

**Subject:** The tax that doesn't appear on your P&L.

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

### ES

**Asunto:** El impuesto que no aparece en tu P&L.

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

### PT

**Assunto:** O imposto que não aparece no seu P&L.

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

## EMAIL 3 — Day 9

> **Purpose:** Abrir la puerta. Una vez. Sin presión. El ROI Audit presentado como diagnóstico, no como call de ventas.

---

### EN

**Subject:** When you're ready.

You've been in the Dispatch for nine days.

You read how we see the agency model. You read about the operational tax.

Here's what we're not going to do: pitch you. Send you a limited-time offer. Ask for fifteen minutes of your time.

That's not the model.

But here's what we will say, once:

If the last two emails described something real in your operation — not a vague aspiration, but a specific problem you can point to — there's a structured process to determine whether AGLAYA can fix it, and what that fix is worth.

It's called the ROI Audit.

It's a diagnostic. We map your operational friction. We calculate what it's costing you. We tell you honestly whether the investment in fixing it produces a return worth making.

If it does, we discuss working together.
If it doesn't, you leave with a diagnosis that's worth having regardless.

No sales script. No discovery call theatre.

→ https://aglaya.biz/roi-audit/

The door is open.

AGLAYA

---

### ES

**Asunto:** Cuando estés listo.

Llevas nueve días en el Dispatch.

Leíste cómo vemos el modelo de agencia. Leíste sobre el impuesto operativo.

Esto es lo que no vamos a hacer: hacerte un pitch. Enviarte una oferta por tiempo limitado. Pedirte quince minutos de tu tiempo.

Ese no es el modelo.

Pero esto sí lo vamos a decir, una vez:

Si los dos últimos correos describían algo real en tu operación — no una aspiración vaga, sino un problema específico que puedes señalar — existe un proceso estructurado para determinar si AGLAYA puede resolverlo, y cuánto vale esa resolución.

Se llama ROI Audit.

Es un diagnóstico. Mapeamos tu fricción operativa. Calculamos lo que te está costando. Te decimos honestamente si la inversión en resolverlo produce un retorno que merece la pena.

Si lo produce, hablamos de trabajar juntos.
Si no, te vas con un diagnóstico que vale la pena tener de todas formas.

Sin guión de ventas. Sin teatro de discovery call.

→ https://aglaya.biz/es/roi-audit/

La puerta está abierta.

AGLAYA

---

### PT

**Assunto:** Quando você estiver pronto.

Você está no Dispatch há nove dias.

Você leu como enxergamos o modelo de agência. Você leu sobre o imposto operacional.

Aqui está o que não vamos fazer: te dar um pitch. Te enviar uma oferta por tempo limitado. Pedir quinze minutos do seu tempo.

Esse não é o modelo.

Mas aqui está o que vamos dizer, uma vez:

Se os dois últimos e-mails descreveram algo real na sua operação — não uma aspiração vaga, mas um problema específico que você consegue apontar — existe um processo estruturado para determinar se a AGLAYA pode resolvê-lo, e quanto essa resolução vale.

Chama-se ROI Audit.

É um diagnóstico. Mapeamos seu atrito operacional. Calculamos o que ele está custando. Dizemos honestamente se o investimento em corrigi-lo produz um retorno que vale a pena fazer.

Se produz, conversamos sobre trabalhar juntos.
Se não produz, você sai com um diagnóstico que vale a pena ter de qualquer forma.

Sem roteiro de vendas. Sem teatro de discovery call.

→ https://aglaya.biz/pt/roi-audit/

A porta está aberta.

AGLAYA
