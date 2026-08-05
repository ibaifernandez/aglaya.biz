---
status: active
domain: operations
owner: aglaya.biz
source_of_truth: false
supersedes: []
superseded_by: []
last_reviewed: 2026-08-05
consumable_by_agents: true
---

# Informe al capitán — el plugin `aglaya-os`

**De:** hilo de `aglaya.biz` (2026-08-03 → 2026-08-05)
**Para:** orquestador AGLAYA
**Qué es esto:** historia y decisiones, no estado. Todo lo que aquí se afirma es
lo que pasó en unas fechas concretas. Lo que sea estado vivo va marcado con la
pregunta y la herramienta con que se comprueba, nunca con la respuesta.

---

## 1. Qué se vino a hacer

Tres encargos sucesivos del Operador, en un solo hilo:

1. **Localizar y respaldar.** Existían cinco skills con prefijo `aglaya-os:`
   disponibles en las sesiones de Claude de esta máquina, sin copia conocida en
   ningún repositorio. Y un problema previo: no se sabía dónde vivían sus
   ficheros. Se había buscado el 2026-08-03 en `~/.claude/skills/`, en
   `installed_plugins.json`, en los marketplaces locales y por nombre de
   directorio. No estaban en ninguno.
2. **Auditar y decidir destino.** Un veredicto por skill —MANTENER, ARREGLAR o
   JUBILAR— con el criterio explícito de «¿le sirve al negocio de HOY?»,
   preguntado en vivo, nunca a un documento.
3. **Aplicar lo aprobado.** Con una regla que mandaba sobre las demás: arreglar
   no es actualizar la cifra, es que la skill **deje de recitar y pregunte**.

---

## 2. El hallazgo que le toca a la flota, no a esta nave

Las skills no estaban en disco como proyecto. Estaban **subidas a la cuenta de
claude.ai del Operador**, en un marketplace llamado «My Uploads». Lo que había en
la máquina era la caché que descarga la app de escritorio, bajo una ruta de
sesión, y con el directorio nombrado por **id opaco del plugin**, no por nombre.
Sólo un `manifest.json` interno traduce id → nombre.

De ahí que ninguna búsqueda por nombre las encontrara, ni antes ni durante.

**Por qué esto importa a nivel de flota, y no sólo aquí:**

- Es una **clase entera de activos de AGLAYA que ningún repo contiene**. No
  aparecen en `repo_estado`, no aparecen en `flota_estado`, no aparecen en la
  ficha de ninguna nave. El atlas no puede verlos porque no viven en un git.
- La caché local es **derivada y desechable**: vive bajo ruta de sesión y se
  resincroniza desde la nube. Editarla parece funcionar y se revierte en
  silencio. Es una trampa, no un camino.
- El único respaldo era la cuenta del proveedor. Un formateo, o una cuenta
  perdida, y desaparecían sin dejar rastro en ninguna parte de la flota.

Había un segundo activo en esa situación, `ibai-brand-os` — misma caché, mismo
marketplace, cinco skills. **Resuelto el 2026-08-05: es marca personal de Ibai,
queda fuera del radar de la flota y lo lleva él en un hilo del portafolio.** No
se adopta ni se versiona aquí. Se deja anotado sólo para que un hilo futuro que
tropiece con esa caché sepa qué es y no lo vuelva a levantar.

Lo que sí queda para la flota es la clase, no el caso: hoy no hay regla sobre
dónde deben vivir los plugins y skills de AGLAYA (§8).

---

## 3. La contaminación: no eran las skills, era el hook

`hooks/hooks.json` del plugin ejecutaba `cat context/brand-dna.md` en
**`SessionStart`**, sin filtro ni condición.

`context/brand-dna.md` contenía el modelo de negocio de la agencia: retainer de
**$8.000/mes**, máximo **dos clientes simultáneos**, entrada por un **ROI Audit
de $1.500**, umbral de calificación **>$15.000/mes** de trabajo manual, MRR
objetivo **$16.000**.

Es decir: **toda sesión de Claude en esta máquina con el plugin activo arrancaba
con ese modelo comercial delante**, se usara la skill que se usara, se trabajara
en la nave que se trabajara. El registro de uso de skills sólo anotaba 7
invocaciones de `brand-voice` y 1 de `outreach`: la superficie real del plugin
nunca fueron las skills, era el hook.

