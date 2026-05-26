import { describe, it, expect, vi } from 'vitest';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  it('allows navigation when session exists', async () => {
    const auth = { initializeSession: vi.fn(async () => ({ user: { id: 'u1' } })), sessionSnapshot: { user: { id: 'u1' } } } as any;
    const router = { navigate: vi.fn() } as any;

    const guard = new AuthGuard(auth, router);

    await expect(guard.canActivate()).resolves.toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('redirects to login when no session', async () => {
    const auth = { initializeSession: vi.fn(async () => null), sessionSnapshot: null } as any;
    const router = { navigate: vi.fn(async () => true) } as any;

    const guard = new AuthGuard(auth, router);

    await expect(guard.canActivate()).resolves.toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['access', 'v2']);
  });
});
