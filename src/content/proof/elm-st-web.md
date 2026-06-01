---
title:
  en: "Zero-Defect Web Architecture"
  es: "Arquitectura Web Sin Defectos"
  pt: "Arquitetura Web Sem Defeitos"
client: "Elm St."
industry:
  en: "Audiovisual Production"
  es: "Producción Audiovisual"
  pt: "Produção Audiovisual"
challenge:
  en: "A production company with ambition but a technically naked site — no CI, no monitoring, no quality gate. Anything could break silently."
  es: "Una productora con ambición pero un sitio técnicamente desnudo — sin CI, sin monitoreo, sin quality gate. Cualquier cosa podía romperse en silencio."
  pt: "Uma produtora com ambição mas um site tecnicamente nu — sem CI, sem monitoramento, sem quality gate. Qualquer coisa podia quebrar em silêncio."
summary:
  en: "A static HTML/CSS/JS site has no excuse to be technically fragile. We applied an 8-step blocking CI/CD pipeline — lint, Playwright E2E, visual regression with versioned baselines, axe-core a11y, Lighthouse CI per route, performance budgets — to a site that looks deceptively simple. The result: a corporate web with enterprise DNA."
  es: "Un sitio estático HTML/CSS/JS no tiene excusa para ser técnicamente frágil. Aplicamos un pipeline CI/CD bloqueante de 8 pasos — lint, Playwright E2E, regresión visual con baselines versionados, a11y axe-core, Lighthouse CI por ruta, performance budgets — a un sitio que parece engañosamente simple. El resultado: una web corporativa con ADN de enterprise."
  pt: "Um site estático HTML/CSS/JS não tem desculpa para ser tecnicamente frágil. Aplicamos um pipeline CI/CD bloqueante de 8 passos — lint, Playwright E2E, regressão visual com baselines versionados, a11y axe-core, Lighthouse CI por rota, performance budgets — a um site que parece enganosamente simples. O resultado: uma web corporativa com DNA de enterprise."
strategy:
  en: "8-step blocking GitHub Actions pipeline. Sentry + UptimeRobot observability layer. Bilingual ES/EN with hreflang, canonicals and parallel routes. Netlify Functions for server-side form validation with Turnstile CAPTCHA."
  es: "Pipeline GitHub Actions bloqueante de 8 pasos. Capa de observabilidad Sentry + UptimeRobot. Bilingüe ES/EN con hreflang, canonicals y rutas paralelas. Netlify Functions para validación de formulario server-side con Turnstile CAPTCHA."
  pt: "Pipeline GitHub Actions bloqueante de 8 passos. Camada de observabilidade Sentry + UptimeRobot. Bilíngue ES/EN com hreflang, canonicals e rotas paralelas. Netlify Functions para validação de formulário server-side com Turnstile CAPTCHA."
vision:
  en: "The absence of a modern framework is no excuse to skip engineering discipline."
  es: "La ausencia de un framework moderno no es excusa para omitir rigor de ingeniería."
  pt: "A ausência de um framework moderno não é desculpa para omitir rigor de engenharia."
solution_systems:
  - Zero-Leak Architecture
  - Systemic Alchemy
results:
  - metric: "97"
    label:
      en: "Lighthouse Accessibility · desktop + mobile"
      es: "Lighthouse Accessibility · desktop + mobile"
      pt: "Lighthouse Accessibility · desktop + mobile"
  - metric: "100"
    label:
      en: "Lighthouse SEO · desktop + mobile"
      es: "Lighthouse SEO · desktop + mobile"
      pt: "Lighthouse SEO · desktop + mobile"
  - metric: "10/10"
    label:
      en: "Routes under blocking quality gate"
      es: "Rutas bajo quality gate bloqueante"
      pt: "Rotas sob quality gate bloqueante"
