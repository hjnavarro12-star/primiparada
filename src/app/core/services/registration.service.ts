import { Injectable, inject } from '@angular/core';

import { AuthService } from './auth.service';

export interface RegisterPayload {
  email: string;
  password: string;
  programId: string;
}

@Injectable({ providedIn: 'root' })
export class RegistrationService {
  private readonly authService = inject(AuthService);

  async register({ email, password, programId }: RegisterPayload): Promise<void> {
    await this.authService.register(email, password, programId);
  }
}
