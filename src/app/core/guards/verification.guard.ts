import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

/**
 * Guard 2: Verifies the user is both signed-in AND has the verified flag set.
 * In local mode, the mock user is auto-verified so this always passes.
 */
@Injectable({ providedIn: 'root' })
export class VerificationGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    // Ensure session is initialized first
    await this.auth.initializeSession();

    const status = this.auth.status();

    if (status === 'disabled' || status === 'error') {
      await this.router.navigate(['access', 'v2']);
      return false;
    }

    if (status !== 'signed-in') {
      await this.router.navigate(['access', 'v2']);
      return false;
    }

    if (!this.auth.verified()) {
      await this.router.navigate(['access', 'v2']);
      return false;
    }

    return true;
  }
}
