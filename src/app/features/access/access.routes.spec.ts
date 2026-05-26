import { describe, expect, it } from 'vitest';

import { ACCESS_ROUTES } from './access.routes';
import { ExitGuard } from '../../core/guards/exit.guard';

describe('ACCESS_ROUTES', () => {
  it('redirects to v1 when the access shell is opened', () => {
    const rootRoute = ACCESS_ROUTES.find((route) => route.path === '');

    expect(rootRoute?.redirectTo).toBe('v1');
    expect(rootRoute?.pathMatch).toBe('full');
  });

  it('defines access views as lazy component routes', async () => {
    const viewRoutes = ACCESS_ROUTES.filter((route) => typeof route.loadComponent === 'function');

    expect(viewRoutes.map((route) => route.path)).toEqual(['v1', 'v2', 'v3', 'v4', 'v33']);

    // Use v2 for lazy-load assertion to avoid Ionic ESM resolution issues in this environment.
    const loginRoute = viewRoutes.find((route) => route.path === 'v2');
    await expect(loginRoute?.loadComponent?.()).resolves.toBeDefined();
  });

  it('routes v2 to the dedicated login page', async () => {
    const loginRoute = ACCESS_ROUTES.find((route) => route.path === 'v2');

    await expect(loginRoute?.loadComponent?.()).resolves.toBeDefined();
  });

  it('routes v3 to the dedicated registration page', async () => {
    const registerRoute = ACCESS_ROUTES.find((route) => route.path === 'v3');

    await expect(registerRoute?.loadComponent?.()).resolves.toBeDefined();
  });

  it('routes v33 to the dedicated recovery page', async () => {
    const recoveryRoute = ACCESS_ROUTES.find((route) => route.path === 'v33');

    await expect(recoveryRoute?.loadComponent?.()).resolves.toBeDefined();
  });

  it('applies ExitGuard to v1 (public dashboard)', () => {
    const v1Route = ACCESS_ROUTES.find((route) => route.path === 'v1');

    expect(v1Route?.canDeactivate).toContain(ExitGuard);
  });

  it('applies ExitGuard to v4 (private dashboard)', () => {
    const v4Route = ACCESS_ROUTES.find((route) => route.path === 'v4');

    expect(v4Route?.canDeactivate).toContain(ExitGuard);
  });
});
