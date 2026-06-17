import { runtimeEnvironment } from './environment.generated';

export const environment = {
  production: true,
  authMode: 'remote' as const,
  apiUrl: 'https://primiparada.seminario1.eleueleo.com/api',
  supabaseUrl: runtimeEnvironment.supabaseUrl || 'https://xxqtmbptexnusrhitvnk.supabase.co',
  supabaseAnonKey: runtimeEnvironment.supabaseAnonKey || '',
  mapboxToken: runtimeEnvironment.mapboxToken || ''
};
