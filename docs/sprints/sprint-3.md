# Sprint 3 — Horario Manual y Mapa Estático

**Estado:** 🔄 En progreso  
**Semanas:** 5–6  
**Fecha de inicio:** 17/06/2026  
**Velocity estimada:** 29 pts  
**Rama:** `sprint-3/horario-mapa-noticias`

---

## Sprint Goal

Implementar el ingreso manual de horario con UX mejorada, integrar Mapbox 2D con los 13 POIs del campus, resolver el sistema de noticias institucionales (reemplazo del iframe roto), y cumplir con el requerimiento técnico de Fase 2 (Backend API + Panel Admin + Roles).

---

## Planeación previa a PBI-13 — Migración parcial a VPS

Antes de continuar con el mapa y la navegación, se ejecuta una migración parcial de la persistencia para que la base operativa del proyecto quede en el VPS y no en Supabase.

### Objetivo

Trasladar al PostgreSQL del VPS las tablas de negocio y datos operativos del proyecto, manteniendo Supabase solo para Auth y para las piezas que todavía dependen de su infraestructura.

### Alcance

- Exportar y recrear en VPS el esquema de `programs`, `users`, `rooms`, `schedules`, `schedule_sync_queue`, `campus_geodata`, `notifications_config` y `news_cache`.
- Configurar el backend Express para leer y escribir contra la BD local del VPS por el puerto `5432`.
- Mantener temporalmente Supabase Auth, JWT y cualquier flujo que aún dependa de `auth.users`.
- Validar que `/api/health`, `/api/admin/users` y `/api/admin/schedules` funcionen contra la BD local.

### Fuera de alcance por ahora

- Migrar Supabase Auth completo al VPS.
- Rehacer el sistema de roles desde cero.
- Reescribir Edge Functions que no bloqueen el sprint.

### Responsables por ownership

- Harvi: valida la planeación, actualiza documentación y aprueba el cierre de la migración parcial.
- Darwin: ejecuta la exportación/importación de BD y ajusta la conexión del backend al VPS.
- Yeison: solo toca frontend si cambia el contrato de API o alguna ruta consumida por la UI.
- Isnildo: verifica deploy, smoke tests y comportamiento móvil después del cambio.

### Criterio de cierre

La migración parcial queda lista cuando el backend ya no dependa de la BD remota de Supabase para datos de negocio y el sprint pueda avanzar con PBI-13 sin deuda de infraestructura.

---

## PBIs del Sprint

| PBI | Nombre | Puntos | Estado |
|-----|--------|--------|--------|
| PBI-11 | V21: Formulario reactivo de ingreso manual | 8 | ✅ Hecho |
| PBI-12 | V24: Horario renderizado con CRUD | 5 | ✅ Hecho |
| PBI-13 | V7–V20: Mapa Mapbox 2D con 13 POIs | 8 | ⏳ Pendiente |
| PBI-14 | Ruta estática desde Entrada Principal al POI | 5 | ⏳ Pendiente |
| PBI-15 | ScheduleService con BehaviorSubject | 3 | ⏳ Pendiente |

---

## Trabajo pre-PBI: Sistema de noticias institucionales ✅

Antes de abordar los PBIs, se implementó el sistema de noticias como mejora del PBI-06 (V1: noticias lazy). Este trabajo estaba pendiente del Sprint 2 y se resolvió al inicio del Sprint 3.

### Problema original

V1 y V4 usaban un `<iframe>` que cargaba el sitio completo de `unipacifico.edu.co`. Esto era:
- Lento (>5s de carga)
- Pesado para móvil
- Frecuentemente fallaba (el sitio usa JS rendering)
- No mostraba contenido útil (solo el header de WordPress)

### Solución implementada

Sistema de scraping automático con Edge Function + cache en Supabase.

#### Arquitectura

```
[Usuario abre la app]
    │
    ▼ NewsService.loadNews()
[Supabase REST: SELECT news_cache]
    │
    ├── Si hay datos y cache < 12h → mostrar cards
    │
    └── Si vacío o cache expirado:
         │
         ▼ fetch(Edge Function: rapid-worker)
        [Supabase Edge Function (Deno)]
              │
              ▼ fetch("unipacifico.edu.co/noticias")
             [Extraer URLs de artículos via regex]
              │
              ▼ fetch(cada URL individual)
             [Leer <h1> → título]
             [Leer div.kingster-feature-image → background-image → imagen]
              │
              ▼ DELETE + INSERT en news_cache
              │
              ▼ Retorna JSON con 4 noticias
```

#### Componentes creados

| Archivo | Descripción |
|---------|-------------|
| `src/app/core/services/news.service.ts` | Servicio Angular que lee de news_cache + invoca Edge Function |
| `src/app/shared/models/news.model.ts` | Interfaz NewsItem |
| `supabase/functions/scrape-news/index.ts` | Edge Function Deno (desplegada como "rapid-worker") |
| `scripts/create-news-table.mjs` | Helper para crear tabla (si necesario) |

