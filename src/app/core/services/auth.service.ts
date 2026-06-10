import { Injectable, InjectionToken, inject, signal, computed } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ApiService } from './api.service';
import { SupabaseClientService } from './supabase-client.service';
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
  private readonly supabaseClient = inject(SupabaseClientService);
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

  /** Supabase client shortcut */
  private get supabase() {
    return this.supabaseClient.client;
  }

  constructor() {
    const savedToken = localStorage.getItem(this.tokenKey);
    if (savedToken) {
      this.apiService.setToken(savedToken);
    }
  }

  /**
   * Initialize the session.
   * In local mode: checks for a local session flag.
   * In remote mode: uses Supabase Auth getSession() to restore persisted session.
   */
  async initializeSession(): Promise<AuthUser | null> {
    if (this.initialized) {
      return this.userSnapshot;
    }

    this.patchState({ status: 'initializing' });

    if (this.isLocalMode) {
      const hasLocalSession = localStorage.getItem(this.tokenKey);
      if (hasLocalSession) {
        this.setUser(MOCK_USER, true);
      } else {
        this.patchState({ status: 'signed-out', user: null, verified: false });
        this.userSubject.next(null);
      }
      this.initialized = true;
      return this.userSnapshot;
    }

    // Remote mode — use Supabase Auth
    try {
      const { data, error } = await this.supabase.auth.getSession();

      if (error) {
        this.patchState({ status: 'signed-out', user: null, verified: false });
        this.userSubject.next(null);
        this.initialized = true;
        return null;
      }

      if (data.session?.user) {
        const supaUser = data.session.user;
        const authUser: AuthUser = {
          id: supaUser.id,
          email: supaUser.email ?? '',
          program_id: supaUser.user_metadata?.['program_id'] as string | undefined
        };
        this.setUser(authUser, false);
      } else {
        this.patchState({ status: 'signed-out', user: null, verified: false });
        this.userSubject.next(null);
      }
    } catch {
      this.patchState({ status: 'signed-out', user: null, verified: false });
      this.userSubject.next(null);
    }

    this.initialized = true;
    return this.userSnapshot;
  }

  async login({ email, password }: LoginPayload): Promise<AuthUser> {
    if (this.isLocalMode) {
      localStorage.setItem(this.tokenKey, 'local-session-active');
      this.setUser(MOCK_USER, true);
      return MOCK_USER;
    }

    // Remote mode — Supabase Auth
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });

    if (error) {
      throw new Error(this.translateSupabaseError(error.message));
    }

    const supaUser = data.user;
    const authUser: AuthUser = {
      id: supaUser.id,
      email: supaUser.email ?? '',
      program_id: supaUser.user_metadata?.['program_id'] as string | undefined
    };

    this.setUser(authUser, false);
    return authUser;
  }

  async register(email: string, password: string, programId?: string): Promise<AuthUser> {
    if (this.isLocalMode) {
      const mockUser: AuthUser = { ...MOCK_USER, email, program_id: programId };
      localStorage.setItem(this.tokenKey, 'local-session-active');
      this.setUser(mockUser, true);
      return mockUser;
    }

    // Remote mode — Supabase Auth
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: { data: { program_id: programId } }
    });

    if (error) {
      throw new Error(this.translateSupabaseError(error.message));
    }

    if (!data.user) {
      throw new Error('No se pudo crear la cuenta. Intenta de nuevo.');
    }

    const supaUser = data.user;
    const authUser: AuthUser = {
      id: supaUser.id,
      email: supaUser.email ?? '',
      program_id: programId
    };

    this.setUser(authUser, false);
    return authUser;
  }

  async signOut(): Promise<void> {
    if (this.isLocalMode) {
      this.clearSession();
      return;
    }

    // Remote mode
    await this.supabase.auth.signOut();
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

  /**
   * Translate common Supabase Auth error messages to user-friendly Spanish.
   */
  private translateSupabaseError(message: string): string {
    const lower = message.toLowerCase();

    if (lower.includes('invalid login credentials')) {
      return 'Correo o contraseña incorrectos.';
    }
    if (lower.includes('email not confirmed')) {
      return 'Debes confirmar tu correo electrónico antes de iniciar sesión.';
    }
    if (lower.includes('user already registered')) {
      return 'Ya existe una cuenta con este correo electrónico.';
    }
    if (lower.includes('signup is disabled')) {
      return 'El registro de nuevos usuarios está deshabilitado temporalmente.';
    }
    if (lower.includes('password should be at least')) {
      return 'La contraseña no cumple los requisitos mínimos de seguridad.';
    }
    if (lower.includes('rate limit')) {
      return 'Demasiados intentos. Espera 1 minuto antes de intentar de nuevo.';
    }

    return `Error de autenticación: ${message}`;
  }
}