El plugin estuvo instalado y activo desde el **2026-03-30**. El hook se retiró el
**2026-08-03**.

**Lo que el capitán debería considerar:** cualquier hilo de cualquier nave en
esta máquina, en esa ventana de cuatro meses, pudo estar cebado con un modelo
comercial que la verdad comercial vigente no describe. Si en algún hilo aparecen
supuestos de retainer, de «dos clientes», o de umbrales de $15.000 sin fuente,
ésta es una explicación plausible del origen. No lo afirmo: lo señalo como
hipótesis comprobable.

---

## 4. La auditoría, y por qué cuatro de cinco se jubilaron

Consultado `verdad_comercial()` los días 2026-08-03 y 2026-08-05. El criterio no
fue «¿está desfasada?» sino «¿le sirve al negocio de HOY?».

El plugin vendía retainers de $8.000/mes con dos clientes máximo. **Eso no es una
cifra vieja: es otro negocio.** La escalera vigente que devolvió el capitán no lo
contiene.

| Skill | Veredicto | Fundamento (frase del capitán) |
|---|---|---|
| `brand-voice` | **ARREGLAR** → congelada por decisión | (ver §6) |
| `outreach` | **JUBILAR** | outbound *«congelado a media etapa»*, otro ICP, y la jugada inicial invertida: hoy *«el scanner cualifica antes de escribir»* y se abre con evidencia del sitio, no con un pitch |
| `case-study` | **JUBILAR** | sus cuatro entregables presuponen cliente de retainer; hoy *«self-serve, vía Lemon Squeezy»* |
| `proposal` | **JUBILAR** | el money-path no tiene propuesta, tiene checkout; y el servicio es *«presupuesto a medida»* bajo *«un precio único es deshonesto e insostenible»* |
| `roi-audit` | **JUBILAR** | su producto fue sustituido por uno gratis: *«Cebo — Scanner 21.719 (gratis). Imán de leads. No es producto (ADR-010)»* |

Dato adicional que sostiene el diagnóstico: el modelo muerto estaba clavado a
mano en **9 de los 19 ficheros** del plugin. Es el mismo patrón que la flota ya
ha pagado otras veces —lo que se copia deja de proteger en silencio— pero aquí
con una diferencia: **ningún test lo miraba, y el hook lo repartía**.

---

## 5. Qué quedó hecho

Tres PR en `main` de `aglaya.biz`:

