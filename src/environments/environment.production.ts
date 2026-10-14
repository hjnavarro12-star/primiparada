import { runtimeEnvironment } from './environment.generated';

export const environment = {
  production: true,
  authMode: 'remote' as const,
  apiUrl:      runtimeEnvironment.apiUrl      || '',
  mapboxToken: runtimeEnvironment.mapboxToken || ''
};
