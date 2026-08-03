# aglaya-os — respaldo, auditoría y decisiones

**Qué es este directorio:** la **fuente** del plugin `aglaya-os`. Desde v0.2.0 ya
no es una fotocopia: el plugin se instala desde este repo mediante el marketplace
local [`.claude-plugin/marketplace.json`](../../.claude-plugin/marketplace.json).
`git pull` es el despliegue. Ver §9.

Llegó aquí el 2026-08-03 (PR #120) porque hasta esa fecha **no existía en ningún
git**. En ese primer commit los ficheros entraron **sin editar**. Las decisiones
del Operador se aplicaron después, en v0.2.0, y están registradas en §7–§9.

---

## 1. Dónde vivía antes

El plugin no estaba en el disco como proyecto. Estaba subido a claude.ai
(marketplace **«My Uploads»**, `marketplace_019KaVTfj55TXghXyj8Kj34V`) y lo que
había en esta máquina era la **caché local que descarga la app de escritorio**:

```
~/Library/Application Support/Claude/local-agent-mode-sessions/<session>/<workspace>/rpm/plugin_01GkUPDdfNRLWBLznVEKN2o9/
```

`rpm/manifest.json` es el índice que asocia `plugin_01GkUPDdfNRLWBLznVEKN2o9` →
`aglaya-os`. Por eso ninguna búsqueda por nombre lo encontraba: **en disco el
directorio no se llama `aglaya-os`**, se llama por su id opaco. En
`~/.claude.json` aparecía como `aglaya-os@inline` — «inline» es el marketplace
gestionado por la app, no uno de los siete de `~/.claude/plugins/marketplaces/`.

Esa caché es **derivada y desechable**: vive bajo una ruta de sesión y se
resincroniza desde la nube. Editarla parece funcionar y se revierte en silencio.
No es un camino de despliegue; es una trampa. Por eso se montó §9.

---

## 2. Qué hay hoy (v0.2.0)

| Skill | Estado |
|---|---|
| `brand-voice` | **VIVA**, congelada a propósito (§8) |
| `outreach` | jubilada en 0.2.0 (§7) |
| `case-study` | jubilada en 0.2.0 (§7) |
| `proposal` | jubilada en 0.2.0 (§7) |
| `roi-audit` | jubilada en 0.2.0 (§7) |

Ficheros vivos: `.claude-plugin/plugin.json`, `README.md`, esta nota,
`context/brand-dna.md`, `commands/brand-voice.md`, `skills/brand-voice/SKILL.md`
y su `references/voice-guidelines.md`.

`hooks/hooks.json` **se eliminó** en 0.2.0 (§8).

---

## 3. Hallazgo mayor de la auditoría: recitaba precios en vez de preguntarlos

La regla de la flota es que **la verdad comercial no vive en los repos de las
naves**: se pregunta en vivo (`verdad_comercial()` del MCP `aglaya-atlas`). El
plugin hacía justo lo contrario — clavaba el modelo de negocio a mano en **9 de
los 19 ficheros** originales:

| Cifra clavada | Dónde (rutas del commit `40b4a1d`) |
|---|---|
| Retainer $8.000/mes | `context/brand-dna.md`, `README.md`, `skills/proposal/SKILL.md`, `skills/roi-audit/SKILL.md`, `skills/brand-voice/SKILL.md`, `skills/outreach/references/icp-and-messaging.md`, `skills/proposal/references/proposal-structure.md`, `skills/roi-audit/references/audit-framework.md` |
| ROI Audit $1.500 | `context/brand-dna.md`, `README.md`, `skills/roi-audit/SKILL.md` |
| Umbral >$15.000/mes | los ocho anteriores + `commands/roi-audit.md`, `commands/brand-voice.md`, `skills/brand-voice/references/voice-guidelines.md` |
| MRR objetivo $16.000 · máx. 2 clientes | `context/brand-dna.md`, `README.md` |
| Año 1 = $96.000 | `skills/proposal/SKILL.md`, `skills/roi-audit/references/audit-framework.md` |

Consultado `verdad_comercial()` el 2026-08-03, la escalera vigente es otra y el
retainer de $8.000/mes no aparece en ella. Esa consulta es la base de §7.

---

## 4. Otros hallazgos de la auditoría inicial

- **Cuatro rutas que no resuelven.** `context/brand-dna.md:5` remite a
  `docs/BRAND-DNA.md`, `docs/BRAND-STRATEGY.md`, `docs/SERVICES-AI.md` y
  `docs/MARKETING-STRATEGY.md`. Ninguna existe. Lo más parecido hoy en esta nave
  es [`docs/brand/dna/BRAND-FOUNDATION.md`](../../docs/brand/dna/BRAND-FOUNDATION.md)
  y [`docs/brand/mkt/MARKETING-OPERATING-SYSTEM.md`](../../docs/brand/mkt/MARKETING-OPERATING-SYSTEM.md);
  para `BRAND-STRATEGY` y `SERVICES-AI` no se encontró sucesor. **Sigue roto** —
  vive dentro de `brand-dna.md`, que está congelado con `brand-voice` (§8).
- **Casos de estudio muertos.** POCURO, Leben y Norden. Leben y Norden estaban en
  `[Industry TBD]` — vacíos desde el principio. Los tres archivados con
  `noindex:true` desde el reencuadre de la sección Proof (2026-06-03). Resuelto
  por jubilación de `case-study` y `outreach` (§7); la mención en
  `context/brand-dna.md:156` sobrevive, congelada (§8).
- **Sin secretos.** Barrido de patrones de credencial sobre los 19 ficheros
  originales: cero coincidencias.

---

## 5. Las dos discrepancias que traía el encargo original

**«Existía una `aglaya-os:proposal-ley21719`».** No aparece. Ni en `aglaya-os` ni
en `ibai-brand-os` hay una sola mención a la Ley 21.719, al escáner o a
`consent-ledger-wp`. La `aglaya-os:proposal` que existía era la propuesta de
retainer de $8.000/mes: no es la misma cosa con otro nombre, es otra cosa. O la
nota era errónea, o la skill se borró antes del 2026-08-03. No hay rastro en
disco que distinga entre ambas; **no se resuelve por decreto**.

**«13 skills comerciales entre las dos familias, hoy 12».** Ambas cifras miden
mal. El recuento real en el momento del respaldo:

| Familia | SKILL.md | Comandos | Unión de nombres |
|---|---|---|---|
| `aglaya-os` | 5 | 5 (mismos nombres) | 5 |
| `ibai-brand-os` | 5 | 5 | 7 |
| **Total** | **10** | **10** | **12** |

Los 12 visibles eran la unión de nombres, no skills. De dónde salía el 13 no
consta.

---

## 6. Qué NO se respaldó aquí, y por qué

`ibai-brand-os` (`plugin_01MJgv8HwwNEdbYcF2bdMaLr`, misma caché, mismo
marketplace «My Uploads», 18 ficheros, 5 skills: `brand-audit`, `linkedin-post`,
`content-strategy`, `proposal`, `case-study-packager`) es marca personal de Ibai,
no de la agencia. Por la regla del Operador —nada de repo nuevo, cada cosa a su
nave— va a su repo de portfolio, en su propio hilo. **Sigue sin respaldar.**

Nada de las dos familias pertenece a `legal-reg-tech`: ninguna toca el escáner ni
la Ley 21.719.

---

## 7. Jubilaciones (v0.2.0 · 2026-08-03)

Decisión del Operador tras los cinco veredictos. **Jubilar no es borrar del
repo:** los cuatro directorios salen del plugin activo y su última versión
completa vive en el commit **`40b4a1d`** (`chore(plugins): back up the aglaya-os
plugin, which lived in no repo`, PR #120). Recuperar una es un `git checkout`:

```bash
git checkout 40b4a1d -- plugins/aglaya-os/skills/outreach plugins/aglaya-os/commands/outreach.md
```

El criterio no fue «¿está desfasada?» sino «¿le sirve al negocio de HOY?»,
preguntado en vivo a `verdad_comercial()`, nunca a un documento.

### `outreach` — jubilada

**Qué hacía:** generaba DMs de LinkedIn y correo frío para prospectos, filtrados
por un ICP de 20–200 empleados que gastaran >$15.000/mes en trabajo manual, en
inmobiliaria/fintech/ecommerce/SaaS. El CTA del tercer mensaje ofrecía el ROI
Audit de $1.500.

**Por qué se jubila:** el outbound de hoy tiene otro ICP y, sobre todo, la jugada
inicial está invertida. La verdad comercial dice: *«Outbound (Apollo): plan
íntegro y bueno, **congelado a media etapa**. ICP definido (Chile · retail +
internet + consumer services · 10-100 empleados). Arma secreta: **el scanner
cualifica antes de escribir**, así que se abre con evidencia del sitio del
target, no con un pitch.»* Y queda un choque sin verificar contra Outreach, el
empleado IA que consume el CRM. Lo que sobrevivía del texto era un párrafo. Si se
descongela el canal, se escribe una skill nueva, no se repara ésta.

**Última versión completa:** `40b4a1d` — `skills/outreach/`, `commands/outreach.md`.

### `case-study` — jubilada

**Qué hacía:** empaquetaba resultados de cliente en cuatro entregables — caso de
estudio de 400–600 palabras, post de prueba para LinkedIn, «Social Proof Brief»
para que *el cliente* lo publicara en sus canales, y newsletter.

**Por qué se jubila:** los cuatro entregables presuponen un cliente de retainer,
y hoy no lo hay. La verdad comercial dice: *«AGLAYA factura por **un** producto
vivo: el **plugin WordPress `consent-ledger-wp`**»*, *«Self-serve, vía Lemon
Squeezy. Lo único que factura hoy.»* No hay cliente al que entregarle un brief de
prueba social. Además vendía con POCURO, Leben y Norden (§4). La prueba que sí
necesita el negocio —el estudio propio del escáner, la prueba de producto— es
otra cosa y sería otra skill.

**Última versión completa:** `40b4a1d` — `skills/case-study/`, `commands/case-study.md`.

### `proposal` — jubilada

**Qué hacía:** propuesta de retainer de $8.000/mes, mínimo 3 meses, con tabla de
caso de negocio a $96.000/año y «rendimiento conservador del 70%».

**Por qué se jubila:** el money-path de hoy no tiene propuesta, tiene checkout. Y
el servicio, que sí la tendría, se cotiza a medida: *«Servicio: presupuesto **a
medida**, con piso, base horaria y 3 factores de alcance (tecnología del sitio ·
nº de formularios · nº de rastreadores dependientes de consentimiento).* ***«Un
precio único es deshonesto e insostenible.»***» Exactamente lo contrario de lo
que la skill produce. Súmese la decisión del 2026-06-14: *«Los CTA de venta van a
correo directo, sin cifra de precio. El precio se ve en la landing, que es su
fuente; repetirlo en el correo crea dos verdades.»* Esta skill fabricaba la
segunda verdad.

**Última versión completa:** `40b4a1d` — `skills/proposal/`, `commands/proposal.md`.

### `roi-audit` — jubilada

**Qué hacía:** estructuraba el engagement pagado de $1.500 (dos semanas, cuatro
entregables) que cualificaba al cliente para el retainer, con una «Honesty
Clause» que abortaba si no encontraba $15.000/mes automatizables.

**Por qué se jubila:** ese producto fue sustituido por uno gratis. La verdad
comercial dice: *«Cebo — Scanner 21.719 (gratis). Imán de leads. **No es
producto** (ADR-010).»* La cláusula protege la puerta a un retainer que ya no se
vende. Encima el nombre choca con superficies vivas de esta nave: `/roi-audit` es
una página con el embudo ICP embebido, y existe `/diagnostic`.

**Última versión completa:** `40b4a1d` — `skills/roi-audit/`, `commands/roi-audit.md`.

---

## 8. El hook fuera, y qué se rompió al quitarlo (v0.2.0)

`hooks/hooks.json` ejecutaba `cat ${CLAUDE_PLUGIN_ROOT}/context/brand-dna.md` en
**`SessionStart`**, sin filtro. Es decir: inyectaba el modelo de negocio muerto
—retainer de $8.000, dos clientes, umbral de $15.000— en **toda** sesión con el
plugin activo, se usara la skill que se usara. `skillUsage` en `~/.claude.json`
solo registraba `brand-voice` (7 usos) y `outreach` (1): la superficie real del
plugin no eran las skills, era el hook. **Eliminado.**

### Regresión conocida, no reparada a propósito

Quitar el hook deja `context/brand-dna.md` sin cargar automáticamente. Efecto
medido, ruta por ruta:

| Ruta de entrada | Antes | Ahora |
|---|---|---|
| `/aglaya-os:brand-voice` **generando** contenido | hook + `Read` explícito | **intacta** — `commands/brand-voice.md:30` hace `Read @${CLAUDE_PLUGIN_ROOT}/context/brand-dna.md` |
| `/aglaya-os:brand-voice` **auditando** contenido | solo el hook | **pierde** el contexto de marca: esa rama del comando nunca lo leyó por sí misma |
| skill `brand-voice` invocada sola | solo el hook | **pierde** el contexto: `skills/brand-voice/SKILL.md` dice «Consider `brand-dna.md` as the SSOT» **sin ruta**, así que no puede leerlo |

No se ha reparado porque la reparación exige editar `brand-voice`, y esa skill
está congelada por decisión (abajo). El arreglo, cuando toque, es una línea:
darle a la skill la ruta explícita, o mejor, que pregunte en vivo.

### `brand-voice` está congelada A PROPÓSITO

No es deuda ni un pendiente olvidado. Su veredicto fue ARREGLAR, y el arreglo
propuesto —que saque las reglas de voz del Design System en vez de recitar diez
mandamientos escritos a mano— **está en revisión**: el Operador aún no ha
decidido si lo que dice hoy el Design System es lo que quiere decir. Esa
conversación es aparte. Hasta que se cierre, la skill se queda tal cual.

Lo que se sabe y espera a esa decisión:

- `get_voice_rules()` del MCP `aglaya-ds` devuelve reglas que la skill no tiene:
  vocabulario protegido (`Sovereignty`, `Signal`, `Protocol`, `Zero-leak`,
  `Dispatch` — nunca «newsletter»), casing, pronombres, patrones prohibidos.
  Existen además `check_voice()` e `is_allowed_word()`, validadores en vivo.
- La skill sigue diciendo *«Address the $1M–$50M revenue tier»*, *«does it sound
  like a $8K/month firm»* y el CTA *«If your team spends $15K+/month on manual
  work, this is for you»*. Vocabulario del negocio muerto.
- Le faltan las líneas rojas vigentes, que son de riesgo legal y no de estilo:
  nunca «cumplimiento 100% en un clic»; multas = dato objetivo de la ley, jamás
  amenaza; «he leído / tomo conocimiento», nunca «acepto/consiento».

Por eso `context/brand-dna.md` sigue en el repo con la tabla del modelo viejo: lo
lee `brand-voice`. **No es fuente válida de verdad comercial** — esa se pregunta
con `verdad_comercial()`.

---

## 9. Instalación y vuelta atrás (vía B — el repo es la fuente)

Desde v0.2.0 el plugin **no se sirve desde la nube**. Se sirve desde este repo.

### Qué cambia en la máquina

Dos entradas en `~/.claude/settings.json`: un marketplace llamado `aglaya-biz`
que apunta a la ruta local del repo, y el plugin `aglaya-os@aglaya-biz` en
`enabledPlugins`. Nada más. No se toca la nube, no se borra nada de claude.ai.

### Ida

```bash
claude plugin marketplace add "/Users/AGLAYA/Local Sites/aglaya.biz"
claude plugin install aglaya-os@aglaya-biz
```

Después, en la app de escritorio, **desactivar `aglaya-os` de «My Uploads»** para
que las dos copias no compitan (mismos nombres de skill y comando). Esa parte es
manual: la CLI no ve los plugins `@inline`.

### Vuelta atrás

```bash
claude plugin uninstall aglaya-os@aglaya-biz
claude plugin marketplace remove aglaya-biz
```

Y reactivar `aglaya-os` de «My Uploads» en la app. La copia de la nube nunca se
tocó, así que vuelve tal como estaba en v0.1.1.

### Desplegar un cambio

`git pull`. Si la instalación quedó cacheada en vez de leer del directorio:

```bash
claude plugin marketplace update aglaya-biz
claude plugin update aglaya-os@aglaya-biz
```

### Lo que este montaje NO hace

La copia de claude.ai **sigue en v0.1.1 con las cinco skills y el hook**. Este
repo no la actualiza y no hay forma automática de hacerlo: `claude plugin` no
tiene `publish` ni `upload`, y la CLI no ve el marketplace «My Uploads». Si algún
día se quiere la nube al día, se sube a mano desde claude.ai. Mientras esté
desactivada en la app, da igual.
