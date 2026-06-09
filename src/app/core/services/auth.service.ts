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
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
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
  program_id: 'prog-mock-001'
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiService = inject(ApiService);
  private readonly authMode = inject(AUTH_MODE);
  private readonly tokenKey = 'primiparada:auth_token';
  private initialized = false;

  /** Angular Signal holding the full auth state machine */
  private readonly _state = signal<AuthState>(INITIAL_STATE);

  /** Public readable state signal */
  readonly state = this._state.asReadonly();

  /** Computed signals for convenience */
  readonly status = computed(() => this._state().status);
  readonly user = computed(() => this._state().user);
  readonly verified = computed(() => this._state().verified);
  readonly error = computed(() => this._state().error);
  readonly isSignedIn = computed(() => this._state().status === 'signed-in');

  /**
   * Backward-compatible BehaviorSubject for existing code using user$ / userSnapshot.
   * Kept to avoid breaking existing tests and components.
   */
  private readonly userSubject = new BehaviorSubject<AuthUser | null>(null);
  readonly user$ = this.userSubject.asObservable();

  get userSnapshot(): AuthUser | null {
    return this.userSubject.value;
  }

  /** Whether we are in local development mode */
  private get isLocalMode(): boolean {
    return this.authMode === 'local';
  }

  constructor() {
    const savedToken = localStorage.getItem(this.tokenKey);
    if (savedToken) {
      this.apiService.setToken(savedToken);
    }
  }

  /**
   * Initialize the session. In local mode creates a mock user.
   * In remote mode, validates the persisted token against the API.
   */
  async initializeSession(): Promise<AuthUser | null> {
    if (this.initialized) {
      return this.userSnapshot;
    }

    this.patchState({ status: 'initializing' });

    if (this.isLocalMode) {
      this.setUser(MOCK_USER, true);
      this.initialized = true;
      return MOCK_USER;
    }

    // Remote mode
    const savedToken = localStorage.getItem(this.tokenKey);
    if (!savedToken) {
      this.patchState({ status: 'signed-out', user: null, verified: false });
      this.userSubject.next(null);
      this.initialized = true;
      return null;
    }

    try {
      this.apiService.setToken(savedToken);
      const { user } = await this.apiService.get<{ user: AuthUser }>('/auth/me');
      this.setUser(user, false);
    } catch {
      this.clearSession();
    }

    this.initialized = true;
    return this.userSnapshot;
  }

  async login({ email, password }: LoginPayload): Promise<AuthUser> {
    if (this.isLocalMode) {
      this.setUser(MOCK_USER, true);
      return MOCK_USER;
    }

    const { token, user } = await this.apiService.post<AuthResponse>('/auth/login', { email, password });

    localStorage.setItem(this.tokenKey, token);
    this.apiService.setToken(token);
    this.setUser(user, false);
    return user;
  }

  async register(email: string, password: string, programId?: string): Promise<AuthUser> {
    if (this.isLocalMode) {
      const mockUser: AuthUser = { ...MOCK_USER, email, program_id: programId };
      this.setUser(mockUser, true);
      return mockUser;
    }

    const { token, user } = await this.apiService.post<AuthResponse>('/auth/register', {
      email,
      password,
      programId,
    });

    localStorage.setItem(this.tokenKey, token);
    this.apiService.setToken(token);
    this.setUser(user, false);
    return user;
  }

  async signOut(): Promise<void> {
    this.clearSession();
  }

  /** Guard 2 can call this to mark the user as verified */
  setVerified(value: boolean): void {
    this.patchState({ verified: value });
  }

  /** Reset initialization state (useful for testing) */
  resetInitialization(): void {
    this.initialized = false;
  }

  // ─── Private helpers ─────────────────────────────────────────────

  private setUser(user: AuthUser, autoVerify: boolean): void {
    this.patchState({
      status: 'signed-in',
      user,
      verified: autoVerify,
      error: null
    });
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
