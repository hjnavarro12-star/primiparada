import { describe, expect, it, vi } from 'vitest';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  it('bootstraps the current session and subscribes to auth changes', async () => {
    const onAuthStateChange = vi.fn();
    const clientService = {
      client: {
        auth: {
          getSession: vi.fn(async () => ({ data: { session: { user: { id: 'u1' } } }, error: null })),
          signInWithPassword: vi.fn(),
          signOut: vi.fn(),
          onAuthStateChange
        }
      }
    };

    const service = new AuthService(clientService as never);

    await expect(service.initializeSession()).resolves.toMatchObject({ user: { id: 'u1' } });
    expect(onAuthStateChange).toHaveBeenCalledTimes(1);
    expect(service.sessionSnapshot).toMatchObject({ user: { id: 'u1' } });
  });

  it('logs in with email and password and updates the session snapshot', async () => {
    const clientService = {
      client: {
        auth: {
          getSession: vi.fn(async () => ({ data: { session: null }, error: null })),
          signInWithPassword: vi.fn(async () => ({
            data: { session: { user: { id: 'u2' } } },
            error: null
          })),
          signOut: vi.fn(),
          onAuthStateChange: vi.fn()
        }
      }
    };

    const service = new AuthService(clientService as never);

    await expect(service.login({ email: 'demo@unpa.edu.co', password: 'secret123' })).resolves.toMatchObject({
      user: { id: 'u2' }
    });
    expect(service.sessionSnapshot).toMatchObject({ user: { id: 'u2' } });
  });
});
