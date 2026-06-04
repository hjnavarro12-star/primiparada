# 📓 LOGBOOK — Primíparos de la UnPa

> **Archivo local — nunca sube a GitHub** (está en `.gitignore`).  
> Copilot lo llena **una vez por Sprint**, al final, cuando Dev #2 lo pide.  
> Dev #2 usa este archivo como fuente única para: commits, PRs, changelog y comentarios de Trello.

---

**Proyecto:** Primíparos de la UnPa  
**Repositorio:** https://github.com/[usuario]/primiparos-unpa  
**Tablero Trello:** https://trello.com/b/[ID]/primiparos-de-la-unpa  
**Metodología:** SCRUM — 7 Sprints × 2 semanas  
**Equipo:**

| ID | Rol | Dominio |
|---|---|---|
---

<!-- ═══════════════════════════════════════════════════════
     COPILOT AGREGA LOS BLOQUES DE SPRINT AQUÍ, EL MÁS
     RECIENTE PRIMERO. NO EDITAR MANUALMENTE ESTA ZONA.
     ═══════════════════════════════════════════════════════ -->

---
## 🧭 REGISTRO DE AUDITORIAS TECNICAS | Junio 2026
**Estado:** En consolidacion

### 1. Resumen tecnico
Se creo una base documental versionada para separar la biblia funcional de la auditoria real del codigo. La nueva documentacion cubre frontend no descrito en la biblia, backend tecnico embebido en Angular/Supabase, checklist DoD y un indice cronologico de auditorias por version.

### 2. Registros agregados
| Version | Tipo | Resultado |
|---|---|---|
| v0.1.0 | Auditoria Sprint 1 | Infraestructura, auth y schema base |
| v0.2.0 | Auditoria Sprint 2 | Dashboard, UI base y guards |
| v0.2.1 | Auditoria actual | Mock local, sync offline, areas no documentadas |

### 3. Documentacion creada
| Archivo | Proposito |
|---|---|
| docs/README.md | Indice general de documentacion |
| docs/audits/README.md | Registro cronologico de auditorias |
| docs/frontend/FRONTEND-REFERENCE.md | Frontend tecnico no documentado |
| docs/backend/BACKEND-REFERENCE.md | Backend tecnico no documentado |
| docs/quality/DOD-CHECKLIST.md | DoD unificada |

### 4. Observaciones de auditoria
- El proyecto tiene mas comportamiento real del que describe la biblia original.
- Hay flows completos de horarios, alertas y settings que solo existian como referencia parcial.
- El mock local de Supabase permite seguir auditando sin tocar backend real.

---

## 🚀 DESPLIEGUE AL SUBDOMINIO — DECISIÓN MAPBOX_TOKEN

**Fecha:** 04/06/2026  
**Decisión:** Usar placeholder para MAPBOX_TOKEN, proceder con despliegue con 7 secretos

### 1. Contexto
- 8 secretos requeridos para GitHub Actions
- 7 secretos confirmados y extraídos de documentación existente (Supabase, Subdominio.txt)
- MAPBOX_TOKEN faltante (requiere crear cuenta en mapbox.com)
- Usuario decide: No necesario para entrega actual

### 2. Decisión tomada
```
"POpongamos ese unico token, ya que no es necesario para la entrega de ahora,
con esos que ya tenemos continúa con el despliegue."
```

**Acción:** Usar placeholder `pk_live_placeholder_not_required_for_current_release`

### 3. Documentos creados para despliegue
| Archivo | Propósito |
|---|---|
| notes/SECRETOS-FINALES-LISTOS.txt | 8 secretos con valores exactos, listos para copiar-pegar |
| notes/DESPLIEGUE-PASO-A-PASO.txt | Guía completa: 7 fases, 45-60 minutos, checklist final |

### 4. Estado de despliegue
✅ Código: `.github/workflows/deploy.yml` completado y committeado  
✅ Ramas: `production` (deploy), `main` (release), `main-old` (backup)  
✅ Build: Validado localmente (`npm run build` genera `dist/`)  
✅ Secretos: 8 identificados, 7 confirmados, 1 placeholder  
🔄 GitHub Secrets: Pendiente agregar 8 secretos en repository settings  
⏳ Deploy: Listo para trigger al hacer push a `production`

