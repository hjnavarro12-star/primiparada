import { runtimeEnvironment } from './environment.generated';

export const environment = {
  production: false,
  authMode: 'remote' as const,
  // URL del backend API — en desarrollo apunta a localhost si hay servidor local,
  // o al nuevo servidor cuando esté disponible.
  // Se puede sobreescribir via environment.generated.ts (generado en CI).
  apiUrl: runtimeEnvironment.apiUrl || 'http://localhost:8084/api',
  // Mapbox — se mantiene para PBIs del mapa
  mapboxToken: runtimeEnvironment.mapboxToken || '',
  // Supabase — solo para NewsService y ProgramsService mientras se migran al VPS
  // Se eliminarán cuando se complete el Bloque 3 del checklist de migración.
  supabaseUrl: runtimeEnvironment.supabaseUrl || '',
  supabaseAnonKey: runtimeEnvironment.supabaseAnonKey || ''
};