featured: false
date: "2026-03"
client_logo: "../src/assets/images/elm-st.svg"
body_en: |
  ## What We Built

  **elm-st-web** is the corporate website for **Elm St.**, an audiovisual production company in Bogotá, Colombia. The site is visually restrained — and technically uncompromising.

  The premise: *a static HTML/CSS/JS site has no excuse to be technically fragile.*

  ### Architecture

  - Static HTML/CSS/JS deployed on Netlify with **Netlify Functions** for server-side form validation (Turnstile invisible CAPTCHA + honeypot + optional Resend)
  - Bilingual **ES/EN** with hreflang, canonical tags, and parallel routes for every page
  - Hardened headers: CSP, HSTS, X-Frame-Options, anti mixed-content controls
  - Runtime config served securely — zero credentials hardcoded in the repository

  ### CI/CD Pipeline — 8 Blocking Steps

  Nothing reaches `main` without passing every gate. The pipeline runs on push, manually on demand, and on a **weekly schedule every Monday at 13:00 UTC**:

  ```mermaid
  flowchart LR
    A[Lint\nHTML·JS·CSS] --> B[Netlify\nConfig] --> C[External\nLinks] --> D[Playwright\nE2E] --> E[axe-core\nA11y] --> F[Visual\nRegression] --> G[Lighthouse\nCI] --> H[Perf\nBudgets]
    style A fill:#111,stroke:#9FC243,color:#fff
    style H fill:#111,stroke:#9FC243,color:#fff
  ```

  ### Observability

  - **Sentry** — frontend error capture by environment, DSN via runtime config (never hardcoded)
  - **UptimeRobot** — 24/7 HTTP uptime monitoring with a P1/P2/P3 alert runbook
  - **Google Search Console + Bing Webmaster Tools** — active indexation layer, sitemap submitted

  ## The Results

  A site that looks simple and is anything but. **100 on SEO. 97 on Accessibility.** On every route, in both languages, verified on every deploy.

  The lesson AGLAYA applies to every project: enterprise engineering discipline is a practice, not a framework. Any stack can be built to last.

  [Visit the site →](https://elmst.ibaifernandez.com)
body_es: |
  ## Qué Construimos

  **elm-st-web** es la web corporativa de **Elm St.**, productora audiovisual con sede en Bogotá, Colombia. El sitio es sobrio visualmente — e implacable técnicamente.

  La premisa: *un sitio estático HTML/CSS/JS no tiene excusa para ser técnicamente frágil.*

  ### Arquitectura

  - HTML/CSS/JS estático desplegado en Netlify con **Netlify Functions** para validación de formulario server-side (Turnstile CAPTCHA invisible + honeypot + Resend opcional)
  - Bilingüe **ES/EN** con hreflang, canonicals y rutas paralelas para cada página
  - Cabeceras de seguridad: CSP, HSTS, X-Frame-Options, controles anti mixed-content
  - Runtime config servida de forma segura — cero credenciales hardcodeadas en el repositorio

  ### Pipeline CI/CD — 8 Pasos Bloqueantes

  Nada llega a `main` sin pasar todos los gates. El pipeline corre en cada push, manualmente bajo demanda, y en un **schedule semanal automático cada lunes a las 13:00 UTC**:

  ```mermaid
  flowchart LR
    A[Lint\nHTML·JS·CSS] --> B[Netlify\nConfig] --> C[Links\nExternos] --> D[Playwright\nE2E] --> E[axe-core\nA11y] --> F[Regresión\nVisual] --> G[Lighthouse\nCI] --> H[Perf\nBudgets]
    style A fill:#111,stroke:#9FC243,color:#fff
    style H fill:#111,stroke:#9FC243,color:#fff
  ```

  1. **Lint HTML · JS · CSS** — validación de sintaxis y estilo
  2. **Netlify config** — comprobación estructural de netlify.toml
  3. **Links externos** — detección de enlaces rotos
  4. **Playwright E2E** — rutas críticas y formulario de contacto en navegador real
  5. **axe-core Accesibilidad** — WCAG 2AA sin exclusiones (score: 97)
  6. **Regresión visual** — desktop + mobile con baselines versionados
  7. **Lighthouse CI** — 10 rutas auditadas en ambos idiomas (SEO: 100 · A11y: 97)
  8. **Performance budgets** — umbrales JSON por ruta, bloqueante si se supera

  ### Observabilidad

  - **Sentry** — captura de errores frontend por entorno, DSN vía runtime config (nunca hardcodeado)
  - **UptimeRobot** — monitoreo HTTP 24/7 con runbook de alertas P1/P2/P3
  - **Google Search Console + Bing Webmaster Tools** — capa de indexación activa, sitemap enviado

  ## Los Resultados

  Un sitio que parece simple y no lo es. **100 en SEO. 97 en Accesibilidad.** En cada ruta, en ambos idiomas, verificado en cada deploy.

  La lección que AGLAYA aplica en cada proyecto: la disciplina de ingeniería enterprise es una práctica, no un framework. Cualquier stack puede construirse para durar.

  [Ver el sitio →](https://elmst.ibaifernandez.com)
body_pt: |
  ## O Que Construímos

  **elm-st-web** é o site corporativo da **Elm St.**, produtora audiovisual sediada em Bogotá, Colômbia. O site é visualmente contido — e tecnicamente implacável.

  A premissa: *um site estático HTML/CSS/JS não tem desculpa para ser tecnicamente frágil.*

  ### Arquitetura

  - HTML/CSS/JS estático implantado no Netlify com **Netlify Functions** para validação de formulário server-side (Turnstile CAPTCHA invisível + honeypot + Resend opcional)
  - Bilíngue **ES/EN** com hreflang, canonicals e rotas paralelas para cada página
  - Cabeçalhos de segurança: CSP, HSTS, X-Frame-Options, controles anti mixed-content
  - Runtime config servida com segurança — zero credenciais hardcoded no repositório

  ### Pipeline CI/CD — 8 Passos Bloqueantes

  Nada chega ao `main` sem passar por todos os gates. O pipeline roda a cada push, manualmente sob demanda, e em um **schedule semanal automático toda segunda-feira às 13:00 UTC**:

  ```mermaid
  flowchart LR
    A[Lint\nHTML·JS·CSS] --> B[Netlify\nConfig] --> C[Links\nExternos] --> D[Playwright\nE2E] --> E[axe-core\nA11y] --> F[Regressão\nVisual] --> G[Lighthouse\nCI] --> H[Perf\nBudgets]
    style A fill:#111,stroke:#9FC243,color:#fff
    style H fill:#111,stroke:#9FC243,color:#fff
  ```

  1. **Lint HTML · JS · CSS** — validação de sintaxe e estilo
  2. **Netlify config** — verificação estrutural do netlify.toml
  3. **Links externos** — detecção de links quebrados
  4. **Playwright E2E** — rotas críticas e formulário de contato em navegador real
  5. **axe-core Acessibilidade** — WCAG 2AA sem exclusões (score: 97)
  6. **Regressão visual** — desktop + mobile com baselines versionados
  7. **Lighthouse CI** — 10 rotas auditadas em ambos os idiomas (SEO: 100 · A11y: 97)
  8. **Performance budgets** — limites JSON por rota, bloqueante se ultrapassado

  ### Observabilidade

  - **Sentry** — captura de erros frontend por ambiente, DSN via runtime config (nunca hardcoded)
  - **UptimeRobot** — monitoramento HTTP 24/7 com runbook de alertas P1/P2/P3
  - **Google Search Console + Bing Webmaster Tools** — camada de indexação ativa, sitemap enviado

  ## Os Resultados

  Um site que parece simples e não é. **100 em SEO. 97 em Acessibilidade.** Em cada rota, nos dois idiomas, verificado a cada deploy.

  A lição que a AGLAYA aplica em cada projeto: disciplina de engenharia enterprise é uma prática, não um framework. Qualquer stack pode ser construído para durar.

  [Visitar o site →](https://elmst.ibaifernandez.com)
---
