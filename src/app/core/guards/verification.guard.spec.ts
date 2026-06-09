import { describe, it, expect, vi } from 'vitest';

import { VerificationGuard } from './verification.guard';

describe('VerificationGuard', () => {
  it('allows navigation when signed-in and verified', async () => {
    const auth = {
      initializeSession: vi.fn(async () => ({ id: 'u1' })),
      status: () => 'signed-in',
      verified: () => true
    } as any;
    const router = { navigate: vi.fn() } as any;

    const guard = new VerificationGuard(auth, router);

    await expect(guard.canActivate()).resolves.toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('blocks when signed-in but not verified', async () => {
    const auth = {
      initializeSession: vi.fn(async () => ({ id: 'u1' })),
      status: () => 'signed-in',
      verified: () => false
    } as any;
    const router = { navigate: vi.fn(async () => true) } as any;

    const guard = new VerificationGuard(auth, router);

    await expect(guard.canActivate()).resolves.toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['access', 'v2']);
  });

  it('blocks when not signed-in', async () => {
    const auth = {
      initializeSession: vi.fn(async () => null),
      status: () => 'signed-out',
      verified: () => false
    } as any;
    const router = { navigate: vi.fn(async () => true) } as any;

    const guard = new VerificationGuard(auth, router);

    await expect(guard.canActivate()).resolves.toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['access', 'v2']);
  });

  it('blocks when status is disabled', async () => {
    const auth = {
      initializeSession: vi.fn(async () => null),
      status: () => 'disabled',
      verified: () => false
    } as any;
    const router = { navigate: vi.fn(async () => true) } as any;

    const guard = new VerificationGuard(auth, router);

    await expect(guard.canActivate()).resolves.toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['access', 'v2']);
  });
});