### 5. Próximos pasos (workflow automatizado)
1. (Manual) Ir a: https://github.com/hjnavarro12-star/primiparada/settings/secrets/actions
2. (Manual) Agregar 8 secretos del archivo SECRETOS-FINALES-LISTOS.txt (~10 min)
3. (Automático) Push a production → GitHub Actions ejecuta: lint → test → build → deploy
4. (Manual) Verificar en: https://primiparada.seminario1.eleueleo.com
5. (Opcional) Crear PR production → main para marcar release en main

### 5. Pendientes
- Cerrar la ejecucion E2E completa cuando se instalen las dependencias necesarias.
- Continuar la auditoria manual de los dominios restantes con la nueva base documental.

---
## 🏁 SPRINT 2 — Dashboard y UI Base | Semanas 3–4
**Estado:** ✅ Cerrado  
**Velocity:** 31 pts

### 1. Resumen técnico
Quedó montado el dashboard público con iframe de noticias con carga diferida y fallback visual, más el dashboard privado con tarjeta reactiva de próxima clase y navegación interna por menú. También se cerró el flujo de salida segura con `ExitGuard`, se consolidó la UI final de las vistas V2–V31 como prototipo operativo y se protegió el acceso privado con `AuthService` y guards de ruta.

### 2. PBIs completados
| PBI | Nombre | Rol — Persona | Puntos |
|---|---|---|---|
| PBI-06 | V1: Dashboard Público con video, iframe noticias (lazy) y botones | Frontend — P2 | 5 pts |
| PBI-07 | V4: Dashboard Privado con tarjeta próxima clase y menú hamburguesa | Frontend — P2 | 5 pts |
| PBI-08 | Interceptor de salida: modal "¿Salir?" en V1 y V4 | Frontend — P2 | 3 pts |
| PBI-09 | UI final de V2–V31 construida (sin lógica completa, con flechas retroceso) | Frontend — P2 | 13 pts |
| PBI-10 | AuthService + guards de ruta (rutas privadas protegidas) | Backend — P3 | 5 pts |

---

### 3. Commits y PR — Instrucciones para Dev #2

> Este sprint se puede cerrar con commits separados por PBI o con un commit consolidado por bloque funcional, según cómo se mantenga la rama. Lo importante es preservar trazabilidad entre vistas, guards y servicios.

> Ejecutar estos comandos en orden después de validar el código de este Sprint:

```bash
# 1. Verificar la rama del Sprint 2
git checkout sprint-2/dashboard-ui-base

# Commit consolidado del Sprint 2 (ajustar el mensaje si ya existen commits separados)
git add src/app/features/access/v1-dashboard.ts src/app/features/access/v4-dashboard.ts src/app/core/guards/exit.guard.ts src/app/core/services/auth.service.ts src/app/features/access/access.routes.ts src/app/app.routes.ts src/app/app.html src/app/view-catalog.ts src/app/features/** src/app/shared/**
git commit -m "feat(sprint2): cerrar dashboard y UI base (PBI-06 a PBI-10)" -m "- PBI-06: dashboard público con video, noticias lazy y botones
- PBI-07: dashboard privado con próxima clase y menú hamburguesa
- PBI-08: modal de salida segura en V1 y V4
- PBI-09: UI final V2-V31 construida como prototipo operativo
- PBI-10: AuthService y guards de ruta para proteger vistas privadas"

# 2. Push y abrir PR
git push origin sprint-2/dashboard-ui-base
```

