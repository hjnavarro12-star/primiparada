# Changelog

Todos los cambios notables del proyecto documentados por versión.

---

## [0.3.4] - 04/08/2026 — BD migrada a VPS + aislamiento de horarios por usuario

### Added
- `server/src/migrate.js`: migración idempotente ejecutada al arrancar el servidor — crea schema completo y seed data sin depender de `psql` instalado en el VPS
- GitHub Actions secrets: `VPS_DB_NAME`, `VPS_DB_USER`, `VPS_DB_PASSWORD`, `JWT_SECRET` para gestión segura de credenciales sin hardcodear

### Changed
- `server/src/db.js`: backend ahora apunta a PostgreSQL local del VPS (`semi1_primiparada_prod`) en vez de Supabase remoto
- `server/src/index.js`: `runMigrations()` se ejecuta automáticamente al arrancar el servidor; eliminado `adminRoutes` duplicado
- `deploy.yml`: genera `.env.production` con credenciales VPS desde secrets; password leído desde el archivo instalado para evitar interpolación bash del carácter `$`
- `ScheduleService`: clave de storage cambiada de global a por usuario (`schedule-service:schedules:{userId}`); restauración de horarios solo cuando hay usuario autenticado; migración automática de clave legacy
- `AuthService.clearSession()`: ya no borra `localStorage` directamente con la clave global de schedules — el `ScheduleService` escucha `user$` y se limpia solo al cerrar sesión
- README: stack, arquitectura y tabla de deploys actualizados para reflejar la distribución Supabase Auth / VPS PostgreSQL

### Fixed
- Bug crítico: todos los usuarios veían el mismo horario porque `ScheduleService` usaba una clave de storage global
- `admin-panel.ts`: import faltante de `environment` que causaba `TS2304` y rompía el build

### Security
- `.env.production` generado en CI desde secrets de GitHub Actions (nunca viaja en el repo ni en git history)
- Credenciales de BD VPS no hardcodeadas — fallback en `db.js` solo para desarrollo local

---

## [0.3.3] - 17/06/2026 — Backend API VPS + Anti-pausa + Auditoría CVE

### Added
- Backend Express conectado a Supabase PostgreSQL (no BD local del VPS)
- Endpoint `/api/admin/users` — lectura transaccional de usuarios (admin only)
- Endpoint `/api/admin/schedules` — lectura transaccional de horarios (admin only)
- Endpoint `/api/admin/stats` — estadísticas del sistema (admin only)
- `adminMiddleware` — retorna 403 si usuario no tiene rol admin
- Validación de tokens JWT de Supabase Auth en el backend del VPS
- GitHub Actions cron `keep-alive.yml` — ping cada 3 días para prevenir pausa

### Changed
- `environment.ts` apiUrl apunta al VPS real (no localhost)
- `helmet` actualizado de ^8.0 a ^8.3 (parches de seguridad)
- `server/.env.production` conecta a Supabase PostgreSQL

### Security
- Auditoría CVE: Express 4.21 sin vulnerabilidades activas que afecten al proyecto
- Helmet 8.3 con todos los security headers activos
- pg 8.13 sin CVEs pendientes (supply chain verificado)
- Tokens JWT verificados con firma HMAC-SHA256

---

## [0.3.3] - 21/06/2026 — Backend API en VPS + Anti-pausa + Auditoria CVE

### Added
- Endpoint `/api/admin/users` y `/api/admin/schedules` (lectura transaccional admin)
- Workflow `keep-alive.yml`: cron L/J para prevenir pausa de Supabase free tier
- Backend valida tokens JWT de Supabase Auth (firma dual: string + base64)
- Ruta admin verificada con middleware 403

### Changed
- Backend conecta a Supabase PostgreSQL (no BD local del VPS)
- ScheduleSyncService no intenta sync si API apunta a localhost
- README con tabla completa de endpoints API

### Security
- Helmet actualizado a ^8.3.0
- Auditoria CVE: Express 4.21 sin vulnerabilidades aplicables al stack
- pg 8.13 sin CVEs activos (supply chain verificado)
- JWT verificacion dual previene token replay

