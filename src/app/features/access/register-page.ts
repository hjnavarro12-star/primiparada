import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';

import { ProgramsService } from '../../core/services/programs.service';
import { RegistrationService } from '../../core/services/registration.service';
import { allowedEmailDomainValidator } from '../../shared/utils/email-domain.validator';
import { strongPasswordValidator } from '../../shared/utils/strong-password.validator';
import type { Program } from '../../shared/models/program.model';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, IonContent],
  template: `
    <ion-content class="ion-padding">
      <div class="auth-container">
        <a class="back-link" routerLink="/access/v1">← Volver</a>
        <div class="auth-header">
          <h1>Registro de estudiante</h1>
          <p>Esta vista ya no se usa directamente. El registro
             ocurre automáticamente desde la pantalla de acceso
             cuando el correo no está registrado.</p>
        </div>

        <div class="redirect-note">
          <a routerLink="/access/v2" class="btn-go">
            Ir a Acceso →
          </a>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    ion-content {
      --background: linear-gradient(170deg, #f4f8fb 0%, #a0d0c8 50%, #579fbb 100%);
    }

    .auth-container {
      max-width: 480px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    .back-link {
      display: inline-block;
      margin-bottom: 1.5rem;
      color: #0a709c;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .back-link:hover {
      text-decoration: underline;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .auth-header h1 {
      font-size: 1.75rem;
      font-weight: 700;
      margin: 0 0 0.5rem;
      color: #0a709c;
    }

    .auth-header p {
      margin: 0;
      color: #1a1a2e;
      opacity: 0.8;
      line-height: 1.5;
    }

    .auth-form-list {
      background: transparent;
      margin-bottom: 1.5rem;
    }

    .auth-form-list ion-item {
      --background: rgba(255, 255, 255, 0.85);
      --border-radius: 12px;
      margin-bottom: 0.75rem;
      --border-color: rgba(10, 112, 156, 0.2);
    }

    .field-note {
      display: block;
      padding: 0 1rem 0.5rem;
      font-size: 0.8rem;
    }

    .redirect-note {
      text-align: center;
      margin-top: 2rem;
    }

    .btn-go {
      display: inline-block;
      background: #0a709c;
      color: #fff;
      padding: 0.8rem 2rem;
      border-radius: 12px;
      font-weight: 700;
      text-decoration: none;
      min-height: 48px;
      line-height: 48px;
      padding: 0 2rem;
    }

    @media (min-width: 768px) {
      .auth-container {
        padding-top: 5rem;
      }
    }
  `],
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
    email: ['', [Validators.required, Validators.email, allowedEmailDomainValidator()]],
    password: ['', [Validators.required, strongPasswordValidator()]],
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
      return;
    }

    this.loadingSubmit.set(true);
    try {
      const { email, password, programId } = this.registerForm.getRawValue();
      await this.registrationService.register({ email, password, programId });
      this.successMessage.set('¡Registro completado! Ya puedes iniciar sesión.');
      this.registerForm.reset({ email: '', password: '', programId: '' });
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'No se pudo completar el registro.');
    } finally {
      this.loadingSubmit.set(false);
    }
  }
}
