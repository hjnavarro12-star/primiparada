import { Injectable } from '@angular/core';

import { SupabaseClientService } from './supabase-client.service';

export interface RegisterPayload {
  email: string;
  password: string;
  programId: string;
}

@Injectable({ providedIn: 'root' })
export class RegistrationService {
  constructor(private readonly supabaseClientService: SupabaseClientService) {}

  async register({ email, password, programId }: RegisterPayload): Promise<void> {
    const client = this.supabaseClientService.client;

    const { data: signUpData, error: signUpError } = await client.auth.signUp({
      email,
      password,
      options: {
        data: { program_id: programId }
      }
    });

    if (signUpError) {
      throw new Error(signUpError.message);
    }

    const userId = signUpData.user?.id;

    if (!userId) {
      throw new Error('No se recibió el usuario creado por Supabase Auth.');
    }

    const { error: profileError } = await client.from('users').upsert(
      {
        id: userId,
        email,
        program_id: programId
      },
      { onConflict: 'id' }
    );

    if (profileError) {
      throw new Error(profileError.message);
    }
  }
}