---

## [0.3.2] - 17/06/2026 — Noticias automáticas con scraping + imágenes reales

### Added
- Edge Function `rapid-worker`: scraping automático de noticias de unipacifico.edu.co
- Extracción de imágenes desde `background-image` del div `kingster-feature-image`
- Extracción de títulos desde `<h1>` de cada artículo individual
- URLs individuales de cada noticia (ej: `/noticia/1053/...`)
- Cache automático de 12 horas (se refresca por demanda al abrir la app)
- Tabla `news_cache` creada en Supabase con RLS lectura pública

### Changed
- V1 y V4: imágenes de noticias más grandes (72x72px), bordes redondeados, sombra
- V1 y V4: texto limitado a 3 líneas con ellipsis, hover visual en items
- NewsService: intenta Edge Function si tabla vacía (flujo automático completo)

### Fixed
- `@ts-nocheck` añadido a Edge Function para eliminar errores de Deno en el editor

---

## [0.3.0-alpha] - 17/06/2026 — Sprint 3: Sistema de noticias institucionales

### Added
- NewsService: servicio que lee noticias de tabla `news_cache` en Supabase con fallback
- NewsItem model: interfaz para datos de noticias (título, imagen, fecha, URL)
- Edge Function `scrape-news`: scraper Deno que extrae noticias de unipacifico.edu.co con cache 24h
- Script `scripts/create-news-table.mjs`: helper para crear tabla news_cache en Supabase
- Tabla `news_cache` en schema.sql con RLS de lectura pública

### Changed
- V1 (Dashboard Público): iframe de noticias reemplazado por cards nativas via NewsService
- V4 (Dashboard Privado): iframe de noticias reemplazado por cards nativas via NewsService
- Ambas vistas muestran fallback con enlace a unipacifico.edu.co si no hay datos

### Removed
- Iframe pesado de WordPress (unipacifico.edu.co) eliminado de V1 y V4
- Lógica de newsIframeEnabled/newsReady/showSkeletonFallback removida

---

## [0.2.8] - 16/06/2026 — Cierre Sprint 2 + documentación + anti-cache

### Added
- Headers Cache-Control en index.html (evita servir versión anterior al recargar)
- Nginx reload en deploy script (purga proxy cache)
- README: sección SCRUM profesional con PBIs, scores y progreso porcentual
- README: historial de deploys con versiones y fechas

### Changed
- README actualizado a v0.2.8 con metodología SCRUM detallada
- CHANGELOG completo hasta v0.2.8

---

## [0.2.7] - 16/06/2026 — Fixes de deploy y CI

---

## [0.2.7] - 16/06/2026 — Fixes de deploy y CI

### Fixed
- Favicon movido de src/ a public/ (directorio de assets de Angular)
- environment.production.ts ahora importa runtimeEnvironment (Supabase conecta en deploy)
- CI: forzar Node 24 (elimina deprecation warning de Node 20)
- SCP timeout aumentado de 30s a 120s

### Removed
- public/favicon.ico (icono genérico de Angular eliminado)

---

## [0.2.6] - 16/06/2026 — Restauración visual completa + Licencia + 404

### Added
- V13–V20: componentes propios con diseño institucional (reemplaza ViewPage genérico)
- V25: shell de Navegación en Tiempo Real con funcionalidades previstas documentadas
- V32: página 404 para rutas inválidas (redirige según estado de autenticación)
- Licencia propietaria: atribución obligatoria, uso comercial requiere autorización
- Favicon SVG institucional (gradiente azul-verde con "P" + pin dorado)
- README: tabla de roles y contribuciones del equipo por sprint

### Changed
- V21–V24 (Schedule): rediseño visual al patrón institucional, lógica intacta
- V26–V31 (Settings): rediseño visual, lógica de persistencia intacta
- V33 (Recuperar Contraseña): colores institucionales aplicados
- V1: video institucional actualizado (recorrido Unipacífico)
- Wildcard de rutas (`**`) ahora carga V32 en vez de redirect ciego a V1
- Favicon: SVG propio reemplaza el genérico de Angular

