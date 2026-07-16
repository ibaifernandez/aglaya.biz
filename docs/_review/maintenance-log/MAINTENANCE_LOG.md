# Registro de Mantenimiento Técnico - AGLAYA

## [DIAGNÓSTICO] Estructura de Contenidos Bilingües (Proof)
**Fecha**: 2026-04-02
**Estado**: Redundancia Operativa Útil

### Descripción
Actualmente, los casos de éxito (`proof`) utilizan un sistema de archivos dividido por idiomas (`src/content/proof/en/` y `src/content/proof/es/`). Sin embargo, el esquema técnico (`config.ts`) obliga a que los metadatos de la cabecera (frontmatter) sean objetos bilingües.

### «Necesidad de mejora de mantenimiento»
Existe una redundancia en la gestión de metadatos. Al modificar un título o una métrica en el archivo de inglés, es obligatorio replicar ese cambio manualmente en el archivo equivalente de español para evitar inconsistencias o fallos de validación en la interfaz.

**Impacto**: 
- Riesgo de desincronización de datos entre versiones.
- Carga de trabajo doble en actualizaciones de metadata.

**Recomendación Futura**: 
Explorar una arquitectura de "Single Source of Metadata" donde la metadata bilingüe viva en un único archivo JSON o YAML, vinculada a los archivos Markdown de contenido largo por un ID único, eliminando la duplicidad en los frontmatters.
