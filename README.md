# 🎓 Primíparos de la UnPa — Primiparada v0.2.6

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

URL: https://primiparada.seminario1.eleueleo.com

---

## 🔄 Metodología — SCRUM (7 Sprints × 2 semanas)

| Sprint | Estado | Objetivo |
|---|---|---|
| Sprint 1 | ✅ Cerrado | Infraestructura + Auth + Shell V1-V31 |
| Sprint 2 | ✅ Cerrado | Dashboard + UI Base + Guards |
| Sprint 3 | 🔄 En progreso | Horario manual + Mapa + POIs |
| Sprint 4 | ⏳ Pendiente | Ionic + Capacitor + Cámara + OCR |
| Sprint 5 | ⏳ Pendiente | GPS + Navegación + PDF |
| Sprint 6 | ⏳ Pendiente | Alertas + Configuraciones |
| Sprint 7 | ⏳ Pendiente | QA + Producción |

---

## 👥 Equipo

| Integrante | Rol | Dominio |
|---|---|---|
| **Harvi Jessy Navarro Gutierrez** | Product Owner + Scrum Master / Dev #2 | Gestión, validación, Settings (V26–V31), documentación |
| **Yeison Stiven Lozano Angulo** | Frontend / UI Lead | Angular+Ionic, vistas V1–V25, mapa |
| **Isnildo Equia Perteaga** | Mobile / QA | Capacitor, plugins nativos, builds, testing físico |
| **Darwin Andrés Murillo Torres** | Backend / Infraestructura | Supabase, Edge Functions, ScheduleService, OCR |

### Contribuciones por sprint

| Sprint | Harvi (PO/SM) | Yeison (Frontend) | Isnildo (Mobile) | Darwin (Backend) |
|---|---|---|---|---|
| Sprint 1 | Validación, docs, merge | Shell V1–V31, routing | — | Supabase schema, Auth real |
| Sprint 2 | Validación, Settings UI, docs | V1–V12 restauración, UI base | — | AuthService, Guards, sync |
| Sprint 2 (FIX-007) | Validación y aprobación | V13–V25 restauración, Schedule/Settings rediseño | — | Push, validación de rutas |
| Sprint 3 | Planificación, docs | V21 formulario, V7–V20 Mapbox | — | ScheduleService, Edge Functions |

---

## 📄 Licencia

Este proyecto está protegido bajo una licencia propietaria con atribución obligatoria. Ver [LICENSE](./LICENSE) para los términos completos.

- ✅ Uso libre para fines académicos y no comerciales (con atribución)
- ❌ Uso comercial prohibido sin autorización escrita de los autores
- 📩 Para licencia comercial: contactar a los autores (requiere acuerdo + participación económica + reconocimiento)
