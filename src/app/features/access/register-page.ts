import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonList,
  IonNote,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonText
} from '@ionic/angular/standalone';

import { ProgramsService } from '../../core/services/programs.service';
import { RegistrationService } from '../../core/services/registration.service';
import { allowedEmailDomainValidator } from '../../shared/utils/email-domain.validator';
import { strongPasswordValidator } from '../../shared/utils/strong-password.validator';
import type { Program } from '../../shared/models/program.model';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    IonContent,
    IonList,
    IonItem,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonNote,
    IonSpinner,
    IonText
  ],
  template: `
    <ion-content class="ion-padding">
      <div class="auth-container">
        <a class="back-link" routerLink="/access/v1">← Volver</a>
        <div class="auth-header">
          <h1>Registro de estudiante</h1>
          <p>Crea tu cuenta con correo institucional, contraseña y programa académico.</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="submit()">
          <ion-list lines="none" class="auth-form-list">
            <ion-item>
              <ion-input
                type="email"
                formControlName="email"
                label="Correo institucional"
                labelPlacement="floating"
                placeholder="nombre@correo.com"
                autocomplete="email"
              ></ion-input>
            </ion-item>
            @if (registerForm.controls.email.touched && registerForm.controls.email.invalid) {
              @if (registerForm.controls.email.errors?.['invalidDomain']) {
                <ion-note color="danger" class="field-note">Dominio no permitido. Usa: unipacifico.edu.co, gmail.com, hotmail.com, outlook.com o outlook.es</ion-note>
              } @else {
                <ion-note color="danger" class="field-note">Ingresa un correo válido.</ion-note>
              }
            }

            <ion-item>
              <ion-input
                type="password"
                formControlName="password"
                label="Contraseña"
                labelPlacement="floating"
                placeholder="Mínimo 8 caracteres"
                autocomplete="new-password"
              ></ion-input>
            </ion-item>
            @if (registerForm.controls.password.touched && registerForm.controls.password.invalid) {
              @if (registerForm.controls.password.errors?.['weakPassword']) {
                <ion-note color="danger" class="field-note">
                  Requisitos: {{ registerForm.controls.password.errors!['weakPassword'].requirements.join(', ') }}
                </ion-note>
              } @else {
                <ion-note color="danger" class="field-note">La contraseña es obligatoria.</ion-note>
              }
            }

            <ion-item>
              <ion-select
                formControlName="programId"
                label="Programa académico"
                labelPlacement="floating"
                placeholder="Selecciona un programa"
                [disabled]="loadingPrograms()"
              >
                @for (program of programs(); track program.id) {
                  <ion-select-option [value]="program.id">{{ program.code }} · {{ program.name }}</ion-select-option>
                }
              </ion-select>
            </ion-item>
            @if (registerForm.controls.programId.touched && registerForm.controls.programId.invalid) {
              <ion-note color="danger" class="field-note">Selecciona tu programa académico.</ion-note>
            }
          </ion-list>

          <div class="auth-actions">
            <ion-button expand="block" type="submit" [disabled]="loadingSubmit() || loadingPrograms()">
              @if (loadingSubmit()) {
                <ion-spinner name="crescent" slot="start"></ion-spinner>
              }
              {{ loadingSubmit() ? 'Registrando...' : 'Crear cuenta' }}
            </ion-button>

            <ion-button expand="block" fill="clear" routerLink="/access/v2" size="small">
              ¿Ya tienes cuenta? Inicia sesión
            </ion-button>
          </div>
        </form>

        @if (successMessage()) {
          <ion-text color="success">
            <p class="status-message">{{ successMessage() }}</p>
          </ion-text>
        }

        @if (errorMessage()) {
          <ion-text color="danger">
            <p class="status-message">{{ errorMessage() }}</p>
          </ion-text>
        }
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

    .auth-actions {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .auth-actions ion-button[type="submit"] {
      --background: #39b552;
      --color: #ffffff;
      --border-radius: 12px;
      --padding-top: 14px;
      --padding-bottom: 14px;
      font-weight: 700;
      font-size: 1rem;
      min-height: 50px;
    }

    .auth-actions ion-button[fill="clear"] {
      --color: #0a709c;
      font-weight: 500;
    }

    .status-message {
      text-align: center;
      margin-top: 1rem;
      padding: 0.75rem 1rem;
      border-radius: 10px;
      font-weight: 600;
    }

    ion-text[color="success"] .status-message {
      background: rgba(255, 255, 255, 0.9);
      color: #0a709c;
    }

    ion-text[color="danger"] .status-message {
      background: rgba(255, 255, 255, 0.9);
      color: #d32f2f;
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
