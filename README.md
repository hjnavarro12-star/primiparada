# 🎓 Primíparos de la UnPa — Primiparada v0.2.8

Aplicación móvil de integración universitaria para estudiantes de primer semestre de la **Universidad del Pacífico**. Resuelve la desorientación espacial y académica de los primíparos mediante navegación GPS en tiempo real, carga automatizada de horarios por OCR y un canal centralizado de información institucional.

---

## 📋 Descripción

Los estudiantes nuevos reciben su carga académica en PDFs o capturas de pantalla con nomenclaturas abstractas (ej. *Bloque 16 - Salón 201*) que no tienen un mapeo mental en el campus. Esto genera estrés, llegadas tardías y sobrecarga del personal universitario.

**Primíparos de la UnPa** resuelve esto con tres funcionalidades principales:

- 🗺️ **Navegación GPS** — Traza rutas en tiempo real desde la ubicación del estudiante hasta su salón o cualquier punto de interés del campus.
- 📅 **Carga de horario inteligente** — Digitar manualmente, subir PDF de Academusoft, o tomar una foto del horario/calendario (OCR).
- 🔔 **Alertas de clase** — Notificaciones locales que avisan con anticipación configurable, sin necesidad de internet.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| Framework UI | Angular (Standalone API, Signals) | 21+ |
| Componentes Móviles | Ionic (puro, sin Bootstrap) | 8+ |
| Bridge Nativo | Capacitor | 8+ |
| Lenguaje | TypeScript (strict mode) | 5.9+ |
| Base de Datos | Supabase (PostgreSQL + Auth + Storage) | — |
| Mapas | Mapbox GL JS | 3+ |
| Testing | Vitest + Playwright | 4+ |
| CI/CD | GitHub Actions → SSH/tar → Nginx | — |

---

## ⚙️ Instalación

```bash
git clone https://github.com/hjnavarro12-star/primiparada.git
cd primiparada
npm install
```

### Variables de entorno

Crear `src/environments/environment.generated.ts` (ignorado en git):

```typescript
export const runtimeEnvironment = {
  "supabaseUrl": "https://xxqtmbptexnusrhitvnk.supabase.co",
  "supabaseAnonKey": "[TU_ANON_KEY]",
  "mapboxToken": "[TU_MAPBOX_TOKEN]"
} as const;
```

### Desarrollo local

```bash
npm start          # ng serve en localhost:4200
npm run build      # build de producción
npm run lint       # linting
```

---

## 🚀 Deploy

El deploy es automático al hacer push a la rama `production`:

```
push a production → GitHub Actions → build → tar → SCP → Nginx
```

| Versión | Fecha | Estado |
|---|---|---|
| v0.1.0 | 30/04/2026 | ✅ Sprint 1 desplegado |
| v0.2.0 | 26/05/2026 | ✅ Sprint 2 desplegado |
| v0.2.5 | 10/06/2026 | ✅ Reestructuración + Auth real |
| v0.2.6 | 16/06/2026 | ✅ Restauración visual completa |
| v0.2.8 | 16/06/2026 | ✅ Cierre Sprint 2 + CI fixes |

URL: https://primiparada.seminario1.eleueleo.com

---

## 🔄 Metodología SCRUM

**Duración por Sprint:** 2 semanas | **Total:** 7 Sprints (14 semanas) | **Puntos totales:** 230

### Sprint 1 — Infraestructura y Auth ✅

| PBI | Historia | Pts | Estado |
|---|---|---|---|
| PBI-01 | Proyecto Angular standalone, estructura de carpetas, lazy routing | 5 | ✅ |
| PBI-02 | Supabase: tablas creadas, RLS activado, variables de entorno | 8 | ✅ |
| PBI-03 | Registro con correo/contraseña + selección de Programa Académico | 5 | ✅ |
| PBI-04 | Login con persistencia de sesión (auto-login) | 3 | ✅ |
| PBI-05 | Shell de navegación V1–V31 con rutas configuradas | 8 | ✅ |

**Velocity:** 29 pts | **Cierre:** 30/04/2026 | **Progreso global:** 12.6%