**Descripción del PR en GitHub:**
```markdown
## Sprint 2 — Dashboard y UI Base

### Qué incluye este PR
- [PBI-06] Dashboard público con video, noticias lazy y acciones de acceso.
- [PBI-07] Dashboard privado con próxima clase reactiva y menú hamburguesa.
- [PBI-08] Modal de salida segura para V1 y V4.
- [PBI-09] UI final V2–V31 como prototipo completo y navegable.
- [PBI-10] AuthService y guards de ruta para proteger el área privada.

### Cómo probar
1. Abrir V1 y V4 y validar carga del contenido principal y el modal de salida.
2. Iniciar sesión y verificar que las rutas privadas se bloqueen sin autenticación.
3. Revisar que la UI base de V2–V31 navegue con flechas de retroceso y sin romper el layout.

### Checklist DoD
- [ ] ng build sin errores
- [ ] Prueba en navegador en 360px y 768px
- [ ] Variables de entorno configuradas (ver .env.example)
```

---

### 4. CHANGELOG — Sprint 2

> Copiar este bloque al archivo `CHANGELOG.md` del repositorio, encima de la versión anterior:

```markdown
## [0.2.0] - 26/05/2026 — Sprint 2: Dashboard y UI Base

### Added
- feat(sprint2): cerrar dashboard y UI base (PBI-06 a PBI-10) — P2 Frontend, P3 Backend

### Changed
- refactor(access): dashboard público y privado con carga diferida y navegación segura (PBI-06, PBI-07, PBI-08)
- refactor(auth): guards de ruta y persistencia de sesión para el área privada (PBI-10)

### Fixed
- fix(ui): shell final de vistas V2–V31 con navegación consistente y flechas de retroceso (PBI-09)
```

---

### 5. Entradas para Trello — Copiar a cada tarjeta

**Tarjeta PBI-06 — V1: Dashboard Público con video, iframe noticias (lazy) y botones:**
```
✅ Completado — Sprint 2

Rol: Frontend
Encargado: Persona 2 — Frontend / UI Lead

Archivos modificados:
     src/app/features/access/v1-dashboard.ts — dashboard público con hero, video e iframe lazy.
     src/app/features/access/v1-dashboard.spec.ts — cobertura de render y fallback de noticias.

Commit: feat(sprint2): cerrar dashboard y UI base (PBI-06 a PBI-10)
Branch: sprint-2/dashboard-ui-base
Merge: 26/05/2026

Notas de prueba para el equipo:
     • Verificar que el iframe de noticias cargue con fallback visual.
     • Confirmar que los botones Login y Registro sigan visibles y accionables.
```

**Tarjeta PBI-07 — V4: Dashboard Privado con tarjeta próxima clase y menú hamburguesa:**
```
✅ Completado — Sprint 2

Rol: Frontend
Encargado: Persona 2 — Frontend / UI Lead

Archivos modificados:
     src/app/features/access/v4-dashboard.ts — dashboard privado con menú, noticia lazy y próxima clase.
     src/app/features/access/v4-dashboard.spec.ts — validación de tarjeta reactiva y estado vacío.

Commit: feat(sprint2): cerrar dashboard y UI base (PBI-06 a PBI-10)
Branch: sprint-2/dashboard-ui-base
Merge: 26/05/2026

Notas de prueba para el equipo:
     • Iniciar sesión y confirmar que la tarjeta de próxima clase se actualiza con el servicio.
     • Abrir y cerrar el menú hamburguesa sin afectar el contenido principal.
```

**Tarjeta PBI-08 — Interceptor de salida: modal "¿Salir?" en V1 y V4:**
```
✅ Completado — Sprint 2

Rol: Frontend
Encargado: Persona 2 — Frontend / UI Lead

Archivos modificados:
     src/app/core/guards/exit.guard.ts — guard de salida con confirmación y soporte async.
     src/app/core/guards/exit.guard.spec.ts — pruebas de confirmación y override de canExit.
     src/app/features/access/access.routes.ts — aplicación del guard en V1 y V4.

Commit: feat(sprint2): cerrar dashboard y UI base (PBI-06 a PBI-10)
Branch: sprint-2/dashboard-ui-base
Merge: 26/05/2026

Notas de prueba para el equipo:
     • Pulsar atrás en V1 y V4 y confirmar que el modal aparece.
     • Verificar que cancelar mantiene la vista abierta.
```

