import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ApiService } from './api.service';

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

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiService = inject(ApiService);
  private readonly userSubject = new BehaviorSubject<AuthUser | null>(null);
  private readonly tokenKey = 'primiparada:auth_token';
  private initialized = false;

  readonly user$ = this.userSubject.asObservable();

  get userSnapshot(): AuthUser | null {
    return this.userSubject.value;
  }

  constructor() {
    const savedToken = localStorage.getItem(this.tokenKey);
    if (savedToken) {
      this.apiService.setToken(savedToken);
    }
  }

  async initializeSession(): Promise<AuthUser | null> {
    if (this.initialized) {
      return this.userSnapshot;
    }

    const savedToken = localStorage.getItem(this.tokenKey);
    if (!savedToken) {
      this.initialized = true;
      return null;
    }

    try {
      this.apiService.setToken(savedToken);
      const { user } = await this.apiService.get<{ user: AuthUser }>('/auth/me');
      this.userSubject.next(user);
    } catch {
      this.clearSession();
    }

    this.initialized = true;
    return this.userSnapshot;
  }

  async login({ email, password }: LoginPayload): Promise<AuthUser> {
    const { token, user } = await this.apiService.post<AuthResponse>('/auth/login', { email, password });

    localStorage.setItem(this.tokenKey, token);
    this.apiService.setToken(token);
    this.userSubject.next(user);
    return user;
  }

  async register(email: string, password: string, programId?: string): Promise<AuthUser> {
    const { token, user } = await this.apiService.post<AuthResponse>('/auth/register', {
      email,
      password,
      programId,
    });

    localStorage.setItem(this.tokenKey, token);
    this.apiService.setToken(token);
    this.userSubject.next(user);
    return user;
  }

  async signOut(): Promise<void> {
    this.clearSession();
  }

  private clearSession(): void {
    localStorage.removeItem(this.tokenKey);
    this.apiService.setToken(null);
    this.userSubject.next(null);
  }
}
