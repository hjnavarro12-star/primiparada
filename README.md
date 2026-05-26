# 🎓 Primíparos de la UnPa

Aplicación móvil de integración universitaria para estudiantes de primer semestre de la **Universidad del Pacífico**. Resuelve la desorientación espacial y académica de los primíparos mediante navegación GPS en tiempo real, carga automatizada de horarios por OCR y un canal centralizado de información institucional.

---

## 📋 Descripción

Los estudiantes nuevos reciben su carga académica en PDFs o capturas de pantalla con nomenclaturas abstractas (ej. *Bloque 16 - Salón 201*) que no tienen un mapeo mental en el campus. Esto genera estrés, llegadas tardías y sobrecarga del personal universitario.

**Primíparos de la UnPa** resuelve esto con tres funcionalidades principales:

- 🗺️ **Navegación GPS** — Traza rutas en tiempo real desde la ubicación del estudiante hasta su salón o cualquier punto de interés del campus.
- 📅 **Carga de horario inteligente** — El estudiante puede digitar su horario manualmente, subir el PDF de Academusoft, o tomar una foto de su horario/calendario académico y la app lo lee automáticamente con OCR.
- 🔔 **Alertas de clase** — Notificaciones locales que avisan al estudiante con anticipación configurable, sin necesidad de internet.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| Framework UI | Angular (Standalone API) | 17+ |
| Componentes Móviles | Ionic | 7+ |
| Bridge Nativo iOS/Android | Capacitor | 5+ |
| Lenguaje | TypeScript (strict mode) | 5+ |
| Base de Datos | Supabase (PostgreSQL) | — |
| Autenticación | Supabase Auth (JWT) | — |
| Procesamiento OCR/PDF | Supabase Edge Functions (Deno) | — |
| Mapas | Mapbox GL JS | 3+ |
| Storage Local | @capacitor/filesystem | — |

---

## ⚙️ Instalación y Configuración

### Prerrequisitos

