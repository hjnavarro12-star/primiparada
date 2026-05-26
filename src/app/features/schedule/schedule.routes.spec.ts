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
    expect(viewRoutes.filter(r => r.path === 'v22').length).toBe(1);
    expect(viewRoutes.filter(r => r.path === 'v23').length).toBe(1);
    await expect(viewRoutes[0].loadComponent?.()).resolves.toBeDefined();
  });

  it('routes v21 to the dedicated manual entry page', async () => {
    const manualRoute = SCHEDULE_ROUTES.find((route) => route.path === 'v21');

    await expect(manualRoute?.loadComponent?.()).resolves.toBeDefined();
  });

  it('routes v24 to the dedicated schedule manager', async () => {
    const scheduleManagerRoute = SCHEDULE_ROUTES.find((route) => route.path === 'v24');

    await expect(scheduleManagerRoute?.loadComponent?.()).resolves.toBeDefined();
  });
});
