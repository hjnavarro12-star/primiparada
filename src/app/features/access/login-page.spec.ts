import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { vi } from 'vitest';

import { AuthService } from '../../core/services/auth.service';
import { LoginPage } from './login-page';

describe('LoginPage', () => {
  const authService = {
    initializeSession: vi.fn(async () => null),
    login: vi.fn(async () => ({ user: { id: 'u1' } }))
  };

  const router = {
    navigate: vi.fn(async () => true)
  };

  beforeEach(async () => {
    TestBed.overrideComponent(LoginPage, {
      set: {
        template: '<section class="test-shell"></section>',
        styles: []
      }
    });

    authService.initializeSession.mockClear();
    authService.login.mockClear();
    router.navigate.mockClear();

    await TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();
  });

  it('boots the current session state on init', async () => {
    const fixture = TestBed.createComponent(LoginPage);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(authService.initializeSession).toHaveBeenCalledTimes(1);
    expect(fixture.componentInstance.statusMessage()).toContain('No hay sesión activa');
  });

  it('redirects to the private dashboard when a session already exists', async () => {
    authService.initializeSession.mockResolvedValueOnce({ user: { id: 'u1' } });

    const fixture = TestBed.createComponent(LoginPage);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(router.navigate).toHaveBeenCalledWith(['/access/v4']);
    expect(fixture.componentInstance.statusMessage()).toContain('Sesión persistente detectada');
  });

  it('submits valid credentials and redirects to the dashboard', async () => {
    const fixture = TestBed.createComponent(LoginPage);
    fixture.detectChanges();
    await fixture.whenStable();

    fixture.componentInstance.loginForm.setValue({
      email: 'demo@unpa.edu.co',
      password: 'secret123'
    });

    await fixture.componentInstance.submit();

    expect(authService.login).toHaveBeenCalledWith({
      email: 'demo@unpa.edu.co',
      password: 'secret123'
    });
    expect(router.navigate).toHaveBeenCalledWith(['/access/v4']);
  });
});
