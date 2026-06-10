# Changelog

Todos los cambios notables del proyecto documentados por versión.

---

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
