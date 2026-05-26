import { describe, expect, it } from 'vitest';

import { SETTINGS_ROUTES } from './settings.routes';

describe('SETTINGS_ROUTES', () => {
  it('redirects to v26 when the settings shell is opened', () => {
    const rootRoute = SETTINGS_ROUTES.find((route) => route.path === '');

    expect(rootRoute?.redirectTo).toBe('v26');
  });

  it('defines settings views as lazy component routes', async () => {
    const viewRoutes = SETTINGS_ROUTES.filter((route) => typeof route.loadComponent === 'function');

    expect(viewRoutes.map((route) => route.path)).toEqual(['v26', 'v27', 'v28', 'v29', 'v30', 'v31']);
    await expect(viewRoutes[0].loadComponent?.()).resolves.toBeDefined();
  });

  it('loads a dedicated component for the settings hub', async () => {
    const hubRoute = SETTINGS_ROUTES.find((route) => route.path === 'v26');

    await expect(hubRoute?.loadComponent?.()).resolves.toBeDefined();
  });

  it('loads a dedicated component for font size settings', async () => {
    const fontRoute = SETTINGS_ROUTES.find((route) => route.path === 'v27');

    await expect(fontRoute?.loadComponent?.()).resolves.toBeDefined();
  });
});
