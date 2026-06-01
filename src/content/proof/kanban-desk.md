---
title:
  en: "Multi-Tenant Project Intelligence"
  es: "Inteligencia de Proyectos Multi-Tenant"
  pt: "Inteligência de Projetos Multi-Tenant"
client: "AGLAYA"
industry:
  en: "SaaS / Project Management"
  es: "SaaS / Gestión de Proyectos"
  pt: "SaaS / Gestão de Projetos"
challenge:
  en: "Every project management tool forces a choice: personal work or team projects. We needed both — plus a client-facing layer with controlled visibility."
  es: "Toda herramienta de gestión de proyectos te obliga a elegir: trabajo personal o proyectos de equipo. Necesitábamos ambos — más una capa de cliente con visibilidad controlada."
  pt: "Toda ferramenta de gestão de projetos te obriga a escolher: trabalho pessoal ou projetos de equipe. Precisávamos dos dois — mais uma camada de cliente com visibilidade controlada."
summary:
  en: "AGLAYA built its own multi-tenant Kanban. Three workspace types — Personal, Internal, Client — with Row Level Security enforced at the database layer. Clients see only what they've been assigned. The team sees everything internal. Full-stack: React 18 + Express + Supabase. 95 tests. In production."
  es: "AGLAYA construyó su propio Kanban multi-tenant. Tres tipos de workspace — Personal, Interno, Cliente — con Row Level Security aplicado en la capa de base de datos. Los clientes solo ven lo que se les ha asignado. El equipo ve todo lo interno. Full-stack: React 18 + Express + Supabase. 95 tests. En producción."
  pt: "A AGLAYA construiu seu próprio Kanban multi-tenant. Três tipos de workspace — Pessoal, Interno, Cliente — com Row Level Security aplicado na camada de banco de dados. Os clientes veem apenas o que lhes foi atribuído. O time vê tudo interno. Full-stack: React 18 + Express + Supabase. 95 testes. Em produção."
strategy:
  en: "React 18 + Vite frontend · Express 4 + Node.js backend · Supabase (PostgreSQL + RLS + Auth + Storage) · @dnd-kit drag & drop · Nodemailer daily digest · Jest + Supertest 95 tests · Netlify + Railway."
  es: "Frontend React 18 + Vite · Backend Express 4 + Node.js · Supabase (PostgreSQL + RLS + Auth + Storage) · @dnd-kit drag & drop · Nodemailer digest diario · Jest + Supertest 95 tests · Netlify + Railway."
  pt: "Frontend React 18 + Vite · Backend Express 4 + Node.js · Supabase (PostgreSQL + RLS + Auth + Storage) · @dnd-kit drag & drop · Nodemailer digest diário · Jest + Supertest 95 testes · Netlify + Railway."
vision:
  en: "Own the tools you use. Build for real constraints, not demos."
  es: "Poseer las herramientas que usas. Construir para restricciones reales, no demos."
  pt: "Possuir as ferramentas que você usa. Construir para restrições reais, não demos."
solution_systems:
  - Zero-Leak Architecture
  - Systemic Alchemy
results:
  - metric: "3"
    label:
      en: "Workspace types · Personal · Team · Client"
      es: "Tipos de workspace · Personal · Equipo · Cliente"
      pt: "Tipos de workspace · Pessoal · Equipe · Cliente"
  - metric: "95"
    label:
      en: "Tests passing · Jest + Supertest"
      es: "Tests en verde · Jest + Supertest"
      pt: "Testes em verde · Jest + Supertest"
  - metric: "RLS"
    label:
      en: "Row Level Security · full data isolation"
      es: "Row Level Security · aislamiento total de datos"
      pt: "Row Level Security · isolamento total de dados"
