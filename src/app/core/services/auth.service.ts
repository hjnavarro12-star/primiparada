import { Injectable, InjectionToken, inject, signal, computed } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';

/** Injection token to override authMode in tests */
export const AUTH_MODE = new InjectionToken<'local' | 'remote'>('AUTH_MODE', {
  providedIn: 'root',
  factory: () => environment.authMode
});

export type AuthStatus = 'disabled' | 'initializing' | 'signed-out' | 'signed-in' | 'error';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  program_id?: string;
  role?: 'admin' | 'standard';
}

export interface AuthState {
  status: AuthStatus;
  user: AuthUser | null;
  verified: boolean;
  error: string | null;
}

const INITIAL_STATE: AuthState = {
  status: 'initializing',
  user: null,
  verified: false,
  error: null
};

const MOCK_USER: AuthUser = {
  id: 'local-dev-user',
  email: 'dev@primiparada.local',
  program_id: 'prog-mock-001',
  role: 'admin'
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiService = inject(ApiService);
  private readonly authMode = inject(AUTH_MODE);
  private readonly tokenKey = 'primiparada:auth_token';
  private initialized = false;

  // ─── State machine (signals) ─────────────────────────────────────
  private readonly _state = signal<AuthState>(INITIAL_STATE);
  readonly state = this._state.asReadonly();

  readonly status   = computed(() => this._state().status);
  readonly user     = computed(() => this._state().user);
  readonly verified = computed(() => this._state().verified);
  readonly error    = computed(() => this._state().error);
  readonly isSignedIn = computed(() => this._state().status === 'signed-in');

  // BehaviorSubject para compatibilidad con código existente
  private readonly userSubject = new BehaviorSubject<AuthUser | null>(null);
  readonly user$ = this.userSubject.asObservable();

  get userSnapshot(): AuthUser | null {
    return this.userSubject.value;
  }

  private get isLocalMode(): boolean {
    return this.authMode === 'local';
  }

  constructor() {
    const savedToken = localStorage.getItem(this.tokenKey);
    if (savedToken) {
      this.apiService.setToken(savedToken);
    }
  }

  // ─── Initialize session ───────────────────────────────────────────

  async initializeSession(): Promise<AuthUser | null> {
    if (this.initialized) return this.userSnapshot;

    this.patchState({ status: 'initializing' });

    if (this.isLocalMode) {
      const hasSession = localStorage.getItem(this.tokenKey);
      if (hasSession) {
        this.setUser(MOCK_USER, true);
      } else {
        this.patchState({ status: 'signed-out', user: null, verified: false });
        this.userSubject.next(null);
      }
      this.initialized = true;
      return this.userSnapshot;
    }

    // Remote mode — verificar token persistido con /api/auth/me
    const savedToken = localStorage.getItem(this.tokenKey);
    if (!savedToken) {
      this.patchState({ status: 'signed-out', user: null, verified: false });
      this.userSubject.next(null);
      this.initialized = true;
      return null;
    }

    try {
      this.apiService.setToken(savedToken);
      const response = await this.apiService.get<{ user: AuthUser }>('/auth/me');
      const authUser = this.normalizeUser(response.user);
      this.setUser(authUser, false);
    } catch {
      // Token inválido o expirado — limpiar
      this.clearSession();
    }

    this.initialized = true;
    return this.userSnapshot;
  }

  // ─── Login ────────────────────────────────────────────────────────

  async login({ email, password }: LoginPayload): Promise<AuthUser> {
    if (this.isLocalMode) {
      localStorage.setItem(this.tokenKey, 'local-session-active');
      this.setUser(MOCK_USER, true);
      return MOCK_USER;
    }

    const response = await this.apiService.post<{ token: string; user: AuthUser }>(
      '/auth/login',
      { email, password }
    );

    localStorage.setItem(this.tokenKey, response.token);
    this.apiService.setToken(response.token);
    const authUser = this.normalizeUser(response.user);
    this.setUser(authUser, false);
    return authUser;
  }

  // ─── Register ─────────────────────────────────────────────────────

  async register(email: string, password: string, programId?: string): Promise<AuthUser> {
    if (this.isLocalMode) {
      const mockUser: AuthUser = { ...MOCK_USER, email, program_id: programId };
      localStorage.setItem(this.tokenKey, 'local-session-active');
      this.setUser(mockUser, true);
      return mockUser;
    }

    const response = await this.apiService.post<{ token: string; user: AuthUser }>(
      '/auth/register',
      { email, password, programId: programId || null }
    );

    localStorage.setItem(this.tokenKey, response.token);
    this.apiService.setToken(response.token);
    const authUser = this.normalizeUser(response.user);
    this.setUser(authUser, false);
    return authUser;
  }

  // ─── Sign out ─────────────────────────────────────────────────────

  async signOut(): Promise<void> {
    this.clearSession();
  }

  // ─── Helpers ─────────────────────────────────────────────────────

  setVerified(value: boolean): void {
    this.patchState({ verified: value });
  }

  resetInitialization(): void {
    this.initialized = false;
  }

  private normalizeUser(raw: AuthUser): AuthUser {
    return {
      id:         raw.id,
      email:      raw.email,
      program_id: raw.program_id,
      role:       (raw.role as 'admin' | 'standard') || 'standard'
    };
  }

  private setUser(user: AuthUser, autoVerify: boolean): void {
    this.patchState({ status: 'signed-in', user, verified: autoVerify, error: null });
    this.userSubject.next(user);
  }

  private clearSession(): void {
    localStorage.removeItem(this.tokenKey);
    this.apiService.setToken(null);
    this.patchState({ status: 'signed-out', user: null, verified: false, error: null });
    this.userSubject.next(null);
  }

  private patchState(patch: Partial<AuthState>): void {
    this._state.update((current) => ({ ...current, ...patch }));
  }
}
