# Cotizador AGLAYA — Decisiones de Diseño

> Documento vivo. Recoge todas las decisiones tomadas antes de codear el cotizador,
> con el rationale detrás de cada una. Actualizar aquí antes de modificar la herramienta.

---

## 1. Qué es y para qué

### Decisión
Herramienta pública de cotización de sitios web tipo "menú McDonald's": el usuario elige opciones y el sistema calcula un precio final + genera un PDF con el desglose.

### Rationale
- Cubre dos casos de uso con una sola herramienta: prospecto frío que llega solo + Ibai usándola en reunión de ventas con cliente delante.
- El PDF no es solo una cotización: incluye descripción de lo que se va a hacer y cómo → funciona como primera propuesta.
- El cliente llega al contacto ya sabiendo el precio → conversación de ventas más cualificada, menos fricción.

---

## 2. Output de la herramienta

### Decisión
El cotizador termina en cuatro salidas simultáneas:

1. **Precio visible en pantalla** — el usuario ve el total mientras configura.
2. **PDF descargable** — cotización detallada con desglose de servicios y descripción de entregables.
3. **Lead capturado en MailerLite** — email + datos del proyecto → grupo de suscripciones.
4. **CTA de contacto** — tras ver el precio, el usuario puede contactar a AGLAYA (no una llamada obligatoria; es opcional y el usuario la inicia).

### Rationale
- No se fuerza una llamada de "te contactamos nosotros" → reduce fricción para el prospecto frío.
- MailerLite capture = lead nurturing automático desde el primer contacto.
- El PDF le da al prospecto algo tangible que puede compartir internamente si necesita aprobación de presupuesto.

---

## 3. Posicionamiento de precio

### Decisión
AGLAYA se posiciona como **agencia boutique LatAm en rango mid-market USA**.

| Referencia | Rango |
|---|---|
| Freelancer USA | $1,500–$4,000 |
| Agencia boutique USA | $6,000–$12,000 |
| Agencia LatAm básica | $500–$3,000 |
| **AGLAYA (objetivo)** | **$2,900–$10,000** |

### Rationale
- Las agencias LatAm cuestan 40–50% menos que las USA equivalentes. Ese es el arbitraje de AGLAYA.
- El cliente gringo percibe valor (paga menos que su agencia local con calidad comparable).
- El cliente LatAm percibe a AGLAYA como premium (precio en USD, posicionamiento "AI-first").
- No compitimos con freelancers de Fiverr ni con grandes agencias USA. Ese hueco del medio es el nuestro.

---

## 4. Mínimo económico por proyecto

### Decisión
**Mínimo neto por proyecto: $2,400 USD**, distribuidos en 4 partes iguales de $600:

| Destinatario | Importe | Naturaleza |
|---|---|---|
| Ibai | $600 | Compensación trabajo (95% del proyecto) |
| Mavi | $600 | Compensación trabajo / formación |
| Món | $600 | Compensación trabajo / formación |
| AGLAYA (empresa) | $600 | Overhead, herramientas, marketing |

**Precio bruto mínimo resultante: $2,900** (cubre el neto + ~$300 de colchón para revisiones y costos directos mínimos).

### Rationale
- El split equitativo es una decisión consciente: Ibai hace ~95% del trabajo técnico ahora, pero el modelo asume que Mavi y Món irán creciendo en responsabilidad. El $600 actual es en parte compensación, en parte inversión en formación del equipo.
- El slice de AGLAYA ($600/proyecto) cubre costos fijos estimados: Claude Pro ($100/mes), Netlify + tools dev (~$70/mes), herramientas marketing (~$150/mes), publicidad (~$300/mes mínimo para arrancar) → total ~$620/mes. Con 1 proyecto/mes se empata; con 2+ se acumula.
- **Implicación operativa**: AGLAYA necesita cerrar mínimo 2 proyectos/mes para que el modelo respire.

---

## 5. Catálogo de productos base

### Decisión

| Producto | Precio base | Páginas / scope incluido |
|---|---|---|
| Landing Page | $2,900 | 1 página, orientada a conversión |
| Sitio Corporativo | $4,500 | 5 páginas (Home, About, Services, Contact + 1 libre) |
| Product Marketing Site | $7,500 | 5 páginas (Home, Features, Pricing, About, Contact) — mayor complejidad de diseño e interactividad |
| E-commerce | $9,500 | Catálogo hasta 20 productos + Home, About, Contact, Checkout |

