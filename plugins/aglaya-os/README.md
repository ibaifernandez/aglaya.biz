# AGLAYA-OS v0.2.0

> **The Operational Layer for Full-Stack Architects of Truth.**
> Brand Integrity.

**CRITICAL SEPARATION:** `aglaya-os` manages business operations only. For Ibai Fernández’s personal brand management, use `ibai-brand-os`. Mixing institutional truth with personal narrative is a liability.

**Este plugin se sirve desde este repo**, no desde la nube. El marketplace es
[`.claude-plugin/marketplace.json`](../../.claude-plugin/marketplace.json), en la raíz de
`aglaya.biz`. `git pull` es el despliegue; instalación y vuelta atrás en
[`BACKUP-NOTES.md`](BACKUP-NOTES.md) §9.

---

## 1. Operational Mandate

`aglaya-os` forces Claude to operate as AGLAYA’s Lead Architect. It eliminates "hope-based" assistance by grounding every response in the **Brand DNA**:
* **Sovereignty over Services:** We build infrastructure; we don't rent hours.
* **Data over Vibes:** If there are no numbers, there is no output.
* **Surgical Precision:** Every word must serve a logical, structural purpose.

---

## 2. Command Architecture

| Command | Operational Outcome |
|---|---|
| `/brand-voice [content]` | Acts as the **Audit Guard**. Strips away adjectives, fluff, and "niceness" to ensure the AGLAYA voice remains surgical. |

En 0.2.0 se jubilaron `/outreach`, `/roi-audit`, `/proposal` y `/case-study`.
Describían un negocio que ya no se vende. El porqué de cada una, con la frase
comercial que lo sostiene y el commit donde vive su última versión completa, está
en [`BACKUP-NOTES.md`](BACKUP-NOTES.md) §7.

---

## 3. El modelo de negocio no se escribe aquí

Se **pregunta en vivo**: `verdad_comercial()` del MCP `aglaya-atlas`. Precios,
escalera de oferta, ICP y qué se factura hoy son estado. Un número copiado a mano
aquí caduca solo y sigue sonando autoritario después de muerto — es exactamente
por lo que se jubilaron cuatro de las cinco skills.

> ⚠️ `context/brand-dna.md` **todavía contiene** la tabla del modelo viejo
> (retainer de $8.000/mes, dos clientes, umbral de $15.000). Sigue ahí porque
> `brand-voice` la lee y esa skill está **congelada a propósito** — ver
> [`BACKUP-NOTES.md`](BACKUP-NOTES.md) §8. No es fuente válida de verdad comercial.

---

## 4. Maintenance & Truth Sources

* **Contexto de marca:** `context/brand-dna.md` — lo carga el comando explícitamente. Ya no hay hook que lo inyecte en cada sesión.
* **Voz:** `skills/brand-voice/references/voice-guidelines.md`. Fuente viva paralela: `get_voice_rules()`, `check_voice()`, `is_allowed_word()` del MCP `aglaya-ds`.
* **Verdad comercial:** `verdad_comercial()` del MCP `aglaya-atlas`. Nunca este repo.

---

## 5. Voice Rule Enforcement

Every output must survive the **Audit Protocol**:
1. **Adjective Ban:** Delete "innovative," "seamless," "robust," "passionate," "bespoke," or "comprehensive".
2. **Declarative Syntax:** Short, punchy sentences.
3. **No Empathy-Filler:** No "I hope this finds you well" or "Thank you for your time".
