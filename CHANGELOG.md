# Changelog

Todos los cambios notables del proyecto documentados por versión.

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