**Tarjeta PBI-09 — UI final de V2–V31 construida (sin lógica completa, con flechas retroceso):**
```
✅ Completado — Sprint 2

Rol: Frontend
Encargado: Persona 2 — Frontend / UI Lead

Archivos modificados:
     src/app/view-catalog.ts — catálogo de vistas y grupos funcionales.
     src/app/view-page.ts — render genérico de vistas placeholder.
     src/app/features/** — vistas base y estructura visual de navegación.

Commit: feat(sprint2): cerrar dashboard y UI base (PBI-06 a PBI-10)
Branch: sprint-2/dashboard-ui-base
Merge: 26/05/2026

Notas de prueba para el equipo:
     • Navegar entre vistas y confirmar flechas de retroceso en las que aplican.
     • Validar que el layout no rompa en móvil ni en tablet.
```

**Tarjeta PBI-10 — AuthService + guards de ruta (rutas privadas protegidas):**
```
✅ Completado — Sprint 2

Rol: Backend
Encargado: Persona 3 — Backend / Infraestructura

Archivos modificados:
     src/app/core/services/auth.service.ts — persistencia de sesión y bootstrap de auth.
     src/app/core/guards/auth.guard.ts — protección de rutas privadas.
     src/app/features/access/access.routes.ts — rutas privadas y públicas separadas.

Commit: feat(sprint2): cerrar dashboard y UI base (PBI-06 a PBI-10)
Branch: sprint-2/dashboard-ui-base
Merge: 26/05/2026

Notas de prueba para el equipo:
     • Intentar entrar a una ruta privada sin sesión y verificar redirección.
     • Confirmar auto-login al reabrir la app con una sesión válida.
```

---
### Retrospectiva Sprint 2 ← Dev #2 llena esto
- **¿Qué salió bien?** — Se consolidó la base visual del producto y se separaron claramente las responsabilidades entre acceso público, acceso privado y protección de rutas.
- **¿Qué mejorar?** —
- **Impedimentos encontrados?** —

---
## 🚀 DESPLIEGUE AL SUBDOMINIO — Estructura de Rama Production
**Fecha:** 04/06/2026  
**Estado:** ✅ Rama `production` creada, workflow actualizado, pendiente: Configurar GitHub Secrets

### 1. Cambios realizados
- ✅ Rama `production` creada desde `sprint-2/dashboard-ui-base`
- ✅ Workflow de CI/CD: `.github/workflows/deploy.yml` (actualizado para desplegar en push a `production`)
- ✅ Documentación de despliegue: `notes/deployment-subdomain-guide.txt` (actualizada)
- ✅ Configuración de secretos: `notes/github-secrets-setup.txt`
- ✅ Checklist de verificación: `notes/deployment-checklist.txt` (actualizado)
- ✅ Referencia rápida: `notes/deployment-quick-reference.txt` (actualizado)
- ✅ `.gitignore` actualizado para excluir `.env` y secretos locales
- ✅ `README.md` con sección de despliegue

### 2. Arquitectura del despliegue (ACTUALIZADA)
```
feature-branch
      ↓
Desarrollo (PR a production)
      ↓
GitHub Actions: lint, test, build (valida en cualquier PR)
      ↓
Merge a production
      ↓
Push a production
      ↓
GitHub Actions: deploy job (SOLO en push a production)
      ↓
SSH/SCP copia dist/primiparada/ → /var/www/seminario1/primiparada
      ↓
https://primiparada.seminario1.eleueleo.com (actualizado)
      ↓
(Opcional) PR production → main (marca release)
      ↓
Merge a main (versión estable, sin deploy automático)
```

### 3. Estructura de ramas (NUEVA)
| Rama | Propósito | Deploy automático |
|---|---|---|
| `production` | Rama de despliegue | ✅ Sí (en cada push) |
| `main` | Rama de release (estable) | ❌ No |
| `feature/*`, `sprint-*` | Trabajo en progreso | ❌ No (valida en PR) |

### 4. GitHub Secrets requeridos (PRÓXIMO PASO)
Ver: https://github.com/hjnavarro12-star/primiparada/settings/secrets/actions