#### Tabla Supabase

```sql
news_cache (
  id uuid PK,
  title text NOT NULL,
  image_url text,
  published_at timestamptz,
  source_url text NOT NULL,
  scraped_at timestamptz DEFAULT now()
)
RLS: lectura pública, escritura solo service_role
```

#### Flujo de scraping (Edge Function)

1. **Verificar cache** — si `scraped_at` < 12h → retornar datos existentes
2. **Fetch /noticias** — obtener HTML de la página de noticias
3. **Extraer URLs** — regex busca hrefs con `/noticia/` (artículos individuales)
4. **Fetch cada artículo** — para cada URL:
   - Título: `<h1>` del artículo (no og:title que es genérico)
   - Imagen: `background-image` del div `kingster-feature-image`
   - Fecha: meta `article:published_time` o patrón de fecha en texto
5. **Reemplazar cache** — DELETE todo + INSERT las 4 nuevas
6. **Retornar JSON** al frontend

#### Comportamiento de refresh

- **Frecuencia:** Cada 12 horas (por demanda, no cron)
- **Trigger:** Cuando un usuario abre V1 o V4 y el cache tiene más de 12h
- **Si falla:** Mantiene las noticias anteriores (nunca queda vacío)
- **Reemplazo total:** No es desplazamiento — borra todo y pone las 4 más recientes

#### Frontend (V1 y V4)

El iframe fue reemplazado por cards nativas:
- Imagen 72×72px con bordes redondeados y sombra
- Título limitado a 3 líneas con ellipsis
- Enlace individual a cada artículo
- Skeleton loader mientras carga
- Fallback con enlace a unipacifico.edu.co si no hay datos
- Link "Ver más noticias →" al final

#### Problemas encontrados y soluciones

| Problema | Causa | Solución |
|----------|-------|----------|
| deno-dom no extraía noticias | Sitio usa JS rendering | Regex sobre HTML estático |
| og:title devolvía genérico | `<title>` del sitio es ".:: Universidad..." | Extraer del `<h1>` |
| og:image devolvía logo | Solo tiene un og:image genérico | Buscar `background-image` en CSS inline |
| 2 horas vs 12 horas | El cache dura 12h, no 2h | Diseño por demanda, no cron |

---

## Notas técnicas

- La Edge Function se desplegó manualmente via Dashboard de Supabase (pestaña Code)
- El nombre en Supabase es `rapid-worker` (no `scrape-news`)
- URL del endpoint: `https://xxqtmbptexnusrhitvnk.supabase.co/functions/v1/rapid-worker`
- El archivo local usa `// @ts-nocheck` para silenciar errores de Deno en el editor Angular
- La tabla se creó via SQL Editor de Supabase Dashboard

---

## Decisiones técnicas importantes

### Dashboard V4 — Comportamiento según rol

- Si el usuario tiene `role: admin` → se muestra una card adicional "Panel de Administración" que enlaza a `/admin`
- Si el usuario tiene `role: standard` → la card no se renderiza
- La card se posiciona ANTES de la sección de noticias (no al final)
- Al cerrar sesión se limpia el cache local para evitar datos fantasma del usuario anterior

### Datos siempre desde Supabase

- La app es solo un "recipiente" (carcasa). Los datos SIEMPRE se extraen de Supabase.
- Si un usuario no ha creado horario → no se muestra "Próxima clase" (evitar datos fantasma)
- El cache local solo aplica para uso offline post-login, nunca para mostrar datos de otro usuario
- Al cerrar sesión: `localStorage` + `@capacitor/preferences` se limpian completamente

### Gradiente de fondo en Dashboard

- El gradiente debe cubrir el 100% del scroll, no solo el viewport visible
- Solución: `min-height: 100vh` + `background-attachment: fixed` o `background-size: cover`
- Verificado que al deslizar con dedos en móvil no aparece franja blanca al final

---

## Archivos modificados en este sprint (hasta la fecha)

