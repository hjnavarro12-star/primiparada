import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import type { Session } from '@supabase/supabase-js';

import { SupabaseClientService } from './supabase-client.service';

export interface LoginPayload {
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly sessionSubject = new BehaviorSubject<Session | null>(null);
  private initialized = false;

  readonly session$ = this.sessionSubject.asObservable();

  constructor(private readonly supabaseClientService: SupabaseClientService) {}

  get sessionSnapshot(): Session | null {
    return this.sessionSubject.value;
  }

  async initializeSession(): Promise<Session | null> {
    if (this.initialized) {
      return this.sessionSnapshot;
    }

    const client = this.supabaseClientService.client;
    const { data } = await client.auth.getSession();

    this.sessionSubject.next(data.session ?? null);
    client.auth.onAuthStateChange((_event, session) => {
      this.sessionSubject.next(session);
    });
    this.initialized = true;

    return this.sessionSnapshot;
  }

  async login({ email, password }: LoginPayload): Promise<Session> {
    const { data, error } = await this.supabaseClientService.client.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw new Error(error.message);
    }

    const session = data.session;

    if (!session) {
      throw new Error('No se recibió la sesión desde Supabase Auth.');
    }

    this.sessionSubject.next(session);
    return session;
  }

  async signOut(): Promise<void> {
    const { error } = await this.supabaseClientService.client.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }

    this.sessionSubject.next(null);
  }
}
