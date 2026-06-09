import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ProgramsService } from '../../core/services/programs.service';
import { RegistrationService } from '../../core/services/registration.service';
import type { Program } from '../../shared/models/program.model';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  styleUrls: ['./access-shared.css'],
  template: `
    <section class="auth-shell">
      <div class="auth-card">
        <p class="eyebrow">V3 · Acceso</p>
        <h1>Registro de estudiante</h1>
        <p class="description">
          Crea la cuenta inicial con correo, contraseña y programa académico para dejar listo el perfil.
        </p>

        <p class="screen-reader-only" aria-live="polite">
          {{ loadingPrograms() ? 'Cargando programas académicos.' : 'Programas académicos listos.' }}
        </p>

        <form class="auth-form" [formGroup]="registerForm" (ngSubmit)="submit()">
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
}
