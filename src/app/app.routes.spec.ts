import { describe, expect, it } from 'vitest';

import { routes } from './app.routes';

describe('app.routes', () => {
  it('redirects the empty path to the public access shell', () => {
    const rootRoute = routes.find((route) => route.path === '');

    expect(rootRoute?.redirectTo).toBe('access/v1');
    expect(rootRoute?.pathMatch).toBe('full');
  });

  it('lazy-loads the main domain shells', () => {
    const lazyRoutes = routes.filter((route) => route.loadChildren);
    const lazyPaths = lazyRoutes.map((route) => route.path);

    expect(lazyPaths).toEqual(['access', 'alerts', 'campus', 'schedule', 'settings']);
  });

  it('redirects unknown paths to the public access shell', () => {
    const wildcardRoute = routes.find((route) => route.path === '**');

    expect(wildcardRoute?.redirectTo).toBe('access/v1');
  });
});
