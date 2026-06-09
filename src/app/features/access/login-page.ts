import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  styleUrls: ['./access-shared.css'],
  template: `
    <section class="auth-shell">
      <div class="auth-card">
        <p class="eyebrow">V2 · Acceso</p>
        <h1>Iniciar sesión</h1>
        <p class="description">
          Entra con tu correo institucional. Si ya existe una sesión guardada, te enviaremos directo al dashboard privado.
        </p>

        <p class="screen-reader-only" aria-live="polite">{{ statusMessage() }}</p>

        <form class="auth-form" [formGroup]="loginForm" (ngSubmit)="submit()">
          <label>
            <span>Correo institucional</span>
            <input
              id="login-email"
              type="email"
              formControlName="email"
              placeholder="nombre@correo.com"
              autocomplete="email"
              aria-describedby="login-email-help login-email-error"
              [attr.aria-invalid]="loginForm.controls.email.touched && loginForm.controls.email.invalid"
            />
          </label>
          <p id="login-email-help" class="helper-text">Usa el mismo correo con el que te registraste.</p>
          @if (loginForm.controls.email.touched && loginForm.controls.email.invalid) {
            <p id="login-email-error" class="field-error" role="alert">Ingresa un correo válido.</p>
          }

          <label>
            <span>Contraseña</span>
            <input
              id="login-password"
              type="password"
              formControlName="password"
              placeholder="Tu contraseña"
              autocomplete="current-password"
              aria-describedby="login-password-help login-password-error"
              [attr.aria-invalid]="loginForm.controls.password.touched && loginForm.controls.password.invalid"
            />
          </label>
          <p id="login-password-help" class="helper-text">La sesión se mantendrá persistente en este dispositivo.</p>
          @if (loginForm.controls.password.touched && loginForm.controls.password.invalid) {
            <p id="login-password-error" class="field-error" role="alert">La contraseña es obligatoria.</p>
          }

          <div class="actions">
            <button
              type="submit"
              [disabled]="loadingSubmit() || loadingSession()"
              [attr.aria-busy]="loadingSubmit()"
            >
              {{ loadingSubmit() ? 'Ingresando...' : 'Entrar' }}
            </button>
            <a routerLink="/access/v33" aria-label="Recuperar contraseña">¿Olvidó su contraseña?</a>
            <a routerLink="/access/v3" aria-label="Ir al registro">Crear cuenta</a>
          </div>
        </form>

        @if (errorMessage()) {
          <p class="message error" role="alert">{{ errorMessage() }}</p>
        }
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly loadingSession = signal(true);
  protected readonly loadingSubmit = signal(false);
  protected readonly statusMessage = signal('Verificando sesión persistente.');
  protected readonly errorMessage = signal('');

  protected readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  async ngOnInit(): Promise<void> {
    try {
      const session = await this.authService.initializeSession();

      if (session) {
        this.statusMessage.set('Sesión persistente detectada. Redirigiendo al dashboard privado.');
        await this.router.navigate(['/access/v4']);
        return;
      }

      this.statusMessage.set('No hay sesión activa. Puedes ingresar con tu correo y contraseña.');
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'No se pudo verificar la sesión.');
      this.statusMessage.set('');
    } finally {
      this.loadingSession.set(false);
    }
  }

  protected async submit(): Promise<void> {
    this.errorMessage.set('');

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.errorMessage.set('Completa correo y contraseña para ingresar.');
      return;
    }

    this.loadingSubmit.set(true);

    try {
      const { email, password } = this.loginForm.getRawValue();
      await this.authService.login({ email, password });
      this.statusMessage.set('Sesión iniciada. Redirigiendo al dashboard privado.');
      await this.router.navigate(['/access/v4']);
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'No se pudo iniciar sesión.');
    } finally {
      this.loadingSubmit.set(false);
    }
  }
}