| Archivo | Cambio |
|---------|--------|
| `src/app/core/services/news.service.ts` | Nuevo — servicio de noticias |
| `src/app/shared/models/news.model.ts` | Nuevo — modelo de noticias |
| `src/app/shared/models/schedule.model.ts` | Tipo Jornada agregado |
| `supabase/functions/scrape-news/index.ts` | Nuevo — Edge Function |
| `supabase/schema.sql` | Tabla news_cache + RLS admin |
| `src/app/features/access/v1-dashboard.ts` | iframe reemplazado por cards |
| `src/app/features/access/v4-dashboard.ts` | iframe reemplazado por cards |
| `src/app/features/schedule/v21-manual-entry-page.ts` | Jornada + dropdown rooms |
| `src/app/core/guards/admin.guard.ts` | Nuevo — guard de rol admin |
| `src/app/features/admin/admin-panel.ts` | Nuevo — panel CRUD lectura |
| `src/app/features/access/forbidden-page.ts` | Nuevo — pagina 403 |
| `src/app/app.routes.ts` | Rutas /admin y /forbidden |
| `src/app/core/services/auth.service.ts` | Campo role en AuthUser |
| `scripts/migrate-admin-roles.sql` | Nuevo — migración RLS para admin |
| `scripts/create-news-table.mjs` | Nuevo — helper SQL |
| `CHANGELOG.md` | v0.3.0-alpha, v0.3.2 |
| `package.json` | version 0.3.2 |
| `README.md` | Arquitectura + credenciales + URLs |


---

## Requerimiento Técnico: Backend API + Panel Admin + Roles

### Contexto

El requerimiento técnico (Fase 2) exige un backend con autenticación JWT,
enrutamiento protegido por rol, y lectura transaccional de al menos dos tablas.

### Implementación

#### Backend Express (server/)

| Archivo | Descripción |
|---------|-------------|
| `server/src/index.js` | Entry point, registra rutas, configura CORS/Helmet |
| `server/src/db.js` | Pool PostgreSQL con SSL para Supabase remoto |
| `server/src/auth.js` | JWT sign/verify + middleware auth (soporta tokens Supabase) |
| `server/src/routes/auth.js` | Login, Register, Me |
| `server/src/routes/admin.js` | Endpoints admin protegidos por rol |
| `server/src/routes/schedules.js` | CRUD horarios |
| `server/src/routes/programs.js` | Lista programas |
| `server/src/routes/rooms.js` | Lista salones |

#### Sistema de roles

- El rol se almacena en `app_metadata` Y `user_metadata` de Supabase Auth
- `app_metadata.role` se incluye en el JWT access_token automáticamente
- El backend decodifica el JWT y lee `user_metadata.role` o `app_metadata.role`
- El frontend lee `user_metadata.role` del objeto user de Supabase

#### Panel Admin (Frontend)

- Ruta: `/admin` (protegida por AuthGuard + AdminGuard)
- Componente: `src/app/features/admin/admin-panel.ts`
- Flujo de datos:
  1. Obtiene token de sesión via `supabase.auth.getSession()`
  2. Intenta GET `/api/admin/users` en el VPS con el token
  3. Si falla → fallback a Supabase REST directo con RLS
  4. Muestra tablas de usuarios y horarios

#### Página 403

- Ruta: `/forbidden`
- Se muestra cuando un usuario con rol `standard` intenta acceder a `/admin`
- Botón "Volver al Dashboard"

#### Deploy del backend

El workflow de GitHub Actions ahora:
1. Empaqueta `server/` (sin node_modules) en `backend.tar.gz`
2. Sube via SCP al VPS
3. Extrae en `$DEPLOY_PATH/server/`
4. Ejecuta `npm install --production`
5. Reinicia systemd (`primiparada.service`)

#### Anti-pausa Supabase

Workflow `.github/workflows/keep-alive.yml`:
- Cron: lunes y jueves a las 9 AM UTC
- Hace un GET simple a la tabla `news_cache`
- Previene pausa por inactividad (free tier: 7 días sin queries)

### Problemas encontrados y soluciones

| Problema | Causa | Solución |
|----------|-------|----------|
| "client password must be a string" | dotenv no cargaba en VPS | Credenciales hardcodeadas en db.js como fallback |
| 502 Bad Gateway | `const adminRoutes` duplicado | Eliminar línea duplicada |
| Panel admin vacío | Token viejo sin rol | Borrar Local Storage + reloguear |
| JWT de Supabase no se valida | Secret incorrecto | Decodificar sin verificar firma (confiar en Supabase Auth) |
| user_metadata no en JWT | Supabase solo incluye app_metadata en JWT | Asignar rol en ambos metadata |
| CORS en /api/schedules/sync | API apuntaba a localhost | ApiService.isAvailable() bloquea si es localhost |

### Auditoría CVE

| Dependencia | Versión | Estado |
|---|---|---|
| express | 4.21.0 | Sin CVEs aplicables al stack |
| helmet | 8.3.0 | Actualizado, sin vulnerabilidades |
| pg | 8.13.0 | Sin CVEs activos |
| cors | 2.8.5 | Sin CVEs |
| dotenv | 16.4.0 | Sin CVEs |

### Datos seed insertados

- **Programas académicos**: 10 programas de la Universidad del Pacífico
- **Usuarios admin**: hjnavarro@unipacifico.edu.co (app_metadata.role = admin)
- **Usuarios standard**: marulanda@unipacifico.edu.co (app_metadata.role = standard)