featured: false
date: "2026-01"
body_en: |
  ## What We Built

  Most project management tools force a choice: personal work or team projects. AGLAYA Kanban Desk refuses that binary.

  Three workspace types. One access point. Full data isolation at the database layer.

  - **Personal** — your backlog, your projects, visible only to you
  - **Internal** — team boards for departmental projects, visible to collaborators
  - **External** — shared spaces with clients, with controlled visibility. Clients see only what they've been explicitly assigned.

  ### Architecture

  ```mermaid
  flowchart LR
    A["React 18 · Vite\nNetlify"] <-->|JWT / HTTPS| B["Express 4 · Node.js\nRailway"]
    B --> C["Supabase\nPostgreSQL + RLS\nAuth + Storage + Admin API"]
  ```

  **Data hierarchy:** Organization → Workspace → Board → Column → Card. Every level inherits visibility restrictions from the level above.

  **Row Level Security** is active on every table. The Express server uses `service_role` for administrative operations; the React client never touches the database directly. Data isolation is enforced at the database engine, not just the application layer.

  ### Security

  - CORS restricted to `kanban.aglaya.biz` in production
  - Rate limiting: 20 requests / 15 minutes on all auth routes
  - Helmet with CSP in production
  - JWT with 7-day expiry, stored under private keys (`aglaya_token`, `aglaya_user`)
  - Enum and type validation on every mutation endpoint

  ### Features — v1.1.0

  - Drag & drop columns and cards (@dnd-kit)
  - Priority levels: urgent / high / medium / low / none
  - Deadlines with visual urgency indicators
  - Checklists with progress tracking and inline editing
  - Per-card assignee with avatar
  - Labels and file attachments (Supabase Storage)
  - Global search and filters by assignee / overdue
  - Workspace covers: real uploaded image or deterministic mini-kanban generator
  - Daily admin digest via Nodemailer: global stats, overdue cards, orphaned cards, top boards, Supabase user data
  - On-demand digest endpoint for immediate delivery

  ### Tests — 95 Passing

  | Suite | Tests |
  |---|---|
  | Auth API | 8 |
  | Boards API | 7 |
  | Cards API | 6 |
  | Workspaces API | 5 |

  ## The Results

  A production-grade multi-tenant Kanban in continuous operation. Not a demo, not a prototype — the same tool used internally at AGLAYA to manage client projects. The proof that the engineering behind it works under real conditions, every day.

  [Access the sandbox →](#) *(Coming soon)*
body_es: |
  ## Qué Construimos

  La mayoría de las herramientas de gestión de proyectos te obligan a elegir: trabajo personal o proyectos de equipo. AGLAYA Kanban Desk rechaza ese binario.

  Tres tipos de workspace. Un único punto de acceso. Aislamiento total de datos en la capa de base de datos.

  - **Personal** — tu backlog, tus proyectos, visible solo para ti
  - **Interno** — tableros de equipo para proyectos departamentales, visibles para colaboradores
  - **Externo** — espacios compartidos con clientes, con visibilidad controlada. Los clientes solo ven lo que se les ha asignado explícitamente.

  ### Arquitectura

  ```mermaid
  flowchart LR
    A["React 18 · Vite\nNetlify"] <-->|JWT / HTTPS| B["Express 4 · Node.js\nRailway"]
    B --> C["Supabase\nPostgreSQL + RLS\nAuth + Storage + Admin API"]
  ```

  **Jerarquía de datos:** Organización → Workspace → Tablero → Columna → Tarjeta. Cada nivel hereda las restricciones de visibilidad del nivel superior.

  **Row Level Security** activa en todas las tablas. El servidor Express usa `service_role` para operaciones administrativas; el cliente React nunca toca la base de datos directamente. El aislamiento de datos se aplica en el motor de base de datos, no solo en la capa de aplicación.

  ### Seguridad

  - CORS restringido a `kanban.aglaya.biz` en producción
  - Rate limiting: 20 peticiones / 15 minutos en todas las rutas de autenticación
  - Helmet con CSP en producción
  - JWT con expiración de 7 días, almacenado con claves privadas (`aglaya_token`, `aglaya_user`)
  - Validación de enums y tipos en cada endpoint de mutación

  ### Características — v1.1.0

  - Drag & drop de columnas y tarjetas (@dnd-kit)
  - Prioridades: urgente / alta / media / baja / ninguna
  - Fechas límite con indicador visual de urgencia
  - Checklists con seguimiento de progreso y edición inline
  - Responsable por tarjeta con avatar
  - Etiquetas y adjuntos (Supabase Storage)
  - Búsqueda global y filtros por responsable / vencidas
  - Portadas de workspace: imagen real o mini-kanban generativo determinista
  - Digest diario de administrador vía Nodemailer: estadísticas globales, tarjetas vencidas, tarjetas huérfanas, top tableros, datos de usuarios Supabase
  - Endpoint de digest bajo demanda para envío inmediato

  ### Tests — 95 en Verde

  | Suite | Tests |
  |---|---|
  | Auth API | 8 |
  | Boards API | 7 |
  | Cards API | 6 |
  | Workspaces API | 5 |

  ## Los Resultados

  Un Kanban multi-tenant de nivel productivo en operación continua. No un demo, no un prototipo — la misma herramienta que usa AGLAYA internamente para gestionar proyectos de clientes. La prueba de que la ingeniería que hay detrás funciona bajo condiciones reales, cada día.

  [Acceder al sandbox →](#) *(Próximamente)*
body_pt: |
  ## O Que Construímos

  A maioria das ferramentas de gestão de projetos te obriga a escolher: trabalho pessoal ou projetos de equipe. AGLAYA Kanban Desk recusa esse binário.

  Três tipos de workspace. Um único ponto de acesso. Isolamento total de dados na camada de banco de dados.

  - **Pessoal** — seu backlog, seus projetos, visível apenas para você
  - **Interno** — boards de equipe para projetos departamentais, visíveis para colaboradores
  - **Externo** — espaços compartilhados com clientes, com visibilidade controlada. Os clientes veem apenas o que lhes foi explicitamente atribuído.

  ### Arquitetura

  ```mermaid
  flowchart LR
    A["React 18 · Vite\nNetlify"] <-->|JWT / HTTPS| B["Express 4 · Node.js\nRailway"]
    B --> C["Supabase\nPostgreSQL + RLS\nAuth + Storage + Admin API"]
  ```

  **Hierarquia de dados:** Organização → Workspace → Board → Coluna → Card. Cada nível herda as restrições de visibilidade do nível superior.

  **Row Level Security** ativa em todas as tabelas. O servidor Express usa `service_role` para operações administrativas; o cliente React nunca toca o banco de dados diretamente. O isolamento de dados é aplicado no motor do banco de dados, não apenas na camada de aplicação.

  ### Segurança

  - CORS restrito a `kanban.aglaya.biz` em produção
  - Rate limiting: 20 requisições / 15 minutos em todas as rotas de autenticação
  - Helmet com CSP em produção
  - JWT com expiração de 7 dias, armazenado com chaves privadas (`aglaya_token`, `aglaya_user`)
  - Validação de enums e tipos em cada endpoint de mutação

  ### Funcionalidades — v1.1.0

  - Drag & drop de colunas e cards (@dnd-kit)
  - Prioridades: urgente / alta / média / baixa / nenhuma
  - Datas limite com indicador visual de urgência
  - Checklists com acompanhamento de progresso e edição inline
  - Responsável por card com avatar
  - Etiquetas e anexos (Supabase Storage)
  - Busca global e filtros por responsável / vencidos
  - Capas de workspace: imagem real ou mini-kanban generativo determinista
  - Digest diário de administrador via Nodemailer: estatísticas globais, cards vencidos, cards órfãos, top boards, dados de usuários Supabase
  - Endpoint de digest sob demanda para envio imediato

  ### Testes — 95 em Verde

  | Suite | Testes |
  |---|---|
  | Auth API | 8 |
  | Boards API | 7 |
  | Cards API | 6 |
  | Workspaces API | 5 |

  ## Os Resultados

  Um Kanban multi-tenant de nível produtivo em operação contínua. Não um demo, não um protótipo — a mesma ferramenta usada internamente pela AGLAYA para gerenciar projetos de clientes. A prova de que a engenharia por trás funciona sob condições reais, todos os dias.

  [Acessar o sandbox →](#) *(Em breve)*
---
