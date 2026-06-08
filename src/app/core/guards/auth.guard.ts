import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    // Ensure session is initialized
    await this.auth.initializeSession();

    const user = this.auth.userSnapshot;

    if (user) {
      return true;
    }

    // Redirect to login
    await this.router.navigate(['access', 'v2']);
    return false;
  }
}