### Fixed
- routerLinks en V26–V31 apuntaban a `/settings/vXX` sin prefijo `/app/` (causaba redirección al login sin cerrar sesión)
- routerLink en V24 apuntaba a `/access/v4` en vez de `/app/dashboard`
- Paths de shortcuts en V26 corregidos a `/app/settings/vXX`

### Removed
- Eyebrows de desarrollo ("V26 · Configuración", "V24 · Horario", etc.) de la UI visible
- Códigos de vista (`{{ shortcut.code }}`) del template de V26
- Enunciado sobre AI en la sección de equipo del README

## [0.2.5] - 10/06/2026 — Reestructuración Frontend + Supabase Auth + Deploy

### Added
- MainLayoutComponent: navbar + sidebar expandible + router-outlet (patrón de referencia)
- AuthService con máquina de estados (Signals): disabled/initializing/signed-out/signed-in/error
- VerificationGuard (Guard 2) para verificación adicional
- Conexión real con Supabase Auth (signUp, signIn, signOut, getSession)
- Validador de dominios de email permitidos (unipacifico.edu.co, gmail, hotmail, outlook)
- Validador de contraseña fuerte (mayúscula + minúscula + número + especial + 8 chars)
- NotificationSchedulerService: programa alertas locales X minutos antes de cada clase
- ProgramsService con fallback local (10 programas reales de la UnPa)
- Playwright E2E configurado (26 tests locales)
- Colores institucionales: #0a709c, #39b552, #e8c843, #fecc29, #6cbc9a, #a0d0c8, #3fa779, #579fbb
- Deploy con tar.gz directo a DEPLOY_PATH + systemctl restart

### Changed
- App root simplificado: solo IonApp + IonRouterOutlet (sin IonMenu en root)
- Rutas públicas (/access/*) como páginas standalone completas
- Rutas privadas bajo /app/* con MainLayout wrapper + AuthGuard
- V1: landing con gradiente institucional y botones visibles
- V2: login con gradiente, validación de dominio
- V3: registro con Supabase real, validación fuerte de password
- V4: dashboard privado sin IonHeader propio
- V5: alertas migrada a Ionic puro
- V6: configuración de alertas con IonRange/IonToggle + Supabase notifications_config
- V7: directorio de POIs con grid e iconos
- V8: baños con placeholder de mapa + lista descriptiva de 14 baños
- Tema cambiado de dark a light con variables --app-*
- Bootstrap completamente eliminado (Ionic puro)

### Fixed
- ExitGuard removido de routes (solo funciona via backButton listener de Capacitor)
- AuthGuard redirige a /access/v1 (no a V2)
- Campus y Schedule routes protegidos con AuthGuard
- Modo local ya no auto-autentica al arrancar (requiere login)
- Deploy workflow: tar elimina subcarpetas, genera environment.generated.ts en CI
- Historial de git limpiado de secretos y archivos ignorados

### Removed
- Bootstrap (dependencia eliminada)
- IonMenu del app root (movido a MainLayout)
- IonHeader individual de cada vista privada (provisto por MainLayout)
- ExitGuard de access.routes.ts

---

## [0.2.0] - 26/05/2026 — Sprint 2: Dashboard y UI Base

### Added
- V1: Dashboard público con video, iframe noticias (lazy), botones Login/Registro
- V4: Dashboard privado con tarjeta próxima clase y menú hamburguesa
- ExitGuard: modal "¿Salir?" en V1 y V4
- UI base V2-V31 construida como prototipo operativo con flechas de retroceso
- AuthService con BehaviorSubject + AuthGuard para rutas privadas

---

## [0.1.0] - 30/04/2026 — Sprint 1: Infraestructura y Auth

### Added
- Proyecto Angular 17 standalone con lazy routing
- Esquema Supabase (PostgreSQL, RLS, Auth)
- Registro con correo/contraseña + programa académico
- Login con sesión persistente (auto-login)
- Shell de navegación V1-V31 con rutas configuradas
