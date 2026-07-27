import { runtimeEnvironment } from './environment.generated';

export const environment = {
  production: false,
  authMode: 'remote' as const,
  apiUrl: 'https://primiparada.seminario1.eleueleo.com/api',
  supabaseUrl: runtimeEnvironment.supabaseUrl || 'https://xxqtmbptexnusrhitvnk.supabase.co',
  supabaseAnonKey: runtimeEnvironment.supabaseAnonKey || '[ANON_KEY]',
  mapboxToken: runtimeEnvironment.mapboxToken || '[MAPBOX_TOKEN]'
};