Páginas adicionales sobre el scope base: **+$250/página** (ver sección 6).

### Rationale
- Los 4 tipos cubren el 90%+ de lo que un cliente digital necesita.
- **Product Marketing Site** = sitio de marketing PARA un SaaS o producto digital (ej: stripe.com, linear.app). No la app en sí. Mismo número de páginas que el Corporativo pero con mayor complejidad de interacciones, feature showcases, CTAs de conversión y pricing pages → precio más alto justificado por complejidad técnica y de diseño.
- La diferencia Corporativo / Product Marketing NO es páginas sino densidad de interacción y orientación a conversión.
- La Landing Page arranca en $2,900 (no $2,800) para dejar margen de revisiones sin que salgan del bolsillo de Ibai.
- El E-commerce usa productos como unidad de scope (no páginas), por su distinta naturaleza técnica: catálogo, fichas, carrito, checkout, inventory.
- Los precios son en USD → aplican igual a cliente gringo y a cliente LatAm que quiere posicionarse internacionalmente.

---

## 6. Módulos add-on

### Decisión

| Módulo | Precio | Notas |
|---|---|---|
| Idioma adicional (EN/ES/PT) | +$600 | Por cada idioma extra sobre el base |
| Blog / sección de contenido | +$500 | Setup + estructura + 1 post inicial |
| CMS editable por el cliente | +$900 | Decap CMS u equivalente sobre Astro |
| Copywriting por página | +$200 | Por página adicional redactada por AGLAYA |
| Animaciones custom | +$800 | Interacciones no incluidas en el diseño base |
| Integración adicional (CRM, ESP extra) | +$400 | Una ESP incluida en precio base |
| Analytics avanzado (Mavi, mensual) | +$500/mes | Dashboards, reporting, optimización continua |
| Página adicional | +$250 | Sobre el número incluido en el producto base |

### Rationale
- **Una ESP incluida**: la integración con MailerLite (o equivalente) forma parte del flujo base de captura de leads. Todo lo que vaya más allá es valor adicional.
- **SEO técnico**: incluido en el precio base de todos los productos. Es innegociable para AGLAYA — no tiene sentido entregar un sitio sin ello.
- **Analytics básico (GA setup)**: incluido en base. El módulo de Mavi es para trabajo ongoing experto, no para la conexión inicial.
- **Blog**: se cobra el setup + el CMS por separado porque son decisiones independientes (puedes querer blog sin CMS, o CMS sin blog).
- **Copywriting por página**: refleja el tiempo de redacción estratégica, no solo traducción.

---

## 7. Módulos de infraestructura

### Decisión (para clientes sin infraestructura propia)

| Servicio | Precio |
|---|---|
| Setup hosting + dominio + DNS | +$300 (one-time) |
| Gestión hosting mensual | +$80/mes |

### Rationale
- Al precio objetivo ($2,900+), la mayoría de clientes ya tienen dominio y hosting. Pero existe la eventualidad.
- El setup one-time cubre el tiempo de configuración. La gestión mensual cubre mantenimiento, renovaciones, incidencias.
- AGLAYA conoce Netlify profundamente → esto no es carga operativa significativa.

---

## 8. Modificador de urgencia

### Decisión

| Plazo | Modificador |
|---|---|
| Entrega normal (4–6 semanas) | Sin cambio |
| Entrega rápida (< 3 semanas) | +80% |
| Entrega urgente (< 2 semanas) | +150% |

### Rationale
- El precio prohibitivo es **intencional**. AGLAYA no quiere trabajar bajo presión de urgencia artificial.
- Si un cliente lo elige de todas formas, el precio extra compensa el coste real: Ibai trabaja fuera de horario, el equipo se reorganiza, la calidad tiene más riesgo.
- Funciona como filtro: solo clientes con urgencia genuina y presupuesto real lo activan.

---

## 9. Política de revisiones

### Decisión
- **Incluidas en precio**: 2 rondas de revisiones.
- **Ronda adicional**: +$200.

