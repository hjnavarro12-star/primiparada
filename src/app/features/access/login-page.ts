import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="login-shell">
      <div class="login-card">
        <p class="eyebrow">V2 · Acceso</p>
        <h1>Iniciar sesión</h1>
        <p class="description">
          Entra con tu correo institucional. Si ya existe una sesión guardada, te enviaremos directo al dashboard privado.
        </p>

        <p class="screen-reader-only" aria-live="polite">{{ statusMessage() }}</p>

        <form class="login-form" [formGroup]="loginForm" (ngSubmit)="submit()">
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
            <a routerLink="/access/v3" aria-label="Ir al registro">Crear cuenta</a>
          </div>
        </form>

        @if (errorMessage()) {
          <p class="message error" role="alert">{{ errorMessage() }}</p>
        }
      </div>
    </section>
  `,
  styles: [
    `
      .login-shell {
        min-height: 100%;
        display: grid;
        place-items: center;
        padding: 1.5rem;
      }

      .login-card {
        width: min(100%, 720px);
        border-radius: 24px;
        padding: 2rem;
        background: linear-gradient(180deg, rgba(12, 16, 31, 0.95), rgba(8, 12, 22, 0.98));
        color: #f7fbff;
        box-shadow: 0 24px 70px rgba(0, 0, 0, 0.35);
        border: 1px solid rgba(255, 255, 255, 0.08);
      }

      .eyebrow {
        margin: 0 0 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.14em;
        color: #8bd3ff;
        font-size: 0.75rem;
      }

      h1 {
        margin: 0;
        font-size: clamp(2rem, 4vw, 3rem);
      }

      .description,
      .helper-text,
      .message,
      .field-error {
        margin: 0.85rem 0 0;
        line-height: 1.5;
      }

      .login-form {
        display: grid;
        gap: 1rem;
        margin-top: 1.5rem;
      }

      label {
        display: grid;
        gap: 0.5rem;
      }

      label span {
        font-weight: 600;
      }

      input,
      button {
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        min-height: 48px;
        padding: 0.85rem 1rem;
        font: inherit;
      }

      input {
        background: rgba(255, 255, 255, 0.06);
        color: inherit;
      }

      input::placeholder {
        color: rgba(247, 251, 255, 0.55);
      }

      button {
        background: linear-gradient(135deg, #4ecdc4, #5fb2ff);
        color: #08111e;
        font-weight: 700;
        cursor: pointer;
      }

      button:disabled {
        cursor: progress;
        opacity: 0.75;
      }

      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        align-items: center;
      }

      .actions a {
        color: #8bd3ff;
        text-decoration: none;
      }

      .field-error,
      .message.error {
        color: #ffb4b4;
      }

      .screen-reader-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }

      @media (max-width: 640px) {
        .login-card {
          padding: 1.25rem;
        }

        .actions {
          flex-direction: column;
          align-items: stretch;
        }
      }
    `
  ],
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