- Node.js 18+
- npm 9+
- Ionic CLI
- Android Studio (para builds Android) o Xcode (para builds iOS)
- Cuenta en [Supabase](https://supabase.com) y [Mapbox](https://mapbox.com)

### 1. Clonar el repositorio

```bash
git clone https://github.com/hjnavarro12-star/primiparada.git
cd primiparada
```

### 2. Instalar dependencias

```bash
npm install
```

La instalación ya incluye las dependencias que usa la app en esta base, como `@capacitor/preferences` para persistencia local, además de `@capacitor/camera`, `@capacitor/geolocation`, `@capacitor/local-notifications`, `@capacitor/haptics`, `@capacitor/network`, `@capacitor/motion`, `@capacitor-community/text-to-speech`, `bootstrap`, `mapbox-gl`, `pg` y `@supabase/supabase-js`. No necesitas instalarlas por separado.

### 3. Configurar variables de entorno

Crear el archivo `src/environments/environment.ts` con las siguientes claves para desarrollo local, o mejor aún usar un archivo `.env` que no se comite:

```typescript
export const environment = {
  production: false,
  supabaseUrl: 'https://xxqtmbptexnusrhitvnk.supabase.co',
  supabaseAnonKey: '[TU_ANON_KEY]',
  mapboxToken: '[TU_MAPBOX_TOKEN]',
};
```

Buenas prácticas sobre secretos:

- Nunca subas claves privadas o tokens reales al repositorio. Usa un archivo `.env` añadido a `.gitignore` o variables de entorno en tu CI/CD.
- Hemos incluido `.env.example` con las variables que el proyecto espera (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `MAPBOX_TOKEN`). Copia `.env.example` → `.env` y rellena los valores.
- Para builds de producción, configura las variables en tu pipeline (GitHub Actions, GitLab CI, Vercel, etc.) y úsalas desde la configuración del build; no las incluyas en `environment.production.ts`.

### 3.1 Conexión resiliente a Supabase

Para evitar depender de un único host, el proyecto incluye un resolvedor de conexión con reintentos y fallback:

```bash
npm run db:check-hosts
npm run db:execute-schema
npm run db:validate-schema
```

Variables soportadas por el resolvedor:

- `SUPABASE_DB_HOST`: host principal, por defecto `db.xxqtmbptexnusrhitvnk.supabase.co`
- `SUPABASE_DB_FALLBACK_HOSTS`: lista separada por comas con hosts alternativos
- `SUPABASE_DB_PORT`: puerto PostgreSQL, por defecto `5432`
- `SUPABASE_DB_NAME`: base de datos, por defecto `postgres`
- `SUPABASE_DB_USER`: usuario, por defecto `postgres`
- `SUPABASE_DB_PASSWORD`: contraseña de la base de datos
- `SUPABASE_DB_SSL`: `true` o `false`, por defecto `true`
- `SUPABASE_DB_TIMEOUT_MS`: tiempo máximo por host antes de fallback, por defecto `2500`
- `SUPABASE_DB_RETRIES`: cantidad de reintentos por host antes de pasar al siguiente, por defecto `3`
- `SUPABASE_DB_RETRY_DELAY_MS`: pausa base entre reintentos del mismo host, por defecto `500`

Si el host principal falla, el script intenta los fallback en orden y reporta cuál quedó disponible antes de conectar.

### 4. Configurar la base de datos

Ejecutar el script SQL incluido en `/database/schema.sql` desde el editor SQL de tu proyecto en Supabase. Esto crea las tablas, relaciones y políticas de Row Level Security (RLS).

### 5. Correr en el navegador (desarrollo)

```bash
ionic serve
```

### 6. Sincronizar y abrir en dispositivo o emulador

```bash
npx cap sync
npx cap open android   # para Android Studio
npx cap open ios       # para Xcode
```

---

## 🔄 Metodología — SCRUM

El proyecto se desarrolla en **7 Sprints de 2 semanas** (14 semanas en total), divididos en dos fases:

**Fase 1 — Seminario I** (Sprints 1 al 3): Infraestructura base, autenticación, ingreso manual de horario y mapa estático con puntos de interés.

**Fase 2 — Seminario II** (Sprints 4 al 7): Migración a Ionic/Capacitor, OCR por cámara, GPS en tiempo real, notificaciones locales y builds de producción.

| Sprint | Semanas | Objetivo |
|---|---|---|
| Sprint 1 | 1 – 2 | Infraestructura Angular + Supabase + Autenticación |
| Sprint 2 | 3 – 4 | Dashboard público/privado y UI base completa |
| Sprint 3 | 5 – 6 | Horario manual y mapa estático con POIs |
| Sprint 4 | 7 – 8 | Migración Ionic + Cámara + OCR en la nube |
| Sprint 5 | 9 – 10 | GPS real + Navegación dinámica + Parser PDF |
| Sprint 6 | 11 – 12 | Alertas locales + Configuraciones y personalización |
| Sprint 7 | 13 – 14 | QA, optimización y builds de producción |

> 📌 El gestor de tareas (Trello / Jira) se vinculará aquí una vez habilitado. Por ahora el seguimiento se realiza directamente sobre los PBIs documentados en `/docs/backlog.md`.

---

## 👥 Equipo

| Rol | Responsabilidad |
|---|---|
| Product Owner | Priorización del backlog y validación con usuarios |
| Scrum Master | Facilitación de ceremonias y remoción de impedimentos |
| Frontend Dev | Angular, Ionic, Capacitor, integración de mapas |
| Backend Dev | Supabase, Edge Functions (Deno), OCR, RLS |
| QA / Mobile Dev | Testing en dispositivos físicos, builds iOS y Android |

---

## 📄 Licencia

Este proyecto es de uso académico en el marco del programa de Ingeniería de la Universidad del Pacífico.
