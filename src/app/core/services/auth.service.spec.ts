import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';

import { AuthService, AUTH_MODE } from './auth.service';
import { ApiService } from './api.service';

function makeApiMock(overrides: Partial<Pick<ApiService, 'get' | 'post' | 'setToken'>> = {}) {
  return {
    get: vi.fn(async () => ({ user: { id: 'u1', email: 'a@b.com' } })),
    post: vi.fn(async () => ({ token: 'tok-1', user: { id: 'u1', email: 'a@b.com' } })),
    setToken: vi.fn(),
    ...overrides
  };
}

describe('AuthService', () => {
  it('bootstraps the current session and exposes the user', async () => {
    const apiMock = makeApiMock({
      get: vi.fn(async () => ({ user: { id: 'u1', email: 'a@b.com' } })),
      setToken: vi.fn()
    });

    await TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: AUTH_MODE, useValue: 'remote' },
        { provide: ApiService, useValue: apiMock }
      ]
    }).compileComponents();

    localStorage.setItem('primiparada:auth_token', 'saved-token');
    const service = TestBed.inject(AuthService);

    const result = await service.initializeSession();
    expect(result).toEqual({ id: 'u1', email: 'a@b.com' });
    expect(service.userSnapshot).toEqual({ id: 'u1', email: 'a@b.com' });
    expect(apiMock.setToken).toHaveBeenCalledWith('saved-token');

    localStorage.removeItem('primiparada:auth_token');
    TestBed.resetTestingModule();
  });

  it('logs in with email and password and updates the user snapshot', async () => {
    const apiMock = makeApiMock({
      post: vi.fn(async () => ({ token: 'tok-2', user: { id: 'u2', email: 'c@d.com' } })),
      setToken: vi.fn()
    });

    await TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: AUTH_MODE, useValue: 'remote' },
        { provide: ApiService, useValue: apiMock }
      ]
    }).compileComponents();

    const service = TestBed.inject(AuthService);

    await expect(service.login({ email: 'demo@unpa.edu.co', password: 'secret123' })).resolves.toEqual({
      id: 'u2',
      email: 'c@d.com'
    });
    expect(service.userSnapshot).toEqual({ id: 'u2', email: 'c@d.com' });
    expect(apiMock.setToken).toHaveBeenCalledWith('tok-2');

    TestBed.resetTestingModule();
  });

  it('in local mode creates a mock user without calling API', async () => {
    const apiMock = makeApiMock();

    await TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: AUTH_MODE, useValue: 'local' },
        { provide: ApiService, useValue: apiMock }
      ]
    }).compileComponents();

    const service = TestBed.inject(AuthService);

    const result = await service.initializeSession();
    expect(result).toBeTruthy();
    expect(result!.id).toBe('local-dev-user');
    expect(result!.email).toBe('dev@primiparada.local');
    expect(service.status()).toBe('signed-in');
    expect(service.verified()).toBe(true);
    // API should NOT have been called
    expect(apiMock.get).not.toHaveBeenCalled();

    TestBed.resetTestingModule();
  });

  it('signOut clears state and user snapshot', async () => {
    const apiMock = makeApiMock({
      post: vi.fn(async () => ({ token: 'tok-3', user: { id: 'u3', email: 'e@f.com' } })),
      setToken: vi.fn()
    });

    await TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: AUTH_MODE, useValue: 'remote' },
        { provide: ApiService, useValue: apiMock }
      ]
    }).compileComponents();

    const service = TestBed.inject(AuthService);
    await service.login({ email: 'test@test.com', password: 'pass1234' });
    expect(service.userSnapshot).toBeTruthy();

    await service.signOut();
    expect(service.userSnapshot).toBeNull();
    expect(service.status()).toBe('signed-out');

    TestBed.resetTestingModule();
  });
});
