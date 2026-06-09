import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonNote,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';

import { ProgramsService } from '../../core/services/programs.service';
import { RegistrationService } from '../../core/services/registration.service';
import type { Program } from '../../shared/models/program.model';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
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
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/access/v1"></ion-back-button>
        </ion-buttons>
        <ion-title>Registro</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="auth-container">
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
              <ion-note color="danger" class="field-note">Ingresa un correo válido.</ion-note>
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
              <ion-note color="danger" class="field-note">La contraseña debe tener al menos 8 caracteres.</ion-note>
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
    .auth-container {
      max-width: 480px;
      margin: 0 auto;
      padding: 2rem 0;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .auth-header h1 {
      font-size: 1.75rem;
      font-weight: 700;
      margin: 0 0 0.5rem;
    }

    .auth-header p {
      margin: 0;
      opacity: 0.8;
      line-height: 1.5;
    }

    .auth-form-list {
      background: transparent;
      margin-bottom: 1.5rem;
    }

    .auth-form-list ion-item {
      --background: var(--ion-card-background);
      --border-radius: 12px;
      margin-bottom: 0.75rem;
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

    .status-message {
      text-align: center;
      margin-top: 1rem;
    }

    @media (min-width: 768px) {
      .auth-container {
        padding-top: 4rem;
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
      return;
    }

    this.loadingSubmit.set(true);
    try {
      const { email, password, programId } = this.registerForm.getRawValue();
      await this.registrationService.register({ email, password, programId });
      this.successMessage.set('Registro completado. Revisa tu correo para confirmar la cuenta.');
      this.registerForm.reset({ email: '', password: '', programId: '' });
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'No se pudo completar el registro.');
    } finally {
      this.loadingSubmit.set(false);
    }
  }
}
