import { describe, expect, it } from 'vitest';

import { ACCESS_ROUTES } from './access.routes';

describe('ACCESS_ROUTES', () => {
  it('redirects to v1 when the access shell is opened', () => {
    const rootRoute = ACCESS_ROUTES.find((route) => route.path === '');

    expect(rootRoute?.redirectTo).toBe('v1');
    expect(rootRoute?.pathMatch).toBe('full');
  });

  it('defines access views as lazy component routes', async () => {
    const viewRoutes = ACCESS_ROUTES.filter((route) => typeof route.loadComponent === 'function');

    expect(viewRoutes.map((route) => route.path)).toEqual(['v2', 'v3', 'v1', 'v4']);
    await expect(viewRoutes[0].loadComponent?.()).resolves.toBeDefined();
  });

  it('routes v2 to the dedicated login page', async () => {
    const loginRoute = ACCESS_ROUTES.find((route) => route.path === 'v2');

    await expect(loginRoute?.loadComponent?.()).resolves.toBeDefined();
  });

  it('routes v3 to the dedicated registration page', async () => {
    const registerRoute = ACCESS_ROUTES.find((route) => route.path === 'v3');

    await expect(registerRoute?.loadComponent?.()).resolves.toBeDefined();
  });
});