| PR | Qué |
|---|---|
| [#120](https://github.com/ibaifernandez/aglaya.biz/pull/120) | Respaldo íntegro y **sin editar** de los 19 ficheros en `plugins/aglaya-os/`, más la auditoría inicial |
| [#121](https://github.com/ibaifernandez/aglaya.biz/pull/121) | v0.2.0 — cuatro skills jubiladas, hook eliminado, marketplace local montado |
| [#122](https://github.com/ibaifernandez/aglaya.biz/pull/122) | v0.2.1 — corrección del camino de despliegue (ver §7) |

Además:

- **La copia de la nube quedó desactivada** en la app de escritorio, verificado en
  sesión nueva. Sigue existiendo intacta en v0.1.1 como red de seguridad; no se
  borró nada de la cuenta del Operador.
- **Jubilar no fue borrar.** Las cuatro skills salieron del plugin activo; su
  última versión completa vive en el commit `40b4a1d`, y
  `plugins/aglaya-os/BACKUP-NOTES.md` §7 registra, por cada una, qué hacía, la
  frase comercial que la jubila y el `git checkout` exacto para recuperarla.
- **Ningún secreto.** Barrido de patrones de credencial sobre los 19 ficheros
  originales antes de versionar: cero coincidencias.

---

## 6. Lo que queda abierto, y dónde se pregunta

**`brand-voice` está congelada A PROPÓSITO, no pendiente.** Su veredicto era
ARREGLAR. El arreglo propuesto —que saque las reglas de voz de su fuente viva en
vez de recitar diez mandamientos escritos a mano— depende de una decisión que el
Operador aún no ha tomado: si lo que dice hoy el Design System es lo que AGLAYA
quiere decir. Esa conversación corre en el hilo del `aglaya-design-system`.

Consecuencia asumida y documentada: al quitar el hook, dos de las tres rutas de
entrada de esa skill perdieron el contexto de marca que el hook les ponía
delante. Está medido ruta por ruta en `BACKUP-NOTES.md` §8 y **no se reparó**,
porque repararlo exige editar una skill congelada por decisión.

Sigue dentro de `context/brand-dna.md`, congelado con ella: la tabla del modelo
viejo, cuatro rutas a documentos que no existen, y la mención a un caso de
cliente archivado.

**Estado que no se escribe aquí:**

| Pregunta | Se contesta en |
|---|---|
| ¿Qué versión del plugin corre hoy? | `claude plugin list` en la máquina |
| ¿Qué dice hoy la verdad comercial? | `verdad_comercial()` |
| ¿En qué punto está la decisión de voz? | el hilo de `aglaya-design-system` |
| ¿Respaldó ya `ibai-brand-os`? | el hilo de su repo de portfolio |

---

## 7. Reutilizable por otras naves: el patrón de auto-hospedaje

`aglaya.biz` ahora **sirve su propio plugin** mediante un marketplace local
(`.claude-plugin/marketplace.json` en la raíz). Cualquier nave puede repetirlo.

Y con él, un aviso que costó descubrir y que se documentó porque casi se escribe
en falso:

> **`git pull` NO despliega.** Aunque el marketplace sea de tipo `directory` y
> apunte al repo, la instalación **copia** el plugin a una caché por versión y
> clava la instalación a un commit. El directorio de trabajo no se lee en vivo.
> Desplegar son tres comandos **y subir la `version` en `plugin.json`**: la caché
> va por directorio de versión, así que sin bump el instalador no tiene forma de
> saber que hay algo nuevo.

Comandos exactos, ida y vuelta atrás incluidas, en `plugins/aglaya-os/BACKUP-NOTES.md` §9.

**Lo que este patrón NO resuelve:** no hay camino automático desde un repo a un
plugin subido a claude.ai. La CLI no tiene `publish` ni `upload` y **no ve
siquiera** los plugins gestionados por la app. Sincronizar con la nube es manual,
o se prescinde de la nube — que es lo que se hizo aquí.

---

## 8. Dos preguntas que exceden a esta nave

1. **¿Dónde deben vivir los plugins y skills de la flota?** Hoy no hay regla, y
   la consecuencia medida es que un activo comercial estuvo cuatro meses fuera de
   todo git, invisible al atlas, cebando sesiones de todas las naves. Esta nave
   resolvió el suyo; la regla, si la hay, es del capitán.
2. **¿Quién es dueño de las líneas rojas de lenguaje legal?** El hilo del Design
   System ha detectado que existen reglas de lenguaje de ese tipo viviendo en el
   material comercial del capitán, y que quien escriba mirando sólo el Design
   System no las ve. La reacción natural —copiarlas al Design System— crearía dos
   fuentes; la alternativa es que el Design System **apunte** a
   `verdad_comercial()` en vez de copiar. Decisión de arquitectura, no de esta
   nave.

**Cerrada el 2026-08-05, y se deja escrita para que nadie la reabra:**
`ibai-brand-os` es **estrictamente personal**. Queda fuera del radar de la flota,
lo lleva Ibai en un hilo del portafolio, y ni se adopta ni se versiona en esta
nave.

---

## 9. Dos discrepancias del encargo, sin resolver por decreto

- Se creía que existía una skill `aglaya-os:proposal-ley21719`. **No aparece.** Ni
  en `aglaya-os` ni en `ibai-brand-os` hay una sola mención a la Ley 21.719, al
  escáner o al plugin de WordPress. La `proposal` que sí existía era la del
  retainer: otra cosa, no un renombrado. O la nota era errónea, o la skill se
  borró antes del 2026-08-03. No hay rastro en disco que distinga entre ambas.
- Se hablaba de «13 skills comerciales entre las dos familias, hoy 12». **Ambas
  cifras miden mal.** Las skills reales eran **10** (5 + 5); los 12 visibles en
  sesión eran la unión de nombres de comandos y skills. De dónde salía el 13 no
  consta.

Se dejan escritas como discrepancias, no como resueltas.