- `SUPABASE_URL` → https://xxqtmbptexnusrhitvnk.supabase.co
- `SUPABASE_ANON_KEY` → sb_publishable_4HgvVwyulYTp51f-2V5w4Q_0gUfDFJD
- `MAPBOX_TOKEN` → [Tu token]
- `SSH_HOST` → 187.77.27.122
- `SSH_USERNAME` → primiparada
- `SSH_PORT` → 22
- `SSH_DEPLOY_PATH` → /var/www/seminario1/primiparada
- `SSH_PRIVATE_KEY` → [Clave SSH de Subdominio.txt]

### 5. Commits en rama production
- Hash: `c62ac4f`
- Mensaje: `chore(deploy): update workflow to deploy on push to production branch`
- Archivo: `.github/workflows/deploy.yml` (actualizado)

### 6. Validaciones pre-merge
- ✅ Linting: `npm run lint`
- ✅ Tests: `npm run test:ci`
- ✅ Build: `npm run build` (genera dist/primiparada/)
- ✅ Secretos: No hay filtración en `.env` o `src/environments/environment.generated.ts`

### 7. Flujo de trabajo académico
1. Developer crea rama desde `production` (ej. `feature/nueva-funcionalidad`)
2. Implementa cambios y hace commits
3. Push y abre PR a `production`
4. GitHub Actions valida (lint, test, build)
5. Code review + merge a `production`
6. GitHub Actions deploy automático al subdominio
7. (Opcional) PR desde `production` a `main` para release
8. Merge a `main` marca versión estable

### 8. Resultado esperado
- PRs a `production`: validan pero no despliegan
- Push a `production`: deploy automático en < 5 minutos
- Sitio vivo en: https://primiparada.seminario1.eleueleo.com
- PRs a `main` desde `production`: validan pero no despliegan
- Merge a `main`: marca versión estable (sin deploy)

### 9. Próximos pasos (para el equipo)
1. Ir a GitHub → Settings → Secrets and variables → Actions
2. Crear cada secreto (8 en total) copiando desde `notes/github-secrets-setup.txt`
3. En la rama `production`, hacer cambios o commits si es necesario
4. Push a `production` → GitHub Actions valida y despliega automáticamente
5. (Opcional) Abrir PR desde `production` a `main` cuando está lista una release
6. Verificar en navegador: https://primiparada.seminario1.eleueleo.com

---
## 🏁 SPRINT 1 — Infraestructura y Auth | Semanas 1–2
**Estado:** ✅ Cerrado  
**Velocity:** 29 pts

### 1. Resumen técnico
Quedó listo el shell inicial de Angular con carga perezosa para las 31 vistas, más el mapa de navegación centralizado por dominio. Se dejó Supabase conectado con contrato local para schema y rutas de acceso dedicadas para login, registro y vistas placeholder, con auto-login funcional en V2.

### 2. PBIs completados
| PBI | Nombre | Rol — Persona | Puntos |
|---|---|---|---|
| PBI-01 | Proyecto Angular 17 standalone configurado, estructura de carpetas, lazy routing | Frontend — P2 | 5 pts |
| PBI-02 | Supabase: tablas creadas, RLS activado, variables de entorno conectadas | Backend — P3 | 8 pts |
| PBI-03 | Registro con correo/contraseña + selección de Programa Académico | Backend — P3 | 5 pts |
| PBI-04 | Inicio de sesión con persistencia de sesión (auto-login) | Backend — P3 | 3 pts |
| PBI-05 | Shell de navegación completa V1–V31 con rutas configuradas (vistas vacías OK) | Frontend — P2 | 8 pts |

---

### 3. Commits y PR — Instrucciones para Dev #2

> Nota importante: este sprint quedó consolidado en un solo commit reescrito sobre la rama. El mensaje incluye el desglose por PBI para mantener trazabilidad, aunque no exista un commit separado por cada historia.

> Ejecutar estos comandos en orden después de validar el código de este Sprint:

