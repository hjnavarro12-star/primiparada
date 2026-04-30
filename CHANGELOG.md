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

## [0.2.0] - Pendiente — Sprint 2: Dashboard y UI Base

## [0.3.0] - Pendiente — Sprint 3: Horario Manual y Mapa Estático

## [0.4.0] - Pendiente — Sprint 4: Migración Ionic + Cámara + OCR

## [0.5.0] - Pendiente — Sprint 5: GPS + Navegación + PDF

## [0.6.0] - Pendiente — Sprint 6: Alertas + Configuraciones

## [1.0.0] - Pendiente — Sprint 7: QA + Builds + Documentación
