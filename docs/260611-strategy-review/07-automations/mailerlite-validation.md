# Validación E2E MailerLite — Plan

> **Estado:** 🔄 Plan listo. Absorbe el pendiente técnico **#9**. Las 5 automatizaciones
> están activas pero **nunca se validaron en producción** de extremo a extremo.

## Objetivo
Confirmar que un lead real, por cada formulario y cada idioma, **llega al grupo
correcto** en MailerLite y **dispara el email esperado**.

## Método
Usar aliases `+` (un email, infinitas variantes que llegan a la misma bandeja):
`info+roi-en@aglaya.biz`, `info+roi-es@…`, `info+quote-pt@…`, etc.

## Matriz de pruebas

| Formulario | Idiomas | Verificar |
|---|---|---|
| ROI Audit — qualified | EN/ES/PT | Grupo CUALIFICADOS + email bienvenida |
| ROI Audit — borderline | EN/ES/PT | Grupo BORDERLINE + nurture |
| ROI Audit — no-fit | EN/ES/PT | Grupo NO_CUALIFICADOS + canal abierto |
| Cotizador | EN/ES/PT | Grupo COTIZACIONES + seguimiento |
| Footer dispatch | EN/ES/PT | Grupo SUSCRIPCIONES + Email 0 |

## Checklist por prueba
- [ ] Submit con alias `+` único.
- [ ] Subscriber aparece en el grupo correcto (panel MailerLite).
- [ ] Campo `language` correcto en el subscriber.
- [ ] Email esperado recibido en bandeja.
- [ ] (Cuando aplique) Deal en CRM con `source` correcto + campos GDPR.

## Cuándo
Tras construir el rediseño (capas 5-6 ejecutadas) — para validar el flujo final, no
el viejo. Es trabajo **manual del operador** (requiere acceso a bandeja + panel ML).
