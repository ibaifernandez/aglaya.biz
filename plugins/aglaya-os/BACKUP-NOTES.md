# aglaya-os — respaldo y auditoría

**Qué es este directorio:** una copia byte a byte del plugin `aglaya-os` v0.1.1,
traída al repo el 2026-08-03 porque hasta esa fecha **no existía en ningún git**.
Los ficheros están **sin editar**. Auditar es señalar; arreglar es otra
conversación. Todo lo que sigue son hallazgos, no cambios aplicados.

## 1. Dónde vivía

El plugin no estaba en el disco como proyecto. Estaba subido a claude.ai
(marketplace **«My Uploads»**, `marketplace_019KaVTfj55TXghXyj8Kj34V`) y lo que
hay en esta máquina es la **caché local que descarga la app de escritorio**:

```
~/Library/Application Support/Claude/local-agent-mode-sessions/<session>/<workspace>/rpm/plugin_01GkUPDdfNRLWBLznVEKN2o9/
```

`rpm/manifest.json` es el índice que asocia `plugin_01GkUPDdfNRLWBLznVEKN2o9` →
`aglaya-os`. Por eso ninguna búsqueda por nombre lo encontraba: **en disco el
directorio no se llama `aglaya-os`**, se llama por su id opaco. En
`~/.claude.json` aparece como `aglaya-os@inline` — «inline» es el marketplace
gestionado por la app, no uno de los siete de `~/.claude/plugins/marketplaces/`.

Consecuencia operativa: esa caché es **derivada y desechable**. Vive bajo una
ruta de sesión; si la app la limpia o la sesión se rota, desaparece sin aviso.
La única otra copia es la nube de claude.ai. Este directorio es ahora la
tercera, y la primera versionada.

## 2. Qué hay (19 ficheros)

| Skill | SKILL.md | Reference |
|---|---|---|
| `brand-voice` | ✔ | `references/voice-guidelines.md` |
| `case-study` | ✔ | `references/case-study-format.md` |
| `outreach` | ✔ | `references/icp-and-messaging.md` |
| `proposal` | ✔ | `references/proposal-structure.md` |
| `roi-audit` | ✔ | `references/audit-framework.md` |

Más: `.claude-plugin/plugin.json`, `README.md`, `context/brand-dna.md`,
`hooks/hooks.json` y cinco comandos homónimos en `commands/`.

**Skills reales: 5.** Los «12» que se ven en una sesión son la unión de nombres
de *comandos + skills* de las dos familias (`aglaya-os` 5 + `ibai-brand-os` 7),
no doce skills. Ver §5.

## 3. Hallazgo mayor: recita precios en vez de preguntarlos

La regla de la flota es que **la verdad comercial no vive en los repos de las
naves**: se pregunta en vivo (`verdad_comercial()` del MCP `aglaya-atlas`). Este
plugin hace justo lo contrario — clava el modelo de negocio a mano en **9
ficheros de 19**:

| Cifra clavada | Dónde |
|---|---|
| Retainer $8.000/mes | `context/brand-dna.md`, `README.md`, `skills/proposal/SKILL.md`, `skills/roi-audit/SKILL.md`, `skills/brand-voice/SKILL.md`, `skills/outreach/references/icp-and-messaging.md`, `skills/proposal/references/proposal-structure.md`, `skills/roi-audit/references/audit-framework.md` |
| ROI Audit $1.500 | `context/brand-dna.md`, `README.md`, `skills/roi-audit/SKILL.md` |
| Umbral >$15.000/mes | los ocho anteriores + `commands/roi-audit.md`, `commands/brand-voice.md`, `skills/brand-voice/references/voice-guidelines.md` |
| MRR objetivo $16.000 · máx. 2 clientes | `context/brand-dna.md`, `README.md` |
| Año 1 = $96.000 | `skills/proposal/SKILL.md`, `skills/roi-audit/references/audit-framework.md` |

Consultado `verdad_comercial()` el 2026-08-03, la escalera de oferta vigente del
capitán es otra: plugin Ley 21.719 en escalones (1 sitio · Agencia 5 · 20 · 50),
promo 10 fundadores, y **servicio a presupuesto a medida** con la nota literal
«un precio único es deshonesto e insostenible». El retainer de $8.000/mes no
aparece en esa escalera. El GTM además se niega explícitamente a escribir cifras
y remite a la landing viva y a Lemon Squeezy.

