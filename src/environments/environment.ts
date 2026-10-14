import { runtimeEnvironment } from './environment.generated';

export const environment = {
  production: false,
  authMode: 'remote' as const,
  apiUrl:      runtimeEnvironment.apiUrl      || 'http://localhost:8084/api',
  mapboxToken: runtimeEnvironment.mapboxToken || ''
};