```bash
# 1. Verificar que la rama sea la del Sprint 1
git checkout sprint-1/infraestructura-auth

# Commit consolidado del Sprint 1
git add src/app/ src/environments/ scripts/ supabase/ package.json README.md .env.example CHANGELOG.md LOGBOOK.md
git commit --amend -m "feat(sprint1): registrar entrega del Sprint 1 (PBI-01 a PBI-05)" -m "- PBI-01: shell Angular standalone con lazy routing y estructura base
- PBI-02: esquema Supabase, RLS y variables de entorno conectadas
- PBI-03: registro con selección de programa académico
- PBI-04: login persistente con auto-login
- PBI-05: shell de navegación V1-V31 con rutas configuradas"

# 2. Push y abrir PR
git push --force-with-lease origin sprint-1/infraestructura-auth
```

**Descripción del PR en GitHub:**
```markdown
## Sprint 1 — Infraestructura y Auth

### Qué incluye este PR
- [PBI-01] Shell Angular standalone con lazy routing y vistas base.
- [PBI-02] Esquema Supabase, RLS y configuración local para validación.
- [PBI-03] Registro con programa académico y persistencia de perfil.
- [PBI-04] Inicio de sesión con sesión persistente y auto-login.
- [PBI-05] Shell de navegación completa V1-V31 con rutas configuradas.

### Cómo probar
1. Ejecutar `npm test` y verificar que la suite quede en verde.
2. Navegar a `/access/v1`, `/access/v2`, `/access/v3` y las rutas placeholder de V1-V31.

### Checklist DoD
- [ ] ng build sin errores
- [ ] Prueba en navegador en 360px y 768px
- [ ] Variables de entorno configuradas (ver .env.example)
```

---

### 4. CHANGELOG — Sprint 1

> Copiar este bloque al archivo `CHANGELOG.md` del repositorio, encima de la versión anterior:

```markdown
## [0.1.0] - 30/04/2026 — Sprint 1: Infraestructura y Auth

### Added
- feat(sprint1): registrar entrega del Sprint 1 (PBI-01 a PBI-05) — P2 Frontend, P3 Backend
```

---

### 5. Entradas para Trello — Copiar a cada tarjeta

**Tarjeta PBI-01 — Proyecto Angular 17 standalone configurado, estructura de carpetas, lazy routing:**
```
✅ Completado — Sprint 1

Rol: Frontend
Encargado: Persona 2 — Frontend / UI Lead

Archivos modificados:
     src/app/app.routes.ts — shell raíz con lazy loading de dominios.
     src/app/view-catalog.ts — catálogo central de vistas V1-V31.
     src/app/app.html — mapa visual del shell y navegación.

Commit: feat(sprint1): registrar entrega del Sprint 1 (PBI-01 a PBI-05)
Branch: sprint-1/infraestructura-auth
Merge: 30/04/2026

Notas de prueba para el equipo:
     • Abrir el shell y navegar por los dominios principales.
     • Verificar que el proyecto cargue sin errores de routing.
```

**Tarjeta PBI-02 — Supabase: tablas creadas, RLS activado, variables de entorno conectadas:**
```
✅ Completado — Sprint 1

Rol: Backend
Encargado: Persona 3 — Backend / Infraestructura

Archivos modificados:
     supabase/schema.sql — esquema y políticas RLS.
     src/environments/environment.ts — URL y anon key de Supabase.
     .env.example — plantilla de variables locales.

Commit: feat(sprint1): registrar entrega del Sprint 1 (PBI-01 a PBI-05)
Branch: sprint-1/infraestructura-auth
Merge: 30/04/2026

Notas de prueba para el equipo:
     • Validar el schema en Supabase Dashboard.
     • Confirmar que las variables de entorno están cargadas.
```

**Tarjeta PBI-03 — Registro con correo/contraseña + selección de Programa Académico:**
```
✅ Completado — Sprint 1

Rol: Backend
Encargado: Persona 3 — Backend / Infraestructura

Archivos modificados:
     src/app/core/services/registration.service.ts — alta de usuario y perfil.
     src/app/features/access/register-page.ts — formulario de registro.
     src/app/core/services/programs.service.ts — carga de programas con fallback local.

Commit: feat(sprint1): registrar entrega del Sprint 1 (PBI-01 a PBI-05)
Branch: sprint-1/infraestructura-auth
Merge: 30/04/2026

Notas de prueba para el equipo:
     • Registrar un usuario nuevo con un programa válido.
     • Validar fallback offline de programas.
```