Dicho de otro modo: estas skills no están «un poco desfasadas», están
**construidas sobre un modelo comercial que el capitán ya no describe**, y lo
recitan con autoridad. Precedente conocido: un verificador de otra nave copió su
vocabulario a mano y se desfasó seis semanas sin que nadie se enterara, porque
ningún test lo miraba. Aquí tampoco hay ningún test que lo mire.

**Propuesta (no aplicada):** que `context/brand-dna.md` deje de contener la tabla
de «Modelo de Negocio» y en su lugar instruya *preguntar* `verdad_comercial()`;
y que `proposal` / `roi-audit` / `outreach` lean el umbral y el precio de ahí en
vez de tenerlos en el cuerpo del prompt.

## 4. Otros hallazgos

- **Cuatro rutas que no resuelven.** `context/brand-dna.md:5` remite a
  `docs/BRAND-DNA.md`, `docs/BRAND-STRATEGY.md`, `docs/SERVICES-AI.md` y
  `docs/MARKETING-STRATEGY.md`. Ninguna existe. Lo más parecido hoy en esta nave
  es [`docs/brand/dna/BRAND-FOUNDATION.md`](../../docs/brand/dna/BRAND-FOUNDATION.md)
  y [`docs/brand/mkt/MARKETING-OPERATING-SYSTEM.md`](../../docs/brand/mkt/MARKETING-OPERATING-SYSTEM.md);
  para `BRAND-STRATEGY` y `SERVICES-AI` no se encontró sucesor. Además son rutas
  relativas a un repo que el plugin no nombra — el plugin no vivía en ningún
  repo, así que nunca resolvieron desde donde se ejecuta.
- **Casos de estudio muertos.** `skills/case-study/SKILL.md:84` y su reference
  citan POCURO, Leben y Norden como «existing cases»; Leben y Norden están en
  `[Industry TBD]` / «gather results data», es decir, vacíos desde el principio.
  POCURO se usa además como prueba social en `skills/outreach/SKILL.md:57` y en
  `context/brand-dna.md:156`. Los tres están archivados con `noindex:true` en el
  sitio desde el reencuadre de la sección Proof (2026-06-03), donde la narrativa
  pasó a ser de producto, no de case study de cliente. La skill sigue vendiendo
  con ellos.
- **El hook lee un fichero del plugin.** `hooks/hooks.json` hace
  `cat ${CLAUDE_PLUGIN_ROOT}/context/brand-dna.md` en `SessionStart`. Funciona
  mientras el plugin se instale como plugin; **esta copia del repo no ejecuta
  nada** — es respaldo, no instalación.
- **Sin secretos.** Barrido de patrones de credencial sobre los 19 ficheros: cero
  coincidencias. Nada que sanear antes de versionar.

## 5. Las dos discrepancias que traía el encargo

**«Existía una `aglaya-os:proposal-ley21719`».** No aparece. Ni en `aglaya-os` ni
en `ibai-brand-os` hay una sola mención a la Ley 21.719, ni al escáner, ni a
`consent-ledger-wp`. La `aglaya-os:proposal` que sí existe es la propuesta de
retainer de $8.000/mes descrita arriba: no es la misma cosa con otro nombre, es
otra cosa. Las dos lecturas compatibles con la evidencia son que la nota fuera
errónea, o que la skill existiera y se borrara antes del 2026-08-03. No hay
rastro en disco que distinga entre ambas; **no se resuelve por decreto**.

**«13 skills comerciales entre las dos familias, hoy 12».** Las dos cifras miden
mal. El recuento real:

| Familia | SKILL.md | Comandos | Unión de nombres |
|---|---|---|---|
| `aglaya-os` | 5 | 5 (mismos nombres) | 5 |
| `ibai-brand-os` | 5 | 5 | 7 |
| **Total** | **10** | **10** | **12** |

Los 12 visibles son la unión de nombres, no skills. Las skills de verdad son 10.
De dónde salía el 13 no consta.

## 6. Qué NO se respaldó aquí, y por qué

`ibai-brand-os` (`plugin_01MJgv8HwwNEdbYcF2bdMaLr`, misma caché, mismo
marketplace «My Uploads», 18 ficheros, 5 skills: `brand-audit`,
`linkedin-post`, `content-strategy`, `proposal`, `case-study-packager`) es marca
personal de Ibai, no de la agencia. Por la regla del Operador — nada de repo
nuevo, cada cosa a su nave — va a su repo de portfolio, en su propio hilo.
**Sigue sin respaldar.** Su fuente única sigue siendo la nube de claude.ai más
la misma caché volátil.

Nada de las dos familias pertenece a `legal-reg-tech`: ninguna toca el escáner
ni la Ley 21.719.