### Sprint 2 — Dashboard y UI Base ✅

| PBI | Historia | Pts | Estado |
|---|---|---|---|
| PBI-06 | V1: Dashboard Público con video, iframe noticias (lazy) y botones | 5 | ✅ |
| PBI-07 | V4: Dashboard Privado con tarjeta próxima clase y menú hamburguesa | 5 | ✅ |
| PBI-08 | Interceptor de salida: modal "¿Salir?" en V1 y V4 | 3 | ✅ |
| PBI-09 | UI final V2–V31 construida (sin lógica completa, con flechas retroceso) | 13 | ✅ |
| PBI-10 | AuthService + guards de ruta (rutas privadas protegidas) | 5 | ✅ |

**Velocity:** 31 pts | **Cierre:** 26/05/2026 | **Progreso global:** 26.1%

**Fixes aplicados en Sprint 2:**
- FIX-001: Migración Bootstrap → Ionic puro
- FIX-002: AuthService con máquina de estados
- FIX-003: Menú expandible con accordion
- FIX-004: Arquitectura MainLayout
- FIX-005: Supabase Auth real
- FIX-006: Correcciones visuales V4–V8
- FIX-007: Restauración visual V13–V32 + corrección de rutas + página 404

### Sprint 3 — Horario Manual y Mapa Estático ⏳

| PBI | Historia | Pts | Estado |
|---|---|---|---|
| PBI-11 | V21: Formulario reactivo de ingreso manual | 8 | ⏳ |
| PBI-12 | V24: Horario renderizado con CRUD | 5 | ⏳ |
| PBI-13 | V7–V20: Mapa Mapbox 2D con 13 POIs | 8 | ⏳ |
| PBI-14 | Ruta estática desde Entrada Principal al POI | 5 | ⏳ |
| PBI-15 | ScheduleService con BehaviorSubject | 3 | ⏳ |

**Velocity estimada:** 29 pts | **Progreso global al cierre:** 38.7%

### Sprints 4–7 — Pendientes

| Sprint | Objetivo | Pts estimados |
|---|---|---|
| Sprint 4 | Ionic + Capacitor + Cámara + OCR | 47 |
| Sprint 5 | GPS + Navegación + PDF | 39 |
| Sprint 6 | Alertas + Configuraciones | 26 |
| Sprint 7 | QA + Producción | 29 |

---

## 👥 Equipo

| Integrante | Rol | Dominio |
|---|---|---|
| **Harvi Jessy Navarro Gutierrez** | Product Owner + Scrum Master | Gestión, validación, Settings (V26–V31), documentación |
| **Yeison Stiven Lozano Angulo** | Frontend / UI Lead | Angular+Ionic, vistas V1–V25, mapa |
| **Isnildo Equia Perteaga** | Mobile / QA | Capacitor, plugins nativos, builds, testing físico |
| **Darwin Andrés Murillo Torres** | Backend / Infraestructura | Supabase, Edge Functions, ScheduleService, OCR |

### Contribuciones por sprint

| Sprint | Harvi (PO/SM) | Yeison (Frontend) | Isnildo (Mobile/QA) | Darwin (Backend) |
|---|---|---|---|---|
| Sprint 1 | Planificación, validación, docs, merge | Shell V1–V31, routing, ESLint | — | Supabase schema, RLS, Auth |
| Sprint 2 | Validación, Settings UI, changelog | V1–V25 restauración visual, UI base | CI fixes, favicon, deploy fixes | AuthService, Guards, routerLinks |
| Sprint 3 | Planificación, docs | V21 formulario, Mapbox POIs | Testing móvil | ScheduleService, Edge Functions |

---

## 📄 Licencia

Este proyecto está protegido bajo una licencia propietaria con atribución obligatoria. Ver [LICENSE](./LICENSE) para los términos completos.

- ✅ Uso libre para fines académicos y no comerciales (con atribución)
- ❌ Uso comercial prohibido sin autorización escrita de los autores
- 📩 Para licencia comercial: contactar a los autores (requiere acuerdo + participación económica + reconocimiento)
