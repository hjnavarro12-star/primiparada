import { describe, expect, it } from 'vitest';

import { CAMPUS_ROUTES } from './campus.routes';

describe('CAMPUS_ROUTES', () => {
  it('redirects to v7 when the campus shell is opened', () => {
    const rootRoute = CAMPUS_ROUTES.find((route) => route.path === '');

    expect(rootRoute?.redirectTo).toBe('v7');
  });

  it('defines campus views as lazy component routes', async () => {
    const viewRoutes = CAMPUS_ROUTES.filter((route) => typeof route.loadComponent === 'function');

    expect(viewRoutes.map((route) => route.path)).toEqual(['v7', 'v8', 'v9', 'v10', 'v11', 'v12', 'v13', 'v14', 'v15', 'v16', 'v17', 'v18', 'v19', 'v20', 'v25']);
    await expect(viewRoutes[0].loadComponent?.()).resolves.toBeDefined();
  });
});
