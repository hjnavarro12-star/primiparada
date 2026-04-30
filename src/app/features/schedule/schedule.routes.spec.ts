import { describe, expect, it } from 'vitest';

import { SCHEDULE_ROUTES } from './schedule.routes';

describe('SCHEDULE_ROUTES', () => {
  it('redirects to v21 when the schedule shell is opened', () => {
    const rootRoute = SCHEDULE_ROUTES.find((route) => route.path === '');

    expect(rootRoute?.redirectTo).toBe('v21');
  });

  it('defines schedule views as lazy component routes', async () => {
    const viewRoutes = SCHEDULE_ROUTES.filter((route) => typeof route.loadComponent === 'function');

    expect(viewRoutes.map((route) => route.path)).toEqual(['v21', 'v22', 'v23', 'v24']);
    await expect(viewRoutes[0].loadComponent?.()).resolves.toBeDefined();
  });
});