**Tarjeta PBI-04 — Inicio de sesión con persistencia de sesión (auto-login):**
```
✅ Completado — Sprint 1

Rol: Backend
Encargado: Persona 3 — Backend / Infraestructura

Archivos modificados:
     src/app/core/services/auth.service.ts — bootstrap y persistencia de sesión.
     src/app/features/access/login-page.ts — auto-login y redirección.
     src/app/features/access/access.routes.ts — rutas de acceso dedicadas.

Commit: feat(sprint1): registrar entrega del Sprint 1 (PBI-01 a PBI-05)
Branch: sprint-1/infraestructura-auth
Merge: 30/04/2026

Notas de prueba para el equipo:
     • Cerrar y volver a abrir la app para validar sesión persistente.
     • Confirmar redirección automática al dashboard privado.
```

**Tarjeta PBI-05 — Shell de navegación completa V1–V31 con rutas configuradas (vistas vacías OK):**
```
✅ Completado — Sprint 1

Rol: Frontend
Encargado: Persona 2 — Frontend / UI Lead

Archivos modificados:
     src/app/app.routes.ts — carga perezosa de dominios.
     src/app/features/access/access.routes.ts — rutas V1-V4.
     src/app/features/alerts/alerts.routes.ts — rutas V5-V6.
     src/app/features/campus/campus.routes.ts — rutas V7-V20 y V25.
     src/app/features/schedule/schedule.routes.ts — rutas V21-V24.
     src/app/features/settings/settings.routes.ts — rutas V26-V31.
     src/app/view-catalog.ts — catálogo completo de vistas y grupos.
     src/app/app.html — shell visual con navegación.

Commit: feat(sprint1): registrar entrega del Sprint 1 (PBI-01 a PBI-05)
Branch: sprint-1/infraestructura-auth
Merge: 30/04/2026

Notas de prueba para el equipo:
     • Navegar a cada dominio y confirmar redirects base.
     • Verificar que todas las rutas placeholder resuelven a ViewPage.
```

---
### Retrospectiva Sprint 1 ← Dev #2 llena esto
- **¿Qué salió bien?** — El sprint quedó documentado por PBI y alineado con un único commit consolidado que mantiene trazabilidad sin inventar continuidad artificial.
- **¿Qué mejorar?** —
- **¿Impedimentos encontrados?** —

### 6. Cierre documental posterior al Sprint 1
- Se cerró la cuenta real de pruebas para el flujo de registro: `user0@unpa.edu.co` con contraseña `usuario0`.
- Se eliminó el domingo del modelo de horario y de los selectores; el horario quedó en lunes a sábado.
- V24 quedó con calendario reactivo por defecto y un toggle para expandir o compactar la vista semanal.
- V21, V22 y V23 quedaron alineados con sábado como tope del calendario y con `dayLabel` compartido.
- Pendiente fuera de este sprint: reemplazar los mocks de OCR en V22/V23 por integración real de Edge Functions.
- Pendiente fuera de este sprint: la integración real de Mapbox queda para una fase posterior y no forma parte del cierre actual.

---

## 📋 HISTORIAL DE VERSIONES (CHANGELOG GLOBAL)

> Copilot llena cada versión al cerrar el Sprint.  
> Dev #2 copia el bloque generado al archivo `CHANGELOG.md` del repositorio.

```
[Unreleased]

[0.1.0] - 30/04/2026 — Sprint 1: Infraestructura y Auth
[0.2.0] - Pendiente — Sprint 2: Dashboard y UI Base
[0.3.0] - Pendiente — Sprint 3: Horario Manual y Mapa
[0.4.0] - Pendiente — Sprint 4: Ionic + Cámara + OCR
[0.5.0] - Pendiente — Sprint 5: GPS y Navegación
[0.6.0] - Pendiente — Sprint 6: Alertas y Config
[1.0.0] - Pendiente — Sprint 7: QA y Producción
```

---

*LOGBOOK inicializado — sin entradas de Sprint aún. Archivo local, nunca se sube a GitHub.*
