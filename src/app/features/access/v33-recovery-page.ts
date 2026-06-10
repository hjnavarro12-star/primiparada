import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonList,
  IonNote,
  IonSpinner,
  IonText
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-v33-recovery-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    IonContent,
    IonList,
    IonItem,
    IonInput,
    IonButton,
    IonNote,
    IonSpinner,
    IonText
  ],
  template: `
    <ion-content class="ion-padding">
      <div class="auth-container">
        <a class="back-link" routerLink="/access/v2">← Volver</a>
        <div class="auth-header">
          <h1>Recuperar contraseña</h1>
          <p>Escribe tu correo institucional y te enviaremos un enlace para restablecer el acceso.</p>
        </div>

        <form [formGroup]="recoveryForm" (ngSubmit)="submit()">
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
            @if (recoveryForm.controls.email.touched && recoveryForm.controls.email.invalid) {
              <ion-note color="danger" class="field-note">Ingresa un correo válido.</ion-note>
            }
          </ion-list>

          <div class="auth-actions">
            <ion-button expand="block" type="submit" [disabled]="sending()">
              @if (sending()) {
                <ion-spinner name="crescent" slot="start"></ion-spinner>
              }
              {{ sending() ? 'Enviando...' : 'Enviar enlace' }}
            </ion-button>

            <ion-button expand="block" fill="clear" routerLink="/access/v2" size="small">
              Volver al inicio de sesión
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

    .back-link {
      display: inline-block;
      margin-bottom: 1.5rem;
      color: var(--ion-color-primary, #0a709c);
      text-decoration: none;
      font-weight: 500;
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
export class V33RecoveryPage {
  private readonly fb = inject(FormBuilder);

  protected readonly sending = signal(false);
  protected readonly successMessage = signal('');
  protected readonly errorMessage = signal('');

  protected readonly recoveryForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]]
  });

  protected async submit(): Promise<void> {
    this.successMessage.set('');
    this.errorMessage.set('');

    if (this.recoveryForm.invalid) {
      this.recoveryForm.markAllAsTouched();
      return;
    }

    this.sending.set(true);
    try {
      const { email } = this.recoveryForm.getRawValue();

      // TODO: Connect to actual password reset service
      await new Promise<void>((resolve) => setTimeout(resolve, 350));

      this.successMessage.set(`Se envió un enlace de recuperación a ${email}. Revisa tu bandeja de entrada.`);
      this.recoveryForm.reset({ email: '' });
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'No se pudo enviar el enlace.');
    } finally {
      this.sending.set(false);
    }
  }
}
