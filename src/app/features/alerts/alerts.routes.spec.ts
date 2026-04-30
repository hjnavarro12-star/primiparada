import { describe, expect, it } from 'vitest';

import { ALERTS_ROUTES } from './alerts.routes';

describe('ALERTS_ROUTES', () => {
  it('redirects to v5 when the alerts shell is opened', () => {
    const rootRoute = ALERTS_ROUTES.find((route) => route.path === '');

    expect(rootRoute?.redirectTo).toBe('v5');
  });

  it('defines alert views as lazy component routes', async () => {
    const viewRoutes = ALERTS_ROUTES.filter((route) => typeof route.loadComponent === 'function');

    expect(viewRoutes.map((route) => route.path)).toEqual(['v5', 'v6']);
    await expect(viewRoutes[0].loadComponent?.()).resolves.toBeDefined();
  });
});
