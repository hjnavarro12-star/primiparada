import { runtimeEnvironment } from './environment.generated';

export const environment = {
  production: true,
  authMode: 'remote' as const,
  // URL del backend API — se inyecta desde CI via environment.generated.ts
  apiUrl: runtimeEnvironment.apiUrl || '',
  // Mapbox — se mantiene para PBIs del mapa
  mapboxToken: runtimeEnvironment.mapboxToken || '',
  // Supabase — solo para NewsService y ProgramsService mientras se migran al VPS
  // Se eliminarán cuando se complete el Bloque 3 del checklist de migración.
  supabaseUrl: runtimeEnvironment.supabaseUrl || '',
  supabaseAnonKey: runtimeEnvironment.supabaseAnonKey || ''
};
