# Primíparos de la UnPa — Documentación Central

Índice maestro de toda la documentación del proyecto.

---

## 📖 Biblia del Proyecto (Especificación)

Cómo debe ser todo. Fuente de verdad para implementación.

| Documento | Contenido |
|-----------|-----------|
| [01. Problema y Solución](bible/01-problema-y-solucion.md) | Diagnóstico, ejes de solución, propuesta de valor |
| [02. Stack Tecnológico](bible/02-stack-tecnologico.md) | Angular 21, Ionic 8, Capacitor 8, Supabase, Vitest |
| [03. Esquema de Base de Datos](bible/03-esquema-base-datos.md) | Schema SQL completo + RLS + relaciones |
| [04. Mapa de Vistas](bible/04-mapa-vistas.md) | Las 33 vistas detalladas + árbol de navegación |
| [05. Arquitectura de Servicios](bible/05-arquitectura-servicios.md) | Services, guards, interceptors, patterns |
| [06. OCR — Arquitectura](bible/06-ocr-arquitectura.md) | OCR imagen, calendario, PDF, flujo completo |
| [07. Mapas y Geolocalización](bible/07-mapas-geolocalizacion.md) | Mapbox, GPS, GeoJSON, failover |
| [08. Storage y Offline](bible/08-storage-offline.md) | Persistencia local, sincronización, seguridad |
| [09. Notificaciones](bible/09-notificaciones.md) | LocalNotifications, configuración, permisos |
| [10. Personalización](bible/10-personalizacion.md) | Temas, fuentes, colores, runtime |
| [11. Fase 1 — Seminario 1](bible/11-fase1-seminario1.md) | Alcance + CUF + CUNF de Fase 1 |
| [12. Fase 2 — Seminario 2](bible/12-fase2-seminario2.md) | Alcance + CUF + CUNF de Fase 2 |
| [13. Plan SCRUM](bible/13-plan-scrum.md) | 7 Sprints, 35 PBIs completos |
| [14. Equipo y Roles](bible/14-equipo-roles.md) | Integrantes, responsabilidades, ownership |
| [15. Flujo de Contribuciones](bible/15-flujo-contribuciones.md) | Git flow, PRs, Trello, ramas |
| [16. Definition of Done](bible/16-dod-criterios.md) | Criterios DoD unificados |

---

## 🏃 Registro de Implementación (Sprints)

Qué se hizo, cuándo, con qué resultado.

| Documento | Contenido |
|-----------|-----------|
| [Sprint 1](sprints/sprint-1.md) | PBI-01 a PBI-05 — Infraestructura y Auth |
| [Sprint 2](sprints/sprint-2.md) | PBI-06 a PBI-10 — Dashboard y UI Base |
| [Sprint 3](sprints/sprint-3.md) | PBI-11 a PBI-15 — Horario Manual + Migración parcial y Mapa + Noticias |

### Fixes post-sprint

| Documento | Contenido |
|-----------|-----------|
| [FIX-001: Migración Ionic](sprints/fixes/fix-ui-ionic-migration.md) | Bootstrap eliminado, migrado a Ionic puro |
| [FIX-002: Auth State Machine](sprints/fixes/fix-auth-state-machine.md) | AuthService con máquina de estados + Guard 2 |
| [FIX-003: Menú expandible](sprints/fixes/fix-menu-expandable.md) | Menú lateral con accordion para sub-secciones |
| [FIX-004: Arquitectura MainLayout](sprints/fixes/fix-mainlayout-architecture.md) | Reestructuración completa: app root mínimo + MainLayout wrapper |
| [FIX-005: Supabase Auth real](sprints/fixes/fix-supabase-auth-real.md) | Conexión real con Supabase Auth + validaciones email/password |
| [FIX-006: Correcciones V4–V8](sprints/fixes/fix-v4-v8-visual-corrections.md) | Estilos institucionales, NotificationScheduler, Supabase notifications_config |
| [FIX-007: Restauración V13–V32](sprints/fixes/fix-v13-v32-visual-restoration.md) | Restauración visual completa V13–V32, corrección de rutas, página 404 |

---

## 🔍 Auditorías

| Documento | Contenido |
|-----------|-----------|
| [Índice de auditorías](audits/README.md) | Cronología completa |
| [v0.1.0 — Sprint 1](audits/v0.1.0-sprint1.md) | Infraestructura base |
| [v0.2.0 — Sprint 2](audits/v0.2.0-sprint2.md) | Dashboard y guards |
| [v0.2.1 — Actual](audits/v0.2.1-current.md) | Mock local, sync, áreas |
| [DoD Final](audits/2026-06-03-dod-final.md) | Auditoría DoD con 105 tests |
| [v0.3.3 — Backend + Admin](audits/v0.3.3-backend-api.md) | Backend API, panel admin, noticias, CVE |

---

## 🔧 Referencias técnicas de implementación

Qué se implementó realmente vs lo que dice la biblia. Complementan la especificación.

| Documento | Contenido |
|-----------|-----------|
| [Frontend — Implementación real](frontend/FRONTEND-REFERENCE.md) | Arquitectura, dominios, patrones adoptados, reglas de auditoría |
| [Backend Angular — Servicios](backend/BACKEND-REFERENCE.md) | Servicios core, guards, flujo de sync, schema, fallbacks |
| [Backend VPS — Servidor Express](backend/VPS-SERVER.md) | Express en VPS, endpoints, middlewares, deploy, systemd |
| [DoD — Checklist operativa](quality/DOD-CHECKLIST.md) | Checklist unificada usada en auditorías + estado por área |

---

## �🛠️ Metodología

| Documento | Contenido |
|-----------|-----------|
| [Flujo de trabajo](methodology/copilot-workflow.md) | Cómo trabaja el equipo con Copilot/Kiro |

---

## 📝 Apuntes operativos

Los apuntes operativos (credenciales, deploy, secretos, procesos) están en [`/notes/`](../notes/).

| Archivo | Contenido |
|---------|-----------|
| [admin-panel-setup.txt](../notes/admin-panel-setup.txt) | Arquitectura admin, roles, token, troubleshooting |
| [backend-vps-operaciones.txt](../notes/backend-vps-operaciones.txt) | Comandos SSH, systemd, Nginx, mantenimiento del VPS |
| [conceptos-y-definiciones.txt](../notes/conceptos-y-definiciones.txt) | Glosario técnico del proyecto |
| [credenciales-supabase.txt](../notes/credenciales-supabase.txt) | URLs, claves, cuentas de prueba, CLI |
| [deploy-paso-a-paso.txt](../notes/deploy-paso-a-paso.txt) | Guía completa de deploy + troubleshooting |
| [deploy-secretos-github.txt](../notes/deploy-secretos-github.txt) | Los 8 secretos de GitHub Actions |
| [equipo.txt](../notes/equipo.txt) | Integrantes, contribuciones por sprint, ownership |
| [plan-noticias-scraping.txt](../notes/plan-noticias-scraping.txt) | Plan + implementación del scraping de noticias |
| [ssh-multicuenta-github.txt](../notes/ssh-multicuenta-github.txt) | SSH multi-cuenta, rotación de commits |
| [stack-actual.txt](../notes/stack-actual.txt) | Stack con versiones y justificaciones |
| [supabase-pausa-reactivacion.txt](../notes/supabase-pausa-reactivacion.txt) | Prevención de pausa + reactivación |
