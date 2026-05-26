import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ProgramsService } from '../../core/services/programs.service';
import { RegistrationService, TEST_ACCOUNT } from '../../core/services/registration.service';
import type { Program } from '../../shared/models/program.model';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="register-shell">
      <div class="register-card">
        <p class="eyebrow">V3 · Acceso</p>
        <h1>Registro de estudiante</h1>
        <p class="description">
          Crea la cuenta inicial con correo, contraseña y programa académico para dejar listo el perfil.
        </p>
        <p class="helper-text">
          Para pruebas, puedes crear la cuenta real <strong>user0</strong> con contraseña <strong>usuario0</strong>.
        </p>

        <p class="screen-reader-only" aria-live="polite">
          {{ loadingPrograms() ? 'Cargando programas académicos.' : 'Programas académicos listos.' }}
        </p>

        <form class="register-form" [formGroup]="registerForm" (ngSubmit)="submit()">
          <label>
            <span>Correo institucional</span>
            <input
              id="register-email"
              type="email"
              formControlName="email"
              placeholder="nombre@correo.com"
              autocomplete="email"
              aria-describedby="register-email-help register-email-error"
              [attr.aria-invalid]="registerForm.controls.email.touched && registerForm.controls.email.invalid"
            />
          </label>
          <p id="register-email-help" class="helper-text">Usa tu correo personal o institucional activo.</p>
          @if (registerForm.controls.email.touched && registerForm.controls.email.invalid) {
            <p id="register-email-error" class="field-error" role="alert">Ingresa un correo válido.</p>
          }

          <label>
            <span>Contraseña</span>
            <input
              id="register-password"
              type="password"
              formControlName="password"
              placeholder="Mínimo 8 caracteres"
              autocomplete="new-password"
              aria-describedby="register-password-help register-password-error"
              [attr.aria-invalid]="registerForm.controls.password.touched && registerForm.controls.password.invalid"
            />
          </label>
          <p id="register-password-help" class="helper-text">Debe tener al menos 8 caracteres para reforzar la seguridad.</p>
          @if (registerForm.controls.password.touched && registerForm.controls.password.invalid) {
            <p id="register-password-error" class="field-error" role="alert">La contraseña debe tener al menos 8 caracteres.</p>
          }

          <label>
            <span>Programa académico</span>
            <select
              id="register-program"
              formControlName="programId"
              [disabled]="loadingPrograms()"
              aria-describedby="register-program-help register-program-error"
              [attr.aria-invalid]="registerForm.controls.programId.touched && registerForm.controls.programId.invalid"
            >
              <option value="">Selecciona un programa</option>
              @for (program of programs(); track program.id) {
                <option [value]="program.id">{{ program.code }} · {{ program.name }}</option>
              }
            </select>
          </label>
          <p id="register-program-help" class="helper-text">
            El catálogo se carga desde Supabase y usa un respaldo local si la red no responde.
          </p>
          @if (loadingPrograms()) {
            <p class="helper-text" role="status">Cargando programas desde Supabase...</p>
          }
          @if (registerForm.controls.programId.touched && registerForm.controls.programId.invalid) {
            <p id="register-program-error" class="field-error" role="alert">Selecciona tu programa académico.</p>
          }

          <div class="actions">
            <button
              type="button"
              class="secondary"
              [disabled]="loadingPrograms() || loadingSubmit()"
              (click)="createTestAccount()"
            >
              Crear usuario0 de pruebas
            </button>
            <button
              type="submit"
              [disabled]="loadingSubmit() || loadingPrograms()"
              [attr.aria-busy]="loadingSubmit()"
            >
              {{ loadingSubmit() ? 'Registrando...' : 'Crear cuenta' }}
            </button>
            <a routerLink="/access/v2" aria-label="Ir al inicio de sesión">Ya tengo cuenta</a>
          </div>
        </form>

        @if (successMessage()) {
          <p class="message success">{{ successMessage() }}</p>
        }

        @if (errorMessage()) {
          <p class="message error">{{ errorMessage() }}</p>
        }
      </div>
    </section>
  `,
  styles: [
    `
      .register-shell {
        min-height: 100%;
        display: grid;
        place-items: center;
        padding: 1.5rem;
      }

      .register-card {
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

      .register-form {
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
      select,
      button {
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        min-height: 48px;
        padding: 0.85rem 1rem;
        font: inherit;
      }

      input,
      select {
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

      .secondary {
        background: rgba(255, 255, 255, 0.08);
        color: inherit;
        border-color: rgba(139, 211, 255, 0.45);
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
        .register-card {
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
export class RegisterPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly programsService = inject(ProgramsService);
  private readonly registrationService = inject(RegistrationService);

  protected readonly loadingPrograms = signal(true);
  protected readonly loadingSubmit = signal(false);
  protected readonly successMessage = signal('');
  protected readonly errorMessage = signal('');
  protected readonly programs = signal<Program[]>([]);

  protected readonly registerForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    programId: ['', [Validators.required]]
  });

  async ngOnInit(): Promise<void> {
    try {
      this.programs.set(await this.programsService.listPrograms());
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'No se pudieron cargar los programas.');
    } finally {
      this.loadingPrograms.set(false);
    }
  }

  protected async submit(): Promise<void> {
    this.successMessage.set('');
    this.errorMessage.set('');

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.errorMessage.set('Completa el correo, la contraseña y el programa académico.');
      return;
    }

    this.loadingSubmit.set(true);

    try {
      const { email, password, programId } = this.registerForm.getRawValue();
      await this.registrationService.register({ email, password, programId });
      this.successMessage.set('Registro completado. Revisa tu correo para confirmar la cuenta si aplica.');
      this.registerForm.reset({ email: '', password: '', programId: '' });
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'No se pudo completar el registro.');
    } finally {
      this.loadingSubmit.set(false);
    }
  }

  protected async createTestAccount(): Promise<void> {
    if (this.loadingPrograms() || this.loadingSubmit()) {
      return;
    }

    const programId = this.registerForm.controls.programId.value || this.programs()[0]?.id;

    if (!programId) {
      this.errorMessage.set('Selecciona un programa para crear la cuenta de pruebas.');
      return;
    }

    this.registerForm.patchValue({
      email: TEST_ACCOUNT.email,
      password: TEST_ACCOUNT.password,
      programId
    });

    await this.submit();
  }
}
