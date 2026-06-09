import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    // Ensure session is initialized
    await this.auth.initializeSession();

    const status = this.auth.status();

    // Block access if the auth system is disabled or in error state
    if (status === 'disabled' || status === 'error') {
      await this.router.navigate(['access', 'v1']);
      return false;
    }

    const user = this.auth.userSnapshot;

    if (user) {
      return true;
    }

    // Redirect to public dashboard
    await this.router.navigate(['access', 'v1']);
    return false;
  }
}
