import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    await this.auth.initializeSession();

    const user = this.auth.userSnapshot;

    if (!user) {
      await this.router.navigate(['access', 'v2']);
      return false;
    }

    if (user.role !== 'admin') {
      await this.router.navigate(['forbidden']);
      return false;
    }

    return true;
  }
}
