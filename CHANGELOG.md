# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
y el proyecto sigue [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

---

## [0.1.0] - 30/04/2026 — Sprint 1: Infraestructura y Auth

### Added
- feat(auth): configurar proyecto Angular con lazy routing (PBI-01) — P2 Frontend
- feat(db): crear esquema PostgreSQL y RLS en Supabase (PBI-02) — P3 Backend
- feat(auth): habilitar registro con selección de programa académico (PBI-03) — P3 Backend
- feat(auth): persistir sesión y auto-login en inicio (PBI-04) — P3 Backend
- feat(shell): exponer shell de navegación V1-V31 (PBI-05) — P2 Frontend

### Technical Details
- Shell Angular 17 standalone con lazy loading en 5 dominios (access, alerts, campus, schedule, settings)
- Catálogo centralizado de vistas V1–V31 con enrutamiento por área
- Supabase con schema de usuarios, programas, horarios, salas y políticas RLS
- AuthService con bootstrap de sesión y auto-login funcional
- Fallback offline de programas académicos

### Testing
- 36/36 tests unitarios pasando
- Contratos de routing validados (V1–V31)
- Validación local de schema sin dependencia de red

### Breaking Changes
Ninguno — es el primer release.

---

## [0.2.0] - 26/05/2026 — Sprint 2: Dashboard y UI Base

### Added
- feat(access): consolidar dashboard público con iframe de noticias lazy y fallback visual (PBI-06) — P2 Frontend
- feat(access): consolidar dashboard privado con tarjeta reactiva de próxima clase y menú interno (PBI-07) — P2 Frontend
- feat(access): interceptar salida segura con modal de confirmación en V1 y V4 (PBI-08) — P2 Frontend
- feat(shell): cerrar UI final de V2-V31 como prototipo operativo navegable (PBI-09) — P2 Frontend
- feat(auth): proteger rutas privadas con AuthService y guards (PBI-10) — P3 Backend

### Technical Details
- Dashboard público con video, noticias lazy y fallback visual
- Dashboard privado con navegación interna y tarjeta reactiva de próxima clase
- ExitGuard aplicado a V1 y V4 para confirmar salida
- UI base V2-V31 consolidada como shell navegable
- AuthService y guards de ruta para separar acceso público y privado

### Fixed
- fix(storage): consolidar la persistencia local y el auto-login sobre la base del Sprint 1
- fix(schedule): ajustar el horario para lunes a sábado y normalizar las etiquetas de día
- fix(ui): estabilizar la vista reactiva del horario y su alternancia entre modos de visualización
- fix(auth): dejar protegidas las rutas privadas con el guard de autenticación y el flujo de salida segura

### Testing
- Validación de navegación, guards y estado reactivo del dashboard
- Cobertura de vistas base y comportamiento de salida segura

### Breaking Changes
Ninguno

## [0.3.0] - Pendiente — Sprint 3: Horario Manual y Mapa Estático

## [0.4.0] - Pendiente — Sprint 4: Migración Ionic + Cámara + OCR

## [0.5.0] - Pendiente — Sprint 5: GPS + Navegación + PDF

## [0.6.0] - Pendiente — Sprint 6: Alertas + Configuraciones

## [1.0.0] - Pendiente — Sprint 7: QA + Builds + Documentación
