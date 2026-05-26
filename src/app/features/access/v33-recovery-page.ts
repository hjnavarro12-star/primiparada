import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-v33-recovery-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="recovery-shell">
      <div class="recovery-card">
        <p class="eyebrow">V33 · Acceso</p>
        <h1>Recuperar contraseña</h1>
        <p class="description">
          Escribe tu correo institucional y te enviaremos un enlace para restablecer el acceso a tu cuenta.
        </p>

        <p class="screen-reader-only" aria-live="polite">{{ statusMessage() }}</p>

        <form class="recovery-form" [formGroup]="recoveryForm" (ngSubmit)="submit()">
          <label>
            <span>Correo institucional</span>
            <input
              id="recovery-email"
              type="email"
              formControlName="email"
              placeholder="tu@unpa.edu.ar"
              autocomplete="email"
              aria-describedby="recovery-email-help recovery-email-error"
              [attr.aria-invalid]="recoveryForm.controls.email.touched && recoveryForm.controls.email.invalid"
            />
          </label>
          <p id="recovery-email-help" class="helper-text">Usa el correo con el que registraste tu cuenta.</p>
          @if (recoveryForm.controls.email.touched && recoveryForm.controls.email.invalid) {
            <p id="recovery-email-error" class="field-error" role="alert">Ingresa un correo válido.</p>
          }

          <div class="actions">
            <button type="submit" [disabled]="sending()" [attr.aria-busy]="sending()">
              {{ sending() ? 'Enviando...' : 'Enviar enlace' }}
            </button>
            <a routerLink="/access/v2" aria-label="Volver al inicio de sesión">Volver al inicio de sesión</a>
          </div>
        </form>

        @if (errorMessage()) {
          <p class="message error" role="alert">{{ errorMessage() }}</p>
        }

        @if (successMessage()) {
          <p class="message success" role="status">{{ successMessage() }}</p>
        }
      </div>
    </section>
  `,
  styles: [
    `
      .recovery-shell {
        min-height: 100%;
        display: grid;
        place-items: center;
        padding: 1.5rem;
      }

      .recovery-card {
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

      .recovery-form {
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
        background: linear-gradient(135deg, #8bd3ff, #4ecdc4);
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

      .message.success {
        color: #90f7cf;
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
        .recovery-card {
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
export class V33RecoveryPage {
  private readonly fb = inject(FormBuilder);

  protected readonly sending = signal(false);
  protected readonly statusMessage = signal('');
  protected readonly successMessage = signal('');
  protected readonly errorMessage = signal('');

  protected readonly recoveryForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]]
  });

  protected submit(): void {
    this.successMessage.set('');
    this.errorMessage.set('');

    if (this.recoveryForm.invalid) {
      this.recoveryForm.markAllAsTouched();
      this.errorMessage.set('Ingresa un correo institucional válido para continuar.');
      return;
    }

    this.sending.set(true);

    const { email } = this.recoveryForm.getRawValue();
    this.statusMessage.set(`Enviando enlace de recuperación a ${email}.`);
    this.successMessage.set(`Se envió un enlace de recuperación a ${email}. Revisa tu bandeja de entrada.`);
    this.recoveryForm.reset({ email: '' });
    this.sending.set(false);
  }
}