### Rationale
- Sin política de revisiones, el cliente puede alargar un proyecto indefinidamente. Ibai ya tiene experiencia de que "tres patadas" se pueden convertir en un calvario.
- 2 rondas es estándar en agencias boutique. Suficiente para un cliente razonable; escaso para uno indeciso → el costo adicional actúa de incentivo para que el cliente llegue con decisiones claras.
- El +$200 por ronda extra no es punitivo, es real: cada ronda implica reunión, cambios, QA, despliegue.

---

## 10. Lo que siempre está incluido (base no negociable)

Estos servicios forman parte del precio base de cualquier producto, sin excepción:

- SEO técnico inicial (meta tags, structured data, sitemap, robots.txt)
- Setup Analytics básico (GA4 conectado y verificado)
- 1 integración ESP (MailerLite por defecto)
- Diseño responsive (mobile-first)
- Accesibilidad WCAG 2AA básica
- Entrega en repositorio Git del cliente (o repo privado AGLAYA si no tiene)

### Rationale
Estos son los mínimos de calidad de AGLAYA. No existe un proyecto sin ellos → no se ofrecen como opcionales porque degradaría la percepción de marca si alguien los "ahorra".

---

## 11. Lo que NO existe en el catálogo

- **Diseño custom vs. plantilla**: todos los proyectos AGLAYA son custom (Ibai + Claude). No hay distinción de tier en diseño.
- **Proyectos por debajo de $2,900**: no existen. Si un prospecto no puede pagar el mínimo, no es cliente de AGLAYA.
- **Proyectos sin revisiones definidas**: toda propuesta especifica las 2 rondas incluidas desde el inicio.

---

## 12. Decisiones técnicas y de producto

### Generación del PDF
**Netlify Function + `pdfkit`** — equivalente Node.js de Python/reportlab (el mismo stack del PDF de Bill Capital). Generación programática: texto vectorial crispísimo, layouts precisos, branding AGLAYA completo. Sin puppeteer, sin headless Chrome, sin API externa. La Netlify Function recibe los datos del formulario, genera el PDF en memoria y lo envía por email al prospecto (vía Resend). Cold start mínimo, cero costo variable.

**Descartado:** `window.print()` produce resultados inconsistentes entre navegadores y no admite control de layout profesional.

### Ubicación
Página dentro de **aglaya.biz**: `/quote` (EN). Ruta propia, no subdominio separado. Integrado en el mismo repo y deploy.

### Visibilidad al lanzar
**Unlisted**: la URL `/quote` existe y es accesible si se conoce, pero no aparece en el nav ni en el sitemap. Se añade `noindex` hasta que Ibai la verifique y decida hacerla pública. Un solo commit cambia eso.

### Gate de email y UX del precio
El formulario ES el paso final del cotizador. El precio no se muestra mientras el usuario configura — aparece al hacer submit. El último campo del form es la dirección de envío: *"Where should we send your quote?"*. Sin presión, sin pop-up de gate, el form es la experiencia natural de cierre.

Flujo:
1. Usuario configura su proyecto (elige producto base + módulos).
2. Rellena el formulario: nombre, empresa (opcional), email.
3. Último campo: "Where should we send your quote?" (email).
4. Al submit:
   - El precio aparece confirmado en pantalla.
   - La Netlify Function genera el PDF con pdfkit y lo envía al email del prospecto vía Resend.
   - El lead (nombre + email + configuración del proyecto) entra en MailerLite grupo "Cotizaciones".

### Idioma v1
**Trilingüe desde el lanzamiento: EN / ES / PT.** El i18n ya está montado en el proyecto (`src/i18n/translations.ts`). Las rutas siguen la convención existente: `/quote` (EN), `/es/quote` (ES), `/pt/quote` (PT). Todas las cadenas del cotizador van al sistema i18n — cero strings hardcodeados.

---

## 13. Decisiones cerradas

Todas las preguntas previas están resueltas. No hay pendientes antes de codear.

| Variable | Valor |
|---|---|
| MailerLite grupo cotizador | `Cotizaciones` — Group ID: `186446693070276318` |
| Branding del PDF | AGLAYA completo: logo, rojo `#e8003d`, tipografía, tagline |
| Email de confirmación al prospecto | Sí — enviado vía Resend con el PDF adjunto |
| Idioma v1 | Trilingüe: EN / ES / PT (rutas `/quote`, `/es/quote`, `/pt/quote`) |
| Visibilidad al lanzar | Unlisted + `noindex` |

---

*Última actualización: 2026-05-03*
